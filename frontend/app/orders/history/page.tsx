"use client";

import { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/utils";
import { getUserOrders } from "@/lib/api/orders";
import Link from "next/link";

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  paymentStatus: string;
  total: number;
  items: Array<{
    id: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
}

const statusStyles: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  ON_HOLD: "bg-orange-100 text-orange-800",
};

const statusLabels: Record<string, string> = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  ON_HOLD: "On Hold",
};

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        setIsLoading(true);
        const data = await getUserOrders();
        setOrders(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Failed to load orders. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrders();
  }, []);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 py-12 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 py-12 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Order History
          </h1>
          <p className="text-gray-600">
            View and track all your orders in one place
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2v-9a2 2 0 012-2z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No Orders Yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start shopping to see your orders here
            </p>
            <Link
              href="/"
              className="inline-block px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition"
              >
                <button
                  onClick={() =>
                    setSelectedOrder(
                      selectedOrder === order.id ? null : order.id
                    )
                  }
                  className="w-full p-6 text-left hover:bg-gray-50 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          {order.orderNumber}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            statusStyles[order.status] || statusStyles.PENDING
                          }`}
                        >
                          {statusLabels[order.status] || order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {formatCurrency(order.total)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.items.length} item
                        {order.items.length > 1 ? "s" : ""}
                      </p>
                    </div>

                    <svg
                      className={`w-6 h-6 text-gray-400 ml-4 transition-transform ${
                        selectedOrder === order.id ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </div>
                </button>

                {/* Expanded Order Details */}
                {selectedOrder === order.id && (
                  <div className="border-t border-gray-200 p-6 bg-gray-50 space-y-6">
                    {/* Timeline */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">
                        Delivery Status
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-start gap-4">
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-4 h-4 rounded-full ${
                                order.status !== "pending"
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                              }`}
                            />
                            <div
                              className={`w-1 h-12 ${
                                order.status !== "pending" &&
                                order.status !== "shipped"
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                              }`}
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              Order Confirmed
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-4 h-4 rounded-full ${
                                order.status !== "pending"
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                              }`}
                            />
                            <div
                              className={`w-1 h-12 ${
                                order.status === "delivered"
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                              }`}
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Shipped</p>
                            <p className="text-sm text-gray-500">
                              {order.status !== "pending"
                                ? "In transit"
                                : "Pending"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div
                            className={`w-4 h-4 rounded-full ${
                              order.status === "delivered"
                                ? "bg-green-500"
                                : "bg-gray-300"
                            }`}
                          />
                          <div>
                            <p className="font-medium text-gray-900">
                              Delivered
                            </p>
                            <p className="text-sm text-gray-500">
                              {order.status === "delivered"
                                ? "Delivered"
                                : "In transit"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <button className="px-4 py-2 border border-purple-600 text-purple-600 hover:bg-purple-50 rounded-lg font-medium transition">
                        View Details
                      </button>
                      <button className="px-4 py-2 border border-purple-600 text-purple-600 hover:bg-purple-50 rounded-lg font-medium transition">
                        Track Shipment
                      </button>
                      {order.status === "delivered" && (
                        <button className="px-4 py-2 border border-purple-600 text-purple-600 hover:bg-purple-50 rounded-lg font-medium transition">
                          Reorder
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
