import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useOrgStore } from "@/stores/useOrgStore";

export function useDashboardSummary(dateFilter: string) {
  const currentOrg = useOrgStore((state) => state.currentOrg);
  const supabase = createClient();

  return useQuery({
    queryKey: ["dashboard-summary", currentOrg?.id, dateFilter],
    queryFn: async () => {
      if (!currentOrg?.id) return null;

      // TODO: For now, we return mock data structure, but in a real scenario
      // we would aggregate sales, expenses, and receivables here.
      // E.g.
      // const { data: sales } = await supabase.from('sales').select('total').eq('organization_id', currentOrg.id);
      
      // Since this requires complex aggregation, we can either do it in an RPC or JS side.
      // For MVP, doing it JS side:
      
      const { data: sales, error: salesError } = await supabase
        .from("sales")
        .select("total")
        .eq("organization_id", currentOrg.id)
        .neq("is_voided", true);

      const { data: expenses, error: expError } = await supabase
        .from("expenses")
        .select("amount")
        .eq("organization_id", currentOrg.id);

      const { count: customersCount } = await supabase
        .from("customers")
        .select("*", { count: "exact", head: true })
        .eq("organization_id", currentOrg.id);

      const { data: receivables } = await supabase
        .from("receivables")
        .select("remaining_amount")
        .eq("organization_id", currentOrg.id)
        .eq("status", "unpaid");

      if (salesError || expError) throw new Error("Failed to fetch summary");

      const revenue = sales?.reduce((acc, curr) => acc + curr.total, 0) || 0;
      const totalExpenses = expenses?.reduce((acc, curr) => acc + curr.amount, 0) || 0;
      const totalReceivables = receivables?.reduce((acc, curr) => acc + curr.remaining_amount, 0) || 0;

      return {
        revenue,
        revenue_change_percent: 0,
        gross_profit: revenue - totalExpenses,
        gross_profit_change_percent: 0,
        expenses: totalExpenses,
        expenses_change_percent: 0,
        receivables: totalReceivables,
        total_transactions: sales?.length || 0,
        total_customers: customersCount || 0,
      };
    },
    enabled: !!currentOrg?.id,
  });
}
