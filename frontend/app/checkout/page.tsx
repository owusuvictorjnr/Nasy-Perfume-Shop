"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/features/cart/hooks/use-cart";
import { formatCurrency } from "@/lib/utils";
import { createOrder } from "@/lib/api/orders";
import {
  initializePaystackPayment,
  generatePaystackReference,
  PAYSTACK_PUBLIC_KEY,
} from "@/lib/paystack";
import Link from "next/link";

interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentMethod {
  type: "paystack";
}

const SHIPPING_RATES = {
  standard: { name: "Standard (5-7 days)", cost: 10 },
  express: { name: "Express (2-3 days)", cost: 25 },
  overnight: { name: "Overnight", cost: 50 },
};

export default function CheckoutPage() {
  const router = useRouter();
  const { data: cart, isLoading } = useCart();
  const [step, setStep] = useState<"shipping" | "payment" | "review">(
    "shipping"
  );
  const [shippingMethod, setShippingMethod] =
    useState<keyof typeof SHIPPING_RATES>("standard");
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    type: "paystack",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Load Paystack script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => {
      console.log("Paystack script loaded successfully");
    };
    script.onerror = () => {
      console.error("Failed to load Paystack script");
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (!isLoading && (!cart || cart.items.length === 0)) {
      router.push("/cart");
    }
  }, [cart, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return null;
  }

  // Calculate proper prices from product/variant data
  const validCartItems = cart.items.map((item) => {
    const product = item.product;
    const variant = item.variant;
    const price = variant
      ? variant.salePrice || variant.price
      : product?.salePrice || product?.basePrice || 0;
    const total = price * item.quantity;

    return {
      ...item,
      price: Number(price) || 0,
      total: Number(total) || 0,
    };
  });

  const subtotal = validCartItems.reduce((sum, item) => sum + item.total, 0);
  const shippingCost =
    SHIPPING_RATES[shippingMethod as keyof typeof SHIPPING_RATES].cost;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shippingCost + tax;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      shippingAddress.firstName &&
      shippingAddress.lastName &&
      shippingAddress.email &&
      shippingAddress.address &&
      shippingAddress.city &&
      shippingAddress.zipCode
    ) {
      setStep("payment");
    }
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Proceed to review step (actual payment happens after order review)
    setStep("review");
  };

  const handlePaystackSuccess = (reference: any) => {
    console.log("Payment successful", reference);
    // Create order after successful payment
    handlePlaceOrder();
  };

  const handlePaystackClose = () => {
    console.log("Paystack payment window closed");
    alert("Payment was not completed. Please try again.");
  };

  const handlePlaceOrder = async () => {
    if (!PAYSTACK_PUBLIC_KEY) {
      alert("Payment configuration is missing. Please try again later.");
      return;
    }

    console.log("Starting payment process with key:", PAYSTACK_PUBLIC_KEY);
    setIsProcessing(true);

    try {
      // Initialize Paystack payment
      const paystackRef = generatePaystackReference(Date.now().toString());
      console.log("Generated Paystack reference:", paystackRef);

      initializePaystackPayment({
        email: shippingAddress.email,
        amount: total,
        publicKey: PAYSTACK_PUBLIC_KEY,
        reference: paystackRef,
        onSuccess: async (response) => {
          console.log("✓ PAYMENT SUCCESS CALLBACK TRIGGERED", response);

          try {
            // Prepare order data for backend
            const orderData = {
              paystackReference: response?.reference || paystackRef,
              shippingAddress: {
                firstName: shippingAddress.firstName,
                lastName: shippingAddress.lastName,
                email: shippingAddress.email,
                phone: shippingAddress.phone,
                address: shippingAddress.address,
                city: shippingAddress.city,
                state: shippingAddress.state,
                zipCode: shippingAddress.zipCode,
                country: shippingAddress.country,
              },
              shippingMethod: SHIPPING_RATES[shippingMethod].name,
              items: validCartItems.map((item) => ({
                productId: item.productId,
                variantId: item.variantId || undefined,
                quantity: item.quantity,
                price: item.price,
              })),
              subtotal,
              shipping: shippingCost,
              tax,
              total,
            };

            console.log("Creating order on backend...", orderData);

            // Create order on backend
            const createdOrder = await createOrder(orderData);
            console.log("Order created successfully:", createdOrder);

            // Prepare order payload for frontend confirmation page
            const orderPayload = {
              id:
                createdOrder.orderNumber || response?.reference || paystackRef,
              reference: response?.reference || paystackRef,
              date: new Date().toISOString(),
              items: validCartItems.map((item) => ({
                id: item.id,
                name: item.product?.name || "Item",
                quantity: item.quantity,
                price: item.price,
                total: item.total,
                image: item.product?.images?.[0] || "/placeholder.png",
              })),
              subtotal,
              shipping: shippingCost,
              tax,
              total,
              shippingAddress: {
                name: `${shippingAddress.firstName} ${shippingAddress.lastName}`.trim(),
                address: shippingAddress.address,
                city: shippingAddress.city,
                state: shippingAddress.state,
                zipCode: shippingAddress.zipCode,
                country: shippingAddress.country,
                email: shippingAddress.email,
                phone: shippingAddress.phone,
              },
              shippingMethod: SHIPPING_RATES[shippingMethod].name,
              paymentMethod: "Paystack",
              status: "confirmed",
            };

            sessionStorage.setItem("lastOrder", JSON.stringify(orderPayload));

            setIsProcessing(false);
            // Use replace instead of push to prevent back button issues
            router.replace("/orders/confirmation");
          } catch (error) {
            console.error("Failed to create order:", error);
            setIsProcessing(false);
            alert(
              "Payment successful but order creation failed. Please contact support."
            );
          }
        },
        onClose: () => {
          console.log("✗ PAYMENT WINDOW CLOSED");
          setIsProcessing(false);
          alert("Payment window closed. Please try again.");
        },
      });
    } catch (error) {
      console.error("Error in handlePlaceOrder:", error);
      setIsProcessing(false);
      alert("Failed to process payment. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
          <div className="flex gap-2">
            {["shipping", "payment", "review"].map((s) => (
              <div
                key={s}
                className={`flex-1 h-2 rounded ${
                  ["shipping", "payment", "review"].indexOf(s) <
                  ["shipping", "payment", "review"].indexOf(step)
                    ? "bg-green-500"
                    : s === step
                    ? "bg-purple-600"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            {/* Shipping Address */}
            {step === "shipping" && (
              <form
                onSubmit={handleShippingSubmit}
                className="bg-white rounded-lg shadow p-8 space-y-6"
              >
                <h2 className="text-2xl font-bold text-gray-900">
                  Shipping Address
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={shippingAddress.firstName}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        firstName: e.target.value,
                      })
                    }
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={shippingAddress.lastName}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        lastName: e.target.value,
                      })
                    }
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
                    required
                  />
                </div>

                <input
                  type="email"
                  placeholder="Email"
                  value={shippingAddress.email}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      email: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
                  required
                />

                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={shippingAddress.phone}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      phone: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
                  required
                />

                <input
                  type="text"
                  placeholder="Street Address"
                  value={shippingAddress.address}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      address: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="City"
                    value={shippingAddress.city}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        city: e.target.value,
                      })
                    }
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
                    required
                  />
                  <input
                    type="text"
                    placeholder="State/Province"
                    value={shippingAddress.state}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        state: e.target.value,
                      })
                    }
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="ZIP Code"
                    value={shippingAddress.zipCode}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        zipCode: e.target.value,
                      })
                    }
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
                    required
                  />
                  <select
                    value={shippingAddress.country}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        country: e.target.value,
                      })
                    }
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                    <option value="AU">Australia</option>
                  </select>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Shipping Method
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(SHIPPING_RATES).map(([key, value]) => (
                      <label
                        key={key}
                        className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="shipping"
                          value={key}
                          checked={shippingMethod === key}
                          onChange={(e) =>
                            setShippingMethod(
                              e.target.value as keyof typeof SHIPPING_RATES
                            )
                          }
                          className="w-4 h-4"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {value.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatCurrency(value.cost)}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Link
                    href="/cart"
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-900 hover:bg-gray-50 transition text-center"
                  >
                    Back to Cart
                  </Link>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition"
                  >
                    Continue to Payment
                  </button>
                </div>
              </form>
            )}

            {/* Payment Method */}
            {step === "payment" && (
              <form
                onSubmit={handlePaymentSubmit}
                className="bg-white rounded-lg shadow p-8 space-y-6"
              >
                <h2 className="text-2xl font-bold text-gray-900">
                  Payment Method
                </h2>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 1C6.48 1 2 5.48 2 11s4.48 10 10 10 10-4.48 10-10S17.52 1 12 1zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 7 15.5 7 14 7.67 14 8.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 7 8.5 7 7 7.67 7 8.5 7.67 10 8.5 10zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">
                        Paystack Payment
                      </p>
                      <p className="text-sm text-gray-600">
                        Secure payment via Paystack - supports all major cards
                        and mobile money
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Order Summary
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">
                        {formatCurrency(subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping:</span>
                      <span className="font-medium">
                        {formatCurrency(shippingCost)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax:</span>
                      <span className="font-medium">{formatCurrency(tax)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <span className="font-bold text-gray-900">Total:</span>
                      <span className="font-bold text-purple-600">
                        {formatCurrency(total)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep("shipping")}
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-900 hover:bg-gray-50 transition"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition"
                  >
                    Continue to Review
                  </button>
                </div>
              </form>
            )}

            {/* Order Review */}
            {step === "review" && (
              <div className="bg-white rounded-lg shadow p-8 space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Order Review
                </h2>

                <div className="border-b border-gray-200 pb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Shipping Address
                  </h3>
                  <p className="text-gray-600">
                    {shippingAddress.firstName} {shippingAddress.lastName}
                    <br />
                    {shippingAddress.address}
                    <br />
                    {shippingAddress.city}, {shippingAddress.state}{" "}
                    {shippingAddress.zipCode}
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-6 space-y-4">
                  <h3 className="font-semibold text-gray-900">
                    Payment Method
                  </h3>
                  <p className="text-gray-600">
                    Paystack - Secure payment gateway
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep("payment")}
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-900 hover:bg-gray-50 transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition"
                  >
                    {isProcessing ? "Processing..." : "Pay with Paystack"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow sticky top-4 p-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Order Summary</h3>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {validCartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div>
                      <p className="text-gray-900 font-medium">
                        {item.product?.name || item.variant?.name || "Item"} x{" "}
                        {item.quantity}
                      </p>
                      <p className="text-gray-500">
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                    <p className="font-medium text-gray-900">
                      {formatCurrency(item.total)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{formatCurrency(shippingCost)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (10%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-4 border-t border-gray-200">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              <button
                className="w-full mt-6 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition disabled:bg-gray-400"
                disabled={step !== "review" || isProcessing}
              >
                {isProcessing ? "Processing..." : "Place Order"}
              </button>

              <Link
                href="/cart"
                className="block text-center text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Edit Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
