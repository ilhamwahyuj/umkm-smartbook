"use client";

import React, { useEffect, useRef, useState } from "react";
import { formatRupiah, formatDate } from "@/lib/utils";

export default function PiutangPage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setStartY(e.pageY - scrollRef.current.offsetTop);
    setScrollLeft(scrollRef.current.scrollLeft);
    setScrollTop(scrollRef.current.scrollTop);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const y = e.pageY - scrollRef.current.offsetTop;
    const walkX = (x - startX) * 2;
    const walkY = (y - startY) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walkX;
    scrollRef.current.scrollTop = scrollTop - walkY;
  };

  useEffect(() => {
    // Micro-interaction JS for quick action simulation
    const payButtons = document.querySelectorAll('tbody button[title="Catat Pelunasan"]');
    payButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const row = (e.target as HTMLElement).closest("tr");
        if (row) {
          const clientName = row.querySelector(".font-headline-sm")?.textContent || "";
          const remaining = row.querySelector("td:nth-last-child(2)")?.textContent || "";
          alert(`Membuka form pelunasan untuk: ${clientName.trim()}\nSisa Tagihan: ${remaining.trim()}`);
        }
      });
    });

    const waButtons = document.querySelectorAll('tbody button[title="Kirim Nota via WA"]');
    waButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const row = (e.target as HTMLElement).closest("tr");
        if (row) {
          const clientName = row.querySelector(".font-headline-sm")?.textContent || "";
          alert(`Draft pengingat WhatsApp terkirim secara otomatis ke ${clientName.trim()}!`);
        }
      });
    });
  }, []);

  return (
    <div className="flex flex-col w-full">
      {/* Page Main Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-status-info-bg text-status-info font-bold">
              Finansial &amp; Buku Kas
            </span>
            <span className="font-body-sm text-body-sm text-secondary">Periode Buku: Oktober 2024</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">Piutang &amp; Hutang Usaha</h1>
          <p className="font-body-md text-body-md text-secondary max-w-2xl">
            Pantau perputaran modal kasbon pelanggan mitra, kewajiban tempo supplier restock bahan baku, dan pengingat jatuh tempo harian toko Anda.
          </p>
        </div>
        {/* Top Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
          <button
            className="flex items-center justify-center sm:justify-start gap-2 px-4 py-2.5 rounded-xl bg-surface-card hover:bg-surface-canvas text-on-surface font-label-lg text-label-lg shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] w-full sm:w-auto"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">download</span>
            <span>Unduh Rekap</span>
          </button>
          <button
            className="flex items-center justify-center sm:justify-start gap-2 px-4 py-2.5 rounded-xl bg-primary-container hover:bg-teal-accent text-on-primary font-label-lg text-label-lg shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] w-full sm:w-auto"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            <span>+ Catat Manual</span>
          </button>
        </div>
      </div>
      
      {/* Bento 4-Column Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {/* Card 1: Total Piutang */}
        <div className="relative overflow-hidden rounded-xl bg-surface-card p-5 shadow-sm flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-status-info"></div>
          <div className="flex items-center justify-between pl-2 mb-2">
            <span className="font-label-md text-label-md uppercase tracking-wider text-secondary">Total Piutang (Receivable)</span>
            <div className="w-8 h-8 rounded-lg bg-status-info-bg text-status-info flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
            </div>
          </div>
          <div className="pl-2 space-y-2">
            <div className="font-price-display text-price-display text-on-surface">Rp 14.850.000</div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full font-label-sm text-label-sm bg-status-info-bg text-status-info">
                12 Pelanggan Aktif
              </span>
              <span className="font-body-sm text-body-sm text-secondary">Kasbon mitra &amp; langganan</span>
            </div>
          </div>
        </div>
        
        {/* Card 2: Piutang Jatuh Tempo */}
        <div className="relative overflow-hidden rounded-xl bg-surface-card p-5 shadow-sm flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-status-danger"></div>
          <div className="flex items-center justify-between pl-2 mb-2">
            <span className="font-label-md text-label-md uppercase tracking-wider text-secondary">Jatuh Tempo &lt; 7 Hari</span>
            <div className="w-8 h-8 rounded-lg bg-status-danger-bg text-status-danger flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">notification_important</span>
            </div>
          </div>
          <div className="pl-2 space-y-2">
            <div className="font-price-display text-price-display text-status-danger">Rp 3.200.000</div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full font-label-sm text-label-sm bg-status-danger-bg text-status-danger">
                3 Tagihan Mendesak
              </span>
              <span className="font-body-sm text-body-sm text-secondary">Perlu kirim penagihan WA</span>
            </div>
          </div>
        </div>
        
        {/* Card 3: Total Hutang Supplier */}
        <div className="relative overflow-hidden rounded-xl bg-surface-card p-5 shadow-sm flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-status-warning"></div>
          <div className="flex items-center justify-between pl-2 mb-2">
            <span className="font-label-md text-label-md uppercase tracking-wider text-secondary">Hutang Supplier (Payable)</span>
            <div className="w-8 h-8 rounded-lg bg-status-warning-bg text-status-warning flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">local_shipping</span>
            </div>
          </div>
          <div className="pl-2 space-y-2">
            <div className="font-price-display text-price-display text-on-surface">Rp 28.400.000</div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full font-label-sm text-label-sm bg-status-warning-bg text-status-warning">
                4 Supplier Utama
              </span>
              <span className="font-body-sm text-body-sm text-secondary">Tempo restock gudang</span>
            </div>
          </div>
        </div>
        
        {/* Card 4: Rasio Likuiditas */}
        <div className="relative overflow-hidden rounded-xl bg-surface-card p-5 shadow-sm flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-status-success"></div>
          <div className="flex items-center justify-between pl-2 mb-2">
            <span className="font-label-md text-label-md uppercase tracking-wider text-secondary">Estimasi Arus Kas Bersih</span>
            <div className="w-8 h-8 rounded-lg bg-status-success-bg text-status-success flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">trending_up</span>
            </div>
          </div>
          <div className="pl-2 space-y-2">
            <div className="font-price-display text-price-display text-status-success">+ Rp 18.650.000</div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full font-label-sm text-label-sm bg-status-success-bg text-status-success">
                Status Sehat
              </span>
              <span className="font-body-sm text-body-sm text-secondary">Proyeksi likuiditas 7 hari</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Primary Tab Selector */}
      <div className="flex items-center gap-2 p-1.5 bg-surface-container rounded-xl w-full md:w-fit mb-6 shadow-inner overflow-x-auto custom-scrollbar whitespace-nowrap">
        <button
          className="flex items-center gap-2 px-5 py-2 rounded-lg bg-surface-card text-primary-container font-label-lg text-label-lg shadow-sm transition-all"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">receipt_long</span>
          <span>Piutang Pelanggan (Kasbon / Tempo)</span>
          <span className="ml-1 px-1.5 py-0.5 rounded-full bg-secondary-container text-primary-container text-[11px] font-bold">
            12
          </span>
        </button>
        <button
          className="flex items-center gap-2 px-5 py-2 rounded-lg text-secondary hover:text-on-surface font-label-lg text-label-lg transition-all"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">inventory</span>
          <span>Hutang Supplier (Restock Tempo)</span>
          <span className="ml-1 px-1.5 py-0.5 rounded-full bg-surface-canvas text-secondary text-[11px] font-bold">
            4
          </span>
        </button>
        <button
          className="flex items-center gap-2 px-5 py-2 rounded-lg text-secondary hover:text-on-surface font-label-lg text-label-lg transition-all"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">calendar_month</span>
          <span>Jadwal Kalender Jatuh Tempo</span>
        </button>
      </div>
      
      {/* Main Grid Layout: Tables & Quick Insights */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left/Center 8 Cols: Filter Bar + Receivables Table */}
        <div className="xl:col-span-8 flex flex-col gap-4 min-w-0">
          {/* Filter Controls Bar */}
          <div className="bg-surface-card p-4 rounded-xl shadow-sm flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
            <div className="flex-1 relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-secondary text-[20px]">
                search
              </span>
              <input
                className="w-full pl-10 pr-4 py-2 bg-surface-canvas text-on-surface rounded-lg font-body-md text-body-md placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary-container"
                placeholder="Cari nama pelanggan, kontak, atau #INV..."
                type="text"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Status Dropdown */}
              <select className="px-3 py-2 bg-surface-canvas text-on-surface rounded-lg font-label-md text-label-md focus:outline-none focus:ring-2 focus:ring-primary-container cursor-pointer">
                <option value="all">Semua Status (Semua)</option>
                <option value="unpaid">Belum Bayar (Unpaid)</option>
                <option value="partial">Sebagian (Partial)</option>
                <option value="overdue">Jatuh Tempo (Overdue)</option>
                <option value="paid">Lunas (Paid)</option>
              </select>
              {/* Range Timeframe */}
              <select className="px-3 py-2 bg-surface-canvas text-on-surface rounded-lg font-label-md text-label-md focus:outline-none focus:ring-2 focus:ring-primary-container cursor-pointer">
                <option value="this_month">Bulan Ini (Oktober)</option>
                <option value="last_30">30 Hari Terakhir</option>
                <option value="q4">Kuartal IV</option>
              </select>
              {/* Bulk WhatsApp Broadcast */}
              <button
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-status-success-bg hover:bg-status-success hover:text-on-primary text-status-success font-label-md text-label-md transition-all shadow-sm"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">send_to_mobile</span>
                <span>Broadcast Tagihan WA</span>
              </button>
            </div>
          </div>
          
          <style dangerouslySetInnerHTML={{__html: `
            .custom-scrollbar {
              scrollbar-width: auto;
              scrollbar-color: #94a3b8 transparent;
            }
            .custom-scrollbar::-webkit-scrollbar {
              height: 12px;
              display: block;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: #f1f5f9;
              border-radius: 8px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #94a3b8;
              border-radius: 8px;
              border: 3px solid #f1f5f9;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #64748b;
            }
          `}} />

          {/* Table Container */}
          <div className="bg-surface-card rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div 
              ref={scrollRef}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              className={`custom-scrollbar overflow-x-scroll pb-2 ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
            >
              <table className="w-full text-left border-collapse min-w-max whitespace-nowrap">
                <thead>
                  <tr className="bg-surface-canvas text-secondary font-label-sm text-label-sm uppercase tracking-wider">
                    <th className="py-3.5 px-4">Pelanggan &amp; Kontak</th>
                    <th className="py-3.5 px-4">No. Invoice / Ref</th>
                    <th className="py-3.5 px-4">Tgl Transaksi</th>
                    <th className="py-3.5 px-4">Jatuh Tempo</th>
                    <th className="py-3.5 px-4 text-right">Total Kasbon</th>
                    <th className="py-3.5 px-4 text-right">Sudah Dibayar</th>
                    <th className="py-3.5 px-4 text-right">Sisa Tagihan</th>
                    <th className="py-3.5 px-4 text-center">Aksi Cepat</th>
                  </tr>
                </thead>
                <tbody className="divide-y-0">
                  {/* Row 1: Overdue Warning */}
                  <tr className="hover:bg-surface-container-low transition-colors group border-b border-surface-container-high/50">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-status-danger-bg text-status-danger flex items-center justify-center font-bold text-label-md shrink-0">
                          KM
                        </div>
                        <div className="min-w-0">
                          <div className="font-headline-sm text-label-lg text-on-surface truncate">
                            Kafe Melodi Senja
                          </div>
                          <div className="font-body-sm text-body-sm text-secondary truncate">
                            +62 812-9988-1120
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-tabular-numeric text-tabular-numeric text-primary-container font-bold">
                        #INV-2024-0982
                      </span>
                      <div className="font-body-sm text-body-sm text-secondary">Konsinyasi Sirup</div>
                    </td>
                    <td className="py-3.5 px-4 font-tabular-numeric text-tabular-numeric text-secondary">
                      12 Okt 2024
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full font-label-sm text-label-sm bg-status-danger-bg text-status-danger font-bold">
                        Overdue 4 Hari
                      </span>
                      <div className="font-body-sm text-body-sm text-status-danger font-semibold mt-0.5">
                        20 Okt 2024
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-tabular-numeric text-tabular-numeric text-secondary">
                      Rp 4.500.000
                    </td>
                    <td className="py-3.5 px-4 text-right font-tabular-numeric text-tabular-numeric text-status-success">
                      Rp 2.000.000
                    </td>
                    <td className="py-3.5 px-4 text-right font-tabular-numeric text-tabular-numeric text-status-danger font-bold">
                      Rp 2.500.000
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          className="p-1.5 rounded-lg bg-status-success-bg text-status-success hover:bg-status-success hover:text-on-primary transition-colors"
                          title="Kirim Nota via WA"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[16px]">chat</span>
                        </button>
                        <button
                          className="px-2.5 py-1 rounded-lg bg-primary-container hover:bg-teal-accent text-on-primary font-label-sm text-label-sm transition-colors"
                          title="Catat Pelunasan"
                          type="button"
                        >
                          Bayar
                        </button>
                        <button
                          className="p-1.5 rounded-lg bg-surface-canvas text-secondary hover:text-on-surface transition-colors"
                          title="Lihat Detail"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[16px]">visibility</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                  {/* Row 2: Approaching Due Date */}
                  <tr className="hover:bg-surface-container-low transition-colors group border-b border-surface-container-high/50">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-status-warning-bg text-status-warning flex items-center justify-center font-bold text-label-md shrink-0">
                          KB
                        </div>
                        <div className="min-w-0">
                          <div className="font-headline-sm text-label-lg text-on-surface truncate">
                            Katering Berkah Kantor
                          </div>
                          <div className="font-body-sm text-body-sm text-secondary truncate">
                            +62 856-1122-3344
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-tabular-numeric text-tabular-numeric text-primary-container font-bold">
                        #INV-2024-1014
                      </span>
                      <div className="font-body-sm text-body-sm text-secondary">Snack Box Mingguan</div>
                    </td>
                    <td className="py-3.5 px-4 font-tabular-numeric text-tabular-numeric text-secondary">
                      18 Okt 2024
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full font-label-sm text-label-sm bg-status-warning-bg text-status-warning font-bold">
                        H-2 Jatuh Tempo
                      </span>
                      <div className="font-body-sm text-body-sm text-secondary mt-0.5">
                        26 Okt 2024
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-tabular-numeric text-tabular-numeric text-secondary">
                      Rp 3.800.000
                    </td>
                    <td className="py-3.5 px-4 text-right font-tabular-numeric text-tabular-numeric text-status-success">
                      Rp 0
                    </td>
                    <td className="py-3.5 px-4 text-right font-tabular-numeric text-tabular-numeric text-status-warning font-bold">
                      Rp 3.800.000
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          className="p-1.5 rounded-lg bg-status-success-bg text-status-success hover:bg-status-success hover:text-on-primary transition-colors"
                          title="Kirim Nota via WA"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[16px]">chat</span>
                        </button>
                        <button
                          className="px-2.5 py-1 rounded-lg bg-primary-container hover:bg-teal-accent text-on-primary font-label-sm text-label-sm transition-colors"
                          title="Catat Pelunasan"
                          type="button"
                        >
                          Bayar
                        </button>
                        <button
                          className="p-1.5 rounded-lg bg-surface-canvas text-secondary hover:text-on-surface transition-colors"
                          title="Lihat Detail"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[16px]">visibility</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                  {/* Row 3: Lancar / On Track */}
                  <tr className="hover:bg-surface-container-low transition-colors group border-b border-surface-container-high/50">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-surface-container-high text-primary-container flex items-center justify-center font-bold text-label-md shrink-0">
                          RK
                        </div>
                        <div className="min-w-0">
                          <div className="font-headline-sm text-label-lg text-on-surface truncate">
                            Reseller Kopi Nusantara
                          </div>
                          <div className="font-body-sm text-body-sm text-secondary truncate">
                            +62 813-4455-6677
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-tabular-numeric text-tabular-numeric text-primary-container font-bold">
                        #INV-2024-1029
                      </span>
                      <div className="font-body-sm text-body-sm text-secondary">Biji Kopi 25kg</div>
                    </td>
                    <td className="py-3.5 px-4 font-tabular-numeric text-tabular-numeric text-secondary">
                      22 Okt 2024
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full font-label-sm text-label-sm bg-status-info-bg text-status-info font-bold">
                        Tempo 14 Hari
                      </span>
                      <div className="font-body-sm text-body-sm text-secondary mt-0.5">
                        05 Nov 2024
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-tabular-numeric text-tabular-numeric text-secondary">
                      Rp 5.200.000
                    </td>
                    <td className="py-3.5 px-4 text-right font-tabular-numeric text-tabular-numeric text-status-success">
                      Rp 2.000.000
                    </td>
                    <td className="py-3.5 px-4 text-right font-tabular-numeric text-tabular-numeric text-on-surface font-bold">
                      Rp 3.200.000
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          className="p-1.5 rounded-lg bg-status-success-bg text-status-success hover:bg-status-success hover:text-on-primary transition-colors"
                          title="Kirim Nota via WA"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[16px]">chat</span>
                        </button>
                        <button
                          className="px-2.5 py-1 rounded-lg bg-primary-container hover:bg-teal-accent text-on-primary font-label-sm text-label-sm transition-colors"
                          title="Catat Pelunasan"
                          type="button"
                        >
                          Bayar
                        </button>
                        <button
                          className="p-1.5 rounded-lg bg-surface-canvas text-secondary hover:text-on-surface transition-colors"
                          title="Lihat Detail"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[16px]">visibility</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                  {/* Row 4: Lancar partial */}
                  <tr className="hover:bg-surface-container-low transition-colors group border-b border-surface-container-high/50">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-surface-container text-secondary flex items-center justify-center font-bold text-label-md shrink-0">
                          TS
                        </div>
                        <div className="min-w-0">
                          <div className="font-headline-sm text-label-lg text-on-surface truncate">
                            Toko Sembako Barokah
                          </div>
                          <div className="font-body-sm text-body-sm text-secondary truncate">
                            +62 821-7788-9900
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-tabular-numeric text-tabular-numeric text-primary-container font-bold">
                        #INV-2024-1045
                      </span>
                      <div className="font-body-sm text-body-sm text-secondary">Gula Pasir &amp; Susu UHT</div>
                    </td>
                    <td className="py-3.5 px-4 font-tabular-numeric text-tabular-numeric text-secondary">
                      23 Okt 2024
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full font-label-sm text-label-sm bg-status-info-bg text-status-info font-bold">
                        Tempo 7 Hari
                      </span>
                      <div className="font-body-sm text-body-sm text-secondary mt-0.5">
                        30 Okt 2024
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-tabular-numeric text-tabular-numeric text-secondary">
                      Rp 2.850.000
                    </td>
                    <td className="py-3.5 px-4 text-right font-tabular-numeric text-tabular-numeric text-status-success">
                      Rp 1.500.000
                    </td>
                    <td className="py-3.5 px-4 text-right font-tabular-numeric text-tabular-numeric text-on-surface font-bold">
                      Rp 1.350.000
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          className="p-1.5 rounded-lg bg-status-success-bg text-status-success hover:bg-status-success hover:text-on-primary transition-colors"
                          title="Kirim Nota via WA"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[16px]">chat</span>
                        </button>
                        <button
                          className="px-2.5 py-1 rounded-lg bg-primary-container hover:bg-teal-accent text-on-primary font-label-sm text-label-sm transition-colors"
                          title="Catat Pelunasan"
                          type="button"
                        >
                          Bayar
                        </button>
                        <button
                          className="p-1.5 rounded-lg bg-surface-canvas text-secondary hover:text-on-surface transition-colors"
                          title="Lihat Detail"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[16px]">visibility</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                  {/* Row 5: Newly Added Credit */}
                  <tr className="hover:bg-surface-container-low transition-colors group">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-status-success-bg text-status-success flex items-center justify-center font-bold text-label-md shrink-0">
                          WM
                        </div>
                        <div className="min-w-0">
                          <div className="font-headline-sm text-label-lg text-on-surface truncate">
                            Warung Makan Bu Joko
                          </div>
                          <div className="font-body-sm text-body-sm text-secondary truncate">
                            +62 878-3344-9911
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-tabular-numeric text-tabular-numeric text-primary-container font-bold">
                        #INV-2024-1060
                      </span>
                      <div className="font-body-sm text-body-sm text-secondary">Bahan Masak Paket C</div>
                    </td>
                    <td className="py-3.5 px-4 font-tabular-numeric text-tabular-numeric text-secondary">
                      24 Okt 2024
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full font-label-sm text-label-sm bg-status-info-bg text-status-info font-bold">
                        Tempo 10 Hari
                      </span>
                      <div className="font-body-sm text-body-sm text-secondary mt-0.5">
                        03 Nov 2024
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-tabular-numeric text-tabular-numeric text-secondary">
                      Rp 4.000.000
                    </td>
                    <td className="py-3.5 px-4 text-right font-tabular-numeric text-tabular-numeric text-status-success">
                      Rp 0
                    </td>
                    <td className="py-3.5 px-4 text-right font-tabular-numeric text-tabular-numeric text-on-surface font-bold">
                      Rp 4.000.000
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          className="p-1.5 rounded-lg bg-status-success-bg text-status-success hover:bg-status-success hover:text-on-primary transition-colors"
                          title="Kirim Nota via WA"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[16px]">chat</span>
                        </button>
                        <button
                          className="px-2.5 py-1 rounded-lg bg-primary-container hover:bg-teal-accent text-on-primary font-label-sm text-label-sm transition-colors"
                          title="Catat Pelunasan"
                          type="button"
                        >
                          Bayar
                        </button>
                        <button
                          className="p-1.5 rounded-lg bg-surface-canvas text-secondary hover:text-on-surface transition-colors"
                          title="Lihat Detail"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[16px]">visibility</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* Table Footer / Pagination */}
            <div className="p-4 bg-surface-canvas flex flex-col sm:flex-row items-center justify-between gap-3 text-secondary">
              <div className="font-body-sm text-body-sm">
                Menampilkan <span className="font-bold text-on-surface">1 - 5</span> dari <span className="font-bold text-on-surface">12</span> piutang terdata
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1.5 rounded-lg bg-surface-card text-secondary opacity-50 cursor-not-allowed font-label-sm text-label-sm"
                  disabled
                  type="button"
                >
                  Sebelumnya
                </button>
                <div className="flex items-center gap-1">
                  <button
                    className="w-8 h-8 rounded-lg bg-primary-container text-on-primary font-label-sm text-label-sm font-bold flex items-center justify-center"
                    type="button"
                  >
                    1
                  </button>
                  <button
                    className="w-8 h-8 rounded-lg bg-surface-card hover:bg-surface-container text-on-surface font-label-sm text-label-sm flex items-center justify-center"
                    type="button"
                  >
                    2
                  </button>
                  <button
                    className="w-8 h-8 rounded-lg bg-surface-card hover:bg-surface-container text-on-surface font-label-sm text-label-sm flex items-center justify-center"
                    type="button"
                  >
                    3
                  </button>
                </div>
                <button
                  className="px-3 py-1.5 rounded-lg bg-surface-card hover:bg-surface-container text-on-surface font-label-sm text-label-sm"
                  type="button"
                >
                  Berikutnya
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right 4 Cols: Analysis, Urgent Alerts, & Top Debtors */}
        <div className="xl:col-span-4 space-y-6">
          {/* Urgent Alert: Critical Payable Due in 3 Days */}
          <div className="relative overflow-hidden rounded-xl bg-status-danger-bg p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-status-danger text-on-primary flex items-center justify-center shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[24px]">crisis_alert</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-label-sm text-label-sm uppercase font-bold text-status-danger">
                    Jatuh Tempo Mendatang
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-status-danger text-on-primary font-label-sm text-[10px] font-bold">
                    H-3
                  </span>
                </div>
                <div className="font-headline-sm text-headline-sm text-on-surface">PT Biji Kopi Sangrai</div>
                <p className="font-body-sm text-body-sm text-secondary">
                  Tagihan Restock Roastery Grade A (#PO-8812) belum dibayar.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 bg-surface-card/60 rounded-xl p-3.5 flex items-center justify-between">
              <div>
                <span className="font-label-sm text-label-sm text-secondary block">Nominal Tagihan:</span>
                <span className="font-price-display text-price-display-mobile text-status-danger">Rp 12.000.000</span>
              </div>
              <button
                className="px-3.5 py-2 rounded-xl bg-primary-container hover:bg-teal-accent text-on-primary font-label-md text-label-md shadow-sm transition-all hover:scale-[1.02]"
                type="button"
              >
                Lunasi via Bank
              </button>
            </div>
          </div>
          
          {/* Top Debtors Panel (Pelanggan Piutang Terbesar) */}
          <div className="rounded-xl bg-surface-card p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="font-headline-sm text-headline-sm text-on-surface">3 Piutang Terbesar</h3>
                <p className="font-body-sm text-body-sm text-secondary">Konsentrasi resiko pembayaran kasbon</p>
              </div>
              <span className="material-symbols-outlined text-secondary">pie_chart</span>
            </div>
            {/* Top Debtor 1 */}
            <div className="p-3 bg-surface-canvas rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-headline-sm text-label-lg text-on-surface">Warung Makan Bu Joko</div>
                <div className="font-tabular-numeric text-label-lg text-on-surface font-bold">Rp 4.000.000</div>
              </div>
              <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                <div className="bg-primary-container h-2 rounded-full" style={{ width: '27%' }}></div>
              </div>
              <div className="flex justify-between font-body-sm text-body-sm text-secondary">
                <span>27% dari total piutang</span>
                <span className="text-status-success font-semibold">Tempo 10 hari</span>
              </div>
            </div>
            {/* Top Debtor 2 */}
            <div className="p-3 bg-surface-canvas rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-headline-sm text-label-lg text-on-surface">Katering Berkah Kantor</div>
                <div className="font-tabular-numeric text-label-lg text-on-surface font-bold">Rp 3.800.000</div>
              </div>
              <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                <div className="bg-status-warning h-2 rounded-full" style={{ width: '25.5%' }}></div>
              </div>
              <div className="flex justify-between font-body-sm text-body-sm text-secondary">
                <span>25.5% dari total piutang</span>
                <span className="text-status-warning font-semibold">H-2 jatuh tempo</span>
              </div>
            </div>
            {/* Top Debtor 3 */}
            <div className="p-3 bg-surface-canvas rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-headline-sm text-label-lg text-on-surface">Reseller Kopi Nusantara</div>
                <div className="font-tabular-numeric text-label-lg text-on-surface font-bold">Rp 3.200.000</div>
              </div>
              <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                <div className="bg-teal-accent h-2 rounded-full" style={{ width: '21.5%' }}></div>
              </div>
              <div className="flex justify-between font-body-sm text-body-sm text-secondary">
                <span>21.5% dari total piutang</span>
                <span className="text-status-info font-semibold">Tempo 14 hari</span>
              </div>
            </div>
            <button
              className="w-full py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary-container font-label-md text-label-md text-center transition-colors"
              type="button"
            >
              Lihat Analisis Penuaan Piutang (Aging Report)
            </button>
          </div>
          
          {/* Quick Settlement Drawer Trigger / Info Box */}
          <div className="rounded-xl bg-surface-card p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-primary-container">
              <span className="material-symbols-outlined text-[22px]">contactless</span>
              <h4 className="font-headline-sm text-headline-sm">Kanal Pelunasan Cepat</h4>
            </div>
            <p className="font-body-sm text-body-sm text-secondary">
              Bantu pelanggan membayar piutang tanpa ke kasir dengan tautan pembayaran instan QRIS Statis atau Virtual Account Mandiri/BCA.
            </p>
            {/* Visual Mini Card for QRIS / Settlement */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-surface-canvas to-surface-container flex items-center justify-between">
              <div className="space-y-1">
                <span className="font-label-sm text-label-sm uppercase text-secondary">QRIS Merchant Terverifikasi</span>
                <div className="font-headline-sm text-label-lg text-on-surface font-bold">UMKM Berkah Mart (ID-892)</div>
                <div className="font-body-sm text-body-sm text-status-success flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  <span>Terhubung dengan Settlement POS</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-surface-card p-1 shadow-sm flex items-center justify-center">
                {/* Inline Mini QR Vector */}
                <svg className="w-10 h-10 text-on-surface" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h4v2h-4v-2zm0 4h4v2h-4v-2zm-4-4h2v2h-2v-2zm0 4h2v2h-2v-2zm2-2h2v2h-2v-2zm-2-6h2v2h-2v-2zm6 0h2v4h-2v-4z"></path>
                </svg>
              </div>
            </div>
            <button
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-surface-card hover:bg-surface-canvas text-on-surface font-label-md text-label-md shadow-sm transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">share</span>
              <span>Bagikan Tautan QRIS Tagihan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

