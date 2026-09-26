"use client";
// src/app/(app)/transaksi/pembelian/baru/page.tsx
// POS Inbound (Pembelian/Kulakan) Interface
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  Building2,
  CreditCard,
  Banknote,
  FileText,
  Printer,
  Check,
  X,
  Loader2,
  PackagePlus,
  Barcode,
} from "lucide-react";
import { cn, formatRupiah } from "@/lib/utils";
import { usePurchaseStore } from "@/stores/usePurchaseStore";
import { useGetProducts } from "@/hooks/api/useProducts";
import { useGetSuppliers } from "@/hooks/api/useSuppliers";
import { useCreatePurchase } from "@/hooks/api/usePurchase";

type PaymentMethodKey = "transfer" | "cash" | "credit";

const paymentMethods: { key: PaymentMethodKey; label: string; icon: React.ReactNode }[] = [
  { key: "transfer", label: "Transfer", icon: <CreditCard className="w-4 h-4" /> },
  { key: "cash", label: "Tunai", icon: <Banknote className="w-4 h-4" /> },
  { key: "credit", label: "Tempo / Hutang", icon: <FileText className="w-4 h-4" /> },
];

export default function PembelianBaruPage() {
  const router = useRouter();
  const {
    items, supplier, payment_method,
    addItem, updateQty, updatePrice, removeItem, setSupplier, setPaymentMethod,
    clearCart, subtotal, discount_amount, tax_amount, grandTotal,
  } = usePurchaseStore();

  const [productSearch, setProductSearch] = useState("");
  const [supplierSearch, setSupplierSearch] = useState("");
  const [showSupplierSearch, setShowSupplierSearch] = useState(false);
  const [paidAmount, setPaidAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const { data: allProducts = [] } = useGetProducts({ search: productSearch });
  const { data: allSuppliersList = [] } = useGetSuppliers(supplierSearch);
  const createPurchase = useCreatePurchase();

  const filteredProducts = allProducts.filter((p) => p.is_active && !p.is_service);

  const filteredSuppliers = allSuppliersList;

  const isHutang = payment_method === "credit";
  const numPaidAmount = isHutang ? (Number(paidAmount.replace(/\D/g, "")) || 0) : grandTotal();

  const handleCheckout = async () => {
    if (items.length === 0) return;
    if (isHutang && !supplier) {
      alert("Pilih supplier terlebih dahulu untuk transaksi hutang/tempo.");
      return;
    }

    setLoading(true);

    try {
      const result = await createPurchase.mutateAsync({
        items: items.map((item) => ({
          product_id: item.product.id,
          variant_id: item.variant?.id,
          product_name: item.product.name,
          qty: item.qty,
          unit_price: item.unit_price,
          subtotal: item.subtotal,
        })),
        supplier_id: supplier?.id,
        subtotal: subtotal(),
        discount_amount: discount_amount,
        tax_amount: tax_amount,
        total: grandTotal(),
        paid_amount: isHutang ? numPaidAmount : grandTotal(),
        payment_method,
        payment_status: isHutang ? (numPaidAmount > 0 ? "partial" : "unpaid") : "paid",
        notes: undefined,
      });
      setSuccess(result.purchase_number);
    } catch (err: any) {
      alert("Gagal menyimpan pembelian: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
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
          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">Pembelian Berhasil Dicatat!</h2>
          <p className="text-slate-500 text-sm mb-2">Nomor PO</p>
          <p className="font-mono font-bold text-indigo-600 text-lg mb-1">{success}</p>
          <p className="text-2xl font-bold text-slate-900 mb-6">{formatRupiah(grandTotal())}</p>
          
          {isHutang && grandTotal() - numPaidAmount > 0 && (
            <div className="bg-rose-50 rounded-xl p-3 mb-4 border border-rose-100">
              <p className="text-xs text-rose-700 font-medium">Sisa Hutang ke Supplier:</p>
              <p className="text-lg font-bold text-rose-800">{formatRupiah(grandTotal() - numPaidAmount)}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button className="btn btn-outline flex-1">
              <Printer className="w-4 h-4" /> Cetak PO
            </button>
            <button onClick={handleNewTransaction} className="btn btn-primary flex-1 bg-indigo-600 hover:bg-indigo-700">
              PO Baru
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
          <h1 className="text-xl font-bold text-slate-900">Pembelian Baru (PO)</h1>
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
            placeholder="Cari produk untuk dikulak..."
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
              const inCart = items.find((i) => i.product.id === product.id);
              return (
                <button
                  key={product.id}
                  onClick={() => addItem(product)}
                  className={cn(
                    "card p-3 text-left transition-all hover:shadow-md hover:-translate-y-0.5 active:scale-95",
                    inCart && "ring-2 ring-indigo-500"
                  )}
                >
                  <div className="w-full aspect-square rounded-xl bg-slate-100 flex items-center justify-center mb-2">
                    <PackagePlus className="w-6 h-6 text-slate-300" />
                  </div>
                  <p className="text-xs font-semibold text-slate-800 line-clamp-2 leading-snug mb-1">
                    {product.name}
                  </p>
                  <p className="text-sm font-bold text-indigo-600">
                    {formatRupiah(product.buy_price)}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-[11px] text-slate-400">Stok Saat Ini: {product.stock}</p>
                    {inCart && (
                      <span className="text-[11px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full font-bold">
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
                <PackagePlus className="w-8 h-8" />
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
            <h2 className="font-bold text-slate-800">Daftar Beli</h2>
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-slate-400 hover:text-rose-500 transition-colors"
              >
                Kosongkan
              </button>
            )}
          </div>

          {/* Supplier Selection */}
          <div className="relative">
            <button
              onClick={() => setShowSupplierSearch(!showSupplierSearch)}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-colors text-left text-sm",
                isHutang && !supplier ? "border-rose-300 bg-rose-50" : "border-slate-200 hover:border-indigo-300"
              )}
            >
              <Building2 className={cn("w-4 h-4 flex-shrink-0", isHutang && !supplier ? "text-rose-500" : "text-slate-400")} />
              <span className={cn("flex-1 truncate", supplier ? "text-slate-800 font-medium" : (isHutang ? "text-rose-600 font-medium" : "text-slate-400"))}>
                {supplier?.name ?? (isHutang ? "Pilih supplier (Wajib untuk Hutang)" : "Pilih supplier (opsional)")}
              </span>
              {supplier && (
                <X
                  className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600"
                  onClick={(e) => { e.stopPropagation(); setSupplier(null); }}
                />
              )}
            </button>

            {showSupplierSearch && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowSupplierSearch(false)} />
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-slate-100 z-20 overflow-hidden animate-scale-in">
                  <div className="p-2 border-b border-slate-100">
                    <input
                      autoFocus
                      className="input text-sm py-2"
                      placeholder="Cari supplier..."
                      value={supplierSearch}
                      onChange={(e) => setSupplierSearch(e.target.value)}
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {filteredSuppliers.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => { setSupplier(s); setShowSupplierSearch(false); setSupplierSearch(""); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 text-left text-sm"
                      >
                        <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs flex-shrink-0">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{s.name}</p>
                          {s.contact_name && <p className="text-slate-400 text-xs">PIC: {s.contact_name}</p>}
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
              <PackagePlus className="w-12 h-12 text-slate-200 mb-3" />
              <p className="text-slate-400 text-sm">Belum ada barang di daftar PO</p>
              <p className="text-slate-300 text-xs mt-1">Klik produk di sebelah kiri untuk menambah</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => {
                const key = item.variant?.id ?? item.product.id;
                return (
                  <div key={key} className="flex gap-3 p-3 rounded-xl border border-slate-100 hover:border-indigo-100 bg-slate-50/50 group">
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-sm font-semibold text-slate-800 line-clamp-1">{item.product.name}</p>
                        <button
                          onClick={() => removeItem(item.product.id, item.variant?.id)}
                          className="text-slate-300 hover:text-rose-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <label className="text-[10px] text-slate-500 font-medium">Harga Beli (HPP)</label>
                          <input 
                            type="number"
                            className="input text-xs py-1 px-2 h-auto text-indigo-700 font-medium bg-white"
                            value={item.unit_price}
                            onChange={(e) => updatePrice(item.product.id, item.variant?.id, Number(e.target.value))}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 font-medium">Kuantitas</label>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => updateQty(item.product.id, item.variant?.id, item.qty - 1)}
                              className="w-6 h-6 rounded border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center"
                            >
                              <Minus className="w-3 h-3 text-slate-600" />
                            </button>
                            <input 
                              type="number" 
                              className="input text-xs py-1 px-2 h-auto text-center font-medium w-full min-w-0 bg-white" 
                              value={item.qty}
                              onChange={(e) => updateQty(item.product.id, item.variant?.id, Number(e.target.value))}
                            />
                            <button
                              onClick={() => updateQty(item.product.id, item.variant?.id, item.qty + 1)}
                              className="w-6 h-6 rounded border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center"
                            >
                              <Plus className="w-3 h-3 text-indigo-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 text-right">
                        <p className="text-xs text-slate-500">Subtotal: <span className="font-bold text-slate-800">{formatRupiah(item.subtotal)}</span></p>
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
                <span>Total Barang</span>
                <span className="font-medium text-slate-700">{formatRupiah(subtotal())}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-slate-900 pt-1.5 border-t border-slate-100">
                <span>Total Tagihan</span>
                <span className="text-indigo-600">{formatRupiah(grandTotal())}</span>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-2">PEMBAYARAN KE SUPPLIER</p>
              <div className="grid grid-cols-3 gap-1.5">
                {paymentMethods.map((pm) => (
                  <button
                    key={pm.key}
                    onClick={() => setPaymentMethod(pm.key)}
                    className={cn(
                      "flex flex-col items-center gap-1 p-2 rounded-xl border text-xs font-medium transition-all",
                      payment_method === pm.key
                        ? "border-indigo-400 bg-indigo-50 text-indigo-700"
                        : "border-slate-200 text-slate-500 hover:border-indigo-200 hover:bg-indigo-50/50"
                    )}
                  >
                    {pm.icon}
                    {pm.label}
                  </button>
                ))}
              </div>
            </div>

            {/* DP / Paid Amount for Credit */}
            {isHutang && (
              <div className="animate-in fade-in slide-in-from-top-2">
                <label className="input-label text-xs">Uang Muka / DP Dibayarkan</label>
                <input
                  className="input font-semibold"
                  placeholder="Rp 0"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value.replace(/\D/g, ""))}
                />
                <p className="text-[10px] text-rose-500 mt-1 font-medium text-right">
                  Sisa Hutang: {formatRupiah(grandTotal() - numPaidAmount)}
                </p>
              </div>
            )}

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={loading || items.length === 0 || (isHutang && !supplier)}
              className={cn(
                "btn btn-lg w-full justify-center",
                isHutang && !supplier ? "btn-disabled cursor-not-allowed" : "btn-primary bg-indigo-600 hover:bg-indigo-700"
              )}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Simpan Pembelian
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
