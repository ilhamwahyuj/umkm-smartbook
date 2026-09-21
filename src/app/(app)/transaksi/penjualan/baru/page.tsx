"use client";
// src/app/(app)/transaksi/penjualan/baru/page.tsx
// POS Interface — The most critical page
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  User,
  CreditCard,
  Smartphone,
  QrCode,
  Banknote,
  FileText,
  Printer,
  Check,
  X,
  Loader2,
  ShoppingCart,
  Barcode,
} from "lucide-react";
import { cn, formatRupiah } from "@/lib/utils";
import { useCartStore } from "@/stores/useCartStore";
import { mockProducts, mockCustomers } from "@/lib/mock-data";
import type { Product } from "@/types/database";

type PaymentMethodKey = "cash" | "transfer" | "qris" | "e_wallet" | "credit";

const paymentMethods: { key: PaymentMethodKey; label: string; icon: React.ReactNode }[] = [
  { key: "cash", label: "Tunai", icon: <Banknote className="w-4 h-4" /> },
  { key: "transfer", label: "Transfer", icon: <CreditCard className="w-4 h-4" /> },
  { key: "qris", label: "QRIS", icon: <QrCode className="w-4 h-4" /> },
  { key: "e_wallet", label: "E-Wallet", icon: <Smartphone className="w-4 h-4" /> },
  { key: "credit", label: "Piutang", icon: <FileText className="w-4 h-4" /> },
];

