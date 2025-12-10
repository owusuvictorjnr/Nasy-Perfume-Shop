"use client";
import React from "react";
import { products } from "@/lib/data";
import Link from "next/link";
import { formatCurrency, toSlug } from "@/lib/utils";
import type { IProductInput } from "@/types";

const groupBySubcategory = (items: IProductInput[]) => {
  return items.reduce<Record<string, IProductInput[]>>((acc, item) => {
    const key = item.subcategory || "Other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
};

export default function ProductSections() {
  const grouped = groupBySubcategory(products.filter((p) => p.isPublished));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {Object.keys(grouped).map((subcat) => (
        <section key={subcat} className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{subcat}</h2>
            <Link
              href={`/category/${toSlug(subcat)}`}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {grouped[subcat].slice(0, 10).map((p) => {
              const slug = p.slug || toSlug(p.name);
              const imageUrl = p.images?.[0] || "/placeholder.png";
              const hasDiscount = p.listPrice && p.listPrice > p.price;

              return (
                <Link key={slug} href={`/products/${slug}`} className="group">
                  <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="w-full h-40 bg-gray-100 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imageUrl}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      {hasDiscount && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          -
                          {Math.round(
                            ((p.listPrice - p.price) / p.listPrice) * 100
                          )}
                          %
                        </div>
                      )}
                    </div>
                    <div className="p-2">
                      <div className="text-sm font-medium line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {p.name}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {p.brand}
                      </div>
                      <div className="flex items-baseline gap-1 mt-1">
                        <div className="font-bold text-sm">
                          {formatCurrency(p.price)}
                        </div>
                        {hasDiscount && (
                          <div className="text-xs text-gray-400 line-through">
                            {formatCurrency(p.listPrice)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
