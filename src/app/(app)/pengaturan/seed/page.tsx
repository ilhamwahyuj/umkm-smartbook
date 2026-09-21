"use client";

import { useState } from "react";
import { useOrgStore } from "@/stores/useOrgStore";
import { createClient } from "@/lib/supabase/client";
import { Database, Upload, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { mockProducts, mockCustomers, mockSuppliers } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function SeedPage() {
  const currentOrg = useOrgStore((state) => state.currentOrg);
  const supabase = createClient();
  
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (log: string) => {
    setLogs((prev) => [...prev, log]);
  };

  const handleSeed = async () => {
    if (!currentOrg) {
      setMessage("Organisasi tidak ditemukan. Silakan login atau pilih organisasi.");
      setStatus("error");
      return;
    }

    const orgId = currentOrg.id;
    setStatus("loading");
    setLogs([]);
    addLog(`Memulai seeding untuk organisasi: ${currentOrg.name}`);

    try {
      // 1. Seed Categories (Produk)
      addLog("Menyiapkan Kategori...");
      const { data: catData, error: catErr } = await supabase
        .from("categories")
        .insert({ organization_id: orgId, name: "Umum", type: "product", color: "#10B981" })
        .select()
        .single();
      
      if (catErr) throw new Error(`Kategori error: ${catErr.message}`);
      
      // 2. Seed Units
      addLog("Menyiapkan Satuan...");
      const { data: unitData, error: unitErr } = await supabase
        .from("units")
        .insert({ organization_id: orgId, name: "Pcs", abbreviation: "pcs" })
        .select()
        .single();
        
      if (unitErr) throw new Error(`Unit error: ${unitErr.message}`);

      // 3. Seed Products
      addLog(`Menyisipkan ${mockProducts.length} Produk...`);
      const productsToInsert = mockProducts.map(p => ({
        organization_id: orgId,
        category_id: catData.id,
        unit_id: unitData.id,
        sku: p.sku,
        name: p.name,
        buy_price: p.buy_price, // Asumsi HPP 70%
        sell_price: p.sell_price,
        stock: p.stock,
        min_stock: p.min_stock,
        is_active: p.is_active,
      }));
      
      const { error: prodErr } = await supabase.from("products").insert(productsToInsert);
      if (prodErr) throw new Error(`Produk error: ${prodErr.message}`);

      // 4. Seed Customers
      addLog(`Menyisipkan ${mockCustomers.length} Pelanggan...`);
      const customersToInsert = mockCustomers.map(c => ({
        organization_id: orgId,
        name: c.name,
        phone: c.phone,
        email: c.email,
        total_spend: c.total_spend,
        total_transactions: c.total_transactions,
      }));
      
      const { error: custErr } = await supabase.from("customers").insert(customersToInsert);
      if (custErr) throw new Error(`Pelanggan error: ${custErr.message}`);

      // 5. Seed Suppliers
      addLog(`Menyisipkan ${mockSuppliers.length} Supplier...`);
      const suppliersToInsert = mockSuppliers.map(s => ({
        organization_id: orgId,
        name: s.name,
        contact_name: s.contact_name,
        phone: s.phone,
        is_active: s.is_active,
      }));
      
      const { error: suppErr } = await supabase.from("suppliers").insert(suppliersToInsert);
      if (suppErr) throw new Error(`Supplier error: ${suppErr.message}`);

      // SELESAI
      addLog("✅ Proses Seeding Berhasil!");
      setStatus("success");
      setMessage("Data dummy berhasil disuntikkan ke Supabase live Anda.");
      
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setMessage(err.message || "Terjadi kesalahan saat seeding.");
      addLog(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Database Seeder</h1>
        <p className="text-slate-500 mt-1 text-sm">
          Fungsi sementara untuk memindahkan Mock Data lokal ke database Supabase live Anda.
        </p>
      </div>

      <div className="card p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center flex-shrink-0">
            <Database className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Injeksi Mock Data</h3>
            <p className="text-slate-500 mt-1 text-[15px] leading-relaxed">
              Tindakan ini akan memasukkan produk, pelanggan, dan supplier dari <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">mock-data.ts</code> ke dalam tabel Supabase Anda di organisasi <strong>{currentOrg?.name}</strong>.
            </p>
          </div>
        </div>

        {status === "error" && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 flex items-start gap-3 text-rose-800">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Seeding Gagal</p>
              <p className="text-sm opacity-90">{message}</p>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-start gap-3 text-emerald-800">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Seeding Berhasil</p>
              <p className="text-sm opacity-90">{message}</p>
            </div>
          </div>
        )}

        <button
          onClick={handleSeed}
          disabled={status === "loading"}
          className={cn(
            "btn btn-primary w-full justify-center btn-lg font-bold shadow-sm",
            status === "loading" && "opacity-70 cursor-not-allowed"
          )}
        >
          {status === "loading" ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Menyuntikkan Data...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              Mulai Seed Data
            </>
          )}
        </button>

        {logs.length > 0 && (
          <div className="mt-8">
            <p className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">Console Logs</p>
            <div className="bg-slate-900 rounded-xl p-4 font-mono text-[13px] text-slate-300 space-y-1.5 overflow-y-auto max-h-[300px]">
              {logs.map((log, i) => (
                <div key={i}>{log}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
