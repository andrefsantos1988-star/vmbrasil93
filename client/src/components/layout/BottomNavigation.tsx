import { Home, Search, ShoppingCart, Ticket, User } from 'lucide-react';
import { useLocation } from 'wouter';
import { useCart } from '@/lib/cart';

interface BottomNavigationProps {
  onCartClick: () => void;
}

export function BottomNavigation({ onCartClick }: BottomNavigationProps) {
  const [location, setLocation] = useLocation();
  const { itemCount } = useCart();

  const navItems = [
    { id: 'home', label: 'Inicio', icon: Home, path: '/' },
    { id: 'search', label: 'Buscar', icon: Search, action: () => { window.scrollTo({ top: 400, behavior: 'smooth' }); } },
    { id: 'cart', label: 'Carrinho', icon: ShoppingCart, badge: itemCount, action: onCartClick },
    { id: 'orders', label: 'Pedidos', icon: Ticket, path: '/pedidos' },
    { id: 'profile', label: 'Perfil', icon: User, path: '/perfil' },
  ];

  const handleClick = (item: typeof navItems[0]) => {
    if (item.action) {
      item.action();
    } else if (item.path) {
      setLocation(item.path);
    }
  };

  const isActive = (item: typeof navItems[0]) => {
    if (item.path === '/') return location === '/';
    return item.path ? location.startsWith(item.path) : false;
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#0f0f11] border-t border-white/10 px-4 py-3 flex justify-around items-center z-50" data-testid="bottom-navigation">
      {navItems.map(item => {
        const Icon = item.icon;
        const active = isActive(item);
        
        return (
          <button
            key={item.id}
            onClick={() => handleClick(item)}
            className={`flex flex-col items-center justify-center w-full gap-1 py-2 relative transition-colors ${
              active ? 'text-vm-purple' : 'text-gray-500 hover:text-white'
            }`}
            data-testid={`nav-${item.id}`}
          >
            <div className={`relative p-1.5 rounded-xl transition-all duration-300 ${
              active ? 'bg-white/10 -translate-y-1' : ''
            }`}>
              <Icon 
                size={24} 
                strokeWidth={active ? 2.5 : 2} 
                className={`transition-all duration-300 ${
                  active ? 'scale-110 drop-shadow-[0_0_10px_rgba(122,0,255,0.4)]' : ''
                }`}
              />
              {item.badge && item.badge > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-[#0f0f11]" data-testid="badge-cart-count">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold transition-all duration-300 opacity-80">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

interface FloatingCartButtonProps {
  onClick: () => void;
}

export function FloatingCartButton({ onClick }: FloatingCartButtonProps) {
  const { itemCount, total } = useCart();

  if (itemCount === 0) return null;

  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 left-6 right-6 bg-vm-purple hover:bg-purple-700 text-white py-4 rounded-2xl font-bold shadow-xl shadow-purple-500/40 flex items-center justify-between px-6 z-40 transition-all active:scale-95"
      data-testid="floating-cart-button"
    >
      <div className="flex items-center gap-3">
        <ShoppingCart size={20}/>
        <span>{itemCount} {itemCount === 1 ? 'item' : 'itens'}</span>
      </div>
      <span className="text-lg font-black">R$ {total.toFixed(2)}</span>
    </button>
  );
}

interface AppLayoutWithNavProps {
  children: React.ReactNode;
  onCartClick: () => void;
}

export function AppLayoutWithNav({ children, onCartClick }: AppLayoutWithNavProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E4D4FF] to-[#F3E8FF]">
      {children}
      <FloatingCartButton onClick={onCartClick} />
      <BottomNavigation onCartClick={onCartClick} />
    </div>
  );
}
