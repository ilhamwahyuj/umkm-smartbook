"use client";
import React, { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export default function TransaksiPenjualanPage() {
  const [activeInvoice, setActiveInvoice] = useState("TRX-20260119-0042");

  const transactions = [
    {
      id: "TRX-20260119-0042",
      time: "14:28 WIB",
      customer: "Walk-in Guest",
      customerDesc: "Meja 04",
      customerIcon: "table_restaurant",
      cashier: "Budi Santoso",
      menuCount: "3 Menu",
      pcsCount: "(4 pcs)",
      itemsDesc: "Kopi Susu Aren, Croissant...",
      method: "QRIS",
      methodIcon: "qr_code_scanner",
      methodBg: "bg-status-success-bg text-status-success",
      status: "LUNAS",
      statusBg: "bg-status-success-bg text-status-success",
      total: "Rp 101.200",
      totalColor: "text-on-surface",
      note: "Disc Rp 10k",
      indicator: "bg-primary-container",
    },
    {
      id: "TRX-20260119-0041",
      time: "14:15 WIB",
      customer: "Ibu Ratna Dewi",
      customerDesc: "Bungkus",
      customerIcon: "shopping_bag",
      cashier: "Siti Aminah",
      menuCount: "2 Menu",
      pcsCount: "(2 pcs)",
      itemsDesc: "Earl Grey Milk Tea, Choco...",
      method: "Tunai",
      methodIcon: "payments",
      methodBg: "bg-surface-container text-secondary",
      status: "LUNAS",
      statusBg: "bg-status-success-bg text-status-success",
      total: "Rp 56.000",
      totalColor: "text-on-surface",
      note: "Pas Rp 60k",
      indicator: "bg-transparent",
    },
    {
      id: "TRX-20260119-0040",
      time: "13:50 WIB",
      customer: "Kafe Senja Mandiri",
      customerDesc: "B2B Kemitraan",
      customerIcon: "local_shipping",
      cashier: "Budi Santoso",
      menuCount: "4 Menu",
      pcsCount: "(20 pcs)",
      itemsDesc: "Biji Kopi House Blend 1kg, Sirup...",
      method: "Kasbon",
      methodIcon: "schedule",
      methodBg: "bg-status-warning-bg text-status-warning",
      status: "TEMPO (26 Jan)",
      statusBg: "bg-status-warning-bg text-status-warning",
      total: "Rp 850.000",
      totalColor: "text-status-warning",
      note: "DP: Rp 0",
      indicator: "bg-status-warning",
    },
    {
      id: "TRX-20260119-0039",
      time: "13:12 WIB",
      customer: "Bpk. Hendra Wijaya",
      customerDesc: "Dine-in",
      customerIcon: "storefront",
      cashier: "Siti Aminah",
      menuCount: "5 Menu",
      pcsCount: "(7 pcs)",
      itemsDesc: "Nasi Goreng Spesial, Es Teh...",
      method: "BCA Trf",
      methodIcon: "account_balance",
      methodBg: "bg-status-info-bg text-status-info",
      status: "LUNAS",
      statusBg: "bg-status-success-bg text-status-success",
      total: "Rp 235.000",
      totalColor: "text-on-surface",
      note: "Ref #8812",
      indicator: "bg-transparent",
    },
    {
      id: "TRX-20260119-0038",
      time: "12:45 WIB",
      customer: "Catering Bu Dimas",
      customerDesc: "Pre-Order",
      customerIcon: "event",
      cashier: "Budi Santoso",
      menuCount: "2 Menu",
      pcsCount: "(30 box)",
      itemsDesc: "Snack Box Premium, Kopi Literan",
      method: "DP QRIS",
      methodIcon: "price_change",
      methodBg: "bg-status-info-bg text-status-info",
      status: "DP 50%",
      statusBg: "bg-status-info-bg text-status-info",
      total: "Rp 380.000",
      totalColor: "text-on-surface",
      note: "Sisa Rp 380k",
      noteColor: "text-status-warning",
      indicator: "bg-status-info",
    },
    {
      id: "TRX-20260119-0037",
      time: "12:30 WIB",
      customer: "Rian Kusuma",
      customerDesc: "Meja 02",
      customerIcon: "storefront",
      cashier: "Siti Aminah",
      menuCount: "1 Menu",
      pcsCount: "(1 pcs)",
      itemsDesc: "Matcha Oat Latte Jumbo",
      method: "QRIS",
      methodIcon: "qr_code_scanner",
      methodBg: "bg-status-success-bg text-status-success",
      status: "LUNAS",
      statusBg: "bg-status-success-bg text-status-success",
      total: "Rp 32.000",
      totalColor: "text-on-surface",
      note: "No promo",
      indicator: "bg-transparent",
    },
  ];

  return (
    <div className="flex flex-col w-full space-y-6 max-w-7xl mx-auto">
      {/* Top Banner / Page Header */}
      <section className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
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
          <button className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-card hover:bg-surface-container-low text-secondary font-label-md text-[12px] font-semibold shadow-sm transition-all duration-150" type="button">
            <span className="material-symbols-outlined text-base text-teal-accent">point_of_sale</span>
            <span>Rekap Shift Kasir</span>
          </button>
          <button className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-card hover:bg-surface-container-low text-on-surface font-label-md text-[12px] font-semibold shadow-sm transition-all duration-150" type="button">
            <span className="material-symbols-outlined text-base text-secondary">file_download</span>
            <span>Export Excel/CSV</span>
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-[12px] font-semibold shadow-md transition-all duration-150 active:scale-95" type="button">
            <span className="material-symbols-outlined text-base">add_circle</span>
            <span>+ Transaksi Kasir Baru</span>
          </button>
        </div>
      </section>

      {/* 4 KPI Metrics Bento Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="relative overflow-hidden rounded-xl bg-surface-card p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-[12px] font-semibold text-secondary uppercase tracking-wider">Total Penjualan Hari Ini</span>
            <span className="p-2 rounded-lg bg-status-success-bg text-status-success">
              <span className="material-symbols-outlined text-lg">payments</span>
            </span>
          </div>
          <div>
            <div className="font-price-display text-[32px] leading-[40px] font-extrabold text-on-surface tracking-tight">Rp 14.850.000</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-status-success-bg text-status-success font-label-sm text-[11px] font-semibold">
                <span className="material-symbols-outlined text-xs">trending_up</span>
                +8.4%
              </span>
              <span className="font-body-sm text-[12px] text-secondary">vs kemarin • 142 Struk</span>
            </div>
          </div>
          <div className="h-1.5 w-full bg-surface-container-low rounded-full overflow-hidden">
            <div className="h-full bg-primary-container rounded-full" style={{ width: '78%' }}></div>
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
            <div className="font-price-display text-[32px] leading-[40px] font-extrabold text-on-surface tracking-tight">Rp 13.620.000</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary-fixed text-primary font-label-sm text-[11px] font-bold">
                91.7%
              </span>
              <span className="font-body-sm text-[12px] text-secondary">tingkat pelunasan hari ini</span>
            </div>
          </div>
          <div className="h-1.5 w-full bg-surface-container-low rounded-full overflow-hidden">
            <div className="h-full bg-teal-accent rounded-full" style={{ width: '91.7%' }}></div>
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
            <div className="font-price-display text-[32px] leading-[40px] font-extrabold text-on-surface tracking-tight">Rp 1.230.000</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-status-warning-bg text-status-warning font-label-sm text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-status-warning"></span>
                5 Tagihan
              </span>
              <span className="font-body-sm text-[12px] text-secondary">jatuh tempo s/d 7 hari</span>
            </div>
          </div>
          <div className="h-1.5 w-full bg-surface-container-low rounded-full overflow-hidden">
            <div className="h-full bg-status-warning rounded-full" style={{ width: '24%' }}></div>
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
            <div className="font-price-display text-[32px] leading-[40px] font-extrabold text-on-surface tracking-tight">Rp 104.500</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-status-success-bg text-status-success font-label-sm text-[11px] font-semibold">
                <span className="material-symbols-outlined text-xs">arrow_upward</span>
                +4.2%
              </span>
              <span className="font-body-sm text-[12px] text-secondary">rata-rata per meja / struk</span>
            </div>
          </div>
          <div className="h-1.5 w-full bg-surface-container-low rounded-full overflow-hidden">
            <div className="h-full bg-secondary rounded-full" style={{ width: '65%' }}></div>
          </div>
        </div>
      </section>

      {/* Filter, Search & Status Badges Bar */}
      <section className="p-4 rounded-xl bg-surface-card shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-xl">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary text-lg">search</span>
            <input className="w-full pl-10 pr-20 py-2 rounded-xl bg-surface-container-low text-on-surface placeholder:text-secondary font-body-sm text-[12px] focus:outline-none focus:bg-surface-card shadow-inner transition-colors" placeholder="Cari no. faktur, nama pelanggan, kasir, atau nama item..." type="text" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-surface-card text-secondary font-label-sm text-[11px] shadow-sm">⌘K</span>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative inline-flex items-center">
              <button className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-label-sm text-[11px] transition-colors" type="button">
                <span className="material-symbols-outlined text-base text-primary">calendar_today</span>
                <span>Hari Ini (19 Jan 2026)</span>
                <span className="material-symbols-outlined text-sm text-secondary">expand_more</span>
              </button>
            </div>
            <div className="relative inline-flex items-center">
              <button className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-label-sm text-[11px] transition-colors" type="button">
                <span className="material-symbols-outlined text-base text-secondary">account_balance_wallet</span>
                <span>Semua Metode</span>
                <span className="material-symbols-outlined text-sm text-secondary">expand_more</span>
              </button>
            </div>
            <div className="relative inline-flex items-center">
              <button className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-label-sm text-[11px] transition-colors" type="button">
                <span className="material-symbols-outlined text-base text-secondary">person</span>
                <span>Semua Kasir</span>
                <span className="material-symbols-outlined text-sm text-secondary">expand_more</span>
              </button>
            </div>
            <div className="relative inline-flex items-center">
              <button className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-label-sm text-[11px] transition-colors" type="button">
                <span className="material-symbols-outlined text-base text-secondary">dining</span>
                <span>Semua Tipe</span>
                <span className="material-symbols-outlined text-sm text-secondary">expand_more</span>
              </button>
            </div>
            <button className="p-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-secondary transition-colors" title="Reset Filter" type="button">
              <span className="material-symbols-outlined text-lg">filter_alt_off</span>
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pt-2">
          <button className="shrink-0 px-3.5 py-1.5 rounded-full bg-primary-container text-on-primary font-label-sm text-[11px] font-bold shadow-sm" type="button">
            Semua Status <span className="ml-1 opacity-80">(142)</span>
          </button>
          <button className="shrink-0 px-3.5 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container text-secondary hover:text-on-surface font-label-sm text-[11px] transition-colors" type="button">
            Lunas <span className="ml-1 px-1.5 py-0.5 rounded-full bg-status-success-bg text-status-success font-semibold">(134)</span>
          </button>
          <button className="shrink-0 px-3.5 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container text-secondary hover:text-on-surface font-label-sm text-[11px] transition-colors" type="button">
            Sebagian / DP <span className="ml-1 px-1.5 py-0.5 rounded-full bg-status-info-bg text-status-info font-semibold">(3)</span>
          </button>
          <button className="shrink-0 px-3.5 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container text-secondary hover:text-on-surface font-label-sm text-[11px] transition-colors" type="button">
            Kasbon / Piutang <span className="ml-1 px-1.5 py-0.5 rounded-full bg-status-warning-bg text-status-warning font-semibold">(5)</span>
          </button>
          <button className="shrink-0 px-3.5 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container text-secondary hover:text-on-surface font-label-sm text-[11px] transition-colors" type="button">
            Dibatalkan / Void <span className="ml-1 opacity-70">(0)</span>
          </button>
        </div>
      </section>

      {/* Main Work Area */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Data Table */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
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
                  {transactions.map((trx) => {
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
                            <button className="p-1 rounded-lg hover:bg-surface-container text-secondary hover:text-primary transition-colors" title="Print Struk Cepat">
                              <span className="material-symbols-outlined text-base">print</span>
                            </button>
                            <DropdownMenu.Root>
                              <DropdownMenu.Trigger asChild>
                                <button className="p-1 rounded-lg hover:bg-surface-container text-secondary hover:text-on-surface transition-colors" title="Opsi">
                                  <span className="material-symbols-outlined text-base">more_vert</span>
                                </button>
                              </DropdownMenu.Trigger>
                              <DropdownMenu.Portal>
                                <DropdownMenu.Content 
                                  className="min-w-[160px] bg-white rounded-xl shadow-lg border border-slate-200 p-1 z-50 animate-scale-in" 
                                  sideOffset={5} 
                                  align="end"
                                >
                                  <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-[12px] font-medium text-slate-700 hover:bg-slate-50 hover:text-primary rounded-lg cursor-pointer outline-none transition-colors" onClick={(e) => e.stopPropagation()}>
                                    <span className="material-symbols-outlined text-base">edit</span>
                                    Edit Faktur
                                  </DropdownMenu.Item>
                                  <DropdownMenu.Separator className="h-px bg-slate-100 my-1" />
                                  <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-[12px] font-medium text-status-danger hover:bg-red-50 rounded-lg cursor-pointer outline-none transition-colors" onClick={(e) => e.stopPropagation()}>
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
                  })}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="p-4 bg-surface-card flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="font-body-sm text-[12px] text-secondary">
                  Menampilkan <span className="font-bold text-on-surface">1 - 6</span> dari <span className="font-bold text-on-surface">142</span> transaksi
                </span>
                <div className="inline-flex items-center gap-1 text-secondary font-label-sm text-[11px]">
                  <span>Tampil:</span>
                  <select className="py-1 px-2 rounded-lg bg-surface-container-low text-on-surface font-label-sm text-[11px] border-0 focus:ring-1 focus:ring-primary">
                    <option defaultValue="10 per hal">10 per hal</option>
                    <option>25 per hal</option>
                    <option>50 per hal</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button className="p-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-secondary disabled:opacity-50" disabled type="button">
                  <span className="material-symbols-outlined text-base">chevron_left</span>
                </button>
                <button className="w-8 h-8 rounded-lg bg-primary-container text-on-primary font-label-sm text-[11px] font-bold shadow-sm" type="button">
                  1
                </button>
                <button className="w-8 h-8 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-sm text-[11px]" type="button">
                  2
                </button>
                <button className="w-8 h-8 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-sm text-[11px]" type="button">
                  3
                </button>
                <span className="px-1 text-secondary">...</span>
                <button className="w-8 h-8 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-sm text-[11px]" type="button">
                  15
                </button>
                <button className="p-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-secondary hover:text-on-surface" type="button">
                  <span className="material-symbols-outlined text-base">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Sticky Side Detail Panel */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          {activeInvoice === "TRX-20260119-0042" && (
            <div className="rounded-xl bg-surface-card p-5 shadow-sm space-y-5">
              <div className="flex items-start justify-between gap-2 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-headline-sm text-[18px] font-bold text-on-surface">Detail Faktur</span>
                    <span className="px-2 py-0.5 rounded-full bg-status-success-bg text-status-success font-label-sm text-[11px] font-bold">
                      LUNAS
                    </span>
                  </div>
                  <div className="text-tabular-numeric font-bold text-primary mt-0.5">
                    #TRX-20260119-0042
                  </div>
                  <div className="font-body-sm text-[12px] text-secondary mt-0.5">
                    19 Jan 2026 • 14:28:15 WIB
                  </div>
                </div>
                <button className="p-1.5 rounded-lg bg-surface-container-low text-secondary hover:text-on-surface hover:bg-surface-container transition-colors" title="Tutup Detail" type="button">
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-surface-container-low">
                <div>
                  <span className="font-label-sm text-[11px] text-secondary uppercase block">Pelanggan</span>
                  <span className="font-label-md text-[12px] font-bold text-on-surface">Walk-in Guest</span>
                  <span className="font-body-sm text-[12px] text-teal-accent block font-medium">Meja 04 (Dine-in)</span>
                </div>
                <div>
                  <span className="font-label-sm text-[11px] text-secondary uppercase block">Kasir / Shift</span>
                  <span className="font-label-md text-[12px] font-bold text-on-surface">Budi Santoso</span>
                  <span className="font-body-sm text-[12px] text-secondary block">Shift Siang • POS 01</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-[12px] font-bold text-on-surface uppercase tracking-wide">Rincian Item (3)</span>
                  <span className="font-label-sm text-[11px] text-secondary">4 Total Qty</span>
                </div>
                <div className="space-y-3 divide-y-0">
                  <div className="flex items-start justify-between gap-3 text-on-surface">
                    <div className="space-y-0.5">
                      <div className="font-label-md text-[12px] font-bold leading-snug">Kopi Susu Aren</div>
                      <div className="font-body-sm text-[12px] text-secondary">2x @ Rp 22.000</div>
                      <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-surface-container text-secondary font-label-sm text-[11px]">
                        Less Sugar, Ice Regular
                      </div>
                    </div>
                    <div className="text-tabular-numeric font-bold text-right">Rp 44.000</div>
                  </div>
                  <div className="flex items-start justify-between gap-3 text-on-surface pt-2">
                    <div className="space-y-0.5">
                      <div className="font-label-md text-[12px] font-bold leading-snug">Croissant Butter</div>
                      <div className="font-body-sm text-[12px] text-secondary">1x @ Rp 28.000</div>
                      <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-surface-container text-secondary font-label-sm text-[11px]">
                        Hangatkan Crispy
                      </div>
                    </div>
                    <div className="text-tabular-numeric font-bold text-right">Rp 28.000</div>
                  </div>
                  <div className="flex items-start justify-between gap-3 text-on-surface pt-2">
                    <div className="space-y-0.5">
                      <div className="font-label-md text-[12px] font-bold leading-snug">Americano Ice</div>
                      <div className="font-body-sm text-[12px] text-secondary">1x @ Rp 18.000</div>
                      <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-surface-container text-secondary font-label-sm text-[11px]">
                        Normal Ice
                      </div>
                    </div>
                    <div className="text-tabular-numeric font-bold text-right">Rp 18.000</div>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container-low/70 space-y-2.5">
                <div className="flex items-center justify-between font-body-sm text-[12px] text-secondary">
                  <span>Subtotal (4 pcs)</span>
                  <span className="text-tabular-numeric font-semibold text-on-surface">Rp 90.000</span>
                </div>
                <div className="flex items-center justify-between font-body-sm text-[12px] text-status-success">
                  <span className="inline-flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">confirmation_number</span>
                    Voucher [SENINHEMAT]
                  </span>
                  <span className="text-tabular-numeric font-semibold">- Rp 10.000</span>
                </div>
                <div className="flex items-center justify-between font-body-sm text-[12px] text-secondary">
                  <span>Pajak Restoran PB1 (10%)</span>
                  <span className="text-tabular-numeric font-semibold text-on-surface">Rp 9.200</span>
                </div>
                <div className="pt-2 flex items-center justify-between font-headline-sm text-[18px] font-bold text-on-surface">
                  <span>TOTAL AKHIR</span>
                  <span className="text-primary font-price-display text-[32px] font-extrabold leading-[40px] tracking-[-0.03em]">Rp 101.200</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-status-success-bg/60 space-y-1.5">
                <div className="flex items-center justify-between font-label-sm text-[11px] text-status-success font-bold">
                  <span className="inline-flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">verified</span>
                    QRIS Dinamis (QR-98214-BCA)
                  </span>
                  <span>Settled</span>
                </div>
                <div className="flex items-center justify-between font-body-sm text-[12px] text-secondary">
                  <span>Stan Acquirer / Issuer:</span>
                  <span className="font-semibold text-on-surface">BCA Interactive QR</span>
                </div>
                <div className="flex items-center justify-between font-body-sm text-[12px] text-secondary">
                  <span>Waktu Sukses:</span>
                  <span className="font-semibold text-on-surface">14:28:15 WIB</span>
                </div>
              </div>

              <div className="space-y-2.5 pt-1">
                <button className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-[12px] font-bold shadow-md transition-all active:scale-[0.99]" type="button">
                  <span className="material-symbols-outlined text-lg">receipt</span>
                  <span>Cetak Struk POS (Thermal 58/80mm)</span>
                </button>
                <div className="grid grid-cols-2 gap-2.5">
                  <button className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-surface-card hover:bg-status-success-bg text-status-success font-label-sm text-[11px] font-bold shadow-sm transition-colors" type="button">
                    <span className="material-symbols-outlined text-base">chat</span>
                    <span>Kirim WhatsApp</span>
                  </button>
                  <button className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-surface-card hover:bg-surface-container text-on-surface font-label-sm text-[11px] font-semibold shadow-sm transition-colors" type="button">
                    <span className="material-symbols-outlined text-base text-secondary">picture_as_pdf</span>
                    <span>Unduh PDF</span>
                  </button>
                </div>
                <button className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-status-danger-bg hover:bg-red-100 text-status-danger font-label-sm text-[11px] font-semibold transition-colors" type="button">
                  <span className="material-symbols-outlined text-base">cancel</span>
                  <span>Void / Batalkan Transaksi Ini</span>
                </button>
              </div>
            </div>
          )}

          {activeInvoice !== "TRX-20260119-0042" && (
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
    </div>
  );
}
