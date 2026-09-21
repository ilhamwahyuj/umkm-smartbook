"use client";
// src/app/(app)/pelanggan/page.tsx
import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Users, Phone, CreditCard } from "lucide-react";
import { cn, formatRupiah, formatDate } from "@/lib/utils";
import { mockCustomers } from "@/lib/mock-data";

export default function PelangganPage() {
  const [search, setSearch] = useState("");

  const filtered = mockCustomers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.phone ?? "").includes(search)
  );

  const totalReceivable = mockCustomers.reduce((sum, c) => sum + c.receivable_amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pelanggan</h1>
          <p className="text-slate-500 text-sm mt-0.5">{mockCustomers.length} pelanggan terdaftar</p>
        </div>
        <Link href="/pelanggan/tambah" className="btn btn-primary w-fit">
          <Plus className="w-4 h-4" /> Tambah Pelanggan
        </Link>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4">
          <p className="text-slate-500 text-xs font-medium">Total Pelanggan</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{mockCustomers.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-slate-500 text-xs font-medium">Total Piutang</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{formatRupiah(totalReceivable, { compact: true })}</p>
        </div>
        <div className="card p-4">
          <p className="text-slate-500 text-xs font-medium">Pelanggan Aktif (30 hari)</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {mockCustomers.filter((c) => {
              if (!c.last_transaction_at) return false;
              const d = new Date(c.last_transaction_at);
              return Date.now() - d.getTime() < 30 * 24 * 60 * 60 * 1000;
            }).length}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            className="input pl-9"
            placeholder="Cari nama atau nomor telepon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Customer Cards */}
      {filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">
              <Users className="w-8 h-8" />
            </div>
            <p className="empty-state-title">Belum ada pelanggan</p>
            <p className="empty-state-desc">Tambahkan pelanggan untuk melacak transaksi dan piutang</p>
            <Link href="/pelanggan/tambah" className="btn btn-primary">
              <Plus className="w-4 h-4" /> Tambah Pelanggan
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((customer) => (
            <Link
              key={customer.id}
              href={`/pelanggan/${customer.id}`}
              className="card p-5 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer block"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl gradient-emerald flex items-center justify-center text-white font-bold flex-shrink-0">
                  {customer.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 truncate">{customer.name}</p>
                  {customer.phone && (
                    <p className="text-slate-400 text-xs flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3" /> {customer.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-100">
                <div>
                  <p className="text-xs text-slate-400">Total Belanja</p>
                  <p className="font-bold text-slate-800 text-sm">{formatRupiah(customer.total_spend, { compact: true })}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Transaksi</p>
                  <p className="font-bold text-slate-800 text-sm">{customer.total_transactions}×</p>
                </div>
              </div>

              {customer.receivable_amount > 0 && (
                <div className="mt-3 flex items-center justify-between p-2.5 rounded-xl bg-amber-50 border border-amber-100">
                  <div className="flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-amber-600" />
                    <span className="text-xs text-amber-700 font-medium">Piutang</span>
                  </div>
                  <span className="text-sm font-bold text-amber-700">
                    {formatRupiah(customer.receivable_amount)}
                  </span>
                </div>
              )}

              {customer.last_transaction_at && (
                <p className="text-xs text-slate-400 mt-2">
                  Terakhir: {formatDate(customer.last_transaction_at)}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
