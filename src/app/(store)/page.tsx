'use client';

import React, { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowRight, Star, ChevronRight, Send } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import ProductCard from '@/components/store/ProductCard/ProductCard';
import { MOODS } from '@/lib/constants';
import type { Product } from '@/types/database';
import styles from './page.module.css';

const HeroScene = dynamic(() => import('@/components/three/HeroScene'), {
  ssr: false,
  loading: () => <div className={styles.heroSceneLoading} />,
});

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [bestsellers, setBestsellers] = useState<Product[]>([]);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      const supabase = createClient();
      
      const { data: featuredData } = await supabase
        .from('products')
        .select('*, category:categories(*), images:product_images(*)')
        .eq('status', 'active')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(4);
      
      const { data: bestsellerData } = await supabase
        .from('products')
        .select('*, category:categories(*), images:product_images(*)')
        .eq('status', 'active')
        .eq('is_bestseller', true)
        .order('rating_avg', { ascending: false })
        .limit(4);

      setFeatured(featuredData || []);
      setBestsellers(bestsellerData || []);
    };
    loadProducts();
  }, []);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const reviews = [
    { name: 'Priya S.', rating: 5, text: 'Velvet Memoir is extraordinary. I\'ve never received so many compliments. The sillage is perfect — noticeable but never overwhelming.', verified: true },
    { name: 'Ananya M.', rating: 5, text: 'The packaging alone made me feel special. But the scent — Midnight Jasmine is pure magic. It lasts all day and evolves beautifully.', verified: true },
    { name: 'Riya K.', rating: 5, text: 'I bought the Memory Collection as a gift and ended up keeping it. Each fragrance tells a different story. Absolutely in love with KUHUDE.', verified: true },
  ];

  return (
    <>
      {/* ======== HERO ======== */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <p className={styles.heroLabel}>Premium Fragrance</p>
            <h1 className={styles.heroTitle}>
              Born to<br />Remember.
            </h1>
            <p className={styles.heroSubtitle}>
              Fragrance made to become a memory.
            </p>
            <div className={styles.heroCtas}>
              <Link href="/shop" className="btn btn-primary btn-lg">
                Shop the Collection
                <ArrowRight size={18} />
              </Link>
              <Link href="/fragrance-finder" className="btn btn-secondary btn-lg">
                Discover Your Scent
              </Link>
            </div>
          </div>
          <div className={styles.heroScene}>
            <Suspense fallback={<div className={styles.heroSceneLoading} />}>
              <HeroScene />
            </Suspense>
          </div>
        </div>
        <div className={styles.heroGradient} />
      </section>

      {/* ======== FEATURED ======== */}
      <section className={`${styles.section} ${styles.featured}`}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionLabel}>Curated Selection</p>
            <h2 className={styles.sectionTitle}>Made to Linger.</h2>
            <p className={styles.sectionSubtitle}>Our most unforgettable creations.</p>
          </div>
          <div className={styles.productGrid}>
            {featured.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className={styles.sectionCta}>
            <Link href="/shop" className="btn btn-secondary">
              View All Products
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ======== SHOP BY MOOD ======== */}
      <section className={`${styles.section} ${styles.moodSection}`}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionLabel}>Find Your Signature</p>
            <h2 className={styles.sectionTitle}>How do you want to be remembered?</h2>
            <p className={styles.sectionSubtitle}>Every mood has a scent. Find yours.</p>
          </div>
          <div className={styles.moodGrid}>
            {MOODS.map(mood => (
              <Link
                key={mood.slug}
                href={`/shop?mood=${mood.slug}`}
                className={styles.moodCard}
              >
                <div className={styles.moodCardBg} style={{ background: mood.gradient }} />
                <div className={styles.moodCardContent}>
                  <h3 className={styles.moodName}>{mood.name}</h3>
                  <p className={styles.moodDesc}>{mood.description}</p>
                  <span className={styles.moodExplore}>
                    Explore <ChevronRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ======== BRAND STORY ======== */}
      <section className={`${styles.section} ${styles.storySection}`}>
        <div className={styles.storyContainer}>
          <div className={styles.storyContent}>
            <p className={styles.storyLine}>Some moments disappear.</p>
            <p className={styles.storyLine}>Some stay with you.</p>
            <div className={styles.storyDivider} />
            <p className={styles.storyParagraph}>
              KUHUDE was created for the moments that deserve to linger — the first impression, 
              the late-night conversation, the person you can&apos;t forget.
            </p>
            <p className={styles.storyHighlight}>
              Because the best fragrance isn&apos;t simply noticed.
            </p>
            <p className={styles.storyHighlightBold}>
              It&apos;s remembered.
            </p>
            <Link href="/about" className="btn btn-secondary" style={{ marginTop: '2rem' }}>
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* ======== BESTSELLERS ======== */}
      <section className={`${styles.section} ${styles.bestsellers}`}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionLabel}>Community Favourites</p>
            <h2 className={styles.sectionTitle}>Most Loved.</h2>
            <p className={styles.sectionSubtitle}>The fragrances our community reaches for again and again.</p>
          </div>
          <div className={styles.productGrid}>
            {bestsellers.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ======== SOCIAL PROOF ======== */}
      <section className={`${styles.section} ${styles.reviewsSection}`}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionLabel}>What They Say</p>
            <h2 className={styles.sectionTitle}>Unforgettable Impressions.</h2>
          </div>
          <div className={styles.reviewsGrid}>
            {reviews.map((review, i) => (
              <div key={i} className={styles.reviewCard}>
                <div className={styles.reviewStars}>
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <Star key={j} size={16} fill="var(--color-champagne)" stroke="var(--color-champagne)" />
                  ))}
                </div>
                <p className={styles.reviewText}>&ldquo;{review.text}&rdquo;</p>
                <div className={styles.reviewAuthor}>
                  <span className={styles.reviewName}>{review.name}</span>
                  {review.verified && (
                    <span className={styles.verifiedBadge}>✓ Verified Purchase</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======== NEWSLETTER ======== */}
      <section className={`${styles.section} ${styles.newsletter}`}>
        <div className={styles.newsletterContainer}>
          <h2 className={styles.newsletterTitle}>Stay unforgettable.</h2>
          <p className={styles.newsletterText}>
            Be the first to discover new scents and exclusive offers.
          </p>
          {subscribed ? (
            <p className={styles.subscribeSuccess}>
              Welcome to the KUHUDE family. ✦
            </p>
          ) : (
            <form onSubmit={handleNewsletter} className={styles.newsletterForm}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className={styles.newsletterInput}
                required
              />
              <button type="submit" className="btn btn-primary">
                <Send size={16} />
                Subscribe
              </button>
            </form>
          )}
          <p className={styles.newsletterDisclaimer}>
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </>
  );
}
