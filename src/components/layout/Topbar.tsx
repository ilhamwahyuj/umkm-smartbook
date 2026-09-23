"use client";
// src/components/layout/Topbar.tsx
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useOrgStore } from "@/stores/useOrgStore";

interface TopbarProps {
  onMobileMenuOpen?: () => void;
}

const mockNotifications = [
  { id: 1, icon: "warning", color: "text-amber-600 bg-amber-50", title: "Stok Biji Kopi Arabika hampir habis", desc: "Sisa 4 Pcs — segera restock", time: "5 menit lalu", href: "/inventory", unread: true },
  { id: 2, icon: "receipt_long", color: "text-teal-600 bg-teal-50", title: "Transaksi TRX-10234 berhasil", desc: "Es Kopi Susu x3 — Rp 54.000", time: "12 menit lalu", href: "/transaksi/penjualan", unread: true },
  { id: 3, icon: "person_add", color: "text-blue-600 bg-blue-50", title: "Kasir baru login: Barista 2", desc: "Shift pagi dimulai", time: "1 jam lalu", href: "/pengaturan/pengguna", unread: false },
  { id: 4, icon: "trending_up", color: "text-emerald-600 bg-emerald-50", title: "Target penjualan harian tercapai!", desc: "Rp 35.4 juta dari target Rp 30 juta", time: "2 jam lalu", href: "/laporan", unread: false },
];

const quickLinks = [
  { icon: "point_of_sale", label: "Buka Kasir POS", href: "/kasir" },
  { icon: "inventory_2", label: "Stok & Opname", href: "/inventory" },
  { icon: "receipt_long", label: "Transaksi Penjualan", href: "/transaksi/penjualan" },
  { icon: "settings", label: "Pengaturan Toko", href: "/pengaturan" },
  { icon: "support_agent", label: "Pusat Bantuan", href: "/bantuan" },
];

