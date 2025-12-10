import React from "react";
import { products } from "@/lib/data";
import { toSlug } from "@/lib/utils";
import ProductCard from "../../components/ProductCard";
import SortDropdown from "../../components/SortDropdown";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string; min?: string; max?: string }>;
};

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { sort = "featured", min, max } = await searchParams;

  // Find category and subcategories
  const allCategories = [...new Set(products.map((p) => p.category))];
  const allSubcategories = [...new Set(products.map((p) => p.subcategory))];

  // Determine if slug is a category or subcategory
  const isCategory = allCategories.some((cat) => toSlug(cat) === slug);
  const isSubcategory = allSubcategories.some((subcat) => toSlug(subcat) === slug);

  // Filter products
  let filtered = products.filter((p) => p.isPublished);

  if (isCategory) {
    const categoryName = allCategories.find((cat) => toSlug(cat) === slug);
    filtered = filtered.filter((p) => p.category === categoryName);
  } else if (isSubcategory) {
    const subcategoryName = allSubcategories.find((subcat) => toSlug(subcat) === slug);
    filtered = filtered.filter((p) => p.subcategory === subcategoryName);
  }

  // Apply price filter
  if (min || max) {
    const minPrice = min ? parseFloat(min) : 0;
    const maxPrice = max ? parseFloat(max) : Infinity;
    filtered = filtered.filter((p) => p.price >= minPrice && p.price <= maxPrice);
  }

  // Apply sorting
  if (sort === "price-low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === "price-high") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sort === "newest") {
    filtered.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0));
  } else if (sort === "rating") {
    filtered.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
  } else {
    // featured (default)
    filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }

  const categoryTitle = isCategory
    ? allCategories.find((cat) => toSlug(cat) === slug)
    : isSubcategory
      ? allSubcategories.find((subcat) => toSlug(subcat) === slug)
      : "Products";

  const maxPrice = Math.max(...filtered.map((p) => p.listPrice || p.price), 1000);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b py-6">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold">{categoryTitle}</h1>
          <p className="text-gray-600 mt-1">{filtered.length} products</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="md:col-span-1">
            <div className="bg-white rounded-lg p-4 border">
              <h2 className="font-bold text-lg mb-4">Filters</h2>

              {/* Sort */}
              <div>
                <h3 className="font-semibold text-sm mb-3">Sort By</h3>
                <SortDropdown defaultValue={sort} />
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="md:col-span-3">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center">
                <p className="text-gray-600 text-lg">No products found in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((product) => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
