"use client";

import React from "react";

export default function KasirPOSPage() {
  return (
    <div className="flex flex-col w-full">
      {/* SUB-BAR KASIR (Quick Action & Terminal Status Bar) */}
      <div className="w-full bg-surface-container-lowest rounded-2xl shadow-sm p-4 mb-5 flex flex-wrap items-center justify-between gap-4">
        {/* Kasir Profile & Active Session */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px] font-semibold" style={{ fontVariationSettings: "'FILL' 1" }}>point_of_sale</span>
            </div>
            <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-status-success"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[18px] font-semibold text-on-surface leading-tight">Kasir 1 • Budi Santoso</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-status-success-bg text-status-success">Online (Shift Pagi)</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-secondary mt-0.5">
              <span className="text-sm font-semibold tabular-nums text-primary">TRX-20260119-0042</span>
              <span>•</span>
              <span>Outlet Utama - Kopi Berkah Nusantara</span>
            </div>
          </div>
        </div>

        {/* Quick Function Keys Toolbar */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Member Select Button */}
          <button className="flex items-center gap-1.5 px-3 py-2 bg-surface-container-low hover:bg-surface-container rounded-xl text-xs font-semibold text-on-surface transition-all shadow-sm" type="button">
            <span className="material-symbols-outlined text-sm text-primary">person</span>
            <span>Pelanggan: <strong className="text-primary font-semibold">Walk-in</strong></span>
            <span className="material-symbols-outlined text-[11px] text-secondary">arrow_drop_down</span>
          </button>

          {/* Hold Orders Button */}
          <button className="flex items-center gap-1.5 px-3 py-2 bg-status-warning-bg hover:bg-status-warning-bg/80 text-status-warning rounded-xl text-xs font-bold transition-all shadow-sm" type="button">
            <span className="material-symbols-outlined text-sm">pause_circle</span>
            <span>Tahan Draft</span>
            <span className="px-1.5 py-0.5 bg-status-warning text-white rounded-full text-[11px]">2</span>
          </button>

          {/* Barcode Quick Mode */}
          <button className="flex items-center gap-1.5 px-3 py-2 bg-surface-container-low hover:bg-surface-container text-on-surface rounded-xl text-xs font-semibold transition-all shadow-sm" type="button">
            <span className="material-symbols-outlined text-sm text-primary">barcode_scanner</span>
            <span>Scan (F2)</span>
          </button>

          {/* Open Cash Drawer Button */}
          <button className="flex items-center gap-1.5 px-3 py-2 bg-surface-container-low hover:bg-surface-container text-on-surface rounded-xl text-xs font-semibold transition-all shadow-sm" title="Buka laci uang kasir" type="button">
            <span className="material-symbols-outlined text-sm text-secondary">inventory</span>
            <span>Buka Laci</span>
          </button>
        </div>
      </div>

      {/* MAIN POS LAYOUT GRID: 65% Catalog + 35% Checkout Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT & CENTER: PRODUCT CATALOG (8 cols ~65%) */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          {/* Category Chips + Search Bar Row */}
          <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm flex flex-col gap-3">
            {/* Search & Barcode Quick Input */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary text-[18px]">search</span>
                <input className="w-full pl-10 pr-24 py-2.5 bg-surface-container-low rounded-xl text-sm text-on-surface placeholder:text-secondary focus:outline-none focus:bg-surface-container-lowest shadow-inner" placeholder="Cari menu, SKU, atau scan barcode... (F1)" type="text" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-surface-container-lowest rounded text-[11px] font-semibold text-secondary shadow-sm">Ctrl + F</span>
              </div>
              <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl">
                <button className="px-2.5 py-1.5 bg-surface-container-lowest text-primary rounded-lg shadow-sm text-[11px] font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">grid_view</span>
                  <span>Grid</span>
                </button>
                <button className="px-2.5 py-1.5 text-secondary hover:text-on-surface rounded-lg text-[11px] font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">view_list</span>
                  <span>List</span>
                </button>
              </div>
            </div>

            {/* Filter Pills with Quantities */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-nowrap scrollbar-none">
              <button className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-md shadow-primary/20 flex items-center gap-2 shrink-0">
                <span>Semua Produk</span>
                <span className="px-1.5 py-0.5 rounded-full bg-on-primary/20 text-[11px]">128</span>
              </button>
              <button className="px-4 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold shrink-0 flex items-center gap-2 transition-all">
                <span>☕ Kopi & Minuman</span>
                <span className="px-1.5 py-0.5 rounded-full bg-surface-container text-[11px] text-secondary">42</span>
              </button>
              <button className="px-4 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold shrink-0 flex items-center gap-2 transition-all">
                <span>🥪 Makanan & Snack</span>
                <span className="px-1.5 py-0.5 rounded-full bg-surface-container text-[11px] text-secondary">36</span>
              </button>
              <button className="px-4 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold shrink-0 flex items-center gap-2 transition-all">
                <span>🍰 Dessert & Pastry</span>
                <span className="px-1.5 py-0.5 rounded-full bg-surface-container text-[11px] text-secondary">24</span>
              </button>
              <button className="px-4 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold shrink-0 flex items-center gap-2 transition-all">
                <span>🛒 Bahan Pokok</span>
                <span className="px-1.5 py-0.5 rounded-full bg-surface-container text-[11px] text-secondary">26</span>
              </button>
            </div>
          </div>

          {/* PRODUCT CARDS GRID (Responsive 4 Columns) */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Product 1: Kopi Susu Aren */}
            <div className="bg-surface-container-lowest rounded-2xl p-3.5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative cursor-pointer">
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-surface-container mb-3">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt="Kopi Susu Aren" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKprwMr7rNM8aJbjV9EzaGKwdlGzEQ-EUGdX1WrlagN8AJHJoCPnW1cZSDUejXnfyCzU_Xbd5cgXccaKtpzbODZWKGpMlzWGIwSg2SzJVwTBmEVEyL3__rHK-eydFSwio_HjOuBr3cInc86jaCnQ5v-gJLYeDWSW-ocT99zVQBnP4avaZpAu4VyJP4olS01n71JORIABldAcl_akdU-GZck8axXxCjgNelzF7Eug0r82WNhyjYPM1h" />
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-surface-container-lowest/90 backdrop-blur-sm rounded-md text-[11px] font-bold text-status-success">
                  Stok 48
                </span>
                <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary text-on-primary text-[11px] font-bold flex items-center justify-center shadow-md">
                  2
                </span>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-secondary uppercase tracking-widest">SKU: KOP-01</span>
                <h3 className="text-[16px] font-semibold text-on-surface leading-tight group-hover:text-primary transition-colors mt-1">Kopi Susu Aren</h3>
                <span className="inline-block mt-1 px-1.5 py-0.5 bg-surface-container-low text-secondary text-[11px] font-semibold rounded">2 Varian Rasa</span>
              </div>
              <div className="mt-3 pt-2 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-secondary block">Harga</span>
                  <span className="text-sm font-semibold tabular-nums text-primary">Rp 22.000</span>
                </div>
                <button className="w-9 h-9 rounded-xl bg-primary text-on-primary hover:bg-primary/90 flex items-center justify-center shadow-sm active:scale-95 transition-all" type="button">
                  <span className="material-symbols-outlined text-sm">add</span>
                </button>
              </div>
            </div>

            {/* Product 2: Croissant Butter */}
            <div className="bg-surface-container-lowest rounded-2xl p-3.5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative cursor-pointer">
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-surface-container mb-3">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt="Croissant Butter" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5xUaxHBrUU2wNyBB2xy8yrYRENcjMuNeqbxkFYkeZHRMmSeTMrscX-vSMexV0vLEHo5Ciqze_85OyaiaSNE_ssmqd5EMje2KKwURMyBkNG6amf38sreqt5KhIBsf315IjpmR0orOLWJPTGjfOEKuCGFGag6u4DGS92okCjWYTJzpUSugExny6VptFT-O_nCKKWXH2v7D1eerlQBHhHera721iK4Mi4bBQJWdMGb0tblyWYwz5ETWf" />
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-surface-container-lowest/90 backdrop-blur-sm rounded-md text-[11px] font-bold text-status-success">
                  Stok 19
                </span>
                <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary text-on-primary text-[11px] font-bold flex items-center justify-center shadow-md">
                  1
                </span>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-secondary uppercase tracking-widest">SKU: PAS-04</span>
                <h3 className="text-[16px] font-semibold text-on-surface leading-tight group-hover:text-primary transition-colors mt-1">Croissant Butter</h3>
                <span className="inline-block mt-1 px-1.5 py-0.5 bg-surface-container-low text-secondary text-[11px] font-semibold rounded">Fresh Daily</span>
              </div>
              <div className="mt-3 pt-2 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-secondary block">Harga</span>
                  <span className="text-sm font-semibold tabular-nums text-primary">Rp 28.000</span>
                </div>
                <button className="w-9 h-9 rounded-xl bg-primary text-on-primary hover:bg-primary/90 flex items-center justify-center shadow-sm active:scale-95 transition-all" type="button">
                  <span className="material-symbols-outlined text-sm">add</span>
                </button>
              </div>
            </div>

            {/* Product 3: Matcha Latte */}
            <div className="bg-surface-container-lowest rounded-2xl p-3.5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative cursor-pointer">
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-surface-container mb-3">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt="Matcha Latte" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8Mon_dEypws8015jfXnA4HPRWZ9Ur9bddW1Mbqzgew9axvog61XemHG-QB460Jq3kaw556c4m-uLOBb9uGnqBrVPLckSfEVYNYRP2T3pvJDh-6JK6pa9R2ROwOov_10f_04wPRQHudiuF--2U8yn3eXcTy5p7O94CLQszoYexGVPEWeqlKPRYAyDycUujbVEXfAGWpIyDZjC1Yz9u4KqR5dG7ZZEddyjrEB-vs11a3YZP9w8FoWLw" />
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-surface-container-lowest/90 backdrop-blur-sm rounded-md text-[11px] font-bold text-status-success">
                  Stok 32
                </span>
                <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary text-on-primary text-[11px] font-bold flex items-center justify-center shadow-md">
                  1
                </span>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-secondary uppercase tracking-widest">SKU: MNU-09</span>
                <h3 className="text-[16px] font-semibold text-on-surface leading-tight group-hover:text-primary transition-colors mt-1">Matcha Latte</h3>
                <span className="inline-block mt-1 px-1.5 py-0.5 bg-surface-container-low text-secondary text-[11px] font-semibold rounded">Uji Grade A</span>
              </div>
              <div className="mt-3 pt-2 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-secondary block">Harga</span>
                  <span className="text-sm font-semibold tabular-nums text-primary">Rp 26.000</span>
                </div>
                <button className="w-9 h-9 rounded-xl bg-primary text-on-primary hover:bg-primary/90 flex items-center justify-center shadow-sm active:scale-95 transition-all" type="button">
                  <span className="material-symbols-outlined text-sm">add</span>
                </button>
              </div>
            </div>

            {/* Product 4: Americano Ice */}
            <div className="bg-surface-container-lowest rounded-2xl p-3.5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative cursor-pointer">
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-surface-container mb-3">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt="Americano Ice" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBver_pfsinFeUmMUks3SCwPI3pokgPgQ5FMEVHGHKdlIbqFiskoTNIfAQnMU_aaO0NET3BFE0LAXzS7HdnE71HQaRJRfV-5mhue-DtB3WvQdmppFp2OT1LJWNhTLMvQ7yVv0MnrNLqOdozldCClL1_DT1HnwYPvHTcPZCHi_3R--sUpaiBhKGgHe-xbEZSnM56gqT3fQBM2Ui0NBaubCxzjL9qvxWZwpUNfhZZ6HdhyhPasRSoPrin" />
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-status-warning-bg text-status-warning rounded-md text-[11px] font-bold">
                  Sisa 4 pcs
                </span>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-secondary uppercase tracking-widest">SKU: KOP-02</span>
                <h3 className="text-[16px] font-semibold text-on-surface leading-tight group-hover:text-primary transition-colors mt-1">Americano Ice</h3>
                <span className="inline-block mt-1 px-1.5 py-0.5 bg-surface-container-low text-secondary text-[11px] font-semibold rounded">Single Origin Flores</span>
              </div>
              <div className="mt-3 pt-2 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-secondary block">Harga</span>
                  <span className="text-sm font-semibold tabular-nums text-primary">Rp 18.000</span>
                </div>
                <button className="w-9 h-9 rounded-xl bg-surface-container-low hover:bg-primary hover:text-on-primary text-primary flex items-center justify-center shadow-sm active:scale-95 transition-all" type="button">
                  <span className="material-symbols-outlined text-sm">add</span>
                </button>
              </div>
            </div>

            {/* Product 5: Toast Roti Bakar */}
            <div className="bg-surface-container-lowest rounded-2xl p-3.5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative cursor-pointer">
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-surface-container mb-3">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt="Toast Roti Bakar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCk4PE_L96ZBJHUhUppGnArkjK2PsxpH-aSfmF4uK0XW0MS_tRftS7WC7b6ol2iqwKFzYEzjDgIQ_QEFH7PGkokE3nhutiGt76VgU1lWmLF8jWVnwPWLwOgxB6ZmCgmCkuf5Mgb3O_vf98xXkZYNqtF3zU03ENGKTpzDz5OZGoBMzjgrG0EM8jMRdoCJpdPpJlbhXyuBAOv9UebMf2jApHed68KmZcx1qUYMUJ_ZAnvi5zQaXzoAzwc" />
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-surface-container-lowest/90 backdrop-blur-sm rounded-md text-[11px] font-bold text-status-success">
                  Stok 25
                </span>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-secondary uppercase tracking-widest">SKU: SNK-11</span>
                <h3 className="text-[16px] font-semibold text-on-surface leading-tight group-hover:text-primary transition-colors mt-1">Toast Roti Bakar</h3>
                <span className="inline-block mt-1 px-1.5 py-0.5 bg-surface-container-low text-secondary text-[11px] font-semibold rounded">Choco Melt</span>
              </div>
              <div className="mt-3 pt-2 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-secondary block">Harga</span>
                  <span className="text-sm font-semibold tabular-nums text-primary">Rp 20.000</span>
                </div>
                <button className="w-9 h-9 rounded-xl bg-surface-container-low hover:bg-primary hover:text-on-primary text-primary flex items-center justify-center shadow-sm active:scale-95 transition-all" type="button">
                  <span className="material-symbols-outlined text-sm">add</span>
                </button>
              </div>
            </div>
            
            {/* Product 6: French Fries */}
            <div className="bg-surface-container-lowest rounded-2xl p-3.5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative cursor-pointer">
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-surface-container mb-3">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt="French Fries" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDX0fS4FmiuisAofnz64dX9L5rB7KMtFMC1EueqiyEsxh024_006C_ybMXEmRzHN4gpyBrWpJAIaA8u1iCdL2imGLOkW2FzU7jWBXMGqk70xQcIRDOzgHJRP3TFYuOsol8PBlP7LvOJucCKZXIf_-57EpIblsPKt_yfne9YeThsmSO5tsJDrVDnELuBq5pfP-yubBsyegl8fALCdOBcMoblEHO-3yxWhHgwVlwuCtwaahJpL0lPur3D" />
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-surface-container-lowest/90 backdrop-blur-sm rounded-md text-[11px] font-bold text-status-success">
                  Stok 40
                </span>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-secondary uppercase tracking-widest">SKU: SNK-08</span>
                <h3 className="text-[16px] font-semibold text-on-surface leading-tight group-hover:text-primary transition-colors mt-1">French Fries</h3>
                <span className="inline-block mt-1 px-1.5 py-0.5 bg-surface-container-low text-secondary text-[11px] font-semibold rounded">Truffle Mayo Dip</span>
              </div>
              <div className="mt-3 pt-2 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-secondary block">Harga</span>
                  <span className="text-sm font-semibold tabular-nums text-primary">Rp 18.000</span>
                </div>
                <button className="w-9 h-9 rounded-xl bg-surface-container-low hover:bg-primary hover:text-on-primary text-primary flex items-center justify-center shadow-sm active:scale-95 transition-all" type="button">
                  <span className="material-symbols-outlined text-sm">add</span>
                </button>
              </div>
            </div>

            {/* Product 7: Earl Grey Tea */}
            <div className="bg-surface-container-lowest rounded-2xl p-3.5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative cursor-pointer">
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-surface-container mb-3">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt="Earl Grey Tea" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9qu7JZPrYS1KVO4Ufy5y1SVLuu92kil2PzFBDZ1QqICV_eatHKxFpb1P5S4oo9kcNetxc0RkO4nZNYOz4EdqvfRDyCjobgDuqBGlig0qOPRpAcl4_4m04xC27xYLlgesTUvchjP5RxPLbsFioHstpj9IgDphB4lnqX-stxLmRbj3PdGHz2NS3-Ed049-LKRfS2mOUpR0bGUjUQtpS1tB4StI7H8Tjj5-6KNvL93_nAEQLj1fvDIts" />
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-surface-container-lowest/90 backdrop-blur-sm rounded-md text-[11px] font-bold text-status-success">
                  Stok 60
                </span>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-secondary uppercase tracking-widest">SKU: TEA-02</span>
                <h3 className="text-[16px] font-semibold text-on-surface leading-tight group-hover:text-primary transition-colors mt-1">Earl Grey Tea</h3>
                <span className="inline-block mt-1 px-1.5 py-0.5 bg-surface-container-low text-secondary text-[11px] font-semibold rounded">Citrus Bergamot</span>
              </div>
              <div className="mt-3 pt-2 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-secondary block">Harga</span>
                  <span className="text-sm font-semibold tabular-nums text-primary">Rp 16.000</span>
                </div>
                <button className="w-9 h-9 rounded-xl bg-surface-container-low hover:bg-primary hover:text-on-primary text-primary flex items-center justify-center shadow-sm active:scale-95 transition-all" type="button">
                  <span className="material-symbols-outlined text-sm">add</span>
                </button>
              </div>
            </div>

            {/* Product 8: Red Velvet Cake */}
            <div className="bg-surface-container-lowest rounded-2xl p-3.5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative cursor-pointer">
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-surface-container mb-3">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt="Red Velvet Cake" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5dLHMtNliDgzR7k17PrD_Be9AHBYOgmmaoB9mNrI-p17CgulXrQKpU6wNLmY2KvzSThP01FWUOt-ksvoBdhmYr1Sau2a3Z0cAKxgQsQSah01rNC_xvqqHeArfcBvOOnsmWjnNcH28PWGD-0yBxVTkjlimZyXf4WWolTNRsqqEDegOCR4o_ZHLCnToOzXCf3nWF-Hk_tTmRlkTqV1cfdbMBzh7WCZli8Sp42IfeckUVjjSWCiacAwC" />
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-surface-container-lowest/90 backdrop-blur-sm rounded-md text-[11px] font-bold text-status-success">
                  Stok 12
                </span>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-secondary uppercase tracking-widest">SKU: CAK-05</span>
                <h3 className="text-[16px] font-semibold text-on-surface leading-tight group-hover:text-primary transition-colors mt-1">Red Velvet Cake</h3>
                <span className="inline-block mt-1 px-1.5 py-0.5 bg-surface-container-low text-secondary text-[11px] font-semibold rounded">Cream Cheese</span>
              </div>
              <div className="mt-3 pt-2 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-secondary block">Harga</span>
                  <span className="text-sm font-semibold tabular-nums text-primary">Rp 32.000</span>
                </div>
                <button className="w-9 h-9 rounded-xl bg-surface-container-low hover:bg-primary hover:text-on-primary text-primary flex items-center justify-center shadow-sm active:scale-95 transition-all" type="button">
                  <span className="material-symbols-outlined text-sm">add</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: ACTIVE CART & INSTANT CHECKOUT (4 cols ~35%) */}
        <div className="lg:col-span-4 sticky top-20 flex flex-col gap-4">
          <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm flex flex-col border border-border-subtle/50">
            {/* Cart Header & Order Type Switcher */}
            <div className="flex items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <span className="text-[18px] font-extrabold text-on-surface">Pesanan Baru</span>
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold">3 Item</span>
              </div>
              <button className="p-1.5 text-status-danger hover:bg-status-danger-bg rounded-lg transition-colors" title="Reset Keranjang">
                <span className="material-symbols-outlined text-sm">delete_sweep</span>
              </button>
            </div>

            {/* Dine-in / Take Away / Delivery Toggle Switcher */}
            <div className="grid grid-cols-3 gap-1 bg-surface-container-low p-1 rounded-2xl mb-4 text-center">
              <button className="py-1.5 rounded-xl bg-surface-container-lowest text-primary text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-xs">table_restaurant</span>
                <span>Dine In</span>
              </button>
              <button className="py-1.5 rounded-xl text-secondary hover:text-on-surface text-xs font-semibold transition-all flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-xs">takeout_dining</span>
                <span>Bungkus</span>
              </button>
              <button className="py-1.5 rounded-xl text-secondary hover:text-on-surface text-xs font-semibold transition-all flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-xs">moped</span>
                <span>Antar</span>
              </button>
            </div>

            {/* Customer Card Bar */}
            <div className="bg-surface-container-low/60 rounded-xl p-2.5 flex items-center justify-between mb-4 border border-border-subtle/30">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm">account_circle</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-on-surface block leading-none">Walk-in Guest</span>
                  <span className="text-[10px] font-semibold text-secondary mt-1 block">Non-member • Tanpa Piutang</span>
                </div>
              </div>
              <button className="text-primary text-[11px] font-bold hover:underline flex items-center gap-0.5">
                <span>Ubah</span>
                <span className="material-symbols-outlined text-[11px]">chevron_right</span>
              </button>
            </div>

            {/* SCROLLABLE CART LINE ITEMS */}
            <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1 scrollbar-none">
              {/* Item 1: Kopi Susu Aren */}
              <div className="p-3 bg-surface-container-low/40 rounded-xl flex flex-col gap-2 group hover:bg-surface-container-low transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-2">
                    <div className="text-sm font-bold text-on-surface">Kopi Susu Aren</div>
                    <div className="text-[11px] font-semibold text-secondary flex items-center gap-1 mt-1">
                      <span className="px-1.5 py-0.5 bg-surface-container-lowest rounded text-on-surface shadow-sm border border-border-subtle/30">Less Sugar</span>
                      <span className="px-1.5 py-0.5 bg-surface-container-lowest rounded text-on-surface shadow-sm border border-border-subtle/30">Ice</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold tabular-nums text-on-surface block">Rp 44.000</span>
                    <span className="text-[11px] text-secondary">@ Rp 22.000</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <button className="text-secondary hover:text-primary text-[11px] font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">edit_note</span>
                    <span>Catatan</span>
                  </button>
                  <div className="flex items-center gap-2">
                    <button className="w-6 h-6 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container flex items-center justify-center font-bold shadow-sm border border-border-subtle">-</button>
                    <span className="text-sm font-bold tabular-nums text-on-surface w-5 text-center">2</span>
                    <button className="w-6 h-6 rounded-lg bg-primary text-on-primary hover:bg-primary/90 flex items-center justify-center font-bold shadow-sm">+</button>
                    <button className="p-1 text-secondary hover:text-status-danger transition-colors ml-1">
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Item 2: Croissant Butter */}
              <div className="p-3 bg-surface-container-low/40 rounded-xl flex flex-col gap-2 group hover:bg-surface-container-low transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-2">
                    <div className="text-sm font-bold text-on-surface">Croissant Butter</div>
                    <div className="text-[11px] font-semibold text-secondary flex items-center gap-1 mt-1">
                      <span className="px-1.5 py-0.5 bg-surface-container-lowest rounded text-on-surface shadow-sm border border-border-subtle/30">Hangatkan / Warm</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold tabular-nums text-on-surface block">Rp 28.000</span>
                    <span className="text-[11px] text-secondary">@ Rp 28.000</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <button className="text-secondary hover:text-primary text-[11px] font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">edit_note</span>
                    <span>Catatan</span>
                  </button>
                  <div className="flex items-center gap-2">
                    <button className="w-6 h-6 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container flex items-center justify-center font-bold shadow-sm border border-border-subtle">-</button>
                    <span className="text-sm font-bold tabular-nums text-on-surface w-5 text-center">1</span>
                    <button className="w-6 h-6 rounded-lg bg-primary text-on-primary hover:bg-primary/90 flex items-center justify-center font-bold shadow-sm">+</button>
                    <button className="p-1 text-secondary hover:text-status-danger transition-colors ml-1">
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Item 3: Matcha Latte */}
              <div className="p-3 bg-surface-container-low/40 rounded-xl flex flex-col gap-2 group hover:bg-surface-container-low transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-2">
                    <div className="text-sm font-bold text-on-surface">Matcha Latte</div>
                    <div className="text-[11px] font-semibold text-secondary flex items-center gap-1 mt-1">
                      <span className="px-1.5 py-0.5 bg-primary/10 text-primary font-semibold rounded">Oat Milk (+Rp 4.000)</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold tabular-nums text-on-surface block">Rp 30.000</span>
                    <span className="text-[11px] text-secondary">@ Rp 30.000</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <button className="text-secondary hover:text-primary text-[11px] font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">edit_note</span>
                    <span>Catatan</span>
                  </button>
                  <div className="flex items-center gap-2">
                    <button className="w-6 h-6 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container flex items-center justify-center font-bold shadow-sm border border-border-subtle">-</button>
                    <span className="text-sm font-bold tabular-nums text-on-surface w-5 text-center">1</span>
                    <button className="w-6 h-6 rounded-lg bg-primary text-on-primary hover:bg-primary/90 flex items-center justify-center font-bold shadow-sm">+</button>
                    <button className="p-1 text-secondary hover:text-status-danger transition-colors ml-1">
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* SUMMARY CALCULATION & DISCOUNTS */}
            <div className="pt-4 mt-3 flex flex-col gap-2 border-t border-surface-container">
              <div className="flex justify-between text-xs text-secondary">
                <span>Subtotal (3 item)</span>
                <span className="text-sm font-semibold tabular-nums text-on-surface">Rp 102.000</span>
              </div>
              <div className="flex justify-between text-xs text-status-success font-medium">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">sell</span>
                  <span>Diskon Promo [SENINHEMAT]</span>
                </span>
                <span className="text-sm font-bold tabular-nums">- Rp 10.000</span>
              </div>
              <div className="flex justify-between text-xs text-secondary">
                <span>Pajak Resto PB1 (10%)</span>
                <span className="text-sm font-semibold tabular-nums text-on-surface">Rp 9.200</span>
              </div>

              {/* Grand Total Highlight Card */}
              <div className="bg-primary/5 rounded-2xl p-4 mt-2 flex items-center justify-between border border-primary/10">
                <div>
                  <span className="text-[11px] font-bold text-primary uppercase tracking-wider block">Total Tagihan</span>
                  <span className="text-[32px] font-extrabold text-primary leading-none tracking-tight">Rp 101.200</span>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2 py-1 rounded-lg bg-primary text-on-primary text-[11px] font-bold shadow-sm">
                    Tax Incl.
                  </span>
                </div>
              </div>
            </div>

            {/* PAYMENT METHODS SELECTOR (4 Segments) */}
            <div className="mt-5">
              <span className="text-[11px] font-bold text-secondary block mb-2 uppercase tracking-wider">Metode Pembayaran</span>
              <div className="grid grid-cols-4 gap-2">
                {/* QRIS Dynamic */}
                <button className="p-2.5 rounded-xl bg-primary text-on-primary flex flex-col items-center justify-center gap-1 shadow-sm border border-primary/20">
                  <span className="material-symbols-outlined text-[24px]">qr_code_2</span>
                  <span className="text-[11px] font-bold">QRIS</span>
                </button>
                {/* Tunai / Cash */}
                <button className="p-2.5 rounded-xl bg-surface-container-lowest border border-border-subtle hover:bg-surface-container text-on-surface flex flex-col items-center justify-center gap-1 transition-all">
                  <span className="material-symbols-outlined text-[24px] text-secondary">payments</span>
                  <span className="text-[11px] font-semibold">Tunai</span>
                </button>
                {/* Transfer / EDC */}
                <button className="p-2.5 rounded-xl bg-surface-container-lowest border border-border-subtle hover:bg-surface-container text-on-surface flex flex-col items-center justify-center gap-1 transition-all">
                  <span className="material-symbols-outlined text-[24px] text-secondary">credit_card</span>
                  <span className="text-[11px] font-semibold">Transfer</span>
                </button>
                {/* Kasbon / Piutang */}
                <button className="p-2.5 rounded-xl bg-surface-container-lowest border border-border-subtle hover:bg-surface-container text-on-surface flex flex-col items-center justify-center gap-1 transition-all">
                  <span className="material-symbols-outlined text-[24px] text-secondary">receipt_long</span>
                  <span className="text-[11px] font-semibold">Kasbon</span>
                </button>
              </div>
            </div>

            {/* QUICK CASH BILL SELECTOR */}
            <div className="mt-4">
              <span className="text-[11px] font-semibold text-secondary block mb-2">Pilihan Uang Pas Tunai:</span>
              <div className="flex flex-wrap gap-2">
                <button className="px-3 py-1.5 bg-surface-container-lowest border border-border-subtle hover:bg-surface-container rounded-lg text-[13px] font-semibold tabular-nums text-on-surface transition-colors shadow-sm">
                  Uang Pas (101.200)
                </button>
                <button className="px-3 py-1.5 bg-surface-container-lowest border border-border-subtle hover:bg-surface-container rounded-lg text-[13px] font-semibold tabular-nums text-on-surface transition-colors shadow-sm">
                  105.000
                </button>
                <button className="px-3 py-1.5 bg-surface-container-lowest border border-border-subtle hover:bg-surface-container rounded-lg text-[13px] font-semibold tabular-nums text-on-surface transition-colors shadow-sm">
                  120.000
                </button>
                <button className="px-3 py-1.5 bg-surface-container-lowest border border-border-subtle hover:bg-surface-container rounded-lg text-[13px] font-semibold tabular-nums text-on-surface transition-colors shadow-sm">
                  150.000
                </button>
                <button className="px-3 py-1.5 bg-surface-container-lowest border border-border-subtle hover:bg-surface-container rounded-lg text-[13px] font-semibold tabular-nums text-on-surface transition-colors shadow-sm">
                  200.000
                </button>
              </div>
            </div>

            {/* PRIMARY CHECKOUT ACTIONS */}
            <div className="mt-5 pt-4 flex flex-col gap-3 border-t border-surface-container">
              {/* Main Button: Bayar & Cetak Struk (F9) */}
              <button className="w-full py-4 px-4 rounded-2xl bg-primary hover:bg-primary/90 text-on-primary text-[18px] font-bold shadow-lg shadow-primary/25 flex items-center justify-between active:scale-[0.99] transition-all" type="button">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[24px]">check_circle</span>
                  <span>Bayar & Cetak Struk</span>
                </div>
                <span className="px-2 py-1 rounded-lg bg-on-primary/20 text-[12px] font-mono shadow-inner">F9</span>
              </button>
              
              {/* Split Secondary Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button className="py-3 rounded-xl bg-surface-container-lowest border border-border-subtle hover:bg-surface-container text-on-surface text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm" type="button">
                  <span className="material-symbols-outlined text-[18px] text-secondary">bookmark_border</span>
                  <span>Tahan / Simpan</span>
                </button>
                <button className="py-3 rounded-xl bg-status-danger-bg hover:bg-status-danger-bg/80 border border-status-danger/20 text-status-danger text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm" type="button">
                  <span className="material-symbols-outlined text-[18px]">close</span>
                  <span>Batal Pesanan</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
