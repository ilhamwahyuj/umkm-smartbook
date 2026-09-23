"use client";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen text-slate-800 flex flex-col justify-center bg-[#F8F9FF] py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Lupa Kata Sandi?
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Masukkan email yang terdaftar untuk mengatur ulang kata sandi Anda.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm sm:rounded-2xl sm:px-10 border border-slate-200">
          {submitted ? (
            <div className="text-center py-4">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 mb-6">
                <svg className="h-8 w-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Email Terkirim!</h3>
              <p className="mt-2 text-sm text-slate-500 mb-8 leading-relaxed">
                Silakan periksa kotak masuk email Anda (atau folder spam). Kami telah mengirimkan tautan untuk mengatur ulang kata sandi Anda.
              </p>
              <div>
                <Link href="/login" className="w-full flex justify-center py-3 px-4 border border-slate-300 rounded-xl shadow-sm text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 focus:outline-none transition-colors">
                  Kembali ke Login
                </Link>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Alamat Email Terdaftar
                </label>
                <div className="relative rounded-xl border border-slate-300 focus-within:border-teal-700 focus-within:ring-2 focus-within:ring-teal-700/20 bg-slate-50/50 transition-all">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206"></path></svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-transparent text-sm font-medium text-slate-900 focus:outline-none"
                    placeholder="nama@toko.com"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md shadow-teal-700/20 text-sm font-bold text-white bg-teal-700 hover:bg-teal-800 focus:outline-none disabled:opacity-70 transition-all"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    "Kirim Link Reset Sandi"
                  )}
                </button>
              </div>
              
              <div className="mt-6 text-center">
                <Link href="/login" className="text-sm font-semibold text-teal-700 hover:text-teal-800 transition-colors flex items-center justify-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                  Kembali ke halaman login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
