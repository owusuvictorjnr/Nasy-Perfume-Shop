"use client";
import React from "react";
import Link from "next/link";
import { formatCurrency, toSlug } from "@/lib/utils";
import type { IProductInput } from "@/types";

interface ProductCardProps {
  product: IProductInput;
  variant?: "default" | "compact" | "featured";
}

export default function ProductCard({
  product,
  variant = "default",
}: ProductCardProps) {
  const slug = product.slug || toSlug(product.name);
  const hasDiscount = product.listPrice && product.listPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.listPrice - product.price) / product.listPrice) * 100
      )
    : 0;
  const imageUrl = product.images?.[0] || "/placeholder.png";

  if (variant === "compact") {
    return (
      <Link href={`/products/${slug}`} className="group">
        <div className="relative border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
          <div className="w-full h-32 bg-gray-100 relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            {hasDiscount && (
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                -{discountPercent}%
              </div>
            )}
          </div>
          <div className="p-2">
            <div className="text-xs font-medium truncate">{product.name}</div>
            <div className="text-xs text-gray-500">
              {formatCurrency(product.price)}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link href={`/products/${slug}`} className="group">
        <div className="border rounded-lg overflow-hidden hover:shadow-xl transition-all">
          <div className="w-full h-64 bg-gray-100 relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            {hasDiscount && (
              <div className="absolute top-3 right-3 bg-red-500 text-white font-bold px-3 py-1 rounded">
                -{discountPercent}%
              </div>
            )}
            {product.featured && (
              <div className="absolute top-3 left-3 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded">
                Featured
              </div>
            )}
          </div>
          <div className="p-4">
            <div className="text-sm font-medium group-hover:text-blue-600 transition-colors">
              {product.name}
            </div>
            <div className="text-xs text-gray-600 mt-1">{product.brand}</div>
            <div className="flex items-baseline gap-2 mt-2">
              <div className="font-bold text-lg">
                {formatCurrency(product.price)}
              </div>
              {hasDiscount && (
                <div className="text-xs text-gray-400 line-through">
                  {formatCurrency(product.listPrice)}
                </div>
              )}
            </div>
            {product.avgRating && (
              <div className="flex items-center gap-1 mt-2">
                <div className="text-yellow-500 text-sm">★</div>
                <div className="text-xs text-gray-600">
                  {product.avgRating} ({product.numReviews})
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  }

  // Default variant
  return (
    <Link href={`/products/${slug}`} className="group">
      <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
        <div className="w-full h-48 bg-gray-100 relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
          {hasDiscount && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              -{discountPercent}%
            </div>
          )}
        </div>
        <div className="p-3">
          <div className="text-sm font-medium group-hover:text-blue-600 transition-colors line-clamp-2">
            {product.name}
          </div>
          <div className="text-xs text-gray-600 mt-1">{product.brand}</div>
          <div className="flex items-baseline gap-2 mt-2">
            <div className="font-bold">{formatCurrency(product.price)}</div>
            {hasDiscount && (
              <div className="text-xs text-gray-400 line-through">
                {formatCurrency(product.listPrice)}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
