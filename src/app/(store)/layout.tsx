import React from 'react';
import Navbar from '@/components/store/Navbar/Navbar';
import Footer from '@/components/store/Footer/Footer';

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
