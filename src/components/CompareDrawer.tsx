import { X, Trash2, Scale } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useCompare } from '@/context/CompareContext';

const CompareDrawer = () => {
  const { compareItems, removeFromCompare, clearCompare, isCompareOpen, setIsCompareOpen } = useCompare();

  const getUniqueCompanies = () => {
    const companies = compareItems.map((item) => item.company?.name || 'Sin marca');
    return [...new Set(companies)];
  };

  return (
    <Sheet open={isCompareOpen} onOpenChange={setIsCompareOpen}>
      <SheetContent className="w-full sm:max-w-2xl bg-card border-border overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="font-display text-2xl flex items-center gap-2">
            <Scale className="w-6 h-6 text-primary" />
            Comparar Productos
          </SheetTitle>
        </SheetHeader>

        {compareItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Scale className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No hay productos para comparar</p>
            <p className="text-sm text-muted-foreground mt-2">
              Añade productos usando el botón de comparar
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Companies badge */}
            <div className="flex flex-wrap gap-2">
              {getUniqueCompanies().map((company) => (
                <span
                  key={company}
                  className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full"
                >
                  {company}
                </span>
              ))}
            </div>

            {/* Comparison table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 text-muted-foreground font-medium">Característica</th>
                    {compareItems.map((item) => (
                      <th key={item.id} className="text-center py-3 min-w-[150px]">
                        <div className="relative">
                          <button
                            onClick={() => removeFromCompare(item.id)}
                            className="absolute -top-1 -right-1 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/80 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <img
                            src={item.imageUrl || '/placeholder.svg'}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg mx-auto mb-2"
                          />
                          <p className="text-sm font-medium line-clamp-2">{item.name}</p>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="py-3 text-muted-foreground">Precio</td>
                    {compareItems.map((item) => (
                      <td key={item.id} className="py-3 text-center font-display font-bold text-primary">
                        S/{item.price.toFixed(2)}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 text-muted-foreground">Marca</td>
                    {compareItems.map((item) => (
                      <td key={item.id} className="py-3 text-center">
                        {item.company?.name || 'Sin marca'}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 text-muted-foreground">Categoría</td>
                    {compareItems.map((item) => (
                      <td key={item.id} className="py-3 text-center">
                        {item.category?.name || 'Sin categoría'}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 text-muted-foreground">Stock</td>
                    {compareItems.map((item) => (
                      <td key={item.id} className="py-3 text-center">
                        <span className={item.stock > 0 ? 'text-pastel-mint' : 'text-destructive'}>
                          {item.stock > 0 ? `${item.stock} disponibles` : 'Agotado'}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 text-muted-foreground">Descripción</td>
                    {compareItems.map((item) => (
                      <td key={item.id} className="py-3 text-center text-sm text-muted-foreground">
                        {item.description || 'Sin descripción'}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Clear button */}
            <Button
              variant="outline"
              onClick={clearCompare}
              className="w-full"
            >
              <Trash2 className="w-4 h-4" />
              Limpiar comparación
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CompareDrawer;
