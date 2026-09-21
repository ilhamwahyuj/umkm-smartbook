// src/types/database.ts
// TypeScript types yang merepresentasikan tabel Supabase

export type UserRole = "owner" | "admin" | "cashier" | "warehouse" | "accounting" | "viewer";

export type BusinessType =
  | "cafe"
  | "toko"
  | "fashion"
  | "food"
  | "jasa"
  | "online"
  | "service"
  | "general";

export type PaymentStatus = "paid" | "partial" | "unpaid" | "void" | "overdue";
export type PaymentMethod = "cash" | "transfer" | "qris" | "e_wallet" | "credit";
export type StockMovementType = "sale" | "purchase" | "adjustment" | "opname" | "void_sale" | "return";

// ============================================================
// ORGANIZATION
// ============================================================
export interface Organization {
  id: string;
  name: string;
  type: BusinessType;
  currency: string;
  logo_url: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  tax_number: string | null;
  website: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: UserRole;
  is_active: boolean;
  invited_at: string;
  joined_at: string | null;
  created_at: string;
}

// ============================================================
// PRODUCT
// ============================================================
export interface Category {
  id: string;
  organization_id: string;
  name: string;
  type: "product" | "expense";
  color: string | null;
  icon: string | null;
  created_at: string;
}

export interface Unit {
  id: string;
  organization_id: string;
  name: string;
  abbreviation: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  organization_id: string;
  category_id: string | null;
  unit_id: string | null;
  sku: string | null;
  barcode: string | null;
  name: string;
  description: string | null;
  image_url: string | null;
  buy_price: number;
  sell_price: number;
  stock: number;
  min_stock: number;
  has_variants: boolean;
  is_active: boolean;
  is_service: boolean;
  created_at: string;
  updated_at: string;
  // Joined fields
  category?: Category;
  unit?: Unit;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  sku: string | null;
  barcode: string | null;
  buy_price: number;
  sell_price: number;
  stock: number;
  is_active: boolean;
  created_at: string;
}

// ============================================================
// CUSTOMER & SUPPLIER
// ============================================================
export interface Customer {
  id: string;
  organization_id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  notes: string | null;
  total_transactions: number;
  total_spend: number;
  receivable_amount: number;
  last_transaction_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: string;
  organization_id: string;
  name: string;
  contact_name: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  notes: string | null;
  total_purchases: number;
  total_spend: number;
  payable_amount: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================
// SALES
// ============================================================
export interface Sale {
  id: string;
  organization_id: string;
  invoice_number: string;
  customer_id: string | null;
  cashier_id: string | null;
  sale_date: string;
  subtotal: number;
  discount_amount: number;
  discount_percent: number;
  tax_amount: number;
  tax_percent: number;
  total: number;
  paid_amount: number;
  change_amount: number;
  payment_method: string | null;
  payment_status: PaymentStatus;
  notes: string | null;
  is_voided: boolean;
  voided_at: string | null;
  voided_by: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  customer?: Customer;
  items?: SaleItem[];
}

export interface SaleItem {
  id: string;
  sale_id: string;
  product_id: string;
  variant_id: string | null;
  product_name: string;
  product_sku: string | null;
  qty: number;
  unit_price: number;
  buy_price: number;
  discount_amount: number;
  discount_percent: number;
  subtotal: number;
  created_at: string;
  // Joined
  product?: Product;
}

// ============================================================
// EXPENSE
// ============================================================
export interface ExpenseCategory {
  id: string;
  organization_id: string;
  name: string;
  icon: string | null;
  color: string | null;
  created_at: string;
}

export interface Expense {
  id: string;
  organization_id: string;
  category_id: string | null;
  amount: number;
  expense_date: string;
  description: string | null;
  payment_method: string | null;
  receipt_url: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  category?: ExpenseCategory;
}

// ============================================================
// PURCHASE
// ============================================================
export interface Purchase {
  id: string;
  organization_id: string;
  purchase_number: string;
  supplier_id: string | null;
  purchase_date: string;
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  total: number;
  paid_amount: number;
  payment_method: string | null;
  payment_status: PaymentStatus;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  supplier?: Supplier;
  items?: PurchaseItem[];
}

export interface PurchaseItem {
  id: string;
  purchase_id: string;
  product_id: string;
  variant_id: string | null;
  product_name: string;
  qty: number;
  unit_price: number;
  subtotal: number;
  created_at: string;
}

// ============================================================
// STOCK MOVEMENT
// ============================================================
export interface StockMovement {
  id: string;
  organization_id: string;
  product_id: string;
  variant_id: string | null;
  type: StockMovementType;
  reference_type: string | null;
  reference_id: string | null;
  qty_change: number;
  qty_before: number;
  qty_after: number;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  product?: Product;
}

// ============================================================
// RECEIVABLE / PAYABLE
// ============================================================
export interface Receivable {
  id: string;
  organization_id: string;
  customer_id: string | null;
  sale_id: string | null;
  invoice_number: string | null;
  total_amount: number;
  paid_amount: number;
  remaining_amount: number;
  due_date: string | null;
  status: PaymentStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  customer?: Customer;
}

export interface Payable {
  id: string;
  organization_id: string;
  supplier_id: string | null;
  purchase_id: string | null;
  purchase_number: string | null;
  total_amount: number;
  paid_amount: number;
  remaining_amount: number;
  due_date: string | null;
  status: PaymentStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  supplier?: Supplier;
}

// ============================================================
// NOTIFICATION
// ============================================================
export interface Notification {
  id: string;
  organization_id: string;
  user_id: string | null;
  type: string;
  title: string;
  message: string | null;
  data: Record<string, unknown> | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

// ============================================================
// DASHBOARD / API TYPES
// ============================================================
export interface DashboardSummary {
  revenue: number;
  revenue_change_percent: number;
  gross_profit: number;
  gross_profit_change_percent: number;
  expenses: number;
  expenses_change_percent: number;
  receivables: number;
  total_transactions: number;
  total_customers: number;
}

export interface SalesChartData {
  date: string;
  revenue: number;
  transactions: number;
}

export interface TopProduct {
  product_id: string;
  product_name: string;
  qty_sold: number;
  revenue: number;
}

export interface LowStockProduct {
  id: string;
  name: string;
  stock: number;
  min_stock: number;
  sku: string | null;
}

// ============================================================
// POS / CART
// ============================================================
export interface CartItem {
  product: Product;
  variant?: ProductVariant;
  qty: number;
  unit_price: number;
  discount_amount: number;
  discount_percent: number;
  subtotal: number;
}

export interface CartState {
  items: CartItem[];
  customer: Customer | null;
  discount_amount: number;
  discount_percent: number;
  tax_percent: number;
  payment_method: string;
  notes: string;
}
