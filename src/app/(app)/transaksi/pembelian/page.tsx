"use client";
// src/app/(app)/transaksi/pembelian/page.tsx
import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  Download,
  PackagePlus,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn, formatRupiah, formatDate } from "@/lib/utils";
import { mockPurchases } from "@/lib/mock-data";

type StatusFilter = "semua" | "paid" | "partial" | "unpaid";

const statusLabel: Record<string, string> = {
  paid: "Lunas",
  partial: "Sebagian",
  unpaid: "Belum Bayar",
};

const statusBadge: Record<string, string> = {
  paid: "badge-success",
  partial: "badge-warning",
  unpaid: "badge-danger",
};

const paymentLabel: Record<string, string> = {
  cash: "Tunai",
  transfer: "Transfer",
  credit: "Tempo / Hutang",
};

export default function PembelianPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("semua");

  const filtered = mockPurchases.filter((p) => {
    const matchSearch =
      p.purchase_number.toLowerCase().includes(search.toLowerCase()) ||
      (p.supplier?.name ?? "").toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "semua" || p.payment_status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pembelian</h1>
          <p className="text-slate-500 text-sm mt-0.5">Kelola transaksi kulakan & PO ke supplier</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-outline btn-sm">
            <Download className="w-4 h-4" /> Export
          </button>
          <Link href="/transaksi/pembelian/baru" className="btn btn-primary">
            <Plus className="w-4 h-4" /> Beli / Kulakan
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Pembelian", value: formatRupiah(7_700_000, { compact: true }), sub: "Bulan ini", color: "text-slate-900" },
          { label: "Lunas", value: "0", sub: "transaksi", color: "text-emerald-600" },
          { label: "Belum Lunas", value: "1", sub: "transaksi", color: "text-amber-600" },
          { label: "Total Hutang", value: formatRupiah(5_000_000, { compact: true }), sub: "Belum dibayar", color: "text-rose-600" },
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
              placeholder="Cari no PO atau nama supplier..."
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
            <div className="empty-state-icon bg-indigo-50 text-indigo-500">
              <PackagePlus className="w-8 h-8" />
            </div>
            <p className="empty-state-title">Belum ada pembelian</p>
            <p className="empty-state-desc">Catat pembelian atau kulakan dari supplier di sini</p>
            <Link href="/transaksi/pembelian/baru" className="btn btn-primary">
              <Plus className="w-4 h-4" /> Beli / Kulakan
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>No. PO / Transaksi</th>
                    <th>Tanggal</th>
                    <th>Supplier</th>
                    <th>Total Belanja</th>
                    <th>Sisa Hutang</th>
                    <th>Status Pembayaran</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((purchase) => (
                    <tr key={purchase.id}>
                      <td>
                        <p className="font-mono font-bold text-indigo-600 text-sm">{purchase.purchase_number}</p>
                      </td>
                      <td className="text-slate-600 text-sm">{formatDate(purchase.created_at)}</td>
                      <td>
                        {purchase.supplier ? (
                          <div>
                            <p className="font-semibold text-slate-800 text-sm">{purchase.supplier.name}</p>
                            <p className="text-xs text-slate-400">{purchase.supplier.phone}</p>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-sm">Supplier Umum</span>
                        )}
                      </td>
                      <td className="font-bold text-slate-900">{formatRupiah(purchase.total)}</td>
                      <td className="font-semibold text-rose-600">
                        {purchase.total - purchase.paid_amount > 0 
                          ? formatRupiah(purchase.total - purchase.paid_amount)
                          : "-"}
                      </td>
                      <td>
                        <span className={cn("badge", statusBadge[purchase.payment_status])}>
                          {statusLabel[purchase.payment_status]}
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
                Menampilkan {filtered.length} dari {mockPurchases.length} transaksi
              </p>
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 font-semibold text-sm flex items-center justify-center">1</span>
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
