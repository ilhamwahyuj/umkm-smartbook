# Data Design - UMKM Smartbook

Dokumen ini menjelaskan struktur data (skema database) yang digunakan dalam aplikasi UMKM Smartbook. Struktur ini dirancang untuk mendukung multi-tenant (SaaS) di mana setiap UMKM memiliki `organization_id` masing-masing.

## 1. Organisasi & Pengguna

### Organization
Menyimpan data profil UMKM/Toko.
- `id` (UUID, PK)
- `name` (String) - Nama toko/usaha
- `type` (Enum: cafe, toko, fashion, food, jasa, online, service, general)
- `currency` (String) - Mata uang default (misal: IDR)
- `logo_url` (String, Nullable)
- `address`, `phone`, `email`, `tax_number`, `website` (String, Nullable)
- `is_active` (Boolean)
- `created_at`, `updated_at` (Timestamp)

### OrganizationMember
Menghubungkan pengguna (User) dengan Organisasi beserta role-nya.
- `id` (UUID, PK)
- `organization_id` (UUID, FK ke Organization)
- `user_id` (UUID, FK ke User System/Auth)
- `role` (Enum: owner, admin, cashier, warehouse, accounting, viewer)
- `is_active` (Boolean)
- `invited_at`, `joined_at`, `created_at` (Timestamp)

## 2. Katalog Produk

### Category
Kategori untuk produk atau pengeluaran.
- `id` (UUID, PK)
- `organization_id` (UUID, FK)
- `name` (String)
- `type` (Enum: product, expense)
- `color`, `icon` (String, Nullable)
- `created_at` (Timestamp)

### Unit
Satuan ukur produk (Pcs, Kg, Liter, dll).
- `id` (UUID, PK)
- `organization_id` (UUID, FK)
- `name` (String)
- `abbreviation` (String, Nullable)
- `created_at` (Timestamp)

### Product
Data master produk atau layanan.
- `id` (UUID, PK)
- `organization_id` (UUID, FK)
- `category_id` (UUID, FK ke Category, Nullable)
- `unit_id` (UUID, FK ke Unit, Nullable)
- `sku`, `barcode` (String, Nullable)
- `name` (String)
- `description`, `image_url` (String, Nullable)
- `buy_price`, `sell_price` (Decimal/Number)
- `stock` (Integer) - Stok saat ini
- `min_stock` (Integer) - Batas minimum stok untuk notifikasi
- `has_variants` (Boolean)
- `is_active` (Boolean)
- `is_service` (Boolean) - Jika true, tidak perlu melacak stok
- `created_at`, `updated_at` (Timestamp)

### ProductVariant
Varian produk (misal: Ukuran, Warna) jika `has_variants` true.
- `id` (UUID, PK)
- `product_id` (UUID, FK ke Product)
- `name` (String)
- `sku`, `barcode` (String, Nullable)
- `buy_price`, `sell_price` (Decimal/Number)
- `stock` (Integer)
- `is_active` (Boolean)
- `created_at` (Timestamp)

## 3. Kontak (Pelanggan & Pemasok)

### Customer
Data pelanggan toko.
- `id` (UUID, PK)
- `organization_id` (UUID, FK)
- `name` (String)
- `phone`, `email`, `address`, `notes` (String, Nullable)
- `total_transactions` (Integer)
- `total_spend` (Decimal/Number)
- `receivable_amount` (Decimal/Number) - Total piutang yang belum dibayar
- `last_transaction_at` (Timestamp, Nullable)
- `is_active` (Boolean)
- `created_at`, `updated_at` (Timestamp)

### Supplier
Data pemasok barang (Supplier).
- `id` (UUID, PK)
- `organization_id` (UUID, FK)
- `name` (String)
- `contact_name`, `phone`, `email`, `address`, `notes` (String, Nullable)
- `total_purchases` (Integer)
- `total_spend` (Decimal/Number)
- `payable_amount` (Decimal/Number) - Total hutang yang belum dibayar
- `is_active` (Boolean)
- `created_at`, `updated_at` (Timestamp)

## 4. Transaksi Penjualan (POS)

### Sale
Data header transaksi penjualan.
- `id` (UUID, PK)
- `organization_id` (UUID, FK)
- `invoice_number` (String)
- `customer_id` (UUID, FK ke Customer, Nullable)
- `cashier_id` (UUID, FK ke User, Nullable)
- `sale_date` (Date/Timestamp)
- `subtotal`, `discount_amount`, `discount_percent` (Decimal/Number)
- `tax_amount`, `tax_percent` (Decimal/Number)
- `total`, `paid_amount`, `change_amount` (Decimal/Number)
- `payment_method` (Enum: cash, transfer, qris, e_wallet, credit)
- `payment_status` (Enum: paid, partial, unpaid, void, overdue)
- `notes` (String, Nullable)
- `is_voided` (Boolean)
- `voided_at`, `voided_by` (Nullable)
- `created_at`, `updated_at` (Timestamp)

