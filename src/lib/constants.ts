// ============================================================================
// KUHUDE - Constants
// ============================================================================

export const BRAND = {
  name: 'KUHUDE',
  tagline: 'Born to Remember',
  description: 'Premium fragrance and lifestyle products for women.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
} as const;

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Collections', href: '/collections' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const;

export const CATEGORIES = [
  { name: 'Perfumes', slug: 'perfumes' },
  { name: 'Body Mists', slug: 'body-mists' },
  { name: 'Body Care', slug: 'body-care' },
  { name: 'Gift Sets', slug: 'gift-sets' },
  { name: 'Accessories', slug: 'accessories' },
] as const;

export const MOODS = [
  {
    name: 'Soft & Romantic',
    slug: 'soft-romantic',
    description: 'Delicate florals and warm whispers',
    gradient: 'linear-gradient(135deg, #E8C7D8, #C7A7E8)',
  },
  {
    name: 'Bold & Magnetic',
    slug: 'bold-magnetic',
    description: 'Intense, captivating, unforgettable',
    gradient: 'linear-gradient(135deg, #4B1D63, #7B2D8E)',
  },
  {
    name: 'Fresh & Effortless',
    slug: 'fresh-effortless',
    description: 'Light, breezy, naturally radiant',
    gradient: 'linear-gradient(135deg, #A7D8C7, #C7E8D8)',
  },
  {
    name: 'Dark & Sensual',
    slug: 'dark-sensual',
    description: 'Deep, mysterious, intoxicating',
    gradient: 'linear-gradient(135deg, #241127, #4B1D63)',
  },
  {
    name: 'Elegant & Timeless',
    slug: 'elegant-timeless',
    description: 'Classic sophistication, enduring grace',
    gradient: 'linear-gradient(135deg, #C7A7E8, #FAF7F2)',
  },
] as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: 'Order Placed',
  payment_pending: 'Awaiting Payment',
  paid: 'Payment Confirmed',
  processing: 'Processing',
  packed: 'Packed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};

export const ORDER_STATUS_FLOW = [
  'pending',
  'paid',
  'processing',
  'packed',
  'shipped',
  'delivered',
] as const;

export const SHIPPING_COST = 99;
export const FREE_SHIPPING_THRESHOLD = 999;
export const TAX_RATE = 0.18; // 18% GST
export const CURRENCY = 'INR';
export const CURRENCY_SYMBOL = '₹';

export const ITEMS_PER_PAGE = 12;
