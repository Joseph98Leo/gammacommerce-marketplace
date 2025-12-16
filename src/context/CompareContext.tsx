import { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '@/lib/api';

interface CompareContextType {
  compareItems: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: number) => void;
  clearCompare: () => void;
  isInCompare: (productId: number) => boolean;
  isCompareOpen: boolean;
  setIsCompareOpen: (open: boolean) => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider = ({ children }: { children: ReactNode }) => {
  const [compareItems, setCompareItems] = useState<Product[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const addToCompare = (product: Product) => {
    if (compareItems.length >= 4) {
      return;
    }
    if (!compareItems.find((item) => item.id === product.id)) {
      setCompareItems([...compareItems, product]);
    }
  };

  const removeFromCompare = (productId: number) => {
    setCompareItems(compareItems.filter((item) => item.id !== productId));
  };

  const clearCompare = () => {
    setCompareItems([]);
  };

  const isInCompare = (productId: number) => {
    return compareItems.some((item) => item.id === productId);
  };

  return (
    <CompareContext.Provider
      value={{
        compareItems,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        isCompareOpen,
        setIsCompareOpen,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within CompareProvider');
  }
  return context;
};
