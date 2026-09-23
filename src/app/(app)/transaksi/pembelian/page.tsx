"use client";
import React, { useState } from "react";
import Link from "next/link";
import { formatRupiah } from "@/lib/utils";
import { 
  useGetPurchases, 
  useGetPurchaseMetrics, 
  useGetSuppliers, 
  useGetRecentStockMovements,
  useGetPurchaseItems
} from "@/hooks/api/usePurchase";

// Utility formatting date (e.g., 18 Jan 2026 • 10:45)
const formatDateTime = (dateString: string) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date).replace(',', ' •');
};

const formatShortDate = (dateString: string) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(date);
};

export default function PembelianPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [supplierFilter, setSupplierFilter] = useState("all");
  const [selectedPurchaseId, setSelectedPurchaseId] = useState<string | null>(null);

  const { data: purchases, isLoading: isPurchasesLoading } = useGetPurchases({
    search,
    status: statusFilter,
    supplier_id: supplierFilter
  });
  
  const { data: metrics } = useGetPurchaseMetrics();
  const { data: suppliers } = useGetSuppliers();
  const { data: recentMovements } = useGetRecentStockMovements();
  
  const selectedPurchase = purchases?.find(p => p.id === selectedPurchaseId) || purchases?.[0];
  const { data: selectedPurchaseItems } = useGetPurchaseItems(selectedPurchase?.id);

  // Status Badge Mapping
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-status-success-bg text-status-success"><span className="material-symbols-outlined text-[13px]">done_all</span> Lunas</span>;
      case "partial":
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-status-info-bg text-status-info">Sebagian / DP</span>;
      case "unpaid":
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-status-warning-bg text-status-warning"><span className="w-1.5 h-1.5 rounded-full bg-status-warning"></span> Hutang</span>;
      case "overdue":
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-status-danger-bg text-status-danger"><span className="material-symbols-outlined text-[13px]">error</span> Jatuh Tempo</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-surface-container text-secondary">{status}</span>;
    }
  };

  const getLogisticsBadge = (status: string) => {
    if (status === "paid") {
      return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-status-success-bg text-status-success"><span className="material-symbols-outlined text-[13px]">check_circle</span> Diterima Penuh</span>;
    }
    return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-status-info-bg text-status-info"><span className="material-symbols-outlined text-[13px]">local_shipping</span> Di Perjalanan</span>;
  };

  return (
    <div className="flex flex-col w-full">
      <div className="max-w-[1440px] w-full mx-auto space-y-8">
        {/* HEADER HALAMAN */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-primary-container/10 text-primary-container">
                <span className="material-symbols-outlined text-2xl">local_shipping</span>
              </span>
              <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                Pembelian Stok &amp; Restock Barang
              </h1>
              <span className="px-2.5 py-1 rounded-full text-label-sm font-label-sm bg-primary-fixed text-primary font-bold">
                Gudang Utama
              </span>
            </div>
            <p className="font-body-md text-body-md text-secondary">
              Kelola order pembelian ke pemasok (supplier), penerimaan barang gudang, dan mutasi kartu stok real-time.
            </p>
          </div>
          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-card text-on-surface hover:bg-surface-container shadow-sm font-label-md text-label-md transition-all" type="button">
              <span className="material-symbols-outlined text-[18px] text-secondary">file_upload</span>
              <span>Import Faktur</span>
            </button>
            <button className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-card text-on-surface hover:bg-surface-container shadow-sm font-label-md text-label-md transition-all" type="button">
              <span className="material-symbols-outlined text-[18px] text-secondary">download</span>
              <span>Export Data</span>
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary-container text-on-secondary-container hover:bg-secondary-fixed shadow-sm font-label-md text-label-md transition-all" type="button">
              <span className="material-symbols-outlined text-[18px] text-primary">inventory_2</span>
              <span>Penerimaan Barang / PO</span>
            </button>
            <Link href="/transaksi/pembelian/baru" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-container text-on-primary hover:bg-teal-accent active:scale-95 shadow-md shadow-primary/20 font-label-lg text-label-lg transition-all">
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
              <span>+ Buat Pembelian Baru</span>
            </Link>
          </div>
        </div>
        {/* TOP 4 KPI METRICS CARD (BENTO GRID) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Metric 1: Total Pembelian */}
          <div className="relative overflow-hidden rounded-2xl bg-surface-card p-5 shadow-sm">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/5 rounded-full blur-xl pointer-events-none"></div>
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-secondary uppercase tracking-wider">Total Pembelian (Bulan Ini)</span>
              <span className="p-2 rounded-lg bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-lg">payments</span>
              </span>
            </div>
            <div className="mt-3">
              <div className="font-price-display text-price-display text-on-surface tracking-tight">{formatRupiah(metrics?.totalPembelian || 0, { compact: true })}</div>
              <div className="mt-2 flex items-center gap-2">
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-label-sm font-label-sm bg-status-success-bg text-status-success font-semibold">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span> -
                </span>
                <span className="font-body-sm text-body-sm text-secondary">{purchases?.length || 0} Transaksi PO</span>
              </div>
            </div>
          </div>
          {/* Metric 2: Hutang Dagang Jatuh Tempo */}
          <div className="relative overflow-hidden rounded-2xl bg-surface-card p-5 shadow-sm">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-status-warning"></div>
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-secondary uppercase tracking-wider">Hutang Jatuh Tempo</span>
              <span className="p-2 rounded-lg bg-status-warning-bg text-status-warning">
                <span className="material-symbols-outlined text-lg">pending_actions</span>
              </span>
            </div>
            <div className="mt-3">
              <div className="font-price-display text-price-display text-status-warning tracking-tight">{formatRupiah(metrics?.hutangJatuhTempo || 0, { compact: true })}</div>
              <div className="mt-2 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-label-sm font-label-sm bg-status-warning-bg text-status-warning font-semibold">
                  <span className="material-symbols-outlined text-[13px]">alarm</span> {metrics?.hutangCount || 0} Tagihan
                </span>
                <span className="font-body-sm text-body-sm text-secondary">Tempo &lt; 7 Hari</span>
              </div>
            </div>
          </div>
          {/* Metric 3: Stok Masuk */}
          <div className="relative overflow-hidden rounded-2xl bg-surface-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-secondary uppercase tracking-wider">Total Restock Fisik</span>
              <span className="p-2 rounded-lg bg-secondary-container text-primary">
                <span className="material-symbols-outlined text-lg">unarchive</span>
              </span>
            </div>
            <div className="mt-3">
              <div className="font-price-display text-price-display text-on-surface tracking-tight">{metrics?.totalRestockFisik || 0} <span className="text-headline-sm font-headline-sm font-normal text-secondary">Unit</span></div>
              <div className="mt-2 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-label-sm font-label-sm bg-surface-container text-on-surface font-semibold">
                  <span className="material-symbols-outlined text-[14px]">handshake</span> {metrics?.supplierCount || 0} Supplier
                </span>
                <span className="font-body-sm text-body-sm text-secondary">Gudang Utama</span>
              </div>
            </div>
          </div>
          {/* Metric 4: Low Stock Alert */}
          <div className="relative overflow-hidden rounded-2xl bg-surface-card p-5 shadow-sm">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-status-danger"></div>
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-secondary uppercase tracking-wider">Perlu Restock Cepat</span>
              <span className="p-2 rounded-lg bg-status-danger-bg text-status-danger">
                <span className="material-symbols-outlined text-lg">warning</span>
              </span>
            </div>
            <div className="mt-3">
              <div className="font-price-display text-price-display text-status-danger tracking-tight">{metrics?.lowStockCount || 0} Bahan Kritis</div>
              <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                {metrics?.lowStockItems?.slice(0,2).map(item => (
                  <span key={item.id} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-status-danger-bg text-status-danger">{item.name.substring(0, 10)}</span>
                ))}
                {metrics?.lowStockItems && metrics.lowStockItems.length > 2 && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-surface-container text-secondary">+{metrics.lowStockItems.length - 2} lagi</span>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* TOOLBAR FILTER & PENCARIAN */}
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Status Tabs */}
            <div className="flex items-center gap-1 bg-surface-card p-1.5 rounded-2xl shadow-sm overflow-x-auto">
              <button 
                onClick={() => setStatusFilter("all")}
                className={`px-3.5 py-2 rounded-xl font-label-sm text-label-sm shadow-sm whitespace-nowrap transition-colors ${statusFilter === 'all' ? 'bg-primary-container text-on-primary' : 'text-secondary hover:text-on-surface hover:bg-surface-container'}`} type="button">
                Semua Pembelian
              </button>
              <button 
                onClick={() => setStatusFilter("paid")}
                className={`px-3.5 py-2 rounded-xl font-label-sm text-label-sm shadow-sm whitespace-nowrap transition-colors ${statusFilter === 'paid' ? 'bg-primary-container text-on-primary' : 'text-secondary hover:text-on-surface hover:bg-surface-container'}`} type="button">
                Selesai / Diterima
              </button>
              <button 
                onClick={() => setStatusFilter("unpaid")}
                className={`px-3.5 py-2 rounded-xl font-label-sm text-label-sm transition-colors whitespace-nowrap flex items-center gap-1 ${statusFilter === 'unpaid' ? 'bg-status-warning-bg text-status-warning' : 'text-status-warning hover:bg-status-warning-bg'}`} type="button">
                <span className="w-1.5 h-1.5 rounded-full bg-status-warning"></span>
                Hutang / Jatuh Tempo
              </button>
            </div>
            {/* Quick Summary Mini Tag */}
            <div className="hidden sm:flex items-center gap-2 text-secondary font-body-sm text-body-sm">
              <span>Periode Buku:</span>
              <span className="font-bold text-on-surface px-2 py-0.5 rounded bg-surface-card shadow-sm">Bulan Ini</span>
            </div>
          </div>
          {/* Search & Select Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-surface-card p-3 rounded-2xl shadow-sm">
            <div className="md:col-span-5 relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary text-lg">search</span>
              <input 
                className="w-full pl-10 pr-12 py-2 text-body-md font-body-md bg-surface text-on-surface rounded-xl placeholder:text-secondary/70 focus:outline-none focus:ring-2 focus:ring-primary/30" 
                placeholder="Cari No. PO, Supplier, nama bahan baku/produk..." 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-mono font-bold px-1.5 py-0.5 rounded bg-surface-card text-secondary shadow-sm">⌘K</span>
            </div>
            <div className="md:col-span-3">
              <div className="relative">
                <select 
                  className="w-full px-3.5 py-2 text-body-md font-body-md bg-surface text-on-surface rounded-xl appearance-none pr-9 focus:outline-none focus:ring-2 focus:ring-primary/30" 
                  value={supplierFilter}
                  onChange={(e) => setSupplierFilter(e.target.value)}
                >
                  <option value="all">Semua Supplier Rekanan</option>
                  {suppliers?.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none text-lg">expand_more</span>
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="relative">
                <select 
                  className="w-full px-3.5 py-2 text-body-md font-body-md bg-surface text-on-surface rounded-xl appearance-none pr-9 focus:outline-none focus:ring-2 focus:ring-primary/30" 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Status Bayar: Semua</option>
                  <option value="paid">Lunas</option>
                  <option value="unpaid">Hutang / Tempo</option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none text-lg">expand_more</span>
              </div>
            </div>
            <div className="md:col-span-2 flex items-center gap-2">
              <button className="w-full py-2 px-3 bg-surface hover:bg-surface-container text-secondary hover:text-on-surface rounded-xl font-label-md text-label-md flex items-center justify-center gap-1.5 transition-colors" type="button">
                <span className="material-symbols-outlined text-[18px]">tune</span>
                <span>Filter Detail</span>
              </button>
              <button 
                onClick={() => { setSearch(""); setStatusFilter("all"); setSupplierFilter("all"); }}
                className="p-2 bg-surface hover:bg-surface-container text-secondary hover:text-on-surface rounded-xl transition-colors" title="Reset filter" type="button">
                <span className="material-symbols-outlined text-[18px]">restart_alt</span>
              </button>
            </div>
          </div>
        </div>
        {/* AREA UTAMA: SPLIT GRID 12 KOLOM */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* KOLOM KIRI (8 KOLOM): TABEL PEMBELIAN STOK */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-surface-card rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 flex items-center justify-between bg-surface-card">
                <div className="flex items-center gap-2">
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">Daftar Order Pembelian (PO)</h2>
                  <span className="px-2 py-0.5 rounded-full text-label-sm font-label-sm bg-surface text-secondary">
                    Menampilkan {purchases?.length || 0} PO
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 text-secondary hover:text-on-surface rounded-lg hover:bg-surface transition-colors" title="Refresh data">
                    <span className="material-symbols-outlined text-lg">refresh</span>
                  </button>
                  <button className="p-1.5 text-secondary hover:text-on-surface rounded-lg hover:bg-surface transition-colors" title="Pengaturan Kolom">
                    <span className="material-symbols-outlined text-lg">view_column</span>
                  </button>
                </div>
              </div>
              {/* Tabel Responsif */}
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-surface text-secondary font-label-sm text-label-sm uppercase tracking-wider">
                      <th className="py-3 px-4">No. PO &amp; Faktur</th>
                      <th className="py-3 px-3">Supplier &amp; PIC</th>
                      <th className="py-3 px-3">Total Nominal</th>
                      <th className="py-3 px-3">Status Logistik</th>
                      <th className="py-3 px-3">Status Bayar</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle/40 font-body-sm text-body-sm">
                    {isPurchasesLoading ? (
                      <tr><td colSpan={6} className="text-center py-8 text-secondary">Memuat data...</td></tr>
                    ) : purchases?.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-8 text-secondary">Belum ada data pembelian.</td></tr>
                    ) : purchases?.map(purchase => (
                      <tr 
                        key={purchase.id} 
                        onClick={() => setSelectedPurchaseId(purchase.id)}
                        className={`transition-colors cursor-pointer ${selectedPurchaseId === purchase.id ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-surface/75'}`}
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${selectedPurchaseId === purchase.id ? 'bg-primary-container' : 'bg-transparent'}`}></span>
                            <div>
                              <span className="font-bold text-on-surface font-tabular-numeric">{purchase.purchase_number}</span>
                              <div className="text-[11px] text-secondary">{formatDateTime(purchase.created_at)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="font-bold text-on-surface">{purchase.supplier?.name || "Supplier Umum"}</div>
                          <div className="text-[11px] text-secondary flex items-center gap-1">
                            {purchase.supplier?.contact_name || purchase.supplier?.phone || "-"}
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className={`font-bold font-tabular-numeric ${purchase.payment_status === 'overdue' ? 'text-status-danger' : 'text-on-surface'}`}>
                            {formatRupiah(purchase.total)}
                          </div>
                          <div className="text-[11px] text-secondary font-semibold">PPN Included</div>
                        </td>
                        <td className="py-3.5 px-3">
                          {getLogisticsBadge(purchase.payment_status)}
                        </td>
                        <td className="py-3.5 px-3">
                          {getStatusBadge(purchase.payment_status)}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button className="p-1.5 rounded-lg bg-surface hover:bg-surface-container text-secondary hover:text-on-surface shadow-sm" title="Lihat Detail">
                              <span className="material-symbols-outlined text-[16px]">visibility</span>
                            </button>
                            <button className="p-1.5 rounded-lg bg-surface hover:bg-surface-container text-secondary hover:text-on-surface shadow-sm" title="Cetak PO">
                              <span className="material-symbols-outlined text-[16px]">print</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Kartu Riwayat Mutasi Kartu Stok Singkat */}
            <div className="bg-surface-card p-5 rounded-2xl shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">history_toggle_off</span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">Log Mutasi Stok Terakhir (Stock Movement)</h3>
                </div>
                <a className="font-label-sm text-label-sm text-primary hover:underline font-bold" href="#">Buka Kartu Stok Lengkap →</a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                {recentMovements?.map(mov => (
                  <div key={mov.id} className="p-3 rounded-xl bg-surface">
                    <div className="text-[11px] font-bold text-secondary uppercase">{mov.type} {mov.reference_type ? `#${mov.reference_type}` : ''}</div>
                    <div className="font-bold text-on-surface text-body-md mt-0.5">{mov.product?.name || "Produk"}</div>
                    <div className="flex items-center justify-between text-[11px] mt-1 font-semibold">
                      <span className={mov.qty_change > 0 ? "text-status-success" : mov.qty_change < 0 ? "text-status-danger" : "text-status-warning"}>
                        {mov.qty_change > 0 ? '+' : ''}{mov.qty_change} Unit
                      </span>
                      <span className="text-secondary font-normal">Sisa: {mov.qty_after} Unit</span>
                    </div>
                  </div>
                ))}
                {!recentMovements?.length && (
                  <div className="col-span-3 text-center text-sm text-secondary p-4">Belum ada riwayat mutasi.</div>
                )}
              </div>
            </div>
          </div>
          {/* KOLOM KANAN (4 KOLOM): DETAIL FAKTUR PEMBELIAN AKTIF */}
          <div className="lg:col-span-4 space-y-4">
            {selectedPurchase ? (
              <div className="bg-surface-card rounded-2xl shadow-md p-5 space-y-5 sticky top-20">
                {/* Header Faktur */}
                <div className="flex items-start justify-between pb-3 border-b border-border-subtle">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-label-sm text-label-sm font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">PO AKTIF</span>
                      <span className="font-bold text-on-surface font-tabular-numeric">{selectedPurchase.purchase_number}</span>
                    </div>
                    <div className="text-body-sm text-secondary mt-1">Faktur Supplier: <span className="font-mono text-on-surface font-semibold">-</span></div>
                  </div>
                  {getLogisticsBadge(selectedPurchase.payment_status)}
                </div>
                {/* Kartu Profil Supplier */}
                <div className="p-3.5 rounded-xl bg-surface space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-on-surface font-label-lg text-label-lg">{selectedPurchase.supplier?.name || "Supplier Umum"}</div>
                      <div className="text-body-sm text-secondary">{selectedPurchase.supplier?.address || "-"}</div>
                    </div>
                    <span className="p-1.5 rounded-lg bg-surface-card text-primary shadow-sm">
                      <span className="material-symbols-outlined text-lg">storefront</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-border-subtle/60 text-secondary">
                    <span className="flex items-center gap-1 font-semibold text-status-success">
                      <span className="material-symbols-outlined text-[13px]">chat</span> WhatsApp: {selectedPurchase.supplier?.phone || "-"}
                    </span>
                  </div>
                </div>
                {/* Rincian Item Barang Masuk */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">Item Barang Masuk ({selectedPurchaseItems?.length || 0})</span>
                    <span className="text-[11px] font-bold text-primary">Kartu Stok Gudang</span>
                  </div>
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {selectedPurchaseItems?.map(item => (
                      <div key={item.id} className="p-2.5 rounded-xl bg-surface/70 flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="font-bold text-on-surface text-body-sm">{item.product_name}</div>
                          <div className="text-[11px] text-secondary">{item.qty} × {formatRupiah(item.unit_price)}</div>
                        </div>
                        <div className="text-right font-tabular-numeric">
                          <div className="font-bold text-on-surface text-body-sm">{formatRupiah(item.subtotal)}</div>
                        </div>
                      </div>
                    ))}
                    {!selectedPurchaseItems?.length && (
                      <div className="text-center text-xs text-secondary p-4">Tidak ada detail barang.</div>
                    )}
                  </div>
                </div>
                {/* Perhitungan Finansial */}
                <div className="p-3 rounded-xl bg-surface space-y-1.5 text-body-sm font-body-sm">
                  <div className="flex justify-between text-secondary">
                    <span>Subtotal Pembelian</span>
                    <span className="font-tabular-numeric font-semibold text-on-surface">{formatRupiah(selectedPurchase.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-status-success">
                    <span>Diskon Mitra Grosir</span>
                    <span className="font-tabular-numeric font-semibold">-{formatRupiah(selectedPurchase.discount_amount || 0)}</span>
                  </div>
                  <div className="flex justify-between text-secondary">
                    <span>PPN Masukan</span>
                    <span className="font-tabular-numeric font-semibold text-on-surface">{formatRupiah(selectedPurchase.tax_amount || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-border-subtle font-headline-sm text-headline-sm">
                    <span className="text-on-surface">Total Tagihan</span>
                    <span className="text-primary font-bold font-tabular-numeric">{formatRupiah(selectedPurchase.total)}</span>
                  </div>
                </div>
                {/* Status Pembayaran & Alert Jatuh Tempo */}
                {selectedPurchase.payment_status !== "paid" && (
                  <div className="p-3 rounded-xl bg-status-warning-bg space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-status-warning uppercase">Status Pelunasan PO</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-status-warning text-white">BELUM LUNAS</span>
                    </div>
                    <div className="font-bold text-on-surface text-body-md font-tabular-numeric">
                      Sisa Hutang: {formatRupiah(selectedPurchase.total - selectedPurchase.paid_amount)}
                    </div>
                  </div>
                )}
                {/* Action CTAs */}
                <div className="space-y-2 pt-1">
                  {selectedPurchase.payment_status !== "paid" && (
                    <button className="w-full py-3 rounded-xl bg-primary-container text-on-primary hover:bg-teal-accent font-label-lg text-label-lg font-bold shadow-md shadow-primary/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99]" type="button">
                      <span className="material-symbols-outlined text-[19px]">account_balance_wallet</span>
                      <span>Catat Pelunasan Hutang</span>
                    </button>
                  )}
                  <button className="w-full py-2.5 rounded-xl bg-surface text-on-surface hover:bg-surface-container font-label-md text-label-md font-semibold flex items-center justify-center gap-2 transition-colors" type="button">
                    <span className="material-symbols-outlined text-[18px] text-status-info">verified</span>
                    <span>Verifikasi Terima Fisik Gudang</span>
                  </button>
                  <button className="w-full py-2 rounded-xl text-secondary hover:text-on-surface font-label-sm text-label-sm flex items-center justify-center gap-1.5 transition-colors" type="button">
                    <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
                    <span>Cetak Bukti Penerimaan Barang (PDF)</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-surface-card rounded-2xl shadow-md p-10 flex flex-col items-center justify-center text-center space-y-3">
                <span className="material-symbols-outlined text-4xl text-secondary">inventory</span>
                <p className="text-secondary text-sm">Pilih Order Pembelian di tabel untuk melihat detail faktur.</p>
              </div>
            )}
          </div>
        </div>
        {/* MINI SECTION BAWAH / QUICK RESTOCK RECOMMENDATION */}
        <div className="rounded-2xl bg-surface-card p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-status-danger-bg text-status-danger">
                <span className="material-symbols-outlined text-2xl">notification_important</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Rekomendasi Restock Otomatis (Smart Reorder)</h3>
                <p className="font-body-sm text-body-sm text-secondary">Sistem mendeteksi {metrics?.lowStockCount || 0} bahan berada di bawah batas minimum stok operasional.</p>
              </div>
            </div>
            <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-container text-on-primary hover:bg-teal-accent font-label-md text-label-md font-bold shadow-sm transition-all whitespace-nowrap" type="button">
              <span className="material-symbols-outlined text-[18px]">flash_on</span>
              <span>Pesan Semua ke Supplier Sekaligus</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
            {metrics?.lowStockItems?.map((item: any) => (
              <div key={item.id} className="p-3.5 rounded-xl bg-surface flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-status-danger-bg text-status-danger">Kritis • Sisa {item.stock}</span>
                    <span className="text-[10px] text-secondary">Min: {item.min_stock}</span>
                  </div>
                  <div className="font-bold text-on-surface font-label-lg text-label-lg mt-2">{item.name}</div>
                  <div className="text-[11px] text-secondary">SKU: {item.sku || "-"}</div>
                </div>
                <div className="pt-2 border-t border-border-subtle/60 flex items-center justify-between">
                  <span className="font-bold text-primary font-body-sm font-tabular-numeric">Order {item.min_stock * 2}</span>
                  <button className="p-1.5 rounded-lg bg-surface-card hover:bg-primary hover:text-on-primary text-primary shadow-sm transition-colors" title="Pesan Ulang Otomatis" type="button">
                    <span className="material-symbols-outlined text-base">send</span>
                  </button>
                </div>
              </div>
            ))}
            {metrics?.lowStockCount === 0 && (
              <div className="col-span-4 text-center p-4 text-secondary text-sm">Tidak ada stok bahan yang perlu direstock saat ini.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
