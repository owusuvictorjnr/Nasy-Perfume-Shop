import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api/api-client";
import type {
  ProductsResponse,
  Product,
  ReviewsResponse,
  Review,
} from "@/lib/api/api-types";

// Get products with filters
export function useProducts(params?: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  tags?: string[];
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  sortBy?: "price-asc" | "price-desc" | "newest" | "popular";
}) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.category) queryParams.append("category", params.category);
      if (params?.search) queryParams.append("search", params.search);
      if (params?.tags) queryParams.append("tags", params.tags.join(","));
      if (params?.minPrice)
        queryParams.append("minPrice", params.minPrice.toString());
      if (params?.maxPrice)
        queryParams.append("maxPrice", params.maxPrice.toString());
      if (params?.isFeatured) queryParams.append("isFeatured", "true");
      if (params?.isNew) queryParams.append("isNew", "true");
      if (params?.isBestSeller) queryParams.append("isBestSeller", "true");
      if (params?.sortBy) queryParams.append("sortBy", params.sortBy);

      const { data } = await apiClient.get<ProductsResponse>(
        `/products?${queryParams}`
      );
      return data;
    },
  });
}

// Get single product by slug
export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data } = await apiClient.get<Product>(`/products/${slug}`);
      return data;
    },
    enabled: !!slug,
  });
}

// Get product reviews
export function useProductReviews(productId: string, page = 1, limit = 10) {
  return useQuery({
    queryKey: ["product-reviews", productId, page, limit],
    queryFn: async () => {
      const { data } = await apiClient.get<ReviewsResponse>(
        `/products/${productId}/reviews?page=${page}&limit=${limit}`
      );
      return data;
    },
    enabled: !!productId,
  });
}

// Create product review
export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      rating,
      title,
      comment,
    }: {
      productId: string;
      rating: number;
      title?: string;
      comment?: string;
    }) => {
      const { data } = await apiClient.post<Review>(
        `/products/${productId}/reviews`,
        {
          rating,
          title,
          comment,
        }
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["product-reviews", variables.productId],
      });
      queryClient.invalidateQueries({
        queryKey: ["product", variables.productId],
      });
    },
  });
}
