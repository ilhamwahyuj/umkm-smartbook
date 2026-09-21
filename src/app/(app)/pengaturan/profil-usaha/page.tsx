"use client";
import { useState, useEffect } from "react";
import { Building2, Save, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useGetOrganization, useUpdateOrganization } from "@/hooks/api/useOrganization";
import type { BusinessType } from "@/types/database";

export default function ProfilUsahaPage() {
  const { data: organization, isLoading } = useGetOrganization();
  const updateMutation = useUpdateOrganization();
  
  const [formData, setFormData] = useState({
    name: "",
    type: "general" as BusinessType,
    email: "",
    phone: "",
    address: "",
  });

  // Sync with fetched data
  useEffect(() => {
    if (organization) {
      setFormData({
        name: organization.name || "",
        type: organization.type || "general",
        email: organization.email || "",
        phone: organization.phone || "",
        address: organization.address || "",
      });
    }
  }, [organization]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-4 border-b border-slate-200/60 pb-6">
        <Link href="/pengaturan" className="btn btn-ghost p-2 rounded-xl">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Profil Usaha</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Informasi dasar tentang toko/bisnis Anda</p>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-8 h-8 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Detail Bisnis</h3>
            <p className="text-sm text-slate-500">Logo dan nama akan muncul di struk/invoice pelanggan.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {updateMutation.isError && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm font-medium">
              Gagal menyimpan profil. Pastikan kebijakan RLS Supabase mengizinkan operasi UPDATE.
            </div>
          )}
          
          {updateMutation.isSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-medium">
              Profil usaha berhasil diperbarui!
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Nama Usaha / Toko</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="input h-11"
                placeholder="Contoh: Toko Kopi Sejahtera"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Tipe Bisnis</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="input h-11 bg-white"
              >
                <option value="general">Umum / Ritel</option>
                <option value="food">Makanan & Minuman (F&B)</option>
                <option value="fashion">Pakaian & Fashion</option>
                <option value="service">Jasa & Servis</option>
                <option value="online">Toko Online</option>
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Email Bisnis</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input h-11"
                placeholder="email@bisnis.com"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">No. WhatsApp / Telepon</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input h-11"
                placeholder="08123456789"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Alamat Lengkap</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              className="input py-3 resize-none"
              placeholder="Jalan, RT/RW, Kota, Provinsi..."
            />
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="btn btn-primary h-12 px-8 rounded-xl w-full sm:w-auto shadow-md shadow-emerald-500/20"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
