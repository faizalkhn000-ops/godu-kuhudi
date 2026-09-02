import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/context/AuthContext';
import { CartProvider } from '@/lib/context/CartContext';
import { WishlistProvider } from '@/lib/context/WishlistContext';
import { ToastProvider } from '@/components/ui/Toast/Toast';
import CartDrawer from '@/components/cart/CartDrawer/CartDrawer';

export const metadata: Metadata = {
  title: {
    default: 'KUHUDE — Born to Remember | Premium Fragrance & Lifestyle',
    template: '%s | KUHUDE',
  },
  description: 'KUHUDE — premium fragrance and lifestyle products crafted for the woman who leaves an impression. Fragrance made to become a memory.',
  keywords: ['perfume', 'fragrance', 'luxury', 'women', 'Indian brand', 'eau de parfum', 'body mist', 'gift sets'],
  openGraph: {
    title: 'KUHUDE — Born to Remember',
    description: 'Premium fragrance and lifestyle products crafted for the woman who leaves an impression.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'KUHUDE',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <ToastProvider>
                {children}
                <CartDrawer />
              </ToastProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
