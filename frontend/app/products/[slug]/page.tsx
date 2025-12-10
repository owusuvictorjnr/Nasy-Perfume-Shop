"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProduct } from "@/features/products/hooks/use-products";
import { useAddToCart } from "@/features/cart/hooks/use-cart";
import { useAddToWishlist } from "@/features/wishlist/hooks/use-wishlist";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { data: product, isLoading, error } = useProduct(slug);
  const addToCart = useAddToCart();
  const addToWishlist = useAddToWishlist();

  const [selectedVariant, setSelectedVariant] = useState<string>();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const handleAddToCart = () => {
    if (!product) return;

    addToCart.mutate(
      {
        productId: product.id,
        variantId: selectedVariant,
        quantity,
      },
      {
        onSuccess: () => {
          alert("Added to cart!");
        },
        onError: (error) => {
          alert("Please login to add items to cart");
        },
      }
    );
  };

  const handleAddToWishlist = () => {
    if (!product) return;

    addToWishlist.mutate(product.id, {
      onSuccess: () => {
        alert("Added to wishlist!");
      },
      onError: () => {
        alert("Please login to add items to wishlist");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            The product you're looking for doesn't exist.
          </p>
          <Link
            href="/products"
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const currentPrice = product.salePrice || product.basePrice;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <Link href="/" className="text-gray-600 hover:text-purple-600">
            Home
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link
            href="/products"
            className="text-gray-600 hover:text-purple-600"
          >
            Products
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Images */}
          <div>
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
              {product.images && product.images[activeImage] ? (
                <img
                  src={product.images[activeImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image Available
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`aspect-square bg-white rounded-lg overflow-hidden border-2 ${
                      activeImage === index
                        ? "border-purple-600"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {/* Badges */}
            <div className="flex gap-2 mb-4">
              {product.isFeatured && (
                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                  Featured
                </span>
              )}
              {product.isNew && (
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                  New
                </span>
              )}
              {product.isBestSeller && (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full">
                  Best Seller
                </span>
              )}
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>

            {product.brand && (
              <p className="text-lg text-gray-600 mb-4">by {product.brand}</p>
            )}

            {/* Rating */}
            {product.averageRating > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={
                        star <= product.averageRating
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-gray-600">
                  {product.averageRating.toFixed(1)} ({product.reviewCount}{" "}
                  reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="mb-6">
              {product.salePrice ? (
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-purple-600">
                    {formatCurrency(product.salePrice)}
                  </span>
                  <span className="text-xl text-gray-400 line-through">
                    {formatCurrency(product.basePrice)}
                  </span>
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-sm rounded">
                    Save {formatCurrency(product.basePrice - product.salePrice)}
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-gray-900">
                  {formatCurrency(product.basePrice)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.isInStock ? (
                <p className="text-green-600 font-medium">
                  ✓ In Stock ({product.stockQuantity} available)
                </p>
              ) : (
                <p className="text-red-600 font-medium">✗ Out of Stock</p>
              )}
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Variant
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant.id)}
                      className={`p-3 border-2 rounded-lg text-left ${
                        selectedVariant === variant.id
                          ? "border-purple-600 bg-purple-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <p className="font-medium">{variant.name}</p>
                      <p className="text-sm text-gray-600">
                        {formatCurrency(variant.salePrice || variant.price)}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-20 text-center border border-gray-300 rounded-lg px-3 py-2"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={!product.isInStock || addToCart.isPending}
                className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {addToCart.isPending ? "Adding..." : "Add to Cart"}
              </button>
              <button
                onClick={handleAddToWishlist}
                disabled={addToWishlist.isPending}
                className="px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 font-medium"
              >
                ♥
              </button>
            </div>

            {/* Description */}
            {product.description && (
              <div className="border-t pt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  Description
                </h2>
                <p className="text-gray-700 whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        {product.reviews && product.reviews.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Customer Reviews
            </h2>
            <div className="space-y-6">
              {product.reviews.map((review) => (
                <div key={review.id} className="border-b pb-6 last:border-b-0">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={
                            star <= review.rating
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="font-medium text-gray-900">
                      {review.user?.firstName} {review.user?.lastName}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {review.title && (
                    <h3 className="font-medium text-gray-900 mb-1">
                      {review.title}
                    </h3>
                  )}
                  {review.comment && (
                    <p className="text-gray-700">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
