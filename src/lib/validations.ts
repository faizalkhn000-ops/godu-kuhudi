// ============================================================================
// KUHUDE - Zod Validation Schemas
// ============================================================================

import { z } from 'zod';

export const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid Indian mobile number').optional().or(z.literal('')),
});

export const addressSchema = z.object({
  full_name: z.string().min(2, 'Name is required').max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  address_line1: z.string().min(5, 'Address is required').max(200),
  address_line2: z.string().max(200).optional().or(z.literal('')),
  city: z.string().min(2, 'City is required').max(100),
  state: z.string().min(2, 'State is required').max(100),
  postal_code: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit PIN code'),
  country: z.string().default('India'),
  is_default: z.boolean().default(false),
});

export const productSchema = z.object({
  name: z.string().min(2, 'Product name is required').max(200),
  slug: z.string().min(2).max(200),
  description: z.string().optional().or(z.literal('')),
  short_description: z.string().max(300).optional().or(z.literal('')),
  category_id: z.string().uuid().optional().or(z.literal('')),
  price: z.number().min(0, 'Price must be positive'),
  compare_at_price: z.number().min(0).optional().nullable(),
  sku: z.string().max(50).optional().or(z.literal('')),
  inventory_count: z.number().int().min(0).default(0),
  status: z.enum(['draft', 'active', 'archived']).default('draft'),
  is_featured: z.boolean().default(false),
  is_bestseller: z.boolean().default(false),
  fragrance_top_notes: z.string().optional().or(z.literal('')),
  fragrance_heart_notes: z.string().optional().or(z.literal('')),
  fragrance_base_notes: z.string().optional().or(z.literal('')),
  ingredients: z.string().optional().or(z.literal('')),
  weight: z.string().optional().or(z.literal('')),
  size: z.string().optional().or(z.literal('')),
  mood: z.string().optional().or(z.literal('')),
  shipping_info: z.string().optional().or(z.literal('')),
  return_info: z.string().optional().or(z.literal('')),
});

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().max(200).optional().or(z.literal('')),
  comment: z.string().max(2000).optional().or(z.literal('')),
});

export const cartItemSchema = z.object({
  product_id: z.string().uuid(),
  variant_id: z.string().uuid().optional().nullable(),
  quantity: z.number().int().min(1).max(10),
});

export const checkoutSchema = z.object({
  address_id: z.string().uuid('Please select a shipping address'),
});

export const categorySchema = z.object({
  name: z.string().min(2, 'Category name is required').max(100),
  slug: z.string().min(2).max(100),
  description: z.string().max(500).optional().or(z.literal('')),
  parent_id: z.string().uuid().optional().nullable(),
  sort_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
export type AddressFormData = z.infer<typeof addressSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
export type ReviewFormData = z.infer<typeof reviewSchema>;
export type CartItemFormData = z.infer<typeof cartItemSchema>;
export type CheckoutFormData = z.infer<typeof checkoutSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
