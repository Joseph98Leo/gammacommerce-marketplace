import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, ShieldCheck } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import PaymentSuccessDialog from '@/components/PaymentSuccessDialog';
import StripePayment from '@/components/StripePayment';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/context/CartContext';

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 md:pt-28 pb-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold mb-4">Tu carrito está vacío</h1>
            <Link to="/products">
              <Button variant="gamma">Explorar productos</Button>
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
            Continuar comprando
          </Link>

          <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">
            <span className="text-gradient">Checkout</span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <div className="space-y-6">
                {/* Contact Info */}
                <div className="p-6 bg-card rounded-xl border border-border">
                  <h2 className="font-display text-xl font-bold mb-4">Información de Contacto</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Nombre</Label>
                      <Input id="firstName" placeholder="Juan" className="mt-1" required />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Apellido</Label>
                      <Input id="lastName" placeholder="Pérez" className="mt-1" required />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="juan@ejemplo.com" className="mt-1" required />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input id="phone" type="tel" placeholder="+1 234 567 890" className="mt-1" required />
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="p-6 bg-card rounded-xl border border-border">
                  <h2 className="font-display text-xl font-bold mb-4">Dirección de Envío</h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address">Dirección</Label>
                      <Input id="address" placeholder="Calle Principal 123" className="mt-1" required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">Ciudad</Label>
                        <Input id="city" placeholder="Ciudad" className="mt-1" required />
                      </div>
                      <div>
                        <Label htmlFor="zip">Código Postal</Label>
                        <Input id="zip" placeholder="12345" className="mt-1" required />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="country">País</Label>
                      <Input id="country" placeholder="País" className="mt-1" required />
                    </div>
                  </div>
                </div>

                {/* Payment */}
                <div className="p-6 bg-card rounded-xl border border-border">
                  <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" />
                    Información de Pago
                  </h2>
                  <StripePayment
                    amount={totalPrice}
                    orderId={`ORDER-${Date.now()}`}
                    onSuccess={(result) => {
                      console.log('Payment successful:', result);
                      clearCart();
                      setShowSuccessDialog(true);
                    }}
                    onError={(error) => {
                      console.error('Payment error:', error);
                      alert(`Error en el pago: ${error}`);
                    }}
                    buttonText={`Pagar $${totalPrice.toFixed(2)}`}
                  />
                </div>

                <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  Pago seguro y encriptado
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="p-6 bg-card rounded-xl border border-border sticky top-28">
                <h2 className="font-display text-xl font-bold mb-6">Resumen del Pedido</h2>

                <div className="space-y-4 max-h-80 overflow-y-auto mb-6">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-4">
                      <img
                        src={item.product.imageUrl || '/placeholder.svg'}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-sm line-clamp-2">{item.product.name}</h3>
                        <p className="text-muted-foreground text-sm">Cantidad: {item.quantity}</p>
                      </div>
                      <span className="font-semibold">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-3">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Envío</span>
                    <span className="text-primary">Gratis</span>
                  </div>
                  <div className="flex justify-between font-display text-xl font-bold pt-3 border-t border-border">
                    <span>Total</span>
                    <span className="text-gradient">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <CartDrawer />
      <PaymentSuccessDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog} />
    </div>
  );
};

export default Checkout;
