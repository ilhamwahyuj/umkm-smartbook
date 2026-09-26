"use client";
// src/app/(app)/produk/page.tsx
import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Package,
  Edit,
  Trash2,
  MoreVertical,
  Barcode,
  Loader2,
} from "lucide-react";
import { cn, formatRupiah, getStockStatus } from "@/lib/utils";
import { useGetProducts, useDeleteProduct } from "@/hooks/api/useProducts";
import type { Product } from "@/types/database";

type StockFilter = "semua" | "aman" | "menipis" | "habis";

export default function ProdukPage() {
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState<StockFilter>("semua");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const { data: products = [], isLoading } = useGetProducts({ search, stockFilter });
  const deleteProduct = useDeleteProduct();

  const stockCounts = {
    aman: products.filter((p) => getStockStatus(p.stock, p.min_stock) === "aman").length,
    menipis: products.filter((p) => getStockStatus(p.stock, p.min_stock) === "menipis").length,
    habis: products.filter((p) => getStockStatus(p.stock, p.min_stock) === "habis").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Produk</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {products.length} produk terdaftar
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/produk/tambah" className="btn btn-primary">
            <Plus className="w-4 h-4" />
            Tambah Produk
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Produk", value: products.length, color: "text-slate-800", bg: "bg-slate-50" },
          { label: "Stok Aman", value: stockCounts.aman, color: "text-emerald-700", bg: "bg-emerald-50" },
          { label: "Stok Menipis", value: stockCounts.menipis, color: "text-amber-700", bg: "bg-amber-50" },
          { label: "Stok Habis", value: stockCounts.habis, color: "text-rose-700", bg: "bg-rose-50" },
        ].map((stat) => (
          <div key={stat.label} className={cn("card p-4", stat.bg)}>
            <p className={cn("text-2xl font-bold", stat.color)}>{stat.value}</p>
            <p className="text-slate-500 text-xs mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              className="input pl-9"
              placeholder="Cari nama, SKU, atau barcode..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
            {(["semua", "aman", "menipis", "habis"] as StockFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setStockFilter(f)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-all capitalize",
                  stockFilter === f
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                {f === "semua" ? "Semua" : f.charAt(0).toUpperCase() + f.slice(1)}
                {f !== "semua" && (
                  <span className={cn(
                    "ml-1.5 text-xs",
                    f === "aman" ? "text-emerald-500" :
                    f === "menipis" ? "text-amber-500" : "text-rose-500"
                  )}>
                    {stockCounts[f as keyof typeof stockCounts]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Table */}
      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            <span className="ml-2 text-slate-500 text-sm">Memuat data produk...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Package className="w-8 h-8" />
            </div>
            <p className="empty-state-title">Produk tidak ditemukan</p>
            <p className="empty-state-desc">
              {search ? `Tidak ada produk dengan kata kunci "${search}"` : "Belum ada produk yang ditambahkan"}
            </p>
            {!search && (
              <Link href="/produk/tambah" className="btn btn-primary">
                <Plus className="w-4 h-4" /> Tambah Produk Pertama
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Produk</th>
                  <th>SKU / Barcode</th>
                  <th>Kategori</th>
                  <th>Harga Beli</th>
                  <th>Harga Jual</th>
                  <th>Stok</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const status = getStockStatus(product.stock, product.min_stock);
                  return (
                    <tr key={product.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                            <Package className="w-5 h-5 text-slate-400" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">{product.name}</p>
                            {product.description && (
                              <p className="text-xs text-slate-400 truncate max-w-[200px]">{product.description}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="space-y-1">
                          {product.sku && (
                            <p className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded w-fit">
                              {product.sku}
                            </p>
                          )}
                          {product.barcode && (
                            <p className="text-xs text-slate-400 flex items-center gap-1">
                              <Barcode className="w-3 h-3" /> {product.barcode}
                            </p>
                          )}
                        </div>
                      </td>
                      <td>
                        {product.category ? (
                          <span className="badge badge-neutral">{product.category.name}</span>
                        ) : (
                          <span className="text-slate-400 text-sm">—</span>
                        )}
                      </td>
                      <td className="font-medium text-slate-600">{formatRupiah(product.buy_price)}</td>
                      <td className="font-bold text-slate-800">{formatRupiah(product.sell_price)}</td>
                      <td>
                        <span className={cn(
                          "font-bold text-sm",
                          status === "habis" ? "text-rose-600" :
                          status === "menipis" ? "text-amber-600" :
                          "text-slate-800"
                        )}>
                          {product.stock}
                        </span>
                        <span className="text-slate-400 text-xs ml-1">pcs</span>
                      </td>
                      <td>
                        <span className={cn(
                          "badge",
                          status === "aman" ? "badge-success" :
                          status === "menipis" ? "badge-warning" :
                          "badge-danger"
                        )}>
                          {status === "aman" ? "Aman" : status === "menipis" ? "Menipis" : "Habis"}
                        </span>
                      </td>
                      <td>
                        <div className="relative">
                          <button
                            onClick={() => setOpenMenu(openMenu === product.id ? null : product.id)}
                            className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {openMenu === product.id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                              <div className="absolute right-0 top-9 w-40 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-20 animate-scale-in">
                                <Link href={`/produk/${product.id}/edit`} onClick={() => setOpenMenu(null)} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 text-slate-700">
                                  <Edit className="w-3.5 h-3.5" /> Edit
                                </Link>
                                <button
                                  onClick={() => {
                                    if (confirm("Hapus produk ini?")) {
                                      deleteProduct.mutate(product.id);
                                    }
                                    setOpenMenu(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-rose-50 text-rose-600"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> Hapus
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
