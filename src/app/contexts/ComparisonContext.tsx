import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from './CartContext';

interface ComparisonContextType {
  comparisonList: Product[];
  addToComparison: (product: Product) => boolean;
  removeFromComparison: (productId: string) => void;
  clearComparison: () => void;
  isInComparison: (productId: string) => boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [comparisonList, setComparisonList] = useState<Product[]>([]);

  const addToComparison = (product: Product): boolean => {
    if (comparisonList.length >= 4) {
      return false; // Max 4 products
    }
    if (comparisonList.find((p) => p.id === product.id)) {
      return false; // Already in comparison
    }
    setComparisonList((prev) => [...prev, product]);
    return true;
  };

  const removeFromComparison = (productId: string) => {
    setComparisonList((prev) => prev.filter((p) => p.id !== productId));
  };

  const clearComparison = () => {
    setComparisonList([]);
  };

  const isInComparison = (productId: string): boolean => {
    return comparisonList.some((p) => p.id === productId);
  };

  return (
    <ComparisonContext.Provider
      value={{
        comparisonList,
        addToComparison,
        removeFromComparison,
        clearComparison,
        isInComparison,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
}
