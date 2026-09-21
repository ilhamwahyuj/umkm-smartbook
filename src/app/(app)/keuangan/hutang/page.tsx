"use client";
// src/app/(app)/keuangan/hutang/page.tsx
import { useState } from "react";
import { Search, CreditCard, ChevronLeft, ChevronRight, AlertCircle, TrendingDown } from "lucide-react";
import { cn, formatRupiah, formatDate } from "@/lib/utils";
import { mockPayables } from "@/lib/mock-data";

export default function HutangPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"semua" | "unpaid" | "partial" | "overdue">("semua");

  const filtered = mockPayables.filter((p) => {
    const matchSearch =
      (p.supplier?.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (p.purchase_number ?? "").toLowerCase().includes(search.toLowerCase());
    
    // In real app, calculate overdue based on date
    const isOverdue = p.due_date && new Date(p.due_date) < new Date();
    const effectiveStatus = isOverdue && p.status !== "paid" ? "overdue" : p.status;
    
    const matchStatus = statusFilter === "semua" || effectiveStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalHutang = mockPayables.reduce((sum, p) => sum + p.remaining_amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hutang Usaha</h1>
          <p className="text-slate-500 text-sm mt-0.5">Pantau tagihan dan hutang ke supplier</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5 gradient-rose text-white">
          <div className="flex items-center gap-3 mb-2 opacity-90">
            <TrendingDown className="w-5 h-5" />
            <p className="text-sm font-medium">Total Hutang Berjalan</p>
          </div>
          <p className="text-3xl font-bold">{formatRupiah(totalHutang)}</p>
          <p className="text-sm mt-2 opacity-80">{mockPayables.length} tagihan belum lunas</p>
        </div>
        
        <div className="card p-5 border-amber-200 bg-amber-50">
          <div className="flex items-center gap-3 mb-2 text-amber-700">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm font-medium">Jatuh Tempo &lt; 7 Hari</p>
          </div>
          <p className="text-2xl font-bold text-amber-900">{formatRupiah(5_000_000)}</p>
          <p className="text-sm mt-2 text-amber-700">1 tagihan mendekati batas waktu</p>
        </div>

        <div className="card p-5 border-rose-200 bg-rose-50">
          <div className="flex items-center gap-3 mb-2 text-rose-700">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm font-medium">Overdue (Terlambat)</p>
          </div>
          <p className="text-2xl font-bold text-rose-900">{formatRupiah(0)}</p>
          <p className="text-sm mt-2 text-rose-700">0 tagihan melewati batas waktu</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              className="input pl-9"
              placeholder="Cari nama supplier atau no tagihan..."
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
            <p className="empty-state-title">Tidak ada hutang</p>
            <p className="empty-state-desc">Selamat! Semua hutang ke supplier sudah lunas atau belum ada tagihan baru.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Supplier</th>
                    <th>No. PO / Ref</th>
                    <th>Jatuh Tempo</th>
                    <th>Total Tagihan</th>
                    <th>Sisa Hutang</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((payable) => {
                    const isOverdue = payable.due_date && new Date(payable.due_date) < new Date();
                    
                    return (
                      <tr key={payable.id}>
                        <td>
                          {payable.supplier ? (
                            <div>
                              <p className="font-semibold text-slate-800 text-sm">{payable.supplier.name}</p>
                              <p className="text-xs text-slate-400">{payable.supplier.phone}</p>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-sm">-</span>
                          )}
                        </td>
                        <td>
                          <p className="font-mono text-slate-600 text-sm">{payable.purchase_number}</p>
                        </td>
                        <td>
                          {payable.due_date ? (
                            <span className={cn("text-sm font-medium", isOverdue ? "text-rose-600" : "text-slate-600")}>
                              {formatDate(payable.due_date)}
                            </span>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="text-slate-600">{formatRupiah(payable.total_amount)}</td>
                        <td className="font-bold text-rose-600">{formatRupiah(payable.remaining_amount)}</td>
                        <td>
                          {isOverdue && payable.status !== "paid" ? (
                            <span className="badge badge-danger">Overdue</span>
                          ) : (
                            <span className={cn(
                              "badge",
                              payable.status === "partial" ? "badge-warning" : "badge-neutral"
                            )}>
                              {payable.status}
                            </span>
                          )}
                        </td>
                        <td>
                          <button className="btn btn-primary btn-sm h-8 px-3">Bayar</button>
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
