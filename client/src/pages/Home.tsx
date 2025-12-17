import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useAuth } from '@/lib/auth';
import { HomePageInterface } from '@/components/home/HomePageInterface';
import { AppLayoutWithNav } from '@/components/layout/BottomNavigation';
import { CartSheet } from '@/components/cart/CartSheet';
import type { Product, Category, Banner } from '@shared/schema';

export const TRENDING_CATEGORY_ID = '__trending__';

export default function Home() {
  const [, setLocation] = useLocation();
  const { role } = useAuth();
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const privilegedRoles = ['admin', 'kitchen', 'pdv', 'motoboy'];
    if (role && privilegedRoles.includes(role)) {
      const redirectMap: Record<string, string> = {
        admin: '/admin',
        kitchen: '/cozinha',
        pdv: '/pdv',
        motoboy: '/motoboy',
      };
      setLocation(redirectMap[role]);
    }
  }, []);

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const { data: categories = [] } = useQuery<(Category & { salesCount: number })[]>({
    queryKey: ['/api/categories/by-sales'],
  });

  const { data: banners = [] } = useQuery<Banner[]>({
    queryKey: ['/api/banners'],
  });

  const { data: trendingProducts = [] } = useQuery<Product[]>({
    queryKey: ['/api/products/trending'],
  });

  const handleProductClick = (product: Product) => {
    console.log('Product clicked:', product.id);
  };

  return (
    <>
      <AppLayoutWithNav onCartClick={() => setCartOpen(true)}>
        <HomePageInterface 
          products={products}
          categories={categories}
          banners={banners}
          trendingProducts={trendingProducts}
          isLoading={productsLoading}
          onProductClick={handleProductClick}
        />
      </AppLayoutWithNav>
      
      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
}
