"use client";

import { useState } from "react";
import ProductCard from "@/app/(home)/components/ProductCard";
import { products } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

// Mock wishlist data
const mockWishlist = products.slice(0, 6);

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState(mockWishlist);

  const handleRemoveFromWishlist = (slug: string) => {
    setWishlist(wishlist.filter((product) => product.slug !== slug));
  };

  const handleAddToCart = (productName: string) => {
    // TODO: Integrate with actual cart
    alert(`${productName} added to cart!`);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Wishlist</h1>
          <p className="text-gray-600">
            {wishlist.length} item{wishlist.length !== 1 ? "s" : ""} saved
          </p>
        </div>

        {wishlist.length === 0 ? (
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
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Your Wishlist is Empty
            </h2>
            <p className="text-gray-600 mb-6">
              Start adding your favorite products to your wishlist
            </p>
            <Link
              href="/"
              className="inline-block px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <>
            {/* Grid View */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
              {wishlist.map((product) => (
                <div key={product.slug} className="relative">
                  <ProductCard product={product} variant="compact" />
                  <button
                    onClick={() => handleRemoveFromWishlist(product.slug)}
                    className="absolute top-2 right-2 w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition z-10"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M6 18L18 6M6 6l12 12"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Table View for larger screens */}
            <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-900 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {wishlist.map((product) => (
                      <tr
                        key={product.slug}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <img
                              src={product.images?.[0] || "/placeholder.png"}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div>
                              <p className="font-medium text-gray-900">
                                {product.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {product.brand}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(product.price)}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                            In Stock
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(product.avgRating || 0)
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                            <span className="ml-2 text-sm text-gray-600">
                              ({product.numReviews || 0})
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => handleAddToCart(product.name)}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition"
                          >
                            Add to Cart
                          </button>
                          <button
                            onClick={() =>
                              handleRemoveFromWishlist(product.slug)
                            }
                            className="px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-12 flex gap-4 justify-center">
              <Link
                href="/"
                className="px-8 py-3 border border-purple-600 text-purple-600 hover:bg-purple-50 rounded-lg font-semibold transition"
              >
                Continue Shopping
              </Link>
              <button className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition">
                Add All to Cart
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
