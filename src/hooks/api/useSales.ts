// src/hooks/api/useSales.ts
// Hooks for sales (penjualan) — Supabase live with realtime
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useOrgStore } from "@/stores/useOrgStore";
import type { Sale, SaleItem } from "@/types/database";

export function useGetSales(filters?: { search?: string; period?: string; status?: string }) {
  const currentOrg = useOrgStore((s) => s.currentOrg);
  const supabase = createClient();

  return useQuery({
    queryKey: ["sales", currentOrg?.id, filters],
    queryFn: async () => {
      if (!currentOrg?.id) return [];

      let query = supabase
        .from("sales")
        .select(`*, customer:customers(*)`)
        .eq("organization_id", currentOrg.id)
        .order("created_at", { ascending: false });

      if (filters?.search) {
        query = query.or(`invoice_number.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      let result = data as Sale[];

      // Client-side search across customer name
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(
          (s) =>
            s.invoice_number.toLowerCase().includes(q) ||
            (s.customer?.name || "").toLowerCase().includes(q)
        );
      }

      return result;
    },
    enabled: !!currentOrg?.id,
  });
}

export function useGetRecentSales(limit = 5) {
  const currentOrg = useOrgStore((s) => s.currentOrg);
  const supabase = createClient();

  return useQuery({
    queryKey: ["recent_sales", currentOrg?.id, limit],
    queryFn: async () => {
      if (!currentOrg?.id) return [];

      const { data, error } = await supabase
        .from("sales")
        .select(`*, customer:customers(*)`)
        .eq("organization_id", currentOrg.id)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as Sale[];
    },
    enabled: !!currentOrg?.id,
  });
}

interface CheckoutPayload {
  items: {
    product_id: string;
    variant_id?: string;
    product_name: string;
    product_sku?: string;
    qty: number;
    unit_price: number;
    buy_price: number;
    discount_amount: number;
    discount_percent: number;
    subtotal: number;
  }[];
  customer_id?: string;
  subtotal: number;
  discount_amount: number;
  discount_percent: number;
  tax_amount: number;
  tax_percent: number;
  total: number;
  paid_amount: number;
  change_amount: number;
  payment_method: string;
  payment_status: string;
  notes?: string;
}

export function useCreateSale() {
  const queryClient = useQueryClient();
  const currentOrg = useOrgStore((s) => s.currentOrg);
  const supabase = createClient();

  return useMutation({
    mutationFn: async (payload: CheckoutPayload) => {
      if (!currentOrg?.id) throw new Error("No organization");

      const invoiceNumber = `INV-${new Date()
        .toISOString()
        .replace(/\D/g, "")
        .slice(0, 8)}-${Math.floor(Math.random() * 9000) + 1000}`;

      // 1. Insert sale header
      const { data: sale, error: saleError } = await supabase
        .from("sales")
        .insert({
          organization_id: currentOrg.id,
          invoice_number: invoiceNumber,
          customer_id: payload.customer_id || null,
          sale_date: new Date().toISOString().split("T")[0],
          subtotal: payload.subtotal,
          discount_amount: payload.discount_amount,
          discount_percent: payload.discount_percent,
          tax_amount: payload.tax_amount,
          tax_percent: payload.tax_percent,
          total: payload.total,
          paid_amount: payload.paid_amount,
          change_amount: payload.change_amount,
          payment_method: payload.payment_method,
          payment_status: payload.payment_status,
          notes: payload.notes || null,
        })
        .select()
        .single();

      if (saleError) throw saleError;

      // 2. Insert sale items
      const saleItems = payload.items.map((item) => ({
        sale_id: sale.id,
        product_id: item.product_id,
        variant_id: item.variant_id || null,
        product_name: item.product_name,
        product_sku: item.product_sku || null,
        qty: item.qty,
        unit_price: item.unit_price,
        buy_price: item.buy_price,
        discount_amount: item.discount_amount,
        discount_percent: item.discount_percent,
        subtotal: item.subtotal,
      }));

      const { error: itemsError } = await supabase.from("sale_items").insert(saleItems);
      if (itemsError) throw itemsError;

      // 3. Update product stock & record stock movements
      for (const item of payload.items) {
        // Get current stock
        const { data: product } = await supabase
          .from("products")
          .select("stock")
          .eq("id", item.product_id)
          .single();

        const qtyBefore = product?.stock || 0;
        const qtyAfter = qtyBefore - item.qty;

        // Update stock
        await supabase
          .from("products")
          .update({ stock: qtyAfter, updated_at: new Date().toISOString() })
          .eq("id", item.product_id);

        // Record stock movement
        await supabase.from("stock_movements").insert({
          organization_id: currentOrg.id,
          product_id: item.product_id,
          variant_id: item.variant_id || null,
          type: "sale",
          reference_type: "sale",
          reference_id: sale.id,
          qty_change: -item.qty,
          qty_before: qtyBefore,
          qty_after: qtyAfter,
          notes: `Penjualan ${invoiceNumber}`,
        });
      }

      // 4. If payment is credit, create receivable
      if (payload.payment_method === "credit" && payload.customer_id) {
        const remaining = payload.total - payload.paid_amount;
        if (remaining > 0) {
          await supabase.from("receivables").insert({
            organization_id: currentOrg.id,
            customer_id: payload.customer_id,
            sale_id: sale.id,
            invoice_number: invoiceNumber,
            total_amount: payload.total,
            paid_amount: payload.paid_amount,
            remaining_amount: remaining,
            status: payload.paid_amount > 0 ? "partial" : "unpaid",
            due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          });
        }
      }

      // 5. Update customer stats if customer selected
      if (payload.customer_id) {
        const { data: cust } = await supabase
          .from("customers")
          .select("total_transactions, total_spend")
          .eq("id", payload.customer_id)
          .single();

        if (cust) {
          await supabase
            .from("customers")
            .update({
              total_transactions: (cust.total_transactions || 0) + 1,
              total_spend: (cust.total_spend || 0) + payload.total,
              last_transaction_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("id", payload.customer_id);
        }
      }

      return { ...sale, invoice_number: invoiceNumber };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["recent_sales"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      queryClient.invalidateQueries({ queryKey: ["stock_movements_recent"] });
      queryClient.invalidateQueries({ queryKey: ["receivables"] });
    },
  });
}

// Realtime hook: auto-invalidate queries when sales table changes
export function useSalesRealtime() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel("sales-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "sales" }, () => {
        queryClient.invalidateQueries({ queryKey: ["sales"] });
        queryClient.invalidateQueries({ queryKey: ["recent_sales"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => {
        queryClient.invalidateQueries({ queryKey: ["products"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "stock_movements" }, () => {
        queryClient.invalidateQueries({ queryKey: ["stock_movements_recent"] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, supabase]);
}