export default function PenjualanBaruPage() {
  const router = useRouter();
  const {
    items, customer, payment_method,
    addItem, updateQty, removeItem, setCustomer, setPaymentMethod,
    clearCart, subtotal, discountTotal, taxTotal, grandTotal,
  } = useCartStore();

  const [productSearch, setProductSearch] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [paidAmount, setPaidAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filteredProducts = mockProducts.filter((p) =>
    p.is_active &&
    (p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
     (p.sku?.toLowerCase() ?? "").includes(productSearch.toLowerCase()) ||
     (p.barcode ?? "").includes(productSearch))
  );

  const filteredCustomers = mockCustomers.filter((c) =>
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    (c.phone ?? "").includes(customerSearch)
  );

  const change = payment_method === "cash" && paidAmount
    ? Math.max(0, Number(paidAmount.replace(/\D/g, "")) - grandTotal())
    : 0;

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setLoading(true);

    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));

    const invoiceNum = `INV-${new Date().toISOString().replace(/\D/g, "").slice(0, 8)}-${Math.floor(Math.random() * 9000) + 1000}`;
    setSuccess(invoiceNum);
    setLoading(false);
  };

  const handleNewTransaction = () => {
    clearCart();
    setSuccess(null);
    setPaidAmount("");
    searchRef.current?.focus();
  };

  if (success) {
    return (
      <div className="max-w-sm mx-auto mt-16 text-center animate-scale-in">
        <div className="card p-8">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">Pembayaran Berhasil!</h2>
          <p className="text-slate-500 text-sm mb-2">Invoice</p>
          <p className="font-mono font-bold text-emerald-600 text-lg mb-1">{success}</p>
          <p className="text-2xl font-bold text-slate-900 mb-6">{formatRupiah(grandTotal())}</p>
          {change > 0 && (
            <div className="bg-emerald-50 rounded-xl p-3 mb-4">
              <p className="text-emerald-800 font-semibold text-sm">Kembalian: {formatRupiah(change)}</p>
            </div>
          )}
          <div className="flex gap-3">
            <button className="btn btn-outline flex-1">
              <Printer className="w-4 h-4" /> Cetak Struk
            </button>
            <button onClick={handleNewTransaction} className="btn btn-primary flex-1">
              Transaksi Baru
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-64px-48px)] -mx-6 -mt-6 overflow-hidden">
      {/* Left: Product Search */}
      <div className="flex-1 flex flex-col bg-slate-50 p-6 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-slate-900">Penjualan Baru</h1>
          <button onClick={() => router.back()} className="btn btn-ghost btn-sm">
            <X className="w-4 h-4" /> Batal
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            ref={searchRef}
            autoFocus
            className="input pl-9 pr-10 bg-white"
            placeholder="Cari produk atau scan barcode..."
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <Barcode className="w-4 h-4" />
          </button>
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filteredProducts.map((product) => {
              const outOfStock = product.stock <= 0;
              const inCart = items.find((i) => i.product.id === product.id);
              return (
                <button
                  key={product.id}
                  onClick={() => !outOfStock && addItem(product)}
                  disabled={outOfStock}
                  className={cn(
                    "card p-3 text-left transition-all hover:shadow-md hover:-translate-y-0.5 active:scale-95",
                    outOfStock && "opacity-50 cursor-not-allowed",
                    inCart && "ring-2 ring-emerald-500"
                  )}
                >
                  <div className="w-full aspect-square rounded-xl bg-slate-100 flex items-center justify-center mb-2">
                    <ShoppingCart className="w-6 h-6 text-slate-300" />
                  </div>
                  <p className="text-xs font-semibold text-slate-800 line-clamp-2 leading-snug mb-1">
                    {product.name}
                  </p>
                  <p className="text-sm font-bold text-emerald-600">
                    {formatRupiah(product.sell_price)}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-[11px] text-slate-400">Stok: {product.stock}</p>
                    {inCart && (
                      <span className="text-[11px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-bold">
                        ×{inCart.qty}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <p className="empty-state-title">Produk tidak ditemukan</p>
            </div>
          )}
        </div>
      </div>

      {/* Right: Cart */}
      <div className="w-80 xl:w-96 flex flex-col bg-white border-l border-slate-200 overflow-hidden">
        {/* Cart Header */}
        <div className="px-5 py-4 border-b border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-slate-800">Keranjang</h2>
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-slate-400 hover:text-rose-500 transition-colors"
              >
                Kosongkan
              </button>
            )}
          </div>

          {/* Customer Selection */}
          <div className="relative">
            <button
              onClick={() => setShowCustomerSearch(!showCustomerSearch)}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 hover:border-emerald-300 transition-colors text-left text-sm"
            >
              <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span className={cn("flex-1 truncate", customer ? "text-slate-800 font-medium" : "text-slate-400")}>
                {customer?.name ?? "Pilih pelanggan (opsional)"}
              </span>
              {customer && (
                <X
                  className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600"
                  onClick={(e) => { e.stopPropagation(); setCustomer(null); }}
                />
              )}
            </button>

            {showCustomerSearch && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowCustomerSearch(false)} />
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-slate-100 z-20 overflow-hidden animate-scale-in">
                  <div className="p-2 border-b border-slate-100">
                    <input
                      autoFocus
                      className="input text-sm py-2"
                      placeholder="Cari pelanggan..."
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {filteredCustomers.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => { setCustomer(c); setShowCustomerSearch(false); setCustomerSearch(""); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 text-left text-sm"
                      >
                        <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs flex-shrink-0">
                          {c.name[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{c.name}</p>
                          <p className="text-slate-400 text-xs">{c.phone}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-5 py-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingCart className="w-12 h-12 text-slate-200 mb-3" />
              <p className="text-slate-400 text-sm">Belum ada produk di keranjang</p>
              <p className="text-slate-300 text-xs mt-1">Klik produk untuk menambahkan</p>
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item) => {
                const key = item.variant?.id ?? item.product.id;
                return (
                  <div key={key} className="flex gap-3 p-2.5 rounded-xl hover:bg-slate-50 group">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{item.product.name}</p>
                      {item.variant && (
                        <p className="text-xs text-slate-500">{item.variant.name}</p>
                      )}
                      <p className="text-emerald-600 text-sm font-bold">{formatRupiah(item.subtotal)}</p>
                      <p className="text-xs text-slate-400">{formatRupiah(item.unit_price)} / pcs</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => removeItem(item.product.id, item.variant?.id)}
                        className="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateQty(item.product.id, item.variant?.id, item.qty - 1)}
                          className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
                        >
                          <Minus className="w-3 h-3 text-slate-600" />
                        </button>
                        <span className="text-sm font-bold text-slate-800 w-6 text-center">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.product.id, item.variant?.id, item.qty + 1)}
                          className="w-6 h-6 rounded-lg bg-emerald-100 hover:bg-emerald-200 flex items-center justify-center"
                        >
                          <Plus className="w-3 h-3 text-emerald-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Totals & Payment */}
        {items.length > 0 && (
          <div className="border-t border-slate-100 px-5 py-4 space-y-3">
            {/* Summary */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm text-slate-500">
                <span>Subtotal</span>
                <span className="font-medium text-slate-700">{formatRupiah(subtotal())}</span>
              </div>
              {discountTotal() > 0 && (
                <div className="flex justify-between text-sm text-rose-500">
                  <span>Diskon</span>
                  <span>-{formatRupiah(discountTotal())}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-slate-900 pt-1.5 border-t border-slate-100">
                <span>Total</span>
                <span className="text-emerald-600">{formatRupiah(grandTotal())}</span>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-2">METODE PEMBAYARAN</p>
              <div className="grid grid-cols-3 gap-1.5">
                {paymentMethods.map((pm) => (
                  <button
                    key={pm.key}
                    onClick={() => setPaymentMethod(pm.key)}
                    className={cn(
                      "flex flex-col items-center gap-1 p-2 rounded-xl border text-xs font-medium transition-all",
                      payment_method === pm.key
                        ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 text-slate-500 hover:border-emerald-200 hover:bg-emerald-50/50"
                    )}
                  >
                    {pm.icon}
                    {pm.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Cash Input */}
            {payment_method === "cash" && (
              <div>
                <label className="input-label text-xs">Uang Diterima</label>
                <input
                  className="input text-center font-bold text-lg"
                  placeholder={formatRupiah(grandTotal())}
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value.replace(/\D/g, ""))}
                />
                {change > 0 && (
                  <div className="mt-2 p-2.5 bg-emerald-50 rounded-xl text-center">
                    <p className="text-xs text-emerald-600">Kembalian</p>
                    <p className="text-lg font-bold text-emerald-700">{formatRupiah(change)}</p>
                  </div>
                )}
              </div>
            )}

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={loading || items.length === 0}
              className="btn btn-primary btn-lg w-full justify-center"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Bayar {formatRupiah(grandTotal())}
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
