// src/lib/mock-data.ts
// Data demo untuk development/onboarding pertama
import type {
  DashboardSummary,
  SalesChartData,
  TopProduct,
  LowStockProduct,
  Product,
  Customer,
  Sale,
  Expense,
  Notification,
  Supplier,
  Purchase,
  Payable,
  Receivable,
  Organization,
  OrganizationMember,
} from "@/types/database";

// ============================================================
// DASHBOARD SUMMARY
// ============================================================
export const mockDashboardSummary: DashboardSummary = {
  revenue: 35_400_000,
  revenue_change_percent: 12.4,
  gross_profit: 16_200_000,
  gross_profit_change_percent: 8.2,
  expenses: 14_200_000,
  expenses_change_percent: -5.1,
  receivables: 5_800_000,
  total_transactions: 284,
  total_customers: 152,
};

// ============================================================
// SALES CHART (7 hari terakhir)
// ============================================================
export const mockSalesChart7Days: SalesChartData[] = [
  { date: "Senin", revenue: 4_200_000, transactions: 32 },
  { date: "Selasa", revenue: 5_800_000, transactions: 41 },
  { date: "Rabu", revenue: 4_900_000, transactions: 37 },
  { date: "Kamis", revenue: 6_100_000, transactions: 48 },
  { date: "Jumat", revenue: 7_200_000, transactions: 55 },
  { date: "Sabtu", revenue: 8_400_000, transactions: 63 },
  { date: "Minggu", revenue: 5_300_000, transactions: 40 },
];

export const mockSalesChart30Days: SalesChartData[] = Array.from({ length: 30 }, (_, i) => ({
  date: `${i + 1}`,
  revenue: Math.floor(Math.random() * 5_000_000) + 2_000_000,
  transactions: Math.floor(Math.random() * 40) + 15,
}));

// ============================================================
// TOP PRODUCTS
// ============================================================
export const mockTopProducts: TopProduct[] = [
  { product_id: "1", product_name: "Kopi Arabica 250g", qty_sold: 125, revenue: 3_125_000 },
  { product_id: "2", product_name: "Gula Aren 500g", qty_sold: 92, revenue: 1_840_000 },
  { product_id: "3", product_name: "Teh Premium Ceylon", qty_sold: 80, revenue: 1_200_000 },
  { product_id: "4", product_name: "Kopi Robusta 250g", qty_sold: 68, revenue: 1_496_000 },
  { product_id: "5", product_name: "Susu Full Cream 1L", qty_sold: 54, revenue: 972_000 },
];

// ============================================================
// LOW STOCK PRODUCTS
// ============================================================
export const mockLowStockProducts: LowStockProduct[] = [
  { id: "1", name: "Kopi Robusta 250g", stock: 4, min_stock: 10, sku: "KOP-002" },
  { id: "2", name: "Gula Pasir 1kg", stock: 2, min_stock: 15, sku: "GUL-001" },
  { id: "3", name: "Teh Celup Sariwangi", stock: 8, min_stock: 20, sku: "TEH-002" },
];

