import React, { useState } from 'react';
import { 
  UtensilsCrossed, Flame, Pizza, Fish, Sandwich, Salad, Drumstick, 
  Wheat, ShoppingBag, Coffee, IceCream, Croissant, Soup, Wine, Cookie, 
  Leaf, Bell, Plus
} from 'lucide-react';

// ===== DADOS DE EXEMPLO =====
const CATEGORIES = [
  { id: 'all', name: 'Tudo', icon: UtensilsCrossed },
  { id: 'burgers', name: 'Burgers', icon: Flame },
  { id: 'pizza', name: 'Pizzas', icon: Pizza },
  { id: 'sushi', name: 'Japonesa', icon: Fish },
  { id: 'snacks', name: 'Lanches', icon: Sandwich },
  { id: 'healthy', name: 'Saudável', icon: Salad },
  { id: 'sides', name: 'Porções', icon: Drumstick },
  { id: 'pasta', name: 'Massas', icon: Wheat },
];

const PROMO_BANNERS = [
  { id: 1, title: "Week Burger", subtitle: "30% OFF", image: "https://images.unsplash.com/photo-1550547660-d9450f859450?w=800", icon: Flame },
  { id: 2, title: "Entrega Grátis", subtitle: "Acima de R$50", image: "https://images.unsplash.com/photo-1555529669-26f2d10bf180?w=800", icon: ShoppingBag },
  { id: 3, title: "Sobremesa", subtitle: "Grátis no Combo", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800", icon: IceCream },
];

// ===== COMPONENTE SPARKLES =====
const Sparkles = ({ size, className }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
  </svg>
);

// ===== COMPONENTE PRINCIPAL =====
export const HomePageInterface = ({ 
  userName = "Visitante",
  products = [],
  onCategoryChange = () => {},
  onAddToCart = () => {},
  onProductClick = () => {},
  onNavigateToAll = () => {}
}: any) => {
  const [activeCat, setActiveCat] = useState('all');

  const filtered = activeCat === 'all' ? products : products.filter((p: any) => p.category === activeCat);

  return (
    <div className="pb-32 animate-fadeIn">
      {/* ===== HEADER ===== */}
      <div className="p-6 flex justify-between items-center bg-white shadow-sm">
        <div>
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Bem-vindo</div>
          <div className="text-xl font-black text-gray-900 flex items-center gap-1">
            {userName.split(' ')[0]} <Sparkles size={16} className="text-yellow-500"/>
          </div>
        </div>
        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
          <Bell size={20}/>
        </div>
      </div>

      {/* ===== BANNERS PROMOCIONAIS ===== */}
      <div className="mt-4 px-6 overflow-x-auto scrollbar-hide flex gap-4 pb-4">
        {PROMO_BANNERS.map(b => (
          <div key={b.id} className="w-72 h-36 shrink-0 rounded-2xl relative overflow-hidden shadow-lg group">
            <img src={b.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={b.title}/>
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent p-5 flex flex-col justify-center text-white">
              <div className="bg-white/20 backdrop-blur-sm w-fit p-2 rounded-lg mb-2"><b.icon size={16}/></div>
              <h3 className="font-black text-xl uppercase leading-none mb-1">{b.title}</h3>
              <p className="text-sm font-medium opacity-90">{b.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ===== CATEGORIAS ===== */}
      <div className="mt-2 px-6 overflow-x-auto scrollbar-hide flex gap-3 pb-2">
        {CATEGORIES.map(c => (
          <button 
            key={c.id} 
            onClick={() => {
              setActiveCat(c.id);
              onCategoryChange(c.id);
            }}
            className={`flex flex-col items-center gap-2 min-w-[70px] p-3 rounded-2xl transition-all ${
              activeCat === c.id 
                ? 'bg-vm-purple text-white shadow-lg shadow-purple-500/30 scale-105' 
                : 'bg-white text-gray-500 border border-gray-100'
            }`}
          >
            <c.icon size={24} />
            <span className="text-[10px] font-bold">{c.name}</span>
          </button>
        ))}
      </div>

      {/* ===== GRID DE PRODUTOS ===== */}
      <div className="p-6">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-xl font-black text-gray-900">Populares</h2>
          <button onClick={onNavigateToAll} className="text-vm-purple text-sm font-bold">Ver todos</button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {filtered.map((p: any) => (
            <div 
              key={p.id} 
              onClick={() => onProductClick(p)} 
              className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3 group active:scale-95 transition-all"
            >
              <div className="aspect-square rounded-xl overflow-hidden relative bg-gray-100">
                <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={p.name}/>
                <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur text-xs font-black px-2 py-1 rounded-lg shadow-sm">
                  {p.rating || '4.5'} ★
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2 mb-1">{p.name}</h3>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-black text-lg text-vm-purple">
                    R$ {p.price.toFixed(0)}<span className="text-xs align-top">,{p.price.toFixed(2).split('.')[1]}</span>
                  </span>
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      onAddToCart(p); 
                    }}
                    className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-vm-purple transition-colors shadow-lg"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePageInterface;
