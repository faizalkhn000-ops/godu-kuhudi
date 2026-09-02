'use client';

import React from 'react';
import Link from 'next/link';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { formatPrice } from '@/lib/utils';
import type { CartItem } from '@/types/database';
import styles from './CartDrawer.module.css';

export default function CartDrawer() {
  const { items, summary, isOpen, closeCart, updateQuantity, removeItem } = useCart();

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={closeCart} />
      <div className={styles.drawer}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            <ShoppingBag size={20} />
            Your Cart
          </h2>
          <button className={styles.closeBtn} onClick={closeCart} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <div className={styles.empty}>
            <ShoppingBag size={48} strokeWidth={1} />
            <p className={styles.emptyTitle}>Your cart is empty</p>
            <p className={styles.emptyText}>Discover fragrances that become memories.</p>
            <Link href="/shop" className="btn btn-primary" onClick={closeCart}>
              Shop Now
            </Link>
          </div>
        ) : (
          <>
            <div className={styles.items}>
              {items.map((item) => {
                const cartItem = item as CartItem;
                const product = cartItem.product;
                if (!product) return null;
                const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0];
                const variantName = cartItem.variant?.name;
                const itemPrice = cartItem.variant ? Number(cartItem.variant.price) : Number(product.price);

                return (
                  <div key={`${item.product_id}-${item.variant_id}`} className={styles.item}>
                    <div className={styles.itemImage}>
                      {primaryImage ? (
                        <img src={primaryImage.url} alt={product.name} />
                      ) : (
                        <div className={styles.itemImagePlaceholder}>
                          {product.name[0]}
                        </div>
                      )}
                    </div>
                    <div className={styles.itemDetails}>
                      <Link
                        href={`/product/${product.slug}`}
                        className={styles.itemName}
                        onClick={closeCart}
                      >
                        {product.name}
                      </Link>
                      {variantName && (
                        <span className={styles.itemVariant}>{variantName}</span>
                      )}
                      <span className={styles.itemPrice}>{formatPrice(itemPrice)}</span>
                      <div className={styles.itemActions}>
                        <div className={styles.quantity}>
                          <button
                            onClick={() => updateQuantity(item.product_id, item.variant_id ?? null, item.quantity - 1)}
                            className={styles.qtyBtn}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className={styles.qtyValue}>{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product_id, item.variant_id ?? null, item.quantity + 1)}
                            className={styles.qtyBtn}
                            aria-label="Increase quantity"
                            disabled={item.quantity >= 10}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.product_id, item.variant_id)}
                          className={styles.removeBtn}
                          aria-label="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className={styles.summary}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>{formatPrice(summary.subtotal)}</span>
              </div>
              {summary.shipping > 0 && (
                <div className={styles.summaryRow}>
                  <span>Shipping</span>
                  <span>{formatPrice(summary.shipping)}</span>
                </div>
              )}
              {summary.shipping === 0 && (
                <div className={`${styles.summaryRow} ${styles.freeShipping}`}>
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
              )}
              <div className={`${styles.summaryRow} ${styles.total}`}>
                <span>Estimated Total</span>
                <span>{formatPrice(summary.total)}</span>
              </div>
              <Link href="/checkout" className="btn btn-primary btn-lg" onClick={closeCart} style={{ width: '100%' }}>
                Proceed to Checkout
              </Link>
              <Link href="/cart" className={styles.viewCart} onClick={closeCart}>
                View Full Cart
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
