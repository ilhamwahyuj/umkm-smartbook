"use client";
// src/app/(app)/laporan/keuangan/page.tsx
import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Download, FileText, Search } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { mockDashboardSummary } from "@/lib/mock-data";
import { exportToExcel, exportToPDF } from "@/lib/export";

// Mock data for financial report lines
const financialLines = [
  { category: "Pendapatan Operasional", item: "Penjualan Barang", amount: mockDashboardSummary.revenue, type: "income" },
  { category: "Pendapatan Lain", item: "Layanan Antar", amount: 1500000, type: "income" },
  { category: "Harga Pokok Penjualan (HPP)", item: "Pembelian Barang/Bahan", amount: 12500000, type: "expense" },
  { category: "Beban Operasional", item: "Gaji Karyawan", amount: 8000000, type: "expense" },
  { category: "Beban Operasional", item: "Listrik & Air", amount: 1200000, type: "expense" },
  { category: "Beban Operasional", item: "Sewa Tempat", amount: 2000000, type: "expense" },
  { category: "Beban Lain-lain", item: "Lain-lain", amount: 500000, type: "expense" },
];

const exportColumns = [
  { header: "Kategori", dataKey: "category" },
  { header: "Keterangan", dataKey: "item" },
  { header: "Tipe", dataKey: "typeLabel" },
  { header: "Jumlah (Rp)", dataKey: "amountLabel" },
];

export default function LaporanKeuanganPage() {
  const [period, setPeriod] = useState("bulan-ini");
  
  const totalIncome = financialLines.filter(l => l.type === "income").reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = financialLines.filter(l => l.type === "expense").reduce((acc, curr) => acc + curr.amount, 0);
  const netProfit = totalIncome - totalExpense;

  const handleExportExcel = () => {
    const dataToExport = financialLines.map(line => ({
      category: line.category,
      item: line.item,
      typeLabel: line.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
      amountLabel: line.amount, // Raw number for excel formatting
    }));
    
    // Add summary rows at the end
    dataToExport.push({ category: "", item: "TOTAL PEMASUKAN", typeLabel: "", amountLabel: totalIncome });
    dataToExport.push({ category: "", item: "TOTAL PENGELUARAN", typeLabel: "", amountLabel: totalExpense });
    dataToExport.push({ category: "", item: "LABA BERSIH", typeLabel: "", amountLabel: netProfit });

    exportToExcel(dataToExport, exportColumns, "Laporan_Laba_Rugi_UMKM");
  };

  const handleExportPDF = () => {
    const dataToExport = financialLines.map(line => ({
      category: line.category,
      item: line.item,
      typeLabel: line.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
      amountLabel: formatRupiah(line.amount),
    }));

    // Add summary rows at the end
    dataToExport.push({ category: "", item: "TOTAL PEMASUKAN", typeLabel: "", amountLabel: formatRupiah(totalIncome) });
    dataToExport.push({ category: "", item: "TOTAL PENGELUARAN", typeLabel: "", amountLabel: formatRupiah(totalExpense) });
    dataToExport.push({ category: "", item: "LABA BERSIH", typeLabel: "", amountLabel: formatRupiah(netProfit) });

    exportToPDF(dataToExport, exportColumns, "Laporan_Laba_Rugi_UMKM", "Laporan Laba Rugi");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div className="flex items-center gap-3">
          <Link href="/laporan" className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Laporan Laba Rugi</h1>
            <p className="text-slate-500 text-sm mt-0.5">Ringkasan pendapatan dan pengeluaran bisnis</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExportExcel} className="btn btn-outline btn-sm h-9 bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300">
            <Download className="w-4 h-4" /> Excel
          </button>
          <button onClick={handleExportPDF} className="btn btn-outline btn-sm h-9 bg-white text-rose-700 border-rose-200 hover:bg-rose-50 hover:border-rose-300">
            <FileText className="w-4 h-4" /> PDF
          </button>
        </div>
      </div>

      <div className="card p-4 flex items-center gap-4 bg-slate-50">
        <span className="text-sm font-medium text-slate-500">Periode Laporan:</span>
        <select 
          className="input sm:w-48 bg-white"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        >
          <option value="bulan-ini">September 2026</option>
          <option value="bulan-lalu">Agustus 2026</option>
          <option value="tahun-ini">Tahun 2026</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 text-center uppercase tracking-wider">Laporan Laba Rugi</h2>
          <p className="text-sm text-slate-500 text-center mt-1">Periode: {period === 'bulan-ini' ? '1 - 30 September 2026' : 'Tahun 2026'}</p>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Pendapatan */}
          <div>
            <h3 className="font-bold text-emerald-700 mb-3 border-b border-emerald-100 pb-2">PEMASUKAN</h3>
            <div className="space-y-2">
              {financialLines.filter(l => l.type === 'income').map((line, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 pl-4">{line.item}</span>
                  <span className="font-medium text-slate-900">{formatRupiah(line.amount)}</span>
                </div>
              ))}
              <div className="flex items-center justify-between text-sm font-bold pt-2 mt-2 border-t border-slate-100">
                <span className="text-slate-800">Total Pemasukan</span>
                <span className="text-emerald-600">{formatRupiah(totalIncome)}</span>
              </div>
            </div>
          </div>

          {/* Pengeluaran */}
          <div>
            <h3 className="font-bold text-rose-700 mb-3 border-b border-rose-100 pb-2">PENGELUARAN</h3>
            <div className="space-y-2">
              {financialLines.filter(l => l.type === 'expense').map((line, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 pl-4">{line.item}</span>
                  <span className="font-medium text-slate-900">{formatRupiah(line.amount)}</span>
                </div>
              ))}
              <div className="flex items-center justify-between text-sm font-bold pt-2 mt-2 border-t border-slate-100">
                <span className="text-slate-800">Total Pengeluaran</span>
                <span className="text-rose-600">{formatRupiah(totalExpense)}</span>
              </div>
            </div>
          </div>

          {/* Laba Bersih */}
          <div className="mt-8 p-4 bg-slate-50 rounded-xl flex items-center justify-between">
            <span className="text-lg font-black text-slate-800 uppercase tracking-widest">Laba Bersih</span>
            <span className={`text-xl font-black ${netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {formatRupiah(netProfit)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
