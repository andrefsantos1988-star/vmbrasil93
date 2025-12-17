import { useState } from 'react';
import { Bell, Plus, Wine, Beer, Grape, Snowflake, Zap, GlassWater, UtensilsCrossed, Droplets, Sparkles, Star, TrendingUp } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { useAuth } from '@/lib/auth';
import type { Product, Category, Banner } from '@shared/schema';
import logoImage from '@assets/vibedrinksfinal_1765554834904.gif';

const CATEGORY_ICONS: Record<string, any> = {
  wine: Wine,
  beer: Beer,
  grape: Grape,
  snowflake: Snowflake,
  zap: Zap,
  'glass-water': GlassWater,
  utensils: UtensilsCrossed,
  droplets: Droplets,
};

interface HomePageInterfaceProps {
  products: Product[];
  categories: (Category & { salesCount?: number })[];
  banners: Banner[];
  trendingProducts: Product[];
  isLoading: boolean;
  onProductClick?: (product: Product) => void;
}

export function HomePageInterface({ 
  products, 
  categories,
  banners,
  trendingProducts,
  isLoading,
  onProductClick
}: HomePageInterfaceProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { addItem } = useCart();
  const { user } = useAuth();

  const filteredProducts = activeCategory 
    ? products.filter(p => p.categoryId === activeCategory)
    : products;

  const activeBanners = banners.filter(b => b.isActive);

  const userName = user?.name || 'Visitante';

  return (
    <div className="pb-32 animate-fade-in">
      <div className="p-6 flex justify-between items-center bg-white shadow-sm" data-testid="header">
        <div>
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Bem-vindo</div>
          <div className="text-xl font-black text-gray-900 flex items-center gap-1" data-testid="text-username">
            {userName.split(' ')[0]} <Sparkles size={16} className="text-yellow-500"/>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <img src={logoImage} alt="Vibe Drinks" className="h-10 w-auto" data-testid="img-logo"/>
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
            <Bell size={20}/>
          </div>
        </div>
      </div>

      {activeBanners.length > 0 && (
        <div className="mt-4 px-6 overflow-x-auto scrollbar-hide flex gap-4 pb-4" data-testid="banner-carousel">
          {activeBanners.map(banner => (
            <div key={banner.id} className="w-72 h-36 shrink-0 rounded-2xl relative overflow-hidden shadow-lg group">
              <img 
                src={banner.imageUrl} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                alt={banner.title}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent p-5 flex flex-col justify-center text-white">
                <h3 className="font-black text-xl uppercase leading-none mb-1">{banner.title}</h3>
                {banner.description && <p className="text-sm font-medium opacity-90">{banner.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-2 px-6 overflow-x-auto scrollbar-hide flex gap-3 pb-2" data-testid="category-carousel">
        <button 
          onClick={() => setActiveCategory(null)}
          className={`flex flex-col items-center gap-2 min-w-[70px] p-3 rounded-2xl transition-all ${
            activeCategory === null 
              ? 'bg-vm-purple text-white shadow-lg shadow-purple-500/30 scale-105' 
              : 'bg-white text-gray-500 border border-gray-100'
          }`}
          data-testid="category-all"
        >
          <UtensilsCrossed size={24} />
          <span className="text-[10px] font-bold">Tudo</span>
        </button>
        
        {trendingProducts.length > 0 && (
          <button 
            onClick={() => setActiveCategory('__trending__')}
            className={`flex flex-col items-center gap-2 min-w-[70px] p-3 rounded-2xl transition-all ${
              activeCategory === '__trending__' 
                ? 'bg-vm-purple text-white shadow-lg shadow-purple-500/30 scale-105' 
                : 'bg-white text-gray-500 border border-gray-100'
            }`}
            data-testid="category-trending"
          >
            <TrendingUp size={24} />
            <span className="text-[10px] font-bold">Em Alta</span>
          </button>
        )}
        
        {categories.map(category => {
          const IconComponent = CATEGORY_ICONS[category.iconUrl || ''] || Wine;
          return (
            <button 
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex flex-col items-center gap-2 min-w-[70px] p-3 rounded-2xl transition-all ${
                activeCategory === category.id 
                  ? 'bg-vm-purple text-white shadow-lg shadow-purple-500/30 scale-105' 
                  : 'bg-white text-gray-500 border border-gray-100'
              }`}
              data-testid={`category-${category.id}`}
            >
              <IconComponent size={24} />
              <span className="text-[10px] font-bold">{category.name}</span>
            </button>
          );
        })}
      </div>

      <div className="p-6">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-xl font-black text-gray-900" data-testid="section-title">
            {activeCategory === '__trending__' ? 'Em Alta' : activeCategory ? categories.find(c => c.id === activeCategory)?.name || 'Produtos' : 'Populares'}
          </h2>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 animate-pulse">
                <div className="aspect-square rounded-xl bg-gray-200 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4" data-testid="product-grid">
            {(activeCategory === '__trending__' ? trendingProducts : filteredProducts).map((product) => (
              <div 
                key={product.id} 
                onClick={() => onProductClick?.(product)}
                className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3 group active:scale-95 transition-all cursor-pointer"
                data-testid={`product-card-${product.id}`}
              >
                <div className="aspect-square rounded-xl overflow-hidden relative bg-gray-100">
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      alt={product.name}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-vm-purple/10 to-vm-light/10">
                      <Wine size={48} className="text-vm-purple/30" />
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur text-xs font-black px-2 py-1 rounded-lg shadow-sm flex items-center gap-1">
                    <Star size={10} className="fill-yellow-400 text-yellow-400" />
                    4.5
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2 mb-1">{product.name}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-black text-lg text-vm-purple">
                      R$ {Number(product.salePrice).toFixed(0)}
                      <span className="text-xs align-top">,{Number(product.salePrice).toFixed(2).split('.')[1]}</span>
                    </span>
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        addItem(product); 
                      }}
                      className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-vm-purple transition-colors shadow-lg"
                      data-testid={`add-to-cart-${product.id}`}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
