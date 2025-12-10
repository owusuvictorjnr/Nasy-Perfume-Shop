import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api/api-client";
import type { Order } from "@/lib/api/api-types";

// Get user's orders
export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data } = await apiClient.get<Order[]>("/orders");
      return data;
    },
  });
}

// Get single order
export function useOrder(orderId: string) {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const { data } = await apiClient.get<Order>(`/orders/${orderId}`);
      return data;
    },
    enabled: !!orderId,
  });
}

// Create order
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      shippingAddressId,
      billingAddressId,
      customerNote,
    }: {
      shippingAddressId: string;
      billingAddressId?: string;
      customerNote?: string;
    }) => {
      const { data } = await apiClient.post<Order>("/orders", {
        shippingAddressId,
        billingAddressId,
        customerNote,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

// Cancel order
export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const { data } = await apiClient.put<Order>(`/orders/${orderId}/cancel`);
      return data;
    },
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
    },
  });
}
