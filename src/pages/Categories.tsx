import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, Laptop, Shirt, Home, Utensils, Gamepad2, Heart, Car } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api';

const categoryIcons: Record<string, React.ReactNode> = {
  'Electrónica': <Laptop className="w-12 h-12" />,
  'Ropa': <Shirt className="w-12 h-12" />,
  'Hogar': <Home className="w-12 h-12" />,
  'Comida': <Utensils className="w-12 h-12" />,
  'Juegos': <Gamepad2 className="w-12 h-12" />,
  'Salud': <Heart className="w-12 h-12" />,
  'Autos': <Car className="w-12 h-12" />,
};

const Categories = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: api.getCategories,
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 md:pt-28 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Explora por <span className="text-gradient">Categoría</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Navega por nuestras categorías para encontrar exactamente lo que estás buscando
            </p>
          </div>

          {/* Categories Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories?.map((category) => (
                <Link
                  key={category.id}
                  to={`/products?category=${category.id}`}
                  className="group relative p-8 bg-card rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 overflow-hidden"
                >
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10">
                    <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:scale-110">
                      {categoryIcons[category.name] || <Package className="w-12 h-12" />}
                    </div>
                    
                    <h2 className="font-display text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h2>
                    
                    {category.description && (
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2 text-primary font-medium">
                      <span>Explorar</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
};

export default Categories;
