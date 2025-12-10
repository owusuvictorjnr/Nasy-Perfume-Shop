"use client";

import Link from "next/link";
import { useCategories } from "../hooks/use-categories";
import { Loader2 } from "lucide-react";
import type { Category } from "@/lib/api/api-types";

export function CategoryList() {
  const { data: categories, isLoading, error } = useCategories();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        Failed to load categories. Please try again later.
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {categories.map((category: Category) => (
        <div
          key={category.id}
          className="group relative bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100"
        >
          {/* Category Image Background (if available) or Gradient */}
          <div className="aspect-4/3 bg-linear-to-br from-purple-50 to-pink-50 relative overflow-hidden">
            {category.image ? (
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-purple-200 text-6xl font-bold opacity-20">
                {category.name.charAt(0)}
              </div>
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-60" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
              {category.description && (
                <p className="text-sm text-white/90 line-clamp-2 mb-4">
                  {category.description}
                </p>
              )}

              <Link
                href={`/products?category=${category.slug}`}
                className="inline-flex items-center text-sm font-medium text-white hover:text-purple-200 transition-colors"
              >
                Shop All {category.name} →
              </Link>
            </div>
          </div>

          {/* Sub-categories */}
          {category.children && category.children.length > 0 && (
            <div className="p-6 bg-white">
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                Collections
              </h4>
              <ul className="space-y-2">
                {category.children?.map((child: Category) => (
                  <li key={child.id}>
                    <Link
                      href={`/products?category=${child.slug}`}
                      className="text-gray-600 hover:text-purple-600 transition-colors flex items-center justify-between group/item"
                    >
                      <span>{child.name}</span>
                      <span className="opacity-0 group-hover/item:opacity-100 transition-opacity text-purple-400">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
