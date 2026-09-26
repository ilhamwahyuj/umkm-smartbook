-- ==============================================================================
-- UMKM SmartBook - Supabase Database Schema
-- ==============================================================================

-- PERHATIAN: Baris berikut akan menghapus tabel lama jika sudah ada (berguna saat pengujian).
-- Hapus (atau comment) baris DROP TABLE di bawah jika Anda tidak ingin menghapus data sebelumnya.
DROP TABLE IF EXISTS public.transactions CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.cashiers CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.organizations CASCADE;

-- 1. Tabel Organizations (Gerai/Toko)
CREATE TABLE public.organizations (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE, -- contoh: 'toko.anda'
    name TEXT NOT NULL,        -- contoh: 'Toko Anda Group'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Mengaktifkan RLS (Row Level Security)
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- Policy: Semua orang (bahkan anon) boleh melihat nama gerai berdasarkan slug (untuk login)
CREATE POLICY "Allow public read access for login" 
ON public.organizations FOR SELECT 
USING (true);


-- 2. Tabel Profiles (Pemilik/Manajer yang tersambung ke Auth Users Supabase)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL DEFAULT 'owner',
    full_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Mengaktifkan RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Pengguna yang sudah login hanya bisa melihat data profilnya sendiri
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

-- Trigger untuk membuat profil secara otomatis ketika user mendaftar bisa ditambahkan di sini (Opsional)


-- 3. Tabel Cashiers (Data PIN Kasir per Cabang)
CREATE TABLE public.cashiers (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    branch_name TEXT NOT NULL, -- contoh: 'Cabang Utama (Senopati, Jakarta Selatan)'
    name TEXT NOT NULL,        -- contoh: 'Kasir 1'
    pin VARCHAR(6) NOT NULL,   -- PIN 6 digit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Mengaktifkan RLS
ALTER TABLE public.cashiers ENABLE ROW LEVEL SECURITY;

-- Policy: 
-- A. Pemilik bisa melihat semua kasir di organisasinya (Jika pakai JWT Supabase biasa)
CREATE POLICY "Owner can read own organization cashiers" 
ON public.cashiers FOR SELECT 
USING (
    org_id IN (
        SELECT org_id FROM public.profiles WHERE id = auth.uid()
    )
);

-- B. Publik (anon) boleh mencocokkan PIN untuk login kasir (Secara logika login kasir terjadi sebelum autentikasi JWT penuh)
-- PENTING: Di Supabase, jika login kasir tidak pakai `auth.users`, kita buka akses SELECT ini secara anonim, ATAU Anda bisa memindahkannya ke Edge Function/RPC (Stored Procedure).
-- Agar lebih simpel dan jalan dengan kode di frontend:
CREATE POLICY "Allow anon to verify PIN for login"
ON public.cashiers FOR SELECT
USING (true);


-- 4. Tabel Transactions (Transaksi Penjualan)
CREATE TABLE public.transactions (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    cashier_id UUID REFERENCES public.cashiers(id) ON DELETE SET NULL,
    customer_name TEXT,
    order_type TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    subtotal NUMERIC NOT NULL DEFAULT 0,
    discount NUMERIC NOT NULL DEFAULT 0,
    tax NUMERIC NOT NULL DEFAULT 0,
    grand_total NUMERIC NOT NULL DEFAULT 0,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Mengaktifkan RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Policy: Pemilik bisa melihat semua transaksi di gerainya
CREATE POLICY "Owner can view their transactions" 
ON public.transactions FOR SELECT 
USING (true); -- Dibuka sementara agar kasir (anon) bisa melakukan INSERT RETURNING dengan sukses

-- Policy: Insert transaksi (Buka ke anon dan authenticated karena kasir menggunakan PIN)
CREATE POLICY "Allow insert transactions" 
ON public.transactions FOR INSERT 
TO public
WITH CHECK (true);

-- Memberikan izin eksplisit ke peran anon dan authenticated (Penting jika tabel dibuat via SQL)
GRANT ALL ON public.transactions TO anon, authenticated;

-- 5. Tabel Products (Menu / Barang)
CREATE TABLE public.products (
    id TEXT PRIMARY KEY,
    org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    sku TEXT NOT NULL,
    name TEXT NOT NULL,
    "desc" TEXT,
    price NUMERIC NOT NULL DEFAULT 0,
    stock INTEGER NOT NULL DEFAULT 0,
    category TEXT NOT NULL,
    image TEXT
);

-- Mengaktifkan RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Policy: Semua orang (bahkan anon) boleh melihat produk untuk kasir
CREATE POLICY "Allow anon read access to products" 
ON public.products FOR SELECT 
USING (true);

-- Policy: Anon boleh update stock setelah transaksi
CREATE POLICY "Allow anon update products stock" 
ON public.products FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

GRANT ALL ON public.products TO anon, authenticated;


-- ==============================================================================
-- DUMMY DATA SEEDING (Untuk Uji Coba)
-- ==============================================================================

-- Masukkan organisasi dummy
INSERT INTO public.organizations (id, slug, name)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'toko.anda', 'Toko Anda Group');

-- Masukkan data kasir dummy untuk 'toko.anda' (PIN: 123456)
INSERT INTO public.cashiers (org_id, branch_name, name, pin)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Cabang Utama (Senopati, Jakarta Selatan)', 'Kasir Utama', '123456'),
    ('11111111-1111-1111-1111-111111111111', 'Cabang Utama (Senopati, Jakarta Selatan)', 'Kasir Utama', '123456'),
    ('11111111-1111-1111-1111-111111111111', 'Cabang 02 (Dago, Bandung)', 'Kasir Cabang', '123456');

-- Masukkan data produk dummy
INSERT INTO public.products (id, org_id, sku, name, "desc", price, stock, category, image)
VALUES 
    ('p1', '11111111-1111-1111-1111-111111111111', 'KOP-01', 'Kopi Susu Aren', '2 Varian Rasa', 22000, 48, 'kopi', 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_iOaD4D6x-25q7K19Dk_fD7jD5_95t0n4bY8tK8O_28j5p2_0RjQkP9X1F_53n6C1fVq-E8jP9E5Q1F-kQxM_T0K9p3lHj1_nB6S5L8bX_u_C4kHqM8kC4fF3aPqR9aN_n5YVp9wR-g1Q6oD8N9tK0w4GqK7R9pL9gQ5YV4R5aB_X4qM9kP7fK9a_'),
    ('p2', '11111111-1111-1111-1111-111111111111', 'PAS-04', 'Croissant Butter', 'Fresh Daily', 28000, 19, 'dessert', 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5xUaxHBrUU2wNyBB2xy8yrYRENcjMuNeqbxkFYkeZHRMmSeTMrscX-vSMexV0vLEHo5Ciqze_85OyaiaSNE_ssmqd5EMje2KKwURMyBkNG6amf38sreqt5KhIBsf315IjpmR0orOLWJPTGjfOEKuCGFGag6u4DGS92okCjWYTJzpUSugExny6VptFT-O_nCKKWXH2v7D1eerlQBHhHera721iK4Mi4bBQJWdMGb0tblyWYwz5ETWf'),
    ('p3', '11111111-1111-1111-1111-111111111111', 'MNU-09', 'Matcha Latte', 'Uji Grade A', 26000, 32, 'kopi', 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8Mon_dEypws8015jfXnA4HPRWZ9Ur9bddW1Mbqzgew9axvog61XemHG-QB460Jq3kaw556c4m-uLOBb9uGnqBrVPLckSfEVYNYRP2T3pvJDh-6JK6pa9R2ROwOov_10f_04wPRQHudiuF--2U8yn3eXcTy5p7O94CLQszoYexGVPEWeqlKPRYAyDycUujbVEXfAGWpIyDZjC1Yz9u4KqR5dG7ZZEddyjrEB-vs11a3YZP9w8FoWLw'),
    ('p4', '11111111-1111-1111-1111-111111111111', 'KOP-02', 'Americano Ice', 'Single Origin Flores', 18000, 4, 'kopi', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBver_pfsinFeUmMUks3SCwPI3pokgPgQ5FMEVHGHKdlIbqFiskoTNIfAQnMU_aaO0NET3BFE0LAXzS7HdnE71HQaRJRfV-5mhue-DtB3WvQdmppFp2OT1LJWNhTLMvQ7yVv0MnrNLqOdozldCClL1_DT1HnwYPvHTcPZCHi_3R--sUpaiBhKGgHe-xbEZSnM56gqT3fQBM2Ui0NBaubCxzjL9qvxWZwpUNfhZZ6HdhyhPasRSoPrin'),
    ('p5', '11111111-1111-1111-1111-111111111111', 'SNK-11', 'Toast Roti Bakar', 'Choco Melt', 20000, 25, 'makanan', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCk4PE_L96ZBJHUhUppGnArkjK2PsxpH-aSfmF4uK0XW0MS_tRftS7WC7b6ol2iqwKFzYEzjDgIQ_QEFH7PGkokE3nhutiGt76VgU1lWmLF8jWVnwPWLwOgxB6ZmCgmCkuf5Mgb3O_vf98xXkZYNqtF3zU03ENGKTpzDz5OZGoBMzjgrG0EM8jMRdoCJpdPpJlbhXyuBAOv9UebMf2jApHed68KmZcx1qUYMUJ_ZAnvi5zQaXzoAzwc'),
    ('p6', '11111111-1111-1111-1111-111111111111', 'SNK-08', 'French Fries', 'Truffle Mayo Dip', 18000, 40, 'makanan', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDX0fS4FmiuisAofnz64dX9L5rB7KMtFMC1EueqiyEsxh024_006C_ybMXEmRzHN4gpyBrWpJAIaA8u1iCdL2imGLOkW2FzU7jWBXMGqk70xQcIRDOzgHJRP3TFYuOsol8PBlP7LvOJucCKZXIf_-57EpIblsPKt_yfne9YeThsmSO5tsJDrVDnELuBq5pfP-yubBsyegl8fALCdOBcMoblEHO-3yxWhHgwVlwuCtwaahJpL0lPur3D'),
    ('p7', '11111111-1111-1111-1111-111111111111', 'TEA-02', 'Earl Grey Tea', 'Citrus Bergamot', 16000, 60, 'kopi', 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9qu7JZPrYS1KVO4Ufy5y1SVLuu92kil2PzFBDZ1QqICV_eatHKxFpb1P5S4oo9kcNetxc0RkO4nZNYOz4EdqvfRDyCjobgDuqBGlig0qOPRpAcl4_4m04xC27xYLlgesTUvchjP5RxPLbsFioHstpj9IgDphB4lnqX-stxLmRbj3PdGHz2NS3-Ed049-LKRfS2mOUpR0bGUjUQtpS1tB4StI7H8Tjj5-6KNvL93_nAEQLj1fvDIts'),
    ('p8', '11111111-1111-1111-1111-111111111111', 'CAK-05', 'Red Velvet Cake', 'Cream Cheese', 32000, 12, 'dessert', 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5dLHMtNliDgzR7k17PrD_Be9AHBYOgmmaoB9mNrI-p17CgulXrQKpU6wNLmY2KvzSThP01FWUOt-ksvoBdhmYr1Sau2a3Z0cAKxgQsQSah01rNC_xvqqHeArfcBvOOnsmWjnNcH28PWGD-0yBxVTkjlimZyXf4WWolTNRsqqEDegOCR4o_ZHLCnToOzXCf3nWF-Hk_tTmRlkTqV1cfdbMBzh7WCZli8Sp42IfeckUVjjSWCiacAwC');

-- *Catatan: Untuk tabel profiles (Pemilik), Anda harus mendaftar dulu via Supabase Auth (Sign Up),
-- lalu menyalin User UUID-nya ke tabel profiles dan menautkannya dengan org_id toko Anda.
