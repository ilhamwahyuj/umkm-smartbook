"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export default function PengaturanTokoPage() {
  const [storeName, setStoreName] = useState("Kopi Berkah Nusantara - Pusat");
  const [headerMsg, setHeaderMsg] = useState("Terima kasih atas kunjungan Anda!");
  const [igAccount, setIgAccount] = useState("@kopiberkah.jkt");
  const [wifiSsid, setWifiSsid] = useState("SSID: Berkah_Guest");
  const [wifiPass, setWifiPass] = useState("Pass: ngopiasik2026");
  
  const [showLogo, setShowLogo] = useState(true);
  const [showQris, setShowQris] = useState(true);
  
  const [taxEnabled, setTaxEnabled] = useState(true);
  const [serviceEnabled, setServiceEnabled] = useState(true);
  const [taxInclusive, setTaxInclusive] = useState(false);
  
  const [paperSize, setPaperSize] = useState<"80mm" | "58mm">("80mm");
  
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const subtotal = 96000;
  const service = serviceEnabled ? 4800 : 0;
  const tax = taxEnabled ? 10080 : 0;
  const rounding = 120;
  const grandTotal = subtotal + service + tax + rounding;

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }, 600);
  };

  return (
    <div className="flex flex-col w-full gap-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-surface-card p-6 rounded-xl shadow-sm border border-border-subtle">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-status-success-bg text-status-success">Multi-Tenant Cloud POS</span>
            <span className="font-body-sm text-body-sm text-secondary">Outlet ID: #SB-JKT-001</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Pengaturan Toko</h1>
          <p className="font-body-md text-body-md text-secondary max-w-3xl">Kelola identitas usaha, informasi gerai, konfigurasi struk kasir, dan preferensi operasional multi-cabang.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-label-lg text-label-lg bg-surface-canvas border border-border-subtle text-secondary hover:text-on-surface hover:bg-slate-50 shadow-sm hover:shadow transition-all" type="button">
            <span className="material-symbols-outlined text-lg">receipt_long</span>
            <span>Pratinjau Struk</span>
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-xl font-label-lg text-label-lg text-on-primary active:scale-95 transition-all shadow-md",
              isSaved 
                ? "bg-status-success shadow-status-success/20" 
                : "bg-primary-container hover:bg-teal-accent shadow-primary-container/20"
            )}
            type="button"
          >
            <span className={cn("material-symbols-outlined text-lg", isSaving && "animate-spin")}>
              {isSaving ? "refresh" : isSaved ? "check_circle" : "save"}
            </span>
            <span>{isSaving ? "Menyimpan..." : isSaved ? "Tersimpan!" : "Simpan Perubahan"}</span>
          </button>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-label-lg text-label-lg bg-primary-container text-on-primary shadow-sm whitespace-nowrap transition-all" type="button">
          <span className="material-symbols-outlined text-base">store</span>
          <span>Profil Toko</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-label-lg text-label-lg bg-surface-card border border-border-subtle text-secondary hover:text-on-surface hover:bg-surface-container-low shadow-sm whitespace-nowrap transition-all" type="button">
          <span className="material-symbols-outlined text-base">point_of_sale</span>
          <span>Konfigurasi Kasir & Struk</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-label-lg text-label-lg bg-surface-card border border-border-subtle text-secondary hover:text-on-surface hover:bg-surface-container-low shadow-sm whitespace-nowrap transition-all" type="button">
          <span className="material-symbols-outlined text-base">percent</span>
          <span>Pajak & Biaya Layanan</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-label-lg text-label-lg bg-surface-card border border-border-subtle text-secondary hover:text-on-surface hover:bg-surface-container-low shadow-sm whitespace-nowrap transition-all" type="button">
          <span className="material-symbols-outlined text-base">table_restaurant</span>
          <span>Manajemen Meja & Cabang</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-label-lg text-label-lg bg-surface-card border border-border-subtle text-secondary hover:text-on-surface hover:bg-surface-container-low shadow-sm whitespace-nowrap transition-all" type="button">
          <span className="material-symbols-outlined text-base">contactless</span>
          <span>Integrasi QRIS & EDC</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Forms */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
          
          {/* Section: Identitas Bisnis */}
          <section className="bg-surface-card rounded-xl p-6 shadow-sm border border-border-subtle flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-status-info-bg text-status-info flex items-center justify-center">
                  <span className="material-symbols-outlined">badge</span>
                </div>
                <div className="flex flex-col">
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">Identitas & Informasi Bisnis</h2>
                  <p className="font-body-sm text-body-sm text-secondary">Data resmi profil usaha yang tercatat di sistem multi-tenant cloud Smartbook.</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full font-label-sm text-label-sm bg-status-success-bg text-status-success">Terverifikasi</span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-4 rounded-xl bg-surface-canvas border border-border-subtle">
              <div className="relative group shrink-0">
                <img alt="Logo" className="w-20 h-20 rounded-2xl object-cover shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUoX-qW6J0yTFlTM1V3gTMX1qgZKBHJiFkM86Ui4C4wPgNwq6q-AMlUfOhDNsX8zWKZSwezjLRFm9EusZXoPnfTUTDo4r1b8tfiO6GfTjEvU5uLkgZTP7TwmR2O_ktNWALNZUa85ftUsEHPCBeFZt3aZZ1w3Bbn5lg-yI2_i0IMA1N2Ecfs9Cm1aBfwOBSDHtG_x-OvTIxLdZZqrAbnctFYoErMSSuzYNTzVNFtvpevAjaKuqkhJfY"/>
                <button className="absolute inset-0 bg-surface-sidebar/60 rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-on-primary transition-opacity text-xs font-semibold" type="button">
                  <span className="material-symbols-outlined text-xl">photo_camera</span>
                  <span>Ganti</span>
                </button>
              </div>
              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">Logo Utama Usaha</h3>
                  <span className="font-label-sm text-label-sm text-primary">512x512 PNG/JPG</span>
                </div>
                <p className="font-body-sm text-body-sm text-secondary">Logo ini akan dicetak di struk termal POS dan kop laporan finansial bulanan.</p>
                <div className="flex items-center gap-3 mt-1">
                  <button className="px-3.5 py-1.5 rounded-lg bg-surface-card border border-border-subtle text-on-surface hover:bg-slate-50 font-label-sm text-label-sm shadow-sm transition-colors" type="button">Unggah Baru</button>
                  <button className="px-3.5 py-1.5 rounded-lg text-status-danger hover:bg-status-danger-bg font-label-sm text-label-sm transition-colors" type="button">Hapus Logo</button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface">Nama Gerai / Toko</label>
                <input 
                  type="text" 
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-surface-card border border-border-subtle text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container shadow-sm" 
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface">Kategori & Tipe Usaha</label>
                <select className="px-3.5 py-2.5 rounded-xl bg-surface-card border border-border-subtle text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container shadow-sm">
                  <option defaultValue="Kafe & Resto (F&B Hospitality)">Kafe & Resto (F&B Hospitality)</option>
                  <option>Retail & Minimarket</option>
                  <option>Apotek & Kesehatan</option>
                  <option>Jasa & Barber Service</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface">Nomor NPWP / NIB Badan Usaha</label>
                <input type="text" defaultValue="01.892.441.5-014.000 / 120923004812" className="px-3.5 py-2.5 rounded-xl bg-surface-card border border-border-subtle text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container shadow-sm" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface">Email Operasional Toko</label>
                <input type="email" defaultValue="toko.anda@smartbook.id" className="px-3.5 py-2.5 rounded-xl bg-surface-card border border-border-subtle text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container shadow-sm" />
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="font-label-md text-label-md text-on-surface">Nomor WhatsApp Resmi Pelanggan</label>
                <div className="flex items-center rounded-xl bg-surface-card border border-border-subtle shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-primary-container">
                  <span className="px-4 py-2.5 bg-surface-canvas border-r border-border-subtle text-secondary font-tabular-numeric text-tabular-numeric">ID (+62)</span>
                  <input type="tel" defaultValue="812-3456-7890" className="w-full px-3.5 py-2.5 bg-transparent text-on-surface font-body-md text-body-md focus:outline-none" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="font-label-md text-label-md text-on-surface">Alamat Lengkap Operasional Gerai</label>
                <textarea rows={2} defaultValue="Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan 12190" className="px-3.5 py-2.5 rounded-xl bg-surface-card border border-border-subtle text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container shadow-sm" />
              </div>
            </div>
          </section>

          {/* Section: Pengaturan Transaksi & Struk */}
          <section className="bg-surface-card rounded-xl p-6 shadow-sm border border-border-subtle flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary-container text-primary-container flex items-center justify-center">
                  <span className="material-symbols-outlined">print</span>
                </div>
                <div className="flex flex-col">
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">Pengaturan Transaksi & Struk Kasir</h2>
                  <p className="font-body-sm text-body-sm text-secondary">Kustomisasi keluaran printer thermal kasir (58mm / 80mm) dan integrasi nota digital.</p>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-surface-canvas border border-border-subtle p-1 rounded-lg">
                <button 
                  onClick={() => setPaperSize('80mm')}
                  className={cn("px-3 py-1 rounded-md font-label-sm text-label-sm transition-colors", paperSize === '80mm' ? "bg-surface-card text-primary-container shadow-sm font-bold" : "text-secondary hover:text-on-surface font-medium")}
                >
                  80mm
                </button>
                <button 
                  onClick={() => setPaperSize('58mm')}
                  className={cn("px-3 py-1 rounded-md font-label-sm text-label-sm transition-colors", paperSize === '58mm' ? "bg-surface-card text-primary-container shadow-sm font-bold" : "text-secondary hover:text-on-surface font-medium")}
                >
                  58mm
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface">Pesan Pembuka / Header Struk</label>
                <input 
                  type="text" 
                  value={headerMsg}
                  onChange={(e) => setHeaderMsg(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-surface-card border border-border-subtle text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container shadow-sm" 
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface">Akun Instagram Toko</label>
                <input 
                  type="text" 
                  value={igAccount}
                  onChange={(e) => setIgAccount(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-surface-card border border-border-subtle text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container shadow-sm" 
                />
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="font-label-md text-label-md text-on-surface">Info Akses Wi-Fi Pelanggan di Struk</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input 
                    type="text" 
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    placeholder="SSID" 
                    className="px-3.5 py-2.5 rounded-xl bg-surface-card border border-border-subtle text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container shadow-sm" 
                  />
                  <input 
                    type="text" 
                    value={wifiPass}
                    onChange={(e) => setWifiPass(e.target.value)}
                    placeholder="Pass" 
                    className="px-3.5 py-2.5 rounded-xl bg-surface-card border border-border-subtle text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container shadow-sm" 
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-canvas border border-border-subtle hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary-container">image</span>
                  <div className="flex flex-col">
                    <span className="font-label-lg text-label-lg text-on-surface">Cetak Logo di Struk Termal</span>
                    <span className="font-body-sm text-body-sm text-secondary">Tampilkan grafik hitam-putih logo di bagian atas struk kasir.</span>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={showLogo} onChange={(e) => setShowLogo(e.target.checked)} />
                  <div className="w-11 h-6 bg-secondary-fixed-dim peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-canvas border border-border-subtle hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary-container">qr_code_2</span>
                  <div className="flex flex-col">
                    <span className="font-label-lg text-label-lg text-on-surface">Tampilkan QRIS Dinamis di Struk</span>
                    <span className="font-body-sm text-body-sm text-secondary">Generate barcode QRIS instan sesuai nominal tagihan yang belum lunas.</span>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={showQris} onChange={(e) => setShowQris(e.target.checked)} />
                  <div className="w-11 h-6 bg-secondary-fixed-dim peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-canvas border border-border-subtle hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary-container">toll</span>
                  <div className="flex flex-col">
                    <span className="font-label-lg text-label-lg text-on-surface">Aktifkan Pembulatan Otomatis (Round to Rp 100)</span>
                    <span className="font-body-sm text-body-sm text-secondary">Mempermudah uang kembalian tunai di kasir tanpa receh puluhan rupiah.</span>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-secondary-fixed-dim peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
                </label>
              </div>
            </div>
          </section>

          {/* Section: Pajak & Biaya */}
          <section className="bg-surface-card rounded-xl p-6 shadow-sm border border-border-subtle flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-status-warning-bg text-status-warning flex items-center justify-center">
                  <span className="material-symbols-outlined">calculate</span>
                </div>
                <div className="flex flex-col">
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">Pajak Restoran (PB1) & Biaya Layanan</h2>
                  <p className="font-body-sm text-body-sm text-secondary">Pengaturan tarif pungutan daerah dan service charge operasional gerai.</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full font-label-sm text-label-sm bg-status-warning-bg text-status-warning">Konfigurasi Aktif</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-surface-canvas border border-border-subtle flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-label-lg text-label-lg text-on-surface">Pajak Restoran (PB1)</span>
                    <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-primary text-on-primary font-bold">10%</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={taxEnabled} onChange={(e) => setTaxEnabled(e.target.checked)} />
                    <div className="w-11 h-6 bg-secondary-fixed-dim peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
                  </label>
                </div>
                <p className="font-body-sm text-body-sm text-secondary">Dikenakan secara otomatis pada setiap tagihan dine-in maupun takeaway.</p>
              </div>

              <div className="p-4 rounded-xl bg-surface-canvas border border-border-subtle flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-label-lg text-label-lg text-on-surface">Biaya Layanan</span>
                    <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-status-info text-on-primary font-bold">5%</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={serviceEnabled} onChange={(e) => setServiceEnabled(e.target.checked)} />
                    <div className="w-11 h-6 bg-secondary-fixed-dim peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
                  </label>
                </div>
                <p className="font-body-sm text-body-sm text-secondary">Alokasi insentif kru kasir dan barista untuk pelayanan meja.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-canvas border border-border-subtle flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-status-success-bg text-status-success flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-lg">price_check</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-lg text-label-lg text-on-surface">Harga Produk Sudah Termasuk Pajak (Tax Inclusive)</span>
                  <span className="font-body-sm text-body-sm text-secondary">Bila dinonaktifkan, kalkulasi PB1 dan service charge akan ditambahkan di luar subtotal menu.</span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input type="checkbox" className="sr-only peer" checked={taxInclusive} onChange={(e) => setTaxInclusive(e.target.checked)} />
                <div className="w-11 h-6 bg-secondary-fixed-dim peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
              </label>
            </div>
          </section>

        </div>

        {/* Sidebar Preview */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6 sticky top-20">
          
          <div className="bg-surface-card rounded-xl p-5 shadow-sm border border-border-subtle flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-status-success"></span>
                </span>
                <span className="font-label-lg text-label-lg text-status-success font-bold">Status Toko: Buka</span>
              </div>
              <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-status-success-bg text-status-success font-semibold">Operasional Normal</span>
            </div>
            <div className="p-3 rounded-xl bg-surface-canvas border border-border-subtle flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-primary-container">schedule</span>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-secondary">Jam Kerja Gerai</span>
                  <span className="font-tabular-numeric text-tabular-numeric text-on-surface">08:00 - 22:00 WIB</span>
                </div>
              </div>
              <button className="text-primary font-label-sm text-label-sm font-bold hover:underline" type="button">Ubah Jadwal</button>
            </div>
          </div>

          <div className="bg-surface-card rounded-xl p-5 shadow-md border border-border-subtle flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-container">preview</span>
                <span className="font-headline-sm text-headline-sm text-on-surface">Pratinjau Struk Kasir</span>
              </div>
              <span className="font-label-sm text-label-sm bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded font-mono">{paperSize} Paper</span>
            </div>
            
            <div className="bg-[#FCFDFD] p-5 rounded-lg shadow-inner border border-slate-100 flex flex-col gap-3 font-mono text-xs text-slate-800 transition-all duration-300 mx-auto w-full max-w-[340px]">
              
              {showLogo && (
                <div className="flex flex-col items-center justify-center pt-2">
                  <img alt="Logo Struk" className="w-12 h-12 rounded-lg object-cover grayscale contrast-125 mb-1" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEPNm4C10G-EPhI1oOml7W3bXbpyKLEGspBnQVKUz7Yrr6K0Siebdrs1VER6aVhBqwIplid2DUXgAfNxEKLz5w1lp_Ewv8lAcRBe5eAsG401aluAKAWFQbmStVoHRNHa_QLMvKaQigUwhFe7uYTi_Ajv2cB5VjTlAQMgOcmhuI6d47MmIB6p-SISVYZKdsLDN2PTZlvy40W2E2brdRGFxY2g15RFHp1ak5vUSz4J4LMH0EXdyFgfFX"/>
                </div>
              )}
              
              <div className="flex flex-col items-center text-center">
                <span className="font-bold text-sm text-slate-950 tracking-wider uppercase">{storeName || 'NAMA TOKO'}</span>
                <span className="text-[11px] text-slate-600 mt-0.5">Jl. Senopati No. 42, Jaksel</span>
                <span className="text-[10px] text-slate-500">Telp: +62 812-3456-7890</span>
                <span className="text-[10px] text-slate-400 mt-1">NPWP: 01.892.441.5-014.000</span>
              </div>
              
              <div className="border-b border-dashed border-slate-400 my-1"></div>
              
              <div className="flex justify-between text-[11px] text-slate-600">
                <span>No: #INV-20260408-089</span>
                <span>Kasir: Dewi A.</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-600">
                <span>Tgl: 08 Apr 2026 14:28</span>
                <span>Meja: 07 (Dine-in)</span>
              </div>
              
              <div className="border-b border-dashed border-slate-400 my-1"></div>
              
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900">1x Berkah Aren Latte</span>
                    <span className="text-[10px] text-slate-500">Normal Sweet / Oatmilk (+5k)</span>
                  </div>
                  <span className="font-semibold">33.000</span>
                </div>
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900">1x Almond Croissant</span>
                    <span className="text-[10px] text-slate-500">Warmed Up</span>
                  </div>
                  <span className="font-semibold">28.000</span>
                </div>
              </div>
              
              <div className="border-b border-dashed border-slate-400 my-1"></div>
              
              <div className="flex flex-col gap-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-600">Subtotal (2 Item)</span>
                  <span className="font-semibold">{subtotal.toLocaleString('id-ID')}</span>
                </div>
                {serviceEnabled && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Service Charge (5%)</span>
                    <span className="font-semibold">{service.toLocaleString('id-ID')}</span>
                  </div>
                )}
                {taxEnabled && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">PB1 Resto (10%)</span>
                    <span className="font-semibold">{tax.toLocaleString('id-ID')}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>Pembulatan Sistem</span>
                  <span>+{rounding}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-slate-950 pt-1 border-t border-dashed border-slate-400 mt-1">
                  <span>TOTAL BAYAR</span>
                  <span>Rp {grandTotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-slate-600 pt-0.5">
                  <span>Metode Bayar</span>
                  <span className="font-semibold">QRIS Dinamis</span>
                </div>
              </div>
              
              {showQris && (
                <div className="flex flex-col items-center justify-center p-3 bg-white rounded border border-dashed border-slate-300 my-1">
                  <svg className="w-24 h-24 text-slate-900" fill="currentColor" viewBox="0 0 100 100">
                    <path d="M10,10 h30 v30 h-30 z M15,15 v20 h20 v-20 z M22,22 h6 v6 h-6 z"></path>
                    <path d="M60,10 h30 v30 h-30 z M65,15 v20 h20 v-20 z M72,22 h6 v6 h-6 z"></path>
                    <path d="M10,60 h30 v30 h-30 z M15,65 v20 h20 v-20 z M22,72 h6 v6 h-6 z"></path>
                    <rect height="8" width="8" x="45" y="15"></rect>
                    <rect height="15" width="8" x="45" y="30"></rect>
                    <rect height="8" width="8" x="45" y="55"></rect>
                    <rect height="15" width="8" x="45" y="70"></rect>
                    <rect height="10" width="10" x="60" y="50"></rect>
                    <rect height="10" width="15" x="75" y="50"></rect>
                    <rect height="8" width="8" x="60" y="65"></rect>
                    <rect height="8" width="15" x="75" y="65"></rect>
                    <rect height="10" width="20" x="65" y="80"></rect>
                  </svg>
                  <span className="text-[9px] text-slate-500 font-bold mt-1 tracking-widest uppercase">NMID: ID1020038891002</span>
                  <span className="text-[8px] text-slate-400">Scan via BCA / Mandiri / GoPay / OVO</span>
                </div>
              )}
              
              <div className="border-b border-dashed border-slate-400 my-1"></div>
              
              <div className="flex flex-col items-center text-center gap-1">
                {headerMsg && <span className="font-semibold text-[11px] text-slate-900">{headerMsg}</span>}
                {(wifiSsid || wifiPass) && <span className="text-[10px] text-slate-500">Wi-Fi: {wifiSsid.replace('SSID: ', '')} / {wifiPass.replace('Pass: ', '')}</span>}
                {igAccount && <span className="text-[10px] text-slate-600 font-bold">IG: {igAccount}</span>}
                <span className="text-[9px] text-slate-400 mt-2">Ditenagai oleh UMKM Smartbook POS Cloud</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 justify-center pt-2">
              <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-canvas border border-border-subtle text-secondary hover:text-on-surface hover:bg-slate-50 font-label-sm text-label-sm transition-colors" type="button">
                <span className="material-symbols-outlined text-base">print</span>
                <span>Tes Cetak Termal</span>
              </button>
              <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-canvas border border-border-subtle text-secondary hover:text-on-surface hover:bg-slate-50 font-label-sm text-label-sm transition-colors" type="button">
                <span className="material-symbols-outlined text-base">share</span>
                <span>Bagikan PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
