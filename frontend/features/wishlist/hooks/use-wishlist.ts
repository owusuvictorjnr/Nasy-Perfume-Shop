import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api/api-client";
import type { WishlistItem } from "@/lib/api/api-types";

// Get user's wishlist
export function useWishlist() {
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const { data } = await apiClient.get<WishlistItem[]>("/wishlist");
      return data;
    },
  });
}

// Add to wishlist
export function useAddToWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      const { data } = await apiClient.post<WishlistItem>("/wishlist/items", {
        productId,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
}

// Remove from wishlist
export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      await apiClient.delete(`/wishlist/items/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
}
