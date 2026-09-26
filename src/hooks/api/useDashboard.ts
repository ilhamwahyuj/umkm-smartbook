// src/hooks/api/useDashboard.ts
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useOrgStore } from "@/stores/useOrgStore";
import type { DashboardSummary, SalesChartData, TopProduct, LowStockProduct } from "@/types/database";

export function useDashboardSummary(dateFilter: string) {
  const currentOrg = useOrgStore((state) => state.currentOrg);
  const supabase = createClient();

  return useQuery({
    queryKey: ["dashboard-summary", currentOrg?.id, dateFilter],
    queryFn: async (): Promise<DashboardSummary> => {
      if (!currentOrg?.id) {
        return {
          revenue: 0, revenue_change_percent: 0,
          gross_profit: 0, gross_profit_change_percent: 0,
          expenses: 0, expenses_change_percent: 0,
          receivables: 0, total_transactions: 0, total_customers: 0,
        };
      }

      const [salesRes, expensesRes, customersRes, receivablesRes] = await Promise.all([
        supabase
          .from("sales")
          .select("total")
          .eq("organization_id", currentOrg.id)
          .neq("is_voided", true),
        supabase
          .from("expenses")
          .select("amount")
          .eq("organization_id", currentOrg.id),
        supabase
          .from("customers")
          .select("*", { count: "exact", head: true })
          .eq("organization_id", currentOrg.id),
        supabase
          .from("receivables")
          .select("remaining_amount")
          .eq("organization_id", currentOrg.id)
          .in("status", ["unpaid", "partial", "overdue"]),
      ]);

      const revenue = salesRes.data?.reduce((acc, curr) => acc + Number(curr.total), 0) || 0;
      const totalExpenses = expensesRes.data?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;
      const totalReceivables = receivablesRes.data?.reduce((acc, curr) => acc + Number(curr.remaining_amount), 0) || 0;

      return {
        revenue,
        revenue_change_percent: 0,
        gross_profit: revenue - totalExpenses,
        gross_profit_change_percent: 0,
        expenses: totalExpenses,
        expenses_change_percent: 0,
        receivables: totalReceivables,
        total_transactions: salesRes.data?.length || 0,
        total_customers: customersRes.count || 0,
      };
    },
    enabled: !!currentOrg?.id,
  });
}

export function useTopProducts(limit = 5) {
  const currentOrg = useOrgStore((s) => s.currentOrg);
  const supabase = createClient();

  return useQuery({
    queryKey: ["top-products", currentOrg?.id, limit],
    queryFn: async (): Promise<TopProduct[]> => {
      if (!currentOrg?.id) return [];

      // Get all sale_items for this org by joining through sales
      const { data, error } = await supabase
        .from("sale_items")
        .select(`
          product_id,
          product_name,
          qty,
          subtotal,
          sale:sales!inner(organization_id, is_voided)
        `)
        .eq("sale.organization_id", currentOrg.id)
        .eq("sale.is_voided", false);

      if (error) throw error;
      if (!data || data.length === 0) return [];

      // Aggregate by product
      const productMap = new Map<string, { product_name: string; qty_sold: number; revenue: number }>();
      for (const item of data) {
        const existing = productMap.get(item.product_id) || {
          product_name: item.product_name,
          qty_sold: 0,
          revenue: 0,
        };
        existing.qty_sold += Number(item.qty);
        existing.revenue += Number(item.subtotal);
        productMap.set(item.product_id, existing);
      }

      return Array.from(productMap.entries())
        .map(([product_id, vals]) => ({ product_id, ...vals }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, limit);
    },
    enabled: !!currentOrg?.id,
  });
}

export function useLowStockProducts() {
  const currentOrg = useOrgStore((s) => s.currentOrg);
  const supabase = createClient();

  return useQuery({
    queryKey: ["low-stock-products", currentOrg?.id],
    queryFn: async (): Promise<LowStockProduct[]> => {
      if (!currentOrg?.id) return [];

      const { data, error } = await supabase
        .from("products")
        .select("id, name, stock, min_stock, sku")
        .eq("organization_id", currentOrg.id)
        .eq("is_active", true);

      if (error) throw error;
      if (!data) return [];

      return data
        .filter((p) => p.stock <= p.min_stock)
        .sort((a, b) => a.stock - b.stock)
        .map((p) => ({
          id: p.id,
          name: p.name,
          stock: p.stock,
          min_stock: p.min_stock,
          sku: p.sku,
        }));
    },
    enabled: !!currentOrg?.id,
  });
}

export function useSalesChart(dateFilter: string) {
  const currentOrg = useOrgStore((s) => s.currentOrg);
  const supabase = createClient();

  return useQuery({
    queryKey: ["sales-chart", currentOrg?.id, dateFilter],
    queryFn: async (): Promise<SalesChartData[]> => {
      if (!currentOrg?.id) return [];

      const { data, error } = await supabase
        .from("sales")
        .select("total, created_at")
        .eq("organization_id", currentOrg.id)
        .neq("is_voided", true)
        .order("created_at", { ascending: true });

      if (error) throw error;
      if (!data || data.length === 0) return [];

      // Group by date
      const dateMap = new Map<string, { revenue: number; transactions: number }>();
      for (const sale of data) {
        const dateKey = new Date(sale.created_at).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
        });
        const existing = dateMap.get(dateKey) || { revenue: 0, transactions: 0 };
        existing.revenue += Number(sale.total);
        existing.transactions += 1;
        dateMap.set(dateKey, existing);
      }

      return Array.from(dateMap.entries()).map(([date, vals]) => ({
        date,
        revenue: vals.revenue,
        transactions: vals.transactions,
      }));
    },
    enabled: !!currentOrg?.id,
  });
}

export function useProductCount() {
  const currentOrg = useOrgStore((s) => s.currentOrg);
  const supabase = createClient();

  return useQuery({
    queryKey: ["product-count", currentOrg?.id],
    queryFn: async () => {
      if (!currentOrg?.id) return { total: 0, categories: 0 };
      const [productRes, catRes] = await Promise.all([
        supabase
          .from("products")
          .select("*", { count: "exact", head: true })
          .eq("organization_id", currentOrg.id)
          .eq("is_active", true),
        supabase
          .from("categories")
          .select("*", { count: "exact", head: true })
          .eq("organization_id", currentOrg.id)
          .eq("type", "product"),
      ]);
      return {
        total: productRes.count || 0,
        categories: catRes.count || 0,
      };
    },
    enabled: !!currentOrg?.id,
  });
}
