"use client";
// src/app/(auth)/login/page.tsx
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
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

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  // Demo login — set cookie lalu redirect ke dashboard
  const handleDemoLogin = () => {
    setLoading(true);
    // Set demo_mode cookie (expires 1 hari)
    document.cookie = "demo_mode=true; path=/; max-age=86400; SameSite=Lax";
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 800);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-emerald relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full border-2 border-white" />
          <div className="absolute top-32 left-32 w-24 h-24 rounded-full border-2 border-white" />
          <div className="absolute bottom-20 right-10 w-56 h-56 rounded-full border-2 border-white" />
          <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full bg-white/20" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-lg leading-none">UMKM SmartBook</p>
              <p className="text-emerald-100 text-xs">Kelola bisnis lebih cerdas</p>
            </div>
          </div>

          {/* Hero Text */}
          <div>
            <h1 className="text-4xl font-bold leading-tight mb-4">
              Catat transaksi,<br />
              pahami bisnis Anda<br />
              <span className="text-emerald-200">secara otomatis.</span>
            </h1>
            <p className="text-emerald-100 text-lg leading-relaxed max-w-sm">
              Platform manajemen UMKM lengkap — penjualan, stok, keuangan, dan laporan dalam satu aplikasi.
            </p>

            {/* Stats */}
            <div className="flex gap-6 mt-8">
              {[
                { value: "10.000+", label: "UMKM aktif" },
                { value: "99.9%", label: "Uptime" },
                { value: "Rp2Trn+", label: "Transaksi diproses" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-emerald-200 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-emerald-200 text-sm">
            © 2026 UMKM SmartBook · Dibuat dengan ❤️ untuk UMKM Indonesia
          </p>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl gradient-emerald flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <p className="font-bold text-slate-800 text-lg">UMKM SmartBook</p>
          </div>

          <div className="card p-8 animate-fade-in">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Masuk ke akun Anda</h2>
              <p className="text-slate-500 mt-1 text-sm">
                Belum punya akun?{" "}
                <Link href="/register" className="text-emerald-600 font-semibold hover:text-emerald-700">
                  Daftar gratis
                </Link>
              </p>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl mb-4 animate-fade-in">
                <span className="text-rose-500 text-sm">⚠️</span>
                <p className="text-rose-700 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="input-label" htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="input"
                  placeholder="nama@tokoanda.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="input-label" htmlFor="password">Password</label>
                  <Link href="/forgot-password" className="text-xs text-emerald-600 font-medium hover:text-emerald-700">
                    Lupa password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className="input pr-10"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-lg w-full mt-6"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Masuk <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs text-slate-400 uppercase">
                <span className="bg-white px-3">atau</span>
              </div>
            </div>

            <button
              onClick={handleDemoLogin}
              disabled={loading}
              className="btn btn-outline w-full justify-center"
            >
              🚀 Coba Demo Gratis
            </button>

            <p className="text-xs text-slate-400 text-center mt-4">
              Dengan masuk, Anda menyetujui{" "}
              <span className="text-emerald-600 cursor-pointer">Syarat & Ketentuan</span>{" "}
              dan{" "}
              <span className="text-emerald-600 cursor-pointer">Kebijakan Privasi</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
