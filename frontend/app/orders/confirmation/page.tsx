"use client";

import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

export default function OrderConfirmationPage() {
  const [order, setOrder] = useState<any | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("lastOrder");
      if (raw) {
        const parsed = JSON.parse(raw);
        setOrder({
          ...parsed,
          date: parsed.date || new Date().toISOString(),
          items: parsed.items || [],
        });
      }
    } catch (error) {
      console.error("Failed to load order data", error);
    }
  }, []);

  if (!order) {
    return (
      <main className="min-h-screen bg-gray-50 py-12 px-4 md:px-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            No recent order found
          </h1>
          <p className="text-gray-600 mb-6">
            We couldn&apos;t find a recent order to display. Please return to
            the shop or check your order history.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              Continue Shopping
            </Link>
            <Link
              href="/orders/history"
              className="px-6 py-3 border border-purple-600 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition"
            >
              Order History
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Message */}
        <div className="bg-white rounded-lg shadow p-8 text-center mb-8">
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Thank You for Your Order!
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Your order has been confirmed and will be shipped soon.
          </p>
          <p className="text-2xl font-bold text-purple-600 mb-4">
            Order #{order.id || "-"}
          </p>
          <p className="text-gray-500">
            Order Date:{" "}
            {order.date ? new Date(order.date).toLocaleString() : "-"}
          </p>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Shipping Address
            </h2>
            <div className="text-gray-600 space-y-2">
              <p className="font-medium text-gray-900">
                {order.shippingAddress?.name || "-"}
              </p>
              {order.shippingAddress?.email && (
                <p className="text-sm text-gray-500">
                  {order.shippingAddress.email}
                </p>
              )}
              {order.shippingAddress?.phone && (
                <p className="text-sm text-gray-500">
                  {order.shippingAddress.phone}
                </p>
              )}
              <p>{order.shippingAddress?.address}</p>
              <p>
                {order.shippingAddress?.city}
                {order.shippingAddress?.state
                  ? `, ${order.shippingAddress.state}`
                  : ""}
                {order.shippingAddress?.zipCode
                  ? ` ${order.shippingAddress.zipCode}`
                  : ""}
              </p>
              <p>{order.shippingAddress?.country}</p>
            </div>
          </div>

          {/* Shipping & Payment Info */}
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                Shipping Method
              </h3>
              <p className="text-gray-900 font-medium">
                {order.shippingMethod || "-"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                Payment Method
              </h3>
              <p className="text-gray-900 font-medium">
                {order.paymentMethod || "Paystack"}
              </p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Order Items</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {order.items.map((item: any) => (
              <div
                key={item.id}
                className="p-6 flex items-center gap-4 hover:bg-gray-50"
              >
                <Image
                  height={50}
                  width={50}
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    {formatCurrency(item.total ?? item.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-gray-50 px-6 py-4 space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal ?? 0)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>{formatCurrency(order.shipping ?? 0)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax</span>
              <span>{formatCurrency(order.tax ?? 0)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900 pt-4 border-t border-gray-200">
              <span>Total</span>
              <span>{formatCurrency(order.total ?? 0)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <Link
            href="/orders/history"
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition"
          >
            View Order History
          </Link>
          <Link
            href="/"
            className="px-8 py-3 border border-purple-600 text-purple-600 hover:bg-purple-50 rounded-lg font-semibold transition"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">
            What&apos;s Next?
          </h3>
          <ul className="text-blue-800 space-y-2 text-sm">
            <li>✓ We&apos;ll send you a shipping confirmation email soon</li>
            <li>✓ Track your order in the Order History section</li>
            <li>✓ Estimated delivery: 5-7 business days</li>
            <li>
              ✓ Have questions?{" "}
              <a href="/contact" className="underline hover:no-underline">
                Contact support
              </a>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
