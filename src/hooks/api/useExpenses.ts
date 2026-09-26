// src/hooks/api/useExpenses.ts
// CRUD hooks for expenses — Supabase live
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useOrgStore } from "@/stores/useOrgStore";
import type { Expense, ExpenseCategory } from "@/types/database";

export function useGetExpenses(search?: string) {
  const currentOrg = useOrgStore((s) => s.currentOrg);
  const supabase = createClient();

  return useQuery({
    queryKey: ["expenses", currentOrg?.id, search],
    queryFn: async () => {
      if (!currentOrg?.id) return [];

      let query = supabase
        .from("expenses")
        .select(`*, category:expense_categories(*)`)
        .eq("organization_id", currentOrg.id)
        .order("expense_date", { ascending: false });

      const { data, error } = await query;
      if (error) throw error;

      let result = data as Expense[];

      if (search) {
        const q = search.toLowerCase();
        result = result.filter(
          (e) =>
            (e.description ?? "").toLowerCase().includes(q) ||
            (e.category?.name ?? "").toLowerCase().includes(q)
        );
      }

      return result;
    },
    enabled: !!currentOrg?.id,
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();
  const currentOrg = useOrgStore((s) => s.currentOrg);
  const supabase = createClient();

  return useMutation({
    mutationFn: async (payload: Partial<Expense>) => {
      if (!currentOrg?.id) throw new Error("No organization");
      const { data, error } = await supabase
        .from("expenses")
        .insert({ ...payload, organization_id: currentOrg.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
  });
}

export function useGetExpenseCategories() {
  const currentOrg = useOrgStore((s) => s.currentOrg);
  const supabase = createClient();

  return useQuery({
    queryKey: ["expense_categories", currentOrg?.id],
    queryFn: async () => {
      if (!currentOrg?.id) return [];
      const { data, error } = await supabase
        .from("expense_categories")
        .select("*")
        .eq("organization_id", currentOrg.id)
        .order("name");
      if (error) throw error;
      return data as ExpenseCategory[];
    },
    enabled: !!currentOrg?.id,
  });
}
