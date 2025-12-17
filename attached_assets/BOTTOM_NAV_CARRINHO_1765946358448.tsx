import React from 'react';
import { 
  Home, ShoppingBag, Search, User, LayoutDashboard, 
  Ticket, ShoppingCart, LogOut
} from 'lucide-react';

// ===== BOTTOM NAV (5 BOTÕES) =====
export const BottomNavigation = ({ 
  activePage = 'home',
  cartCount = 0,
  onNavigate = () => {}
}: any) => {
  const navItems = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'search', label: 'Buscar', icon: Search },
    { id: 'cart', label: 'Carrinho', icon: ShoppingCart, badge: cartCount },
    { id: 'coupons', label: 'Cupons', icon: Ticket },
    { id: 'profile', label: 'Perfil', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#0f0f11] border-t border-white/10 px-4 py-3 flex justify-around items-center">
      {navItems.map(item => {
        const Icon = item.icon;
        const isActive = activePage === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center w-full gap-1 group py-2 relative transition-colors ${
              isActive ? 'text-vm-purple' : 'text-gray-500 hover:text-white'
            }`}
          >
            <div className={`relative p-1.5 rounded-xl transition-all duration-300 ${
              isActive ? 'bg-white/10 -translate-y-1' : ''
            }`}>
              <Icon 
                size={24} 
                strokeWidth={isActive ? 2.5 : 2} 
                className={`transition-all duration-300 ${
                  isActive ? 'scale-110 drop-shadow-[0_0_10px_rgba(122,0,255,0.4)]' : ''
                }`}
              />
              {item.badge && item.badge > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-[#0f0f11]">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold transition-all duration-300 opacity-80">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

// ===== CARRINHO FLUTUANTE (FIXO NO FUNDO) =====
export const CartButton = ({ 
  cartCount = 0,
  totalPrice = 0,
  onClick = () => {}
}: any) => {
  if (cartCount === 0) return null;

  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 left-6 right-6 bg-vm-purple hover:bg-purple-700 text-white py-4 rounded-2xl font-bold shadow-xl shadow-purple-500/40 flex items-center justify-between px-6 z-40 transition-all active:scale-95"
    >
      <div className="flex items-center gap-3">
        <ShoppingCart size={20}/>
        <span>{cartCount} items</span>
      </div>
      <span className="text-lg font-black">R$ {totalPrice.toFixed(2)}</span>
    </button>
  );
};

// ===== LAYOUT COMPLETO COM NAV + CARRINHO =====
export const AppLayoutWithNav = ({ 
  children,
  activePage = 'home',
  cartCount = 0,
  cartTotal = 0,
  onNavigate = () => {},
  onCartClick = () => {}
}: any) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E4D4FF] to-[#F3E8FF]">
      {/* Seu conteúdo principal aqui */}
      {children}

      {/* Carrinho flutuante */}
      <CartButton 
        cartCount={cartCount}
        totalPrice={cartTotal}
        onClick={onCartClick}
      />

      {/* Bottom Navigation */}
      <BottomNavigation 
        activePage={activePage}
        cartCount={cartCount}
        onNavigate={onNavigate}
      />
    </div>
  );
};

export default BottomNavigation;
