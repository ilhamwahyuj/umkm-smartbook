"use client";
// src/app/(app)/keuangan/piutang/page.tsx
import { useState } from "react";
import { Search, CreditCard, AlertCircle, TrendingUp } from "lucide-react";
import { cn, formatRupiah, formatDate } from "@/lib/utils";
import { mockReceivables } from "@/lib/mock-data";

export default function PiutangPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"semua" | "unpaid" | "partial" | "overdue">("semua");

  const filtered = mockReceivables.filter((r) => {
    const matchSearch =
      (r.customer?.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (r.invoice_number ?? "").toLowerCase().includes(search.toLowerCase());
    
    // In real app, calculate overdue based on date
    const isOverdue = r.due_date && new Date(r.due_date) < new Date();
    const effectiveStatus = isOverdue && r.status !== "paid" ? "overdue" : r.status;
    
    const matchStatus = statusFilter === "semua" || effectiveStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPiutang = mockReceivables.reduce((sum, r) => sum + r.remaining_amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Piutang Pelanggan</h1>
          <p className="text-slate-500 text-sm mt-0.5">Pantau tagihan yang belum dibayar oleh pelanggan</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5 gradient-amber text-white">
          <div className="flex items-center gap-3 mb-2 opacity-90">
            <TrendingUp className="w-5 h-5" />
            <p className="text-sm font-medium">Total Piutang Berjalan</p>
          </div>
          <p className="text-3xl font-bold">{formatRupiah(totalPiutang)}</p>
          <p className="text-sm mt-2 opacity-80">{mockReceivables.length} tagihan belum lunas</p>
        </div>
        
        <div className="card p-5 border-emerald-200 bg-emerald-50">
          <div className="flex items-center gap-3 mb-2 text-emerald-700">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm font-medium">Jatuh Tempo &lt; 7 Hari</p>
          </div>
          <p className="text-2xl font-bold text-emerald-900">{formatRupiah(2_500_000)}</p>
          <p className="text-sm mt-2 text-emerald-700">1 tagihan mendekati batas waktu</p>
        </div>

        <div className="card p-5 border-rose-200 bg-rose-50">
          <div className="flex items-center gap-3 mb-2 text-rose-700">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm font-medium">Overdue (Terlambat)</p>
          </div>
          <p className="text-2xl font-bold text-rose-900">{formatRupiah(1_500_000)}</p>
          <p className="text-sm mt-2 text-rose-700">1 tagihan melewati batas waktu</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              className="input pl-9"
              placeholder="Cari nama pelanggan atau no invoice..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
            {(["semua", "unpaid", "partial", "overdue"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-all capitalize",
                  statusFilter === f
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon bg-emerald-50 text-emerald-500">
              <CreditCard className="w-8 h-8" />
            </div>
            <p className="empty-state-title">Tidak ada piutang</p>
            <p className="empty-state-desc">Hebat! Semua pelanggan sudah membayar lunas transaksinya.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Pelanggan</th>
                    <th>No. Invoice</th>
                    <th>Jatuh Tempo</th>
                    <th>Total Belanja</th>
                    <th>Sisa Piutang</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((receivable) => {
                    const isOverdue = receivable.due_date && new Date(receivable.due_date) < new Date();
                    
                    return (
                      <tr key={receivable.id}>
                        <td>
                          {receivable.customer ? (
                            <div>
                              <p className="font-semibold text-slate-800 text-sm">{receivable.customer.name}</p>
                              <p className="text-xs text-slate-400">{receivable.customer.phone}</p>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-sm">-</span>
                          )}
                        </td>
                        <td>
                          <p className="font-mono text-slate-600 text-sm">{receivable.invoice_number}</p>
                        </td>
                        <td>
                          {receivable.due_date ? (
                            <span className={cn("text-sm font-medium", isOverdue ? "text-rose-600" : "text-slate-600")}>
                              {formatDate(receivable.due_date)}
                            </span>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="text-slate-600">{formatRupiah(receivable.total_amount)}</td>
                        <td className="font-bold text-amber-600">{formatRupiah(receivable.remaining_amount)}</td>
                        <td>
                          {isOverdue && receivable.status !== "paid" ? (
                            <span className="badge badge-danger">Overdue</span>
                          ) : (
                            <span className={cn(
                              "badge",
                              receivable.status === "partial" ? "badge-warning" : "badge-neutral"
                            )}>
                              {receivable.status}
                            </span>
                          )}
                        </td>
                        <td>
                          <button className="btn btn-outline btn-sm h-8 px-3 text-emerald-600 border-emerald-200 hover:bg-emerald-50">Terima Dana</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
