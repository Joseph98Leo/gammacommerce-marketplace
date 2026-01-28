// src/components/StripePayment.tsx
import { useEffect, useMemo, useState } from "react";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import {
    Elements,
    CardElement,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createPaymentIntent, getStripeConfig } from "@/lib/paymentApi";

type PaymentResult = {
    paymentIntentId: string;
    amount: number;
    status: string;
    orderId?: string;
};

type StripePaymentProps = {
    amount: number;
    orderId?: string;
    onSuccess: (result: PaymentResult) => void;
    onError: (message: string) => void;
    buttonText?: string; // opcional
};

export default function StripePayment(props: StripePaymentProps) {
    const { amount, orderId, onSuccess, onError, buttonText } = props;

    const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
    const [loadingStripe, setLoadingStripe] = useState(true);
    const [initError, setInitError] = useState<string>("");

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoadingStripe(true);
                const config = await getStripeConfig();
                const promise = loadStripe(config.publishableKey);
                if (mounted) setStripePromise(promise);
            } catch (e: any) {
                const msg = e?.message || "Error al inicializar Stripe";
                if (mounted) setInitError(msg);
            } finally {
                if (mounted) setLoadingStripe(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    if (loadingStripe) {
        return (
            <div className="p-4 rounded-lg border border-border text-sm text-muted-foreground">
                Cargando sistema de pago...
            </div>
        );
    }

    if (initError || !stripePromise) {
        return (
            <div className="p-4 rounded-lg border border-border text-sm text-red-500">
                {initError || "No se pudo cargar Stripe"}
            </div>
        );
    }

    return (
        <Elements stripe={stripePromise}>
            <StripePaymentInner
                amount={amount}
                orderId={orderId}
                onSuccess={onSuccess}
                onError={onError}
                buttonText={buttonText}
            />
        </Elements>
    );
}

function StripePaymentInner({
    amount,
    orderId,
    onSuccess,
    onError,
    buttonText,
}: StripePaymentProps) {
    const stripe = useStripe();
    const elements = useElements();

    const [processing, setProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const cardOptions = useMemo(
        () => ({
            style: {
                base: {
                    fontSize: "16px",
                    color: "#32325d",
                    fontFamily:
                        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    "::placeholder": { color: "#aab7c4" },
                },
                invalid: { color: "#fa755a" },
            },
            hidePostalCode: true,
        }),
        []
    );

    const handlePay = async () => {
        if (!stripe || !elements) {
            setErrorMessage("Stripe aún no está listo");
            return;
        }
        if (!amount || amount <= 0) {
            setErrorMessage("Monto inválido");
            return;
        }

        const card = elements.getElement(CardElement);
        if (!card) {
            setErrorMessage("No se pudo cargar el formulario de tarjeta");
            return;
        }

        setProcessing(true);
        setErrorMessage("");

        try {
            // 1) Crear PaymentIntent en backend
            const intent = await createPaymentIntent({
                amount,
                description: orderId ? `Order #${orderId}` : "GammaCommerce Order",
            });

            // 2) Confirmar pago con Stripe
            const { error, paymentIntent } = await stripe.confirmCardPayment(
                intent.clientSecret,
                {
                    payment_method: {
                        card,
                        billing_details: {},
                    },
                }
            );

            if (error) throw new Error(error.message);

            if (paymentIntent?.status === "succeeded") {
                onSuccess({
                    paymentIntentId: paymentIntent.id,
                    amount,
                    status: paymentIntent.status,
                    orderId,
                });
            } else {
                throw new Error("El pago no se completó correctamente");
            }
        } catch (e: any) {
            const msg = e?.message || "Error al procesar el pago";
            setErrorMessage(msg);
            onError(msg);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="p-3 rounded-lg border border-border bg-background">
                <CardElement
                    options={cardOptions as any}
                    onChange={(event) => {
                        if (event.error?.message) setErrorMessage(event.error.message);
                        else setErrorMessage("");
                    }}
                />
            </div>

            {errorMessage ? (
                <p className="text-sm text-red-500">{errorMessage}</p>
            ) : null}

            <Button
                type="button"
                variant="gamma"
                size="lg"
                className="w-full"
                disabled={processing || !stripe || !elements}
                onClick={handlePay}
            >
                {processing ? (
                    <>Procesando...</>
                ) : (
                    <>
                        <Lock className="w-5 h-5" />
                        {buttonText ?? `Pagar $${amount.toFixed(2)}`}
                    </>
                )}
            </Button>
        </div>
    );
}
