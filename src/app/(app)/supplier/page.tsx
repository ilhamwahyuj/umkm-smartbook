"use client";
// src/app/(app)/supplier/page.tsx
import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Truck, Phone, CreditCard, Building2 } from "lucide-react";
import { formatRupiah, formatDate } from "@/lib/utils";
import { mockSuppliers } from "@/lib/mock-data";

export default function SupplierPage() {
  const [search, setSearch] = useState("");

  const filtered = mockSuppliers.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.contact_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (s.phone ?? "").includes(search)
  );

  const totalPayable = mockSuppliers.reduce((sum, s) => sum + s.payable_amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Supplier</h1>
          <p className="text-slate-500 text-sm mt-0.5">{mockSuppliers.length} supplier terdaftar</p>
        </div>
        <Link href="/supplier/tambah" className="btn btn-primary w-fit">
          <Plus className="w-4 h-4" /> Tambah Supplier
        </Link>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4">
          <p className="text-slate-500 text-xs font-medium">Total Supplier</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{mockSuppliers.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-slate-500 text-xs font-medium">Total Hutang</p>
          <p className="text-2xl font-bold text-rose-600 mt-1">{formatRupiah(totalPayable, { compact: true })}</p>
        </div>
        <div className="card p-4">
          <p className="text-slate-500 text-xs font-medium">Supplier Aktif</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {mockSuppliers.filter((s) => s.is_active).length}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            className="input pl-9"
            placeholder="Cari nama perusahaan, kontak, atau no HP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Supplier Cards */}
      {filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon bg-indigo-50 text-indigo-500">
              <Truck className="w-8 h-8" />
            </div>
            <p className="empty-state-title">Belum ada supplier</p>
            <p className="empty-state-desc">Tambahkan supplier untuk melacak pembelian dan hutang</p>
            <Link href="/supplier/tambah" className="btn btn-primary">
              <Plus className="w-4 h-4" /> Tambah Supplier
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((supplier) => (
            <Link
              key={supplier.id}
              href={`/supplier/${supplier.id}`}
              className="card p-5 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer block border-t-4 border-t-transparent hover:border-t-indigo-500"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl gradient-indigo flex items-center justify-center text-white font-bold flex-shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 truncate">{supplier.name}</p>
                  {supplier.contact_name && (
                    <p className="text-slate-500 text-xs mt-0.5">PIC: {supplier.contact_name}</p>
                  )}
                  {supplier.phone && (
                    <p className="text-slate-400 text-xs flex items-center gap-1 mt-1">
                      <Phone className="w-3 h-3" /> {supplier.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-100">
                <div>
                  <p className="text-xs text-slate-400">Total Pembelian</p>
                  <p className="font-bold text-slate-800 text-sm">{formatRupiah(supplier.total_spend, { compact: true })}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Transaksi PO</p>
                  <p className="font-bold text-slate-800 text-sm">{supplier.total_purchases}×</p>
                </div>
              </div>

              {supplier.payable_amount > 0 && (
                <div className="mt-3 flex items-center justify-between p-2.5 rounded-xl bg-rose-50 border border-rose-100">
                  <div className="flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-rose-600" />
                    <span className="text-xs text-rose-700 font-medium">Hutang</span>
                  </div>
                  <span className="text-sm font-bold text-rose-700">
                    {formatRupiah(supplier.payable_amount)}
                  </span>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
