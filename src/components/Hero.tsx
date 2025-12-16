import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-background">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[128px] animate-float" style={{ animationDelay: '3s' }} />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(22,163,74,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(22,163,74,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full border border-border mb-8 animate-slide-up">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              El futuro del comercio está aquí
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Descubre productos
            <br />
            <span className="text-gradient">extraordinarios</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Explora miles de productos de las mejores marcas. Compra con confianza en GammaComerce, tu destino de compras online.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/products">
              <Button variant="gamma" size="lg" className="group">
                Explorar Productos
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/categories">
              <Button variant="gammaOutline" size="lg">
                Ver Categorías
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-lg mx-auto animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="text-center">
              <div className="font-display text-3xl md:text-4xl font-bold text-gradient">1K+</div>
              <div className="text-sm text-muted-foreground mt-1">Productos</div>
            </div>
            <div className="text-center">
              <div className="font-display text-3xl md:text-4xl font-bold text-gradient">50+</div>
              <div className="text-sm text-muted-foreground mt-1">Marcas</div>
            </div>
            <div className="text-center">
              <div className="font-display text-3xl md:text-4xl font-bold text-gradient">10K+</div>
              <div className="text-sm text-muted-foreground mt-1">Clientes</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
