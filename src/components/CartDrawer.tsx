import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartDrawer = () => {
  const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border z-50 animate-slide-up flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-primary" />
            <h2 className="font-display text-xl font-bold">Tu Carrito</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Tu carrito está vacío</p>
              <Button
                variant="gamma"
                className="mt-4"
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/products');
                }}
              >
                Explorar Productos
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-4 bg-secondary rounded-lg"
                >
                  <img
                    src={item.product.imageUrl || '/placeholder.svg'}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-sm line-clamp-2">{item.product.name}</h3>
                    <p className="text-primary font-bold mt-1">
                      S/{item.product.price.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-7 h-7"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-7 h-7"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-7 h-7 ml-auto text-destructive hover:text-destructive"
                        onClick={() => removeFromCart(item.product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-border space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-display text-2xl font-bold text-gradient">
                S/{totalPrice.toFixed(2)}
              </span>
            </div>
            <Button variant="gamma" className="w-full" size="lg" onClick={handleCheckout}>
              Proceder al Pago
            </Button>
            <Button variant="outline" className="w-full" onClick={clearCart}>
              Vaciar Carrito
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
