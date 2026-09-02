'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, Heart, MapPin, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { formatPrice, formatDate } from '@/lib/utils';
import type { Order } from '@/types/database';
import { ORDER_STATUS_LABELS } from '@/lib/constants';

export default function AccountOverview() {
  const { profile } = useAuth();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({ orders: 0, wishlist: 0, addresses: 0 });

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [ordersRes, wishlistRes, addressRes] = await Promise.all([
        supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(3),
        supabase.from('wishlists').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('addresses').select('id', { count: 'exact' }).eq('user_id', user.id),
      ]);

      setRecentOrders(ordersRes.data || []);
      setStats({
        orders: ordersRes.data?.length || 0,
        wishlist: wishlistRes.count || 0,
        addresses: addressRes.count || 0,
      });
    };
    load();
  }, []);

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', color: 'var(--color-deep-plum)', marginBottom: 'var(--space-2)' }}>
        Hello, {profile?.full_name || 'there'}
      </h1>
      <p style={{ color: 'var(--color-gray-500)', marginBottom: 'var(--space-8)' }}>
        Welcome back to your KUHUDE account.
      </p>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-10)' }}>
        {[
          { label: 'Orders', value: stats.orders, icon: Package, href: '/account/orders' },
          { label: 'Wishlist', value: stats.wishlist, icon: Heart, href: '/account/wishlist' },
          { label: 'Addresses', value: stats.addresses, icon: MapPin, href: '/account/addresses' },
        ].map(stat => (
          <Link key={stat.label} href={stat.href} style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-5)',
            background: 'var(--color-white)', borderRadius: 'var(--radius-lg)', textDecoration: 'none',
            border: '1px solid var(--color-gray-100)', transition: 'all 0.2s'
          }}>
            <stat.icon size={24} style={{ color: 'var(--color-royal-purple)' }} />
            <div>
              <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 600, color: 'var(--color-deep-plum)' }}>{stat.value}</p>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)' }}>{stat.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', color: 'var(--color-deep-plum)' }}>Recent Orders</h2>
          <Link href="/account/orders" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-royal-purple)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            View All <ArrowRight size={14} />
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-12)', background: 'var(--color-white)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-gray-100)' }}>
            <Package size={36} style={{ color: 'var(--color-gray-300)', marginBottom: 'var(--space-3)' }} />
            <p style={{ color: 'var(--color-gray-500)' }}>No orders yet.</p>
            <Link href="/shop" className="btn btn-primary btn-sm" style={{ marginTop: 'var(--space-4)', display: 'inline-flex' }}>
              Start Shopping
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {recentOrders.map(order => (
              <Link key={order.id} href={`/account/orders/${order.id}`} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: 'var(--space-4) var(--space-5)', background: 'var(--color-white)',
                borderRadius: 'var(--radius-md)', textDecoration: 'none',
                border: '1px solid var(--color-gray-100)'
              }}>
                <div>
                  <p style={{ fontWeight: 500, color: 'var(--color-gray-800)', fontSize: 'var(--text-sm)' }}>
                    #{order.order_number}
                  </p>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)' }}>
                    {formatDate(order.created_at)}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 600, color: 'var(--color-deep-plum)', fontSize: 'var(--text-sm)' }}>
                    {formatPrice(Number(order.total))}
                  </p>
                  <span className={`badge badge-${order.status === 'delivered' ? 'success' : order.status === 'cancelled' ? 'error' : 'purple'}`}>
                    {ORDER_STATUS_LABELS[order.status] || order.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
