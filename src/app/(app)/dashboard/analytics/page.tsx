"use client";
// src/app/(app)/dashboard/analytics/page.tsx
import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, TrendingUp, TrendingDown, Users, Package, DollarSign, Filter, Download } from "lucide-react";
import { cn, formatRupiah } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { mockDashboardSummary, mockTopProducts, mockCustomers } from "@/lib/mock-data";

// Generate mock data for income vs expense (last 6 months)
const monthlyData = [
  { name: "Apr", income: 15_000_000, expense: 12_000_000 },
  { name: "Mei", income: 18_500_000, expense: 14_200_000 },
  { name: "Jun", income: 22_000_000, expense: 16_500_000 },
  { name: "Jul", income: 21_500_000, expense: 17_000_000 },
  { name: "Ags", income: 26_000_000, expense: 18_500_000 },
  { name: "Sep", income: 28_450_000, expense: 19_200_000 },
];

const categoryData = [
  { name: "Makanan", value: 45, color: "#10b981" },
  { name: "Minuman", value: 25, color: "#3b82f6" },
  { name: "Snack", value: 20, color: "#f59e0b" },
  { name: "Lainnya", value: 10, color: "#64748b" },
];

const topCustomers = mockCustomers.slice(0, 5).map((c, i) => ({
  ...c,
  total_spent: 4500000 - (i * 800000), // Deterministic pseudo-random
  transactions: 15 - (i * 2)
})).sort((a, b) => b.total_spent - a.total_spent);

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<"7d" | "30d" | "6m" | "1y">("6m");
  const summary = mockDashboardSummary;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Analytics Dashboard</h1>
            <p className="text-slate-500 text-sm mt-0.5">Analisis mendalam performa bisnis Anda</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="input h-9 py-1 text-sm bg-white"
            value={period}
            onChange={(e) => setPeriod(e.target.value as any)}
          >
            <option value="7d">7 Hari Terakhir</option>
            <option value="30d">30 Hari Terakhir</option>
            <option value="6m">6 Bulan Terakhir</option>
            <option value="1y">Tahun Ini</option>
          </select>
          <button className="btn btn-outline btn-sm h-9">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <DollarSign className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-medium">Total Pendapatan</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">{formatRupiah(summary.revenue)}</p>
          <p className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> +12.5% dari periode lalu
          </p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <TrendingDown className="w-4 h-4 text-rose-500" />
            <h3 className="text-sm font-medium">Total Pengeluaran</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">{formatRupiah(summary.expenses)}</p>
          <p className="text-xs text-rose-600 font-medium flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> +5.2% dari periode lalu
          </p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Users className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-medium">Pelanggan Aktif</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">142</p>
          <p className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> +18 user baru
          </p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Package className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-medium">Produk Terjual</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">894</p>
          <p className="text-xs text-slate-400 font-medium mt-1">Rata-rata 30/hari</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Chart: Income vs Expense */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-slate-800">Pendapatan vs Pengeluaran</h3>
              <p className="text-sm text-slate-500 mt-0.5">Tren arus kas bisnis Anda</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `Rp ${val / 1000000}M`} />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(val: any) => formatRupiah(val)}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                <Bar dataKey="income" name="Pendapatan" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="expense" name="Pengeluaran" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="card p-5">
          <h3 className="font-bold text-slate-800 mb-6">Penjualan per Kategori</h3>
          <div className="h-[200px] w-full mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => `${val}%`}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {categoryData.map(cat => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-sm font-medium text-slate-700">{cat.name}</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Customers */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800">Top Pelanggan</h3>
            <button className="text-emerald-600 text-sm font-semibold hover:text-emerald-700">Lihat Semua</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-2 font-medium text-slate-500">Pelanggan</th>
                  <th className="pb-2 font-medium text-slate-500 text-right">Trx</th>
                  <th className="pb-2 font-medium text-slate-500 text-right">Total Belanja</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {topCustomers.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3">
                      <p className="font-semibold text-slate-800">{c.name}</p>
                      <p className="text-xs text-slate-400">{c.phone || "-"}</p>
                    </td>
                    <td className="py-3 text-right font-medium text-slate-600">{c.transactions}x</td>
                    <td className="py-3 text-right font-bold text-emerald-600">{formatRupiah(c.total_spent)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800">Pergerakan Produk</h3>
            <button className="text-emerald-600 text-sm font-semibold hover:text-emerald-700">Lihat Laporan</button>
          </div>
          <div className="space-y-4">
            {mockTopProducts.slice(0, 4).map((product, idx) => (
              <div key={product.product_id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center font-bold text-slate-400">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{product.product_name}</p>
                    <p className="text-xs text-slate-500">{product.qty_sold} unit terjual</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900 text-sm">{formatRupiah(product.qty_sold * 15000)}</p>
                  <p className="text-[11px] text-emerald-600 flex items-center gap-0.5 justify-end mt-0.5">
                    <TrendingUp className="w-3 h-3" /> 12%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
