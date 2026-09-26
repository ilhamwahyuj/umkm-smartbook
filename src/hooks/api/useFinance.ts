// src/hooks/api/useFinance.ts
// Hooks for receivables, payables, and financial data — Supabase live
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useOrgStore } from "@/stores/useOrgStore";
import type { Receivable, Payable } from "@/types/database";

export function useGetReceivables() {
  const currentOrg = useOrgStore((s) => s.currentOrg);
  const supabase = createClient();

  return useQuery({
    queryKey: ["receivables", currentOrg?.id],
    queryFn: async () => {
      if (!currentOrg?.id) return [];
      const { data, error } = await supabase
        .from("receivables")
        .select(`*, customer:customers(*)`)
        .eq("organization_id", currentOrg.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Receivable[];
    },
    enabled: !!currentOrg?.id,
  });
}

export function useGetPayables() {
  const currentOrg = useOrgStore((s) => s.currentOrg);
  const supabase = createClient();

  return useQuery({
    queryKey: ["payables", currentOrg?.id],
    queryFn: async () => {
      if (!currentOrg?.id) return [];
      const { data, error } = await supabase
        .from("payables")
        .select(`*, supplier:suppliers(*)`)
        .eq("organization_id", currentOrg.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Payable[];
    },
    enabled: !!currentOrg?.id,
  });
}

export function useFinancialSummary() {
  const currentOrg = useOrgStore((s) => s.currentOrg);
  const supabase = createClient();

  return useQuery({
    queryKey: ["financial-summary", currentOrg?.id],
    queryFn: async () => {
      if (!currentOrg?.id) return null;

      const [salesRes, expensesRes, receivablesRes, payablesRes] = await Promise.all([
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
          .from("receivables")
          .select("remaining_amount")
          .eq("organization_id", currentOrg.id)
          .in("status", ["unpaid", "partial", "overdue"]),
        supabase
          .from("payables")
          .select("remaining_amount")
          .eq("organization_id", currentOrg.id)
          .in("status", ["unpaid", "partial", "overdue"]),
      ]);

      const revenue = salesRes.data?.reduce((sum, s) => sum + Number(s.total), 0) || 0;
      const totalExpenses = expensesRes.data?.reduce((sum, e) => sum + Number(e.amount), 0) || 0;
      const totalReceivables =
        receivablesRes.data?.reduce((sum, r) => sum + Number(r.remaining_amount), 0) || 0;
      const totalPayables =
        payablesRes.data?.reduce((sum, p) => sum + Number(p.remaining_amount), 0) || 0;

      return {
        revenue,
        totalExpenses,
        totalReceivables,
        totalPayables,
        grossProfit: revenue - totalExpenses,
        cashFlow: revenue - totalExpenses,
      };
    },
    enabled: !!currentOrg?.id,
  });
}
