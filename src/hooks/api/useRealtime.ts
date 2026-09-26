// src/hooks/api/useRealtime.ts
// Global Supabase Realtime hook — auto-invalidates React Query when DB changes
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

const WATCHED_TABLES = [
  "products",
  "sales",
  "sale_items",
  "purchases",
  "purchase_items",
  "stock_movements",
  "customers",
  "suppliers",
  "expenses",
  "receivables",
  "payables",
  "notifications",
  "categories",
  "units",
] as const;

// Mapping table changes → query keys to invalidate
const TABLE_QUERY_MAP: Record<string, string[]> = {
  products: ["products", "dashboard-summary", "purchase_metrics"],
  sales: ["sales", "recent_sales", "dashboard-summary", "financial-summary"],
  sale_items: ["sales", "recent_sales"],
  purchases: ["purchases", "purchase_metrics"],
  purchase_items: ["purchases", "purchase_items"],
  stock_movements: ["stock_movements_recent", "products"],
  customers: ["customers", "dashboard-summary"],
  suppliers: ["suppliers", "purchase_metrics"],
  expenses: ["expenses", "dashboard-summary", "financial-summary"],
  receivables: ["receivables", "financial-summary", "dashboard-summary"],
  payables: ["payables", "financial-summary"],
  notifications: ["notifications"],
  categories: ["categories", "products"],
  units: ["units"],
};

/**
 * Attach this hook once in the app layout to enable realtime sync.
 * When any watched table receives an INSERT/UPDATE/DELETE via Supabase
 * Realtime, the corresponding React Query caches are invalidated so
 * the UI automatically refreshes.
 */
export function useSupabaseRealtime() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase.channel("global-realtime");

    for (const table of WATCHED_TABLES) {
      channel.on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        () => {
          const queryKeys = TABLE_QUERY_MAP[table] || [];
          for (const key of queryKeys) {
            queryClient.invalidateQueries({ queryKey: [key] });
          }
        }
      );
    }

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, supabase]);
}