// ============================================================
// PRODUCTS
// ============================================================
export const mockProducts: Product[] = [
  {
    id: "1",
    organization_id: "demo-org",
    category_id: "cat-1",
    unit_id: "unit-1",
    sku: "KOP-001",
    barcode: "8991234560001",
    name: "Kopi Arabica 250g",
    description: "Kopi Arabica pilihan dari Gayo, Aceh",
    image_url: null,
    buy_price: 18_000,
    sell_price: 25_000,
    stock: 62,
    min_stock: 10,
    has_variants: false,
    is_active: true,
    is_service: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: "cat-1", organization_id: "demo-org", name: "Kopi", type: "product", color: "#8B4513", icon: "coffee", created_at: new Date().toISOString() },
  },
  {
    id: "2",
    organization_id: "demo-org",
    category_id: "cat-1",
    unit_id: "unit-1",
    sku: "KOP-002",
    barcode: "8991234560002",
    name: "Kopi Robusta 250g",
    description: "Kopi Robusta premium, aroma kuat",
    image_url: null,
    buy_price: 15_000,
    sell_price: 22_000,
    stock: 4,
    min_stock: 10,
    has_variants: false,
    is_active: true,
    is_service: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: "cat-1", organization_id: "demo-org", name: "Kopi", type: "product", color: "#8B4513", icon: "coffee", created_at: new Date().toISOString() },
  },
  {
    id: "3",
    organization_id: "demo-org",
    category_id: "cat-2",
    unit_id: "unit-1",
    sku: "TEH-001",
    barcode: "8991234560003",
    name: "Teh Premium Ceylon",
    description: "Teh Ceylon impor, kualitas terbaik",
    image_url: null,
    buy_price: 10_000,
    sell_price: 15_000,
    stock: 45,
    min_stock: 10,
    has_variants: false,
    is_active: true,
    is_service: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: "cat-2", organization_id: "demo-org", name: "Teh", type: "product", color: "#228B22", icon: "leaf", created_at: new Date().toISOString() },
  },
  {
    id: "4",
    organization_id: "demo-org",
    category_id: "cat-3",
    unit_id: "unit-2",
    sku: "GUL-001",
    barcode: "8991234560004",
    name: "Gula Aren 500g",
    description: "Gula aren alami, tanpa pengawet",
    image_url: null,
    buy_price: 12_000,
    sell_price: 20_000,
    stock: 2,
    min_stock: 15,
    has_variants: false,
    is_active: true,
    is_service: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: "cat-3", organization_id: "demo-org", name: "Gula", type: "product", color: "#D2691E", icon: "package", created_at: new Date().toISOString() },
  },
  {
    id: "5",
    organization_id: "demo-org",
    category_id: "cat-4",
    unit_id: "unit-3",
    sku: "SUS-001",
    barcode: "8991234560005",
    name: "Susu Full Cream 1L",
    description: "Susu segar full cream",
    image_url: null,
    buy_price: 13_000,
    sell_price: 18_000,
    stock: 30,
    min_stock: 10,
    has_variants: false,
    is_active: true,
    is_service: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: "cat-4", organization_id: "demo-org", name: "Susu", type: "product", color: "#F5F5DC", icon: "package", created_at: new Date().toISOString() },
  },
];

