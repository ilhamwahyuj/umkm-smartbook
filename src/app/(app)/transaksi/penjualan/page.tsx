"use client";
import React, { useState, useEffect } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useOrgStore } from "@/stores/useOrgStore";

export default function TransaksiPenjualanPage() {
  const router = useRouter();
  const [activeInvoice, setActiveInvoice] = useState<string | null>("TRX-20260119-0042");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("Semua Status");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDate, setFilterDate] = useState("Hari Ini");
  const [filterMethod, setFilterMethod] = useState("Semua Metode");
  const [filterCashier, setFilterCashier] = useState("Semua Kasir");
  const [filterType, setFilterType] = useState("Semua Tipe");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeFilter, filterDate, filterMethod, filterCashier, filterType]);

  const { currentOrg } = useOrgStore();
  const supabase = createClient();
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    let orgId = currentOrg?.id || '11111111-1111-1111-1111-111111111111';

    const fetchTransactions = async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select(`*`)
        .eq('org_id', orgId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching transactions:", error);
        return;
      }

      const formatted = data.map(trx => {
        const time = new Date(trx.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
        
        let customerIcon = "storefront";
        let customerDesc = "Dine-in";
        if (trx.order_type === 'bungkus') {
          customerIcon = "shopping_bag";
          customerDesc = "Bungkus";
        } else if (trx.order_type === 'antar') {
          customerIcon = "local_shipping";
          customerDesc = "Antar";
        }

        let methodIcon = "payments";
        let methodBg = "bg-surface-container text-secondary";
        let methodName = "Tunai";
        if (trx.payment_method === 'qris') {
          methodIcon = "qr_code_scanner";
          methodBg = "bg-status-success-bg text-status-success";
          methodName = "QRIS";
        } else if (trx.payment_method === 'transfer') {
          methodIcon = "account_balance";
          methodBg = "bg-status-info-bg text-status-info";
          methodName = "Transfer";
        } else if (trx.payment_method === 'kasbon') {
          methodIcon = "schedule";
          methodBg = "bg-status-warning-bg text-status-warning";
          methodName = "Kasbon";
        }

        const menuCount = Array.isArray(trx.items) ? trx.items.length : 0;
        const pcsCount = Array.isArray(trx.items) ? trx.items.reduce((sum: number, item: any) => sum + (item.qty || 0), 0) : 0;
        const itemsDesc = Array.isArray(trx.items) ? trx.items.map((i: any) => i.product_name).join(', ').substring(0, 30) + (trx.items.length > 2 ? '...' : '') : "";
        
        const formatRp = (n: number) => "Rp " + Number(n).toLocaleString('id-ID');

        return {
          id: trx.id.split('-')[0].toUpperCase() + '-' + trx.id.substring(0, 4), // Shortened UUID for UI
          time: time,
          customer: trx.customer_name || 'Walk-in Guest',
          customerDesc: customerDesc,
          customerIcon: customerIcon,
          cashier: 'Kasir',
          menuCount: `${menuCount} Menu`,
          pcsCount: `(${pcsCount} pcs)`,
          itemsDesc: itemsDesc,
          method: methodName,
          methodIcon: methodIcon,
          methodBg: methodBg,
          status: trx.payment_method === 'kasbon' ? 'TEMPO' : 'LUNAS',
          statusBg: trx.payment_method === 'kasbon' ? 'bg-status-warning-bg text-status-warning' : 'bg-status-success-bg text-status-success',
          total: formatRp(trx.grand_total),
          totalColor: trx.payment_method === 'kasbon' ? 'text-status-warning' : 'text-on-surface',
          note: trx.discount > 0 ? `Disc ${formatRp(trx.discount)}` : '-',
          indicator: trx.payment_method === 'kasbon' ? 'bg-status-warning' : 'bg-primary-container',
          items: Array.isArray(trx.items) ? trx.items.map((i: any) => ({
            name: i.product_name,
            price: formatRp(i.price),
            qty: i.qty,
            note: i.notes || (i.variants ? i.variants.join(', ') : ""),
            total: formatRp(i.price * i.qty)
          })) : [],
          subtotal: formatRp(trx.subtotal),
          discount: formatRp(trx.discount),
          tax: formatRp(trx.tax),
          paymentRef: methodName,
          acquirer: "Sistem Kasir"
        };
      });

      setTransactions(formatted);
    };

    fetchTransactions();

    // Subscribe to realtime changes
    const channel = supabase.channel('realtime:transactions')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'transactions', filter: `org_id=eq.${orgId}` }, () => {
        fetchTransactions();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentOrg, supabase]);

  const [showRekapModal, setShowRekapModal] = useState(false);
  const [showVoidModal, setShowVoidModal] = useState(false);
  const [voidPin, setVoidPin] = useState("");
  const [voidReason, setVoidReason] = useState("");

  const filteredTransactions = transactions.filter((trx) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (
        !trx.id.toLowerCase().includes(q) &&
        !trx.customer.toLowerCase().includes(q) &&
        !trx.cashier.toLowerCase().includes(q) &&
        !trx.itemsDesc.toLowerCase().includes(q)
      ) {
        return false;
      }
    }

    if (activeFilter !== "Semua Status") {
      if (activeFilter === "Lunas" && !trx.status.includes("LUNAS")) return false;
      if (activeFilter === "Sebagian / DP" && !trx.status.includes("DP")) return false;
      if (activeFilter === "Kasbon / Piutang" && !trx.status.includes("TEMPO")) return false;
      if (activeFilter === "Dibatalkan / Void" && trx.status !== "VOID") return false;
    }

    if (filterMethod !== "Semua Metode") {
      if (!trx.method.includes(filterMethod) && trx.method !== filterMethod) return false;
    }

    if (filterCashier !== "Semua Kasir") {
      if (trx.cashier !== filterCashier) return false;
    }

    if (filterType !== "Semua Tipe") {
      if (filterType === "Dine-in" && !trx.customerDesc.includes("Meja") && !trx.customerDesc.includes("Dine-in")) return false;
      if (filterType === "Bungkus" && !trx.customerDesc.includes("Bungkus")) return false;
      if (filterType === "Pre-Order" && !trx.customerDesc.includes("Pre-Order")) return false;
      if (filterType === "B2B" && !trx.customerDesc.includes("B2B")) return false;
    }

    return true;
  });

  const countLunas = transactions.filter(t => t.status.includes("LUNAS")).length;
  const countDP = transactions.filter(t => t.status.includes("DP")).length;
  const countTempo = transactions.filter(t => t.status.includes("TEMPO")).length;
  const countVoid = transactions.filter(t => t.status === "VOID").length;

  const totalPenjualan = transactions.reduce((sum, trx) => sum + parseInt(trx.total.replace(/\D/g, '') || '0'), 0);
  const lunasTerbayar = transactions.filter(trx => trx.status !== 'TEMPO' && trx.status !== 'VOID').reduce((sum, trx) => sum + parseInt(trx.total.replace(/\D/g, '') || '0'), 0);
  const kasbonPiutang = transactions.filter(trx => trx.status === 'TEMPO').reduce((sum, trx) => sum + parseInt(trx.total.replace(/\D/g, '') || '0'), 0);
  const aov = transactions.length > 0 ? Math.round(totalPenjualan / transactions.length) : 0;
  const formatRp = (n: number) => "Rp " + Number(n).toLocaleString('id-ID');

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedTransactions = filteredTransactions.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage
  );

  const startItem = filteredTransactions.length === 0 ? 0 : (safeCurrentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(safeCurrentPage * itemsPerPage, filteredTransactions.length);

  return (
    <div className="flex flex-col w-full space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[70] bg-surface-container-highest text-on-surface px-6 py-3 rounded-2xl shadow-xl text-sm font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300 print:hidden">
          <span className="material-symbols-outlined text-lg text-primary">info</span>
          {toastMessage}
        </div>
      )}

      {/* Top Banner / Page Header */}
      <section className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 print:hidden">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary-fixed text-primary-container font-bold shadow-sm">
              <span className="material-symbols-outlined text-lg">receipt_long</span>
            </span>
            <h1 className="font-headline-lg text-[30px] leading-[38px] tracking-[-0.02em] font-bold text-on-surface">Riwayat &amp; Transaksi Penjualan</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-status-success-bg text-status-success font-label-sm text-[11px] font-semibold">Live POS Stream</span>
          </div>
          <p className="font-body-md text-[14px] text-secondary">
            Pantau rekapan transaksi kasir POS, status pembayaran, kasbon tempo, dan cetak ulang struk penjualan
          </p>
        </div>
        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={() => setShowRekapModal(true)} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-card hover:bg-surface-container-low text-secondary font-label-md text-[12px] font-semibold shadow-sm transition-all duration-150" type="button">
            <span className="material-symbols-outlined text-base text-teal-accent">point_of_sale</span>
            <span>Rekap Shift Kasir</span>
          </button>
          <button onClick={() => showToast("Mengekspor data ke Excel/CSV...")} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-card hover:bg-surface-container-low text-on-surface font-label-md text-[12px] font-semibold shadow-sm transition-all duration-150" type="button">
            <span className="material-symbols-outlined text-base text-secondary">file_download</span>
            <span>Export Excel/CSV</span>
          </button>
          <button onClick={() => router.push("/kasir")} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-[12px] font-semibold shadow-md transition-all duration-150 active:scale-95" type="button">
            <span className="material-symbols-outlined text-base">add_circle</span>
            <span>+ Transaksi Kasir Baru</span>
          </button>
        </div>
      </section>

      {/* 4 KPI Metrics Bento Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 print:hidden">
        <div className="relative overflow-hidden rounded-xl bg-surface-card p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-[12px] font-semibold text-secondary uppercase tracking-wider">Total Penjualan Hari Ini</span>
            <span className="p-2 rounded-lg bg-status-success-bg text-status-success">
              <span className="material-symbols-outlined text-lg">payments</span>
            </span>
          </div>
          <div>
            <div className="font-price-display text-[32px] leading-[40px] font-extrabold text-on-surface tracking-tight">{formatRp(totalPenjualan)}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-status-success-bg text-status-success font-label-sm text-[11px] font-semibold">
                <span className="material-symbols-outlined text-xs">trending_up</span>
                +0%
              </span>
              <span className="font-body-sm text-[12px] text-secondary">hari ini • {transactions.length} Struk</span>
            </div>
          </div>
          <div className="h-1.5 w-full bg-surface-container-low rounded-full overflow-hidden">
            <div className="h-full bg-primary-container rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl bg-surface-card p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-[12px] font-semibold text-secondary uppercase tracking-wider">Lunas Terbayar</span>
            <span className="p-2 rounded-lg bg-primary-fixed text-primary">
              <span className="material-symbols-outlined text-lg">verified</span>
            </span>
          </div>
          <div>
            <div className="font-price-display text-[32px] leading-[40px] font-extrabold text-on-surface tracking-tight">{formatRp(lunasTerbayar)}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary-fixed text-primary font-label-sm text-[11px] font-bold">
                {totalPenjualan > 0 ? Math.round((lunasTerbayar/totalPenjualan)*100) : 0}%
              </span>
              <span className="font-body-sm text-[12px] text-secondary">tingkat pelunasan hari ini</span>
            </div>
          </div>
          <div className="h-1.5 w-full bg-surface-container-low rounded-full overflow-hidden">
            <div className="h-full bg-teal-accent rounded-full" style={{ width: `${totalPenjualan > 0 ? Math.round((lunasTerbayar/totalPenjualan)*100) : 0}%` }}></div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl bg-surface-card p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-[12px] font-semibold text-secondary uppercase tracking-wider">Kasbon / Piutang</span>
            <span className="p-2 rounded-lg bg-status-warning-bg text-status-warning">
              <span className="material-symbols-outlined text-lg">pending_actions</span>
            </span>
          </div>
          <div>
            <div className="font-price-display text-[32px] leading-[40px] font-extrabold text-on-surface tracking-tight">{formatRp(kasbonPiutang)}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-status-warning-bg text-status-warning font-label-sm text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-status-warning"></span>
                {countTempo} Tagihan
              </span>
              <span className="font-body-sm text-[12px] text-secondary">jatuh tempo s/d 7 hari</span>
            </div>
          </div>
          <div className="h-1.5 w-full bg-surface-container-low rounded-full overflow-hidden">
            <div className="h-full bg-status-warning rounded-full" style={{ width: `${totalPenjualan > 0 ? Math.round((kasbonPiutang/totalPenjualan)*100) : 0}%` }}></div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl bg-surface-card p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-[12px] font-semibold text-secondary uppercase tracking-wider">Rata-Rata Tiket (AOV)</span>
            <span className="p-2 rounded-lg bg-secondary-container text-on-secondary-fixed">
              <span className="material-symbols-outlined text-lg">calculate</span>
            </span>
          </div>
          <div>
            <div className="font-price-display text-[32px] leading-[40px] font-extrabold text-on-surface tracking-tight">{formatRp(aov)}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-status-success-bg text-status-success font-label-sm text-[11px] font-semibold">
                <span className="material-symbols-outlined text-xs">arrow_upward</span>
                +0%
              </span>
              <span className="font-body-sm text-[12px] text-secondary">rata-rata per meja / struk</span>
            </div>
          </div>
          <div className="h-1.5 w-full bg-surface-container-low rounded-full overflow-hidden">
            <div className="h-full bg-secondary rounded-full" style={{ width: '50%' }}></div>
          </div>
        </div>
      </section>

      {/* Filter, Search & Status Badges Bar */}
      <section className="p-4 rounded-xl bg-surface-card shadow-sm space-y-4 print:hidden">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-xl">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary text-lg">search</span>
            <input 
              className="w-full pl-10 pr-20 py-2 rounded-xl bg-surface-container-low text-on-surface placeholder:text-secondary font-body-sm text-[12px] focus:outline-none focus:bg-surface-card shadow-inner transition-colors" 
              placeholder="Cari no. faktur, nama pelanggan, kasir, atau nama item..." 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-surface-card text-secondary font-label-sm text-[11px] shadow-sm">⌘K</span>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Filter Date */}
            <div className="relative inline-flex items-center group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-base text-primary pointer-events-none">calendar_today</span>
              <select 
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="pl-9 pr-7 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-label-sm text-[11px] transition-colors appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
              >
                <option value="Hari Ini">Hari Ini (19 Jan 2026)</option>
                <option value="Kemarin">Kemarin</option>
                <option value="7 Hari Terakhir">7 Hari Terakhir</option>
                <option value="Bulan Ini">Bulan Ini</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-sm text-secondary pointer-events-none">expand_more</span>
            </div>
            
            {/* Filter Method */}
            <div className="relative inline-flex items-center group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-base text-secondary pointer-events-none group-hover:text-primary transition-colors">account_balance_wallet</span>
              <select 
                value={filterMethod}
                onChange={(e) => setFilterMethod(e.target.value)}
                className="pl-9 pr-7 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-label-sm text-[11px] transition-colors appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
              >
                <option value="Semua Metode">Semua Metode</option>
                <option value="QRIS">QRIS</option>
                <option value="Tunai">Tunai</option>
                <option value="BCA Trf">BCA Transfer</option>
                <option value="Kasbon">Kasbon / Tempo</option>
                <option value="DP QRIS">DP QRIS</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-sm text-secondary pointer-events-none">expand_more</span>
            </div>

            {/* Filter Cashier */}
            <div className="relative inline-flex items-center group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-base text-secondary pointer-events-none group-hover:text-primary transition-colors">person</span>
              <select 
                value={filterCashier}
                onChange={(e) => setFilterCashier(e.target.value)}
                className="pl-9 pr-7 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-label-sm text-[11px] transition-colors appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
              >
                <option value="Semua Kasir">Semua Kasir</option>
                <option value="Budi Santoso">Budi Santoso</option>
                <option value="Siti Aminah">Siti Aminah</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-sm text-secondary pointer-events-none">expand_more</span>
            </div>

            {/* Filter Type */}
            <div className="relative inline-flex items-center group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-base text-secondary pointer-events-none group-hover:text-primary transition-colors">dining</span>
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pl-9 pr-7 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-label-sm text-[11px] transition-colors appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
              >
                <option value="Semua Tipe">Semua Tipe</option>
                <option value="Dine-in">Dine-in</option>
                <option value="Bungkus">Bungkus / Takeaway</option>
                <option value="Pre-Order">Pre-Order</option>
                <option value="B2B">B2B / Kemitraan</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-sm text-secondary pointer-events-none">expand_more</span>
            </div>

            <button onClick={() => {
              setSearchQuery("");
              setFilterDate("Hari Ini");
              setFilterMethod("Semua Metode");
              setFilterCashier("Semua Kasir");
              setFilterType("Semua Tipe");
              setActiveFilter("Semua Status");
            }} className="p-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-secondary hover:text-status-danger transition-colors shadow-sm" title="Reset Filter" type="button">
              <span className="material-symbols-outlined text-lg">filter_alt_off</span>
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pt-2">
          <button onClick={() => setActiveFilter("Semua Status")} className={`shrink-0 px-3.5 py-1.5 rounded-full font-label-sm text-[11px] transition-colors ${activeFilter === "Semua Status" ? "bg-primary-container text-on-primary font-bold shadow-sm" : "bg-surface-container-low hover:bg-surface-container text-secondary hover:text-on-surface"}`} type="button">
            Semua Status <span className="ml-1 opacity-80">({transactions.length})</span>
          </button>
          <button onClick={() => setActiveFilter("Lunas")} className={`shrink-0 px-3.5 py-1.5 rounded-full font-label-sm text-[11px] transition-colors ${activeFilter === "Lunas" ? "bg-primary-container text-on-primary font-bold shadow-sm" : "bg-surface-container-low hover:bg-surface-container text-secondary hover:text-on-surface"}`} type="button">
            Lunas <span className="ml-1 px-1.5 py-0.5 rounded-full bg-status-success-bg text-status-success font-semibold">({countLunas})</span>
          </button>
          <button onClick={() => setActiveFilter("Sebagian / DP")} className={`shrink-0 px-3.5 py-1.5 rounded-full font-label-sm text-[11px] transition-colors ${activeFilter === "Sebagian / DP" ? "bg-primary-container text-on-primary font-bold shadow-sm" : "bg-surface-container-low hover:bg-surface-container text-secondary hover:text-on-surface"}`} type="button">
            Sebagian / DP <span className="ml-1 px-1.5 py-0.5 rounded-full bg-status-info-bg text-status-info font-semibold">({countDP})</span>
          </button>
          <button onClick={() => setActiveFilter("Kasbon / Piutang")} className={`shrink-0 px-3.5 py-1.5 rounded-full font-label-sm text-[11px] transition-colors ${activeFilter === "Kasbon / Piutang" ? "bg-primary-container text-on-primary font-bold shadow-sm" : "bg-surface-container-low hover:bg-surface-container text-secondary hover:text-on-surface"}`} type="button">
            Kasbon / Piutang <span className="ml-1 px-1.5 py-0.5 rounded-full bg-status-warning-bg text-status-warning font-semibold">({countTempo})</span>
          </button>
          <button onClick={() => setActiveFilter("Dibatalkan / Void")} className={`shrink-0 px-3.5 py-1.5 rounded-full font-label-sm text-[11px] transition-colors ${activeFilter === "Dibatalkan / Void" ? "bg-primary-container text-on-primary font-bold shadow-sm" : "bg-surface-container-low hover:bg-surface-container text-secondary hover:text-on-surface"}`} type="button">
            Dibatalkan / Void <span className="ml-1 px-1.5 py-0.5 rounded-full bg-surface-container text-secondary font-semibold">({countVoid})</span>
          </button>
        </div>
      </section>

      {/* Main Work Area */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Data Table */}
        <div className="lg:col-span-8 flex flex-col space-y-4 print:hidden">
          <div className="rounded-xl bg-surface-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-body-sm text-[12px]">
                <thead className="bg-surface-container-low text-secondary uppercase font-label-sm text-[11px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">No. Faktur</th>
                    <th className="py-3 px-4">Pelanggan</th>
                    <th className="py-3 px-4">Kasir</th>
                    <th className="py-3 px-4">Item Ringkasan</th>
                    <th className="py-3 px-3 text-center">Metode</th>
                    <th className="py-3 px-3 text-center">Status</th>

                    <th className="py-3 px-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="text-on-surface divide-y-0">
                  {paginatedTransactions.length > 0 ? paginatedTransactions.map((trx) => {
                    const isActive = activeInvoice === trx.id;
                    return (
                      <tr
                        key={trx.id}
                        className={`cursor-pointer transition-colors ${
                          isActive
                            ? "bg-primary-fixed/20 hover:bg-primary-fixed/30"
                            : "hover:bg-surface-container-low/70"
                        }`}
                        onClick={() => setActiveInvoice(trx.id)}
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className={`w-1.5 h-6 rounded-full ${isActive ? 'bg-primary-container' : trx.indicator}`}></span>
                            <div>
                              <span className={`text-tabular-numeric font-bold ${isActive ? 'text-primary-container' : 'text-on-surface'}`}>{trx.id}</span>
                              <div className="font-body-sm text-[12px] text-secondary">{trx.time}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-label-md text-[12px] font-bold text-on-surface">{trx.customer}</div>
                          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-label-sm text-[11px] ${trx.customerIcon === 'local_shipping' ? 'bg-status-warning-bg text-status-warning' : 'bg-surface-container text-secondary'}`}>
                            <span className="material-symbols-outlined text-xs">{trx.customerIcon}</span> {trx.customerDesc}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-body-sm text-[12px] text-secondary">{trx.cashier}</span>
                        </td>
                        <td className="py-3.5 px-4 max-w-[210px]">
                          <div className="truncate font-body-sm text-[12px] text-on-surface">
                            <strong className="text-primary">{trx.menuCount}</strong> {trx.pcsCount}
                          </div>
                          <div className="truncate text-secondary font-body-sm text-[12px]">{trx.itemsDesc}</div>
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-label-sm text-[11px] font-semibold ${trx.methodBg}`}>
                            <span className="material-symbols-outlined text-xs">{trx.methodIcon}</span> {trx.method}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-label-sm text-[11px] font-bold ${trx.statusBg}`}>
                            {trx.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button onClick={(e) => { e.stopPropagation(); showToast(`Mencetak struk cepat untuk ${trx.id}...`); }} className="p-1 rounded-lg hover:bg-surface-container text-secondary hover:text-primary transition-colors" title="Print Struk Cepat">
                              <span className="material-symbols-outlined text-base">print</span>
                            </button>
                            <DropdownMenu.Root>
                              <DropdownMenu.Trigger asChild>
                                <button className="p-1 rounded-lg hover:bg-surface-container text-secondary hover:text-on-surface transition-colors" title="Opsi" onClick={(e) => e.stopPropagation()}>
                                  <span className="material-symbols-outlined text-base">more_vert</span>
                                </button>
                              </DropdownMenu.Trigger>
                              <DropdownMenu.Portal>
                                <DropdownMenu.Content 
                                  className="min-w-[160px] bg-white rounded-xl shadow-lg border border-slate-200 p-1 z-50 animate-scale-in" 
                                  sideOffset={5} 
                                  align="end"
                                >
                                  <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-[12px] font-medium text-slate-700 hover:bg-slate-50 hover:text-primary rounded-lg cursor-pointer outline-none transition-colors" onSelect={(e) => { e.preventDefault(); router.push(`/kasir?edit=${trx.id}`); }}>
                                    <span className="material-symbols-outlined text-base">edit</span>
                                    Edit Faktur
                                  </DropdownMenu.Item>
                                  <DropdownMenu.Separator className="h-px bg-slate-100 my-1" />
                                  <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-[12px] font-medium text-status-danger hover:bg-red-50 rounded-lg cursor-pointer outline-none transition-colors" onSelect={(e) => { e.preventDefault(); setTransactions(prev => prev.filter(t => t.id !== trx.id)); showToast(`Transaksi ${trx.id} dihapus`); if (activeInvoice === trx.id) setActiveInvoice(null); }}>
                                    <span className="material-symbols-outlined text-base">delete</span>
                                    Hapus
                                  </DropdownMenu.Item>
                                </DropdownMenu.Content>
                              </DropdownMenu.Portal>
                            </DropdownMenu.Root>
                          </div>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-secondary font-label-md">
                        <span className="material-symbols-outlined text-4xl mb-2 opacity-50 block">search_off</span>
                        Tidak ada transaksi yang cocok dengan filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="p-4 bg-surface-card flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="font-body-sm text-[12px] text-secondary">
                  Menampilkan <span className="font-bold text-on-surface">{startItem} - {endItem}</span> dari <span className="font-bold text-on-surface">{filteredTransactions.length}</span> total transaksi
                </span>
                <div className="inline-flex items-center gap-1 text-secondary font-label-sm text-[11px]">
                  <span>Tampil:</span>
                  <select 
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className="py-1 px-2 rounded-lg bg-surface-container-low text-on-surface font-label-sm text-[11px] border-0 focus:ring-1 focus:ring-primary cursor-pointer"
                  >
                    <option value={5}>5 per hal</option>
                    <option value={10}>10 per hal</option>
                    <option value={25}>25 per hal</option>
                    <option value={50}>50 per hal</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={safeCurrentPage === 1}
                  className="p-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-secondary disabled:opacity-50 disabled:hover:bg-surface-container-low transition-colors" 
                  type="button"
                >
                  <span className="material-symbols-outlined text-base">chevron_left</span>
                </button>
                
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
                  <button 
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg font-label-sm text-[11px] transition-colors ${
                      safeCurrentPage === page 
                        ? "bg-primary-container text-on-primary font-bold shadow-sm" 
                        : "bg-surface-container-low hover:bg-surface-container text-on-surface"
                    }`}
                    type="button"
                  >
                    {page}
                  </button>
                ))}
                
                {totalPages > 5 && <span className="px-1 text-secondary">...</span>}
                {totalPages > 5 && (
                  <button 
                    onClick={() => setCurrentPage(totalPages)}
                    className={`w-8 h-8 rounded-lg font-label-sm text-[11px] transition-colors ${
                      safeCurrentPage === totalPages 
                        ? "bg-primary-container text-on-primary font-bold shadow-sm" 
                        : "bg-surface-container-low hover:bg-surface-container text-on-surface"
                    }`}
                    type="button"
                  >
                    {totalPages}
                  </button>
                )}

                <button 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={safeCurrentPage === totalPages}
                  className="p-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-secondary hover:text-on-surface disabled:opacity-50 disabled:hover:bg-surface-container-low transition-colors" 
                  type="button"
                >
                  <span className="material-symbols-outlined text-base">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Sticky Side Detail Panel */}
        <div className="lg:col-span-4 sticky top-24 space-y-4 print:col-span-12 print:static print:w-full print:max-w-md print:mx-auto print:py-8 print:px-4">
          {activeInvoice && (
            (() => {
              const activeTransaction = transactions.find(t => t.id === activeInvoice);
              if (!activeTransaction) return null;
              
              const handlePrint = () => {
                showToast(`Menyiapkan struk PDF untuk ${activeTransaction.id}...`);
                setTimeout(() => window.print(), 500); // Browser print dialog
              };

              const handleWA = () => {
                let text = `*UMKM Smartbook*\n`;
                text += `Bukti Transaksi - ${activeTransaction.id}\n`;
                text += `----------------------------------------\n`;
                text += `Waktu: 19 Jan 2026 • ${activeTransaction.time}\n`;
                text += `Pelanggan: ${activeTransaction.customer} (${activeTransaction.customerDesc})\n`;
                text += `Kasir: ${activeTransaction.cashier}\n`;
                text += `----------------------------------------\n`;
                
                if (activeTransaction.items) {
                  activeTransaction.items.forEach(item => {
                    text += `${item.name}\n`;
                    text += `${item.qty}x @ ${item.price} = ${item.total}\n`;
                    if (item.note) text += `Catatan: ${item.note}\n`;
                    text += `\n`;
                  });
                }
                
                text += `----------------------------------------\n`;
                text += `Subtotal: ${activeTransaction.subtotal}\n`;
                if (activeTransaction.discount !== "Rp 0") text += `Diskon: ${activeTransaction.discount}\n`;
                if (activeTransaction.tax !== "Rp 0") text += `Pajak: ${activeTransaction.tax}\n`;
                text += `*TOTAL: ${activeTransaction.total}*\n`;
                text += `----------------------------------------\n`;
                text += `Status: ${activeTransaction.status}\n`;
                text += `Pembayaran: ${activeTransaction.paymentRef}\n`;
                text += `\nTerima kasih telah berbelanja!`;

                const encodedText = encodeURIComponent(text);
                // Redirect ke nomor WhatsApp secara generik, atau nomor mock 628111222333
                window.open(`https://wa.me/628111222333?text=${encodedText}`, '_blank');
                showToast("Membuka WhatsApp...");
              };

              return (
              <div className="rounded-xl bg-surface-card p-5 shadow-sm space-y-5 print:shadow-none print:p-0 print:bg-white print:text-black print:text-sm">
                <div className="flex items-start justify-between gap-2 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-headline-sm text-[18px] font-bold text-on-surface">Detail Faktur</span>
                      <span className={`px-2 py-0.5 rounded-full font-label-sm text-[11px] font-bold ${activeTransaction.statusBg}`}>
                        {activeTransaction.status}
                      </span>
                    </div>
                    <div className="text-tabular-numeric font-bold text-primary mt-0.5">
                      #{activeTransaction.id}
                    </div>
                    <div className="font-body-sm text-[12px] text-secondary mt-0.5">
                      19 Jan 2026 • {activeTransaction.time}
                    </div>
                  </div>
                  <button onClick={() => setActiveInvoice(null)} className="p-1.5 rounded-lg bg-surface-container-low text-secondary hover:text-on-surface hover:bg-surface-container transition-colors print:hidden" title="Tutup Detail" type="button">
                    <span className="material-symbols-outlined text-base">close</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-surface-container-low">
                  <div>
                    <span className="font-label-sm text-[11px] text-secondary uppercase block">Pelanggan</span>
                    <span className="font-label-md text-[12px] font-bold text-on-surface">{activeTransaction.customer}</span>
                    <span className="font-body-sm text-[12px] text-teal-accent block font-medium">{activeTransaction.customerDesc}</span>
                  </div>
                  <div>
                    <span className="font-label-sm text-[11px] text-secondary uppercase block">Kasir / Shift</span>
                    <span className="font-label-md text-[12px] font-bold text-on-surface">{activeTransaction.cashier}</span>
                    <span className="font-body-sm text-[12px] text-secondary block">Shift Siang • POS 01</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-[12px] font-bold text-on-surface uppercase tracking-wide">Rincian Item ({activeTransaction.items?.length || 0})</span>
                    <span className="font-label-sm text-[11px] text-secondary">{activeTransaction.pcsCount}</span>
                  </div>
                  <div className="space-y-3 divide-y-0 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                    {activeTransaction.items?.map((item, idx) => (
                      <div key={idx} className="flex items-start justify-between gap-3 text-on-surface pt-2 first:pt-0">
                        <div className="space-y-0.5">
                          <div className="font-label-md text-[12px] font-bold leading-snug">{item.name}</div>
                          <div className="font-body-sm text-[12px] text-secondary">{item.qty}x @ {item.price}</div>
                          {item.note && (
                            <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-surface-container text-secondary font-label-sm text-[11px]">
                              {item.note}
                            </div>
                          )}
                        </div>
                        <div className="text-tabular-numeric font-bold text-right">{item.total}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-surface-container-low/70 space-y-2.5">
                  <div className="flex items-center justify-between font-body-sm text-[12px] text-secondary">
                    <span>Subtotal {activeTransaction.pcsCount}</span>
                    <span className="text-tabular-numeric font-semibold text-on-surface">{activeTransaction.subtotal}</span>
                  </div>
                  {activeTransaction.discount !== "Rp 0" && (
                  <div className="flex items-center justify-between font-body-sm text-[12px] text-status-success">
                    <span className="inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">confirmation_number</span>
                      Diskon
                    </span>
                    <span className="text-tabular-numeric font-semibold">{activeTransaction.discount}</span>
                  </div>
                  )}
                  {activeTransaction.tax !== "Rp 0" && (
                  <div className="flex items-center justify-between font-body-sm text-[12px] text-secondary">
                    <span>Pajak Restoran PB1 (10%)</span>
                    <span className="text-tabular-numeric font-semibold text-on-surface">{activeTransaction.tax}</span>
                  </div>
                  )}
                  <div className="pt-2 flex items-center justify-between font-headline-sm text-[18px] font-bold text-on-surface">
                    <span>TOTAL AKHIR</span>
                    <span className="text-primary font-price-display text-[32px] font-extrabold leading-[40px] tracking-[-0.03em]">{activeTransaction.total}</span>
                  </div>
                </div>

                <div className={`p-3 rounded-xl space-y-1.5 ${activeTransaction.status === 'VOID' ? 'bg-status-danger-bg/60' : 'bg-status-success-bg/60'}`}>
                  <div className={`flex items-center justify-between font-label-sm text-[11px] font-bold ${activeTransaction.status === 'VOID' ? 'text-status-danger' : 'text-status-success'}`}>
                    <span className="inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">{activeTransaction.status === 'VOID' ? 'cancel' : 'verified'}</span>
                      {activeTransaction.paymentRef}
                    </span>
                    <span>{activeTransaction.status === 'VOID' ? 'Dibatalkan' : 'Settled'}</span>
                  </div>
                  <div className="flex items-center justify-between font-body-sm text-[12px] text-secondary">
                    <span>Stan Acquirer / Issuer:</span>
                    <span className="font-semibold text-on-surface">{activeTransaction.acquirer}</span>
                  </div>
                  <div className="flex items-center justify-between font-body-sm text-[12px] text-secondary">
                    <span>Waktu Sukses:</span>
                    <span className="font-semibold text-on-surface">{activeTransaction.time}</span>
                  </div>
                </div>

                <div className="space-y-2.5 pt-1 print:hidden">
                  <button onClick={handlePrint} className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-[12px] font-bold shadow-md transition-all active:scale-[0.99]" type="button">
                    <span className="material-symbols-outlined text-lg">receipt</span>
                    <span>Cetak Struk POS (Thermal 58/80mm)</span>
                  </button>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button onClick={handleWA} className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-surface-card hover:bg-status-success-bg text-status-success font-label-sm text-[11px] font-bold shadow-sm transition-colors" type="button">
                      <span className="material-symbols-outlined text-base">chat</span>
                      <span>Kirim WhatsApp</span>
                    </button>
                    <button onClick={handlePrint} className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-surface-card hover:bg-surface-container text-on-surface font-label-sm text-[11px] font-semibold shadow-sm transition-colors" type="button">
                      <span className="material-symbols-outlined text-base text-secondary">picture_as_pdf</span>
                      <span>Unduh PDF</span>
                    </button>
                  </div>
                  <button onClick={() => setShowVoidModal(true)} className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-status-danger-bg hover:bg-red-100 text-status-danger font-label-sm text-[11px] font-semibold transition-colors" type="button">
                    <span className="material-symbols-outlined text-base">cancel</span>
                    <span>Void / Batalkan Transaksi Ini</span>
                  </button>
                </div>
              </div>
              );
            })()
          )}

          {!activeInvoice && (
             <div className="rounded-xl bg-surface-card p-5 shadow-sm space-y-5 text-center flex flex-col items-center justify-center h-48 border border-dashed border-slate-200">
               <span className="material-symbols-outlined text-4xl text-slate-300">receipt_long</span>
               <p className="text-secondary font-label-md text-[12px]">Pilih transaksi untuk melihat detail faktur.</p>
             </div>
          )}

          <div className="p-4 rounded-xl bg-surface-card shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-primary font-label-md text-[12px] font-bold">
              <span className="material-symbols-outlined text-base">tips_and_updates</span>
              <span>Tips POS Cepat</span>
            </div>
            <p className="font-body-sm text-[12px] text-secondary">
              Tekan tombol keyboard <kbd className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface font-mono text-[10px]">F8</kbd> di kasir untuk cetak ulang cepat struk terakhir tanpa membuka preview faktur.
            </p>
          </div>
        </div>
      </section>
      {/* ══════ MODALS / CONFIRMATION DIALOGS ══════ */}

      {/* REKAP SHIFT KASIR MODAL */}
      {showRekapModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowRekapModal(false)}></div>
          <div className="relative bg-surface-container-lowest rounded-3xl shadow-2xl p-6 w-full max-w-md mx-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">point_of_sale</span>
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-on-surface leading-tight">Rekap Shift Kasir</h3>
                  <p className="text-[12px] text-secondary">Shift Siang • Budi Santoso</p>
                </div>
              </div>
              <button onClick={() => setShowRekapModal(false)} className="p-2 rounded-xl hover:bg-surface-container text-secondary transition-colors" type="button">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-surface-container-low p-4 rounded-2xl flex justify-between items-center border border-border-subtle/50">
                <div>
                  <span className="text-[11px] font-bold text-secondary uppercase tracking-wider block mb-0.5">Saldo Awal Laci</span>
                  <span className="text-[16px] font-bold text-on-surface">Rp 500.000</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-secondary uppercase tracking-wider block mb-0.5">Penjualan Tunai</span>
                  <span className="text-[16px] font-bold text-status-success">+ Rp 2.450.000</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[12px] font-bold text-on-surface block">Uang Fisik Aktual di Laci</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary font-bold text-[14px]">Rp</span>
                  <input type="text" className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-border-subtle rounded-xl text-on-surface font-bold text-[16px] focus:outline-none focus:border-primary transition-colors shadow-inner" placeholder="0" defaultValue="2.950.000" />
                </div>
                <p className="text-[11px] text-status-success font-semibold flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span> Selisih: Rp 0 (Sesuai Sistem)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <button onClick={() => setShowRekapModal(false)} className="py-3 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface text-sm font-semibold transition-all shadow-sm" type="button">Tutup Halaman</button>
              <button onClick={() => { setShowRekapModal(false); showToast("Shift ditutup dan rekap dicetak!"); }} className="py-3 rounded-xl bg-primary text-on-primary text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2" type="button">
                <span className="material-symbols-outlined text-[18px]">print</span>
                Cetak Rekap
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VOID / CANCEL INVOICE MODAL */}
      {showVoidModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { setShowVoidModal(false); setVoidPin(""); setVoidReason(""); }}></div>
          <div className="relative bg-surface-container-lowest rounded-3xl shadow-2xl p-6 w-full max-w-sm mx-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center mb-5">
              <div className="w-14 h-14 rounded-full bg-status-danger-bg text-status-danger flex items-center justify-center mx-auto mb-3">
                <span className="material-symbols-outlined text-[28px]">warning</span>
              </div>
              <h3 className="text-[18px] font-bold text-on-surface">Void Transaksi?</h3>
              <p className="text-[12px] text-secondary mt-1">Faktur <strong className="text-on-surface">#{activeInvoice}</strong> akan dibatalkan permanen. Stok akan dikembalikan ke sistem.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5 text-left">
                <label className="text-[12px] font-bold text-on-surface block">Alasan Void</label>
                <select value={voidReason} onChange={(e) => setVoidReason(e.target.value)} className="w-full px-3 py-2.5 bg-surface-container-low border-r-8 border-transparent rounded-xl text-on-surface text-sm focus:ring-1 focus:ring-status-danger font-semibold shadow-inner">
                  <option value="">Pilih Alasan...</option>
                  <option value="Salah input">Salah input item/harga</option>
                  <option value="Pelanggan batal">Pelanggan batal (sudah lunas)</option>
                  <option value="Ganti metode">Ganti metode pembayaran</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-[12px] font-bold text-on-surface flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">lock</span>
                  PIN Manager/Admin
                </label>
                <input 
                  type="password" 
                  value={voidPin}
                  onChange={(e) => setVoidPin(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-container-lowest border border-border-subtle rounded-xl text-center text-on-surface font-mono tracking-widest text-xl focus:outline-none focus:border-status-danger transition-colors shadow-inner" 
                  placeholder="••••" 
                  maxLength={4}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <button onClick={() => { setShowVoidModal(false); setVoidPin(""); setVoidReason(""); }} className="py-3 rounded-xl bg-surface-container-low hover:bg-surface-container border border-border-subtle text-on-surface text-sm font-semibold transition-all shadow-sm" type="button">Batal</button>
              <button 
                onClick={() => {
                  if (voidPin.length < 4 || !voidReason) {
                    showToast("Harap pilih alasan dan isi PIN 4 digit!");
                    return;
                  }
                  // Action to void
                  setTransactions(prev => prev.map(t => 
                    t.id === activeInvoice 
                      ? { ...t, status: "VOID", statusBg: "bg-surface-container text-secondary", method: "-", totalColor: "text-secondary line-through" }
                      : t
                  ));
                  showToast(`Faktur ${activeInvoice} berhasil di-void`);
                  setShowVoidModal(false);
                  setVoidPin("");
                  setVoidReason("");
                  setActiveInvoice(null);
                }} 
                className="py-3 rounded-xl bg-status-danger text-white text-sm font-bold shadow-md shadow-status-danger/20 hover:bg-status-danger/90 active:scale-[0.98] transition-all" type="button">
                Proses Void
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
