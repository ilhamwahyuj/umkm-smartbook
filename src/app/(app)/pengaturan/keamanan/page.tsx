"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export default function KeamananPage() {
  const [voidPinRequired, setVoidPinRequired] = useState(true);
  const [limitShiftReport, setLimitShiftReport] = useState(true);
  const [autoLockTerminal, setAutoLockTerminal] = useState(true);

  return (
    <div className="flex flex-col w-full gap-8 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3">
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Keamanan & Hak Akses</h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-status-success-bg text-status-success font-label-md text-label-md shadow-sm">
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              Tingkat Keamanan: Sangat Baik (85%)
            </span>
          </div>
          <p className="font-body-md text-body-md text-secondary max-w-3xl">
            Kelola otentikasi multi-faktor, proteksi PIN kasir bertingkat, monitoring sesi terminal POS, dan jejak audit kepatuhan merchant.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start lg:self-auto">
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-card text-on-surface font-label-lg text-label-lg shadow-sm hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined text-[18px] text-secondary">file_download</span>
            Unduh Laporan Audit
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg shadow-sm hover:bg-primary-container transition-all">
            <span className="material-symbols-outlined text-[18px]">lock_reset</span>
            Kunci Terminal Darurat
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-fixed text-on-primary-fixed font-label-md text-label-md shadow-sm transition-all whitespace-nowrap">
          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
          Keamanan Login & Sandi
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-card border border-border-subtle text-secondary font-label-md text-label-md shadow-sm hover:bg-surface-container-low hover:text-on-surface transition-all whitespace-nowrap">
          <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
          Role & Hak Akses Staf
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-card border border-border-subtle text-secondary font-label-md text-label-md shadow-sm hover:bg-surface-container-low hover:text-on-surface transition-all whitespace-nowrap">
          <span className="material-symbols-outlined text-[18px]">devices</span>
          Sesi Perangkat Kasir Terhubung
          <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] bg-primary text-on-primary font-bold">3</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-card border border-border-subtle text-secondary font-label-md text-label-md shadow-sm hover:bg-surface-container-low hover:text-on-surface transition-all whitespace-nowrap">
          <span className="material-symbols-outlined text-[18px]">history</span>
          Log Aktivitas Audit
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 flex flex-col gap-8">
          <div className="bg-surface-card rounded-2xl p-6 lg:p-8 shadow-sm border border-border-subtle flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[22px]">password</span>
                </div>
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">Kredensial & Pembaharuan Kata Sandi</h2>
                  <p className="font-body-sm text-body-sm text-secondary">Amankan akun induk pemilik toko dengan kata sandi terenkripsi tingkat tinggi.</p>
                </div>
              </div>
              <span className="font-label-sm text-label-sm text-secondary bg-surface-container-low px-3 py-1 rounded-lg self-start sm:self-auto">
                Diubah 42 hari lalu
              </span>
            </div>
            <form className="grid grid-cols-1 sm:grid-cols-2 gap-5" onSubmit={(e) => e.preventDefault()}>
              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface">Kata Sandi Saat Ini</label>
                <div className="relative flex items-center">
                  <input className="w-full h-11 px-4 pr-11 rounded-xl bg-surface-canvas border border-border-subtle text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container shadow-inner" placeholder="Masukkan sandi saat ini" type="password" defaultValue="••••••••••••••••" />
                  <button className="absolute right-3 text-secondary hover:text-on-surface" type="button">
                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface" htmlFor="newPassword">Kata Sandi Baru</label>
                <div className="relative flex items-center">
                  <input className="w-full h-11 px-4 pr-11 rounded-xl bg-surface-canvas border border-border-subtle text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container shadow-inner" id="newPassword" placeholder="Kombinasi huruf, angka & simbol" type="password" defaultValue="KopiSusu#2025Merdeka" />
                  <button className="absolute right-3 text-secondary hover:text-on-surface" type="button">
                    <span className="material-symbols-outlined text-[20px]">visibility_off</span>
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface">Ulangi Kata Sandi Baru</label>
                <div className="relative flex items-center">
                  <input className="w-full h-11 px-4 pr-11 rounded-xl bg-surface-canvas border border-border-subtle text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container shadow-inner" placeholder="Ketik kembali sandi baru" type="password" defaultValue="KopiSusu#2025Merdeka" />
                  <button className="absolute right-3 text-secondary hover:text-on-surface" type="button">
                    <span className="material-symbols-outlined text-[20px] text-status-success">check_circle</span>
                  </button>
                </div>
              </div>
              <div className="sm:col-span-2 flex flex-col gap-2 pt-1">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm text-secondary">Kekuatan Sandi: <span className="font-bold text-status-success">Kuat & Memenuhi Standar FinTech</span></span>
                  <span className="font-label-sm text-label-sm text-status-success">92 / 100</span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-container-low overflow-hidden flex gap-1">
                  <div className="h-full w-1/4 bg-status-success rounded-full"></div>
                  <div className="h-full w-1/4 bg-status-success rounded-full"></div>
                  <div className="h-full w-1/4 bg-status-success rounded-full"></div>
                  <div className="h-full w-1/4 bg-status-success/70 rounded-full"></div>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-secondary font-label-sm text-label-sm">
                  <span className="inline-flex items-center gap-1 text-status-success">
                    <span className="material-symbols-outlined text-[14px]">check</span> Min. 10 karakter
                  </span>
                  <span className="inline-flex items-center gap-1 text-status-success">
                    <span className="material-symbols-outlined text-[14px]">check</span> Huruf besar & kecil
                  </span>
                  <span className="inline-flex items-center gap-1 text-status-success">
                    <span className="material-symbols-outlined text-[14px]">check</span> Angka numerik
                  </span>
                  <span className="inline-flex items-center gap-1 text-status-success">
                    <span className="material-symbols-outlined text-[14px]">check</span> Karakter unik (!@#$)
                  </span>
                </div>
              </div>
              <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
                <button className="px-5 py-2.5 rounded-xl bg-surface-canvas border border-border-subtle text-secondary font-label-lg text-label-lg hover:bg-slate-50 hover:text-on-surface transition-colors" type="button">
                  Batalkan
                </button>
                <button className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg shadow-sm hover:bg-primary-container transition-all" type="button">
                  Simpan Pembaharuan Sandi
                </button>
              </div>
            </form>
          </div>
          
          <div className="bg-surface-card rounded-2xl p-6 lg:p-8 shadow-sm border border-border-subtle flex flex-col gap-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-status-warning-bg flex items-center justify-center text-status-warning">
                  <span className="material-symbols-outlined text-[22px]">pin</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-headline-sm text-headline-sm text-on-surface">PIN Otorisasi Kasir & Kontrol Supervisor</h2>
                    <span className="px-2 py-0.5 rounded-md bg-status-warning-bg text-status-warning font-label-sm text-label-sm">Penting untuk POS</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-secondary">Cegah fraud di meja kasir dengan mewajibkan verifikasi PIN pada transaksi sensitif.</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-surface-canvas border border-border-subtle p-5 rounded-xl">
              <div className="md:col-span-5 flex flex-col gap-3">
                <span className="font-label-md text-label-md text-on-surface">PIN Otorisasi Aktif (6-Digit)</span>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-8 h-9 rounded-lg bg-surface-card border border-border-subtle flex items-center justify-center font-price-display text-base font-bold shadow-sm">8</span>
                    <span className="w-8 h-9 rounded-lg bg-surface-card border border-border-subtle flex items-center justify-center font-price-display text-base font-bold shadow-sm">4</span>
                    <span className="w-8 h-9 rounded-lg bg-surface-card border border-border-subtle flex items-center justify-center font-price-display text-base font-bold shadow-sm">2</span>
                    <span className="w-8 h-9 rounded-lg bg-surface-card border border-border-subtle flex items-center justify-center font-price-display text-base font-bold shadow-sm">•</span>
                    <span className="w-8 h-9 rounded-lg bg-surface-card border border-border-subtle flex items-center justify-center font-price-display text-base font-bold shadow-sm">•</span>
                    <span className="w-8 h-9 rounded-lg bg-surface-card border border-border-subtle flex items-center justify-center font-price-display text-base font-bold shadow-sm">•</span>
                  </div>
                  <button className="p-2 rounded-lg bg-surface-card border border-border-subtle text-secondary hover:text-on-surface shadow-sm" title="Ubah PIN">
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                </div>
                <p className="font-body-sm text-body-sm text-secondary">
                  Digunakan saat kasir meminta approval pembatalan struk, diskon khusus, atau pembukaan manual laci kasir (drawer).
                </p>
              </div>
              
              <div className="md:col-span-7 flex flex-col gap-3">
                <span className="font-label-md text-label-md text-on-surface">Kebijakan Otorisasi Otomatis</span>
                
                <div className="flex items-center justify-between gap-3 bg-surface-card border border-border-subtle p-3 rounded-xl shadow-sm hover:scale-[1.01] transition-transform duration-300">
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface">Wajibkan PIN saat Void Transaksi</span>
                    <span className="font-body-sm text-body-sm text-secondary">Kasir tidak dapat menghapus pesanan yang sudah tercetak di dapur tanpa PIN supervisor.</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input type="checkbox" className="sr-only peer" checked={voidPinRequired} onChange={(e) => setVoidPinRequired(e.target.checked)} />
                    <div className="w-11 h-6 bg-secondary-fixed-dim peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between gap-3 bg-surface-card border border-border-subtle p-3 rounded-xl shadow-sm hover:scale-[1.01] transition-transform duration-300">
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface">Batasi Laporan Shift Kasir</span>
                    <span className="font-body-sm text-body-sm text-secondary">Kasir biasa hanya dapat melihat total omset shift aktif mereka, bukan ringkasan toko keseluruhan.</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input type="checkbox" className="sr-only peer" checked={limitShiftReport} onChange={(e) => setLimitShiftReport(e.target.checked)} />
                    <div className="w-11 h-6 bg-secondary-fixed-dim peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between gap-3 bg-surface-card border border-border-subtle p-3 rounded-xl shadow-sm hover:scale-[1.01] transition-transform duration-300">
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface">Auto-Lock Terminal Kasir (5 Menit)</span>
                    <span className="font-body-sm text-body-sm text-secondary">Otomatis kembali ke layar login PIN jika terminal ditinggalkan tanpa aktivitas transaksi.</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input type="checkbox" className="sr-only peer" checked={autoLockTerminal} onChange={(e) => setAutoLockTerminal(e.target.checked)} />
                    <div className="w-11 h-6 bg-secondary-fixed-dim peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-surface-card rounded-2xl p-6 lg:p-8 shadow-sm border border-border-subtle flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-status-info-bg flex items-center justify-center text-status-info">
                  <span className="material-symbols-outlined text-[22px]">devices_other</span>
                </div>
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">Daftar Sesi Perangkat Kasir Terhubung</h2>
                  <p className="font-body-sm text-body-sm text-secondary">Monitor tablet register, ponsel pramusaji, dan komputer pengelola cabang.</p>
                </div>
              </div>
              <button className="px-4 py-2 rounded-xl bg-status-danger-bg text-status-danger font-label-md text-label-md hover:bg-red-100 transition-colors self-start sm:self-auto flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">logout</span>
                Putuskan Semua Sesi Lain
              </button>
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="p-4 rounded-xl bg-surface-canvas border border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[24px]">laptop_mac</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-label-lg text-label-lg text-on-surface">MacBook Air M2 — Dewi Astuti (Owner)</span>
                      <span className="px-2 py-0.5 rounded-full bg-status-success-bg text-status-success font-label-sm text-label-sm font-bold border border-status-success/20">Perangkat Ini</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-secondary font-body-sm text-body-sm mt-0.5">
                      <span className="inline-flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">location_on</span> Jakarta Selatan
                      </span>
                      <span>•</span>
                      <span>Google Chrome • macOS Sonoma</span>
                      <span>•</span>
                      <span className="text-status-success font-semibold">Sedang Aktif</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-card border border-border-subtle text-primary font-label-sm text-label-sm shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span> Sesi Utama
                  </span>
                </div>
              </div>
              
              <div className="p-4 rounded-xl bg-surface-canvas border border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-surface-container-high flex items-center justify-center text-teal-accent shrink-0">
                    <span className="material-symbols-outlined text-[24px]">tablet_android</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-label-lg text-label-lg text-on-surface">POS Register 01 — Kasir Meja Depan</span>
                      <span className="px-2 py-0.5 rounded-full bg-status-info-bg border border-status-info/20 text-status-info font-label-sm text-label-sm font-semibold">Samsung Tab S9</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-secondary font-body-sm text-body-sm mt-0.5">
                      <span className="inline-flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">storefront</span> Cabang Jakarta Barat
                      </span>
                      <span>•</span>
                      <span>Smartbook POS v3.4.1 (Dedicated App)</span>
                      <span>•</span>
                      <span className="text-status-success font-semibold">Sedang Aktif (Shift Pagi)</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button className="px-3 py-1.5 rounded-lg bg-surface-card border border-border-subtle text-status-danger hover:bg-status-danger-bg font-label-sm text-label-sm shadow-sm transition-colors">
                    Keluar Sesi
                  </button>
                </div>
              </div>
              
              <div className="p-4 rounded-xl bg-surface-canvas border border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-surface-container-high flex items-center justify-center text-secondary shrink-0">
                    <span className="material-symbols-outlined text-[24px]">smartphone</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-label-lg text-label-lg text-on-surface">POS Mobile 02 — Waiter Siti Aminah</span>
                      <span className="px-2 py-0.5 rounded-full bg-surface-container-low text-secondary font-label-sm text-label-sm">iPhone 13</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-secondary font-body-sm text-body-sm mt-0.5">
                      <span className="inline-flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">wifi</span> WiFi Toko Berkah 5G
                      </span>
                      <span>•</span>
                      <span>Smartbook Waiter App</span>
                      <span>•</span>
                      <span>Aktif 12 menit lalu</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button className="px-3 py-1.5 rounded-lg bg-surface-card border border-border-subtle text-status-danger hover:bg-status-danger-bg font-label-sm text-label-sm shadow-sm transition-colors">
                    Keluar Sesi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="bg-surface-card rounded-2xl p-6 shadow-sm border border-border-subtle flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">security</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">Verifikasi 2FA</h3>
                  <span className="font-label-sm text-label-sm text-status-success font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-status-success"></span> Aktif & Terlindungi
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-status-success text-[24px]">check_circle</span>
            </div>
            <p className="font-body-sm text-body-sm text-secondary">
              Setiap login dari perangkat baru mewajibkan kode 6-digit dari aplikasi authenticator untuk melindungi data finansial toko.
            </p>
            
            <div className="p-4 rounded-xl bg-surface-canvas border border-border-subtle flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">phone_android</span>
                  <span className="font-label-md text-label-md text-on-surface">Google Authenticator</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm font-semibold">Utama</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[20px]">sms</span>
                  <span className="font-label-md text-label-md text-on-surface">SMS OTP (+62 812-****-8890)</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-surface-container-low text-secondary font-label-sm text-label-sm">Cadangan</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 pt-1">
              <button className="w-full py-2.5 rounded-xl bg-surface-canvas border border-border-subtle hover:bg-slate-50 text-on-surface font-label-md text-label-md transition-colors flex items-center justify-center gap-2 shadow-sm">
                <span className="material-symbols-outlined text-[18px] text-primary">key</span>
                Kelola Kunci Cadangan (Backup Codes)
              </button>
              <button className="w-full py-2.5 rounded-xl bg-surface-card border border-border-subtle hover:bg-surface-canvas text-secondary font-label-md text-label-md transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px]">cached</span>
                Pindahkan ke HP Baru
              </button>
            </div>
          </div>
          
          <div className="bg-surface-card rounded-2xl p-6 shadow-sm border border-border-subtle flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-surface-container-high text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">badge</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">Akses Peran & Staf</h3>
                  <p className="font-body-sm text-body-sm text-secondary">4 Staf Aktif Terdaftar</p>
                </div>
              </div>
              <button className="p-1.5 rounded-lg text-primary hover:bg-primary-fixed transition-colors">
                <span className="material-symbols-outlined text-[20px]">person_add</span>
              </button>
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-canvas border border-border-subtle">
                <div className="flex items-center gap-3">
                  <img className="w-9 h-9 rounded-full object-cover" alt="Dewi Astuti" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDR3p40t2DUe9GOcZ9-dTa9NXvSgH1YHj7SrPZKz6itCN_KvoGN5hh-Dihk1yZN08x6SMLo_SrTy1Z0nrm3S6vFyddseZTkmVgkTkYym_PnD6wuSh6Cz8HKbYGoPSwCG9GlPsqbjLIQCs5Av4w9O3r4xMrBU4fgxkxP_MxsIy1dLvydqUS6i9-ve1uGTQUqP_gXDdG3y__GbqPm2xlRCqKCrK-2wCOnrQni6m53eQ7vMmRNAqX2AtyE" />
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface">Dewi Astuti</span>
                    <span className="font-body-sm text-body-sm text-secondary">Owner • Akses Penuh</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-primary/15 text-primary font-label-sm text-label-sm font-bold border border-primary/20">Admin</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-canvas border border-border-subtle">
                <div className="flex items-center gap-3">
                  <img className="w-9 h-9 rounded-full object-cover" alt="Budi Santoso" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6WpTZD9GafiYBorE6vYu10T0d4zr1kixCpM3rPNHANDNb0MfKgdVbRKWbkhFYnWQ6Aho-kdGtYjjumVoMeX7jSbq8irm0kJOuAdSQdcapyb7VlqHzxQ2lytEWh5qIwwdyE_5yxucqEiRBMNnCvpsRiZUIX73k8cOc0G4XcQltHiBQISrnecQ64dcqv8gF4DKS-oe5ttgU78QRij582AtBhSikHHPIsuvS16x68d1Uhk3VoYFBJrvV" />
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface">Budi Santoso</span>
                    <span className="font-body-sm text-body-sm text-secondary">Supervisor Toko</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-status-info-bg border border-status-info/20 text-status-info font-label-sm text-label-sm font-semibold">PIN Void</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-canvas border border-border-subtle">
                <div className="flex items-center gap-3">
                  <img className="w-9 h-9 rounded-full object-cover" alt="Siti Aminah" src="https://lh3.googleusercontent.com/aida-public/AB6AXuASdSs5t1UfVM7g88XJ6SiC-KyEavBEZY8QsYUotx0Mzq5fP2gMW_77K2DwfSGQSEQLRWnpTMX9U3Xilsw-I4qw7O2JRtLbe742Xgqm65eaY-2QbrdCPig7zNAU6nnZ_nFKmwdVZ-nKaRoarBvX07cuuuJu5I2rzcrK8roZUpkk4sLa1wF5uz0iafWInRHVyCjVT7nMAblceOde2EEf23MkN_zT0qCj4WGC8_a3sj6eG8rbBemLdVSk" />
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface">Siti Aminah</span>
                    <span className="font-body-sm text-body-sm text-secondary">Kasir & Waiter</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-surface-container-low text-secondary font-label-sm text-label-sm border border-border-subtle">Kasir Saja</span>
              </div>
            </div>
            
            <button className="w-full py-2.5 rounded-xl bg-surface-canvas border border-border-subtle hover:bg-slate-50 text-on-surface font-label-md text-label-md transition-colors text-center mt-1">
              Kelola Matriks Hak Akses Staf
            </button>
          </div>
          
          <div className="bg-surface-card rounded-2xl p-6 shadow-sm border border-border-subtle flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-surface-canvas text-secondary flex items-center justify-center border border-border-subtle">
                  <span className="material-symbols-outlined text-[20px]">policy</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">Log Aktivitas Audit</h3>
                  <p className="font-body-sm text-body-sm text-secondary">Peristiwa keamanan terbaru</p>
                </div>
              </div>
              <button className="text-primary hover:underline font-label-sm text-label-sm">Lihat Semua</button>
            </div>
            
            <div className="relative flex flex-col gap-4 mt-2">
              <div className="flex items-start gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-status-success mt-1.5 shrink-0"></div>
                <div className="flex flex-col flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md text-on-surface">Login Berhasil (2FA Terverifikasi)</span>
                    <span className="font-body-sm text-body-sm text-secondary">10:14 WIB</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-secondary">Dewi Astuti via MacBook Air M2 (IP: 180.252.71.4)</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-status-warning mt-1.5 shrink-0"></div>
                <div className="flex flex-col flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md text-on-surface">Void Transaksi #TRX-0032</span>
                    <span className="font-body-sm text-body-sm text-secondary">09:40 WIB</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-secondary">Diotorisasi PIN Supervisor Budi Santoso di POS Register 01</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-status-info mt-1.5 shrink-0"></div>
                <div className="flex flex-col flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md text-on-surface">Perubahan Harga Menu Produk</span>
                    <span className="font-body-sm text-body-sm text-secondary">Kemarin</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-secondary">Owner mengubah harga SKU-104 (Kopi Aren Latte) Rp 18k → Rp 20k</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-status-danger mt-1.5 shrink-0"></div>
                <div className="flex flex-col flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md text-on-surface">Percobaan PIN Salah 3x Ditolak</span>
                    <span className="font-body-sm text-body-sm text-secondary">2 Feb 2025</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-secondary">Upaya pembukaan cash drawer manual pada POS Mobile 02 diblokir.</p>
                </div>
              </div>
            </div>
            
            <div className="p-3.5 mt-2 rounded-xl bg-status-success-bg border border-status-success/20 flex items-start gap-3">
              <span className="material-symbols-outlined text-status-success text-[20px]">encrypted</span>
              <p className="font-body-sm text-body-sm text-teal-900 leading-snug">
                Log diaudit secara berkala dan terenkripsi HMAC-SHA256 sesuai standar regulasi Bank Indonesia.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
