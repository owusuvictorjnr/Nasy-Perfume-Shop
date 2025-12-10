"use client";
import { useRouter, useSearchParams } from "next/navigation";

export default function SortDropdown({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", value);
    router.push(`?${params.toString()}`);
  };

  return (
    <select
      defaultValue={defaultValue}
      onChange={(e) => handleSort(e.target.value)}
      className="w-full px-2 py-1 border rounded text-sm"
    >
      <option value="featured">Featured</option>
      <option value="newest">Newest</option>
      <option value="price-low">Price: Low to High</option>
      <option value="price-high">Price: High to Low</option>
      <option value="rating">Highest Rated</option>
    </select>
  );
}
