"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/app/(home)/components/ProductCard";
import { products } from "@/lib/data";
import Link from "next/link";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchResults, setSearchResults] = useState(products);
  const [sortBy, setSortBy] = useState("relevant");
  const [filterBy, setFilterBy] = useState("all");

  useEffect(() => {
    if (!query) {
      setSearchResults(products);
      return;
    }

    const filtered = products.filter((product) => {
      const searchTerm = query.toLowerCase();
      return (
        product.name.toLowerCase().includes(searchTerm) ||
        product.brand?.toLowerCase().includes(searchTerm) ||
        product.category?.toLowerCase().includes(searchTerm) ||
        product.subcategory?.toLowerCase().includes(searchTerm)
      );
    });

    // Apply category filter
    let results = filtered;
    if (filterBy !== "all") {
      results = results.filter((p) => p.category === filterBy);
    }

    // Apply sorting
    if (sortBy === "price-low") {
      results.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      results.sort((a, b) => b.price - a.price);
    } else if (sortBy === "newest") {
      results.sort((a, b) => (b.newArrival ? 1 : -1));
    } else if (sortBy === "rating") {
      results.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
    }

    setSearchResults(results);
  }, [query, sortBy, filterBy]);

  const categories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {query ? `Search Results for "${query}"` : "Search Products"}
          </h1>
          <p className="text-gray-600">
            {searchResults.length} product
            {searchResults.length !== 1 ? "s" : ""} found
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 space-y-6">
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Category</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value="all"
                      checked={filterBy === "all"}
                      onChange={(e) => setFilterBy(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-700">All Categories</span>
                  </label>
                  {categories.map((cat) => (
                    <label
                      key={cat}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="category"
                        value={cat}
                        checked={filterBy === cat}
                        onChange={(e) => setFilterBy(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="text-gray-700 capitalize">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-bold text-gray-900 mb-4">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
                >
                  <option value="relevant">Most Relevant</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="lg:col-span-3">
            {searchResults.length === 0 ? (
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  No Products Found
                </h2>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search or filters
                </p>
                <Link
                  href="/"
                  className="inline-block px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition"
                >
                  Browse All Products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {searchResults.map((product) => (
                  <ProductCard
                    key={product.slug}
                    product={product}
                    variant="default"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600">Loading search results...</p>
          </div>
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
