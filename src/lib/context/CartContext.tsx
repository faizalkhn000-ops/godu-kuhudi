'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { CartItem, Product, CartSummary } from '@/types/database';
import { calculateShipping, calculateTax } from '@/lib/utils';

interface LocalCartItem {
  product_id: string;
  variant_id: string | null;
  quantity: number;
  product?: Product;
}

interface CartContextType {
  items: (CartItem | LocalCartItem)[];
  itemCount: number;
  summary: CartSummary;
  isOpen: boolean;
  isLoading: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (productId: string, variantId?: string | null, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, variantId: string | null, quantity: number) => Promise<void>;
  removeItem: (productId: string, variantId?: string | null) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'kuhude_cart';

function getLocalCart(): LocalCartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function setLocalCart(items: LocalCartItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<(CartItem | LocalCartItem)[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const supabase = createClient();

  // Check auth state
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  // Load cart
  const refreshCart = useCallback(async () => {
    setIsLoading(true);
    try {
      if (userId) {
        const { data } = await supabase
          .from('cart_items')
          .select('*, product:products(*, images:product_images(*)), variant:product_variants(*)')
          .eq('user_id', userId);
        setItems(data || []);
      } else {
        const localItems = getLocalCart();
        // Fetch product details for local cart items
        if (localItems.length > 0) {
          const productIds = localItems.map(i => i.product_id);
          const { data: products } = await supabase
            .from('products')
            .select('*, images:product_images(*)')
            .in('id', productIds);
          
          const enriched = localItems.map(item => ({
            ...item,
            product: products?.find(p => p.id === item.product_id),
          }));
          setItems(enriched);
        } else {
          setItems([]);
        }
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, supabase]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addItem = useCallback(async (productId: string, variantId?: string | null, quantity: number = 1) => {
    try {
      if (userId) {
        // Check if item exists
        const { data: existing } = await supabase
          .from('cart_items')
          .select('id, quantity')
          .eq('user_id', userId)
          .eq('product_id', productId)
          .eq('variant_id', variantId || '')
          .single();

        if (existing) {
          await supabase
            .from('cart_items')
            .update({ quantity: existing.quantity + quantity })
            .eq('id', existing.id);
        } else {
          await supabase
            .from('cart_items')
            .insert({
              user_id: userId,
              product_id: productId,
              variant_id: variantId || null,
              quantity,
            });
        }
      } else {
        const localItems = getLocalCart();
        const existingIdx = localItems.findIndex(
          i => i.product_id === productId && i.variant_id === (variantId || null)
        );
        if (existingIdx >= 0) {
          localItems[existingIdx].quantity += quantity;
        } else {
          localItems.push({ product_id: productId, variant_id: variantId || null, quantity });
        }
        setLocalCart(localItems);
      }
      await refreshCart();
      setIsOpen(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  }, [userId, supabase, refreshCart]);

  const updateQuantity = useCallback(async (productId: string, variantId: string | null, quantity: number) => {
    try {
      if (quantity <= 0) {
        await removeItem(productId, variantId);
        return;
      }
      if (userId) {
        await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('user_id', userId)
          .eq('product_id', productId)
          .eq('variant_id', variantId || '');
      } else {
        const localItems = getLocalCart();
        const item = localItems.find(
          i => i.product_id === productId && i.variant_id === variantId
        );
        if (item) item.quantity = quantity;
        setLocalCart(localItems);
      }
      await refreshCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, supabase, refreshCart]);

  const removeItem = useCallback(async (productId: string, variantId?: string | null) => {
    try {
      if (userId) {
        await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', userId)
          .eq('product_id', productId)
          .eq('variant_id', variantId || '');
      } else {
        const localItems = getLocalCart().filter(
          i => !(i.product_id === productId && i.variant_id === (variantId || null))
        );
        setLocalCart(localItems);
      }
      await refreshCart();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  }, [userId, supabase, refreshCart]);

  const clearCart = useCallback(async () => {
    try {
      if (userId) {
        await supabase.from('cart_items').delete().eq('user_id', userId);
      } else {
        setLocalCart([]);
      }
      await refreshCart();
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  }, [userId, supabase, refreshCart]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const subtotal = items.reduce((sum, item) => {
    const price = item.variant_id && (item as CartItem).variant 
      ? (item as CartItem).variant!.price 
      : item.product?.price || 0;
    return sum + Number(price) * item.quantity;
  }, 0);

  const shipping = calculateShipping(subtotal);
  const tax = calculateTax(subtotal);

  const summary: CartSummary = {
    subtotal,
    discount: 0,
    shipping,
    tax,
    total: subtotal + shipping + tax,
    itemCount,
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        summary,
        isOpen,
        isLoading,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        toggleCart: () => setIsOpen(prev => !prev),
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
