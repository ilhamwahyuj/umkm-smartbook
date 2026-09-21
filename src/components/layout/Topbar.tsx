"use client";
// src/components/layout/Topbar.tsx
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useOrgStore } from "@/stores/useOrgStore";

interface TopbarProps {
  onMobileMenuOpen?: () => void;
}

export function Topbar({ onMobileMenuOpen }: TopbarProps) {
  const router = useRouter();
  const { currentOrg, clearOrg } = useOrgStore();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    clearOrg();
    router.push("/login");
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-xl border-b border-slate-100 z-50 px-4 md:px-5 flex items-center justify-between shadow-[0_1px_8px_rgba(15,23,42,0.04)]">
        {/* Brand / Logo Area */}
        <div className="flex items-center gap-2 md:gap-3 md:w-60 shrink-0">
          <img alt="UMKM Smartbook Logo" className="h-8 md:h-9 w-auto md:w-9 rounded-xl object-contain shadow-sm" src="https://lh3.googleusercontent.com/aida/AEtjO1Uz3vAnmdHlHf41lmjS9naWxuBCdj3hFYHuQagxYPGvwm1WAabGE52pdmtzkmmNNbuXKLyozvGw7y3mXhvLwWfnS6_psYIqShQjZyvBG1o-Rhb3iwz70jPKLRAJDf7enk6n8lM9EhoSbaNAB4l-pMVSQrjh3DgMIILlRih86hZSadfNcfDg-qM0GJBFDVBAOU7B6jMVKjONxo8L6B1KjhJupeeVLHPV-hRc15toYkU"/>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1 md:gap-1.5">
              <span className="text-[12px] md:text-base font-bold md:font-extrabold text-slate-900 tracking-tight leading-none truncate">Smartbook</span>
              <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-teal-50 text-teal-700 border border-teal-200">POS</span>
              <span className="md:hidden material-symbols-outlined text-[14px] text-teal-600 leading-none">verified</span>
            </div>
            {/* Mobile Context / Desktop Subtitle */}
            <span className="hidden md:block text-[10px] font-medium text-slate-400 mt-0.5">Multi-Tenant Cloud POS</span>
            <button className="md:hidden flex items-center gap-1 bg-teal-50 px-2 py-0.5 mt-1 rounded-full text-left max-w-[150px]" type="button">
              <span className="text-[10px] text-teal-700 truncate font-semibold">{currentOrg?.name || 'Toko Berkah'}</span>
              <span className="material-symbols-outlined text-[14px] text-teal-700 leading-none flex-shrink-0">expand_more</span>
            </button>
          </div>
        </div>
        
        {/* Quick Utilities: Search, Export, Notification, Options - DESKTOP ONLY */}
        <div className="hidden md:flex items-center gap-2.5 flex-1 max-w-xl mx-4">
          <div className="relative w-full max-w-xs">
            <button className="w-full flex items-center justify-between px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-full text-xs text-slate-400 transition-colors shadow-inner" type="button">
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[17px] text-slate-400">search</span>
                <span>Cari transaksi, SKU, menu...</span>
              </span>
              <span className="text-[10px] font-semibold bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-500 font-mono">Ctrl+K</span>
            </button>
          </div>
          <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-full text-xs font-semibold text-slate-700 transition-colors shadow-sm" type="button">
            <span className="material-symbols-outlined text-[16px] text-slate-500">download</span>
            <span>Export</span>
          </button>
          <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors" title="Opsi Lainnya" type="button">
            <span className="material-symbols-outlined text-lg">more_horiz</span>
          </button>
        </div>
        
        {/* Right Header Group: Lang, Date, User Role Profile */}
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <button className="hidden md:flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200" type="button">
            <span>ID 🇮🇩</span>
            <span className="material-symbols-outlined text-sm text-slate-400">expand_more</span>
          </button>
          
          <div className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
            <span className="material-symbols-outlined text-[16px] text-teal-600">calendar_today</span>
            <span>19 Januari 2026</span>
          </div>

          <button className="relative w-9 h-9 md:w-auto md:h-auto md:px-3 md:py-1.5 md:bg-emerald-50 hover:bg-slate-100 md:hover:bg-emerald-100 md:border md:border-emerald-200/60 rounded-full flex items-center justify-center gap-1.5 transition-colors" type="button">
            <span className="material-symbols-outlined text-[22px] md:text-[16px] text-slate-500 md:text-emerald-600">notifications</span>
            <span className="hidden md:inline text-xs font-semibold text-emerald-800">4 Perhatian</span>
            <span className="md:hidden absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
          </button>

          <div className="flex items-center gap-2 pl-1 md:pl-2 border-l border-slate-100 md:border-none">
            <img alt="Dewi Astuti" className="w-8 h-8 rounded-full object-cover ring-2 ring-teal-500/20 shadow-sm" src="https://lh3.googleusercontent.com/aida/AEtjO1U1jNXd4dTH-BaeE5gNTz0MPtChfkEECZJADdefY7Kz1s4VX58Jf5m9XLWnGdLUmzcS8sg6rQwItRs1JsCzn9ItaigsDrjVuLaXODy1FGaD3rfBzXjTFGSqdNl3J2G-noA8lMxAsEszZYqvLupuedlmzzeYy5bU24h_9xpDazald2xtczE413syM7znweJDebEKp2KjqV1ZEiPCxLX7c2Fzf8Bl_E30FrKTSrh21w75"/>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800 leading-tight">Dewi Astuti</span>
              <span className="text-[11px] font-medium text-teal-700">Owner • Kasir Utama</span>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
