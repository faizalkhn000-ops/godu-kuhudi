'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Star, Heart, ShoppingBag, Minus, Plus, Truck, RotateCcw, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useCart } from '@/lib/context/CartContext';
import { useWishlist } from '@/lib/context/WishlistContext';
import { useAuth } from '@/lib/context/AuthContext';
import { useToast } from '@/components/ui/Toast/Toast';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import ProductCard from '@/components/store/ProductCard/ProductCard';
import type { Product, ProductVariant, Review } from '@/types/database';
import styles from './page.module.css';

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [showIngredients, setShowIngredients] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const supabase = createClient();

      const { data: productData } = await supabase
        .from('products')
        .select('*, category:categories(*), images:product_images(*), variants:product_variants(*)')
        .eq('slug', slug)
        .single();

      if (productData) {
        setProduct(productData);
        if (productData.variants?.length > 0) {
          setSelectedVariant(productData.variants[0]);
        }

        // Load reviews
        const { data: reviewData } = await supabase
          .from('reviews')
          .select('*, profile:profiles(full_name, avatar_url)')
          .eq('product_id', productData.id)
          .eq('is_approved', true)
          .order('created_at', { ascending: false })
          .limit(10);
        setReviews(reviewData || []);

        // Load related
        if (productData.category_id) {
          const { data: relatedData } = await supabase
            .from('products')
            .select('*, category:categories(*), images:product_images(*)')
            .eq('category_id', productData.category_id)
            .eq('status', 'active')
            .neq('id', productData.id)
            .limit(4);
          setRelated(relatedData || []);
        }
      }
      setIsLoading(false);
    };
    load();
  }, [slug]);

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.notFound}>
        <h2>Product not found</h2>
        <p>The fragrance you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/shop" className="btn btn-primary">Back to Shop</Link>
      </div>
    );
  }

  const currentPrice = selectedVariant ? Number(selectedVariant.price) : Number(product.price);
  const comparePrice = selectedVariant ? selectedVariant.compare_at_price : product.compare_at_price;
  const discount = calculateDiscount(currentPrice, comparePrice ? Number(comparePrice) : null);
  const inStock = selectedVariant
    ? selectedVariant.inventory_count > 0
    : product.inventory_count > 0;
  const images = product.images || [];
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = async () => {
    await addItem(product.id, selectedVariant?.id, quantity);
    toast.success(`${product.name} added to cart`);
  };

  const handleBuyNow = async () => {
    await addItem(product.id, selectedVariant?.id, quantity);
    window.location.href = '/checkout';
  };

  return (
    <div className={styles.page}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <div className={styles.container}>
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/shop">Shop</Link>
          {product.category && (
            <>
              <span>/</span>
              <Link href={`/shop?category=${product.category.slug}`}>{product.category.name}</Link>
            </>
          )}
          <span>/</span>
          <span className={styles.breadcrumbCurrent}>{product.name}</span>
        </div>
      </div>

      {/* Main Product Section */}
      <div className={styles.productSection}>
        <div className={styles.container}>
          <div className={styles.productGrid}>
            {/* Gallery */}
            <div className={styles.gallery}>
              <div className={styles.mainImage}>
                {images.length > 0 ? (
                  <img src={images[selectedImage]?.url} alt={images[selectedImage]?.alt_text || product.name} />
                ) : (
                  <div className={styles.imagePlaceholder}>
                    <span>{product.name[0]}</span>
                  </div>
                )}
                {discount > 0 && (
                  <span className={styles.discountBadge}>-{discount}%</span>
                )}
              </div>
              {images.length > 1 && (
                <div className={styles.thumbnails}>
                  {images.map((img, i) => (
                    <button
                      key={img.id}
                      className={`${styles.thumbnail} ${i === selectedImage ? styles.thumbnailActive : ''}`}
                      onClick={() => setSelectedImage(i)}
                    >
                      <img src={img.url} alt={img.alt_text || ''} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className={styles.info}>
              {product.category && (
                <span className={styles.category}>{product.category.name}</span>
              )}
              <h1 className={styles.name}>{product.name}</h1>

              {/* Rating */}
              <div className={styles.rating}>
                <div className={styles.stars}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < Math.round(product.rating_avg) ? 'var(--color-champagne)' : 'none'}
                      stroke={i < Math.round(product.rating_avg) ? 'var(--color-champagne)' : 'var(--color-gray-300)'}
                    />
                  ))}
                </div>
                <span className={styles.ratingText}>
                  {product.rating_avg > 0 ? product.rating_avg.toFixed(1) : '—'}
                </span>
                <span className={styles.reviewCount}>({product.rating_count} reviews)</span>
              </div>

              {/* Price */}
              <div className={styles.pricing}>
                <span className={styles.price}>{formatPrice(currentPrice)}</span>
                {comparePrice && Number(comparePrice) > currentPrice && (
                  <span className={styles.comparePrice}>{formatPrice(Number(comparePrice))}</span>
                )}
                {discount > 0 && (
                  <span className={styles.discountText}>Save {discount}%</span>
                )}
              </div>

              <p className={styles.description}>{product.short_description}</p>

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className={styles.variants}>
                  <label className={styles.variantLabel}>Size</label>
                  <div className={styles.variantOptions}>
                    {product.variants.map(variant => (
                      <button
                        key={variant.id}
                        className={`${styles.variantBtn} ${selectedVariant?.id === variant.id ? styles.variantActive : ''}`}
                        onClick={() => setSelectedVariant(variant)}
                      >
                        {variant.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className={styles.quantitySection}>
                <label className={styles.variantLabel}>Quantity</label>
                <div className={styles.quantityControl}>
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className={styles.qtyBtn}>
                    <Minus size={16} />
                  </button>
                  <span className={styles.qtyValue}>{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(10, q + 1))} className={styles.qtyBtn}>
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className={styles.actions}>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  style={{ flex: 1 }}
                >
                  <ShoppingBag size={18} />
                  {inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
                <button
                  className="btn btn-secondary btn-lg"
                  onClick={handleBuyNow}
                  disabled={!inStock}
                >
                  Buy Now
                </button>
                <button
                  className={`${styles.wishlistBtn} ${inWishlist ? styles.wishlisted : ''}`}
                  onClick={() => user ? toggleWishlist(product.id) : window.location.assign('/auth/login')}
                  aria-label="Toggle wishlist"
                >
                  <Heart size={20} fill={inWishlist ? 'currentColor' : 'none'} />
                </button>
              </div>

              {/* Stock */}
              {!inStock && (
                <p className={styles.stockWarning}>This product is currently out of stock.</p>
              )}

              {/* Shipping Info */}
              <div className={styles.infoCards}>
                <div className={styles.infoCard}>
                  <Truck size={18} />
                  <span>Free shipping on orders above ₹999</span>
                </div>
                <div className={styles.infoCard}>
                  <RotateCcw size={18} />
                  <span>15-day hassle-free returns</span>
                </div>
                <div className={styles.infoCard}>
                  <Shield size={18} />
                  <span>100% authentic products</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fragrance Notes */}
      {(product.fragrance_top_notes || product.fragrance_heart_notes || product.fragrance_base_notes) && (
        <section className={styles.fragranceSection}>
          <div className={styles.container}>
            <h2 className={styles.fragranceTitle}>Fragrance Journey</h2>
            <div className={styles.fragranceTimeline}>
              {product.fragrance_top_notes && (
                <div className={styles.fragranceNote}>
                  <div className={styles.noteMarker}>
                    <div className={styles.noteDot} />
                    <div className={styles.noteLine} />
                  </div>
                  <div className={styles.noteContent}>
                    <span className={styles.noteLabel}>Top Notes</span>
                    <p className={styles.noteText}>{product.fragrance_top_notes}</p>
                    <span className={styles.noteTime}>First impression · 0-15 min</span>
                  </div>
                </div>
              )}
              {product.fragrance_heart_notes && (
                <div className={styles.fragranceNote}>
                  <div className={styles.noteMarker}>
                    <div className={styles.noteDot} style={{ background: 'var(--color-royal-purple)' }} />
                    <div className={styles.noteLine} />
                  </div>
                  <div className={styles.noteContent}>
                    <span className={styles.noteLabel}>Heart Notes</span>
                    <p className={styles.noteText}>{product.fragrance_heart_notes}</p>
                    <span className={styles.noteTime}>The soul · 15 min - 2 hrs</span>
                  </div>
                </div>
              )}
              {product.fragrance_base_notes && (
                <div className={styles.fragranceNote}>
                  <div className={styles.noteMarker}>
                    <div className={styles.noteDot} style={{ background: 'var(--color-deep-plum)' }} />
                  </div>
                  <div className={styles.noteContent}>
                    <span className={styles.noteLabel}>Base Notes</span>
                    <p className={styles.noteText}>{product.fragrance_base_notes}</p>
                    <span className={styles.noteTime}>The memory · 2+ hrs</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Product Details & Ingredients Accordion */}
      <section className={styles.detailsSection}>
        <div className={styles.container}>
          {product.description && (
            <div className={styles.accordion}>
              <button className={styles.accordionBtn} onClick={() => setShowDetails(!showDetails)}>
                <span>Product Details</span>
                {showDetails ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {showDetails && (
                <div className={styles.accordionContent}>
                  <p>{product.description}</p>
                </div>
              )}
            </div>
          )}
          {product.ingredients && (
            <div className={styles.accordion}>
              <button className={styles.accordionBtn} onClick={() => setShowIngredients(!showIngredients)}>
                <span>Ingredients</span>
                {showIngredients ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {showIngredients && (
                <div className={styles.accordionContent}>
                  <p>{product.ingredients}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Reviews */}
      <section className={styles.reviewsSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Reviews</h2>
          {reviews.length === 0 ? (
            <p className={styles.noReviews}>No reviews yet. Be the first to share your experience.</p>
          ) : (
            <div className={styles.reviewsList}>
              {reviews.map(review => (
                <div key={review.id} className={styles.reviewItem}>
                  <div className={styles.reviewHeader}>
                    <div className={styles.reviewStars}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={i < review.rating ? 'var(--color-champagne)' : 'none'}
                          stroke={i < review.rating ? 'var(--color-champagne)' : 'var(--color-gray-300)'}
                        />
                      ))}
                    </div>
                    {review.is_verified_purchase && (
                      <span className="badge badge-success">Verified</span>
                    )}
                  </div>
                  {review.title && <h4 className={styles.reviewTitle}>{review.title}</h4>}
                  {review.comment && <p className={styles.reviewComment}>{review.comment}</p>}
                  <span className={styles.reviewAuthor}>
                    {(review.profile as unknown as { full_name: string })?.full_name || 'Anonymous'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className={styles.relatedSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>You May Also Love</h2>
            <div className={styles.relatedGrid}>
              {related.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
