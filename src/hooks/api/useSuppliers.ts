// src/hooks/api/useSuppliers.ts
// CRUD hooks for suppliers — Supabase live
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useOrgStore } from "@/stores/useOrgStore";
import type { Supplier } from "@/types/database";

export function useGetSuppliers(search?: string) {
  const currentOrg = useOrgStore((s) => s.currentOrg);
  const supabase = createClient();

  return useQuery({
    queryKey: ["suppliers", currentOrg?.id, search],
    queryFn: async () => {
      if (!currentOrg?.id) return [];

      let query = supabase
        .from("suppliers")
        .select("*")
        .eq("organization_id", currentOrg.id)
        .order("name");

      if (search) {
        query = query.or(
          `name.ilike.%${search}%,contact_name.ilike.%${search}%,phone.ilike.%${search}%`
        );
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Supplier[];
    },
    enabled: !!currentOrg?.id,
  });
}

export function useCreateSupplier() {
  const queryClient = useQueryClient();
  const currentOrg = useOrgStore((s) => s.currentOrg);
  const supabase = createClient();

  return useMutation({
    mutationFn: async (payload: Partial<Supplier>) => {
      if (!currentOrg?.id) throw new Error("No organization");
      const { data, error } = await supabase
        .from("suppliers")
        .insert({ ...payload, organization_id: currentOrg.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async ({ id, ...payload }: Partial<Supplier> & { id: string }) => {
      const { data, error } = await supabase
        .from("suppliers")
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });
}
