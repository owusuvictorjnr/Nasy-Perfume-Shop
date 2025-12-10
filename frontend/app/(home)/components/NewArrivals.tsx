"use client";
import React from "react";
import { products } from "@/lib/data";
import ProductCard from "./ProductCard";
import Link from "next/link";

export default function NewArrivals() {
  const newArrivals = products
    .filter((p) => p.isPublished && p.newArrival)
    .slice(0, 6);

  if (newArrivals.length === 0) return null;

  return (
    <section className="bg-gradient-to-b from-white to-purple-50 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-purple-600 font-semibold text-sm uppercase tracking-wider">
            Just Arrived
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
            New Arrivals
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Be the first to experience our latest fragrances
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {newArrivals.map((product) => (
            <ProductCard
              key={product.slug}
              product={product}
              variant="default"
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-block bg-white text-purple-600 px-8 py-4 rounded-lg hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl font-semibold border-2 border-purple-600"
          >
            Discover More
          </Link>
        </div>
      </div>
    </section>
  );
}
