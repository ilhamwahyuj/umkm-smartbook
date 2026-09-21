// src/app/(app)/laporan/page.tsx
import { BarChart3, FileText, Download, TrendingUp } from "lucide-react";
import Link from "next/link";

const reportTypes = [
  {
    category: "Penjualan",
    icon: "🛒",
    reports: [
      { label: "Laporan Harian", desc: "Ringkasan penjualan per hari", href: "/laporan/penjualan" },
      { label: "Laporan Mingguan", desc: "Ringkasan penjualan 7 hari" },
      { label: "Laporan Bulanan", desc: "Ringkasan penjualan per bulan" },
      { label: "Per Produk", desc: "Penjualan berdasarkan produk" },
      { label: "Per Kasir", desc: "Penjualan berdasarkan kasir" },
      { label: "Per Metode Bayar", desc: "Cash, QRIS, Transfer, dll" },
    ],
  },
  {
    category: "Keuangan",
    icon: "💰",
    reports: [
      { label: "Laba Rugi", desc: "Profit & Loss statement", href: "/laporan/keuangan" },
      { label: "Arus Kas", desc: "Cashflow report" },
      { label: "Laporan Pengeluaran", desc: "Detail semua pengeluaran" },
      { label: "Piutang", desc: "Tagihan yang belum dibayar" },
      { label: "Hutang", desc: "Kewajiban ke supplier" },
    ],
  },
  {
    category: "Inventory",
    icon: "📦",
    reports: [
      { label: "Laporan Stok", desc: "Status stok semua produk" },
      { label: "Stock Movement", desc: "Pergerakan stok masuk/keluar" },
      { label: "Produk Terlaris", desc: "Top produk berdasarkan qty" },
      { label: "Produk Slow-Moving", desc: "Produk jarang terjual" },
      { label: "Stok Habis", desc: "Produk dengan stok 0" },
    ],
  },
];

export default function LaporanPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Laporan</h1>
          <p className="text-slate-500 text-sm mt-0.5">Analisis mendalam kondisi bisnis Anda</p>
        </div>
      </div>

      {reportTypes.map((cat) => (
        <div key={cat.category} className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">{cat.icon}</span>
            <h3 className="font-bold text-slate-800">Laporan {cat.category}</h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {cat.reports.map((report) => {
              const content = (
                <>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm group-hover:text-emerald-700">
                      {report.label}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{report.desc}</p>
                  </div>
                  <TrendingUp className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 flex-shrink-0" />
                </>
              );

              const className = "flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all text-left group";

              return (report as any).href ? (
                <Link key={report.label} href={(report as any).href} className={className}>
                  {content}
                </Link>
              ) : (
                <button key={report.label} className={className}>
                  {content}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
