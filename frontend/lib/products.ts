import type { IProductInput } from "@/types";
import axios from "axios";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

interface GetProductsOptions {
  category?: string;
  subcategory?: string;
  limit?: number;
  skip?: number;
  page?: number;
  search?: string;
  tags?: string[];
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  sortBy?: "price-asc" | "price-desc" | "newest" | "popular";
}

interface ProductsResponse {
  data: IProductInput[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Fetch products from backend API
 * Falls back to local data if backend is unavailable
 */
export async function getProducts(
  options?: GetProductsOptions
): Promise<ProductsResponse> {
  try {
    const params = new URLSearchParams();

    if (options) {
      const page = options.page || 1;
      const limit = options.limit || 20;
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      if (options.category) params.append("category", options.category);
      if (options.subcategory)
        params.append("subcategory", options.subcategory);
      if (options.search) params.append("search", options.search);
      if (options.tags?.length) params.append("tags", options.tags.join(","));
      if (options.minPrice)
        params.append("minPrice", options.minPrice.toString());
      if (options.maxPrice)
        params.append("maxPrice", options.maxPrice.toString());
      if (options.isFeatured) params.append("isFeatured", "true");
      if (options.isNew) params.append("isNew", "true");
      if (options.isBestSeller) params.append("isBestSeller", "true");
      if (options.sortBy) params.append("sortBy", options.sortBy);
    }

    const response = await axios.get(
      `${BACKEND_URL}/products?${params.toString()}`,
      {
        // Note: axios doesn't support Next.js cache options
        // Use React Server Components or SWR/React Query for caching if needed
      }
    );

    return response.data;
  } catch (error) {
    console.warn("Error fetching products from backend:", error);
    return { data: [], total: 0, page: 1, limit: options?.limit || 20 };
  }
}

/**
 * Fetch a single product by slug from backend
 */
export async function getProductBySlug(
  slug: string
): Promise<IProductInput | null> {
  try {
    const response = await axios.get(`${BACKEND_URL}/products/${slug}`);
    return response.data.data || response.data;
  } catch (error) {
    console.warn("Error fetching product by slug:", error);
    return null;
  }
}

/**
 * Fetch featured products
 */
export async function getFeaturedProducts(
  limit: number = 6
): Promise<IProductInput[]> {
  const response = await getProducts({ isFeatured: true, limit });
  return response.data;
}

/**
 * Fetch new arrival products
 */
export async function getNewArrivals(
  limit: number = 6
): Promise<IProductInput[]> {
  const response = await getProducts({ isNew: true, limit, sortBy: "newest" });
  return response.data;
}

/**
 * Fetch best seller products
 */
export async function getBestSellers(
  limit: number = 6
): Promise<IProductInput[]> {
  const response = await getProducts({
    isBestSeller: true,
    limit,
    sortBy: "popular",
  });
  return response.data;
}

/**
 * Get all unique categories from products
 */
export function getCategories(products: IProductInput[]): string[] {
  return [
    ...new Set(products.filter((p) => p.isPublished).map((p) => p.category)),
  ];
}

/**
 * Get all unique subcategories for a category
 */
export function getSubcategories(
  products: IProductInput[],
  category?: string
): string[] {
  let filtered = products.filter((p) => p.isPublished);
  if (category) {
    filtered = filtered.filter((p) => p.category === category);
  }
  return [...new Set(filtered.map((p) => p.subcategory))];
}

/**
 * Transform product image URLs to use Cloudinary optimization
 * Only applies if image URL is from Cloudinary
 */
export function optimizeCloudinaryImage(
  imageUrl: string,
  options?: {
    width?: number;
    height?: number;
    quality?: "auto" | "low" | "medium" | "high";
  }
): string {
  if (!imageUrl || !imageUrl.includes("cloudinary")) {
    return imageUrl;
  }

  const width = options?.width || 600;
  const height = options?.height || 400;
  const quality = options?.quality || "auto";

  // Parse Cloudinary URL and inject transformation parameters
  // Format: https://res.cloudinary.com/{cloud_name}/{type}/upload/{transformations}/{public_id}
  const parts = imageUrl.split("/upload/");
  if (parts.length !== 2) return imageUrl;

  const transformations = `c_fill,g_auto,w_${width},h_${height},q_${quality}`;
  return `${parts[0]}/upload/${transformations}/${parts[1]}`;
}

/**
 * Get Cloudinary metadata for image optimization
 */
export function getImageUrl(
  imageUrl: string,
  context?: "thumbnail" | "detail" | "hero"
): string {
  const contexts = {
    thumbnail: { width: 300, height: 300, quality: "auto" as const },
    detail: { width: 800, height: 800, quality: "auto" as const },
    hero: { width: 1200, height: 600, quality: "auto" as const },
  };

  const opts = contexts[context || "thumbnail"];
  return optimizeCloudinaryImage(imageUrl, opts);
}
