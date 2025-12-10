import { Hero } from "@/app/(home)/components/Hero";
import FeaturedProducts from "@/app/(home)/components/FeaturedProducts";
import NewArrivals from "@/app/(home)/components/NewArrivals";
import CategoryShowcase from "@/features/products/categories/components/CategoryShowcase";
import React from "react";

export default function HomePage() {
  return (
    <main className="w-full">
      <Hero />
      <FeaturedProducts />
      <NewArrivals />
      <CategoryShowcase />
    </main>
  );
}