// ============================================================
// CUSTOMERS
// ============================================================
export const mockCustomers: Customer[] = [
  {
    id: "cust-1",
    organization_id: "demo-org",
    name: "Budi Store",
    phone: "08123456789",
    email: "budi@store.com",
    address: "Jl. Pahlawan No. 15, Semarang",
    notes: "Pelanggan tetap sejak 2024",
    total_transactions: 42,
    total_spend: 18_500_000,
    receivable_amount: 2_500_000,
    last_transaction_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "cust-2",
    organization_id: "demo-org",
    name: "Warung Bu Sari",
    phone: "08234567890",
    email: null,
    address: "Jl. Merdeka No. 8, Kendal",
    notes: null,
    total_transactions: 28,
    total_spend: 12_200_000,
    receivable_amount: 0,
    last_transaction_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "cust-3",
    organization_id: "demo-org",
    name: "Toko Pak Joko",
    phone: "08345678901",
    email: null,
    address: "Jl. Diponegoro No. 22, Ungaran",
    notes: null,
    total_transactions: 15,
    total_spend: 7_800_000,
    receivable_amount: 1_500_000,
    last_transaction_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// ============================================================
// RECENT SALES
// ============================================================
export const mockRecentSales: Sale[] = [
  {
    id: "sale-1",
    organization_id: "demo-org",
    invoice_number: "INV-20260919-0042",
    customer_id: "cust-1",
    cashier_id: null,
    sale_date: new Date().toISOString().split("T")[0],
    subtotal: 125_000,
    discount_amount: 5_000,
    discount_percent: 0,
    tax_amount: 0,
    tax_percent: 0,
    total: 120_000,
    paid_amount: 120_000,
    change_amount: 0,
    payment_method: "cash",
    payment_status: "paid",
    notes: null,
    is_voided: false,
    voided_at: null,
    voided_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    customer: mockCustomers[0],
  },
  {
    id: "sale-2",
    organization_id: "demo-org",
    invoice_number: "INV-20260919-0041",
    customer_id: null,
    cashier_id: null,
    sale_date: new Date().toISOString().split("T")[0],
    subtotal: 65_000,
    discount_amount: 0,
    discount_percent: 0,
    tax_amount: 0,
    tax_percent: 0,
    total: 65_000,
    paid_amount: 65_000,
    change_amount: 0,
    payment_method: "qris",
    payment_status: "paid",
    notes: null,
    is_voided: false,
    voided_at: null,
    voided_by: null,
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
];

// ============================================================
// NOTIFICATIONS
// ============================================================
export const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    organization_id: "demo-org",
    user_id: null,
    type: "LOW_STOCK",
    title: "Stok hampir habis",
    message: "Kopi Robusta tinggal 4 pcs, di bawah minimum stok (10 pcs)",
    data: { product_id: "2", product_name: "Kopi Robusta 250g" },
    is_read: false,
    read_at: null,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-2",
    organization_id: "demo-org",
    user_id: null,
    type: "PAYMENT_DUE",
    title: "Piutang jatuh tempo besok",
    message: "Budi Store: Rp2.500.000 jatuh tempo 20 September 2026",
    data: { customer_id: "cust-1" },
    is_read: false,
    read_at: null,
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-3",
    organization_id: "demo-org",
    user_id: null,
    type: "INSIGHT",
    title: "Omzet meningkat",
    message: "Omzet bulan ini meningkat 12,4% dibanding bulan lalu 🎉",
    data: {},
    is_read: true,
    read_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

// ============================================================
// EXPENSES
// ============================================================
export const mockExpenses: Expense[] = [
  {
    id: "exp-1",
    organization_id: "demo-org",
    category_id: "ecat-1",
    amount: 500_000,
    expense_date: new Date().toISOString().split("T")[0],
    description: "Pembayaran internet bulan September",
    payment_method: "transfer",
    receipt_url: null,
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: {
      id: "ecat-1",
      organization_id: "demo-org",
      name: "Internet",
      icon: "wifi",
      color: "#3B82F6",
      created_at: new Date().toISOString(),
    },
  },
  {
    id: "exp-2",
    organization_id: "demo-org",
    category_id: "ecat-2",
    amount: 1_500_000,
    expense_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    description: "Gaji karyawan minggu ini",
    payment_method: "transfer",
    receipt_url: null,
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: {
      id: "ecat-2",
      organization_id: "demo-org",
      name: "Gaji",
      icon: "users",
      color: "#10B981",
      created_at: new Date().toISOString(),
    },
  },
];

// ============================================================
// INSIGHTS (Auto-generated)
// ============================================================
export const mockInsights = [
  { icon: "📈", text: "Omzet meningkat 14,2% dibanding bulan lalu", type: "positive" },
  { icon: "🛒", text: "Kopi Arabica menyumbang 28% total penjualan", type: "info" },
  { icon: "⚠️", text: "Stok Gula Aren diperkirakan habis dalam 4 hari", type: "warning" },
  { icon: "💰", text: "Pengeluaran operasional turun 5,1% dibanding bulan lalu", type: "positive" },
];

// ============================================================
// SUPPLIERS
// ============================================================
export const mockSuppliers: Supplier[] = [
  {
    id: "sup-1",
    organization_id: "demo-org",
    name: "PT Sumber Berkah",
    contact_name: "Pak Budi",
    phone: "08122334455",
    email: "sales@sumberberkah.com",
    address: "Kawasan Industri Candi Blok B/12, Semarang",
    notes: "Distributor kopi dan teh",
    total_purchases: 15,
    total_spend: 45_000_000,
    payable_amount: 5_000_000,
    is_active: true,
    created_at: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "sup-2",
    organization_id: "demo-org",
    name: "CV Makmur Abadi",
    contact_name: "Bu Siti",
    phone: "08233445566",
    email: "info@makmurabadi.co.id",
    address: "Jl. Majapahit No. 45, Demak",
    notes: "Distributor bahan pokok dan gula",
    total_purchases: 8,
    total_spend: 18_500_000,
    payable_amount: 0,
    is_active: true,
    created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// ============================================================
// PURCHASES (Pembelian)
// ============================================================
export const mockPurchases: Purchase[] = [
  {
    id: "pur-1",
    organization_id: "demo-org",
    purchase_number: "PO-20260918-001",
    supplier_id: "sup-1",
    purchase_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    subtotal: 7_500_000,
    discount_amount: 500_000,
    tax_amount: 700_000,
    total: 7_700_000,
    paid_amount: 2_700_000, // Bayar DP 2.7jt, sisa 5jt hutang
    payment_method: "transfer",
    payment_status: "partial",
    notes: "Restock kopi awal bulan",
    created_by: "user-1",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    supplier: mockSuppliers[0],
    items: [
      {
        id: "pitem-1",
        purchase_id: "pur-1",
        product_id: "1",
        variant_id: null,
        product_name: "Kopi Arabica 250g",
        qty: 50,
        unit_price: 18000,
        subtotal: 900000,
        created_at: new Date().toISOString(),
      },
    ],
  },
];

// ============================================================
// RECEIVABLES (Piutang)
// ============================================================
export const mockReceivables: Receivable[] = [
  {
    id: "rec-1",
    organization_id: "demo-org",
    customer_id: "cust-1",
    sale_id: "sale-old-1",
    invoice_number: "INV-20260905-0012",
    total_amount: 5_000_000,
    paid_amount: 2_500_000,
    remaining_amount: 2_500_000,
    due_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    status: "partial",
    notes: "Pembayaran tempo 14 hari",
    created_at: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    customer: mockCustomers[0],
  },
  {
    id: "rec-2",
    organization_id: "demo-org",
    customer_id: "cust-3",
    sale_id: "sale-old-2",
    invoice_number: "INV-20260830-0045",
    total_amount: 1_500_000,
    paid_amount: 0,
    remaining_amount: 1_500_000,
    due_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    status: "overdue",
    notes: "Sudah dihubungi via WA, berjanji bayar minggu depan",
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    customer: mockCustomers[2],
  },
];

// ============================================================
// PAYABLES (Hutang)
// ============================================================
export const mockPayables: Payable[] = [
  {
    id: "pay-1",
    organization_id: "demo-org",
    supplier_id: "sup-1",
    purchase_id: "pur-1",
    purchase_number: "PO-20260918-001",
    total_amount: 7_700_000,
    paid_amount: 2_700_000,
    remaining_amount: 5_000_000,
    due_date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    status: "partial",
    notes: "Sisa tagihan PO awal bulan",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    supplier: mockSuppliers[0],
  },
];

export const mockOrgUsers: (import("@/types/database").OrganizationMember & { user: { name: string; email: string; avatar_url: string } })[] = [
  {
    id: "mem-1",
    organization_id: "demo-org",
    user_id: "usr-1",
    role: "owner",
    is_active: true,
    invited_at: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    joined_at: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    user: {
      name: "Budi Santoso",
      email: "budi@smartbook.local",
      avatar_url: ""
    }
  },
  {
    id: "mem-2",
    organization_id: "demo-org",
    user_id: "usr-2",
    role: "admin",
    is_active: true,
    invited_at: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    joined_at: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    user: {
      name: "Siti Aminah",
      email: "siti.admin@smartbook.local",
      avatar_url: ""
    }
  },
  {
    id: "mem-3",
    organization_id: "demo-org",
    user_id: "usr-3",
    role: "cashier",
    is_active: true,
    invited_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    joined_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    user: {
      name: "Andi Kasir",
      email: "andi.kasir@smartbook.local",
      avatar_url: ""
    }
  },
  {
    id: "mem-4",
    organization_id: "demo-org",
    user_id: "usr-4",
    role: "viewer",
    is_active: true,
    invited_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    joined_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    user: {
      name: "Investor A",
      email: "investor@smartbook.local",
      avatar_url: ""
    }
  }
];
