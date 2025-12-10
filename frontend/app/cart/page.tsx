"use client";

import {
  useCart,
  useUpdateCartItem,
  useRemoveFromCart,
  useClearCart,
} from "@/features/cart/hooks/use-cart";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { data: cart, isLoading } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveFromCart();
  const clearCart = useClearCart();
  const router = useRouter();

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    updateItem.mutate({ itemId, quantity });
  };

  const handleRemoveItem = (itemId: string) => {
    if (confirm("Remove this item from cart?")) {
      removeItem.mutate(itemId);
    }
  };

  const handleClearCart = () => {
    if (confirm("Clear all items from cart?")) {
      clearCart.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-gray-600 mb-8">
            Add some products to get started!
          </p>
          <Link
            href="/products"
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <button
            onClick={handleClearCart}
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => {
              const product = item.product;
              const variant = item.variant;
              const price = variant
                ? variant.salePrice || variant.price
                : product?.salePrice || product?.basePrice || 0;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-sm p-6"
                >
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {product?.images && product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <Link
                        href={`/products/${product?.slug}`}
                        className="font-semibold text-gray-900 hover:text-purple-600 mb-1 block"
                      >
                        {product?.name}
                      </Link>
                      {variant && (
                        <p className="text-sm text-gray-600 mb-2">
                          {variant.name}
                        </p>
                      )}
                      <p className="text-lg font-bold text-purple-600">
                        {formatCurrency(price)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col items-end gap-4">
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-50"
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-50"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-sm text-gray-600">
                        Subtotal: {formatCurrency(price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Items ({cart.itemCount})</span>
                  <span>{formatCurrency(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>{formatCurrency(cart.subtotal)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => router.push("/checkout")}
                className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium mb-3"
              >
                Proceed to Checkout
              </button>

              <Link
                href="/products"
                className="block text-center text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
