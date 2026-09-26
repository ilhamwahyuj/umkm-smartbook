"use client";

import { useState, useRef, useEffect } from "react";

export default function BiayaOperasionalPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Scrollbar sync state
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  // Table drag-to-scroll state
  const [isTableDragging, setIsTableDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startScrollLeft, setStartScrollLeft] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !tableContainerRef.current || !trackRef.current) return;
      
      const rect = trackRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      
      const { scrollWidth, clientWidth } = tableContainerRef.current;
      const maxScroll = scrollWidth - clientWidth;
      // Scroll without smooth behavior for responsive dragging
      tableContainerRef.current.scrollTo({ left: maxScroll * percentage });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleTableScroll = () => {
    if (tableContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tableContainerRef.current;
      const maxScroll = scrollWidth - clientWidth;
      setScrollProgress(maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0);
    }
  };

  const scrollTableLeft = () => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollTableRight = () => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (tableContainerRef.current && trackRef.current) {
      const rect = trackRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      const { scrollWidth, clientWidth } = tableContainerRef.current;
      const maxScroll = scrollWidth - clientWidth;
      tableContainerRef.current.scrollTo({ left: maxScroll * percentage, behavior: 'smooth' });
    }
  };

  // Handlers for table drag-to-scroll
  const handleTableMouseDown = (e: React.MouseEvent) => {
    if (!tableContainerRef.current) return;
    setIsTableDragging(true);
    setStartX(e.pageX - tableContainerRef.current.offsetLeft);
    setStartScrollLeft(tableContainerRef.current.scrollLeft);
  };

  const handleTableMouseLeave = () => {
    setIsTableDragging(false);
  };

  const handleTableMouseUp = () => {
    setIsTableDragging(false);
  };

  const handleTableMouseMove = (e: React.MouseEvent) => {
    if (!isTableDragging || !tableContainerRef.current) return;
    e.preventDefault(); // Prevent text selection
    const x = e.pageX - tableContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Scroll speed multiplier
    tableContainerRef.current.scrollLeft = startScrollLeft - walk;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Pengeluaran berhasil dicatat ke dalam buku kas operasional & siap diverifikasi.');
    setIsModalOpen(false);
  };

  const categories = [
    { id: 'all', label: 'Semua (28)' },
    { id: 'utilitas', label: 'Utilitas & Internet (6)' },
    { id: 'gaji', label: 'Gaji Staf (4)' },
    { id: 'packaging', label: 'Packaging & Cup (8)' },
    { id: 'servis', label: 'Perbaikan & Servis (3)' },
    { id: 'pemasaran', label: 'Pemasaran (7)' }
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Page Header & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-[11px] font-semibold tracking-[0.04em] uppercase tracking-wider">Modul Buku Kas #07</span>
            <span className="text-secondary font-label-sm text-[11px] font-semibold tracking-[0.04em]">• Periode Berjalan</span>
          </div>
          <h1 className="font-headline-lg text-[30px] font-bold leading-[38px] tracking-[-0.02em] text-on-surface tracking-tight">Biaya & Beban Operasional</h1>
          <p className="font-body-md text-[14px] leading-[20px] text-secondary mt-1 max-w-2xl">
            Pembukuan real-time kas keluar toko, belanja bahan habis pakai, gaji staf, utilitas listrik/air, serta monitoring limit anggaran kasir.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button type="button" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-card text-on-surface font-label-lg text-[14px] font-semibold tracking-[0.01em] shadow-sm hover:bg-surface-container-low transition-all">
            <span className="material-symbols-outlined text-[18px] text-secondary">assignment_returned</span>
            <span>Laporan Arus Kas Keluar</span>
          </button>
          <button 
            type="button" 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-container text-on-primary font-label-lg text-[14px] font-semibold tracking-[0.01em] shadow-md hover:bg-teal-accent transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            <span>+ Catat Pengeluaran Baru</span>
          </button>
        </div>
      </div>

      {/* Bento 4-Column Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Card 1: Total Biaya */}
        <div className="bg-surface-card rounded-2xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-primary-container"></div>
          <div className="flex items-start justify-between mb-3">
            <span className="font-label-md text-[12px] font-semibold tracking-[0.02em] text-secondary uppercase tracking-wider">Total Biaya Operasional</span>
            <div className="p-2 rounded-xl bg-status-success-bg text-status-success">
              <span className="material-symbols-outlined text-[20px]">payments</span>
            </div>
          </div>
          <div>
            <div className="font-price-display text-[32px] font-extrabold leading-[40px] tracking-[-0.03em] text-on-surface tracking-tight">Rp 18.750.000</div>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-status-success-bg text-status-success font-label-sm text-[11px] font-semibold tracking-[0.04em]">
                <span className="material-symbols-outlined text-[14px]">trending_down</span>
                -4.2%
              </span>
              <span className="font-body-sm text-[12px] leading-[16px] text-secondary">Efisien vs pagu bulanan</span>
            </div>
          </div>
        </div>

        {/* Card 2: Pengeluaran Terbesar */}
        <div className="bg-surface-card rounded-2xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-teal-accent"></div>
          <div className="flex items-start justify-between mb-3">
            <span className="font-label-md text-[12px] font-semibold tracking-[0.02em] text-secondary uppercase tracking-wider">Beban Terbesar (Gaji)</span>
            <div className="p-2 rounded-xl bg-surface-container text-primary-container">
              <span className="material-symbols-outlined text-[20px]">badge</span>
            </div>
          </div>
          <div>
            <div className="font-price-display text-[32px] font-extrabold leading-[40px] tracking-[-0.03em] text-on-surface tracking-tight">Rp 9.500.000</div>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-[11px] font-semibold tracking-[0.04em]">
                50.7% Alokasi
              </span>
              <span className="font-body-sm text-[12px] leading-[16px] text-secondary">3 Barista + 1 Kasir</span>
            </div>
          </div>
        </div>

        {/* Card 3: Utilitas & Sewa */}
        <div className="bg-surface-card rounded-2xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-status-info"></div>
          <div className="flex items-start justify-between mb-3">
            <span className="font-label-md text-[12px] font-semibold tracking-[0.02em] text-secondary uppercase tracking-wider">Utilitas, Sewa & Wi-Fi</span>
            <div className="p-2 rounded-xl bg-status-info-bg text-status-info">
              <span className="material-symbols-outlined text-[20px]">bolt</span>
            </div>
          </div>
          <div>
            <div className="font-price-display text-[32px] font-extrabold leading-[40px] tracking-[-0.03em] text-on-surface tracking-tight">Rp 4.250.000</div>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-status-info-bg text-status-info font-label-sm text-[11px] font-semibold tracking-[0.04em]">
                22.6% Porsi
              </span>
              <span className="font-body-sm text-[12px] leading-[16px] text-secondary">PLN, Biznet, PDAM</span>
            </div>
          </div>
        </div>

        {/* Card 4: Operasional & Petty Cash */}
        <div className="bg-surface-card rounded-2xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-status-warning"></div>
          <div className="flex items-start justify-between mb-3">
            <span className="font-label-md text-[12px] font-semibold tracking-[0.02em] text-secondary uppercase tracking-wider">Habis Pakai & Harian</span>
            <div className="p-2 rounded-xl bg-status-warning-bg text-status-warning">
              <span className="material-symbols-outlined text-[20px]">inventory_2</span>
            </div>
          </div>
          <div>
            <div className="font-price-display text-[32px] font-extrabold leading-[40px] tracking-[-0.03em] text-on-surface tracking-tight">Rp 5.000.000</div>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-status-warning-bg text-status-warning font-label-sm text-[11px] font-semibold tracking-[0.04em]">
                26.7% Terpakai
              </span>
              <span className="font-body-sm text-[12px] leading-[16px] text-secondary">Cup, gas LPG, es batu</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Row: Donut Chart Breakdown & Weekly Burn Rate */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Sisi Kiri: Breakdown Kategori Beban */}
        <div className="lg:col-span-5 bg-surface-card rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-headline-sm text-[18px] font-semibold leading-[24px] text-on-surface">Distribusi Kategori Beban</h2>
              <p className="font-body-sm text-[12px] leading-[16px] text-secondary">Realisasi pengeluaran per klasifikasi COGS & OPEX</p>
            </div>
            <span className="p-2 rounded-full bg-surface-container-low text-secondary">
              <span className="material-symbols-outlined text-[20px]">pie_chart</span>
            </span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-6 my-2">
            {/* Minimal SVG Donut Chart */}
            <div className="relative w-40 h-40 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" fill="none" r="38" stroke="#E2E8F0" strokeWidth="12"></circle>
                <circle cx="50" cy="50" fill="none" r="38" stroke="#0F766E" strokeDasharray="121 238.7" strokeDashoffset="0" strokeWidth="12"></circle>
                <circle cx="50" cy="50" fill="none" r="38" stroke="#0D9488" strokeDasharray="63.7 238.7" strokeDashoffset="-121" strokeWidth="12"></circle>
                <circle cx="50" cy="50" fill="none" r="38" stroke="#2563EB" strokeDasharray="54 238.7" strokeDashoffset="-184.7" strokeWidth="12"></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-body-sm text-[12px] leading-[16px] text-secondary">Total Pagu</span>
                <span className="font-headline-sm text-[18px] font-semibold leading-[24px] font-bold text-on-surface">18.7M</span>
              </div>
            </div>
            {/* Legend Items */}
            <div className="flex-1 w-full space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-3 h-3 rounded-md bg-primary-container shrink-0"></span>
                  <span className="font-label-md text-[12px] font-semibold tracking-[0.02em] text-on-surface truncate">Gaji Karyawan & Insentif</span>
                </div>
                <span className="font-tabular-numeric text-[14px] font-semibold leading-[20px] text-on-surface font-bold">50.7%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-3 h-3 rounded-md bg-teal-accent shrink-0"></span>
                  <span className="font-label-md text-[12px] font-semibold tracking-[0.02em] text-on-surface truncate">Bahan Pelengkap & Cup</span>
                </div>
                <span className="font-tabular-numeric text-[14px] font-semibold leading-[20px] text-on-surface font-bold">26.7%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-3 h-3 rounded-md bg-status-info shrink-0"></span>
                  <span className="font-label-md text-[12px] font-semibold tracking-[0.02em] text-on-surface truncate">Utilitas & Wi-Fi Toko</span>
                </div>
                <span className="font-tabular-numeric text-[14px] font-semibold leading-[20px] text-on-surface font-bold">18.2%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-3 h-3 rounded-md bg-status-warning shrink-0"></span>
                  <span className="font-label-md text-[12px] font-semibold tracking-[0.02em] text-on-surface truncate">Servis Mesin Espresso</span>
                </div>
                <span className="font-tabular-numeric text-[14px] font-semibold leading-[20px] text-on-surface font-bold">4.4%</span>
              </div>
            </div>
          </div>
          <div className="pt-3 mt-2 rounded-xl bg-surface-container-low p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-status-success">verified</span>
              <span className="font-body-sm text-[12px] leading-[16px] text-on-surface">Plafon anggaran bulanan: <b>Rp 22.000.000</b></span>
            </div>
            <span className="font-label-sm text-[11px] font-semibold tracking-[0.04em] text-status-success font-bold">Tersisa 14.7%</span>
          </div>
        </div>

        {/* Sisi Kanan: Tren Pengeluaran Mingguan & Pagu Budget */}
        <div className="lg:col-span-7 bg-surface-card rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="font-headline-sm text-[18px] font-semibold leading-[24px] text-on-surface">Tren Beban Mingguan (Burn-Rate)</h2>
              <p className="font-body-sm text-[12px] leading-[16px] text-secondary">Komparasi alokasi maksimal vs penarikan kas mingguan</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 font-label-sm text-[11px] font-semibold tracking-[0.04em] text-secondary">
                <span className="w-2.5 h-2.5 rounded-full bg-primary-container"></span> Realisasi
              </span>
              <span className="inline-flex items-center gap-1 font-label-sm text-[11px] font-semibold tracking-[0.04em] text-secondary ml-2">
                <span className="w-2.5 h-2.5 rounded-full bg-border-default"></span> Target Limit
              </span>
            </div>
          </div>

          <div className="space-y-4 my-2">
            {/* Week 1 */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-label-md text-[12px] font-semibold tracking-[0.02em] text-on-surface font-bold">Minggu 1 (01 - 07 Jan)</span>
                <div className="flex items-center gap-3">
                  <span className="text-secondary font-tabular-numeric text-[14px] font-semibold leading-[20px]">Rp 3.850.000 / Rp 5.500.000</span>
                  <span className="px-2 py-0.5 rounded-full bg-status-success-bg text-status-success font-label-sm text-[11px] font-semibold tracking-[0.04em] font-bold">Aman</span>
                </div>
              </div>
              <div className="w-full bg-surface-container rounded-full h-3 relative overflow-hidden">
                <div className="bg-primary-container h-full rounded-full transition-all duration-500" style={{ width: '70%' }}></div>
              </div>
            </div>

            {/* Week 2 */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-label-md text-[12px] font-semibold tracking-[0.02em] text-on-surface font-bold">Minggu 2 (08 - 14 Jan)</span>
                <div className="flex items-center gap-3">
                  <span className="text-secondary font-tabular-numeric text-[14px] font-semibold leading-[20px]">Rp 4.200.000 / Rp 5.500.000</span>
                  <span className="px-2 py-0.5 rounded-full bg-status-success-bg text-status-success font-label-sm text-[11px] font-semibold tracking-[0.04em] font-bold">Aman</span>
                </div>
              </div>
              <div className="w-full bg-surface-container rounded-full h-3 relative overflow-hidden">
                <div className="bg-primary-container h-full rounded-full transition-all duration-500" style={{ width: '76.3%' }}></div>
              </div>
            </div>

            {/* Week 3 */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-label-md text-[12px] font-semibold tracking-[0.02em] text-on-surface font-bold">Minggu 3 (15 - 21 Jan)</span>
                <div className="flex items-center gap-3">
                  <span className="text-secondary font-tabular-numeric text-[14px] font-semibold leading-[20px]">Rp 4.900.000 / Rp 5.500.000</span>
                  <span className="px-2 py-0.5 rounded-full bg-status-warning-bg text-status-warning font-label-sm text-[11px] font-semibold tracking-[0.04em] font-bold">Mendekati Pagu</span>
                </div>
              </div>
              <div className="w-full bg-surface-container rounded-full h-3 relative overflow-hidden">
                <div className="bg-teal-accent h-full rounded-full transition-all duration-500" style={{ width: '89%' }}></div>
              </div>
            </div>

            {/* Week 4 */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-label-md text-[12px] font-semibold tracking-[0.02em] text-on-surface font-bold">Minggu 4 (22 - 31 Jan - Estimasi)</span>
                <div className="flex items-center gap-3">
                  <span className="text-secondary font-tabular-numeric text-[14px] font-semibold leading-[20px]">Rp 5.800.000 / Rp 5.500.000</span>
                  <span className="px-2 py-0.5 rounded-full bg-status-danger-bg text-status-danger font-label-sm text-[11px] font-semibold tracking-[0.04em] font-bold">Payroll Month-end</span>
                </div>
              </div>
              <div className="w-full bg-surface-container rounded-full h-3 relative overflow-hidden">
                <div className="bg-status-warning h-full rounded-full transition-all duration-500" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-secondary pt-2">
            <span className="flex items-center gap-1 font-body-sm text-[12px] leading-[16px]">
              <span className="material-symbols-outlined text-[16px] text-primary-container">info</span>
              Batas toleransi deviasi anggaran maksimal 10% per minggu
            </span>
            <a className="text-primary font-label-sm text-[11px] font-semibold tracking-[0.04em] hover:underline" href="#">Kelola Plafon Anggaran →</a>
          </div>
        </div>
      </div>

      {/* Main Content Split: Transactions Table (8 cols) & Petty Cash Drawer (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Primary Section: Table & Filter Controls (Col 8/12) */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          {/* Search & Filters Header Bar */}
          <div className="bg-surface-card rounded-2xl p-4 shadow-sm space-y-4">
            {/* Category Tab Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
              {categories.map((cat) => (
                <button 
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  type="button"
                  className={`px-3.5 py-1.5 rounded-full font-label-md text-[12px] font-semibold tracking-[0.02em] whitespace-nowrap transition-colors ${
                    selectedCategory === cat.id 
                      ? 'bg-primary-container text-on-primary font-bold shadow-sm'
                      : 'bg-surface-container-low text-secondary hover:text-on-surface hover:bg-surface-container'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search input and Date Filter */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[18px]">search</span>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-surface-canvas text-on-surface placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary-container shadow-inner" 
                  placeholder="Cari transaksi, keperluan kas, nama vendor / staf..." 
                />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                <div className="flex items-center gap-2 px-3 py-2 bg-surface-canvas rounded-xl text-xs text-on-surface shadow-inner w-full sm:w-auto">
                  <span className="material-symbols-outlined text-secondary text-[18px]">calendar_today</span>
                  <span className="font-tabular-numeric text-[14px] font-semibold leading-[20px]">01 Jan 2026 - 31 Jan 2026</span>
                </div>
                <button className="p-2 rounded-xl bg-surface-canvas text-secondary hover:text-on-surface shadow-inner" title="Filter Lanjutan" type="button">
                  <span className="material-symbols-outlined text-[18px]">tune</span>
                </button>
              </div>
            </div>
          </div>

          {/* Transactions Table Card */}
          <div className="bg-surface-card rounded-2xl shadow-sm overflow-hidden">
            <div 
              ref={tableContainerRef}
              onScroll={handleTableScroll}
              onMouseDown={handleTableMouseDown}
              onMouseLeave={handleTableMouseLeave}
              onMouseUp={handleTableMouseUp}
              onMouseMove={handleTableMouseMove}
              className={`overflow-x-auto scrollbar-none ${isTableDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
            >
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="bg-surface-canvas text-secondary font-label-sm text-[11px] font-semibold tracking-[0.04em] uppercase tracking-wider">
                    <th className="py-3 px-4">Tanggal & Waktu</th>
                    <th className="py-3 px-4">Kategori & Keterangan</th>
                    <th className="py-3 px-4">Vendor / Penerima</th>
                    <th className="py-3 px-4">Metode Bayar</th>
                    <th className="py-3 px-4">Struk</th>
                    <th className="py-3 px-4 text-right">Jumlah Biaya</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle/40 font-body-sm text-[12px] leading-[16px]">
                  {/* Item 1: Token Listrik */}
                  <tr className={`hover:bg-surface-container-lowest/80 transition-colors ${selectedCategory !== 'all' && selectedCategory !== 'utilitas' ? 'hidden' : ''}`}>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-on-surface font-tabular-numeric text-[14px] font-semibold leading-[20px]">28 Jan 2026</div>
                      <div className="text-secondary font-label-sm text-[11px] font-semibold tracking-[0.04em]">09:14 WIB</div>
                    </td>
                    <td className="py-3.5 px-4 min-w-[200px]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-status-info-bg text-status-info flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[18px]">bolt</span>
                        </div>
                        <div>
                          <div className="font-bold text-on-surface">Token Listrik PLN 6600VA</div>
                          <span className="text-secondary font-label-sm text-[11px] font-semibold tracking-[0.04em]">Utilitas & Daya Operasional</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-medium text-on-surface">PT PLN (Persero)</td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 text-xs text-on-surface">
                        <span className="w-2 h-2 rounded-full bg-status-info"></span> Kas Bank BCA
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <button onClick={() => alert('Membuka Lampiran: Bukti Pembelian Token PLN No. Trx #PLN-884291')} type="button" className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-low text-primary text-xs hover:bg-surface-container transition-colors">
                        <span className="material-symbols-outlined text-[14px]">receipt_long</span>
                        <span>Struk PLN</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-right font-bold text-on-surface font-tabular-numeric text-[14px] font-semibold leading-[20px]">Rp 1.500.000</td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-status-success-bg text-status-success font-label-sm text-[11px] font-semibold tracking-[0.04em]">Disetujui Owner</span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-1 rounded-lg text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors" title="Cetak / Unduh Nota" type="button"><span className="material-symbols-outlined text-[18px]">download</span></button>
                        <button className="p-1 rounded-lg text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors" title="Edit Beban" type="button"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                      </div>
                    </td>
                  </tr>

                  {/* Item 2: Packaging Cup Sealer */}
                  <tr className={`hover:bg-surface-container-lowest/80 transition-colors ${selectedCategory !== 'all' && selectedCategory !== 'packaging' ? 'hidden' : ''}`}>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-on-surface font-tabular-numeric text-[14px] font-semibold leading-[20px]">27 Jan 2026</div>
                      <div className="text-secondary font-label-sm text-[11px] font-semibold tracking-[0.04em]">14:30 WIB</div>
                    </td>
                    <td className="py-3.5 px-4 min-w-[200px]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-status-warning-bg text-status-warning flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[18px]">coffee</span>
                        </div>
                        <div>
                          <div className="font-bold text-on-surface">Cup Sealer 16oz & Sedotan Bambu</div>
                          <span className="text-secondary font-label-sm text-[11px] font-semibold tracking-[0.04em]">Kemasan Ramah Lingkungan 2.000 Pcs</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-medium text-on-surface">CV Packindo Makmur</td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 text-xs text-on-surface">
                        <span className="w-2 h-2 rounded-full bg-status-info"></span> Transfer Mandiri
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <button onClick={() => alert('Membuka Lampiran: Faktur Pajak #INV-PACK-092')} type="button" className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-low text-primary text-xs hover:bg-surface-container transition-colors">
                        <span className="material-symbols-outlined text-[14px]">receipt_long</span>
                        <span>Invoice CV</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-right font-bold text-on-surface font-tabular-numeric text-[14px] font-semibold leading-[20px]">Rp 2.450.000</td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-status-success-bg text-status-success font-label-sm text-[11px] font-semibold tracking-[0.04em]">Disetujui Owner</span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-1 rounded-lg text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors" title="Cetak / Unduh Nota" type="button"><span className="material-symbols-outlined text-[18px]">download</span></button>
                        <button className="p-1 rounded-lg text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors" title="Edit Beban" type="button"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                      </div>
                    </td>
                  </tr>

                  {/* Item 3: Servis Grinder Mahlkonig */}
                  <tr className={`hover:bg-surface-container-lowest/80 transition-colors ${selectedCategory !== 'all' && selectedCategory !== 'servis' ? 'hidden' : ''}`}>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-on-surface font-tabular-numeric text-[14px] font-semibold leading-[20px]">25 Jan 2026</div>
                      <div className="text-secondary font-label-sm text-[11px] font-semibold tracking-[0.04em]">11:00 WIB</div>
                    </td>
                    <td className="py-3.5 px-4 min-w-[200px]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-surface-container-high text-primary-container flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[18px]">handyman</span>
                        </div>
                        <div>
                          <div className="font-bold text-on-surface">Kalibrasi & Burrs Mahlkonig EK43</div>
                          <span className="text-secondary font-label-sm text-[11px] font-semibold tracking-[0.04em]">Perawatan Rutin Bar Mesin Espresso</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-medium text-on-surface">Teknisi Kopi Espresso Pro</td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 text-xs text-on-surface">
                        <span className="w-2 h-2 rounded-full bg-status-warning"></span> Petty Cash Kasir
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <button onClick={() => alert('Membuka Lampiran: Nota Bengkel & Sparepart')} type="button" className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-low text-primary text-xs hover:bg-surface-container transition-colors">
                        <span className="material-symbols-outlined text-[14px]">receipt_long</span>
                        <span>Kwitansi Jasa</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-right font-bold text-on-surface font-tabular-numeric text-[14px] font-semibold leading-[20px]">Rp 850.000</td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-status-info-bg text-status-info font-label-sm text-[11px] font-semibold tracking-[0.04em]">Menunggu Verifikasi</span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-1 rounded-lg text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors" title="Cetak / Unduh Nota" type="button"><span className="material-symbols-outlined text-[18px]">download</span></button>
                        <button className="p-1 rounded-lg text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors" title="Edit Beban" type="button"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                      </div>
                    </td>
                  </tr>

                  {/* Item 4: Gaji Staf Barista Shift */}
                  <tr className={`hover:bg-surface-container-lowest/80 transition-colors ${selectedCategory !== 'all' && selectedCategory !== 'gaji' ? 'hidden' : ''}`}>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-on-surface font-tabular-numeric text-[14px] font-semibold leading-[20px]">25 Jan 2026</div>
                      <div className="text-secondary font-label-sm text-[11px] font-semibold tracking-[0.04em]">18:00 WIB</div>
                    </td>
                    <td className="py-3.5 px-4 min-w-[200px]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[18px]">groups</span>
                        </div>
                        <div>
                          <div className="font-bold text-on-surface">Gaji Shift Barista & Kasir (Mingguan)</div>
                          <span className="text-secondary font-label-sm text-[11px] font-semibold tracking-[0.04em]">Insentif Weekend Rush (2 Staf)</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-medium text-on-surface">Rian & Siti (Part-time)</td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 text-xs text-on-surface">
                        <span className="w-2 h-2 rounded-full bg-status-info"></span> Kas Bank BCA
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <button onClick={() => alert('Membuka Lampiran: Slip Gaji Digital & Timesheet POS')} type="button" className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-low text-primary text-xs hover:bg-surface-container transition-colors">
                        <span className="material-symbols-outlined text-[14px]">receipt_long</span>
                        <span>Slip Gaji</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-right font-bold text-on-surface font-tabular-numeric text-[14px] font-semibold leading-[20px]">Rp 2.100.000</td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-status-success-bg text-status-success font-label-sm text-[11px] font-semibold tracking-[0.04em]">Disetujui Owner</span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-1 rounded-lg text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors" title="Cetak / Unduh Nota" type="button"><span className="material-symbols-outlined text-[18px]">download</span></button>
                        <button className="p-1 rounded-lg text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors" title="Edit Beban" type="button"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                      </div>
                    </td>
                  </tr>

                  {/* Item 5: Internet Biznet Dedicated */}
                  <tr className={`hover:bg-surface-container-lowest/80 transition-colors ${selectedCategory !== 'all' && selectedCategory !== 'utilitas' ? 'hidden' : ''}`}>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-on-surface font-tabular-numeric text-[14px] font-semibold leading-[20px]">20 Jan 2026</div>
                      <div className="text-secondary font-label-sm text-[11px] font-semibold tracking-[0.04em]">10:15 WIB</div>
                    </td>
                    <td className="py-3.5 px-4 min-w-[200px]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-status-info-bg text-status-info flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[18px]">wifi</span>
                        </div>
                        <div>
                          <div className="font-bold text-on-surface">Langganan Biznet Fiber POS & Guest Wi-Fi</div>
                          <span className="text-secondary font-label-sm text-[11px] font-semibold tracking-[0.04em]">Paket 150 Mbps Dedicated</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-medium text-on-surface">Biznet Networks</td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 text-xs text-on-surface">
                        <span className="w-2 h-2 rounded-full bg-status-info"></span> Auto-Debit BCA
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <button onClick={() => alert('Membuka Lampiran: E-Billing Biznet #BIZ-99018')} type="button" className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-low text-primary text-xs hover:bg-surface-container transition-colors">
                        <span className="material-symbols-outlined text-[14px]">receipt_long</span>
                        <span>Billing E-Mail</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-right font-bold text-on-surface font-tabular-numeric text-[14px] font-semibold leading-[20px]">Rp 650.000</td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-status-success-bg text-status-success font-label-sm text-[11px] font-semibold tracking-[0.04em]">Disetujui Owner</span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-1 rounded-lg text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors" title="Cetak / Unduh Nota" type="button"><span className="material-symbols-outlined text-[18px]">download</span></button>
                        <button className="p-1 rounded-lg text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors" title="Edit Beban" type="button"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Custom Horizontal Scrollbar */}
            <div className="px-4 py-2 bg-surface-canvas border-b border-surface-container flex items-center gap-2">
              <span onClick={scrollTableLeft} className="material-symbols-outlined text-[16px] text-slate-400 hover:text-slate-600 cursor-pointer select-none rotate-180">play_arrow</span>
              <div 
                ref={trackRef}
                onClick={handleTrackClick} 
                className="flex-1 h-2.5 bg-[#94A3B8]/30 rounded-full relative cursor-pointer"
              >
                <div 
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setIsDragging(true);
                  }}
                  className={`absolute top-0 h-full w-[40%] bg-[#8DA0B3] hover:bg-slate-500 rounded-full transition-colors ${isDragging ? 'bg-slate-500' : ''}`}
                  style={{ left: `${scrollProgress * 0.6}%` }}
                ></div>
              </div>
              <span onClick={scrollTableRight} className="material-symbols-outlined text-[16px] text-slate-400 hover:text-slate-600 cursor-pointer select-none">play_arrow</span>
            </div>

            {/* Table Footer Pagination */}
            <div className="p-4 bg-surface-canvas flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="font-body-sm text-[12px] leading-[16px] text-secondary">
                Menampilkan <span className="font-bold text-on-surface font-tabular-numeric text-[14px] font-semibold leading-[20px]">5</span> dari <span className="font-bold text-on-surface font-tabular-numeric text-[14px] font-semibold leading-[20px]">28</span> transaksi beban tercatat
              </span>
              <div className="flex items-center gap-1.5">
                <button className="px-3 py-1.5 rounded-lg bg-surface-card text-secondary font-label-sm text-[11px] font-semibold tracking-[0.04em] hover:bg-surface-container-low disabled:opacity-50" disabled>Sebelumnya</button>
                <button className="px-3 py-1.5 rounded-lg bg-primary-container text-on-primary font-label-sm text-[11px] font-semibold tracking-[0.04em] font-bold">1</button>
                <button className="px-3 py-1.5 rounded-lg bg-surface-card text-secondary font-label-sm text-[11px] font-semibold tracking-[0.04em] hover:bg-surface-container-low">2</button>
                <button className="px-3 py-1.5 rounded-lg bg-surface-card text-secondary font-label-sm text-[11px] font-semibold tracking-[0.04em] hover:bg-surface-container-low">3</button>
                <button className="px-3 py-1.5 rounded-lg bg-surface-card text-secondary font-label-sm text-[11px] font-semibold tracking-[0.04em] hover:bg-surface-container-low">Selanjutnya</button>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Side Panel: Petty Cash Drawer & Fast Actions (Col 4/12) */}
        <div className="lg:col-span-4 flex flex-col space-y-6">
          {/* Petty Cash Drawer POS Card */}
          <div className="bg-surface-card rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-status-success-bg text-status-success flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">point_of_sale</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-[18px] font-semibold leading-[24px] text-on-surface leading-tight">Kas Kecil Meja Kasir</h3>
                  <span className="text-secondary font-label-sm text-[11px] font-semibold tracking-[0.04em]">Petty Cash Drawer • POS 01</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-status-success-bg text-status-success font-label-sm text-[11px] font-semibold tracking-[0.04em] font-bold">Sinkron</span>
            </div>

            {/* Petty Cash Big Figure */}
            <div className="p-4 rounded-2xl bg-surface-container-low mb-4">
              <div className="font-label-md text-[12px] font-semibold tracking-[0.02em] text-secondary uppercase tracking-wider mb-1">Saldo Kas Fisik Saat Ini</div>
              <div className="flex items-baseline justify-between">
                <span className="font-price-display text-[32px] font-extrabold leading-[40px] tracking-[-0.03em] text-primary-container font-extrabold font-tabular-numeric text-[14px] font-semibold leading-[20px]">Rp 750.000</span>
                <span className="font-body-sm text-[12px] leading-[16px] text-secondary font-medium">Batas: Rp 1.000.000</span>
              </div>
              <div className="w-full bg-surface-dim rounded-full h-2 mt-3 overflow-hidden">
                <div className="bg-teal-accent h-full rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>

            {/* Petty Cash Quick Action Items */}
            <div className="space-y-2 mb-5">
              <div className="text-secondary font-label-sm text-[11px] font-semibold tracking-[0.04em] uppercase tracking-wider mb-1">Penggunaan Hari Ini (Darurat / Misc)</div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-canvas">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[18px]">ac_unit</span>
                  <div>
                    <div className="font-label-md text-[12px] font-semibold tracking-[0.02em] text-on-surface font-semibold">Beli Es Batu Tube (3 Karung)</div>
                    <div className="font-body-sm text-[12px] leading-[16px] text-secondary">Depo Es Makmur • 11:20 WIB</div>
                  </div>
                </div>
                <span className="font-tabular-numeric text-[14px] font-semibold leading-[20px] font-bold text-status-danger">- Rp 45.000</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-canvas">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[18px]">local_drink</span>
                  <div>
                    <div className="font-label-md text-[12px] font-semibold tracking-[0.02em] text-on-surface font-semibold">Isi Ulang 2 Galon Cleo</div>
                    <div className="font-body-sm text-[12px] leading-[16px] text-secondary">Toko Anda Air • 15:05 WIB</div>
                  </div>
                </div>
                <span className="font-tabular-numeric text-[14px] font-semibold leading-[20px] font-bold text-status-danger">- Rp 38.000</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => alert('Form Isi Ulang Kas Kecil (Top-Up Kasir) akan dimuat.')} type="button" className="flex-1 py-2.5 px-3 rounded-xl bg-primary-container text-on-primary font-label-md text-[12px] font-semibold tracking-[0.02em] font-bold hover:bg-teal-accent transition-all flex items-center justify-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">add_card</span>
                <span>Top-up Kas</span>
              </button>
              <button onClick={() => alert('Mengunci dan Menghitung Rekonsiliasi Cash Drawer Meja Kasir')} type="button" className="py-2.5 px-3 rounded-xl bg-surface-container text-on-surface font-label-md text-[12px] font-semibold tracking-[0.02em] font-semibold hover:bg-surface-container-high transition-all flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-[18px]">lock_clock</span>
                <span>Opname Kasir</span>
              </button>
            </div>
          </div>

          {/* Quick Vendor Card with Photo */}
          <div className="bg-surface-card rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-headline-sm text-[18px] font-semibold leading-[24px] text-on-surface">Pemasok Bahan Rutin</h4>
              <a className="font-label-sm text-[11px] font-semibold tracking-[0.04em] text-primary hover:underline font-bold" href="#">Kelola Vendor</a>
            </div>
            <p className="font-body-sm text-[12px] leading-[16px] text-secondary mb-4">
              Kontak cepat vendor kebutuhan non-coffee dan jasa perawatan mesin espresso terverifikasi.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-canvas hover:bg-surface-container-low transition-colors">
                <img className="w-11 h-11 rounded-xl object-cover shrink-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWPFrQvgCx1X7i26Mndyyq_3bPIf1rm2kJBcxBeKJ1KTymBUqGd_inPawe0iSxIH4V6baLUkJxuvSjOFOQq2g-PqY1k8UGfhHCq_CSAs39ExMWevM5e_8gevUdwbfMz118ZxPabOlrPHTP_CaXaLuJnyOMX8o_FYRa9rqU7gp_szQ4KaGIxLCQabw1Ucwy0UxQunzpSRozku_AKK4rb89nZ7iE810vRVBc5RTuhTuQ_VCDHTZawrtb" alt="Susu" />
                <div className="flex-1 min-w-0">
                  <div className="font-label-md text-[12px] font-semibold tracking-[0.02em] font-bold text-on-surface truncate">Susu Pasteurisasi Segar</div>
                  <div className="font-body-sm text-[12px] leading-[16px] text-secondary">PT Sumber Susu Lembang</div>
                </div>
                <button className="p-1.5 rounded-lg text-primary hover:bg-surface-container transition-colors" title="Hubungi Vendor">
                  <span className="material-symbols-outlined text-[18px]">call</span>
                </button>
              </div>
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-canvas hover:bg-surface-container-low transition-colors">
                <img className="w-11 h-11 rounded-xl object-cover shrink-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVO99uad04Kjx5osnOlQTJJSC9OZ6dp-3YZJJ-vBHCiLJjtj-JmLO1rBijQYS20NOipijPPUk27ud04Ly9tq5wjvnuRSzX4UqN__ECqN80jNgHJavZ-Xpvc_gy8zfuU-koE7jOdQXNAaVeOizWqiZLyD_-ti9CJ474yBJoNWrjIGzuZohv_C4tjUGlq6x5uopZb1WoB8BG07DpPxQ9TSS2t_KdYhqlZt5UApI9tnISBNyGRqwl6dyI" alt="Teknisi" />
                <div className="flex-1 min-w-0">
                  <div className="font-label-md text-[12px] font-semibold tracking-[0.02em] font-bold text-on-surface truncate">Teknisi Servis Mesin Kopi</div>
                  <div className="font-body-sm text-[12px] leading-[16px] text-secondary">Espresso Pro Technical Care</div>
                </div>
                <button className="p-1.5 rounded-lg text-primary hover:bg-surface-container transition-colors" title="Hubungi Vendor">
                  <span className="material-symbols-outlined text-[18px]">call</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Guidance & Policy Card */}
          <div className="bg-gradient-to-br from-primary to-primary-container rounded-2xl p-5 text-on-primary shadow-md relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-[20px] text-teal-200">policy</span>
              <span className="font-label-md text-[12px] font-semibold tracking-[0.02em] font-bold uppercase tracking-wider text-teal-100">SOP Nota & Kas Keluar</span>
            </div>
            <p className="font-body-sm text-[12px] leading-[16px] text-teal-50/90 leading-relaxed mb-3">
              Semua pengeluaran kasir di atas <b>Rp 100.000</b> wajib difoto struk fisiknya dan membutuhkan persetujuan Owner melalui dashboard ini sebelum tutup buku shift harian.
            </p>
            <span className="inline-flex items-center gap-1 font-label-sm text-[11px] font-semibold tracking-[0.04em] font-semibold text-teal-200">
              <span className="material-symbols-outlined text-[15px]">check_circle</span> Terkunci Kebijakan POS v2.4
            </span>
          </div>
        </div>
      </div>

      {/* Modal: + Catat Pengeluaran Baru */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-card rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-primary-fixed text-on-primary-fixed-variant">
                  <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-[18px] font-semibold leading-[24px] text-on-surface">Catat Pengeluaran Baru</h3>
                  <p className="font-body-sm text-[12px] leading-[16px] text-secondary">Simpan transaksi kas keluar & unggah struk pembelian</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <form id="form-expense" className="space-y-4" onSubmit={handleFormSubmit}>
              {/* Kategori & Nominal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-md text-[12px] font-semibold tracking-[0.02em] text-on-surface mb-1.5 font-bold">Kategori Beban</label>
                  <select className="w-full h-10 px-3 rounded-xl bg-surface-canvas text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container">
                    <option value="operasional">Bahan Habis Pakai / Harian</option>
                    <option value="utilitas">Utilitas, Listrik & Air</option>
                    <option value="gaji">Gaji & Insentif Karyawan</option>
                    <option value="servis">Pemeliharaan & Servis Mesin</option>
                    <option value="pemasaran">Pemasaran & Iklan</option>
                    <option value="lainnya">Lain-lain (Kasbon / Misc)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-label-md text-[12px] font-semibold tracking-[0.02em] text-on-surface mb-1.5 font-bold">Nominal Beban (Rp)</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 font-label-md text-[12px] font-semibold tracking-[0.02em] text-secondary font-bold">Rp</span>
                    <input type="number" required className="w-full h-10 pl-10 pr-3 rounded-xl bg-surface-canvas text-xs font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container" placeholder="50.000" />
                  </div>
                </div>
              </div>
              
              {/* Keterangan */}
              <div>
                <label className="block font-label-md text-[12px] font-semibold tracking-[0.02em] text-on-surface mb-1.5 font-bold">Keterangan / Keperluan</label>
                <input type="text" required className="w-full h-10 px-3 rounded-xl bg-surface-canvas text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container" placeholder="Contoh: Pembelian gas LPG 3kg & sabun cuci bar" />
              </div>
              
              {/* Vendor & Sumber Dana */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-md text-[12px] font-semibold tracking-[0.02em] text-on-surface mb-1.5 font-bold">Penerima / Toko Vendor</label>
                  <input type="text" className="w-full h-10 px-3 rounded-xl bg-surface-canvas text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container" placeholder="Nama toko / staf penerima" />
                </div>
                <div>
                  <label className="block font-label-md text-[12px] font-semibold tracking-[0.02em] text-on-surface mb-1.5 font-bold">Sumber Kas Keluar</label>
                  <select className="w-full h-10 px-3 rounded-xl bg-surface-canvas text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container">
                    <option value="kas_kecil">Kas Kecil Drawer Kasir (Petty Cash)</option>
                    <option value="bca">Kas Bank Utama (BCA 028-xxxx)</option>
                    <option value="mandiri">Kas Bank Operasional (Mandiri)</option>
                  </select>
                </div>
              </div>

              {/* Upload Struk */}
              <div>
                <label className="block font-label-md text-[12px] font-semibold tracking-[0.02em] text-on-surface mb-1.5 font-bold">Lampiran Bukti / Struk Fisik</label>
                <div className="border-2 border-dashed border-border-default hover:border-primary-container rounded-xl p-4 text-center cursor-pointer transition-colors bg-surface-canvas">
                  <span className="material-symbols-outlined text-[28px] text-secondary">cloud_upload</span>
                  <div className="font-label-md text-[12px] font-semibold tracking-[0.02em] font-semibold text-on-surface mt-1">Seret struk ke sini atau klik untuk ambil foto</div>
                  <div className="font-body-sm text-[12px] leading-[16px] text-secondary mt-0.5">Mendukung JPG, PNG, PDF (Maks. 5 MB)</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-surface-container-low text-secondary font-label-md text-[12px] font-semibold tracking-[0.02em] hover:bg-surface-container transition-colors"
                >
                  Batalkan
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 rounded-xl bg-primary-container text-on-primary font-label-md text-[12px] font-semibold tracking-[0.02em] font-bold hover:bg-teal-accent transition-all shadow-md"
                >
                  Simpan Pengeluaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
