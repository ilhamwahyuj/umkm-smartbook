import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useOrgStore } from "@/stores/useOrgStore";
import type { Organization } from "@/types/database";

type OrganizationUpdate = Partial<Organization>;

export function useGetOrganization() {
  const currentOrg = useOrgStore((state) => state.currentOrg);
  const supabase = createClient();

  return useQuery({
    queryKey: ["organization", currentOrg?.id],
    queryFn: async () => {
      if (!currentOrg?.id) return null;
      
      const { data, error } = await supabase
        .from("organizations")
        .select("*")
        .eq("id", currentOrg.id)
        .single();
        
      if (error) throw error;
      return data as Organization;
    },
    enabled: !!currentOrg?.id,
  });
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient();
  const currentOrg = useOrgStore((state) => state.currentOrg);
  const supabase = createClient();

  return useMutation({
    mutationFn: async (payload: OrganizationUpdate) => {
      if (!currentOrg?.id) throw new Error("No organization selected");
      
      const { data, error } = await supabase
        .from("organizations")
        .update(payload)
        .eq("id", currentOrg.id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Invalidate the query to fetch fresh data
      queryClient.invalidateQueries({ queryKey: ["organization", currentOrg?.id] });
      
      // Update global store if name changes
      if (data.name) {
        useOrgStore.setState((state) => ({
          currentOrg: state.currentOrg ? { ...state.currentOrg, name: data.name } : null
        }));
      }
    },
  });
}
