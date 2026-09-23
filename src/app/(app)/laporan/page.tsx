"use client";

export default function LaporanDanBukuKasPage() {
  return (
    <div className="flex flex-col w-full max-w-[1440px] mx-auto space-y-6 lg:p-2">
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5 bg-surface-container-lowest p-6 rounded-xl shadow-sm">
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-status-success-bg text-primary-container">
              <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
            </span>
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Laporan Finansial &amp; Buku Kas</h1>
          </div>
          <p className="font-body-md text-body-md text-secondary">
            Rekapitulasi arus kas (cashflow), laba rugi bersih, buku kas harian, dan monitoring hutang piutang Toko Berkah.
          </p>
        </div>
        {/* Actions & Period Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-surface-container-low px-3.5 py-2 rounded-xl text-on-surface">
            <span className="material-symbols-outlined text-[18px] text-primary-container">date_range</span>
            <span className="font-label-md text-label-md text-on-surface">1 - 19 Jan 2026</span>
            <span className="font-label-sm text-label-sm text-secondary px-1.5 py-0.5 rounded-full bg-surface-container-high">Bulan Ini</span>
            <span className="material-symbols-outlined text-[16px] text-secondary cursor-pointer">expand_more</span>
          </div>
          <button className="flex items-center gap-2 bg-surface-container-low hover:bg-surface-container text-on-surface px-4 py-2 rounded-xl font-label-md text-label-md transition-all" type="button">
            <span className="material-symbols-outlined text-[18px] text-secondary">picture_as_pdf</span>
            <span>Cetak PDF</span>
          </button>
          <button className="flex items-center gap-2 bg-surface-container-low hover:bg-surface-container text-on-surface px-4 py-2 rounded-xl font-label-md text-label-md transition-all" type="button">
            <span className="material-symbols-outlined text-[18px] text-secondary">table_view</span>
            <span>Export CSV</span>
          </button>
          <button className="flex items-center gap-2 bg-primary-container hover:bg-teal-accent text-on-primary px-4 py-2 rounded-xl font-label-md text-label-md shadow-sm transition-all transform active:scale-[0.99]" type="button">
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>+ Catat Beban Baru</span>
          </button>
        </div>
      </div>

      {/* Bento 4-Metric Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Revenue */}
        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm relative overflow-hidden flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-secondary uppercase tracking-wide">Pemasukan Bersih POS</span>
            <span className="w-8 h-8 rounded-lg bg-status-info-bg text-status-info flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">point_of_sale</span>
            </span>
          </div>
          <div>
            <div className="font-price-display text-price-display text-on-surface tracking-tight">Rp 48.250.000</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-status-success-bg text-status-success font-semibold">
                <span className="material-symbols-outlined text-[13px]">trending_up</span>
                +14.2%
              </span>
              <span className="font-body-sm text-body-sm text-secondary">vs bulan lalu (MoM)</span>
            </div>
          </div>
          <div className="pt-2 font-body-sm text-body-sm text-secondary flex items-center justify-between">
            <span>612 Transaksi Nota Kasir</span>
            <span className="font-semibold text-primary-container font-tabular-numeric text-tabular-numeric">Avg: Rp 78.840</span>
          </div>
        </div>
        {/* Expenses & COGS */}
        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm relative overflow-hidden flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-secondary uppercase tracking-wide">Pengeluaran &amp; HPP</span>
            <span className="w-8 h-8 rounded-lg bg-status-danger-bg text-status-danger flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">shopping_cart_checkout</span>
            </span>
          </div>
          <div>
            <div className="font-price-display text-price-display text-on-surface tracking-tight">Rp 29.800.000</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-status-warning-bg text-status-warning font-semibold">
                <span className="material-symbols-outlined text-[13px]">arrow_upward</span>
                +5.8%
              </span>
              <span className="font-body-sm text-body-sm text-secondary">terkendali aman</span>
            </div>
          </div>
          <div className="pt-2 font-body-sm text-body-sm text-secondary flex items-center justify-between">
            <span>HPP Bahan: Rp 21,4M</span>
            <span className="text-secondary font-tabular-numeric text-tabular-numeric">Beban: Rp 8,4M</span>
          </div>
        </div>
        {/* Net Profit (Hero Highlight Box) */}
        <div className="bg-gradient-to-br from-status-success-bg to-surface-container-lowest p-5 rounded-xl shadow-sm relative overflow-hidden flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-primary font-bold uppercase tracking-wide">Estimasi Laba Bersih</span>
            <span className="w-8 h-8 rounded-lg bg-primary-fixed text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">query_stats</span>
            </span>
          </div>
          <div>
            <div className="font-price-display text-price-display text-primary tracking-tight">Rp 18.450.000</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-primary-container text-on-primary font-semibold">
                Margin 38.2%
              </span>
              <span className="font-body-sm text-body-sm text-primary font-medium">Sangat Sehat (&gt;25%)</span>
            </div>
          </div>
          <div className="pt-2 font-body-sm text-body-sm text-secondary flex items-center justify-between">
            <span>Target Laba: Rp 22.000.000</span>
            <span className="font-bold text-primary font-tabular-numeric text-tabular-numeric">83.8% Capaian</span>
          </div>
        </div>
        {/* Real Cash & Bank Position */}
        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm relative overflow-hidden flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-secondary uppercase tracking-wide">Saldo Kas Riil (In Hand &amp; Bank)</span>
            <span className="w-8 h-8 rounded-lg bg-surface-container-high text-on-surface flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">payments</span>
            </span>
          </div>
          <div>
            <div className="font-price-display text-price-display text-on-surface tracking-tight">Rp 22.680.000</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-status-info-bg text-status-info font-semibold">
                Siap Pakai
              </span>
              <span className="font-body-sm text-body-sm text-secondary">Likuiditas Tinggi</span>
            </div>
          </div>
          <div className="pt-2 font-body-sm text-body-sm text-secondary flex items-center justify-between">
            <span>Kasir: Rp 6.450.000</span>
            <span className="font-semibold text-primary font-tabular-numeric text-tabular-numeric">BCA: Rp 16.230.000</span>
          </div>
        </div>
      </div>

      {/* Navigation Tab Bar */}
      <div className="bg-surface-container-lowest p-1.5 rounded-xl shadow-sm flex items-center gap-1 overflow-x-auto">
        <button className="px-5 py-2.5 rounded-lg font-label-md text-label-md bg-primary-container text-on-primary shadow-sm flex items-center gap-2 shrink-0" type="button">
          <span className="material-symbols-outlined text-[18px]">waterfall_chart</span>
          <span>Arus Kas (Cash Flow)</span>
        </button>
        <button className="px-5 py-2.5 rounded-lg font-label-md text-label-md text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors flex items-center gap-2 shrink-0" type="button">
          <span className="material-symbols-outlined text-[18px]">assessment</span>
          <span>Laba Rugi (P&amp;L)</span>
        </button>
        <button className="px-5 py-2.5 rounded-lg font-label-md text-label-md text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors flex items-center gap-2 shrink-0" type="button">
          <span className="material-symbols-outlined text-[18px]">menu_book</span>
          <span>Buku Kas Harian</span>
        </button>
        <button className="px-5 py-2.5 rounded-lg font-label-md text-label-md text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors flex items-center gap-2 shrink-0" type="button">
          <span className="material-symbols-outlined text-[18px]">credit_score</span>
          <span>Monitoring Piutang Pelanggan</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-status-danger-bg text-status-danger">3 Kasbon</span>
        </button>
        <button className="px-5 py-2.5 rounded-lg font-label-md text-label-md text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors flex items-center gap-2 shrink-0" type="button">
          <span className="material-symbols-outlined text-[18px]">percent</span>
          <span>Rekapitulasi Pajak &amp; Diskon</span>
        </button>
      </div>

      {/* Split Grid: Visualisasi Arus Kas & Expense Distribution */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column (8-col): Interactive Cash Flow Daily Trend Chart */}
        <div className="xl:col-span-8 bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col justify-between space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Tren Arus Kas Harian (1 - 19 Januari)</h2>
              <p className="font-body-sm text-body-sm text-secondary">Komparasi pemasukan penjualan kasir vs pengeluaran harian</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-primary-container"></span>
                <span className="text-on-surface">Pemasukan (+Rp)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-secondary-container"></span>
                <span className="text-secondary">Pengeluaran (-Rp)</span>
              </div>
            </div>
          </div>
          {/* High Day Callout Card */}
          <div className="bg-surface-container-low p-3.5 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-lg bg-status-success-bg text-status-success">
                <span className="material-symbols-outlined text-[18px]">stars</span>
              </span>
              <div>
                <span className="font-label-md text-label-md text-on-surface block">Puncak Arus Kas Tertinggi: Sabtu, 17 Januari 2026</span>
                <span className="font-body-sm text-body-sm text-secondary">Omzet Rekor: Rp 4.120.000 | Pengeluaran Operasional: Rp 820.000 (Surplus: +Rp 3.300.000)</span>
              </div>
            </div>
            <span className="hidden md:inline-flex font-label-sm text-label-sm bg-surface-container-lowest px-2.5 py-1 rounded-full text-primary font-bold shadow-sm">
              Weekend Peak
            </span>
          </div>
          {/* Responsive CSS Visual Bar Chart */}
          <div className="h-64 flex items-end justify-between gap-1.5 sm:gap-2.5 pt-6 px-2">
            {/* 1 Jan */}
            <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end group cursor-pointer">
              <div className="w-full flex items-end justify-center gap-1 h-full">
                <div className="w-1/2 bg-primary-container hover:bg-teal-accent rounded-t-sm transition-all" style={{ height: '48%' }} title="1 Jan: Masuk Rp 1.950.000"></div>
                <div className="w-1/2 bg-secondary-fixed hover:bg-secondary rounded-t-sm transition-all" style={{ height: '32%' }} title="1 Jan: Keluar Rp 1.100.000"></div>
              </div>
              <span className="font-label-sm text-[10px] text-secondary">01</span>
            </div>
            {/* 3 Jan */}
            <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end group cursor-pointer">
              <div className="w-full flex items-end justify-center gap-1 h-full">
                <div className="w-1/2 bg-primary-container hover:bg-teal-accent rounded-t-sm transition-all" style={{ height: '58%' }} title="3 Jan: Masuk Rp 2.340.000"></div>
                <div className="w-1/2 bg-secondary-fixed hover:bg-secondary rounded-t-sm transition-all" style={{ height: '25%' }} title="3 Jan: Keluar Rp 980.000"></div>
              </div>
              <span className="font-label-sm text-[10px] text-secondary">03</span>
            </div>
            {/* 5 Jan (Expense High) */}
            <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end group cursor-pointer">
              <div className="w-full flex items-end justify-center gap-1 h-full">
                <div className="w-1/2 bg-primary-container hover:bg-teal-accent rounded-t-sm transition-all" style={{ height: '52%' }} title="5 Jan: Masuk Rp 2.100.000"></div>
                <div className="w-1/2 bg-status-danger/60 hover:bg-status-danger rounded-t-sm transition-all" style={{ height: '75%' }} title="5 Jan: Kulakan Biji Kopi Rp 3.200.000"></div>
              </div>
              <span className="font-label-sm text-[10px] text-secondary font-bold text-status-danger">05*</span>
            </div>
            {/* 7 Jan */}
            <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end group cursor-pointer">
              <div className="w-full flex items-end justify-center gap-1 h-full">
                <div className="w-1/2 bg-primary-container hover:bg-teal-accent rounded-t-sm transition-all" style={{ height: '60%' }} title="7 Jan: Masuk Rp 2.450.000"></div>
                <div className="w-1/2 bg-secondary-fixed hover:bg-secondary rounded-t-sm transition-all" style={{ height: '28%' }} title="7 Jan: Keluar Rp 1.150.000"></div>
              </div>
              <span className="font-label-sm text-[10px] text-secondary">07</span>
            </div>
            {/* 9 Jan */}
            <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end group cursor-pointer">
              <div className="w-full flex items-end justify-center gap-1 h-full">
                <div className="w-1/2 bg-primary-container hover:bg-teal-accent rounded-t-sm transition-all" style={{ height: '68%' }} title="9 Jan: Masuk Rp 2.780.000"></div>
                <div className="w-1/2 bg-secondary-fixed hover:bg-secondary rounded-t-sm transition-all" style={{ height: '35%' }} title="9 Jan: Keluar Rp 1.400.000"></div>
              </div>
              <span className="font-label-sm text-[10px] text-secondary">09</span>
            </div>
            {/* 11 Jan */}
            <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end group cursor-pointer">
              <div className="w-full flex items-end justify-center gap-1 h-full">
                <div className="w-1/2 bg-primary-container hover:bg-teal-accent rounded-t-sm transition-all" style={{ height: '64%' }} title="11 Jan: Masuk Rp 2.600.000"></div>
                <div className="w-1/2 bg-secondary-fixed hover:bg-secondary rounded-t-sm transition-all" style={{ height: '24%' }} title="11 Jan: Keluar Rp 920.000"></div>
              </div>
              <span className="font-label-sm text-[10px] text-secondary">11</span>
            </div>
            {/* 13 Jan */}
            <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end group cursor-pointer">
              <div className="w-full flex items-end justify-center gap-1 h-full">
                <div className="w-1/2 bg-primary-container hover:bg-teal-accent rounded-t-sm transition-all" style={{ height: '72%' }} title="13 Jan: Masuk Rp 2.920.000"></div>
                <div className="w-1/2 bg-secondary-fixed hover:bg-secondary rounded-t-sm transition-all" style={{ height: '30%' }} title="13 Jan: Keluar Rp 1.250.000"></div>
              </div>
              <span className="font-label-sm text-[10px] text-secondary">13</span>
            </div>
            {/* 15 Jan */}
            <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end group cursor-pointer">
              <div className="w-full flex items-end justify-center gap-1 h-full">
                <div className="w-1/2 bg-primary-container hover:bg-teal-accent rounded-t-sm transition-all" style={{ height: '80%' }} title="15 Jan: Masuk Rp 3.250.000"></div>
                <div className="w-1/2 bg-secondary-fixed hover:bg-secondary rounded-t-sm transition-all" style={{ height: '42%' }} title="15 Jan: Keluar Rp 1.700.000"></div>
              </div>
              <span className="font-label-sm text-[10px] text-secondary">15</span>
            </div>
            {/* 17 Jan (Peak Day Highlight) */}
            <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end group cursor-pointer relative">
              <span className="absolute -top-7 px-1.5 py-0.5 rounded bg-on-surface text-on-primary text-[9px] font-bold font-tabular-numeric opacity-90">Max 4.1M</span>
              <div className="w-full flex items-end justify-center gap-1 h-full">
                <div className="w-1/2 bg-teal-accent rounded-t-sm shadow-md" style={{ height: '96%' }} title="17 Jan (Peak): Masuk Rp 4.120.000"></div>
                <div className="w-1/2 bg-secondary-fixed rounded-t-sm" style={{ height: '22%' }} title="17 Jan: Keluar Rp 820.000"></div>
              </div>
              <span className="font-label-sm text-[10px] text-primary-container font-extrabold">17</span>
            </div>
            {/* 18 Jan */}
            <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end group cursor-pointer">
              <div className="w-full flex items-end justify-center gap-1 h-full">
                <div className="w-1/2 bg-primary-container hover:bg-teal-accent rounded-t-sm transition-all" style={{ height: '85%' }} title="18 Jan: Masuk Rp 3.500.000"></div>
                <div className="w-1/2 bg-secondary-fixed hover:bg-secondary rounded-t-sm transition-all" style={{ height: '25%' }} title="18 Jan: Keluar Rp 1.050.000"></div>
              </div>
              <span className="font-label-sm text-[10px] text-secondary">18</span>
            </div>
            {/* 19 Jan (Hari Ini) */}
            <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end group cursor-pointer">
              <div className="w-full flex items-end justify-center gap-1 h-full">
                <div className="w-1/2 bg-primary-container hover:bg-teal-accent rounded-t-sm transition-all" style={{ height: '70%' }} title="19 Jan: Masuk Rp 2.890.000"></div>
                <div className="w-1/2 bg-secondary-fixed hover:bg-secondary rounded-t-sm transition-all" style={{ height: '38%' }} title="19 Jan: Keluar Rp 1.580.000"></div>
              </div>
              <span className="font-label-sm text-[10px] text-teal-accent font-bold">Hari Ini</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-secondary pt-3 bg-surface-container-low/50 px-4 py-2 rounded-lg">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
              Sinkronisasi Otomatis Mesin POS &amp; Buku Bank
            </span>
            <span className="font-tabular-numeric font-semibold">Total Mutasi Masuk: +Rp 48.250.000 | Keluar: -Rp 29.800.000</span>
          </div>
        </div>

        {/* Right Column (4-col): Operational Expense Breakdown */}
        <div className="xl:col-span-4 bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Distribusi Beban</h2>
              <span className="font-label-sm text-label-sm px-2.5 py-0.5 rounded-full bg-surface-container-high text-secondary">Total: 29.8 Jt</span>
            </div>
            <p className="font-body-sm text-body-sm text-secondary mt-1">Alokasi biaya modal bahan &amp; overhead toko</p>
          </div>
          {/* Expense Categories with Visual Progress Bars */}
          <div className="space-y-4">
            {/* Category 1 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-on-surface flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary-container"></span>
                  Bahan Baku &amp; Kulakan Biji Kopi
                </span>
                <span className="font-tabular-numeric text-tabular-numeric font-bold text-on-surface">62% <span className="font-normal text-secondary">(18.47M)</span></span>
              </div>
              <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                <div className="bg-primary-container h-full rounded-full" style={{ width: '62%' }}></div>
              </div>
            </div>
            {/* Category 2 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-on-surface flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-accent"></span>
                  Gaji &amp; Insentif Tim Kasir
                </span>
                <span className="font-tabular-numeric text-tabular-numeric font-bold text-on-surface">22% <span className="font-normal text-secondary">(6.55M)</span></span>
              </div>
              <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                <div className="bg-teal-accent h-full rounded-full" style={{ width: '22%' }}></div>
              </div>
            </div>
            {/* Category 3 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-on-surface flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-status-warning"></span>
                  Operasional, Listrik &amp; Sewa
                </span>
                <span className="font-tabular-numeric text-tabular-numeric font-bold text-on-surface">11% <span className="font-normal text-secondary">(3.27M)</span></span>
              </div>
              <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                <div className="bg-status-warning h-full rounded-full" style={{ width: '11%' }}></div>
              </div>
            </div>
            {/* Category 4 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-on-surface flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                  Promosi, MDR QRIS &amp; Software POS
                </span>
                <span className="font-tabular-numeric text-tabular-numeric font-bold text-on-surface">5% <span className="font-normal text-secondary">(1.49M)</span></span>
              </div>
              <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                <div className="bg-secondary h-full rounded-full" style={{ width: '5%' }}></div>
              </div>
            </div>
          </div>
          {/* Financial Tip / Ratio Box */}
          <div className="bg-surface-container-low p-4 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold font-label-md text-label-md">
              <span className="material-symbols-outlined text-[18px]">tips_and_updates</span>
              <span>Analisis Efisiensi Biaya</span>
            </div>
            <p className="font-body-sm text-body-sm text-secondary leading-relaxed">
              Biaya operasional stabil pada angka <strong className="text-on-surface">38%</strong> dari total pemasukan. Rekomendasi: Pertahankan restock biji kopi curah dari supplier utama untuk menjaga diskon kuantiti 8%.
            </p>
          </div>
        </div>
      </div>

      {/* Buku Kas Mutasi Terakhir (Cash Flow Ledger Table) */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Table Toolbar / Fast Filters */}
        <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-surface-container-low text-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">receipt_long</span>
            </span>
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Buku Kas Mutasi Terakhir</h2>
              <p className="font-body-sm text-body-sm text-secondary">Daftar jurnal mutasi transaksi kasir harian dan pengeluaran beban</p>
            </div>
          </div>
          {/* Quick Filter Pills */}
          <div className="flex items-center gap-2 bg-surface-container-low p-1 rounded-xl">
            <button className="px-3.5 py-1.5 rounded-lg font-label-sm text-label-sm bg-surface-container-lowest text-on-surface font-bold shadow-sm" type="button">
              Semua Mutasi (34)
            </button>
            <button className="px-3.5 py-1.5 rounded-lg font-label-sm text-label-sm text-secondary hover:text-on-surface transition-colors" type="button">
              Hanya Masuk (+Rp)
            </button>
            <button className="px-3.5 py-1.5 rounded-lg font-label-sm text-label-sm text-secondary hover:text-on-surface transition-colors" type="button">
              Hanya Keluar (-Rp)
            </button>
          </div>
        </div>
        
        {/* Responsive Ledger Table Container */}
        <div className="overflow-x-auto pb-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-secondary/40 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-secondary/60 transition-colors">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container-low text-secondary uppercase font-label-sm text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-5">Waktu &amp; Tanggal</th>
                <th className="py-3 px-5">Kategori &amp; Keterangan Transaksi</th>
                <th className="py-3 px-5">No. Referensi</th>
                <th className="py-3 px-5">Akun Kas</th>
                <th className="py-3 px-5 text-right">Uang Masuk (+Rp)</th>
                <th className="py-3 px-5 text-right">Uang Keluar (-Rp)</th>
                <th className="py-3 px-5 text-right">Saldo Berjalan</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low font-body-md text-body-md">
              {/* Row 1: Sale POS */}
              <tr className="hover:bg-surface-container-low/50 transition-colors">
                <td className="py-3.5 px-5 whitespace-nowrap">
                  <span className="font-semibold text-on-surface block">Hari ini, 15:42</span>
                  <span className="font-body-sm text-body-sm text-secondary">19 Jan 2026</span>
                </td>
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-status-success-bg text-status-success flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[14px]">add</span>
                    </span>
                    <div>
                      <span className="font-semibold text-on-surface block">Penjualan Kasir POS #Shift Siang</span>
                      <span className="font-body-sm text-body-sm text-secondary">24 Cup Kopi Susu Aren + 8 Toast</span>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-5 whitespace-nowrap">
                  <span className="font-mono text-xs bg-surface-container-low px-2 py-0.5 rounded text-secondary font-semibold">TRX-20260119-094</span>
                </td>
                <td className="py-3.5 px-5 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-status-info-bg text-status-info">
                    <span className="material-symbols-outlined text-[13px]">payments</span>
                    Kas Kasir
                  </span>
                </td>
                <td className="py-3.5 px-5 text-right whitespace-nowrap font-tabular-numeric text-tabular-numeric font-bold text-status-success">
                  +Rp 680.000
                </td>
                <td className="py-3.5 px-5 text-right whitespace-nowrap font-tabular-numeric text-tabular-numeric text-secondary">
                  -
                </td>
                <td className="py-3.5 px-5 text-right whitespace-nowrap font-tabular-numeric text-tabular-numeric font-bold text-on-surface">
                  Rp 22.680.000
                </td>
                <td className="py-3.5 px-4 text-center">
                  <button className="p-1 hover:bg-surface-container text-secondary hover:text-on-surface rounded-lg transition-colors" title="Lihat Detail Nota" type="button">
                    <span className="material-symbols-outlined text-[18px]">receipt</span>
                  </button>
                </td>
              </tr>
              {/* Row 2: Expense Listrik */}
              <tr className="hover:bg-surface-container-low/50 transition-colors">
                <td className="py-3.5 px-5 whitespace-nowrap">
                  <span className="font-semibold text-on-surface block">Hari ini, 11:20</span>
                  <span className="font-body-sm text-body-sm text-secondary">19 Jan 2026</span>
                </td>
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-status-danger-bg text-status-danger flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[14px]">remove</span>
                    </span>
                    <div>
                      <span className="font-semibold text-on-surface block">Pembayaran Token Listrik PLN Toko</span>
                      <span className="font-body-sm text-body-sm text-secondary">Beban Operasional IDPEL: 53820194821</span>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-5 whitespace-nowrap">
                  <span className="font-mono text-xs bg-surface-container-low px-2 py-0.5 rounded text-secondary font-semibold">EXP-20260119-012</span>
                </td>
                <td className="py-3.5 px-5 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-status-success-bg text-primary">
                    <span className="material-symbols-outlined text-[13px]">account_balance</span>
                    Bank BCA
                  </span>
                </td>
                <td className="py-3.5 px-5 text-right whitespace-nowrap font-tabular-numeric text-tabular-numeric text-secondary">
                  -
                </td>
                <td className="py-3.5 px-5 text-right whitespace-nowrap font-tabular-numeric text-tabular-numeric font-bold text-status-danger">
                  -Rp 500.000
                </td>
                <td className="py-3.5 px-5 text-right whitespace-nowrap font-tabular-numeric text-tabular-numeric font-bold text-on-surface">
                  Rp 22.000.000
                </td>
                <td className="py-3.5 px-4 text-center">
                  <button className="p-1 hover:bg-surface-container text-secondary hover:text-on-surface rounded-lg transition-colors" title="Lihat Bukti Pengeluaran" type="button">
                    <span className="material-symbols-outlined text-[18px]">receipt</span>
                  </button>
                </td>
              </tr>
              {/* Row 3: Pelunasan Kasbon / Piutang */}
              <tr className="hover:bg-surface-container-low/50 transition-colors">
                <td className="py-3.5 px-5 whitespace-nowrap">
                  <span className="font-semibold text-on-surface block">Kemarin, 19:15</span>
                  <span className="font-body-sm text-body-sm text-secondary">18 Jan 2026</span>
                </td>
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-status-info-bg text-status-info flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[14px]">handshake</span>
                    </span>
                    <div>
                      <span className="font-semibold text-on-surface block">Pelunasan Kasbon: Warung Bu Sri</span>
                      <span className="font-body-sm text-body-sm text-secondary">Pelunasan invoice catering roti 14 Jan</span>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-5 whitespace-nowrap">
                  <span className="font-mono text-xs bg-surface-container-low px-2 py-0.5 rounded text-secondary font-semibold">RCV-20260118-005</span>
                </td>
                <td className="py-3.5 px-5 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-status-info-bg text-status-info">
                    <span className="material-symbols-outlined text-[13px]">payments</span>
                    Kas Kasir
                  </span>
                </td>
                <td className="py-3.5 px-5 text-right whitespace-nowrap font-tabular-numeric text-tabular-numeric font-bold text-status-success">
                  +Rp 350.000
                </td>
                <td className="py-3.5 px-5 text-right whitespace-nowrap font-tabular-numeric text-tabular-numeric text-secondary">
                  -
                </td>
                <td className="py-3.5 px-5 text-right whitespace-nowrap font-tabular-numeric text-tabular-numeric font-bold text-on-surface">
                  Rp 22.500.000
                </td>
                <td className="py-3.5 px-4 text-center">
                  <button className="p-1 hover:bg-surface-container text-secondary hover:text-on-surface rounded-lg transition-colors" title="Lihat Kwitansi" type="button">
                    <span className="material-symbols-outlined text-[18px]">receipt</span>
                  </button>
                </td>
              </tr>
              {/* Row 4: Pembelian Bahan Baku Biji Kopi */}
              <tr className="hover:bg-surface-container-low/50 transition-colors">
                <td className="py-3.5 px-5 whitespace-nowrap">
                  <span className="font-semibold text-on-surface block">Kemarin, 14:00</span>
                  <span className="font-body-sm text-body-sm text-secondary">18 Jan 2026</span>
                </td>
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-status-danger-bg text-status-danger flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[14px]">remove</span>
                    </span>
                    <div>
                      <span className="font-semibold text-on-surface block">Restock Biji Kopi Arabika Temanggung (10kg)</span>
                      <span className="font-body-sm text-body-sm text-secondary">Supplier: PT Roastery Nusantara Mandiri</span>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-5 whitespace-nowrap">
                  <span className="font-mono text-xs bg-surface-container-low px-2 py-0.5 rounded text-secondary font-semibold">PO-20260118-028</span>
                </td>
                <td className="py-3.5 px-5 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-status-success-bg text-primary">
                    <span className="material-symbols-outlined text-[13px]">account_balance</span>
                    Bank BCA
                  </span>
                </td>
                <td className="py-3.5 px-5 text-right whitespace-nowrap font-tabular-numeric text-tabular-numeric text-secondary">
                  -
                </td>
                <td className="py-3.5 px-5 text-right whitespace-nowrap font-tabular-numeric text-tabular-numeric font-bold text-status-danger">
                  -Rp 1.450.000
                </td>
                <td className="py-3.5 px-5 text-right whitespace-nowrap font-tabular-numeric text-tabular-numeric font-bold text-on-surface">
                  Rp 22.150.000
                </td>
                <td className="py-3.5 px-4 text-center">
                  <button className="p-1 hover:bg-surface-container text-secondary hover:text-on-surface rounded-lg transition-colors" title="Lihat Faktur Pembelian" type="button">
                    <span className="material-symbols-outlined text-[18px]">receipt</span>
                  </button>
                </td>
              </tr>
              {/* Row 5: Penjualan QRIS Grosir / Event */}
              <tr className="hover:bg-surface-container-low/50 transition-colors">
                <td className="py-3.5 px-5 whitespace-nowrap">
                  <span className="font-semibold text-on-surface block">17 Jan 2026, 18:30</span>
                  <span className="font-body-sm text-body-sm text-secondary">Sabtu Rekor</span>
                </td>
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-status-success-bg text-status-success flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[14px]">add</span>
                    </span>
                    <div>
                      <span className="font-semibold text-on-surface block">Pesanan Paket Coffee Break Kantor BPKD</span>
                      <span className="font-body-sm text-body-sm text-secondary">Pembayaran QRIS Statis Kasir</span>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-5 whitespace-nowrap">
                  <span className="font-mono text-xs bg-surface-container-low px-2 py-0.5 rounded text-secondary font-semibold">TRX-20260117-182</span>
                </td>
                <td className="py-3.5 px-5 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-status-success-bg text-primary">
                    <span className="material-symbols-outlined text-[13px]">qr_code_2</span>
                    Bank BCA (QRIS)
                  </span>
                </td>
                <td className="py-3.5 px-5 text-right whitespace-nowrap font-tabular-numeric text-tabular-numeric font-bold text-status-success">
                  +Rp 2.200.000
                </td>
                <td className="py-3.5 px-5 text-right whitespace-nowrap font-tabular-numeric text-tabular-numeric text-secondary">
                  -
                </td>
                <td className="py-3.5 px-5 text-right whitespace-nowrap font-tabular-numeric text-tabular-numeric font-bold text-on-surface">
                  Rp 23.600.000
                </td>
                <td className="py-3.5 px-4 text-center">
                  <button className="p-1 hover:bg-surface-container text-secondary hover:text-on-surface rounded-lg transition-colors" title="Lihat Detail Transaksi" type="button">
                    <span className="material-symbols-outlined text-[18px]">receipt</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* Table Footer & Ledger Pagination */}
        <div className="p-4 bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-body-sm text-body-sm text-secondary">
          <div className="flex items-center gap-2">
            <span>Menampilkan <strong>1 - 5</strong> dari <strong>34</strong> mutasi kas</span>
          </div>
          <div className="flex items-center gap-1 self-end sm:self-auto">
            <button className="p-1.5 rounded-lg bg-surface-container-lowest text-secondary hover:text-on-surface hover:bg-surface-container disabled:opacity-40" disabled={true} type="button">
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button className="px-3 py-1 rounded-lg bg-primary-container text-on-primary font-bold font-tabular-numeric text-tabular-numeric" type="button">1</button>
            <button className="px-3 py-1 rounded-lg bg-surface-container-lowest text-secondary hover:text-on-surface hover:bg-surface-container font-tabular-numeric text-tabular-numeric" type="button">2</button>
            <button className="px-3 py-1 rounded-lg bg-surface-container-lowest text-secondary hover:text-on-surface hover:bg-surface-container font-tabular-numeric text-tabular-numeric" type="button">3</button>
            <button className="p-1.5 rounded-lg bg-surface-container-lowest text-secondary hover:text-on-surface hover:bg-surface-container" type="button">
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Fast-Action Card: Tutup Kasir & Rekonsiliasi Bank */}
      <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-status-warning-bg text-status-warning flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[26px]">fact_check</span>
          </div>
          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Rekonsiliasi &amp; Tutup Buku Shift Sore</h3>
            <p className="font-body-sm text-body-sm text-secondary">Pastikan fisik uang tunai di laci kasir cocok dengan nominal tercatat Rp 6.450.000 sebelum serah terima kasir.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button className="px-4 py-2.5 rounded-xl font-label-md text-label-md bg-surface-container-low hover:bg-surface-container text-on-surface transition-all" type="button">
            Hitung Uang Laci (Cash Count)
          </button>
          <button className="px-5 py-2.5 rounded-xl font-label-md text-label-md bg-primary-container hover:bg-teal-accent text-on-primary font-bold shadow-sm transition-all transform active:scale-[0.99]" type="button">
            Tutup Shift &amp; Cetak Bukti Kasir
          </button>
        </div>
      </div>
    </div>
  );
}
