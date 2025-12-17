import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Bell, User, Menu, Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useCart } from '@/lib/cart';
import { useAuth } from '@/lib/auth';
import { motion, AnimatePresence } from 'framer-motion';
import logoImage from '@assets/ClnKwtBSZos86Dgm_1765947501130.gif';

interface HeaderProps {
  onCartOpen: () => void;
}

export function Header({ onCartOpen }: HeaderProps) {
  const [, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { itemCount, subtotal } = useCart();
  const { isAuthenticated, user, logout } = useAuth();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <header className="sticky top-0 z-50 glass-header">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="text-xl font-bold purple-text-gradient" data-testid="text-brand">
              VM Brasil
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-foreground/70 hover:text-primary hover:bg-primary/10"
              data-testid="button-notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
            </Button>

            <Link href="/" className="flex items-center">
              <img 
                src={logoImage} 
                alt="VM" 
                className="h-10 w-auto"
                data-testid="img-logo"
              />
            </Link>

            {isAuthenticated ? (
              <Button
                variant="ghost"
                size="icon"
                className="text-foreground/70 hover:text-primary hover:bg-primary/10"
                onClick={() => setLocation('/perfil')}
                data-testid="button-profile"
              >
                <User className="h-5 w-5" />
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="text-primary border-primary/40 hover:bg-primary/10 hover:border-primary font-medium"
                onClick={() => setLocation('/login')}
                data-testid="button-login"
              >
                Entrar
              </Button>
            )}

            <Link 
              href="/admin-login" 
              className="text-muted-foreground/30 hover:text-primary/50 transition-colors p-2"
            >
              <Settings className="h-4 w-4" />
            </Link>

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="text-foreground/80" data-testid="button-menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="glass-panel border-primary/20 w-80">
                <SheetHeader>
                  <SheetTitle className="sr-only">Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col h-full pt-8">
                  <div className="flex items-center justify-between mb-8">
                    <img src={logoImage} alt="VM Brasil" className="h-10" />
                    <span className="text-lg font-bold purple-text-gradient">VM Brasil</span>
                  </div>

                  {isAuthenticated && (
                    <div className="space-y-1 mb-8">
                      <p className="text-sm text-muted-foreground">Bem-vindo,</p>
                      <p className="text-lg font-semibold text-primary">{user?.name}</p>
                    </div>
                  )}

                  <nav className="flex flex-col gap-2">
                    {isAuthenticated ? (
                      <>
                        <Link 
                          href="/perfil" 
                          className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground hover:bg-primary/10 transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                          data-testid="link-profile-mobile"
                        >
                          <User className="h-5 w-5 text-primary" />
                          Meu Perfil
                        </Link>
                        
                        <div className="my-4 border-t border-primary/10" />
                        
                        <Button 
                          variant="ghost" 
                          className="justify-start text-red-500 hover:text-red-400 hover:bg-red-500/10"
                          onClick={() => { logout(); setMobileMenuOpen(false); }}
                        >
                          <X className="h-5 w-5 mr-3" />
                          Sair da conta
                        </Button>
                      </>
                    ) : (
                      <Button
                        className="vm-gradient text-white font-semibold"
                        onClick={() => { setLocation('/login'); setMobileMenuOpen(false); }}
                      >
                        Entrar ou Cadastrar
                      </Button>
                    )}
                  </nav>

                  {itemCount > 0 && (
                    <div className="mt-auto pt-8 border-t border-primary/10">
                      <Button
                        className="w-full vm-gradient text-white font-semibold"
                        onClick={() => { onCartOpen(); setMobileMenuOpen(false); }}
                      >
                        Ver Carrinho ({itemCount}) - {formatPrice(subtotal)}
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
