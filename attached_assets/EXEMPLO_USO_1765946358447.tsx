// ===== EXEMPLO DE COMO USAR TUDO JUNTO =====

import { useState } from 'react';
import HomePageInterface from './HOME_PAGE_INTERFACE';
import { AppLayoutWithNav } from './BOTTOM_NAV_CARRINHO';

const MyApp = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  // Seus dados existentes do sistema
  const myProducts = [
    {
      id: '1',
      name: 'X-Bacon Premium',
      price: 32.90,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600',
      category: 'burgers',
      rating: 4.8
    },
    {
      id: '2',
      name: 'Pizza Margherita',
      price: 45.00,
      image: 'https://images.unsplash.com/photo-1571407-005dbe93f367?w=600',
      category: 'pizza',
      rating: 4.9
    },
    // ... seus outros produtos
  ];

  const handleCategoryChange = (categoryId: string) => {
    console.log('Categoria selecionada:', categoryId);
  };

  const handleAddToCart = (product: any) => {
    setCart([...cart, product]);
    setCartTotal(cartTotal + product.price);
  };

  const handleProductClick = (product: any) => {
    console.log('Produto clicado:', product);
  };

  const handleNavigateToAll = () => {
    setCurrentPage('products');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const handleCartClick = () => {
    setCurrentPage('cart');
  };

  return (
    <AppLayoutWithNav
      activePage={currentPage}
      cartCount={cart.length}
      cartTotal={cartTotal}
      onNavigate={handleNavigate}
      onCartClick={handleCartClick}
    >
      {currentPage === 'home' && (
        <HomePageInterface 
          userName="João Silva"
          products={myProducts}
          onCategoryChange={handleCategoryChange}
          onAddToCart={handleAddToCart}
          onProductClick={handleProductClick}
          onNavigateToAll={handleNavigateToAll}
        />
      )}
      
      {currentPage === 'cart' && (
        <div className="p-6 text-center text-gray-600 mt-10">
          <p>Seus itens do carrinho aqui ({cart.length})</p>
          <p>Total: R$ {cartTotal.toFixed(2)}</p>
        </div>
      )}

      {/* Outras páginas... */}
    </AppLayoutWithNav>
  );
};

export default MyApp;
