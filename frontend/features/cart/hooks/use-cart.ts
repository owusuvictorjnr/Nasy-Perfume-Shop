import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api/api-client";
import type { Cart, CartItem } from "@/lib/api/api-types";

// Get user's cart
export function useCart() {
  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const { data } = await apiClient.get<Cart>("/cart");
      return data;
    },
  });
}

// Add item to cart
export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      variantId,
      quantity = 1,
    }: {
      productId: string;
      variantId?: string;
      quantity?: number;
    }) => {
      const { data } = await apiClient.post<CartItem>("/cart/items", {
        productId,
        variantId,
        quantity,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

// Update cart item quantity
export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      itemId,
      quantity,
    }: {
      itemId: string;
      quantity: number;
    }) => {
      const { data } = await apiClient.put<CartItem>(`/cart/items/${itemId}`, {
        quantity,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

// Remove item from cart
export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: string) => {
      await apiClient.delete(`/cart/items/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

// Clear cart
export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiClient.delete("/cart");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}
