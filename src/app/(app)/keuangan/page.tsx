"use client";
// src/app/(app)/keuangan/page.tsx
import Link from "next/link";
import { Wallet, TrendingUp, TrendingDown, BarChart3, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn, formatRupiah } from "@/lib/utils";
import { mockDashboardSummary, mockPayables } from "@/lib/mock-data";
import { SalesLineChart } from "@/components/charts/SalesLineChart";
import { mockSalesChart30Days } from "@/lib/mock-data";

export default function KeuanganPage() {
  const summary = mockDashboardSummary;
  const hpp = summary.revenue - summary.gross_profit;
  const biayaOperasional = 9_000_000;
  const labaBersih = summary.gross_profit - biayaOperasional;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Keuangan</h1>
        <p className="text-slate-500 text-sm mt-0.5">Ringkasan keuangan bisnis Anda</p>
      </div>

      {/* Cashflow Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-slate-500 text-sm font-medium">Pemasukan</p>
          </div>
          <p className="text-2xl font-bold text-emerald-600">{formatRupiah(summary.revenue)}</p>
          <p className="text-xs text-slate-400 mt-1">Total pendapatan bulan ini</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4 text-rose-600" />
            </div>
            <p className="text-slate-500 text-sm font-medium">Pengeluaran</p>
          </div>
          <p className="text-2xl font-bold text-rose-600">{formatRupiah(summary.expenses)}</p>
          <p className="text-xs text-slate-400 mt-1">Total pengeluaran bulan ini</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-indigo-600" />
            </div>
            <p className="text-slate-500 text-sm font-medium">Arus Kas</p>
          </div>
          <p className={cn("text-2xl font-bold", summary.revenue - summary.expenses > 0 ? "text-emerald-600" : "text-rose-600")}>
            {formatRupiah(summary.revenue - summary.expenses)}
          </p>
          <p className="text-xs text-slate-400 mt-1">Saldo bersih bulan ini</p>
        </div>
      </div>

      {/* Laba Rugi */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="font-bold text-slate-800 mb-4">Laporan Laba Rugi</h3>
          <div className="space-y-3">
            {[
              { label: "Penjualan", value: summary.revenue, color: "text-slate-800", bold: true },
              { label: "HPP (Harga Pokok Penjualan)", value: -hpp, color: "text-rose-600", bold: false },
              { label: "Laba Kotor", value: summary.gross_profit, color: "text-emerald-700", bold: true, border: true },
              { label: "Biaya Operasional", value: -biayaOperasional, color: "text-rose-600", bold: false },
              { label: "Laba Bersih", value: labaBersih, color: labaBersih > 0 ? "text-emerald-700" : "text-rose-700", bold: true, border: true },
            ].map((row, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-center justify-between py-2",
                  row.border && "border-t border-slate-200 mt-1 pt-3"
                )}
              >
                <span className={cn("text-sm", row.bold ? "font-bold text-slate-800" : "text-slate-500")}>
                  {row.label}
                </span>
                <span className={cn("text-sm font-bold", row.color)}>
                  {row.value < 0 ? "- " : ""}
                  {formatRupiah(Math.abs(row.value))}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h3 className="font-bold text-slate-800 mb-4">Indikator Kesehatan Bisnis</h3>
          <div className="space-y-4">
            {[
              {
                label: "Profit Margin",
                value: Math.round((labaBersih / summary.revenue) * 100),
                color: "bg-emerald-400",
                textColor: "text-emerald-600",
              },
              {
                label: "Cash Flow",
                value: Math.round(((summary.revenue - summary.expenses) / summary.revenue) * 100),
                color: "bg-blue-400",
                textColor: "text-blue-600",
              },
              {
                label: "Expense Ratio",
                value: Math.round((summary.expenses / summary.revenue) * 100),
                color: "bg-amber-400",
                textColor: "text-amber-600",
              },
            ].map((indicator) => (
              <div key={indicator.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-slate-600">{indicator.label}</span>
                  <span className={cn("text-sm font-bold", indicator.textColor)}>{indicator.value}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all", indicator.color)}
                    style={{ width: `${indicator.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Receivables & Payables */}
          <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-slate-100">
            <Link href="/keuangan/piutang-dan-hutang" className="bg-amber-50 rounded-xl p-3 hover:bg-amber-100 transition-colors block border border-amber-100 hover:border-amber-200">
              <p className="text-xs text-amber-700 font-medium">Total Piutang</p>
              <p className="text-lg font-bold text-amber-800 mt-0.5">{formatRupiah(summary.receivables)}</p>
              <p className="text-[10px] text-amber-600 mt-1 font-medium">Lihat Detail →</p>
            </Link>
            <Link href="/keuangan/piutang-dan-hutang" className="bg-rose-50 rounded-xl p-3 hover:bg-rose-100 transition-colors block border border-rose-100 hover:border-rose-200">
              <p className="text-xs text-rose-700 font-medium">Total Hutang</p>
              <p className="text-lg font-bold text-rose-800 mt-0.5">
                {formatRupiah(mockPayables.reduce((sum, p) => sum + p.remaining_amount, 0))}
              </p>
              <p className="text-[10px] text-rose-600 mt-1 font-medium">Lihat Detail →</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Cashflow Chart */}
      <div className="card p-5">
        <h3 className="font-bold text-slate-800 mb-1">Tren Arus Kas</h3>
        <p className="text-slate-400 text-sm mb-5">30 hari terakhir</p>
        <SalesLineChart data={mockSalesChart30Days} height={200} />
      </div>
    </div>
  );
}
