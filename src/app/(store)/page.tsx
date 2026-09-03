'use client';

import React, { Suspense, useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowRight, Star, ChevronRight, Send, Sparkles, Award, Leaf, Package } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import ProductCard from '@/components/store/ProductCard/ProductCard';
import { MOODS } from '@/lib/constants';
import type { Product } from '@/types/database';
import styles from './page.module.css';

const HeroScene = dynamic(() => import('@/components/three/HeroScene'), {
  ssr: false,
  loading: () => <div className={styles.heroSceneLoading} />,
});

// Scroll-reveal component
function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.disconnect(); } },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

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

  const marqueeItems = [
    'Born to Remember', '✦', 'Premium Fragrance', '✦', 'Handcrafted in India',
    '✦', 'Free Shipping over ₹2,000', '✦', 'Long-Lasting Sillage', '✦',
    'Born to Remember', '✦', 'Premium Fragrance', '✦', 'Handcrafted in India',
    '✦', 'Free Shipping over ₹2,000', '✦', 'Long-Lasting Sillage', '✦',
  ];

  const stats = [
    { value: '50,000+', label: 'Happy Customers' },
    { value: '4.9/5', label: 'Average Rating' },
    { value: '25+', label: 'Unique Fragrances' },
    { value: '100%', label: 'Paraben Free' },
  ];

  const features = [
    { icon: <Leaf size={22} />, title: 'All Natural', desc: 'Free from parabens, sulphates, and synthetic dyes' },
    { icon: <Award size={22} />, title: 'Award Winning', desc: 'Recognised for excellence in Indian perfumery' },
    { icon: <Package size={22} />, title: 'Premium Packaging', desc: 'Luxury boxes crafted for gifting and collection' },
    { icon: <Sparkles size={22} />, title: 'Long Lasting', desc: '12–16 hours of lingering sillage on skin' },
  ];

  return (
    <>
      {/* ======== MARQUEE TICKER ======== */}
      <div className={styles.ticker}>
        <div className={styles.tickerTrack}>
          {marqueeItems.map((item, i) => (
            <span key={i} className={styles.tickerItem}>{item}</span>
          ))}
        </div>
      </div>

      {/* ======== HERO ======== */}
      <section className={styles.hero}>
        {/* Floating orbs */}
        <div className={styles.orb1} />
        <div className={styles.orb2} />
        <div className={styles.orb3} />
        
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <p className={styles.heroLabel}>
              <Sparkles size={12} />
              Premium Fragrance
            </p>
            <h1 className={styles.heroTitle}>
              <span className={styles.heroTitleLine}>Born to</span>
              <span className={`${styles.heroTitleLine} ${styles.heroTitleAccent}`}>Remember.</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Fragrance made to become a memory.
            </p>
            <div className={styles.heroCtas}>
              <Link href="/shop" className={`btn btn-primary btn-lg ${styles.heroCta}`}>
                Shop the Collection
                <ArrowRight size={18} />
              </Link>
              <Link href="/fragrance-finder" className={`btn btn-secondary btn-lg ${styles.heroCta}`}>
                Discover Your Scent
              </Link>
            </div>
            <div className={styles.heroTrust}>
              <div className={styles.heroTrustStars}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="var(--color-champagne)" stroke="none" />
                ))}
              </div>
              <span className={styles.heroTrustText}>Loved by 50,000+ customers</span>
            </div>
          </div>
          <div className={styles.heroScene}>
            <Suspense fallback={<div className={styles.heroSceneLoading} />}>
              <HeroScene />
            </Suspense>
          </div>
        </div>
        <div className={styles.heroGradient} />
        <div className={styles.heroScrollIndicator}>
          <div className={styles.heroScrollLine} />
        </div>
      </section>

      {/* ======== FEATURED ======== */}
      <section className={`${styles.section} ${styles.featured}`}>
        <div className={styles.container}>
          <Reveal>
            <div className={styles.sectionHeader}>
              <p className={styles.sectionLabel}>Curated Selection</p>
              <h2 className={styles.sectionTitle}>Made to Linger.</h2>
              <p className={styles.sectionSubtitle}>Our most unforgettable creations.</p>
            </div>
          </Reveal>
          <div className={styles.productGrid}>
            {featured.map((product, i) => (
              <Reveal key={product.id} delay={i * 80}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className={styles.sectionCta}>
              <Link href="/shop" className="btn btn-secondary">
                View All Products
                <ChevronRight size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ======== STATS ======== */}
      <section className={styles.statsSection}>
        <div className={styles.statsGrid}>
          {stats.map((stat, i) => (
            <Reveal key={i} delay={i * 80} className={styles.statItemWrap}>
              <div className={styles.statItem}>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ======== SHOP BY MOOD ======== */}
      <section className={`${styles.section} ${styles.moodSection}`}>
        <div className={styles.container}>
          <Reveal>
            <div className={styles.sectionHeader}>
              <p className={styles.sectionLabel}>Find Your Signature</p>
              <h2 className={styles.sectionTitle}>How do you want to be remembered?</h2>
              <p className={styles.sectionSubtitle}>Every mood has a scent. Find yours.</p>
            </div>
          </Reveal>
          <div className={styles.moodGrid}>
            {MOODS.map((mood, i) => (
              <Reveal key={mood.slug} delay={i * 60}>
                <Link
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
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ======== BRAND STORY ======== */}
      <section className={styles.storySection}>
        <div className={styles.storyBg} />
        <div className={styles.storyGlow1} />
        <div className={styles.storyGlow2} />
        <div className={styles.storyContainer}>
          <Reveal>
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
              <Link href="/about" className="btn btn-secondary" style={{ marginTop: '2.5rem', borderColor: 'rgba(199,167,232,0.4)', color: 'var(--color-soft-lavender)' }}>
                Our Story
                <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ======== FEATURES ======== */}
      <section className={styles.featuresSection}>
        <div className={styles.container}>
          <div className={styles.featuresGrid}>
            {features.map((f, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className={styles.featureCard}>
                  <div className={styles.featureIcon}>{f.icon}</div>
                  <h4 className={styles.featureTitle}>{f.title}</h4>
                  <p className={styles.featureDesc}>{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ======== BESTSELLERS ======== */}
      <section className={`${styles.section} ${styles.bestsellers}`}>
        <div className={styles.container}>
          <Reveal>
            <div className={styles.sectionHeader}>
              <p className={styles.sectionLabel}>Community Favourites</p>
              <h2 className={styles.sectionTitle}>Most Loved.</h2>
              <p className={styles.sectionSubtitle}>The fragrances our community reaches for again and again.</p>
            </div>
          </Reveal>
          <div className={styles.productGrid}>
            {bestsellers.map((product, i) => (
              <Reveal key={product.id} delay={i * 80}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ======== SOCIAL PROOF ======== */}
      <section className={`${styles.section} ${styles.reviewsSection}`}>
        <div className={styles.container}>
          <Reveal>
            <div className={styles.sectionHeader}>
              <p className={styles.sectionLabel}>What They Say</p>
              <h2 className={styles.sectionTitle}>Unforgettable Impressions.</h2>
            </div>
          </Reveal>
          <div className={styles.reviewsGrid}>
            {reviews.map((review, i) => (
              <Reveal key={i} delay={i * 120}>
                <div className={styles.reviewCard}>
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
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ======== NEWSLETTER ======== */}
      <section className={`${styles.section} ${styles.newsletter}`}>
        <div className={styles.newsletterGlow} />
        <Reveal>
          <div className={styles.newsletterContainer}>
            <p className={styles.sectionLabel} style={{ marginBottom: '1rem', display: 'inline-flex' }}>Stay Connected</p>
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
                <button type="submit" className={`btn btn-primary ${styles.newsletterBtn}`}>
                  <Send size={16} />
                  Subscribe
                </button>
              </form>
            )}
            <p className={styles.newsletterDisclaimer}>
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
