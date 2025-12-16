import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const categoryId = searchParams.get('category');

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: api.getProducts,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: api.getCategories,
  });

  const filteredProducts = products?.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryId || product.category?.id === Number(categoryId);
    return matchesSearch && matchesCategory;
  });

  const selectedCategory = categories?.find((c) => c.id === Number(categoryId));

  const clearFilters = () => {
    setSearchParams({});
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 md:pt-28 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
              {selectedCategory ? (
                <>Productos en <span className="text-gradient">{selectedCategory.name}</span></>
              ) : (
                <>Todos los <span className="text-gradient">Productos</span></>
              )}
            </h1>
            <p className="text-muted-foreground">
              {filteredProducts?.length || 0} productos encontrados
            </p>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>

            {/* Desktop Category Filters */}
            <div className="hidden md:flex items-center gap-2 flex-wrap">
              <Button
                variant={!categoryId ? 'gamma' : 'outline'}
                size="sm"
                onClick={() => setSearchParams({})}
              >
                Todos
              </Button>
              {categories?.map((category) => (
                <Button
                  key={category.id}
                  variant={categoryId === String(category.id) ? 'gamma' : 'outline'}
                  size="sm"
                  onClick={() => setSearchParams({ category: String(category.id) })}
                >
                  {category.name}
                </Button>
              ))}
            </div>

            {/* Clear Filters */}
            {(categoryId || searchTerm) && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="w-4 h-4 mr-1" />
                Limpiar
              </Button>
            )}
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="md:hidden mb-6 p-4 bg-card rounded-xl border border-border animate-slide-up">
              <h3 className="font-semibold mb-3">Categorías</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={!categoryId ? 'gamma' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setSearchParams({});
                    setShowFilters(false);
                  }}
                >
                  Todos
                </Button>
                {categories?.map((category) => (
                  <Button
                    key={category.id}
                    variant={categoryId === String(category.id) ? 'gamma' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setSearchParams({ category: String(category.id) });
                      setShowFilters(false);
                    }}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-square rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredProducts && filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No se encontraron productos</p>
              <Button variant="gamma" className="mt-4" onClick={clearFilters}>
                Ver todos los productos
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
};

export default Products;
