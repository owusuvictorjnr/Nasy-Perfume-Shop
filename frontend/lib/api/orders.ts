import apiClient from "./api-client";

export interface CreateOrderPayload {
  paystackReference: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  shippingMethod: string;
  items: Array<{
    productId: string;
    variantId?: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export async function createOrder(data: CreateOrderPayload) {
  const response = await apiClient.post("/orders", data);
  return response.data;
}

export async function verifyPayment(reference: string) {
  const response = await apiClient.post("/orders/verify-payment", {
    reference,
  });
  return response.data;
}

export async function getUserOrders() {
  const response = await apiClient.get("/orders");
  return response.data;
}

export async function getOrderById(orderId: string) {
  const response = await apiClient.get(`/orders/${orderId}`);
  return response.data;
}
