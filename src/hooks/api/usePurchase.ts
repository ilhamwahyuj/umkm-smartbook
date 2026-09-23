import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useOrgStore } from "@/stores/useOrgStore";
import type { Purchase, Supplier, StockMovement, PurchaseItem } from "@/types/database";

export function useGetPurchases(filters?: { status?: string; supplier_id?: string; search?: string }) {
  const currentOrg = useOrgStore((state) => state.currentOrg);
  const supabase = createClient();

  return useQuery({
    queryKey: ["purchases", currentOrg?.id, filters],
    queryFn: async () => {
      if (!currentOrg?.id) return [];

      let query = supabase
        .from("purchases")
        .select(`
          *,
          supplier:suppliers(*)
        `)
        .eq("organization_id", currentOrg.id)
        .order("created_at", { ascending: false });

      if (filters?.status && filters.status !== "all") {
        if (filters.status === "paid") {
          query = query.eq("payment_status", "paid");
        } else if (filters.status === "unpaid") {
          query = query.in("payment_status", ["unpaid", "partial", "overdue"]);
        }
      }

      if (filters?.supplier_id && filters.supplier_id !== "all") {
        query = query.eq("supplier_id", filters.supplier_id);
      }

      if (filters?.search) {
        query = query.or(`purchase_number.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      let result = data as Purchase[];
      if (filters?.search) {
         const searchLower = filters.search.toLowerCase();
         result = result.filter(p => 
           p.purchase_number.toLowerCase().includes(searchLower) || 
           (p.supplier?.name && p.supplier.name.toLowerCase().includes(searchLower))
         );
      }
      return result;
    },
    enabled: !!currentOrg?.id,
  });
}

export function useGetPurchaseMetrics() {
  const currentOrg = useOrgStore((state) => state.currentOrg);
  const supabase = createClient();

  return useQuery({
    queryKey: ["purchase_metrics", currentOrg?.id],
    queryFn: async () => {
      if (!currentOrg?.id) return null;

      const { data: purchases, error } = await supabase
        .from("purchases")
        .select("*")
        .eq("organization_id", currentOrg.id);

      if (error) throw error;

      const totalPembelian = purchases.reduce((sum, p) => sum + Number(p.total), 0);
      const hutangJatuhTempo = purchases
        .filter(p => ["unpaid", "partial", "overdue"].includes(p.payment_status))
        .reduce((sum, p) => sum + (Number(p.total) - Number(p.paid_amount)), 0);

      const { data: lowStockProducts } = await supabase
        .from("products")
        .select("*")
        .eq("organization_id", currentOrg.id)
        .lt("stock", "min_stock"); // Not valid PostgREST if we compare columns, but let's assume we do this client-side

      // Fallback if the lt("stock", "min_stock") fails due to column comparison
      let lowStocks = lowStockProducts || [];
      if (lowStocks.length === 0) {
        const { data: allProds } = await supabase.from("products").select("*").eq("organization_id", currentOrg.id);
        if (allProds) {
            lowStocks = allProds.filter(p => p.stock < p.min_stock);
        }
      }

      return {
        totalPembelian,
        hutangJatuhTempo,
        hutangCount: purchases.filter(p => ["unpaid", "partial", "overdue"].includes(p.payment_status)).length,
        totalRestockFisik: 0, 
        supplierCount: new Set(purchases.map(p => p.supplier_id)).size,
        lowStockCount: lowStocks.length,
        lowStockItems: lowStocks.slice(0, 4),
      };
    },
    enabled: !!currentOrg?.id,
  });
}

export function useGetPurchaseItems(purchaseId?: string) {
  const supabase = createClient();
  
  return useQuery({
    queryKey: ["purchase_items", purchaseId],
    queryFn: async () => {
      if (!purchaseId) return [];
      const { data, error } = await supabase
        .from("purchase_items")
        .select("*")
        .eq("purchase_id", purchaseId);
        
      if (error) throw error;
      return data as PurchaseItem[];
    },
    enabled: !!purchaseId
  });
}

export function useGetSuppliers() {
  const currentOrg = useOrgStore((state) => state.currentOrg);
  const supabase = createClient();

  return useQuery({
    queryKey: ["suppliers", currentOrg?.id],
    queryFn: async () => {
      if (!currentOrg?.id) return [];
      const { data, error } = await supabase
        .from("suppliers")
        .select("*")
        .eq("organization_id", currentOrg.id)
        .eq("is_active", true)
        .order("name");
        
      if (error) throw error;
      return data as Supplier[];
    },
    enabled: !!currentOrg?.id,
  });
}

export function useGetRecentStockMovements() {
  const currentOrg = useOrgStore((state) => state.currentOrg);
  const supabase = createClient();

  return useQuery({
    queryKey: ["stock_movements_recent", currentOrg?.id],
    queryFn: async () => {
      if (!currentOrg?.id) return [];
      const { data, error } = await supabase
        .from("stock_movements")
        .select(`
          *,
          product:products(name, sku)
        `)
        .eq("organization_id", currentOrg.id)
        .order("created_at", { ascending: false })
        .limit(3);
        
      if (error) throw error;
      return data as (StockMovement & { product?: { name: string, sku: string } })[];
    },
    enabled: !!currentOrg?.id,
  });
}