export function Topbar({ onMobileMenuOpen }: TopbarProps) {
  const router = useRouter();
  const { currentOrg, clearOrg } = useOrgStore();
  const [showNotif, setShowNotif] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentLang, setCurrentLang] = useState("ID");
  const [currentDate, setCurrentDate] = useState("");

  const notifRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Live date
  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
      setCurrentDate(now.toLocaleDateString("id-ID", options));
    };
    updateDate();
    const interval = setInterval(updateDate, 60000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false);
      if (langRef.current && !langRef.current.contains(e.target as Node)) setShowLangMenu(false);
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setShowMoreMenu(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setShowUserMenu(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Ctrl+K search shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setShowSearch(true);
      }
      if (e.key === "Escape") {
        setShowSearch(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    clearOrg();
    router.push("/login");
  };

  const closeAll = () => {
    setShowNotif(false);
    setShowLangMenu(false);
    setShowMoreMenu(false);
    setShowUserMenu(false);
  };

  // Filter quick links by search
  const filteredLinks = searchQuery
    ? quickLinks.filter(l => l.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : quickLinks;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-xl border-b border-slate-100 z-50 px-4 md:px-5 flex items-center justify-between shadow-[0_1px_8px_rgba(15,23,42,0.04)]">
        {/* Brand / Logo Area */}
        <div className="flex items-center gap-2 md:gap-3 md:w-60 shrink-0">
          {onMobileMenuOpen && (
            <button 
              onClick={onMobileMenuOpen}
              className="md:hidden p-1 -ml-1 text-slate-500 hover:text-slate-800 rounded-md hover:bg-slate-100 transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>
          )}
          <img alt="UMKM Smartbook Logo" className="h-8 md:h-9 w-auto md:w-9 rounded-xl object-contain shadow-sm" src="https://lh3.googleusercontent.com/aida/AEtjO1Uz3vAnmdHlHf41lmjS9naWxuBCdj3hFYHuQagxYPGvwm1WAabGE52pdmtzkmmNNbuXKLyozvGw7y3mXhvLwWfnS6_psYIqShQjZyvBG1o-Rhb3iwz70jPKLRAJDf7enk6n8lM9EhoSbaNAB4l-pMVSQrjh3DgMIILlRih86hZSadfNcfDg-qM0GJBFDVBAOU7B6jMVKjONxo8L6B1KjhJupeeVLHPV-hRc15toYkU"/>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1 md:gap-1.5">
              <span className="text-[12px] md:text-base font-bold md:font-extrabold text-slate-900 tracking-tight leading-none truncate">Smartbook</span>
              <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-teal-50 text-teal-700 border border-teal-200">POS</span>
              <span className="md:hidden material-symbols-outlined text-[14px] text-teal-600 leading-none">verified</span>
            </div>
            {/* Mobile Context / Desktop Subtitle */}
            <span className="hidden md:block text-[10px] font-medium text-slate-400 mt-0.5">Multi-Tenant Cloud POS</span>
            <button 
              onClick={() => router.push('/pengaturan/profil-usaha')} 
              className="md:hidden flex items-center gap-1 bg-teal-50 px-2 py-0.5 mt-1 rounded-full text-left max-w-[150px]" 
              type="button"
            >
              <span className="text-[10px] text-teal-700 truncate font-semibold">{currentOrg?.name || 'Toko Berkah'}</span>
              <span className="material-symbols-outlined text-[14px] text-teal-700 leading-none flex-shrink-0">expand_more</span>
            </button>
          </div>
        </div>
        
        {/* Quick Utilities: Search, Export, More Options - DESKTOP ONLY */}
        <div className="hidden md:flex items-center gap-2.5 flex-1 max-w-xl mx-4">
          <div className="relative w-full max-w-xs">
            <button 
              onClick={() => { closeAll(); setShowSearch(true); }}
              className="w-full flex items-center justify-between px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-full text-xs text-slate-400 transition-colors shadow-inner" 
              type="button"
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[17px] text-slate-400">search</span>
                <span>Cari transaksi, SKU, menu...</span>
              </span>
              <span className="text-[10px] font-semibold bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-500 font-mono">Ctrl+K</span>
            </button>
          </div>
          <button 
            onClick={() => router.push('/laporan')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-full text-xs font-semibold text-slate-700 transition-colors shadow-sm" 
            type="button"
            title="Export data ke Laporan"
          >
            <span className="material-symbols-outlined text-[16px] text-slate-500">download</span>
            <span>Export</span>
          </button>
          {/* More Options Dropdown */}
          <div ref={moreRef} className="relative">
            <button 
              onClick={() => { setShowMoreMenu(!showMoreMenu); setShowNotif(false); setShowLangMenu(false); setShowUserMenu(false); }}
              className={`p-1.5 rounded-full transition-colors ${showMoreMenu ? 'text-teal-600 bg-teal-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
              title="Opsi Lainnya" 
              type="button"
            >
              <span className="material-symbols-outlined text-lg">more_horiz</span>
            </button>
            {showMoreMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                <p className="px-4 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Menu Cepat</p>
                {quickLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => { router.push(link.href); setShowMoreMenu(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-teal-700 transition-colors text-left"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px] text-slate-400">{link.icon}</span>
                    <span>{link.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Right Header Group: Lang, Date, Notifications, User Profile */}
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          {/* Language Dropdown */}
          <div ref={langRef} className="relative hidden md:block">
            <button 
              onClick={() => { setShowLangMenu(!showLangMenu); setShowNotif(false); setShowMoreMenu(false); setShowUserMenu(false); }}
              className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg border transition-colors ${showLangMenu ? 'text-teal-700 bg-teal-50 border-teal-200' : 'text-slate-600 hover:text-slate-900 bg-slate-50 border-slate-200'}`}
              type="button"
            >
              <span>{currentLang === "ID" ? "ID 🇮🇩" : "EN 🇬🇧"}</span>
              <span className={`material-symbols-outlined text-sm transition-transform ${showLangMenu ? 'rotate-180 text-teal-500' : 'text-slate-400'}`}>expand_more</span>
            </button>
            {showLangMenu && (
              <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 py-1.5 z-50">
                <button 
                  onClick={() => { setCurrentLang("ID"); setShowLangMenu(false); }}
                  className={`w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold transition-colors text-left ${currentLang === "ID" ? "text-teal-700 bg-teal-50" : "text-slate-600 hover:bg-slate-50"}`}
                  type="button"
                >
                  <span>🇮🇩</span>
                  <span>Bahasa Indonesia</span>
                  {currentLang === "ID" && <span className="material-symbols-outlined text-sm text-teal-600 ml-auto">check</span>}
                </button>
                <button 
                  onClick={() => { setCurrentLang("EN"); setShowLangMenu(false); }}
                  className={`w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold transition-colors text-left ${currentLang === "EN" ? "text-teal-700 bg-teal-50" : "text-slate-600 hover:bg-slate-50"}`}
                  type="button"
                >
                  <span>🇬🇧</span>
                  <span>English</span>
                  {currentLang === "EN" && <span className="material-symbols-outlined text-sm text-teal-600 ml-auto">check</span>}
                </button>
              </div>
            )}
          </div>
          
          {/* Live Date */}
          <div className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
            <span className="material-symbols-outlined text-[16px] text-teal-600">calendar_today</span>
            <span suppressHydrationWarning>{currentDate || '...'}</span>
          </div>

          {/* Notifications Dropdown */}
          <div ref={notifRef} className="relative">
            <button 
              onClick={() => { setShowNotif(!showNotif); setShowLangMenu(false); setShowMoreMenu(false); setShowUserMenu(false); }}
              className={`relative w-9 h-9 md:w-auto md:h-auto md:px-3 md:py-1.5 rounded-full flex items-center justify-center gap-1.5 transition-colors ${showNotif ? 'md:bg-emerald-100 bg-slate-100 md:border md:border-emerald-300' : 'md:bg-emerald-50 hover:bg-slate-100 md:hover:bg-emerald-100 md:border md:border-emerald-200/60'}`}
              type="button"
            >
              <span className="material-symbols-outlined text-[22px] md:text-[16px] text-slate-500 md:text-emerald-600">notifications</span>
              <span className="hidden md:inline text-xs font-semibold text-emerald-800">4 Perhatian</span>
              <span className="md:hidden absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
            </button>
            {showNotif && (
              <div className="absolute right-0 top-full mt-2 w-80 md:w-96 bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">Notifikasi</h4>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">4 Baru</span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {mockNotifications.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => { router.push(n.href); setShowNotif(false); }}
                      className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-50 last:border-0 ${n.unread ? 'bg-teal-50/30' : ''}`}
                      type="button"
                    >
                      <div className={`w-9 h-9 rounded-xl ${n.color} flex items-center justify-center shrink-0 mt-0.5`}>
                        <span className="material-symbols-outlined text-[18px]">{n.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 leading-tight">{n.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{n.desc}</p>
                        <p className="text-[10px] text-slate-400 mt-1 font-medium">{n.time}</p>
                      </div>
                      {n.unread && <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0 mt-2"></span>}
                    </button>
                  ))}
                </div>
                <div className="px-4 py-2.5 border-t border-slate-100">
                  <button
                    onClick={() => { router.push('/pengaturan/notif-stok'); setShowNotif(false); }}
                    className="w-full text-center text-xs font-bold text-teal-700 hover:text-teal-800 transition-colors py-1"
                    type="button"
                  >
                    Lihat Semua Notifikasi →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div ref={userRef} className="relative">
            <div className="flex items-center gap-2 pl-1 md:pl-2 border-l border-slate-100 md:border-none">
              <button
                onClick={() => { setShowUserMenu(!showUserMenu); setShowNotif(false); setShowLangMenu(false); setShowMoreMenu(false); }}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                type="button"
              >
                <img alt="Dewi Astuti" className={`w-8 h-8 rounded-full object-cover shadow-sm transition-all ${showUserMenu ? 'ring-2 ring-teal-500' : 'ring-2 ring-teal-500/20'}`} src="https://lh3.googleusercontent.com/aida/AEtjO1U1jNXd4dTH-BaeE5gNTz0MPtChfkEECZJADdefY7Kz1s4VX58Jf5m9XLWnGdLUmzcS8sg6rQwItRs1JsCzn9ItaigsDrjVuLaXODy1FGaD3rfBzXjTFGSqdNl3J2G-noA8lMxAsEszZYqvLupuedlmzzeYy5bU24h_9xpDazald2xtczE413syM7znweJDebEKp2KjqV1ZEiPCxLX7c2Fzf8Bl_E30FrKTSrh21w75"/>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-800 leading-tight">Dewi Astuti</span>
                  <span className="text-[11px] font-medium text-teal-700">Owner • Kasir Utama</span>
                </div>
              </button>
              <button 
                onClick={handleLogout}
                className="ml-1 md:ml-2 p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors flex items-center justify-center"
                title="Keluar"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
              </button>
            </div>
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 py-2 z-50">
                {/* User Info Header */}
                <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                  <img alt="Dewi Astuti" className="w-10 h-10 rounded-full object-cover ring-2 ring-teal-500/20" src="https://lh3.googleusercontent.com/aida/AEtjO1U1jNXd4dTH-BaeE5gNTz0MPtChfkEECZJADdefY7Kz1s4VX58Jf5m9XLWnGdLUmzcS8sg6rQwItRs1JsCzn9ItaigsDrjVuLaXODy1FGaD3rfBzXjTFGSqdNl3J2G-noA8lMxAsEszZYqvLupuedlmzzeYy5bU24h_9xpDazald2xtczE413syM7znweJDebEKp2KjqV1ZEiPCxLX7c2Fzf8Bl_E30FrKTSrh21w75"/>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Dewi Astuti</p>
                    <p className="text-[11px] text-teal-700 font-medium">Owner • Kasir Utama</p>
                  </div>
                </div>
                {/* Menu Items */}
                <button
                  onClick={() => { router.push('/pengaturan/profil-usaha'); setShowUserMenu(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-teal-700 transition-colors text-left"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px] text-slate-400">storefront</span>
                  <span>Profil Usaha</span>
                </button>
                <button
                  onClick={() => { router.push('/pengaturan/pengguna'); setShowUserMenu(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-teal-700 transition-colors text-left"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px] text-slate-400">manage_accounts</span>
                  <span>Kelola Pengguna</span>
                </button>
                <button
                  onClick={() => { router.push('/pengaturan/keamanan'); setShowUserMenu(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-teal-700 transition-colors text-left"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px] text-slate-400">shield_person</span>
                  <span>Keamanan</span>
                </button>
                <button
                  onClick={() => { router.push('/pengaturan'); setShowUserMenu(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-teal-700 transition-colors text-left"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px] text-slate-400">settings</span>
                  <span>Pengaturan Toko</span>
                </button>
                <div className="border-t border-slate-100 mt-1 pt-1">
                  <button
                    onClick={() => { setShowUserMenu(false); handleLogout(); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    <span>Keluar dari Akun</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* SEARCH OVERLAY / MODAL */}
      {showSearch && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh]">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { setShowSearch(false); setSearchQuery(""); }}></div>
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden mx-4">
            {/* Search Input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
              <span className="material-symbols-outlined text-[22px] text-teal-600">search</span>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari transaksi, SKU, menu..."
                className="flex-1 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none bg-transparent"
              />
              <button 
                onClick={() => { setShowSearch(false); setSearchQuery(""); }}
                className="text-[10px] font-semibold bg-slate-100 px-2 py-1 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-200 transition-colors"
                type="button"
              >
                ESC
              </button>
            </div>
            {/* Quick Links / Results */}
            <div className="py-2 max-h-72 overflow-y-auto">
              <p className="px-5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {searchQuery ? "Hasil Pencarian" : "Navigasi Cepat"}
              </p>
              {filteredLinks.length > 0 ? filteredLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => { router.push(link.href); setShowSearch(false); setSearchQuery(""); }}
                  className="w-full flex items-center gap-3 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-colors text-left"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px] text-slate-400">{link.icon}</span>
                  <span>{link.label}</span>
                  <span className="material-symbols-outlined text-[16px] text-slate-300 ml-auto">arrow_forward</span>
                </button>
              )) : (
                <div className="px-5 py-6 text-center">
                  <span className="material-symbols-outlined text-3xl text-slate-300">search_off</span>
                  <p className="text-xs text-slate-400 mt-2">Tidak ditemukan hasil untuk &quot;{searchQuery}&quot;</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
