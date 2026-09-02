import React from 'react';
import Link from 'next/link';
import { Globe, Mail } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>KUHUDE</Link>
            <p className={styles.tagline}>Born to Remember</p>
            <p className={styles.description}>
              Premium fragrance and lifestyle products crafted for the woman who leaves an impression.
            </p>
            <div className={styles.socials}>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Globe size={20} />
              </a>
              <a href="mailto:hello@kuhude.com" aria-label="Email">
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Shop</h4>
            <ul>
              <li><Link href="/shop?category=perfumes">Perfumes</Link></li>
              <li><Link href="/shop?category=body-mists">Body Mists</Link></li>
              <li><Link href="/shop?category=body-care">Body Care</Link></li>
              <li><Link href="/shop?category=gift-sets">Gift Sets</Link></li>
              <li><Link href="/shop?category=accessories">Accessories</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Company</h4>
            <ul>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/about#faq">FAQ</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Help</h4>
            <ul>
              <li><Link href="/shipping">Shipping</Link></li>
              <li><Link href="/returns">Returns</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>&copy; {new Date().getFullYear()} KUHUDE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
