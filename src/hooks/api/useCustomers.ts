// src/hooks/api/useCustomers.ts
// CRUD hooks for customers — Supabase live
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useOrgStore } from "@/stores/useOrgStore";
import type { Customer } from "@/types/database";

export function useGetCustomers(search?: string) {
  const currentOrg = useOrgStore((s) => s.currentOrg);
  const supabase = createClient();

  return useQuery({
    queryKey: ["customers", currentOrg?.id, search],
    queryFn: async () => {
      if (!currentOrg?.id) return [];

      let query = supabase
        .from("customers")
        .select("*")
        .eq("organization_id", currentOrg.id)
        .order("name");

      if (search) {
        query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Customer[];
    },
    enabled: !!currentOrg?.id,
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  const currentOrg = useOrgStore((s) => s.currentOrg);
  const supabase = createClient();

  return useMutation({
    mutationFn: async (payload: Partial<Customer>) => {
      if (!currentOrg?.id) throw new Error("No organization");
      const { data, error } = await supabase
        .from("customers")
        .insert({ ...payload, organization_id: currentOrg.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async ({ id, ...payload }: Partial<Customer> & { id: string }) => {
      const { data, error } = await supabase
        .from("customers")
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
}
