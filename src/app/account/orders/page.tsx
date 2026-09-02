'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatPrice, formatDate } from '@/lib/utils';
import { ORDER_STATUS_LABELS } from '@/lib/constants';
import type { Order } from '@/types/database';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      setOrders(data || []);
      setIsLoading(false);
    };
    load();
  }, []);

  if (isLoading) return <div style={{ padding: 'var(--space-12)', textAlign: 'center', color: 'var(--color-gray-400)' }}>Loading orders...</div>;

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', color: 'var(--color-deep-plum)', marginBottom: 'var(--space-8)' }}>My Orders</h1>
      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-16)', background: 'var(--color-white)', borderRadius: 'var(--radius-lg)' }}>
          <Package size={48} style={{ color: 'var(--color-gray-300)', marginBottom: 'var(--space-4)' }} />
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-gray-600)', marginBottom: 'var(--space-2)' }}>No orders yet</h3>
          <p style={{ color: 'var(--color-gray-400)', marginBottom: 'var(--space-6)' }}>When you place an order, it will appear here.</p>
          <Link href="/shop" className="btn btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {orders.map(order => (
            <Link key={order.id} href={`/account/orders/${order.id}`} style={{
              display: 'grid', gridTemplateColumns: '1fr auto auto', alignItems: 'center', gap: 'var(--space-6)',
              padding: 'var(--space-5) var(--space-6)', background: 'var(--color-white)', borderRadius: 'var(--radius-lg)',
              textDecoration: 'none', border: '1px solid var(--color-gray-100)', transition: 'box-shadow 0.2s'
            }}>
              <div>
                <p style={{ fontWeight: 600, color: 'var(--color-gray-800)', marginBottom: '4px' }}>Order #{order.order_number}</p>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-400)' }}>{formatDate(order.created_at)}</p>
              </div>
              <span className={`badge badge-${order.status === 'delivered' ? 'success' : order.status === 'cancelled' ? 'error' : 'purple'}`}>
                {ORDER_STATUS_LABELS[order.status] || order.status}
              </span>
              <p style={{ fontWeight: 600, color: 'var(--color-deep-plum)' }}>{formatPrice(Number(order.total))}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
