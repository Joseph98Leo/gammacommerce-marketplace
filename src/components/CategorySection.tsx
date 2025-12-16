import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, Laptop, Shirt, Home, Utensils, Gamepad2, Heart, Car } from 'lucide-react';

const categoryIcons: Record<string, React.ReactNode> = {
  'Electrónica': <Laptop className="w-8 h-8" />,
  'Ropa': <Shirt className="w-8 h-8" />,
  'Hogar': <Home className="w-8 h-8" />,
  'Comida': <Utensils className="w-8 h-8" />,
  'Juegos': <Gamepad2 className="w-8 h-8" />,
  'Salud': <Heart className="w-8 h-8" />,
  'Autos': <Car className="w-8 h-8" />,
};

const CategorySection = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: api.getCategories,
  });

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">
            Explora por <span className="text-gradient">Categoría</span>
          </h2>
          <p className="text-muted-foreground">
            Encuentra exactamente lo que buscas
          </p>
        </div>

        {/* Categories Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories?.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="group relative p-6 bg-card rounded-xl border border-border hover:border-primary/50 transition-all duration-300 overflow-hidden"
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center mb-4 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {categoryIcons[category.name] || <Package className="w-8 h-8" />}
                  </div>
                  <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategorySection;
