import { useState } from 'react';
import { Bell, Plus, Wine, Beer, Grape, Snowflake, Zap, GlassWater, UtensilsCrossed, Droplets, Sparkles, Star, TrendingUp, Settings, Zap as Lightning, Coffee, Flame, Utensils, AlertCircle } from 'lucide-react';
import { useLocation } from 'wouter';
import { useCart } from '@/lib/cart';
import { useAuth } from '@/lib/auth';
import type { Product, Category, Banner } from '@shared/schema';
import { isPreparedCategoryName } from '@shared/schema';
import logoImage from '@assets/ClnKwtBSZos86Dgm_1765949157646.gif';
import comboImage from '@assets/image_1765222114085.png';
import salgadoImage from '@assets/image_1765222097866.png';
import cafeImage from '@assets/image_1765222257824.png';
import { ComboModal } from './ComboModal';
import { SpecialDrinksModal } from './SpecialDrinksModal';
import { SearchBox } from '@/components/search/SearchBox';
import { NotificationsModal } from '@/components/notifications/NotificationsModal';

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
  const [, setLocation] = useLocation();
  const { addItem } = useCart();
  const { user } = useAuth();
  const [comboModalOpen, setComboModalOpen] = useState(false);
  const [specialDrinksModalOpen, setSpecialDrinksModalOpen] = useState(false);
  const [salgadoModalOpen, setSalgadoModalOpen] = useState(false);
  const [cafeModalOpen, setCafeModalOpen] = useState(false);
  const [mistoModalOpen, setMistoModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const filteredProducts = activeCategory 
    ? products.filter(p => p.categoryId === activeCategory)
    : products;

  const activeBanners = banners.filter(b => b.isActive);

  const userName = user?.name || 'Visitante';

  const handleProductSelect = (product: Product) => {
    addItem(product);
  };

  return (
    <div className="pb-32 animate-fade-in">
      <div className="px-4 py-4 flex flex-col items-center gap-3 glass-header sticky top-0 z-40" data-testid="header">
        {/* Logo centralizado e aumentado */}
        <div className="flex items-center gap-2 justify-center">
          <img src={logoImage} alt="VM Brasil" className="h-16 w-auto" data-testid="img-logo"/>
        </div>

        {/* Texto de boas-vindas reduzido */}
        <div className="text-center text-xs text-muted-foreground">
          Bem-vindo, {userName.split(' ')[0]}
        </div>

        {/* Barra de pesquisa e controles */}
        <div className="w-full flex items-center justify-between gap-2 px-2">
          <div className="flex-1">
            <SearchBox products={products} onProductSelect={handleProductSelect} />
          </div>
          
          <div className="flex items-center gap-2">
            <NotificationsModal open={notificationsOpen} onOpenChange={setNotificationsOpen} />
            
            <button 
              onClick={() => setLocation('/admin-login')}
              className="w-10 h-10 bg-primary/10 hover:bg-primary/20 rounded-full flex items-center justify-center text-primary transition-colors flex-shrink-0"
              data-testid="button-admin-login"
            >
              <Settings size={18}/>
            </button>
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
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-transparent p-5 flex flex-col justify-center text-white">
                <h3 className="font-black text-xl uppercase leading-none mb-1">{banner.title}</h3>
                {banner.description && <p className="text-sm font-medium opacity-90">{banner.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 px-6 flex gap-3 overflow-x-auto pb-2 scrollbar-hide" data-testid="promo-banner">
        <button
          onClick={() => setComboModalOpen(true)}
          className="flex-shrink-0 w-1/2 bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-3 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 group relative overflow-hidden h-28"
          data-testid="button-combo-promo"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative flex items-center justify-between h-full gap-3">
            <div className="flex flex-col items-start gap-1 flex-1">
              <span className="text-xs font-bold uppercase opacity-90">Monte seu</span>
              <h3 className="font-black text-lg leading-none">COMBO</h3>
            </div>
            <div className="flex-shrink-0 w-24 h-20 relative">
              <img 
                src={comboImage}
                alt="Combo"
                className="w-full h-full object-cover rounded-lg shadow-md group-hover:scale-110 transition-transform"
              />
            </div>
          </div>
        </button>

        <button
          onClick={() => setSalgadoModalOpen(true)}
          className="flex-shrink-0 w-1/2 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-3 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 group relative overflow-hidden h-28"
          data-testid="button-salgado-promo"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative flex items-center justify-between h-full gap-3">
            <div className="flex flex-col items-start gap-1 flex-1">
              <span className="text-xs font-bold uppercase opacity-90">Combo</span>
              <h3 className="font-black text-sm leading-none">Salgado + Refri</h3>
            </div>
            <div className="flex-shrink-0 w-24 h-20 relative">
              <img 
                src={salgadoImage}
                alt="Salgado"
                className="w-full h-full object-cover rounded-lg shadow-md group-hover:scale-110 transition-transform"
              />
            </div>
          </div>
        </button>

        <button
          onClick={() => setCafeModalOpen(true)}
          className="flex-shrink-0 w-1/2 bg-gradient-to-r from-yellow-600 to-amber-700 rounded-2xl p-3 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 group relative overflow-hidden h-28"
          data-testid="button-cafe-promo"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative flex items-center justify-between h-full gap-3">
            <div className="flex flex-col items-start gap-1 flex-1">
              <span className="text-xs font-bold uppercase opacity-90">Combo</span>
              <h3 className="font-black text-sm leading-none">Café + Pão</h3>
            </div>
            <div className="flex-shrink-0 w-24 h-20 relative">
              <img 
                src={cafeImage}
                alt="Café"
                className="w-full h-full object-cover rounded-lg shadow-md group-hover:scale-110 transition-transform"
              />
            </div>
          </div>
        </button>

        <button
          onClick={() => setMistoModalOpen(true)}
          className="flex-shrink-0 w-1/2 bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-3 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 group relative overflow-hidden h-28"
          data-testid="button-misto-promo"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative flex items-center justify-between h-full gap-3">
            <div className="flex flex-col items-start gap-1 flex-1">
              <span className="text-xs font-bold uppercase opacity-90">Combo</span>
              <h3 className="font-black text-sm leading-none">Misto + Suco</h3>
            </div>
            <Flame size={24} className="text-yellow-300" />
          </div>
        </button>

        <button
          onClick={() => setSpecialDrinksModalOpen(true)}
          className="flex-shrink-0 w-1/2 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl p-3 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 group relative overflow-hidden h-28"
          data-testid="button-special-drinks-promo"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative flex items-center justify-between h-full gap-3">
            <div className="flex flex-col items-start gap-1 flex-1">
              <span className="text-xs font-bold uppercase opacity-90">Drinks</span>
              <h3 className="font-black text-lg leading-none">ESPECIAIS</h3>
            </div>
            <Sparkles size={28} className="text-yellow-300" />
          </div>
        </button>
      </div>

      <div className="mt-2 px-6 overflow-x-auto scrollbar-hide flex gap-3 pb-2" data-testid="category-carousel">
        <button 
          onClick={() => setActiveCategory(null)}
          className={`flex flex-col items-center gap-2 min-w-[70px] p-3 rounded-2xl transition-all ${
            activeCategory === null 
              ? 'vm-gradient text-white shadow-lg shadow-purple-500/30 scale-105' 
              : 'bg-card text-muted-foreground border border-border'
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
                ? 'vm-gradient text-white shadow-lg shadow-purple-500/30 scale-105' 
                : 'bg-card text-muted-foreground border border-border'
            }`}
            data-testid="category-trending"
          >
            <TrendingUp size={24} />
            <span className="text-[10px] font-bold">Em Alta</span>
          </button>
        )}
        
        {categories.map(category => {
          const IconComponent = CATEGORY_ICONS[category.iconUrl || ''] || Wine;
          const isSpecial = isPreparedCategoryName(category.name);
          return (
            <div key={category.id} className="relative">
              <button 
                onClick={() => setActiveCategory(category.id)}
                className={`flex flex-col items-center gap-2 min-w-[70px] p-3 rounded-2xl transition-all ${
                  activeCategory === category.id 
                    ? isSpecial 
                      ? 'bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-lg shadow-amber-500/30 scale-105' 
                      : 'vm-gradient text-white shadow-lg shadow-purple-500/30 scale-105' 
                    : isSpecial
                      ? 'bg-amber-50 text-amber-900 border border-amber-300'
                      : 'bg-card text-muted-foreground border border-border'
                }`}
                data-testid={`category-${category.id}`}
              >
                <IconComponent size={24} />
                <span className="text-[10px] font-bold">{category.name}</span>
              </button>
              {isSpecial && (
                <div className="absolute -top-1 -right-1 bg-amber-500 text-white rounded-full p-1" title="Categoria Especial">
                  <Sparkles size={12} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-6">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-xl font-black text-foreground" data-testid="section-title">
            {activeCategory === '__trending__' ? 'Em Alta' : activeCategory ? categories.find(c => c.id === activeCategory)?.name || 'Produtos' : 'Populares'}
          </h2>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-card p-3 rounded-2xl shadow-sm border border-border animate-pulse">
                <div className="aspect-square rounded-xl bg-muted mb-3"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-6 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4" data-testid="product-grid">
            {(activeCategory === '__trending__' ? trendingProducts : filteredProducts).map((product) => (
              <div 
                key={product.id} 
                onClick={() => onProductClick?.(product)}
                className="bg-card p-3 rounded-2xl shadow-sm border border-border flex flex-col gap-3 group active:scale-95 transition-all cursor-pointer hover:border-primary/30 hover:shadow-md"
                data-testid={`product-card-${product.id}`}
              >
                <div className="aspect-square rounded-xl overflow-hidden relative bg-muted">
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      alt={product.name}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                      <Wine size={48} className="text-primary/30" />
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 bg-card/90 backdrop-blur text-xs font-black px-2 py-1 rounded-lg shadow-sm flex items-center gap-1">
                    <Star size={10} className="fill-primary text-primary" />
                    4.5
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm leading-tight line-clamp-2 mb-1">{product.name}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-black text-lg text-primary">
                      R$ {Number(product.salePrice).toFixed(0)}
                      <span className="text-xs align-top">,{Number(product.salePrice).toFixed(2).split('.')[1]}</span>
                    </span>
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        addItem(product); 
                      }}
                      className="w-8 h-8 vm-gradient text-white rounded-full flex items-center justify-center shadow-lg purple-glow-sm transition-all hover:scale-110"
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

      <ComboModal open={comboModalOpen} onOpenChange={setComboModalOpen} />
      <SpecialDrinksModal open={specialDrinksModalOpen} onOpenChange={setSpecialDrinksModalOpen} />
      <ComboModal open={salgadoModalOpen} onOpenChange={setSalgadoModalOpen} />
      <ComboModal open={cafeModalOpen} onOpenChange={setCafeModalOpen} />
      <ComboModal open={mistoModalOpen} onOpenChange={setMistoModalOpen} />
    </div>
  );
}
