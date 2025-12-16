import { ShoppingCart, Eye, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { useCompare } from '@/context/CompareContext';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { addToCompare, isInCompare, compareItems, setIsCompareOpen } = useCompare();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} añadido al carrito`);
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInCompare(product.id)) {
      setIsCompareOpen(true);
      return;
    }
    
    if (compareItems.length >= 4) {
      toast.error('Solo puedes comparar hasta 4 productos');
      return;
    }
    
    addToCompare(product);
    toast.success(`${product.name} añadido a comparación`);
    
    if (compareItems.length >= 1) {
      setIsCompareOpen(true);
    }
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 transition-all duration-300 card-shadow hover:shadow-soft"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.imageUrl || '/placeholder.svg'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Quick Actions */}
        <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <Button
            variant="gamma"
            size="sm"
            className="flex-1"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-4 h-4" />
            Añadir
          </Button>
          <Button variant="secondary" size="sm">
            <Eye className="w-4 h-4" />
          </Button>
          <Button 
            variant={isInCompare(product.id) ? "default" : "outline"}
            size="sm"
            onClick={handleCompare}
            title="Comparar producto"
          >
            <Scale className="w-4 h-4" />
          </Button>
        </div>

        {/* Stock Badge */}
        {product.stock < 10 && product.stock > 0 && (
          <span className="absolute top-3 left-3 px-2 py-1 bg-accent/90 text-accent-foreground text-xs font-medium rounded-full">
            ¡Últimas {product.stock} unidades!
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-3 left-3 px-2 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full">
            Agotado
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category & Company */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-primary font-medium">
            {product.category?.name || 'Sin categoría'}
          </span>
          <span className="text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground">
            {product.company?.name || 'Sin marca'}
          </span>
        </div>

        {/* Name */}
        <h3 className="font-display font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center justify-between">
          <span className="font-display text-xl font-bold text-gradient">
            ${product.price.toFixed(2)}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
