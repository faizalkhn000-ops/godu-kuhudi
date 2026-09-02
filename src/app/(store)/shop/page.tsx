'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import ProductCard from '@/components/store/ProductCard/ProductCard';
import type { Product, Category } from '@/types/database';
import { ITEMS_PER_PAGE } from '@/lib/constants';
import styles from './page.module.css';

function ShopContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Filter state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [mood, setMood] = useState(searchParams.get('mood') || '');
  const [sort, setSort] = useState('newest');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStock, setInStock] = useState(false);
  const [page, setPage] = useState(1);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    const supabase = createClient();

    let query = supabase
      .from('products')
      .select('*, category:categories(*), images:product_images(*)', { count: 'exact' })
      .eq('status', 'active');

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }
    if (category) {
      query = query.eq('categories.slug', category);
    }
    if (mood) {
      query = query.eq('mood', mood);
    }
    if (minPrice) {
      query = query.gte('price', Number(minPrice));
    }
    if (maxPrice) {
      query = query.lte('price', Number(maxPrice));
    }
    if (inStock) {
      query = query.gt('inventory_count', 0);
    }

    // Sort
    switch (sort) {
      case 'price_asc':
        query = query.order('price', { ascending: true });
        break;
      case 'price_desc':
        query = query.order('price', { ascending: false });
        break;
      case 'rating':
        query = query.order('rating_avg', { ascending: false });
        break;
      case 'name':
        query = query.order('name', { ascending: true });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }

    // Pagination
    const from = (page - 1) * ITEMS_PER_PAGE;
    query = query.range(from, from + ITEMS_PER_PAGE - 1);

    const { data, count } = await query;
    setProducts(data || []);
    setTotal(count || 0);
    setIsLoading(false);
  }, [search, category, mood, sort, minPrice, maxPrice, inStock, page]);

  useEffect(() => {
    const supabase = createClient();
    supabase.from('categories').select('*').eq('is_active', true).order('sort_order').then(({ data }) => {
      setCategories(data || []);
    });
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setMood('');
    setSort('newest');
    setMinPrice('');
    setMaxPrice('');
    setInStock(false);
    setPage(1);
  };

  const hasActiveFilters = search || category || mood || minPrice || maxPrice || inStock;

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Shop</h1>
          <p className={styles.subtitle}>Discover fragrances crafted to become memories.</p>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.container}>
          {/* Toolbar */}
          <div className={styles.toolbar}>
            <div className={styles.searchBar}>
              <Search size={18} className={styles.searchIcon} />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search fragrances..."
                className={styles.searchInput}
              />
              {search && (
                <button onClick={() => setSearch('')} className={styles.searchClear}>
                  <X size={16} />
                </button>
              )}
            </div>
            <div className={styles.toolbarRight}>
              <button
                className={`${styles.filterToggle} ${showFilters ? styles.filterToggleActive : ''}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal size={16} />
                Filters
                {hasActiveFilters && <span className={styles.filterDot} />}
              </button>
              <div className={styles.sortWrapper}>
                <select
                  value={sort}
                  onChange={(e) => { setSort(e.target.value); setPage(1); }}
                  className={styles.sortSelect}
                >
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="name">Name A-Z</option>
                </select>
                <ChevronDown size={14} className={styles.sortIcon} />
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className={styles.filters}>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Category</label>
                <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} className={styles.filterSelect}>
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Price Range</label>
                <div className={styles.priceRange}>
                  <input type="number" placeholder="Min" value={minPrice} onChange={(e) => { setMinPrice(e.target.value); setPage(1); }} className={styles.priceInput} />
                  <span>—</span>
                  <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }} className={styles.priceInput} />
                </div>
              </div>
              <div className={styles.filterGroup}>
                <label className={styles.filterCheckbox}>
                  <input type="checkbox" checked={inStock} onChange={(e) => { setInStock(e.target.checked); setPage(1); }} />
                  <span>In Stock Only</span>
                </label>
              </div>
              {hasActiveFilters && (
                <button onClick={clearFilters} className={styles.clearFilters}>
                  Clear All Filters
                </button>
              )}
            </div>
          )}

          {/* Results info */}
          <div className={styles.resultsInfo}>
            <span>{total} {total === 1 ? 'product' : 'products'}</span>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className={styles.grid}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className={styles.skeleton}>
                  <div className={styles.skeletonImage} />
                  <div className={styles.skeletonBody}>
                    <div className={styles.skeletonLine} style={{ width: '40%' }} />
                    <div className={styles.skeletonLine} style={{ width: '70%' }} />
                    <div className={styles.skeletonLine} style={{ width: '50%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className={styles.empty}>
              <Search size={48} strokeWidth={1} />
              <h3>No products found</h3>
              <p>Try adjusting your filters or search terms.</p>
              <button onClick={clearFilters} className="btn btn-secondary">
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className={styles.grid}>
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage(p => p - 1)}
                    className={styles.pageBtn}
                  >
                    Previous
                  </button>
                  <span className={styles.pageInfo}>
                    Page {page} of {totalPages}
                  </span>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className={styles.pageBtn}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense>
      <ShopContent />
    </Suspense>
  );
}
