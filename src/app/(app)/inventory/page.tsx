"use client";
// src/app/(app)/inventory/page.tsx
import Link from "next/link";
import { Warehouse, AlertTriangle, Package, ClipboardList, TrendingDown } from "lucide-react";
import { cn, formatRupiah, getStockStatus } from "@/lib/utils";
import { mockProducts, mockLowStockProducts } from "@/lib/mock-data";

export default function InventoryPage() {
  const stockStats = {
    total: mockProducts.length,
    aman: mockProducts.filter((p) => getStockStatus(p.stock, p.min_stock) === "aman").length,
    menipis: mockProducts.filter((p) => getStockStatus(p.stock, p.min_stock) === "menipis").length,
    habis: mockProducts.filter((p) => getStockStatus(p.stock, p.min_stock) === "habis").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inventory</h1>
          <p className="text-slate-500 text-sm mt-0.5">Pantau dan kelola stok produk Anda</p>
        </div>
        <Link href="/inventory/adjustment" className="btn btn-outline">
          <ClipboardList className="w-4 h-4" /> Stock Opname
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Produk", value: stockStats.total, icon: Package, color: "text-slate-700", bg: "bg-slate-50", iconColor: "text-slate-500" },
          { label: "Stok Aman", value: stockStats.aman, icon: Package, color: "text-emerald-700", bg: "bg-emerald-50", iconColor: "text-emerald-500" },
          { label: "Stok Menipis", value: stockStats.menipis, icon: AlertTriangle, color: "text-amber-700", bg: "bg-amber-50", iconColor: "text-amber-500" },
          { label: "Stok Habis", value: stockStats.habis, icon: TrendingDown, color: "text-rose-700", bg: "bg-rose-50", iconColor: "text-rose-500" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={cn("card p-5", stat.bg)}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-slate-500 text-xs font-medium">{stat.label}</p>
                <Icon className={cn("w-4 h-4", stat.iconColor)} />
              </div>
              <p className={cn("text-3xl font-bold", stat.color)}>{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Low Stock Alert */}
      {mockLowStockProducts.length > 0 && (
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h3 className="font-bold text-slate-800">Peringatan Stok</h3>
            <span className="badge badge-warning">{mockLowStockProducts.length}</span>
          </div>
          <div className="space-y-3">
            {mockLowStockProducts.map((product) => {
              const pct = Math.min(100, (product.stock / product.min_stock) * 100);
              return (
                <div key={product.id} className="flex items-center gap-4 p-3 rounded-xl bg-amber-50 border border-amber-100">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <Package className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-slate-800 text-sm">{product.name}</p>
                      <span className="text-xs text-amber-700 font-bold">{product.stock}/{product.min_stock} pcs</span>
                    </div>
                    <div className="h-1.5 bg-amber-100 rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full", pct <= 0 ? "bg-rose-500" : "bg-amber-400")}
                        style={{ width: `${Math.max(2, pct)}%` }}
                      />
                    </div>
                  </div>
                  <Link
                    href={`/transaksi/pembelian/baru?product=${product.id}`}
                    className="btn btn-sm btn-outline border-amber-200 text-amber-700 hover:bg-amber-100 whitespace-nowrap"
                  >
                    Restock
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* All Products */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Semua Produk</h3>
          <Link href="/produk" className="text-emerald-600 text-sm font-semibold hover:text-emerald-700">
            Kelola Produk
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Produk</th>
                <th>SKU</th>
                <th>Stok</th>
                <th>Min. Stok</th>
                <th>Nilai Stok</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockProducts.map((product) => {
                const status = getStockStatus(product.stock, product.min_stock);
                const stockValue = product.stock * product.buy_price;
                return (
                  <tr key={product.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                          <Package className="w-4 h-4 text-slate-400" />
                        </div>
                        <p className="font-semibold text-slate-800 text-sm">{product.name}</p>
                      </div>
                    </td>
                    <td className="font-mono text-xs text-slate-500">{product.sku ?? "—"}</td>
                    <td>
                      <span className={cn(
                        "font-bold",
                        status === "habis" ? "text-rose-600" :
                        status === "menipis" ? "text-amber-600" :
                        "text-slate-800"
                      )}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="text-slate-500 text-sm">{product.min_stock}</td>
                    <td className="text-slate-700 font-medium text-sm">{formatRupiah(stockValue)}</td>
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
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
