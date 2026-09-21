"use client";
// src/app/(app)/transaksi/penjualan/page.tsx
import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  Download,
  ShoppingCart,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn, formatRupiah, formatDate } from "@/lib/utils";
import { mockRecentSales } from "@/lib/mock-data";

type StatusFilter = "semua" | "paid" | "partial" | "unpaid" | "void";

const statusLabel: Record<string, string> = {
  paid: "Lunas",
  partial: "Sebagian",
  unpaid: "Belum Bayar",
  void: "Batal",
};

const statusBadge: Record<string, string> = {
  paid: "badge-success",
  partial: "badge-warning",
  unpaid: "badge-danger",
  void: "badge-neutral",
};

const paymentLabel: Record<string, string> = {
  cash: "Tunai",
  transfer: "Transfer",
  qris: "QRIS",
  e_wallet: "E-Wallet",
  credit: "Piutang",
};

export default function PenjualanPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("semua");

  const filtered = mockRecentSales.filter((s) => {
    const matchSearch =
      s.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
      (s.customer?.name ?? "").toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "semua" || s.payment_status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Penjualan</h1>
          <p className="text-slate-500 text-sm mt-0.5">Kelola semua transaksi penjualan</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-outline btn-sm">
            <Download className="w-4 h-4" /> Export
          </button>
          <Link href="/transaksi/penjualan/baru" className="btn btn-primary">
            <Plus className="w-4 h-4" /> Penjualan Baru
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Hari Ini", value: formatRupiah(185_000), sub: "3 transaksi", color: "text-slate-900" },
          { label: "Sudah Lunas", value: "2", sub: "transaksi", color: "text-emerald-600" },
          { label: "Belum Lunas", value: "1", sub: "transaksi", color: "text-amber-600" },
          { label: "Total Void", value: "0", sub: "transaksi", color: "text-slate-400" },
        ].map((stat) => (
          <div key={stat.label} className="card p-4">
            <p className="text-slate-500 text-xs font-medium mb-1">{stat.label}</p>
            <p className={cn("text-xl font-bold", stat.color)}>{stat.value}</p>
            <p className="text-slate-400 text-xs">{stat.sub}</p>
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
              placeholder="Cari invoice atau nama pelanggan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
            {(["semua", "paid", "partial", "unpaid"] as StatusFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                  statusFilter === f
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                {f === "semua" ? "Semua" : statusLabel[f]}
              </button>
            ))}
          </div>
          <button className="btn btn-outline btn-sm gap-2">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <p className="empty-state-title">Belum ada transaksi</p>
            <p className="empty-state-desc">Mulai transaksi penjualan pertama Anda</p>
            <Link href="/transaksi/penjualan/baru" className="btn btn-primary">
              <Plus className="w-4 h-4" /> Penjualan Baru
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Invoice</th>
                    <th>Tanggal</th>
                    <th>Pelanggan</th>
                    <th>Total</th>
                    <th>Metode</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((sale) => (
                    <tr key={sale.id}>
                      <td>
                        <p className="font-mono font-bold text-emerald-600 text-sm">{sale.invoice_number}</p>
                      </td>
                      <td className="text-slate-600 text-sm">{formatDate(sale.created_at)}</td>
                      <td>
                        {sale.customer ? (
                          <div>
                            <p className="font-semibold text-slate-800 text-sm">{sale.customer.name}</p>
                            <p className="text-xs text-slate-400">{sale.customer.phone}</p>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-sm">Pelanggan Umum</span>
                        )}
                      </td>
                      <td className="font-bold text-slate-900">{formatRupiah(sale.total)}</td>
                      <td>
                        <span className="badge badge-neutral capitalize">
                          {paymentLabel[sale.payment_method ?? "cash"]}
                        </span>
                      </td>
                      <td>
                        <span className={cn("badge", statusBadge[sale.payment_status])}>
                          {statusLabel[sale.payment_status]}
                        </span>
                      </td>
                      <td>
                        <button className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Menampilkan {filtered.length} dari {mockRecentSales.length} transaksi
              </p>
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 font-semibold text-sm flex items-center justify-center">1</span>
                <button className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
