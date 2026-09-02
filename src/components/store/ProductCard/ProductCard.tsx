'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { useWishlist } from '@/lib/context/WishlistContext';
import { useAuth } from '@/lib/context/AuthContext';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import type { Product } from '@/types/database';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const discount = calculateDiscount(product.price, product.compare_at_price);
  const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0];
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await addItem(product.id);
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      window.location.href = '/auth/login';
      return;
    }
    await toggleWishlist(product.id);
  };

  return (
    <Link href={`/product/${product.slug}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        <div className={styles.imagePlaceholder}>
          {primaryImage ? (
            <img src={primaryImage.url} alt={primaryImage.alt_text || product.name} className={styles.image} />
          ) : (
            <div className={styles.noImage}>
              <span className={styles.noImageText}>{product.name[0]}</span>
            </div>
          )}
        </div>

        {/* Badges */}
        <div className={styles.badges}>
          {discount > 0 && (
            <span className={styles.discountBadge}>-{discount}%</span>
          )}
          {product.is_bestseller && (
            <span className={styles.bestsellerBadge}>Bestseller</span>
          )}
        </div>

        {/* Quick Actions */}
        <div className={styles.quickActions}>
          <button
            className={`${styles.quickBtn} ${inWishlist ? styles.wishlisted : ''}`}
            onClick={handleToggleWishlist}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart size={18} fill={inWishlist ? 'currentColor' : 'none'} />
          </button>
          <button
            className={styles.quickBtn}
            onClick={handleAddToCart}
            aria-label="Add to cart"
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>

      <div className={styles.info}>
        {product.category && (
          <span className={styles.category}>{product.category.name}</span>
        )}
        <h3 className={styles.name}>{product.name}</h3>
        {product.short_description && (
          <p className={styles.description}>{product.short_description}</p>
        )}
        <div className={styles.meta}>
          <div className={styles.rating}>
            <Star size={14} fill="var(--color-champagne)" stroke="var(--color-champagne)" />
            <span>{product.rating_avg > 0 ? product.rating_avg.toFixed(1) : '—'}</span>
            {product.rating_count > 0 && (
              <span className={styles.ratingCount}>({product.rating_count})</span>
            )}
          </div>
          <div className={styles.pricing}>
            <span className={styles.price}>{formatPrice(product.price)}</span>
            {product.compare_at_price && product.compare_at_price > product.price && (
              <span className={styles.comparePrice}>{formatPrice(product.compare_at_price)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
