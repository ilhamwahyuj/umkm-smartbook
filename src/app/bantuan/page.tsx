"use client";

import { useState, useEffect } from "react";
import { useOrgStore } from "@/stores/useOrgStore";
import { AppShell } from "@/components/layout/AppShell";
import { createClient } from "@/lib/supabase/client";

export default function PusatBantuanPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isLiveChatOpen, setIsLiveChatOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const hasMember = useOrgStore.getState().currentMember !== null;
      
      if (user || (document.cookie.includes("demo_mode=true") && hasMember)) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);
  
  // Live Chat State
  const [chatMessages, setChatMessages] = useState<{sender: "user" | "agent", text: string}[]>([
    {
      sender: "agent",
      text: "Halo Bu Dewi! Ada kendala operasional kasir atau printer yang perlu kami bantu cek sekarang?"
    }
  ]);
  const [chatInput, setChatInput] = useState("");

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!searchQuery) return;
    // Perform search logic here
    console.log("Searching for:", searchQuery);
  };

  const fillSearch = (query: string) => {
    setSearchQuery(query);
    // document.getElementById('search-input')?.focus(); // Optional
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Tiket bantuan teknis berhasil dibuat dengan nomor tiket #SB-9821. Tim kami segera merespons.');
    setIsTicketModalOpen(false);
  };

  const sendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    // Add user message
    setChatMessages(prev => [...prev, { sender: "user", text: chatInput }]);
    setChatInput("");

    // Simulate agent reply after a delay
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        sender: "agent",
        text: "Baik Bu, tim kami sedang memeriksa koneksi hardware Anda. Mohon tunggu sebentar ya..."
      }]);
    }, 900);
  };

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        document.getElementById('search-input')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const content = (
    <div className={isAuthenticated ? "flex flex-col w-full" : "min-h-screen bg-slate-50 flex flex-col w-full p-6 lg:p-12"}>
      <div className="max-w-[1440px] w-full mx-auto space-y-10">
        {/* Back Button */}
        <div className="flex items-center">
          <a href={isAuthenticated ? "/dashboard" : "/login"} className="inline-flex items-center gap-2 text-teal-700 hover:text-teal-800 font-semibold text-sm transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            {isAuthenticated ? "Kembali ke Dashboard" : "Kembali ke Login"}
          </a>
        </div>
        
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-xl bg-surface-sidebar p-8 lg:p-12 text-on-primary shadow-xl">
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-primary/20 blur-3xl pointer-events-none"></div>
          <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-teal-accent/20 blur-2xl pointer-events-none"></div>
          
          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container text-on-primary font-label-sm text-[11px] font-semibold tracking-[0.04em]">
              <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>support_agent</span>
              <span>Dukungan Teknis & Kasir UMKM 24/7</span>
            </div>
            
            <div className="space-y-2">
              <h1 className="font-headline-xl text-[36px] font-bold leading-[44px] tracking-[-0.02em] text-white">
                Pusat Bantuan & Layanan Pelanggan UMKM Smartbook
              </h1>
              <p className="font-body-lg text-[16px] font-normal leading-[24px] text-slate-300 max-w-2xl">
                Temukan panduan cepat operasional kasir POS, buku kas, troubleshooting printer struk, atau hubungi agen spesialis kami 24/7.
              </p>
            </div>
            
            <div className="relative w-full max-w-2xl pt-2">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center shadow-lg rounded-xl overflow-hidden bg-surface-card text-on-surface">
                <span className="material-symbols-outlined absolute left-4 text-secondary text-2xl">search</span>
                <input 
                  id="search-input"
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ketik kendala Anda, misal: printer thermal tidak konek, cara void transaksi..." 
                  className="w-full pl-12 pr-32 py-4 bg-transparent font-body-md text-[14px] leading-[20px] text-on-surface placeholder:text-outline focus:outline-none"
                />
                <div className="absolute right-2 flex items-center gap-2">
                  <span className="hidden sm:inline-block px-2 py-1 rounded bg-surface-canvas text-secondary font-label-sm text-[11px] font-semibold tracking-[0.04em]">⌘K / Ctrl+K</span>
                  <button type="submit" className="px-4 py-2 bg-primary-container hover:bg-primary text-white rounded-lg font-label-md text-[12px] font-semibold tracking-[0.02em] transition-colors flex items-center gap-1.5">
                    <span>Cari</span>
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </button>
                </div>
              </form>
              
              <div className="flex flex-wrap items-center gap-2 mt-3 text-slate-400 font-label-sm text-[11px] font-semibold tracking-[0.04em]">
                <span>Sering dicari:</span>
                <button onClick={() => fillSearch('Printer Bluetooth terputus')} className="hover:text-primary-fixed underline transition-colors">Printer Bluetooth terputus</button>
                <span>•</span>
                <button onClick={() => fillSearch('Void transaksi kasir')} className="hover:text-primary-fixed underline transition-colors">Void transaksi kasir</button>
                <span>•</span>
                <button onClick={() => fillSearch('Settlement QRIS')} className="hover:text-primary-fixed underline transition-colors">Settlement QRIS</button>
                <span>•</span>
                <button onClick={() => fillSearch('Hak akses staf')} className="hover:text-primary-fixed underline transition-colors">Hak akses staf</button>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* WhatsApp Card */}
          <div className="bg-surface-card rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group border border-slate-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-status-success-bg text-status-success flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-status-success-bg text-status-success font-label-sm text-[11px] font-semibold tracking-[0.04em]">Respon &lt; 5 Menit</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-[18px] font-semibold leading-[24px] text-on-surface">WhatsApp CS Prioritas</h3>
                <p className="font-body-md text-[14px] leading-[20px] text-secondary mt-1">Konsultasi cepat langsung dengan tim spesialis kasir & setup alat toko.</p>
              </div>
              <div className="bg-surface-canvas p-3 rounded-lg flex items-center justify-between">
                <span className="font-tabular-numeric text-[14px] font-semibold leading-[20px] text-on-surface font-mono">+62 811-9876-5432</span>
                <span className="material-symbols-outlined text-slate-400 text-sm">verified</span>
              </div>
            </div>
            <div className="pt-6">
              <a href="https://wa.me/6281198765432" target="_blank" rel="noreferrer" className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-status-success text-white font-label-lg text-[14px] font-semibold tracking-[0.01em] rounded-xl hover:opacity-95 active:scale-[0.99] transition-all shadow-sm">
                <span className="material-symbols-outlined text-lg">forum</span>
                <span>Hubungi via WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Live Chat Card */}
          <div className="bg-surface-card rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group border border-slate-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-status-info-bg text-status-info flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>forum</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-status-success-bg text-status-success font-label-sm text-[11px] font-semibold tracking-[0.04em]">
                  <span className="w-2 h-2 rounded-full bg-status-success animate-pulse"></span>
                  <span>Online • 3 Operator</span>
                </div>
              </div>
              <div>
                <h3 className="font-headline-sm text-[18px] font-semibold leading-[24px] text-on-surface">Live Chat Interaktif</h3>
                <p className="font-body-md text-[14px] leading-[20px] text-secondary mt-1">Obrolan langsung di dalam sistem kasir POS tanpa keluar dari aplikasi.</p>
              </div>
              <div className="flex items-center gap-3 bg-surface-canvas p-2.5 rounded-lg">
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 rounded-full bg-primary-container text-white flex items-center justify-center text-[10px] font-bold ring-2 ring-surface-card">DA</div>
                  <div className="w-7 h-7 rounded-full bg-teal-accent text-white flex items-center justify-center text-[10px] font-bold ring-2 ring-surface-card">RF</div>
                  <div className="w-7 h-7 rounded-full bg-surface-sidebar text-white flex items-center justify-center text-[10px] font-bold ring-2 ring-surface-card">BP</div>
                </div>
                <span className="font-body-sm text-[12px] leading-[16px] text-secondary">Rata-rata balasan: 45 detik</span>
              </div>
            </div>
            <div className="pt-6">
              <button onClick={() => setIsLiveChatOpen(true)} className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-primary-container text-white font-label-lg text-[14px] font-semibold tracking-[0.01em] rounded-xl hover:bg-primary active:scale-[0.99] transition-all shadow-sm">
                <span className="material-symbols-outlined text-lg">bolt</span>
                <span>Mulai Percakapan</span>
              </button>
            </div>
          </div>

          {/* Ticket Card */}
          <div className="bg-surface-card rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group border border-slate-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>confirmation_number</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-surface-canvas text-secondary font-label-sm text-[11px] font-semibold tracking-[0.04em]">SLA &lt; 24 Jam</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-[18px] font-semibold leading-[24px] text-on-surface">Tiket Kendala Teknis</h3>
                <p className="font-body-md text-[14px] leading-[20px] text-secondary mt-1">Eskalasi masalah bug, sinkronisasi cloud offline, atau kerusakan modul EDC.</p>
              </div>
              <div className="bg-surface-canvas p-3 rounded-lg flex items-center justify-between">
                <span className="font-label-md text-[12px] font-semibold tracking-[0.02em] text-secondary">Tiket aktif Anda:</span>
                <span className="font-label-md text-[12px] font-semibold tracking-[0.02em] text-status-warning bg-status-warning-bg px-2 py-0.5 rounded-full">0 Kendala</span>
              </div>
            </div>
            <div className="pt-6">
              <button onClick={() => setIsTicketModalOpen(true)} className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-surface-sidebar text-white font-label-lg text-[14px] font-semibold tracking-[0.01em] rounded-xl hover:bg-slate-800 active:scale-[0.99] transition-all shadow-sm">
                <span className="material-symbols-outlined text-lg">add_circle</span>
                <span>Buat Tiket Baru</span>
              </button>
            </div>
          </div>
        </div>

        {/* Knowledge Base */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-label-sm text-[11px] font-semibold tracking-[0.04em] uppercase text-teal-accent">Knowledge Base</span>
              <h2 className="font-headline-md text-[22px] font-semibold leading-[28px] text-on-surface tracking-tight mt-1">Kategori Panduan Praktis Kasir & Pemilik</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-body-sm text-[12px] leading-[16px] text-secondary">Total 48 artikel panduan terverifikasi</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Kategori 1 */}
            <div className="bg-surface-card rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group border border-slate-200">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-surface-canvas group-hover:bg-primary-container group-hover:text-white transition-colors text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">point_of_sale</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-headline-sm text-[18px] font-semibold leading-[24px] text-on-surface">1. Memulai & POS</h3>
                  <p className="font-body-md text-[14px] leading-[20px] text-secondary">Panduan setup pertama kali, tambah katalog menu, buka modal kasir, dan penutupan shift.</p>
                </div>
                <ul className="space-y-2 pt-2">
                  <li className="flex items-center gap-2 text-secondary hover:text-primary font-body-sm text-[12px] leading-[16px] cursor-pointer">
                    <span className="material-symbols-outlined text-xs text-primary">arrow_forward</span>
                    <span className="truncate">Cara input modal awal kasir harian</span>
                  </li>
                  <li className="flex items-center gap-2 text-secondary hover:text-primary font-body-sm text-[12px] leading-[16px] cursor-pointer">
                    <span className="material-symbols-outlined text-xs text-primary">arrow_forward</span>
                    <span className="truncate">Import massal produk via Excel</span>
                  </li>
                  <li className="flex items-center gap-2 text-secondary hover:text-primary font-body-sm text-[12px] leading-[16px] cursor-pointer">
                    <span className="material-symbols-outlined text-xs text-primary">arrow_forward</span>
                    <span className="truncate">Format cetak pesanan untuk kitchen printer</span>
                  </li>
                </ul>
              </div>
              <div className="pt-6">
                <button className="font-label-md text-[12px] font-semibold tracking-[0.02em] text-primary hover:text-teal-accent flex items-center gap-1">
                  <span>Buka 14 Dokumen</span>
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>

            {/* Kategori 2 */}
            <div className="bg-surface-card rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group border border-slate-200">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-surface-canvas group-hover:bg-primary-container group-hover:text-white transition-colors text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">print</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-headline-sm text-[18px] font-semibold leading-[24px] text-on-surface">2. Hardware & Thermal</h3>
                  <p className="font-body-md text-[14px] leading-[20px] text-secondary">Solusi Bluetooth macet, cetak struk bergaris/buram, laci kas (cash drawer) tidak otomatis membuka.</p>
                </div>
                <ul className="space-y-2 pt-2">
                  <li className="flex items-center gap-2 text-secondary hover:text-primary font-body-sm text-[12px] leading-[16px] cursor-pointer">
                    <span className="material-symbols-outlined text-xs text-primary">arrow_forward</span>
                    <span className="truncate">Setting ukuran kertas 58mm & 80mm</span>
                  </li>
                  <li className="flex items-center gap-2 text-secondary hover:text-primary font-body-sm text-[12px] leading-[16px] cursor-pointer">
                    <span className="material-symbols-outlined text-xs text-primary">arrow_forward</span>
                    <span className="truncate">Pairing ulang Bluetooth EDC Android</span>
                  </li>
                  <li className="flex items-center gap-2 text-secondary hover:text-primary font-body-sm text-[12px] leading-[16px] cursor-pointer">
                    <span className="material-symbols-outlined text-xs text-primary">arrow_forward</span>
                    <span className="truncate">Barcode scanner USB tidak terbaca</span>
                  </li>
                </ul>
              </div>
              <div className="pt-6">
                <button className="font-label-md text-[12px] font-semibold tracking-[0.02em] text-primary hover:text-teal-accent flex items-center gap-1">
                  <span>Buka 11 Dokumen</span>
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>

            {/* Kategori 3 */}
            <div className="bg-surface-card rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group border border-slate-200">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-surface-canvas group-hover:bg-primary-container group-hover:text-white transition-colors text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">account_balance</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-headline-sm text-[18px] font-semibold leading-[24px] text-on-surface">3. Laporan & Pembukuan</h3>
                  <p className="font-body-md text-[14px] leading-[20px] text-secondary">Penghitungan HPP otomatis, rekonsiliasi kas riil, laporan laba kotor vs laba bersih, ekspor CSV pajak.</p>
                </div>
                <ul className="space-y-2 pt-2">
                  <li className="flex items-center gap-2 text-secondary hover:text-primary font-body-sm text-[12px] leading-[16px] cursor-pointer">
                    <span className="material-symbols-outlined text-xs text-primary">arrow_forward</span>
                    <span className="truncate">Perbedaan omzet bruto dan neto</span>
                  </li>
                  <li className="flex items-center gap-2 text-secondary hover:text-primary font-body-sm text-[12px] leading-[16px] cursor-pointer">
                    <span className="material-symbols-outlined text-xs text-primary">arrow_forward</span>
                    <span className="truncate">Cara catat pengeluaran kas operasional</span>
                  </li>
                  <li className="flex items-center gap-2 text-secondary hover:text-primary font-body-sm text-[12px] leading-[16px] cursor-pointer">
                    <span className="material-symbols-outlined text-xs text-primary">arrow_forward</span>
                    <span className="truncate">Ekspor laporan penjualan bulanan untuk SPT</span>
                  </li>
                </ul>
              </div>
              <div className="pt-6">
                <button className="font-label-md text-[12px] font-semibold tracking-[0.02em] text-primary hover:text-teal-accent flex items-center gap-1">
                  <span>Buka 13 Dokumen</span>
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>

            {/* Kategori 4 */}
            <div className="bg-surface-card rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group border border-slate-200">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-surface-canvas group-hover:bg-primary-container group-hover:text-white transition-colors text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">qr_code_scanner</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-headline-sm text-[18px] font-semibold leading-[24px] text-on-surface">4. QRIS & Keuangan</h3>
                  <p className="font-body-md text-[14px] leading-[20px] text-secondary">Jadwal pencairan saldo QRIS Dinamis (H+1/Real-Time), kelola hutang kasbon pelanggan, split payment.</p>
                </div>
                <ul className="space-y-2 pt-2">
                  <li className="flex items-center gap-2 text-secondary hover:text-primary font-body-sm text-[12px] leading-[16px] cursor-pointer">
                    <span className="material-symbols-outlined text-xs text-primary">arrow_forward</span>
                    <span className="truncate">Status transaksi QRIS 'Pending' vs 'Success'</span>
                  </li>
                  <li className="flex items-center gap-2 text-secondary hover:text-primary font-body-sm text-[12px] leading-[16px] cursor-pointer">
                    <span className="material-symbols-outlined text-xs text-primary">arrow_forward</span>
                    <span className="truncate">Batas limit transaksi QRIS per nota</span>
                  </li>
                  <li className="flex items-center gap-2 text-secondary hover:text-primary font-body-sm text-[12px] leading-[16px] cursor-pointer">
                    <span className="material-symbols-outlined text-xs text-primary">arrow_forward</span>
                    <span className="truncate">Pencatatan kasbon pelanggan & reminder WA</span>
                  </li>
                </ul>
              </div>
              <div className="pt-6">
                <button className="font-label-md text-[12px] font-semibold tracking-[0.02em] text-primary hover:text-teal-accent flex items-center gap-1">
                  <span>Buka 10 Dokumen</span>
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: FAQ & System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQ */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <span className="font-label-sm text-[11px] font-semibold tracking-[0.04em] uppercase text-teal-accent">Solusi Cepat</span>
              <h2 className="font-headline-md text-[22px] font-semibold leading-[28px] text-on-surface tracking-tight mt-1">FAQ Operasional Kasir Populer</h2>
              <p className="font-body-md text-[14px] leading-[20px] text-secondary mt-1">Jawaban langsung untuk pertanyaan paling sering diajukan kasir toko saat shift sibuk.</p>
            </div>
            
            <div className="space-y-3">
              {/* FAQ 1 */}
              <div className="bg-surface-card border border-slate-200 rounded-xl p-5 shadow-sm transition-all">
                <button 
                  onClick={() => toggleFaq(1)}
                  className="w-full flex items-center justify-between text-left font-headline-sm text-[18px] font-semibold leading-[24px] text-on-surface gap-4"
                >
                  <span className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">help_outline</span>
                    <span>Bagaimana cara melakukan settlement QRIS statis vs dinamis?</span>
                  </span>
                  <span className={`material-symbols-outlined text-secondary transition-transform duration-200 ${expandedFaq === 1 ? 'rotate-180' : ''}`}>expand_more</span>
                </button>
                {expandedFaq === 1 && (
                  <div className="pt-4 text-secondary font-body-md text-[14px] leading-[20px] space-y-2">
                    <p>Pada <strong>QRIS Dinamis Smartbook</strong>, settlement dana berjalan secara otomatis setiap pukul 23:59 WIB langsung ke rekening bank utama toko tanpa perlu kasir menekan tombol tutup batch manual.</p>
                    <p className="text-on-surface">Jika Anda menggunakan stiker <strong>QRIS Statis</strong> cetak manual di meja kasir, pastikan kasir memasukkan nomor referensi (RRN) 6-digit saat memilih opsi pembayaran Non-Tunai agar buku kas harian dapat tervalidasi secara presisi.</p>
                  </div>
                )}
              </div>

              {/* FAQ 2 */}
              <div className="bg-surface-card border border-slate-200 rounded-xl p-5 shadow-sm transition-all">
                <button 
                  onClick={() => toggleFaq(2)}
                  className="w-full flex items-center justify-between text-left font-headline-sm text-[18px] font-semibold leading-[24px] text-on-surface gap-4"
                >
                  <span className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">help_outline</span>
                    <span>Apa yang harus dilakukan jika printer Bluetooth kasir terputus saat transaksi ramai?</span>
                  </span>
                  <span className={`material-symbols-outlined text-secondary transition-transform duration-200 ${expandedFaq === 2 ? 'rotate-180' : ''}`}>expand_more</span>
                </button>
                {expandedFaq === 2 && (
                  <div className="pt-4 text-secondary font-body-md text-[14px] leading-[20px] space-y-2">
                    <ol className="list-decimal list-inside space-y-1.5">
                      <li>Buka menu cepat kasir di pojok kanan atas, klik tombol <strong>"Refresh Device"</strong>.</li>
                      <li>Matikan tombol power printer thermal selama 5 detik lalu nyalakan kembali hingga terdengar bunyi 'beep'.</li>
                      <li>Jika belum terhubung, transaksi tetap tersimpan aman di Cloud POS. Anda dapat membuka menu <strong>Transaksi Penjualan</strong> lalu tekan tombol <em>"Cetak Ulang Struk"</em> atau kirim struk instan ke nomor WhatsApp pelanggan.</li>
                    </ol>
                  </div>
                )}
              </div>

              {/* FAQ 3 */}
              <div className="bg-surface-card border border-slate-200 rounded-xl p-5 shadow-sm transition-all">
                <button 
                  onClick={() => toggleFaq(3)}
                  className="w-full flex items-center justify-between text-left font-headline-sm text-[18px] font-semibold leading-[24px] text-on-surface gap-4"
                >
                  <span className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">help_outline</span>
                    <span>Bagaimana cara membatalkan (void) pesanan yang salah ketik setelah kasir cetak struk?</span>
                  </span>
                  <span className={`material-symbols-outlined text-secondary transition-transform duration-200 ${expandedFaq === 3 ? 'rotate-180' : ''}`}>expand_more</span>
                </button>
                {expandedFaq === 3 && (
                  <div className="pt-4 text-secondary font-body-md text-[14px] leading-[20px] space-y-2">
                    <p>Fitur Void memerlukan PIN Supervisor / Owner untuk menjaga keamanan kasir. Langkah pembatalan:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Buka menu <strong>Transaksi Penjualan</strong> &gt; pilih nomor struk yang bersangkutan.</li>
                      <li>Klik tombol merah <strong>"Batalkan Transaksi (Void)"</strong>.</li>
                      <li>Masukkan 6-digit PIN Otoritas Owner, pilih alasan void (misal: Pesanan Dobel / Salah Harga).</li>
                      <li>Stok produk akan otomatis kembali ke inventaris dan neraca kasir shift tersebut dikoreksi seketika.</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* FAQ 4 */}
              <div className="bg-surface-card border border-slate-200 rounded-xl p-5 shadow-sm transition-all">
                <button 
                  onClick={() => toggleFaq(4)}
                  className="w-full flex items-center justify-between text-left font-headline-sm text-[18px] font-semibold leading-[24px] text-on-surface gap-4"
                >
                  <span className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">help_outline</span>
                    <span>Bagaimana cara menambah kasir baru tanpa memberi mereka akses melihat laporan laba bersih?</span>
                  </span>
                  <span className={`material-symbols-outlined text-secondary transition-transform duration-200 ${expandedFaq === 4 ? 'rotate-180' : ''}`}>expand_more</span>
                </button>
                {expandedFaq === 4 && (
                  <div className="pt-4 text-secondary font-body-md text-[14px] leading-[20px] space-y-2">
                    <p>Masuk ke menu <strong>Pengaturan Toko &gt; Kelola Staf & Kasir</strong>. Buat profil staf baru dengan role <strong>"Kasir Reguler"</strong>.</p>
                    <p>Role ini secara default hanya memiliki hak akses membuka register kasir, mencetak struk, dan melihat total penerimaan shift mereka sendiri, tanpa akses ke HPP, laba rugi bulanan, atau buku kas bank perusahaan.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="space-y-6">
            <div>
              <span className="font-label-sm text-[11px] font-semibold tracking-[0.04em] uppercase text-teal-accent">Real-Time Monitor</span>
              <h2 className="font-headline-md text-[22px] font-semibold leading-[28px] text-on-surface tracking-tight mt-1">Status Layanan Sistem</h2>
              <p className="font-body-md text-[14px] leading-[20px] text-secondary mt-1">Kesehatan infrastruktur cloud multi-tenant.</p>
            </div>
            
            <div className="bg-surface-card border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
              <div className="p-4 rounded-xl bg-status-success-bg flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-status-success shrink-0"></span>
                <div>
                  <p className="font-label-lg text-[14px] font-semibold tracking-[0.01em] text-status-success">Semua Sistem Cloud POS Berjalan Normal</p>
                  <p className="font-body-sm text-[12px] leading-[16px] text-emerald-800">Uptime 99.98% dalam 30 hari terakhir</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-surface-canvas">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-primary text-lg">cloud_done</span>
                    <span className="font-body-md text-[14px] leading-[20px] text-on-surface">Server Utama Cloud POS</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-status-success-bg text-status-success font-label-sm text-[11px] font-bold tracking-[0.04em]">OK (12ms)</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-surface-canvas">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-primary text-lg">sync</span>
                    <span className="font-body-md text-[14px] leading-[20px] text-on-surface">Sinkronisasi Offline to Online</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-status-success-bg text-status-success font-label-sm text-[11px] font-bold tracking-[0.04em]">Lancar</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-surface-canvas">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-primary text-lg">qr_code_2</span>
                    <span className="font-body-md text-[14px] leading-[20px] text-on-surface">Gateway QRIS & e-Wallet</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-status-success-bg text-status-success font-label-sm text-[11px] font-bold tracking-[0.04em]">OK</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-primary text-lg">mail</span>
                    <span className="font-body-md text-[14px] leading-[20px] text-on-surface">Notifikasi WhatsApp</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-status-success-bg text-status-success font-label-sm text-[11px] font-bold tracking-[0.04em]">Operasional</span>
                </div>
              </div>
              
              <div className="bg-surface-canvas rounded-lg p-3 text-center">
                <p className="font-body-sm text-[12px] leading-[16px] text-secondary">Pemeriksaan otomatis terakhir: <span className="font-semibold text-on-surface">1 menit lalu</span></p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary-container to-primary p-6 text-white shadow-md">
              <div className="relative z-10 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white">menu_book</span>
                </div>
                <h4 className="font-headline-sm text-[18px] font-semibold leading-[24px]">Unduh Panduan Kasir PDF</h4>
                <p className="font-body-sm text-[12px] leading-[16px] text-white/80">Panduan bergambar 1 lembar praktis untuk dicetak dan ditempel di meja kasir Anda.</p>
                <button className="w-full py-2.5 px-4 bg-white text-primary-container font-label-md text-[12px] font-semibold tracking-[0.02em] rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shadow">
                  <span className="material-symbols-outlined text-base">download</span>
                  <span>Unduh Cheat Sheet Kasir (1.8 MB)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Modal */}
      {isTicketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-surface-card rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-surface-canvas flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">confirmation_number</span>
                </div>
                <h3 className="font-headline-sm text-[18px] font-semibold leading-[24px] text-on-surface">Buat Tiket Bantuan Teknis</h3>
              </div>
              <button onClick={() => setIsTicketModalOpen(false)} className="text-secondary hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form className="space-y-4" onSubmit={handleTicketSubmit}>
              <div>
                <label className="block font-label-sm text-[11px] font-semibold tracking-[0.04em] text-secondary mb-1">Kategori Kendala</label>
                <select className="w-full px-3 py-2 bg-surface-card border border-slate-200 rounded-lg font-body-md text-[14px] leading-[20px] text-on-surface shadow-sm focus:outline-none focus:border-primary" required>
                  <option value="printer">Printer Thermal / Bluetooth Bermasalah</option>
                  <option value="qris">Kendala Settlement QRIS / Pembayaran</option>
                  <option value="laporan">Selisih Buku Kas & Laporan Finansial</option>
                  <option value="pos">Aplikasi POS Kasir Macet / Error</option>
                  <option value="lainnya">Pertanyaan Lainnya</option>
                </select>
              </div>
              
              <div>
                <label className="block font-label-sm text-[11px] font-semibold tracking-[0.04em] text-secondary mb-1">Judul Laporan</label>
                <input type="text" className="w-full px-3 py-2 bg-surface-card border border-slate-200 rounded-lg font-body-md text-[14px] leading-[20px] text-on-surface shadow-sm focus:outline-none focus:border-primary" placeholder="Contoh: Printer Bluetooth tidak deteksi kasir tablet" required />
              </div>
              
              <div>
                <label className="block font-label-sm text-[11px] font-semibold tracking-[0.04em] text-secondary mb-1">Detail Masalah & Kronologi</label>
                <textarea className="w-full px-3 py-2 bg-surface-card border border-slate-200 rounded-lg font-body-md text-[14px] leading-[20px] text-on-surface shadow-sm focus:outline-none focus:border-primary" placeholder="Jelaskan secara singkat kronologi kendala kasir Anda..." required rows={4}></textarea>
              </div>
              
              <div>
                <label className="block font-label-sm text-[11px] font-semibold tracking-[0.04em] text-secondary mb-1">Tingkat Urgensi</label>
                <div className="grid grid-cols-3 gap-2">
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-surface-canvas cursor-pointer hover:bg-slate-100 border border-slate-100">
                    <input type="radio" name="priority" value="low" defaultChecked className="text-primary focus:ring-0" />
                    <span className="font-body-sm text-[12px] leading-[16px]">Rendah</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-surface-canvas cursor-pointer hover:bg-slate-100 border border-slate-100">
                    <input type="radio" name="priority" value="medium" className="text-primary focus:ring-0" />
                    <span className="font-body-sm text-[12px] leading-[16px]">Sedang</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-surface-canvas cursor-pointer hover:bg-slate-100 border border-slate-100">
                    <input type="radio" name="priority" value="high" className="text-primary focus:ring-0" />
                    <span className="font-body-sm text-[12px] leading-[16px] text-status-danger font-semibold">Toko Macet</span>
                  </label>
                </div>
              </div>
              
              <div className="pt-4 flex items-center justify-end gap-3">
                <button type="button" onClick={() => setIsTicketModalOpen(false)} className="px-4 py-2 font-label-md text-[12px] font-semibold tracking-[0.02em] text-secondary hover:text-on-surface">Batal</button>
                <button type="submit" className="px-5 py-2.5 bg-primary-container hover:bg-primary text-white font-label-md text-[12px] font-semibold tracking-[0.02em] rounded-lg shadow-sm">Kirim Laporan Tiket</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Live Chat Drawer */}
      {isLiveChatOpen && (
        <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] bg-surface-card border border-slate-200 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden">
          <div className="bg-primary-container p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-teal-accent flex items-center justify-center font-bold text-white">CS</div>
                <span className="w-3 h-3 rounded-full bg-emerald-400 absolute bottom-0 right-0 ring-2 ring-primary-container"></span>
              </div>
              <div>
                <h4 className="font-headline-sm text-[18px] font-semibold leading-[24px] leading-tight">Bima - Smartbook Tech</h4>
                <p className="font-body-sm text-[12px] leading-[16px] text-emerald-100">Siap membantu kasir Anda</p>
              </div>
            </div>
            <button onClick={() => setIsLiveChatOpen(false)} className="text-white/80 hover:text-white">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          
          <div className="h-80 overflow-y-auto p-4 space-y-3 bg-surface-canvas">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                {msg.sender === 'agent' && (
                  <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">CS</div>
                )}
                <div className={`p-3 rounded-xl shadow-sm max-w-[80%] font-body-sm text-[12px] leading-[16px] ${
                  msg.sender === 'user' 
                    ? 'bg-primary text-white rounded-tr-none' 
                    : 'bg-surface-card text-on-surface rounded-tl-none border border-slate-100'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-3 bg-surface-card border-t border-slate-100">
            <form onSubmit={sendChatMessage} className="flex items-center gap-2">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ketik balasan Anda..." 
                className="flex-1 bg-surface-canvas border border-slate-200 rounded-lg px-3 py-2 font-body-sm text-[12px] leading-[16px] text-on-surface focus:outline-none focus:border-primary" 
              />
              <button type="submit" className="p-2 bg-primary-container text-white rounded-lg hover:bg-primary">
                <span className="material-symbols-outlined text-lg leading-none">send</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  return isAuthenticated ? <AppShell>{content}</AppShell> : content;
}
