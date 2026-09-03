'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/context/CartContext';
import { formatPrice } from '@/lib/utils';
import type { CartItem } from '@/types/database';
import styles from './page.module.css';

interface CheckoutClientProps {
  user: {
    id: string;
    email: string;
    fullName: string;
    phone: string;
  };
  defaultAddress: any | null;
}

export default function CheckoutClient({ user, defaultAddress }: CheckoutClientProps) {
  const router = useRouter();
  const { items, summary, itemCount, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: defaultAddress?.full_name || user.fullName || '',
    phone: defaultAddress?.phone || user.phone || '',
    addressLine1: defaultAddress?.address_line1 || '',
    addressLine2: defaultAddress?.address_line2 || '',
    city: defaultAddress?.city || '',
    state: defaultAddress?.state || '',
    postalCode: defaultAddress?.postal_code || '',
    country: defaultAddress?.country || 'India',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsProcessing(true);

    try {
      const res = await loadRazorpay();
      if (!res) {
        throw new Error('Razorpay SDK failed to load. Are you online?');
      }

      // Create order on backend
      const response = await fetch('/api/checkout/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shippingAddress: formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.razorpayOrder.amount,
        currency: data.razorpayOrder.currency,
        name: 'KUHUDE',
        description: 'Premium Fragrance Order',
        order_id: data.razorpayOrder.id,
        handler: async function (response: any) {
          try {
            // Verify payment on backend
            const verifyRes = await fetch('/api/checkout/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                order_id: data.orderId,
              }),
            });

            if (verifyRes.ok) {
              await clearCart();
              router.push(`/checkout/success?order_id=${data.orderId}`);
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (err: any) {
            setError(err.message || 'Payment verification failed');
            setIsProcessing(false);
          }
        },
        prefill: {
          name: formData.fullName,
          email: user.email,
          contact: formData.phone,
        },
        theme: {
          color: '#1a1a1a',
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on('payment.failed', function (response: any) {
        setError(response.error.description || 'Payment failed');
        setIsProcessing(false);
      });
      paymentObject.open();

    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>Your cart is empty.</p>
        <Link href="/shop" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.checkoutGrid}>
      {/* Form Section */}
      <div>
        <h2 className={styles.sectionTitle}>Shipping Information</h2>
        {error && (
          <div style={{ color: 'red', marginBottom: '1rem', padding: '1rem', background: '#ffebee', borderRadius: '4px' }}>
            {error}
          </div>
        )}
        <form id="checkout-form" onSubmit={handlePayment} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="addressLine1">Address Line 1</label>
            <input
              type="text"
              id="addressLine1"
              name="addressLine1"
              required
              value={formData.addressLine1}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="addressLine2">Address Line 2 (Optional)</label>
            <input
              type="text"
              id="addressLine2"
              name="addressLine2"
              value={formData.addressLine2}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                required
                value={formData.city}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="state">State</label>
              <input
                type="text"
                id="state"
                name="state"
                required
                value={formData.state}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="postalCode">Postal Code</label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                required
                value={formData.postalCode}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="country">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                required
                disabled
                value={formData.country}
              />
            </div>
          </div>
        </form>
      </div>

      {/* Summary Section */}
      <div className={styles.summary}>
        <h2 className={styles.sectionTitle}>Order Summary</h2>
        <div className={styles.summaryItems}>
          {items.map((item) => {
            const cartItem = item as CartItem;
            const product = cartItem.product;
            if (!product) return null;
            
            const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0];
            const variantName = cartItem.variant?.name;
            const itemPrice = cartItem.variant ? Number(cartItem.variant.price) : Number(product.price);

            return (
              <div key={`${item.product_id}-${item.variant_id}`} className={styles.summaryItem}>
                <div className={styles.itemImage}>
                  {primaryImage ? (
                    <img src={primaryImage.url} alt={product.name} />
                  ) : (
                    <div className={styles.itemImagePlaceholder}>
                      {product.name[0]}
                    </div>
                  )}
                  <span className={styles.badge}>{item.quantity}</span>
                </div>
                <div className={styles.itemDetails}>
                  <span className={styles.itemName}>{product.name}</span>
                  {variantName && <span className={styles.itemVariant}>{variantName}</span>}
                </div>
                <span className={styles.itemPrice}>{formatPrice(itemPrice * item.quantity)}</span>
              </div>
            );
          })}
        </div>

        <div className={styles.summaryTotals}>
          <div className={styles.summaryRow}>
            <span>Subtotal ({itemCount} items)</span>
            <span>{formatPrice(summary.subtotal)}</span>
          </div>
          {summary.shipping > 0 ? (
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>{formatPrice(summary.shipping)}</span>
            </div>
          ) : (
            <div className={styles.summaryRow} style={{ color: 'var(--color-black)' }}>
              <span>Shipping</span>
              <span>Free</span>
            </div>
          )}
          <div className={styles.summaryRow}>
            <span>Taxes</span>
            <span>{formatPrice(summary.tax)}</span>
          </div>
          <div className={`${styles.summaryRow} ${styles.total}`}>
            <span>Total</span>
            <span>{formatPrice(summary.total)}</span>
          </div>
        </div>

        <button 
          form="checkout-form"
          type="submit" 
          className={`btn btn-primary btn-lg ${styles.payButton}`}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : `Pay ${formatPrice(summary.total)}`}
        </button>
      </div>
    </div>
  );
}
