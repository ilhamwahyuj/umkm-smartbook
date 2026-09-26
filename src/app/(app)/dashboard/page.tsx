"use client";
// src/app/(app)/dashboard/page.tsx
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  AlertTriangle,
  ExternalLink,
  ShoppingCart,
  Star,
  Clock,
  ArrowRight,
  Zap,
} from "lucide-react";
import { SalesLineChart } from "@/components/charts/SalesLineChart";
import { cn, formatRupiah, formatRelativeTime, getStockStatus } from "@/lib/utils";
import {
  mockSalesChart7Days,
  mockSalesChart30Days,
  mockTopProducts,
  mockLowStockProducts,
  mockRecentSales,
  mockInsights,
  mockDashboardSummary,
} from "@/lib/mock-data";
import { useDashboardSummary } from "@/hooks/api/useDashboard";
import { Loader2 } from "lucide-react";

type DateFilter = "hari-ini" | "minggu-ini" | "bulan-ini" | "tahun-ini";

const dateFilters: { label: string; value: DateFilter }[] = [
  { label: "Hari ini", value: "hari-ini" },
  { label: "Minggu ini", value: "minggu-ini" },
  { label: "Bulan ini", value: "bulan-ini" },
  { label: "Tahun ini", value: "tahun-ini" },
];

const paymentMethodLabel: Record<string, string> = {
  cash: "Tunai",
  transfer: "Transfer",
  qris: "QRIS",
  e_wallet: "E-Wallet",
  credit: "Kredit",
};

const paymentMethodColor: Record<string, string> = {
  cash: "badge-success",
  transfer: "badge-info",
  qris: "badge-warning",
  e_wallet: "badge-neutral",
  credit: "badge-danger",
};

