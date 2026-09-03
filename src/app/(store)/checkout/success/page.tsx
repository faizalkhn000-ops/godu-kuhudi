import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatPrice, formatDate } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';
import styles from './page.module.css';

export const metadata = {
  title: 'Order Confirmed | KUHUDE',
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order_id: string }>;
}) {
  const { order_id } = await searchParams;
  const supabase = await createClient();

  const { data: order } = await supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .eq('id', order_id)
    .single();

  if (!order) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>Order Not Found</h1>
          <Link href="/shop" className="btn btn-primary">Return to Shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <CheckCircle size={64} strokeWidth={1} />
        </div>
        <h1 className={styles.title}>Thank you for your order</h1>
        <p className={styles.subtitle}>
          Your order <strong>{order.order_number}</strong> has been confirmed.
        </p>

        <div className={styles.orderSummary}>
          <div className={styles.summaryHeader}>
            <h3>Order Summary</h3>
            <span>{formatDate(order.created_at)}</span>
          </div>
          
          <div className={styles.itemsList}>
            {order.items?.map((item: any) => (
              <div key={item.id} className={styles.item}>
                <div className={styles.itemImage}>
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.product_name} />
                  ) : (
                    <div className={styles.itemPlaceholder}>{item.product_name[0]}</div>
                  )}
                </div>
                <div className={styles.itemDetails}>
                  <div className={styles.itemTitleRow}>
                    <span className={styles.itemName}>{item.product_name}</span>
                    <span className={styles.itemPrice}>{formatPrice(item.total_price)}</span>
                  </div>
                  {item.variant_name && (
                    <span className={styles.itemVariant}>{item.variant_name}</span>
                  )}
                  <span className={styles.itemQty}>Qty: {item.quantity}</span>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.totals}>
            <div className={styles.totalRow}>
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className={styles.totalRow}>
              <span>Shipping</span>
              <span>{order.shipping_amount > 0 ? formatPrice(order.shipping_amount) : 'Free'}</span>
            </div>
            <div className={styles.totalRow}>
              <span>Taxes</span>
              <span>{formatPrice(order.tax_amount)}</span>
            </div>
            <div className={`${styles.totalRow} ${styles.finalTotal}`}>
              <span>Total Paid</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        <div className={styles.shippingInfo}>
          <h3>Shipping To</h3>
          <p>{order.shipping_address.fullName}</p>
          <p>{order.shipping_address.addressLine1}</p>
          {order.shipping_address.addressLine2 && <p>{order.shipping_address.addressLine2}</p>}
          <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postalCode}</p>
          <p>{order.shipping_address.country}</p>
        </div>

        <div className={styles.actions}>
          <Link href="/account/orders" className="btn btn-outline">
            View All Orders
          </Link>
          <Link href="/shop" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
