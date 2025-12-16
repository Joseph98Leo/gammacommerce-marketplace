import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ShoppingCart, ArrowLeft, Package, Truck, Shield, Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => api.getProduct(Number(id)),
    enabled: !!id,
  });

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      toast.success(`${quantity} x ${product.name} añadido al carrito`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 md:pt-28 pb-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <Skeleton className="aspect-square rounded-2xl" />
              <div className="space-y-4">
                <Skeleton className="h-8 w-1/4" />
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-12 w-1/3" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
        <CartDrawer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 md:pt-28 pb-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold mb-4">Producto no encontrado</h1>
            <Link to="/products">
              <Button variant="gamma">Ver todos los productos</Button>
            </Link>
          </div>
        </main>
        <Footer />
        <CartDrawer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 md:pt-28 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a productos
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-card border border-border">
              <img
                src={product.imageUrl || '/placeholder.svg'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.stock < 10 && product.stock > 0 && (
                <span className="absolute top-4 left-4 px-3 py-1 bg-destructive text-destructive-foreground text-sm font-medium rounded-full">
                  ¡Solo quedan {product.stock}!
                </span>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col">
              {/* Category & Company */}
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                  {product.category?.name || 'Sin categoría'}
                </span>
                <span className="text-muted-foreground">|</span>
                <span className="text-muted-foreground text-sm">
                  {product.company?.name || 'Sin marca'}
                </span>
              </div>

              {/* Name */}
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
                {product.name}
              </h1>

              {/* Description */}
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {product.description || 'Sin descripción disponible'}
              </p>

              {/* Price */}
              <div className="mb-8">
                <span className="font-display text-4xl font-bold text-gradient">
                  ${product.price.toFixed(2)}
                </span>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-muted-foreground">Cantidad:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Add to Cart */}
              <Button
                variant="gamma"
                size="lg"
                className="w-full md:w-auto mb-8"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="w-5 h-5" />
                {product.stock === 0 ? 'Agotado' : 'Añadir al Carrito'}
              </Button>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 border-t border-border">
                <div className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border">
                  <Package className="w-6 h-6 text-primary" />
                  <div>
                    <p className="font-medium text-sm">Stock</p>
                    <p className="text-muted-foreground text-sm">{product.stock} unidades</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border">
                  <Truck className="w-6 h-6 text-primary" />
                  <div>
                    <p className="font-medium text-sm">Envío</p>
                    <p className="text-muted-foreground text-sm">Gratis</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border">
                  <Shield className="w-6 h-6 text-primary" />
                  <div>
                    <p className="font-medium text-sm">Garantía</p>
                    <p className="text-muted-foreground text-sm">12 meses</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
};

export default ProductDetail;
