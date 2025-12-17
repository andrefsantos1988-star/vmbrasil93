import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product } from '@shared/schema';

interface SearchBoxProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
}

export function SearchBox({ products, onProductSelect }: SearchBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return products.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5);
  }, [searchTerm, products]);

  const handleSelect = (product: Product) => {
    onProductSelect(product);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <Input
          placeholder="Buscar produtos..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-3 py-2 text-sm glass-panel border-primary/20"
          data-testid="input-search-products"
        />
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm('');
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && filteredProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-full glass-panel border border-primary/20 rounded-lg z-40 overflow-hidden"
          >
            {filteredProducts.map(product => (
              <button
                key={product.id}
                onClick={() => handleSelect(product)}
                className="w-full px-4 py-3 text-left hover:bg-primary/10 transition-colors border-b border-primary/10 last:border-b-0 text-sm"
                data-testid={`result-product-${product.id}`}
              >
                <div className="font-medium text-foreground">{product.name}</div>
                <div className="text-xs text-muted-foreground">R$ {Number(product.salePrice).toFixed(2)}</div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
