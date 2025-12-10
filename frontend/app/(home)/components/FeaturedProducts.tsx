"use client";
import React from "react";
import { products } from "@/lib/data";
import ProductCard from "./ProductCard";
import Link from "next/link";

export default function FeaturedProducts() {
  const featured = products
    .filter((p) => p.isPublished && p.featured)
    .slice(0, 6);

  if (featured.length === 0) return null;

  return (
    <section id="featured" className="max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <span className="text-purple-600 font-semibold text-sm uppercase tracking-wider">
          Handpicked for You
        </span>
        <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
          Featured Products
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Discover our carefully curated selection of premium fragrances
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {featured.map((product) => (
          <ProductCard
            key={product.slug}
            product={product}
            variant="featured"
          />
        ))}
      </div>

      <div className="text-center mt-12">
        <Link
          href="/products"
          className="inline-block bg-purple-600 text-white px-8 py-4 rounded-lg hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl font-semibold"
        >
          View All Products
        </Link>
      </div>
    </section>
  );
}
