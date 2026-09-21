// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format angka ke Rupiah
export function formatRupiah(amount: number, options?: { compact?: boolean }): string {
  if (options?.compact) {
    if (amount >= 1_000_000_000) {
      return `Rp${(amount / 1_000_000_000).toFixed(1).replace(".", ",")}M`;
    }
    if (amount >= 1_000_000) {
      return `Rp${(amount / 1_000_000).toFixed(1).replace(".", ",")}Jt`;
    }
    if (amount >= 1_000) {
      return `Rp${(amount / 1_000).toFixed(0)}Rb`;
    }
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format tanggal ke Indonesia
export function formatDate(
  dateStr: string,
  options?: Intl.DateTimeFormatOptions
): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...options,
  }).format(date);
}

export function formatDateTime(dateStr: string): string {
  return formatDate(dateStr, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Format relative time (2 jam lalu, kemarin, dll)
export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Baru saja";
  if (diffMins < 60) return `${diffMins} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays === 1) return "Kemarin";
  if (diffDays < 7) return `${diffDays} hari lalu`;
  return formatDate(dateStr);
}

// Format persentase dengan tanda +/-
export function formatPercent(value: number, decimals = 1): string {
  const formatted = Math.abs(value).toFixed(decimals) + "%";
  return value >= 0 ? `+${formatted}` : `-${formatted}`;
}

// Generate SKU otomatis
export function generateSku(productName: string, index: number): string {
  const prefix = productName
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 3)
    .padEnd(3, "X");
  return `${prefix}-${String(index).padStart(4, "0")}`;
}

// Tentukan status stok
export function getStockStatus(stock: number, minStock: number): "aman" | "menipis" | "habis" {
  if (stock <= 0) return "habis";
  if (stock <= minStock) return "menipis";
  return "aman";
}

// Hitung subtotal cart item
export function calculateItemSubtotal(
  qty: number,
  unitPrice: number,
  discountPercent: number,
  discountAmount: number
): number {
  const grossAmount = qty * unitPrice;
  const discountFromPercent = grossAmount * (discountPercent / 100);
  return grossAmount - discountFromPercent - discountAmount;
}

// Truncate text
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

// Capitalize first letter
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Debounce
export function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}
