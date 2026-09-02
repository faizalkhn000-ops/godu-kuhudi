'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Package, Heart, MapPin, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import Navbar from '@/components/store/Navbar/Navbar';
import Footer from '@/components/store/Footer/Footer';
import styles from './layout.module.css';

const accountLinks = [
  { href: '/account', label: 'Overview', icon: User },
  { href: '/account/orders', label: 'Orders', icon: Package },
  { href: '/account/wishlist', label: 'Wishlist', icon: Heart },
  { href: '/account/addresses', label: 'Addresses', icon: MapPin },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, signOut } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      window.location.href = '/auth/login';
    }
  }, [user, isLoading]);

  if (isLoading || !user) {
    return (
      <>
        <Navbar />
        <div className={styles.loading}>
          <div className={styles.spinner} />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className={styles.page}>
        <div className={styles.container}>
          <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <h2 className={styles.sidebarTitle}>My Account</h2>
            </div>
            <nav className={styles.nav}>
              {accountLinks.map(link => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                  >
                    <Icon size={18} />
                    {link.label}
                  </Link>
                );
              })}
              <button onClick={signOut} className={styles.logoutBtn}>
                <LogOut size={18} />
                Sign Out
              </button>
            </nav>
          </aside>
          <main className={styles.content}>
            {children}
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
