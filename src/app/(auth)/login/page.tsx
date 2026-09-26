"use client";
// src/app/(auth)/login/page.tsx
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useOrgStore } from "@/stores/useOrgStore";

export default function LoginPage() {
  const router = useRouter();
  const { clearOrg } = useOrgStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clear stale state on mount
  useEffect(() => {
    document.cookie = "demo_mode=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "cashier_mode=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    clearOrg();
  }, [clearOrg]);

  // New states for form functionality
  const [orgId, setOrgId] = useState("toko.anda");
  const [pin, setPin] = useState("");
  const [branch, setBranch] = useState("Cabang Utama (Senopati, Jakarta Selatan)");
  const [rememberMe, setRememberMe] = useState(true);
  const [loginMode, setLoginMode] = useState<"owner" | "cashier">("owner");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      if (loginMode === "owner") {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) {
          if (authError.message.includes("Invalid login")) {
            setError("Email atau password salah. Coba lagi.");
          } else {
            setError(authError.message);
          }
          return;
        }
      } else {
        // Mode Kasir Login Logic (Supabase)
        if (pin.length !== 6) {
          setError("PIN harus 6 digit.");
          return;
        }

        // 1. Cek ID Organisasi / Gerai
        const { data: orgData, error: orgError } = await supabase
          .from("organizations")
          .select("id")
          .eq("slug", orgId)
          .single();

        if (orgError || !orgData) {
          setError("ID Organisasi / Gerai tidak ditemukan.");
          return;
        }

        // 2. Cek kecocokan PIN untuk kasir di cabang tersebut
        const { data: cashierData, error: cashierError } = await supabase
          .from("cashiers")
          .select("*")
          .eq("org_id", orgData.id)
          .eq("pin", pin)
          .eq("branch_name", branch)
          .single();

        if (cashierError || !cashierData) {
          setError("PIN kasir atau Cabang salah.");
          return;
        }

        // Login kasir berhasil
        document.cookie = `cashier_mode=true; path=/; max-age=86400; SameSite=Lax`;
        document.cookie = `cashier_id=${cashierData.id}; path=/; max-age=86400; SameSite=Lax`;
        document.cookie = `org_slug=${orgId}; path=/; max-age=86400; SameSite=Lax`;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setLoading(true);
    document.cookie = "demo_mode=true; path=/; max-age=86400; SameSite=Lax";
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 800);
  };

  return (
    <div className="min-h-screen text-slate-800 antialiased flex flex-col justify-between bg-[#F8F9FF] font-sans">
      {/* Top Simple Navigation Bar */}
      <header className="w-full max-w-[1440px] mx-auto px-6 lg:px-12 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-700 flex items-center justify-center text-white shadow-md shadow-teal-700/20">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              <path d="M12 6v6"></path>
              <path d="M9 9h6"></path>
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-slate-900">Smartbook</span>
              <span className="text-[11px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">POS Cloud</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Multi-Tenant Retail & Finance SaaS</p>
          </div>
        </div>

        {/* Right Header Utilities */}
        <div className="flex items-center gap-4 text-sm">
          <div className="hidden sm:flex items-center gap-2 text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-semibold">Server Cloud Aktif (99.9%)</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg shadow-sm font-medium">
            <span className="text-base leading-none">🇮🇩</span>
            <span>ID</span>
          </div>

          <Link href="/bantuan" className="text-xs font-semibold text-teal-700 hover:text-teal-800 transition-colors flex items-center gap-1">
            <span>Butuh bantuan CS?</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </Link>
        </div>
      </header>

      {/* Main Split Content Container */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 lg:px-12 py-4 lg:py-8 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden min-h-[640px]">
          
          {/* Left Column: Modern Hero Branding Showcase (5 cols) */}
          <div className="lg:col-span-5 p-8 lg:p-12 text-white flex flex-col justify-between h-full relative overflow-hidden"
               style={{ background: 'radial-gradient(circle at top left, #134e4a 0%, #0f766e 45%, #064e3b 100%)' }}>
            {/* Abstract Background Ornaments */}
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-emerald-400/15 rounded-full blur-2xl pointer-events-none"></div>

            {/* Top Badge in Hero */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-teal-200 mb-6">
                <svg className="w-3.5 h-3.5 text-teal-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span>Versi Cloud POS v3.4 Terenkripsi</span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight mb-4">
                Kelola Penjualan & Buku Kas Toko Makin Ringkas.
              </h1>
              <p className="text-sm lg:text-base text-teal-100 leading-relaxed font-normal">
                Satu portal terpadu untuk kasir POS gerai, kartu stok gudang, pembukuan laba rugi, dan integrasi QRIS dinamis.
              </p>
            </div>

            {/* Middle Testimonial / Proof Card */}
            <div className="relative z-10 my-8">
              <div className="rounded-2xl p-5 text-white/95" style={{ background: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex text-amber-300">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-teal-200">Dipercaya 12.000+ Gerai UMKM</span>
                </div>
                <p className="text-xs italic text-teal-50 mb-3 leading-relaxed">
                  "Rekonsiliasi tutup shift kasir biasanya butuh 1 jam, sekarang cukup 5 menit langsung klop dengan mutasi QRIS dan uang laci."
                </p>
                <div className="flex items-center justify-between text-xs border-t border-white/10 pt-2.5">
                  <span className="font-bold text-white">Kopi Berkah Nusantara</span>
                  <span className="text-teal-300">Cabang Senopati, Jaksel</span>
                </div>
              </div>
            </div>

            {/* Bottom Security Badges */}
            <div className="relative z-10 flex items-center justify-between text-xs text-teal-200 pt-4 border-t border-white/10">
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                <span>256-Bit SSL Enkripsi</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                <span>2FA & Proteksi PIN</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                <span>Multi-Tenant Aman</span>
              </div>
            </div>
          </div>

          {/* Right Column: Login Form & Mode Switcher (7 cols) */}
          <div className="lg:col-span-7 p-8 lg:p-14 flex flex-col justify-center">
            
            {/* Role Mode Switcher: Pemilik/Admin vs Kasir POS Cepat */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold tracking-wider uppercase text-slate-400">Pilih Mode Masuk</span>
                <span className="text-xs text-teal-700 font-semibold bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/60">Toko: Anda Group</span>
              </div>
              
              <div className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200/80">
                {/* Mode 1: Owner / Admin */}
                <button 
                  type="button" 
                  onClick={() => setLoginMode("owner")}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                    loginMode === "owner" 
                      ? "bg-white shadow-sm border border-slate-200/60 text-slate-900" 
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
                  }`}
                >
                  <svg className={`w-4 h-4 ${loginMode === "owner" ? "text-teal-700" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <span>Pemilik / Manajer</span>
                </button>
                
                {/* Mode 2: Quick Cashier PIN */}
                <button 
                  type="button" 
                  onClick={() => setLoginMode("cashier")}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-semibold text-xs sm:text-sm transition-all ${
                    loginMode === "cashier"
                      ? "bg-white shadow-sm border border-slate-200/60 text-slate-900 font-bold" 
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
                  }`}
                >
                  <svg className={`w-4 h-4 ${loginMode === "cashier" ? "text-teal-700" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
                  </svg>
                  <span>Terminal Kasir (PIN)</span>
                </button>
              </div>
            </div>

            {/* Form Heading */}
            <div className="mb-6">
              <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">Selamat Datang Kembali</h2>
              <p className="text-sm text-slate-500 mt-1">Masuk untuk memantau dashboard omzet, transaksi, dan stok barang.</p>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl mb-4">
                <span className="text-rose-500 text-sm">⚠️</span>
                <p className="text-rose-700 text-sm">{error}</p>
              </div>
            )}

            {/* Form Inputs */}
            <form className="space-y-4" onSubmit={handleLogin}>
              
              {/* Organization / Store Slug Input (Support Multi-Tenant) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>ID Organisasi / Gerai</span>
                  <span className="text-[11px] font-medium text-teal-700 lowercase">contoh: toko.anda</span>
                </label>
                <div className="relative rounded-xl border border-slate-300 focus-within:border-teal-700 focus-within:ring-2 focus-within:ring-teal-700/20 bg-slate-50/50 transition-all">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                  </div>
                  <input 
                    type="text" 
                    value={orgId}
                    onChange={(e) => setOrgId(e.target.value)}
                    className="w-full pl-11 pr-24 py-3 bg-transparent text-sm font-semibold text-slate-900 focus:outline-none" 
                    placeholder="ID Gerai Anda" 
                  />
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-xs text-slate-400 font-medium">
                    .smartbook.id
                  </div>
                </div>
              </div>

              {loginMode === "owner" ? (
                <>
                  {/* Email or Username Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email Akun Pemilik / Kasir
                    </label>
                    <div className="relative rounded-xl border border-slate-300 focus-within:border-teal-700 focus-within:ring-2 focus-within:ring-teal-700/20 bg-slate-50/50 transition-all">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206"></path></svg>
                      </div>
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required={loginMode === "owner"}
                        className="w-full pl-11 pr-4 py-3 bg-transparent text-sm font-medium text-slate-900 focus:outline-none" 
                        placeholder="nama@toko.com" 
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Kata Sandi
                      </label>
                      <Link href="/forgot-password" className="text-xs font-semibold text-teal-700 hover:text-teal-800 transition-colors">
                        Lupa sandi?
                      </Link>
                    </div>
                    <div className="relative rounded-xl border border-slate-300 focus-within:border-teal-700 focus-within:ring-2 focus-within:ring-teal-700/20 bg-slate-50/50 transition-all">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                      </div>
                      <input 
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required={loginMode === "owner"}
                        className="w-full pl-11 pr-11 py-3 bg-transparent text-sm font-medium text-slate-900 focus:outline-none" 
                        placeholder="Masukkan kata sandi" 
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                        )}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* Mode Kasir: PIN Input */
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      PIN Kasir (6 Digit)
                    </label>
                  </div>
                  <div className="relative rounded-xl border border-slate-300 focus-within:border-teal-700 focus-within:ring-2 focus-within:ring-teal-700/20 bg-slate-50/50 transition-all">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"></path></svg>
                    </div>
                    <input 
                      type="password" 
                      value={pin}
                      onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      required={loginMode === "cashier"}
                      className="w-full pl-11 pr-4 py-3 bg-transparent text-sm font-medium text-slate-900 focus:outline-none tracking-[0.5em]" 
                      placeholder="••••••" 
                    />
                  </div>
                </div>
              )}

              {/* Quick Outlet / Branch Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Pilih Cabang Masuk
                </label>
                <div className="relative">
                  <select 
                    className="w-full appearance-none pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 text-sm font-medium text-slate-800 focus:outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                  >
                    <option value="Cabang Utama (Senopati, Jakarta Selatan)">Cabang Utama (Senopati, Jakarta Selatan)</option>
                    <option value="Cabang 02 (Dago, Bandung)">Cabang 02 (Dago, Bandung)</option>
                    <option value="Semua Cabang (Akses Konsolidasi Owner)">Semua Cabang (Akses Konsolidasi Owner)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              {/* Remember Me & 2FA Notice */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-teal-700 focus:ring-teal-600 border-slate-300"
                  />
                  <span className="text-xs font-medium text-slate-600">Ingat perangkat ini selama 30 hari</span>
                </label>
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  2FA Siap
                </span>
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-lg shadow-teal-700/25 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <span>Masuk ke Dashboard Bisnis</span>
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </>
                  )}
                </button>
              </div>

              {/* Demo / Fast Cashier Switch */}
              <div className="pt-2">
                <button 
                  type="button" 
                  onClick={handleDemoLogin}
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                  <span>Masuk Cepat Mode Kasir POS Standalone (PIN 6 Digit)</span>
                </button>
              </div>

            </form>

            {/* Footer / Registration Link */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <p>Belum punya akun usaha? <Link href="/register" className="font-bold text-teal-700 hover:underline">Daftar UMKM Baru (Coba Gratis 14 Hari)</Link></p>
              <div className="flex items-center gap-3">
                <Link href="/privasi" className="hover:text-slate-700">Privasi</Link>
                <span>•</span>
                <Link href="/syarat-layanan" className="hover:text-slate-700">Syarat Layanan</Link>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Bottom Global Trust & Security Bar */}
      <footer className="w-full max-w-[1440px] mx-auto px-6 lg:px-12 py-5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
        <div className="flex items-center gap-4">
          <span>© 2026 PT Smartbook Digital Indonesia. Hak cipta dilindungi.</span>
          <span className="hidden md:inline text-slate-300">|</span>
          <span className="hidden md:inline">Terdaftar & Diawasi sesuai regulasi Fintech UMKM</span>
        </div>
        <div className="flex items-center gap-4 text-slate-600 font-medium">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-teal-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
            SLA Uptime 99.98%
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-teal-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
            End-to-End Encryption
          </span>
        </div>
      </footer>
    </div>
  );
}
