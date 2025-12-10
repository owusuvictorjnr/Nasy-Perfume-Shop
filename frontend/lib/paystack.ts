/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Paystack integration utilities
 * For Ghana (GHS currency)
 */

import axios from "axios";

export const PAYSTACK_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "";

export interface PaystackConfig {
  email: string;
  amount: number; // in GHS, will be converted to pesewas (multiply by 100)
  publicKey: string;
  reference?: string;
  onSuccess: (reference: any) => void;
  onClose: () => void;
}

/**
 * Initialize Paystack payment
 * Amount should be in GHS, it will be converted to pesewas internally
 */
export const initializePaystackPayment = ({
  email,
  amount,
  publicKey,
  reference,
  onSuccess,
  onClose,
}: PaystackConfig) => {
  console.log("initializePaystackPayment called with:", {
    email,
    amount,
    reference,
    publicKey: publicKey ? publicKey.substring(0, 10) + "..." : "MISSING",
  });

  if (!publicKey) {
    console.error("Paystack public key is not set");
    alert("Paystack public key is not configured");
    return;
  }

  // Check if PaystackPop is available
  if (!(window as any).PaystackPop) {
    console.error("Paystack script not loaded - PaystackPop not found");
    alert(
      "Paystack payment system is not available. Please refresh and try again."
    );
    return;
  }

  const amountInPesewas = Math.round(amount * 100); // Convert GHS to pesewas

  console.log("Setting up Paystack with amount (pesewas):", amountInPesewas);

  try {
    const handler = (window as any).PaystackPop.setup({
      key: publicKey,
      email,
      amount: amountInPesewas,
      currency: "GHS",
      ref: reference || `ref-${Date.now()}`,
      onClose: () => {
        console.log("→ Paystack onClose callback executed");
        if (onClose) {
          onClose();
        }
      },
      callback: (response: any) => {
        console.log(
          "→ Paystack onSuccess callback executed with response:",
          response
        );
        if (onSuccess) {
          onSuccess(response);
        }
      },
    });

    console.log("Opening Paystack iframe...");
    handler.openIframe();
  } catch (error) {
    console.error("Error initializing Paystack:", error);
    alert("Error initializing payment. Please try again.");
  }
};

/**
 * Generate unique reference for Paystack transaction
 */
export const generatePaystackReference = (orderId: string): string => {
  return `order-${orderId}-${Date.now()}`;
};

/**
 * Verify Paystack payment on backend
 * This should be called from a server-side endpoint
 */
export const verifyPaystackPayment = async (
  reference: string,
  backendUrl: string
) => {
  try {
    const response = await axios.get(
      `${backendUrl}/payments/verify-paystack?reference=${reference}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error verifying payment:", error);
    throw error;
  }
};
