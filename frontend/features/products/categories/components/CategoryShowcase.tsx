"use client";

import { products } from "@/lib/data";
import ProductCard from "@/app/(home)/components/ProductCard";
import Link from "next/link";
import { useMemo } from "react";

interface SubcategoryGroup {
  subcategory: string;
  category: string;
  items: typeof products;
}

export default function CategoryShowcase() {
  const groupedBySubcategory = useMemo(() => {
    const groups: { [key: string]: SubcategoryGroup } = {};

    products.forEach((product) => {
      const subcat = product.subcategory || "Other";
      const key = `${product.category}-${subcat}`;

      if (!groups[key]) {
        groups[key] = {
          subcategory: subcat,
          category: product.category,
          items: [],
        };
      }

      groups[key].items.push(product);
    });

    return Object.values(groups);
  }, []);

  return (
    <div className="w-full space-y-12 py-12 px-4 md:px-8">
      {groupedBySubcategory.map((group) => (
        <div
          key={`${group.category}-${group.subcategory}`}
          className="space-y-6"
        >
          {/* Subcategory Title with Category Tag */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-xl md:text-2xl font-semibold text-gray-800 capitalize">
                {group.subcategory}
              </h3>
              <span className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full capitalize">
                {group.category}
              </span>
            </div>
            {group.items.length > 6 && (
              <Link
                href={`/category/${group.category}/${group.subcategory}`}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition"
              >
                View All →
              </Link>
            )}
          </div>

          {/* Product Grid - Show up to 6 items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {group.items.slice(0, 6).map((product) => (
              <ProductCard
                key={product.slug}
                product={product}
                variant="compact"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
