"use client";
// src/app/(app)/pengaturan/pengguna/page.tsx
import { useState } from "react";
import { Plus, Search, Shield, ShieldAlert, UserCircle, MoreVertical } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { mockOrgUsers } from "@/lib/mock-data";
import { RoleGuard } from "@/components/auth/RoleGuard";
import type { UserRole } from "@/types/database";

const roleLabels: Record<UserRole, { label: string; color: string; desc: string }> = {
  owner: { label: "Owner", color: "bg-emerald-100 text-emerald-700", desc: "Akses penuh" },
  admin: { label: "Admin", color: "bg-indigo-100 text-indigo-700", desc: "Manajemen operasional" },
  cashier: { label: "Kasir", color: "bg-blue-100 text-blue-700", desc: "Akses POS & Penjualan" },
  warehouse: { label: "Gudang", color: "bg-amber-100 text-amber-700", desc: "Manajemen inventaris" },
  accounting: { label: "Keuangan", color: "bg-rose-100 text-rose-700", desc: "Akses laporan & hutang" },
  viewer: { label: "Viewer", color: "bg-slate-100 text-slate-700", desc: "Hanya melihat (Read-only)" },
};

export default function PenggunaPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "semua">("semua");

  const filtered = mockOrgUsers.filter((member) => {
    const matchSearch = 
      member.user.name.toLowerCase().includes(search.toLowerCase()) || 
      member.user.email.toLowerCase().includes(search.toLowerCase());
    
    const matchRole = roleFilter === "semua" || member.role === roleFilter;

    return matchSearch && matchRole;
  });

  return (
    <RoleGuard allowedRoles={["owner"]} fallback={null}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Manajemen Pengguna</h1>
            <p className="text-slate-500 text-sm mt-0.5">Kelola akses anggota tim di organisasi Anda</p>
          </div>
          <button className="btn btn-primary">
            <Plus className="w-4 h-4" /> Undang Pengguna
          </button>
        </div>

        {/* Filters */}
        <div className="card p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                className="input pl-9"
                placeholder="Cari nama atau email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select 
              className="input sm:w-48"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as UserRole | "semua")}
            >
              <option value="semua">Semua Role</option>
              {Object.entries(roleLabels).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Pengguna</th>
                  <th>Role & Akses</th>
                  <th>Bergabung Sejak</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((member) => (
                  <tr key={member.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400 flex-shrink-0">
                          {member.user.avatar_url ? (
                            <img src={member.user.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                          ) : (
                            member.user.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{member.user.name}</p>
                          <p className="text-xs text-slate-500">{member.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col items-start">
                        <span className={cn("badge text-[11px] px-2 py-0.5", roleLabels[member.role].color)}>
                          {roleLabels[member.role].label}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-1">{roleLabels[member.role].desc}</span>
                      </div>
                    </td>
                    <td className="text-sm text-slate-600">
                      {formatDate(member.joined_at || member.created_at)}
                    </td>
                    <td>
                      <span className="badge badge-success text-[11px] px-2 py-0.5">Aktif</span>
                    </td>
                    <td>
                      <button className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filtered.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-slate-500">Tidak ada pengguna yang cocok dengan filter.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </RoleGuard>
  );
}
