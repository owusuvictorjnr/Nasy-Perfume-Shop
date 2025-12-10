// User types
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  role: "CUSTOMER" | "ADMIN" | "STAFF";
  createdAt: string;
  updatedAt: string;
}

// Product types
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  sku: string;
  brand?: string;
  basePrice: number;
  salePrice?: number;
  stockQuantity: number;
  isInStock: boolean;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED" | "OUT_OF_STOCK";
  isFeatured: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  averageRating: number;
  reviewCount: number;
  images: string[];
  category?: Category;
  variants?: ProductVariant[];
  tags?: ProductTag[];
  attributes?: ProductAttribute[];
  reviews?: Review[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  price: number;
  salePrice?: number;
  stockQuantity: number;
  isInStock: boolean;
  attributes: Record<string, string>;
  image?: string;
}

export interface ProductAttribute {
  id: string;
  name: string;
  value: string;
}

export interface ProductTag {
  id: string;
  name: string;
  slug: string;
  type: string;
}

// Category types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  children?: Category[];
  _count?: {
    products: number;
  };
}

// Cart types
export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  product?: Product;
  variant?: ProductVariant;
  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

// Order types
export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerEmail: string;
  status:
    | "PENDING"
    | "PROCESSING"
    | "ON_HOLD"
    | "COMPLETED"
    | "CANCELLED"
    | "REFUNDED"
    | "FAILED";
  paymentStatus:
    | "PENDING"
    | "AUTHORIZED"
    | "PAID"
    | "PARTIALLY_REFUNDED"
    | "REFUNDED"
    | "VOIDED"
    | "FAILED";
  fulfillmentStatus: "UNFULFILLED" | "PARTIALLY_FULFILLED" | "FULFILLED";
  subtotal: number;
  shippingTotal: number;
  taxTotal: number;
  total: number;
  items: OrderItem[];
  shippingAddress?: Address;
  billingAddress?: Address;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productName: string;
  variantName?: string;
  sku: string;
  quantity: number;
  price: number;
  subtotal: number;
  product?: Product;
  variant?: ProductVariant;
}

// Address types
export interface Address {
  id: string;
  fullName: string;
  street: string;
  city: string;
  state?: string;
  country: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
}

// Review types
export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  title?: string;
  comment?: string;
  isApproved: boolean;
  user?: {
    id: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Wishlist types
export interface WishlistItem {
  id: string;
  productId: string;
  product?: Product;
  createdAt: string;
}

// API Response types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ReviewsResponse {
  reviews: Review[];
  total: number;
  page: number;
  totalPages: number;
}
