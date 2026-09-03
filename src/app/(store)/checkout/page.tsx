import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import CheckoutClient from './CheckoutClient';
import styles from './page.module.css';

export const metadata = {
  title: 'Checkout | KUHUDE',
  description: 'Secure checkout for KUHUDE fragrances.',
};

export default async function CheckoutPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  // For this MVP, we require users to be logged in to checkout
  if (!session) {
    redirect('/auth/login?redirectTo=/checkout');
  }

  // Fetch user profile and default address if any
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  const { data: defaultAddress } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', session.user.id)
    .eq('is_default', true)
    .maybeSingle();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Secure Checkout</h1>
        <p className={styles.subtitle}>Complete your purchase</p>
      </div>
      <CheckoutClient 
        user={{
          id: session.user.id,
          email: session.user.email!,
          fullName: profile?.full_name || '',
          phone: profile?.phone || '',
        }}
        defaultAddress={defaultAddress || null}
      />
    </div>
  );
}
