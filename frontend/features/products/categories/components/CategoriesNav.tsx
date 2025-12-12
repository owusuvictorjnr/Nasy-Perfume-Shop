"use client";
import React, { useState } from "react";
import Link from "next/link";
import { products } from "@/lib/data";
import { toSlug } from "@/lib/utils";

export default function CategoriesNav() {
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  // Get unique categories and subcategories
  const categories = [...new Set(products.map((p) => p.category))];

  const getSubcategoriesForCategory = (category: string) => {
    return [
      ...new Set(
        products
          .filter((p) => p.category === category)
          .map((p) => p.subcategory)
      ),
    ];
  };

  return (
    <nav className="bg-gradient-to-r hidden md:block from-purple-50 to-white border-b border-gray-200 sticky top-16 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 py-3 overflow-x-auto flex-nowrap sm:flex-wrap sm:justify-center">
          {categories.map((category) => {
            const subcats = getSubcategoriesForCategory(category);
            const hasSubcats = subcats.length > 1;

            return (
              <div key={category} className="relative group">
                <Link
                  href={`/category/${toSlug(category)}`}
                  className="px-6 py-2 text-sm font-semibold text-gray-700 hover:text-purple-600 hover:bg-white rounded-lg transition-all uppercase tracking-wide"
                >
                  {category}
                </Link>

                {hasSubcats && (
                  <div className="hidden group-hover:block absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                    <div className="py-2">
                      {subcats.map((subcat) => (
                        <Link
                          key={subcat}
                          href={`/category/${toSlug(subcat)}`}
                          className="block px-5 py-3 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                        >
                          {subcat}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
