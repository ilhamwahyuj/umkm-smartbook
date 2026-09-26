// src/hooks/api/useProducts.ts
// CRUD hooks for products, categories, and units — Supabase live
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useOrgStore } from "@/stores/useOrgStore";
import type { Product, Category, Unit } from "@/types/database";

// ============================
// PRODUCTS
// ============================
export function useGetProducts(filters?: { search?: string; stockFilter?: string }) {
  const currentOrg = useOrgStore((s) => s.currentOrg);
  const supabase = createClient();

  return useQuery({
    queryKey: ["products", currentOrg?.id, filters],
    queryFn: async () => {
      if (!currentOrg?.id) return [];

      let query = supabase
        .from("products")
        .select(`*, category:categories(*), unit:units(*)`)
        .eq("organization_id", currentOrg.id)
        .order("created_at", { ascending: false });

      if (filters?.search) {
        query = query.or(
          `name.ilike.%${filters.search}%,sku.ilike.%${filters.search}%,barcode.ilike.%${filters.search}%`
        );
      }

      const { data, error } = await query;
      if (error) throw error;

      let result = data as Product[];

      // Client-side stock filter (comparing stock vs min_stock requires JS)
      if (filters?.stockFilter && filters.stockFilter !== "semua") {
        result = result.filter((p) => {
          if (filters.stockFilter === "habis") return p.stock <= 0;
          if (filters.stockFilter === "menipis") return p.stock > 0 && p.stock <= p.min_stock;
          if (filters.stockFilter === "aman") return p.stock > p.min_stock;
          return true;
        });
      }

      return result;
    },
    enabled: !!currentOrg?.id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const currentOrg = useOrgStore((s) => s.currentOrg);
  const supabase = createClient();

  return useMutation({
    mutationFn: async (payload: Partial<Product>) => {
      if (!currentOrg?.id) throw new Error("No organization");
      const { data, error } = await supabase
        .from("products")
        .insert({ ...payload, organization_id: currentOrg.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async ({ id, ...payload }: Partial<Product> & { id: string }) => {
      const { data, error } = await supabase
        .from("products")
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

// ============================
// CATEGORIES
// ============================
export function useGetCategories(type?: "product" | "expense") {
  const currentOrg = useOrgStore((s) => s.currentOrg);
  const supabase = createClient();

  return useQuery({
    queryKey: ["categories", currentOrg?.id, type],
    queryFn: async () => {
      if (!currentOrg?.id) return [];
      let query = supabase
        .from("categories")
        .select("*")
        .eq("organization_id", currentOrg.id)
        .order("name");

      if (type) query = query.eq("type", type);

      const { data, error } = await query;
      if (error) throw error;
      return data as Category[];
    },
    enabled: !!currentOrg?.id,
  });
}

// ============================
// UNITS
// ============================
export function useGetUnits() {
  const currentOrg = useOrgStore((s) => s.currentOrg);
  const supabase = createClient();

  return useQuery({
    queryKey: ["units", currentOrg?.id],
    queryFn: async () => {
      if (!currentOrg?.id) return [];
      const { data, error } = await supabase
        .from("units")
        .select("*")
        .eq("organization_id", currentOrg.id)
        .order("name");
      if (error) throw error;
      return data as Unit[];
    },
    enabled: !!currentOrg?.id,
  });
}
