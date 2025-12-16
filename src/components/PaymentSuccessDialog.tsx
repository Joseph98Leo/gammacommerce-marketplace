import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface PaymentSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PaymentSuccessDialog = ({ open, onOpenChange }: PaymentSuccessDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-center bg-card border-border">
        <DialogHeader className="space-y-4">
          <div className="mx-auto w-20 h-20 bg-pastel-mint/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-pastel-mint" />
          </div>
          <DialogTitle className="font-display text-2xl text-center">
            ¡Pago Exitoso!
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Tu pedido ha sido procesado correctamente. Recibirás un correo de confirmación con los detalles de tu compra.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 p-4 bg-secondary/50 rounded-xl">
          <div className="flex items-center justify-center gap-3 text-foreground">
            <Package className="w-5 h-5 text-primary" />
            <span className="text-sm">
              Tu pedido llegará en 3-5 días hábiles
            </span>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <Link to="/products" onClick={() => onOpenChange(false)}>
            <Button variant="gamma" className="w-full">
              Seguir comprando
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/" onClick={() => onOpenChange(false)}>
            <Button variant="outline" className="w-full">
              Volver al inicio
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentSuccessDialog;