### SaleItem
Data detail barang yang dijual dalam satu transaksi.
- `id` (UUID, PK)
- `sale_id` (UUID, FK ke Sale)
- `product_id` (UUID, FK ke Product)
- `variant_id` (UUID, FK ke ProductVariant, Nullable)
- `product_name`, `product_sku` (String)
- `qty` (Integer/Decimal)
- `unit_price`, `buy_price`, `discount_amount`, `discount_percent`, `subtotal` (Decimal/Number)
- `created_at` (Timestamp)

## 5. Pembelian (Purchase)

### Purchase
Data header transaksi pembelian ke Supplier (Restock).
- `id` (UUID, PK)
- `organization_id` (UUID, FK)
- `purchase_number` (String)
- `supplier_id` (UUID, FK ke Supplier, Nullable)
- `purchase_date` (Date/Timestamp)
- `subtotal`, `discount_amount`, `tax_amount`, `total` (Decimal/Number)
- `paid_amount` (Decimal/Number)
- `payment_method`, `payment_status` (Sama seperti Sale)
- `notes`, `created_by` (String, Nullable)
- `created_at`, `updated_at` (Timestamp)

### PurchaseItem
Data detail barang yang dibeli.
- `id` (UUID, PK)
- `purchase_id` (UUID, FK ke Purchase)
- `product_id` (UUID, FK ke Product)
- `variant_id` (UUID, FK ke ProductVariant, Nullable)
- `product_name` (String)
- `qty` (Integer/Decimal)
- `unit_price`, `subtotal` (Decimal/Number)
- `created_at` (Timestamp)

## 6. Inventaris & Stok

### StockMovement
Mencatat setiap mutasi stok keluar/masuk (Kartu Stok).
- `id` (UUID, PK)
- `organization_id` (UUID, FK)
- `product_id` (UUID, FK ke Product)
- `variant_id` (UUID, FK ke ProductVariant, Nullable)
- `type` (Enum: sale, purchase, adjustment, opname, void_sale, return)
- `reference_type` (String, misal: 'sale', 'purchase')
- `reference_id` (UUID, ID referensi transaksi terkait)
- `qty_change` (Integer/Decimal, positif untuk masuk, negatif untuk keluar)
- `qty_before`, `qty_after` (Integer/Decimal)
- `notes`, `created_by` (String, Nullable)
- `created_at` (Timestamp)

## 7. Keuangan (Hutang, Piutang & Pengeluaran)

### Receivable (Piutang)
Mencatat pelanggan yang belum membayar lunas (Kasbon/Kredit).
- `id` (UUID, PK)
- `organization_id` (UUID, FK)
- `customer_id` (UUID, FK)
- `sale_id`, `invoice_number` (Nullable)
- `total_amount`, `paid_amount`, `remaining_amount` (Decimal/Number)
- `due_date` (Date, Nullable)
- `status` (Enum: paid, partial, unpaid, overdue)
- `notes` (String, Nullable)
- `created_at`, `updated_at` (Timestamp)

### Payable (Hutang)
Mencatat hutang ke supplier.
- `id` (UUID, PK)
- `organization_id` (UUID, FK)
- `supplier_id` (UUID, FK)
- `purchase_id`, `purchase_number` (Nullable)
- `total_amount`, `paid_amount`, `remaining_amount` (Decimal/Number)
- `due_date` (Date, Nullable)
- `status` (Enum sama dengan Receivable)
- `notes` (String, Nullable)
- `created_at`, `updated_at` (Timestamp)

### ExpenseCategory
Kategori khusus untuk pengeluaran operasional.
- `id`, `organization_id`, `name`, `icon`, `color`, `created_at`

### Expense
Data pengeluaran operasional toko (Listrik, Gaji, dll).
- `id` (UUID, PK)
- `organization_id` (UUID, FK)
- `category_id` (UUID, FK ke ExpenseCategory, Nullable)
- `amount` (Decimal/Number)
- `expense_date` (Date)
- `description`, `payment_method`, `receipt_url`, `created_by` (Nullable)
- `created_at`, `updated_at` (Timestamp)

## 8. Sistem

### Notification
Menyimpan notifikasi in-app untuk user.
- `id` (UUID, PK)
- `organization_id` (UUID, FK)
- `user_id` (UUID, Nullable, jika null berarti untuk semua role tertentu di org tersebut)
- `type` (String, misal: LOW_STOCK, PAYMENT_DUE)
- `title`, `message` (String)
- `data` (JSON/Record)
- `is_read` (Boolean)
- `read_at` (Timestamp, Nullable)
- `created_at` (Timestamp)
