"use client";
// src/app/(app)/laporan/penjualan/page.tsx
import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Download, FileText, Search, Filter } from "lucide-react";
import { formatRupiah, formatDate } from "@/lib/utils";
import { mockRecentSales } from "@/lib/mock-data";
import { exportToExcel, exportToPDF } from "@/lib/export";

const exportColumns = [
  { header: "No. Invoice", dataKey: "invoice" },
  { header: "Tanggal", dataKey: "date" },
  { header: "Pelanggan", dataKey: "customer" },
  { header: "Kasir", dataKey: "cashier" },
  { header: "Total Penjualan", dataKey: "total" },
  { header: "Metode Bayar", dataKey: "payment" },
  { header: "Status", dataKey: "status" },
];

export default function LaporanPenjualanPage() {
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("bulan-ini");

  // In a real app, filtering logic would be more robust
  const filteredSales = mockRecentSales.filter((sale) => 
    sale.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
    (sale.customer?.name || "Umum").toLowerCase().includes(search.toLowerCase())
  );

  const handleExportExcel = () => {
    const dataToExport = filteredSales.map(sale => ({
      invoice: sale.invoice_number,
      date: formatDate(sale.created_at),
      customer: sale.customer?.name || "Pelanggan Umum",
      cashier: sale.cashier_id || "-",
      total: formatRupiah(sale.total),
      payment: sale.payment_method?.toUpperCase() || "CASH",
      status: sale.payment_status?.toUpperCase() || "PAID"
    }));
    exportToExcel(dataToExport, exportColumns, "Laporan_Penjualan_UMKM");
  };

  const handleExportPDF = () => {
    const dataToExport = filteredSales.map(sale => ({
      invoice: sale.invoice_number,
      date: formatDate(sale.created_at),
      customer: sale.customer?.name || "Umum",
      cashier: sale.cashier_id || "-",
      total: formatRupiah(sale.total),
      payment: sale.payment_method?.toUpperCase() || "CASH",
      status: sale.payment_status?.toUpperCase() || "PAID"
    }));
    exportToPDF(dataToExport, exportColumns, "Laporan_Penjualan_UMKM", "Laporan Penjualan");
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
            <h1 className="text-2xl font-bold text-slate-900">Laporan Penjualan</h1>
            <p className="text-slate-500 text-sm mt-0.5">Riwayat dan detail transaksi penjualan</p>
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

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              className="input pl-9"
              placeholder="Cari no. invoice atau nama pelanggan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select 
            className="input sm:w-48"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="hari-ini">Hari Ini</option>
            <option value="minggu-ini">Minggu Ini</option>
            <option value="bulan-ini">Bulan Ini</option>
            <option value="semua">Semua Waktu</option>
          </select>
          <button className="btn btn-outline sm:w-auto w-full justify-center">
            <Filter className="w-4 h-4" /> Filter Lain
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>No. Invoice</th>
                <th>Tanggal</th>
                <th>Pelanggan</th>
                <th>Kasir</th>
                <th className="text-right">Total</th>
                <th>Metode Bayar</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale) => (
                <tr key={sale.id}>
                  <td className="font-medium text-slate-800">{sale.invoice_number}</td>
                  <td className="text-sm text-slate-600">{formatDate(sale.created_at)}</td>
                  <td>{sale.customer?.name || "Pelanggan Umum"}</td>
                  <td>{sale.cashier_id || "-"}</td>
                  <td className="text-right font-bold text-slate-900">{formatRupiah(sale.total)}</td>
                  <td>
                    <span className="badge text-[10px] uppercase bg-slate-100 text-slate-600">
                      {sale.payment_method || "CASH"}
                    </span>
                  </td>
                  <td>
                    <span className={`badge text-[10px] uppercase ${
                      sale.payment_status === 'paid' || !sale.payment_status ? 'badge-success' : 
                      sale.payment_status === 'partial' ? 'badge-warning' : 'badge-danger'
                    }`}>
                      {sale.payment_status || 'paid'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredSales.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              Tidak ada data penjualan yang ditemukan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
