import { Home, Search, ShoppingCart, Ticket, User } from 'lucide-react';
import { useLocation } from 'wouter';
import { useCart } from '@/lib/cart';
import { motion } from 'framer-motion';

interface BottomNavigationProps {
  onCartClick: () => void;
}

export function BottomNavigation({ onCartClick }: BottomNavigationProps) {
  const [location, setLocation] = useLocation();
  const { itemCount } = useCart();
  const isHome = location === '/';

  const navItems = [
    { id: 'home', label: 'Inicio', icon: Home, path: '/' },
    { id: 'search', label: 'Buscar', icon: Search, action: () => { window.scrollTo({ top: 400, behavior: 'smooth' }); } },
    { id: 'cart', label: 'Carrinho', icon: ShoppingCart, badge: itemCount, action: onCartClick, isCenter: true },
    { id: 'orders', label: 'Cupons', icon: Ticket, path: '/pedidos' },
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
    <motion.div 
      className="fixed bottom-0 left-0 w-full glass-nav px-2 py-2 flex justify-around items-end z-50 safe-area-pb" 
      data-testid="bottom-navigation"
      animate={{ y: isHome ? 0 : '100%' }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      {navItems.map(item => {
        const Icon = item.icon;
        const active = isActive(item);
        
        if (item.isCenter) {
          return (
            <button
              key={item.id}
              onClick={() => handleClick(item)}
              className="cart-button-elevated"
              data-testid={`nav-${item.id}`}
            >
              <Icon size={28} strokeWidth={2} className="text-white" />
              {item.badge && item.badge > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-gray-900 shadow-lg"
                  data-testid="badge-cart-count"
                >
                  {item.badge > 99 ? '99+' : item.badge}
                </motion.span>
              )}
            </button>
          );
        }
        
        return (
          <button
            key={item.id}
            onClick={() => handleClick(item)}
            className={`flex flex-col items-center justify-center w-16 gap-1 py-2 relative transition-all duration-300 ${
              active ? 'text-primary' : 'text-muted-foreground hover:text-primary/70'
            }`}
            data-testid={`nav-${item.id}`}
          >
            <div className={`relative p-2 rounded-xl transition-all duration-300 ${
              active ? 'bg-primary/10' : ''
            }`}>
              <Icon 
                size={22} 
                strokeWidth={active ? 2.5 : 2} 
                className={`transition-all duration-300 ${
                  active ? 'drop-shadow-[0_0_8px_rgba(139,92,246,0.4)]' : ''
                }`}
              />
            </div>
            <span className={`text-[10px] font-medium transition-all duration-300 ${
              active ? 'text-primary font-semibold' : ''
            }`}>{item.label}</span>
          </button>
        );
      })}
    </motion.div>
  );
}

interface FloatingCartButtonProps {
  onClick: () => void;
}

export function FloatingCartButton({ onClick }: FloatingCartButtonProps) {
  const { itemCount, total } = useCart();

  if (itemCount === 0) return null;

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0, y: 100 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0, opacity: 0, y: 100 }}
      onClick={onClick}
      className="fixed bottom-24 left-4 right-4 vm-gradient text-white py-4 rounded-2xl font-bold shadow-xl flex items-center justify-between px-6 z-40 transition-all active:scale-95"
      style={{
        boxShadow: '0 8px 32px rgba(139, 92, 246, 0.4), 0 4px 16px rgba(0, 0, 0, 0.1)'
      }}
      data-testid="floating-cart-button"
    >
      <div className="flex items-center gap-3">
        <ShoppingCart size={20}/>
        <span>{itemCount} {itemCount === 1 ? 'item' : 'itens'}</span>
      </div>
      <span className="text-lg font-black">R$ {total.toFixed(2)}</span>
    </motion.button>
  );
}

interface AppLayoutWithNavProps {
  children: React.ReactNode;
  onCartClick: () => void;
}

export function AppLayoutWithNav({ children, onCartClick }: AppLayoutWithNavProps) {
  const [location] = useLocation();
  const isHome = location === '/';

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-violet-50 to-purple-50 dark:from-gray-950 dark:to-purple-950/20"
      animate={{ paddingBottom: isHome ? '0px' : '0px' }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
      <FloatingCartButton onClick={onCartClick} />
      <BottomNavigation onCartClick={onCartClick} />
    </motion.div>
  );
}
