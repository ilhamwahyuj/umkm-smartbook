"use client";
// src/app/(app)/transaksi/pengeluaran/page.tsx
import { useState } from "react";
import Link from "next/link";
import { Plus, Search, TrendingDown, Download, Loader2 } from "lucide-react";
import { cn, formatRupiah, formatDate } from "@/lib/utils";
import { useGetExpenses } from "@/hooks/api/useExpenses";

export default function PengeluaranPage() {
  const [search, setSearch] = useState("");

  const { data: expenses = [], isLoading } = useGetExpenses(search);

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pengeluaran</h1>
          <p className="text-slate-500 text-sm mt-0.5">Catat semua pengeluaran operasional</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-outline btn-sm">
            <Download className="w-4 h-4" /> Export
          </button>
          <Link href="/transaksi/pengeluaran/baru" className="btn btn-primary">
            <Plus className="w-4 h-4" /> Tambah Pengeluaran
          </Link>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4 col-span-1">
          <p className="text-slate-500 text-xs font-medium">Total Bulan Ini</p>
          <p className="text-2xl font-bold text-rose-600 mt-1">{formatRupiah(totalExpense)}</p>
          <p className="text-xs text-slate-400 mt-0.5">{expenses.length} pengeluaran</p>
        </div>
        <div className="card p-4 col-span-2">
          <p className="text-slate-500 text-xs font-medium mb-3">Pengeluaran per Kategori</p>
          <div className="space-y-2">
            {expenses.map((e) => (
              <div key={e.id} className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-600 w-24 truncate">{e.category?.name ?? "Lainnya"}</span>
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-400 rounded-full"
                    style={{ width: totalExpense > 0 ? `${(e.amount / totalExpense) * 100}%` : '0%' }}
                  />
                </div>
                <span className="text-sm font-bold text-slate-700 w-24 text-right">{formatRupiah(e.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            className="input pl-9"
            placeholder="Cari kategori atau keterangan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            <span className="ml-2 text-slate-500 text-sm">Memuat data pengeluaran...</span>
          </div>
        ) : expenses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <TrendingDown className="w-8 h-8" />
            </div>
            <p className="empty-state-title">Belum ada pengeluaran</p>
            <p className="empty-state-desc">Catat pengeluaran pertama Anda</p>
            <Link href="/transaksi/pengeluaran/baru" className="btn btn-primary">
              <Plus className="w-4 h-4" /> Tambah Pengeluaran
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Kategori</th>
                  <th>Keterangan</th>
                  <th>Metode</th>
                  <th>Nominal</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id}>
                    <td className="text-slate-600 text-sm">{formatDate(expense.expense_date)}</td>
                    <td>
                      {expense.category && (
                        <span
                          className="badge badge-neutral"
                          style={{ borderColor: expense.category.color ?? undefined }}
                        >
                          {expense.category.name}
                        </span>
                      )}
                    </td>
                    <td className="text-slate-700 text-sm">{expense.description ?? "—"}</td>
                    <td className="text-slate-500 text-sm capitalize">{expense.payment_method ?? "—"}</td>
                    <td className="font-bold text-rose-600">{formatRupiah(expense.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
