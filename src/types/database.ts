// ============================================================================
// KUHUDE - Database Types
// ============================================================================

export type UUID = string;

// ---- Enums ----
export type ProductStatus = 'draft' | 'active' | 'archived';
export type OrderStatus = 
  | 'pending' 
  | 'payment_pending' 
  | 'paid' 
  | 'processing' 
  | 'packed' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled' 
  | 'refunded';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type PaymentMethod = 'razorpay' | 'cod' | 'upi';

// ---- Tables ----

export interface Profile {
  id: UUID;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  date_of_birth: string | null;
  gender: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: UUID;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: UUID | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: UUID;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  category_id: UUID | null;
  price: number;
  compare_at_price: number | null;
  sku: string | null;
  inventory_count: number;
  status: ProductStatus;
  is_featured: boolean;
  is_bestseller: boolean;
  fragrance_top_notes: string | null;
  fragrance_heart_notes: string | null;
  fragrance_base_notes: string | null;
  ingredients: string | null;
  weight: string | null;
  size: string | null;
  mood: string | null;
  shipping_info: string | null;
  return_info: string | null;
  rating_avg: number;
  rating_count: number;
  created_at: string;
  updated_at: string;
  // Joined data
  category?: Category;
  images?: ProductImage[];
  variants?: ProductVariant[];
}

export interface ProductImage {
  id: UUID;
  product_id: UUID;
  url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface ProductVariant {
  id: UUID;
  product_id: UUID;
  name: string;
  sku: string | null;
  price: number;
  compare_at_price: number | null;
  inventory_count: number;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: UUID;
  user_id: UUID;
  product_id: UUID;
  variant_id: UUID | null;
  quantity: number;
  created_at: string;
  updated_at: string;
  // Joined
  product?: Product;
  variant?: ProductVariant;
}

export interface WishlistItem {
  id: UUID;
  user_id: UUID;
  product_id: UUID;
  created_at: string;
  // Joined
  product?: Product;
}

export interface Address {
  id: UUID;
  user_id: UUID;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: UUID;
  user_id: UUID;
  order_number: string;
  status: OrderStatus;
  subtotal: number;
  discount_amount: number;
  shipping_amount: number;
  tax_amount: number;
  total: number;
  shipping_address: Address | Record<string, string>;
  billing_address: Address | Record<string, string> | null;
  notes: string | null;
  coupon_code: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  items?: OrderItem[];
  payment?: Payment;
  profile?: Profile;
}

export interface OrderItem {
  id: UUID;
  order_id: UUID;
  product_id: UUID;
  variant_id: UUID | null;
  product_name: string;
  variant_name: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  image_url: string | null;
  created_at: string;
}

export interface Payment {
  id: UUID;
  order_id: UUID;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  razorpay_signature: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod | null;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: UUID;
  product_id: UUID;
  user_id: UUID;
  rating: number;
  title: string | null;
  comment: string | null;
  is_verified_purchase: boolean;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  // Joined
  profile?: Profile;
}

export interface Coupon {
  id: UUID;
  code: string;
  description: string | null;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount: number | null;
  max_uses: number | null;
  used_count: number;
  is_active: boolean;
  starts_at: string | null;
  expires_at: string | null;
  created_at: string;
}

export interface AdminUser {
  id: UUID;
  user_id: UUID;
  role: 'admin' | 'super_admin';
  created_at: string;
}

export interface HomepageContent {
  id: UUID;
  section: string;
  title: string | null;
  subtitle: string | null;
  content: Record<string, unknown> | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// ---- API / Component Types ----

export interface CartSummary {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  mood?: string;
  search?: string;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'rating' | 'name';
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
