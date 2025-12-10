import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api/api-client";
import type { Category } from "@/lib/api/api-types";

// Get all categories
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await apiClient.get<Category[]>("/categories");
      return data;
    },
  });
}

// Get single category by slug
export function useCategory(slug: string) {
  return useQuery({
    queryKey: ["category", slug],
    queryFn: async () => {
      const { data } = await apiClient.get<Category>(`/categories/${slug}`);
      return data;
    },
    enabled: !!slug,
  });
}
