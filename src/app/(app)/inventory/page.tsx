"use client";
import React, { useState } from "react";

export default function StokOpnamePage() {
  const [activeTab, setActiveTab] = useState('tab-stok');
  const [showOpnameModal, setShowOpnameModal] = useState(false);

  return (
    <div className="flex flex-col w-full">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Stok &amp; Stock Opname Gudang</h1>
          </div>
          <p className="font-body-md text-body-md text-secondary">
            Rekonsiliasi real-time stok sistem vs fisik gudang, pelacakan kartu mutasi otomatis, dan pencegahan kehilangan inventaris.
          </p>
        </div>
        {/* Quick Action CTA Group */}
        <div className="flex flex-wrap items-center gap-3">
          <button 
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-surface-container text-on-surface font-label-lg text-label-lg shadow-sm hover:bg-surface-container-high transition-all active:scale-[0.99]" 
            onClick={() => setShowOpnameModal(true)} 
            type="button"
          >
            <span className="material-symbols-outlined text-[20px] text-teal-accent">tune</span>
            <span>+ Penyesuaian Manual</span>
          </button>
          <button 
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-container text-on-primary font-label-lg text-label-lg shadow-md hover:bg-teal-accent transition-all active:scale-[0.99]" 
            onClick={() => setShowOpnameModal(true)} 
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">fact_check</span>
            <span>+ Mulai Sesi Opname Baru</span>
          </button>
        </div>
      </div>

      {/* Metric Cards: Bento 4 Kolom */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {/* Card 1: Total SKU & Aset */}
        <div className="bg-surface-card rounded-xl p-5 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-md text-label-md text-secondary uppercase tracking-wider">Total Item Terdaftar</span>
              <div className="font-price-display text-price-display text-on-surface mt-1">128 <span className="font-label-lg text-label-lg text-secondary">SKU</span></div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary-container">
              <span className="material-symbols-outlined text-[22px]">category</span>
            </div>
          </div>
          <div className="mt-4 pt-3 flex items-center justify-between bg-surface-canvas -mx-5 -mb-5 px-5 py-3">
            <span className="font-body-sm text-body-sm text-secondary">Nilai Aset Stok:</span>
            <span className="font-tabular-numeric text-tabular-numeric text-on-surface font-bold">Rp 42.600.000</span>
          </div>
        </div>

        {/* Card 2: Stok Menipis Kritis */}
        <div className="bg-surface-card rounded-xl p-5 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-md text-label-md text-status-danger uppercase tracking-wider">Perlu Restock Segera</span>
              <div className="font-price-display text-price-display text-status-danger mt-1">4 <span className="font-label-lg text-label-lg text-status-danger">Item</span></div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-status-danger-bg flex items-center justify-center text-status-danger">
              <span className="material-symbols-outlined text-[22px]">warning</span>
            </div>
          </div>
          <div className="mt-4 pt-3 flex items-center justify-between bg-status-danger-bg/50 -mx-5 -mb-5 px-5 py-3">
            <span className="font-body-sm text-body-sm text-status-danger font-medium">&lt; Batas Minimum Toko</span>
            <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-status-danger text-on-primary font-bold">Prioritas PO</span>
          </div>
        </div>

        {/* Card 3: Akurasi Stok */}
        <div className="bg-surface-card rounded-xl p-5 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-md text-label-md text-secondary uppercase tracking-wider">Akurasi Fisik vs POS</span>
              <div className="font-price-display text-price-display text-status-success mt-1">98.4<span className="font-label-lg text-label-lg text-status-success">%</span></div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-status-success-bg flex items-center justify-center text-status-success">
              <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            </div>
          </div>
          <div className="mt-4 pt-3 flex items-center justify-between bg-surface-canvas -mx-5 -mb-5 px-5 py-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-status-success"></span>
              <span className="font-body-sm text-body-sm text-secondary">Audit Minggu Lalu</span>
            </div>
            <span className="font-label-sm text-label-sm text-status-success font-semibold">Toleransi Aman (&lt;2%)</span>
          </div>
        </div>

        {/* Card 4: Mutasi Hari Ini */}
        <div className="bg-surface-card rounded-xl p-5 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-md text-label-md text-secondary uppercase tracking-wider">Mutasi Hari Ini</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-headline-md text-headline-md text-status-success">+45</span>
                <span className="text-secondary font-body-sm text-body-sm">/</span>
                <span className="font-headline-md text-headline-md text-status-danger">-182</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-status-info-bg flex items-center justify-center text-status-info">
              <span className="material-symbols-outlined text-[22px]">swap_horiz</span>
            </div>
          </div>
          <div className="mt-4 pt-3 flex items-center justify-between bg-surface-canvas -mx-5 -mb-5 px-5 py-3">
            <span className="font-body-sm text-body-sm text-secondary">Masuk: PO #204</span>
            <span className="font-body-sm text-body-sm text-secondary">Keluar: Kasir POS</span>
          </div>
        </div>
      </div>

      {/* Banner Sesi Opname Aktif */}
      <div className="bg-gradient-to-r from-primary-container to-teal-accent rounded-xl p-6 text-on-primary shadow-md mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-on-primary/5 pointer-events-none"></div>
        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-on-primary/20 backdrop-blur-md text-on-primary font-label-sm text-label-sm">
            <span className="w-2 h-2 rounded-full bg-tertiary-fixed animate-pulse"></span>
            <span>SESI OPNAME SEDANG BERJALAN</span>
          </div>
          <h2 className="font-headline-sm text-headline-sm text-on-primary">Sesi Opname Mingguan: Tutup Toko Minggu Ke-2 Februari</h2>
          <p className="font-body-md text-body-md text-on-primary/90">
            Perhitungan fisik sedang berlangsung oleh <span className="font-semibold text-white">Budi (Staff Barista)</span> &amp; <span className="font-semibold text-white">Dewi</span>. Progres: <strong className="text-white">85 dari 128</strong> item tercatat. Selisih sementara: <span className="bg-black/20 px-2 py-0.5 rounded text-white font-mono">-2 pcs Cup</span>, <span className="bg-black/20 px-2 py-0.5 rounded text-white font-mono">0 L Milk</span> (wajar susut uji kalibrasi mesin).
          </p>
          {/* Progress Bar */}
          <div className="w-full bg-black/20 rounded-full h-2.5 mt-3 overflow-hidden">
            <div className="bg-tertiary-fixed h-2.5 rounded-full" style={{ width: '66.4%' }}></div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 relative z-10">
          <button 
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-on-primary font-label-lg text-label-lg backdrop-blur transition-colors text-center" 
            onClick={() => setShowOpnameModal(true)} 
            type="button"
          >
            Lanjutkan Hitung (34 Item Sisa)
          </button>
          <button 
            className="px-5 py-2.5 rounded-xl bg-surface-card text-primary-container font-label-lg text-label-lg shadow-sm hover:bg-surface transition-all text-center font-bold" 
            onClick={() => alert('Hasil opname berhasil disimpan dan penyesuaian otomatis dibuat!')} 
            type="button"
          >
            Selesaikan &amp; Terapkan Penyesuaian
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-surface-card rounded-xl shadow-sm mb-6 w-fit">
        <button 
          className={`px-4 py-2 rounded-lg font-label-lg text-label-lg transition-all flex items-center gap-2 ${activeTab === 'tab-stok' ? 'bg-primary-container text-on-primary shadow-sm' : 'text-secondary hover:bg-surface-container'}`}
          onClick={() => setActiveTab('tab-stok')}
        >
          <span className="material-symbols-outlined text-[18px]">table_rows</span>
          <span>Daftar Stok &amp; Status Gudang</span>
        </button>
        <button 
          className={`px-4 py-2 rounded-lg font-label-lg text-label-lg transition-all flex items-center gap-2 ${activeTab === 'tab-sesi' ? 'bg-primary-container text-on-primary shadow-sm' : 'text-secondary hover:bg-surface-container'}`}
          onClick={() => setActiveTab('tab-sesi')}
        >
          <span className="material-symbols-outlined text-[18px]">history_edu</span>
          <span>Sesi Stock Opname &amp; Hasil Audit</span>
        </button>
        <button 
          className={`px-4 py-2 rounded-lg font-label-lg text-label-lg transition-all flex items-center gap-2 ${activeTab === 'tab-mutasi' ? 'bg-primary-container text-on-primary shadow-sm' : 'text-secondary hover:bg-surface-container'}`}
          onClick={() => setActiveTab('tab-mutasi')}
        >
          <span className="material-symbols-outlined text-[18px]">receipt_long</span>
          <span>Kartu Mutasi Stok (Movement Log)</span>
        </button>
      </div>

      {/* TAB CONTENT: DAFTAR STOK */}
      {activeTab === 'tab-stok' && (
        <div className="flex flex-col space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Filter, Search & Utility Bar */}
          <div className="bg-surface-card rounded-xl p-4 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary text-[20px]">search</span>
              <input 
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface-canvas text-on-surface font-body-md text-body-md placeholder:text-secondary/70 focus:outline-none focus:ring-2 focus:ring-primary-container" 
                placeholder="Cari SKU, nama bahan baku, barcode..." 
                type="text"
              />
            </div>
            {/* Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <select className="px-3.5 py-2.5 rounded-lg bg-surface-canvas text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container cursor-pointer">
                <option value="">Semua Kategori</option>
                <option value="raw_beans">Biji Kopi (Raw Beans)</option>
                <option value="dairy">Susu &amp; Dairy</option>
                <option value="syrup">Sirup &amp; Flavour</option>
                <option value="pastry">Pastry &amp; Makanan</option>
                <option value="packaging">Kemasan / Packaging</option>
              </select>
              <select className="px-3.5 py-2.5 rounded-lg bg-surface-canvas text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container cursor-pointer">
                <option value="">Semua Status Stok</option>
                <option value="aman">Aman / Cukup</option>
                <option value="menipis">Menipis (&lt; Batas Min)</option>
                <option value="kritis">Kritis / Habis</option>
                <option value="selisih">Pernah Berselisih</option>
              </select>
              <button className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors" title="Cetak Lembar Opname Kertas" type="button">
                <span className="material-symbols-outlined text-[18px]">print</span>
                <span className="hidden sm:inline">Cetak Lembar Hitung</span>
              </button>
              <button className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors" title="Export Excel / CSV" type="button">
                <span className="material-symbols-outlined text-[18px]">download</span>
                <span className="hidden sm:inline">Ekspor CSV</span>
              </button>
            </div>
          </div>
          {/* Inventory Data Table */}
          <div className="bg-surface-card rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-canvas text-secondary font-label-sm text-label-sm uppercase tracking-wider">
                    <th className="py-3.5 px-4 font-semibold">Produk &amp; SKU</th>
                    <th className="py-3.5 px-4 font-semibold">Kategori</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Stok Sistem</th>
                    <th className="py-3.5 px-4 font-semibold text-center">Batas Min</th>
                    <th className="py-3.5 px-4 font-semibold">Status</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Nilai Aset</th>
                    <th className="py-3.5 px-4 font-semibold">Terakhir Opname</th>
                    <th className="py-3.5 px-4 font-semibold text-center">Aksi Cepat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle font-body-md text-body-md">
                  {/* Row 1: Menipis */}
                  <tr className="hover:bg-surface-canvas/60 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img className="w-10 h-10 rounded-lg object-cover bg-surface-container" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEZS9ggEWUD50y-Qk6UM_WzHIld1IgifxqqBaPslXOKMRu1envNAIT2HTkYvT8jQPm7kShRg5lpOUKmj7jFoVc7K1q5ZWFdzEWHVuc16ek5WWNusJ_INYjat1cg1wkmYCxYLvL82LAyvDMJuiZ4pfooZTn5nZn1IaLAet8HMJIU46j66fnx63nHa-KxzdrldICRb10mO4aSgc19TYYCmV79YMdEGKxQQHvwjRTdnewRKwOARnegC1r" alt="House Blend Arabika Mandheling" />
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-on-surface truncate">House Blend Arabika Mandheling</span>
                          <span className="font-body-sm text-body-sm text-secondary font-mono">SKU-COF-001 • 8992019230</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-secondary">Biji Kopi (Raw Beans)</td>
                    <td className="py-4 px-4 text-right">
                      <div className="font-tabular-numeric text-tabular-numeric text-on-surface font-bold">3.20</div>
                      <div className="font-body-sm text-body-sm text-secondary">Kilogram (Kg)</div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="font-tabular-numeric text-tabular-numeric text-secondary font-semibold">5.00 Kg</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-label-sm text-label-sm bg-status-warning-bg text-status-warning font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-status-warning"></span>
                        Menipis
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-tabular-numeric text-tabular-numeric font-bold text-on-surface">Rp 800.000</span>
                      <span className="block font-body-sm text-body-sm text-secondary">@250rb/kg</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-body-sm text-body-sm text-on-surface">08 Feb 2025</div>
                      <div className="font-body-sm text-body-sm text-secondary">Oleh Budi (Kasir)</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button className="p-2 rounded-lg bg-surface-container hover:bg-primary-container hover:text-on-primary text-secondary transition-colors" onClick={() => setShowOpnameModal(true)} title="Input Opname Cepat" type="button">
                          <span className="material-symbols-outlined text-[18px]">edit_note</span>
                        </button>
                        <button className="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-secondary transition-colors" title="Kartu Mutasi Stok" type="button">
                          <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                        </button>
                        <button className="p-2 rounded-lg bg-status-warning-bg text-status-warning hover:bg-status-warning hover:text-on-primary transition-colors" title="Order Restock PO" type="button">
                          <span className="material-symbols-outlined text-[18px]">shopping_cart_checkout</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                  {/* Row 2: Aman */}
                  <tr className="hover:bg-surface-canvas/60 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img className="w-10 h-10 rounded-lg object-cover bg-surface-container" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqonxxtZSjwoz3nQWzU_sfL_37ukKKcTSu8ewuGC-DVqEcqdCn-c_8EtWSuR5W7SkNaj3H-DEN3Tqxno4bfobnTRiYss9A4nI2OZql9Nxty_RiudbGkouxp_1Sh-jpnmDSTCUJqQL35BK-wk1O_ZDOSwDcS8ZpXtG485n1ATBD9ptlhKfsOHs7HovZWHkClaNuwD6PtLqhkLIKFQCQtK7wrBscKr85qpaf3revcjHhRUjoNOeJuUjK" alt="Fresh Milk Greenfields UHT 1L" />
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-on-surface truncate">Fresh Milk Greenfields UHT 1L</span>
                          <span className="font-body-sm text-body-sm text-secondary font-mono">SKU-MLK-004 • 8993021941</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-secondary">Susu &amp; Dairy</td>
                    <td className="py-4 px-4 text-right">
                      <div className="font-tabular-numeric text-tabular-numeric text-on-surface font-bold">14.00</div>
                      <div className="font-body-sm text-body-sm text-secondary">Liter</div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="font-tabular-numeric text-tabular-numeric text-secondary font-semibold">10.00 L</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-label-sm text-label-sm bg-status-success-bg text-status-success font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-status-success"></span>
                        Aman
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-tabular-numeric text-tabular-numeric font-bold text-on-surface">Rp 350.000</span>
                      <span className="block font-body-sm text-body-sm text-secondary">@25rb/L</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-body-sm text-body-sm text-on-surface">Kemarin, 21:00</div>
                      <div className="font-body-sm text-body-sm text-secondary">Tutup Kasir</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button className="p-2 rounded-lg bg-surface-container hover:bg-primary-container hover:text-on-primary text-secondary transition-colors" onClick={() => setShowOpnameModal(true)} title="Input Opname Cepat" type="button">
                          <span className="material-symbols-outlined text-[18px]">edit_note</span>
                        </button>
                        <button className="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-secondary transition-colors" title="Kartu Mutasi Stok" type="button">
                          <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                        </button>
                        <button className="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-secondary transition-colors" title="Order Restock PO" type="button">
                          <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                  {/* Row 3: Kritis */}
                  <tr className="hover:bg-surface-canvas/60 transition-colors bg-status-danger-bg/20">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img className="w-10 h-10 rounded-lg object-cover bg-surface-container" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC70i5MSBR322gm51aDjxNSLwsK7HKNQC7orAfRdQfdei6cO0pfIpPLF8TtHJKEVQC2DiCT3_n4dEr7Bk-gNiYH87gZ8UcKfKIwHfmwNgjREWoCqRXHXBNNbcHDO8DpNDlBCRjRH4hwS8l641bUow2LgmzWXn-NQHZzd54EDjWjPkF0_czj1PdwnyZ-eijXo92wUTReGL2YBzfNp-NcNdTFcozEQuCCPOLLpQcf8XxOS1ZFre9dRUX7" alt="Paper Cup 8oz Double Wall Kraft" />
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-status-danger truncate">Paper Cup 8oz Double Wall Kraft</span>
                          <span className="font-body-sm text-body-sm text-secondary font-mono">SKU-PKG-012 • 8991209384</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-secondary">Kemasan/Packaging</td>
                    <td className="py-4 px-4 text-right">
                      <div className="font-tabular-numeric text-tabular-numeric text-status-danger font-extrabold">48</div>
                      <div className="font-body-sm text-body-sm text-secondary">Pcs (Lembar)</div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="font-tabular-numeric text-tabular-numeric text-status-danger font-bold">150 Pcs</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-label-sm text-label-sm bg-status-danger-bg text-status-danger font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-status-danger"></span>
                        Kritis
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-tabular-numeric text-tabular-numeric font-bold text-on-surface">Rp 40.800</span>
                      <span className="block font-body-sm text-body-sm text-secondary">@850/pcs</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-body-sm text-body-sm text-on-surface">06 Feb 2025</div>
                      <div className="font-body-sm text-body-sm text-status-danger font-medium">Selisih -2 pcs</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button className="p-2 rounded-lg bg-surface-container hover:bg-primary-container hover:text-on-primary text-secondary transition-colors" onClick={() => setShowOpnameModal(true)} title="Input Opname Cepat" type="button">
                          <span className="material-symbols-outlined text-[18px]">edit_note</span>
                        </button>
                        <button className="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-secondary transition-colors" title="Kartu Mutasi Stok" type="button">
                          <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                        </button>
                        <button className="p-2 rounded-lg bg-status-danger text-on-primary hover:bg-red-700 transition-colors shadow-sm" title="Restock Darurat" type="button">
                          <span className="material-symbols-outlined text-[18px]">shopping_cart_checkout</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                  {/* Row 4: Syrup Vanilla (Aman) */}
                  <tr className="hover:bg-surface-canvas/60 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-teal-accent">
                          <span className="material-symbols-outlined text-[24px]">liquor</span>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-on-surface truncate">Syrup Vanilla Flavour 700ml</span>
                          <span className="font-body-sm text-body-sm text-secondary font-mono">SKU-SYR-008 • 7928129031</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-secondary">Sirup &amp; Flavour</td>
                    <td className="py-4 px-4 text-right">
                      <div className="font-tabular-numeric text-tabular-numeric text-on-surface font-bold">6</div>
                      <div className="font-body-sm text-body-sm text-secondary">Botol Glass</div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="font-tabular-numeric text-tabular-numeric text-secondary font-semibold">2 Botol</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-label-sm text-label-sm bg-status-success-bg text-status-success font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-status-success"></span>
                        Aman
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-tabular-numeric text-tabular-numeric font-bold text-on-surface">Rp 840.000</span>
                      <span className="block font-body-sm text-body-sm text-secondary">@140rb/btl</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-body-sm text-body-sm text-on-surface">10 Feb 2025</div>
                      <div className="font-body-sm text-body-sm text-secondary">Oleh Dewi (Owner)</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button className="p-2 rounded-lg bg-surface-container hover:bg-primary-container hover:text-on-primary text-secondary transition-colors" onClick={() => setShowOpnameModal(true)} title="Input Opname Cepat" type="button">
                          <span className="material-symbols-outlined text-[18px]">edit_note</span>
                        </button>
                        <button className="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-secondary transition-colors" title="Kartu Mutasi Stok" type="button">
                          <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                        </button>
                        <button className="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-secondary transition-colors" title="Order Restock PO" type="button">
                          <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                  {/* Row 5: Butter Croissant Beku (Menipis) */}
                  <tr className="hover:bg-surface-canvas/60 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-status-warning">
                          <span className="material-symbols-outlined text-[24px]">bakery_dining</span>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-on-surface truncate">Butter Croissant Dough Beku</span>
                          <span className="font-body-sm text-body-sm text-secondary font-mono">SKU-PST-003 • 8994512998</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-secondary">Pastry &amp; Makanan</td>
                    <td className="py-4 px-4 text-right">
                      <div className="font-tabular-numeric text-tabular-numeric text-on-surface font-bold">8</div>
                      <div className="font-body-sm text-body-sm text-secondary">Pcs / Frozen</div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="font-tabular-numeric text-tabular-numeric text-secondary font-semibold">15 Pcs</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-label-sm text-label-sm bg-status-warning-bg text-status-warning font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-status-warning"></span>
                        Menipis
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-tabular-numeric text-tabular-numeric font-bold text-on-surface">Rp 120.000</span>
                      <span className="block font-body-sm text-body-sm text-secondary">@15rb/pcs</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-body-sm text-body-sm text-on-surface">09 Feb 2025</div>
                      <div className="font-body-sm text-body-sm text-secondary">Oleh Budi (Staff)</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button className="p-2 rounded-lg bg-surface-container hover:bg-primary-container hover:text-on-primary text-secondary transition-colors" onClick={() => setShowOpnameModal(true)} title="Input Opname Cepat" type="button">
                          <span className="material-symbols-outlined text-[18px]">edit_note</span>
                        </button>
                        <button className="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-secondary transition-colors" title="Kartu Mutasi Stok" type="button">
                          <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                        </button>
                        <button className="p-2 rounded-lg bg-status-warning-bg text-status-warning hover:bg-status-warning hover:text-on-primary transition-colors" title="Order Restock PO" type="button">
                          <span className="material-symbols-outlined text-[18px]">shopping_cart_checkout</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* Pagination / Footer Table */}
            <div className="p-4 bg-surface-card flex flex-col sm:flex-row items-center justify-between gap-4 font-body-sm text-body-sm text-secondary border-t border-border-subtle">
              <div>Menampilkan <strong className="text-on-surface">1 - 5</strong> dari <strong className="text-on-surface">128</strong> total bahan &amp; produk aktif</div>
              <div className="flex items-center gap-1.5">
                <button className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high disabled:opacity-50 text-on-surface font-label-md text-label-md transition-colors" disabled>Sebelumnya</button>
                <button className="px-3 py-1.5 rounded-lg bg-primary-container text-on-primary font-bold">1</button>
                <button className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface">2</button>
                <button className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface">3</button>
                <span className="px-1 text-secondary">...</span>
                <button className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface">26</button>
                <button className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors">Selanjutnya</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: SESI STOCK OPNAME */}
      {activeTab === 'tab-sesi' && (
        <div className="flex flex-col space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="bg-surface-card rounded-xl p-6 shadow-sm border border-border-subtle">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Riwayat &amp; Jadwal Sesi Opname Fisik</h3>
                <p className="font-body-md text-body-md text-secondary">Audit berkala untuk melacak deviasi stok, selisih bahan baku terbuang (waste), dan ketepatan kasir.</p>
              </div>
              <button className="px-4 py-2 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md font-bold" onClick={() => setShowOpnameModal(true)} type="button">
                + Buat Jadwal Opname Baru
              </button>
            </div>
            <div className="space-y-4">
              {/* Session item 1 */}
              <div className="p-4 rounded-xl bg-surface-canvas flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-status-info-bg text-status-info flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[28px]">fact_check</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-on-surface">Opname Tutup Toko Minggu Ke-2 Feb</span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-700">Sedang Berjalan</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-secondary mt-0.5">Dimulai: 11 Feb 2025, 21:30 WIB • Pelaksana: Budi Santoso, Dewi Astuti</p>
                    <div className="flex items-center gap-4 mt-2 font-tabular-numeric text-tabular-numeric text-body-sm">
                      <span>Total Item: <strong>128</strong></span>
                      <span>Terhitung: <strong className="text-primary-container">85</strong></span>
                      <span>Selisih Fisik: <strong className="text-status-warning">-2 pcs</strong></span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md" onClick={() => setShowOpnameModal(true)} type="button">Buka Sesi</button>
                </div>
              </div>
              {/* Session item 2 */}
              <div className="p-4 rounded-xl bg-surface-canvas flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-status-success-bg text-status-success flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-on-surface">Opname Bulanan Januari 2025</span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-status-success-bg text-status-success">Selesai &amp; Disesuaikan</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-secondary mt-0.5">Selesai: 31 Jan 2025, 23:45 WIB • Pelaksana: Dewi Astuti</p>
                    <div className="flex items-center gap-4 mt-2 font-tabular-numeric text-tabular-numeric text-body-sm">
                      <span>Item Audit: <strong>124 SKU</strong></span>
                      <span>Akurasi: <strong className="text-status-success">98.4%</strong></span>
                      <span>Nilai Selisih Terkoreksi: <strong className="text-status-danger">-Rp 82.500</strong></span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md">Lihat Laporan Penyesuaian</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: KARTU MUTASI STOK */}
      {activeTab === 'tab-mutasi' && (
        <div className="flex flex-col space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="bg-surface-card rounded-xl p-6 shadow-sm border border-border-subtle">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Kartu Mutasi Stok Real-Time</h3>
                <p className="font-body-md text-body-md text-secondary">Log kronologis otomatis dari setiap barang masuk, terjual via kasir, maupun penyesuaian opname.</p>
              </div>
              <div className="flex items-center gap-2">
                <input className="px-3 py-2 rounded-lg bg-surface-canvas font-body-sm text-body-sm text-on-surface border border-border-subtle" type="date" defaultValue="2025-02-11" />
                <button className="px-3 py-2 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md font-semibold">Filter Tanggal</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-canvas text-secondary font-label-sm text-label-sm uppercase tracking-wider">
                    <th className="py-3 px-4">Waktu</th>
                    <th className="py-3 px-4">Item &amp; SKU</th>
                    <th className="py-3 px-4">Tipe Mutasi</th>
                    <th className="py-3 px-4 text-right">Perubahan Qty</th>
                    <th className="py-3 px-4 text-right">Sisa Stok Akhir</th>
                    <th className="py-3 px-4">Referensi / Keterangan</th>
                    <th className="py-3 px-4">User</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle font-body-sm text-body-sm">
                  <tr className="hover:bg-surface-canvas/50">
                    <td className="py-3.5 px-4 text-secondary font-mono">11 Feb 2025, 14:15</td>
                    <td className="py-3.5 px-4 font-bold text-on-surface">Paper Cup 8oz Double Wall</td>
                    <td className="py-3.5 px-4"><span className="px-2 py-0.5 rounded-full text-xs font-bold bg-status-danger-bg text-status-danger">POS Sales</span></td>
                    <td className="py-3.5 px-4 text-right font-bold text-status-danger font-tabular-numeric">-2 Pcs</td>
                    <td className="py-3.5 px-4 text-right font-semibold text-on-surface font-tabular-numeric">48 Pcs</td>
                    <td className="py-3.5 px-4 text-secondary font-mono">TRX-20250211-0082</td>
                    <td className="py-3.5 px-4 text-on-surface">Kasir (Budi)</td>
                  </tr>
                  <tr className="hover:bg-surface-canvas/50">
                    <td className="py-3.5 px-4 text-secondary font-mono">11 Feb 2025, 11:30</td>
                    <td className="py-3.5 px-4 font-bold text-on-surface">House Blend Arabika Mandheling</td>
                    <td className="py-3.5 px-4"><span className="px-2 py-0.5 rounded-full text-xs font-bold bg-status-danger-bg text-status-danger">Resep Kasir</span></td>
                    <td className="py-3.5 px-4 text-right font-bold text-status-danger font-tabular-numeric">-0.04 Kg</td>
                    <td className="py-3.5 px-4 text-right font-semibold text-on-surface font-tabular-numeric">3.20 Kg</td>
                    <td className="py-3.5 px-4 text-secondary">Auto-deduct 2x Double Espresso</td>
                    <td className="py-3.5 px-4 text-on-surface">POS Terminal 1</td>
                  </tr>
                  <tr className="hover:bg-surface-canvas/50">
                    <td className="py-3.5 px-4 text-secondary font-mono">11 Feb 2025, 09:00</td>
                    <td className="py-3.5 px-4 font-bold text-on-surface">Fresh Milk Greenfields UHT 1L</td>
                    <td className="py-3.5 px-4"><span className="px-2 py-0.5 rounded-full text-xs font-bold bg-status-success-bg text-status-success">Pembelian PO</span></td>
                    <td className="py-3.5 px-4 text-right font-bold text-status-success font-tabular-numeric">+12.00 Liter</td>
                    <td className="py-3.5 px-4 text-right font-semibold text-on-surface font-tabular-numeric">14.00 Liter</td>
                    <td className="py-3.5 px-4 text-secondary font-mono">PO-IN-202502-044 (Supplier Susu)</td>
                    <td className="py-3.5 px-4 text-on-surface">Dewi Astuti</td>
                  </tr>
                  <tr className="hover:bg-surface-canvas/50">
                    <td className="py-3.5 px-4 text-secondary font-mono">10 Feb 2025, 21:00</td>
                    <td className="py-3.5 px-4 font-bold text-on-surface">Paper Cup 8oz Double Wall</td>
                    <td className="py-3.5 px-4"><span className="px-2 py-0.5 rounded-full text-xs font-bold bg-status-warning-bg text-status-warning">Opname Adjust</span></td>
                    <td className="py-3.5 px-4 text-right font-bold text-status-warning font-tabular-numeric">-2 Pcs</td>
                    <td className="py-3.5 px-4 text-right font-semibold text-on-surface font-tabular-numeric">50 Pcs</td>
                    <td className="py-3.5 px-4 text-secondary">Cup rusak terjatuh saat restock</td>
                    <td className="py-3.5 px-4 text-on-surface">Budi Santoso</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal Penyesuaian / Sesi Opname Cepat */}
      {showOpnameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface-card rounded-2xl shadow-2xl max-w-2xl w-full p-6 space-y-6 relative max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between pb-4 border-b border-border-subtle">
              <div>
                <span className="font-label-sm text-label-sm text-teal-accent font-bold uppercase tracking-wider">Stock Opname &amp; Rekonsiliasi</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mt-1">Input Hitung Fisik Barang</h3>
              </div>
              <button 
                className="p-1.5 rounded-full text-secondary hover:text-on-surface hover:bg-surface-container transition-colors" 
                onClick={() => setShowOpnameModal(false)} 
                type="button"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>
            {/* Item Profile in Modal */}
            <div className="p-4 rounded-xl bg-surface-canvas flex items-center gap-4">
              <img className="w-14 h-14 rounded-xl object-cover bg-surface-container" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4C3P8l5e91tdWzxrPrvigcNlgx2jvRQAL3hGO0bKhOghWUSFYk9uTGoGm8awQR2AzKdYQ7DCPYhCEGEc1UK34TOYpq6lPWLQzwJd_Vs1OiD-_2400pUDaIHpsW2MtDNF8Uz5W4d1haFxVL8JHoZfm8IXmTcb3Rq7GrPiFkW9zTA7YHDAxN6IMWGyherXvFmq4pXKUNovlSAMnzMlnlALLiOc0B0D4IiAsKR3LRLWwQng6yCBBliKd" alt="Paper Cup 8oz Double Wall Kraft" />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-on-surface truncate text-base">Paper Cup 8oz Double Wall Kraft</div>
                <div className="font-body-sm text-body-sm text-secondary font-mono">SKU-PKG-012 • Satuan: Pcs (Lembar)</div>
                <div className="flex items-center gap-4 mt-1 font-body-sm text-body-sm">
                  <span>Stok Sistem Saat Ini: <strong className="text-on-surface font-mono">48 Pcs</strong></span>
                  <span>Batas Min: <strong className="text-secondary font-mono">150 Pcs</strong></span>
                </div>
              </div>
            </div>
            {/* Input Form */}
            <div className="space-y-4">
              <div>
                <label className="block font-label-md text-label-md text-on-surface font-bold mb-1.5">Jumlah Fisik Dihitung Nyata (Real Count)</label>
                <div className="relative">
                  <input className="w-full text-xl font-bold font-mono px-4 py-3 rounded-xl bg-surface text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container border border-border-subtle" type="number" defaultValue="46" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary font-label-lg text-label-lg">Pcs</span>
                </div>
              </div>
              {/* Calculated Discrepancy Indicator */}
              <div className="p-3.5 rounded-xl bg-status-danger-bg text-status-danger flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">difference</span>
                  <span className="font-body-md text-body-md font-medium">Selisih Terdeteksi (Fisik - Sistem):</span>
                </div>
                <span className="font-headline-sm text-headline-sm font-mono font-bold">-2 Pcs</span>
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface font-bold mb-1.5">Alasan Penyesuaian / Selisih</label>
                <select className="w-full px-3.5 py-2.5 rounded-xl bg-surface-canvas text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container border border-border-subtle">
                  <option>Kerusakan / Rusak Saat Pembuatan (Waste/Spill)</option>
                  <option>Hilang / Tidak Tercatat di Kasir</option>
                  <option>Selisih Pengiriman Supplier</option>
                  <option>Koreksi Kesalahan Input Awal</option>
                  <option>Lainnya</option>
                </select>
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface font-bold mb-1.5">Catatan Tambahan (Opsional)</label>
                <textarea className="w-full px-3.5 py-2.5 rounded-xl bg-surface-canvas text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container placeholder:text-secondary/60 border border-border-subtle" placeholder="Contoh: 2 cup pecah saat disiapkan barista di bar shift pagi..." rows={2}></textarea>
              </div>
            </div>
            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-subtle">
              <button 
                className="px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-lg text-label-lg transition-colors" 
                onClick={() => setShowOpnameModal(false)} 
                type="button"
              >
                Batal
              </button>
              <button 
                className="px-5 py-2.5 rounded-xl bg-primary-container text-on-primary font-label-lg text-label-lg shadow-md hover:bg-teal-accent transition-all font-bold" 
                onClick={() => { alert('Penyesuaian stok berhasil disimpan!'); setShowOpnameModal(false); }} 
                type="button"
              >
                Simpan &amp; Perbarui Kartu Stok
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
