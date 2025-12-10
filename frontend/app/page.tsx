import { Hero } from "@/app/(home)/components/Hero";
import FeaturedProducts from "@/app/(home)/components/FeaturedProducts";
import NewArrivals from "@/app/(home)/components/NewArrivals";
import CategoryShowcase from "@/features/products/categories/components/CategoryShowcase";
import Link from "next/link";
import React from "react";

export default function HomePage() {
  return (
    <main className="w-full min-h-screen bg-white">
      <Hero />
      <FeaturedProducts />
      <NewArrivals />

      {/* Categories Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-purple-600 font-semibold text-sm uppercase tracking-wider">
              Shop by Category
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
              Explore Our Collections
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Find the perfect scent for every occasion
            </p>
          </div>
          <CategoryShowcase />
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gradient-to-b from-purple-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✨</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Premium Quality</h3>
              <p className="text-gray-600">
                Authentic fragrances from renowned brands worldwide
              </p>
            </div>
            <div className="text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚚</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Quick and secure shipping to your doorstep
              </p>
            </div>
            <div className="text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💝</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Gift Ready</h3>
              <p className="text-gray-600">
                Beautiful packaging perfect for any occasion
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-800 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Ready to Find Your Perfect Scent?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of satisfied customers who discovered their signature
            fragrance
          </p>
          <Link
            href="/products"
            className="inline-block px-10 py-5 bg-white text-purple-600 rounded-lg hover:bg-gray-100 font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
          >
            Explore Full Collection
          </Link>
        </div>
      </section>
    </main>
  );
}