export default function DashboardPage() {
  const router = useRouter();
  const [dateFilter, setDateFilter] = useState<DateFilter>("bulan-ini");
  const [isMounted, setIsMounted] = useState(false);
  const [autoUpdate, setAutoUpdate] = useState(true);
  
  const { data: realSummary, isLoading: summaryLoading } = useDashboardSummary(dateFilter);

  const chartData = dateFilter === "tahun-ini" ? mockSalesChart30Days : mockSalesChart7Days;
  const summary = realSummary || mockDashboardSummary;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? "Selamat pagi" :
    currentHour < 15 ? "Selamat siang" :
    currentHour < 18 ? "Selamat sore" : "Selamat malam";

  return (
    <div className="space-y-6 max-w-7xl mx-auto lg:p-2">
      {/* HERO HEADER: Greeting & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight" suppressHydrationWarning>
            {isMounted ? greeting : 'Selamat datang'}, {isMounted ? 'Andi' : '...'} 👋
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-0.5">Ringkasan performa penjualan, kas, dan operasional tokomu hari ini</p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <button onClick={() => router.push('/pengaturan/profil-usaha')} className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-2xl border border-slate-200/90 shadow-sm transition-all" type="button">
            <span className="material-symbols-outlined text-teal-700 text-sm">storefront</span>
            <span>Outlet Utama - Toko Anda Sentosa</span>
          </button>
          <button onClick={() => router.push('/kasir')} className="flex items-center gap-1.5 px-4 py-2.5 bg-[#0F766E] hover:bg-[#0D9488] text-white font-bold text-xs rounded-2xl shadow-sm shadow-teal-700/20 active:scale-95 transition-all" type="button">
            <span className="material-symbols-outlined text-base">add</span>
            <span>+ Transaksi Baru / Kasir</span>
          </button>
        </div>
      </div>

      {/* TOP 4 STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Pendapatan */}
        <div onClick={() => router.push('/laporan')} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Pendapatan</span>
            <div className="w-8 h-8 rounded-xl bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[18px]">payments</span>
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">{formatRupiah(summary.revenue || 84520000)}</h3>
            <div className="mt-1.5 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <span className="material-symbols-outlined text-[13px]">arrow_upward</span>
              <span>+{summary.revenue_change_percent || 14.8}% minggu ini</span>
            </div>
          </div>
        </div>
        {/* Card 2: Total Pengeluaran */}
        <div onClick={() => router.push('/keuangan/operasional')} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Pengeluaran</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[18px]">shopping_cart_checkout</span>
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Rp 22.450.000</h3>
            <div className="mt-1.5 flex items-center gap-1 text-[11px] font-bold text-rose-500">
              <span className="material-symbols-outlined text-[13px]">trending_down</span>
              <span>-3.2% vs target</span>
            </div>
          </div>
        </div>
        {/* Card 3: Laba Bersih */}
        <div onClick={() => router.push('/laporan')} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Laba Bersih</span>
            <div className="w-8 h-8 rounded-xl bg-lime-100 text-lime-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[18px]">query_stats</span>
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">{formatRupiah(summary.gross_profit || 62070000)}</h3>
            <div className="mt-1.5 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <span className="material-symbols-outlined text-[13px]">arrow_upward</span>
              <span>+18.5% margin tinggi</span>
            </div>
          </div>
        </div>
        {/* Card 4: Total Transaksi */}
        <div onClick={() => router.push('/transaksi/penjualan')} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Transaksi</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">{summary.total_transactions || 1530} Pesanan</h3>
            <div className="mt-1.5 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <span className="material-symbols-outlined text-[13px]">arrow_upward</span>
              <span>+5.9% minggu ini</span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN VISUALIZATION ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Smooth Wave Chart */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Tren Penjualan &amp; Pesanan Harian</h2>
              <p className="text-xs text-slate-400 mt-0.5">Pantau volume transaksi per hari</p>
            </div>
            <button onClick={() => setAutoUpdate(!autoUpdate)} className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors", autoUpdate ? "bg-teal-50 hover:bg-teal-100 border-teal-200 text-teal-700" : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700")} type="button">
              <span className={cn("material-symbols-outlined text-[15px]", autoUpdate ? "text-teal-600 animate-spin" : "text-slate-400")} style={autoUpdate ? { animationDuration: '3s' } : {}}>autorenew</span>
              <span>{autoUpdate ? 'Auto Update' : 'Update Mati'}</span>
            </button>
          </div>
          
          <div className="relative w-full h-64 mt-3 select-none">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 700 230">
              <defs>
                <linearGradient id="smoothLimeGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#A7F3D0" stopOpacity="0.65"></stop>
                  <stop offset="60%" stopColor="#CCFBF1" stopOpacity="0.3"></stop>
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0"></stop>
                </linearGradient>
              </defs>
              <line stroke="#F1F5F9" strokeDasharray="3 3" strokeWidth="1.2" x1="45" x2="680" y1="20" y2="20"></line>
              <text fill="#94A3B8" fontFamily="Plus Jakarta Sans" fontSize="11" x="15" y="24">300</text>
              <line stroke="#F1F5F9" strokeDasharray="3 3" strokeWidth="1.2" x1="45" x2="680" y1="70" y2="70"></line>
              <text fill="#94A3B8" fontFamily="Plus Jakarta Sans" fontSize="11" x="15" y="74">225</text>
              <line stroke="#F1F5F9" strokeDasharray="3 3" strokeWidth="1.2" x1="45" x2="680" y1="120" y2="120"></line>
              <text fill="#94A3B8" fontFamily="Plus Jakarta Sans" fontSize="11" x="15" y="124">150</text>
              <line stroke="#F1F5F9" strokeDasharray="3 3" strokeWidth="1.2" x1="45" x2="680" y1="170" y2="170"></line>
              <text fill="#94A3B8" fontFamily="Plus Jakarta Sans" fontSize="11" x="20" y="174">75</text>
              <line stroke="#E2E8F0" strokeWidth="1.2" x1="45" x2="680" y1="205" y2="205"></line>
              <text fill="#94A3B8" fontFamily="Plus Jakarta Sans" fontSize="11" x="25" y="208">0</text>
              
              <path d="M 45,190 C 100,140 120,95 160,110 C 200,125 240,145 280,120 C 320,95 340,55 380,68 C 420,80 470,25 530,30 C 600,35 640,65 680,75 L 680,205 L 45,205 Z" fill="url(#smoothLimeGrad)"></path>
              <path d="M 45,190 C 100,140 120,95 160,110 C 200,125 240,145 280,120 C 320,95 340,55 380,68 C 420,80 470,25 530,30 C 600,35 640,65 680,75" fill="none" stroke="#10B981" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path>
              
              <circle cx="380" cy="68" fill="#10B981" r="5" stroke="#FFFFFF" strokeWidth="2.5"></circle>
              
              <text fill="#64748B" fontFamily="Plus Jakarta Sans" fontSize="11" fontWeight="500" x="42" y="222">Sen</text>
              <text fill="#64748B" fontFamily="Plus Jakarta Sans" fontSize="11" fontWeight="500" x="145" y="222">Sel</text>
              <text fill="#0F766E" fontFamily="Plus Jakarta Sans" fontSize="11" fontWeight="700" x="260" y="222">Rab</text>
              <text fill="#64748B" fontFamily="Plus Jakarta Sans" fontSize="11" fontWeight="500" x="370" y="222">Kam</text>
              <text fill="#64748B" fontFamily="Plus Jakarta Sans" fontSize="11" fontWeight="500" x="475" y="222">Jum</text>
              <text fill="#64748B" fontFamily="Plus Jakarta Sans" fontSize="11" fontWeight="500" x="575" y="222">Sab</text>
              <text fill="#64748B" fontFamily="Plus Jakarta Sans" fontSize="11" fontWeight="500" x="660" y="222">Min</text>
            </svg>
            
            <div className="absolute left-[48%] top-[12%] -translate-x-1/2 bg-white px-3.5 py-1.5 rounded-2xl border border-slate-100 shadow-md flex flex-col items-center pointer-events-none">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rabu</span>
              <span className="text-xs font-extrabold text-slate-900">230 Pesanan <span className="text-teal-700 font-bold">({formatRupiah(14800000)})</span></span>
            </div>
          </div>
        </div>

        {/* Right: 3 Quick Metric Cards */}
        <div className="lg:col-span-4 space-y-4">
          {/* Card 1: Active Cashiers */}
          <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center font-bold shrink-0">
                <span className="material-symbols-outlined text-2xl">person</span>
              </div>
              <div>
                <span className="text-xs font-medium text-slate-400">Kasir Bertugas</span>
                <h4 className="text-lg font-extrabold text-slate-900 leading-tight">4 Staf</h4>
                <p className="text-[11px] text-slate-500">Kasir 1, 2, 3 &amp; Barista aktif</p>
              </div>
            </div>
            <button onClick={() => router.push('/pengaturan/pengguna')} className="text-slate-300 hover:text-teal-600 transition-colors" type="button" title="Kelola Staf">
              <span className="material-symbols-outlined text-base">more_vert</span>
            </button>
          </div>

          {/* Card 2: Total Products */}
          <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-lime-100 text-lime-800 flex items-center justify-center font-bold shrink-0">
                <span className="material-symbols-outlined text-2xl">inventory_2</span>
              </div>
              <div>
                <span className="text-xs font-medium text-slate-400">Total Produk Terdaftar</span>
                <h4 className="text-lg font-extrabold text-slate-900 leading-tight">128 Item</h4>
                <p className="text-[11px] text-slate-500">Tersebar di 6 kategori aktif</p>
              </div>
            </div>
            <button onClick={() => router.push('/inventory')} className="text-slate-300 hover:text-teal-600 transition-colors" type="button" title="Lihat Inventori">
              <span className="material-symbols-outlined text-base">more_vert</span>
            </button>
          </div>

          {/* Card 3: Payment Methods */}
          <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between pb-2">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Distribusi Metode Bayar</h4>
                <p className="text-[11px] text-slate-400">Realisasi penerimaan pelanggan</p>
              </div>
              <button onClick={() => router.push('/laporan')} className="text-slate-300 hover:text-teal-600 transition-colors" type="button" title="Lihat Laporan Pembayaran">
                <span className="material-symbols-outlined text-base">more_vert</span>
              </button>
            </div>
            
            <div className="flex items-end justify-around h-36 pt-2 pb-1">
              {/* QRIS */}
              <div className="flex flex-col items-center gap-1.5 w-14">
                <span className="text-[10px] font-extrabold text-white bg-teal-600 px-2 py-0.5 rounded-full shadow-sm">105</span>
                <div className="w-10 h-24 rounded-t-xl diagonal-stripes-teal border border-teal-500/20"></div>
                <span className="text-[10px] font-bold text-slate-600 mt-1">QRIS</span>
              </div>
              {/* Cash */}
              <div className="flex flex-col items-center gap-1.5 w-14">
                <span className="text-[10px] font-extrabold text-white bg-amber-500 px-2 py-0.5 rounded-full shadow-sm">68</span>
                <div className="w-10 h-16 rounded-t-xl diagonal-stripes-amber border border-amber-400/20"></div>
                <span className="text-[10px] font-bold text-slate-600 mt-1">Tunai</span>
              </div>
              {/* Transfer */}
              <div className="flex flex-col items-center gap-1.5 w-14">
                <span className="text-[10px] font-extrabold text-white bg-slate-600 px-2 py-0.5 rounded-full shadow-sm">43</span>
                <div className="w-10 h-12 rounded-t-xl diagonal-stripes-slate border border-slate-300"></div>
                <span className="text-[10px] font-bold text-slate-600 mt-1">Transfer</span>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-3 pt-2 text-[11px] border-t border-slate-50">
              <span className="flex items-center gap-1 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-sm bg-teal-600"></span> QRIS (48%)
              </span>
              <span className="flex items-center gap-1 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span> Tunai (32%)
              </span>
              <span className="flex items-center gap-1 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-400"></span> Kartu (20%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Widget 1: Top Selling Products */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Produk Terlaris</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Paling digemari pelanggan hari ini</p>
              </div>
              <span className="material-symbols-outlined text-slate-400">workspace_premium</span>
            </div>
            
            <div className="flex flex-col gap-3.5 mt-2">
              {/* Item 1 */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-teal-50 text-teal-700 text-[10px] font-bold flex items-center justify-center flex-shrink-0">1</span>
                    <span className="text-xs font-bold text-slate-800 truncate">Kopi Susu Aren Berkah</span>
                  </div>
                  <span className="text-[11px] font-bold text-teal-700 flex-shrink-0">68 cup</span>
                </div>
                <div className="w-full bg-slate-50 rounded-full h-2 overflow-hidden border border-slate-100">
                  <div className="h-full rounded-full diagonal-stripes-lime" style={{ width: '100%' }}></div>
                </div>
              </div>
              
              {/* Item 2 */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold flex items-center justify-center flex-shrink-0">2</span>
                    <span className="text-xs font-bold text-slate-800 truncate">Almond Croissant Toast</span>
                  </div>
                  <span className="text-[11px] font-bold text-amber-600 flex-shrink-0">34 pcs</span>
                </div>
                <div className="w-full bg-slate-50 rounded-full h-2 overflow-hidden border border-slate-100">
                  <div className="h-full rounded-full diagonal-stripes-amber" style={{ width: '50%' }}></div>
                </div>
              </div>
              
              {/* Item 3 */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold flex items-center justify-center flex-shrink-0">3</span>
                    <span className="text-xs font-bold text-slate-800 truncate">Matcha Latte Cream</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 flex-shrink-0">24 cup</span>
                </div>
                <div className="w-full bg-slate-50 rounded-full h-2 overflow-hidden border border-slate-100">
                  <div className="h-full rounded-full diagonal-stripes-teal" style={{ width: '35%' }}></div>
                </div>
              </div>
              
              {/* Item 4 */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold flex items-center justify-center flex-shrink-0">4</span>
                    <span className="text-xs font-bold text-slate-800 truncate">V60 Manual Brew Gayo</span>
                  </div>
                  <span className="text-[11px] font-bold text-sky-600 flex-shrink-0">18 cup</span>
                </div>
                <div className="w-full bg-slate-50 rounded-full h-2 overflow-hidden border border-slate-100">
                  <div className="h-full rounded-full diagonal-stripes-slate" style={{ width: '26%' }}></div>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400">Total item terjual hari ini</span>
            <span className="font-extrabold text-slate-900">144 Item</span>
          </div>
        </div>

        {/* Widget 2: Recent Transactions */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3">
              <h3 className="text-sm font-bold text-slate-900">Transaksi Kasir Terkini</h3>
              <button onClick={() => router.push('/transaksi/penjualan')} className="text-slate-300 hover:text-teal-600 transition-colors" type="button" title="Lihat Semua Transaksi">
                <span className="material-symbols-outlined text-base">more_vert</span>
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              <div className="py-2 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-slate-800">Latte Aren 500ml</h5>
                  <span className="text-[10px] text-slate-400 font-mono">TRX-10231 • Kasir 1</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-slate-900">{formatRupiah(35000)}</span>
                  <p className="text-[10px] font-bold text-emerald-600">Berhasil</p>
                </div>
              </div>
              <div className="py-2 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-slate-800">Croissant Butter</h5>
                  <span className="text-[10px] text-slate-400 font-mono">TRX-10232 • Kasir 2</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-slate-900">{formatRupiah(28000)}</span>
                  <p className="text-[10px] font-bold text-emerald-600">Berhasil</p>
                </div>
              </div>
              <div className="py-2 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-slate-800">Beras Premium 5kg</h5>
                  <span className="text-[10px] text-slate-400 font-mono">TRX-10233 • Kasir 1</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-slate-900">{formatRupiah(72000)}</span>
                  <p className="text-[10px] font-bold text-emerald-600">Berhasil</p>
                </div>
              </div>
              <div className="py-2 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-slate-800">Es Kopi Susu x3</h5>
                  <span className="text-[10px] text-slate-400 font-mono">TRX-10234 • Barista</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-slate-900">{formatRupiah(54000)}</span>
                  <p className="text-[10px] font-bold text-emerald-600">Berhasil</p>
                </div>
              </div>
            </div>
          </div>
          <Link className="pt-3 mt-1 text-center text-xs font-bold text-teal-700 hover:text-teal-800 transition-colors block border-t border-slate-100" href="/transaksi/penjualan">
            Lihat Semua Transaksi &rarr;
          </Link>
        </div>

        {/* Widget 3: Low Stock Alert */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-amber-500 text-lg">warning</span>
                <h3 className="text-sm font-bold text-slate-900">Peringatan Stok Kritis</h3>
              </div>
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">3 Item</span>
            </div>
            <div className="divide-y divide-slate-100">
              <div onClick={() => router.push('/inventory')} className="py-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 rounded-xl px-1 -mx-1 transition-colors">
                <div>
                  <h5 className="text-xs font-bold text-slate-800">Biji Kopi Arabika</h5>
                  <span className="text-[10px] text-slate-400">Min. stok: 15 Pcs</span>
                </div>
                <span className="text-xs font-extrabold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100">Sisa 4 Pcs</span>
              </div>
              <div onClick={() => router.push('/inventory')} className="py-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 rounded-xl px-1 -mx-1 transition-colors">
                <div>
                  <h5 className="text-xs font-bold text-slate-800">Susu UHT Diamond 1L</h5>
                  <span className="text-[10px] text-slate-400">Min. stok: 24 Kotak</span>
                </div>
                <span className="text-xs font-extrabold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100">Sisa 8 Kotak</span>
              </div>
              <div onClick={() => router.push('/inventory')} className="py-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 rounded-xl px-1 -mx-1 transition-colors">
                <div>
                  <h5 className="text-xs font-bold text-slate-800">Cup Gelas 12oz</h5>
                  <span className="text-[10px] text-slate-400">Min. stok: 50 Pcs</span>
                </div>
                <span className="text-xs font-extrabold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">Sisa 12 Pcs</span>
              </div>
            </div>
          </div>
          <div className="pt-3 mt-1 border-t border-slate-100">
            <button onClick={() => router.push('/transaksi/pembelian')} className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200/90 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]" type="button">
              <span className="material-symbols-outlined text-[16px] text-teal-700">add_shopping_cart</span>
              <span>Restock Cepat via Pembelian</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}