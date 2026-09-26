// src/hooks/api/usePurchase.ts
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

      // Get low stock products
      const { data: allProds } = await supabase
        .from("products")
        .select("*")
        .eq("organization_id", currentOrg.id);
      
      const lowStocks = (allProds || []).filter(p => p.stock < p.min_stock);

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

interface PurchaseCheckoutPayload {
  items: {
    product_id: string;
    variant_id?: string;
    product_name: string;
    qty: number;
    unit_price: number;
    subtotal: number;
  }[];
  supplier_id?: string;
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  total: number;
  paid_amount: number;
  payment_method: string;
  payment_status: string;
  notes?: string;
}

export function useCreatePurchase() {
  const queryClient = useQueryClient();
  const currentOrg = useOrgStore((s) => s.currentOrg);
  const supabase = createClient();

  return useMutation({
    mutationFn: async (payload: PurchaseCheckoutPayload) => {
      if (!currentOrg?.id) throw new Error("No organization");

      const poNumber = `PO-${new Date()
        .toISOString()
        .replace(/\D/g, "")
        .slice(0, 8)}-${Math.floor(Math.random() * 9000) + 1000}`;

      // 1. Insert purchase header
      const { data: purchase, error: purchaseError } = await supabase
        .from("purchases")
        .insert({
          organization_id: currentOrg.id,
          purchase_number: poNumber,
          supplier_id: payload.supplier_id || null,
          purchase_date: new Date().toISOString().split("T")[0],
          subtotal: payload.subtotal,
          discount_amount: payload.discount_amount,
          tax_amount: payload.tax_amount,
          total: payload.total,
          paid_amount: payload.paid_amount,
          payment_method: payload.payment_method,
          payment_status: payload.payment_status,
          notes: payload.notes || null,
        })
        .select()
        .single();

      if (purchaseError) throw purchaseError;

      // 2. Insert purchase items
      const purchaseItems = payload.items.map((item) => ({
        purchase_id: purchase.id,
        product_id: item.product_id,
        variant_id: item.variant_id || null,
        product_name: item.product_name,
        qty: item.qty,
        unit_price: item.unit_price,
        subtotal: item.subtotal,
      }));

      const { error: itemsError } = await supabase.from("purchase_items").insert(purchaseItems);
      if (itemsError) throw itemsError;

      // 3. Update product stock & record stock movements (increase stock)
      for (const item of payload.items) {
        const { data: product } = await supabase
          .from("products")
          .select("stock")
          .eq("id", item.product_id)
          .single();

        const qtyBefore = product?.stock || 0;
        const qtyAfter = qtyBefore + item.qty;

        await supabase
          .from("products")
          .update({ stock: qtyAfter, updated_at: new Date().toISOString() })
          .eq("id", item.product_id);

        await supabase.from("stock_movements").insert({
          organization_id: currentOrg.id,
          product_id: item.product_id,
          variant_id: item.variant_id || null,
          type: "purchase",
          reference_type: "purchase",
          reference_id: purchase.id,
          qty_change: item.qty,
          qty_before: qtyBefore,
          qty_after: qtyAfter,
          notes: `Pembelian ${poNumber}`,
        });
      }

      // 4. If credit, create payable
      if (payload.payment_method === "credit" && payload.supplier_id) {
        const remaining = payload.total - payload.paid_amount;
        if (remaining > 0) {
          await supabase.from("payables").insert({
            organization_id: currentOrg.id,
            supplier_id: payload.supplier_id,
            purchase_id: purchase.id,
            purchase_number: poNumber,
            total_amount: payload.total,
            paid_amount: payload.paid_amount,
            remaining_amount: remaining,
            status: payload.paid_amount > 0 ? "partial" : "unpaid",
            due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          });
        }
      }

      return { ...purchase, purchase_number: poNumber };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
      queryClient.invalidateQueries({ queryKey: ["purchase_metrics"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["stock_movements_recent"] });
      queryClient.invalidateQueries({ queryKey: ["payables"] });
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });
}
