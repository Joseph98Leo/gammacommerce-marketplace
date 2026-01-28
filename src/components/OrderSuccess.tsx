import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Package, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useCart } from '@/context/CartContext';

interface OrderSuccessProps {
    orderDetails: {
        paymentIntentId: string;
        amount: number;
        orderId?: string;
    };
}

export default function OrderSuccess({ orderDetails }: OrderSuccessProps) {
    const navigate = useNavigate();
    const { clearCart } = useCart();

    useEffect(() => {
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#a855f7', '#ec4899', '#8b5cf6']
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#a855f7', '#ec4899', '#8b5cf6']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };

        frame();

        // Clear cart after confetti animation completes
        const clearCartTimer = setTimeout(() => {
            console.log('🧹 Clearing cart after successful payment...');
            clearCart();
        }, duration + 500); // Clear cart 500ms after confetti ends

        return () => clearTimeout(clearCartTimer);
    }, [clearCart]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/10 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
                    <div className="bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 p-8 text-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-0 left-1/4 w-32 h-32 bg-primary rounded-full blur-3xl animate-pulse" />
                            <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-accent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                        </div>

                        <div className="relative">
                            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-500 rounded-full mb-4 animate-bounce">
                                <CheckCircle2 className="w-12 h-12 text-white" />
                            </div>

                            <h1 className="font-display text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                                ¡Pago Exitoso!
                            </h1>
                            <p className="text-muted-foreground text-lg">
                                Tu pedido ha sido procesado correctamente
                            </p>
                        </div>
                    </div>

                    <div className="p-8 space-y-6">
                        <div className="bg-secondary/30 rounded-xl p-6 space-y-3">
                            <div className="flex items-center gap-3 pb-3 border-b border-border">
                                <Package className="w-5 h-5 text-primary" />
                                <h2 className="font-semibold text-lg">Detalles del Pedido</h2>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Número de Pedido:</span>
                                    <span className="font-mono font-medium">{orderDetails.orderId}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">ID de Transacción:</span>
                                    <span className="font-mono font-medium text-xs">{orderDetails.paymentIntentId}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-border">
                                    <span className="text-muted-foreground">Total Pagado:</span>
                                    <span className="text-2xl font-bold text-primary">${orderDetails.amount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-muted/30 rounded-xl p-6">
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-accent" />
                                ¿Qué sigue?
                            </h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 mt-0.5">✓</span>
                                    <span>Recibirás un correo de confirmación en breve</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 mt-0.5">✓</span>
                                    <span>Tu pedido será procesado y enviado pronto</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 mt-0.5">✓</span>
                                    <span>Podrás rastrear tu envío en las próximas 24-48 horas</span>
                                </li>
                            </ul>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                            <Button
                                onClick={() => navigate('/products')}
                                className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                                size="lg"
                            >
                                <ShoppingBag className="w-4 h-4 mr-2" />
                                Continuar Comprando
                            </Button>
                            <Button
                                onClick={() => navigate('/')}
                                variant="outline"
                                className="flex-1"
                                size="lg"
                            >
                                Volver al Inicio
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>

                        <div className="text-center pt-6 border-t border-border">
                            <p className="text-sm text-muted-foreground">
                                Gracias por tu compra en{' '}
                                <span className="font-semibold text-primary">GammaCommerce</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 text-center text-sm text-muted-foreground">
                    <p>¿Necesitas ayuda? Contáctanos en support@gammacommerce.com</p>
                </div>
            </div>
        </div>
    );
}
