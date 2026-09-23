"use client";
// src/app/(auth)/register/page.tsx
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Sparkles, ArrowRight, Loader2, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const passwordStrength = (() => {
    const p = form.password;
    if (p.length === 0) return 0;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  })();

  const strengthLabel = ["", "Lemah", "Cukup", "Baik", "Kuat"][passwordStrength];
  const strengthColor = ["", "bg-rose-400", "bg-amber-400", "bg-blue-400", "bg-emerald-400"][passwordStrength];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Password tidak sama.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { full_name: form.name },
        },
      });

      if (authError) {
        if (authError.message.includes("already registered")) {
          setError("Email sudah terdaftar. Silakan login.");
        } else {
          setError(authError.message);
        }
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/onboarding"), 2000);
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-9 h-9 rounded-xl gradient-emerald flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <p className="font-bold text-slate-800 text-lg">UMKM SmartBook</p>
        </div>

        <div className="card p-8 animate-fade-in">
          {success ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Akun berhasil dibuat!</h3>
              <p className="text-slate-500 text-sm">
                Mengalihkan ke setup bisnis Anda...
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Buat akun gratis</h2>
                <p className="text-slate-500 mt-1 text-sm">
                  Sudah punya akun?{" "}
                  <Link href="/login" className="text-emerald-600 font-semibold hover:text-emerald-700">
                    Masuk di sini
                  </Link>
                </p>
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl mb-4">
                  <span className="text-rose-500 text-sm">⚠️</span>
                  <p className="text-rose-700 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="input-label" htmlFor="name">Nama Lengkap</label>
                  <input
                    id="name"
                    type="text"
                    className="input"
                    placeholder="Nama Anda"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="input-label" htmlFor="reg-email">Email</label>
                  <input
                    id="reg-email"
                    type="email"
                    className="input"
                    placeholder="nama@tokoanda.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="input-label" htmlFor="reg-password">Password</label>
                  <div className="relative">
                    <input
                      id="reg-password"
                      type={showPassword ? "text" : "password"}
                      className="input pr-10"
                      placeholder="Min. 8 karakter"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {form.password && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={cn(
                              "h-1 flex-1 rounded-full transition-all",
                              i <= passwordStrength ? strengthColor : "bg-slate-200"
                            )}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-slate-500">Kekuatan: <span className="font-medium">{strengthLabel}</span></p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="input-label" htmlFor="confirm-password">Konfirmasi Password</label>
                  <input
                    id="confirm-password"
                    type="password"
                    className={cn(
                      "input",
                      form.confirmPassword && form.password !== form.confirmPassword && "border-rose-300 focus:border-rose-400"
                    )}
                    placeholder="Ulangi password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    required
                  />
                  {form.confirmPassword && form.password !== form.confirmPassword && (
                    <p className="text-xs text-rose-500 mt-1">Password tidak sama</p>
                  )}
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
                      Daftar Sekarang <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <p className="text-xs text-slate-400 text-center mt-4">
                Dengan mendaftar, Anda menyetujui{" "}
                <Link href="/syarat-layanan" className="text-emerald-600 hover:text-emerald-700 font-medium">Syarat & Ketentuan</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
