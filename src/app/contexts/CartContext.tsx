import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  discount?: number;
  category: string;
  brand?: string;
  description?: string;
  stock?: number;
  sizes?: string[]; // Available sizes for clothing
  colors?: { name: string; hex: string; image?: string }[]; // Available colors with hex codes
  // New Amazon-style features
  isPrime?: boolean; // Prime eligible
  freeShipping?: boolean; // Free shipping available
  deliveryDays?: number; // Estimated delivery in days
  videos?: string[]; // Product video URLs
  specifications?: { label: string; value: string }[]; // Product specs for comparison
  frequentlyBoughtWith?: string[]; // Product IDs for bundles
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string; // Selected size for this cart item
  selectedColor?: string; // Selected color for this cart item
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, selectedSize?: string, selectedColor?: string) => void;
  removeFromCart: (productId: string, selectedSize?: string, selectedColor?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedSize?: string, selectedColor?: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product, selectedSize?: string, selectedColor?: string) => {
    setCart((prevCart) => {
      // Find existing item with same id, size, and color
      const existingItem = prevCart.find(
        (item) => 
          item.id === product.id && 
          item.selectedSize === selectedSize && 
          item.selectedColor === selectedColor
      );
      
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id && 
          item.selectedSize === selectedSize && 
          item.selectedColor === selectedColor
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1, selectedSize, selectedColor }];
    });
  };

  const removeFromCart = (productId: string, selectedSize?: string, selectedColor?: string) => {
    setCart((prevCart) => 
      prevCart.filter(
        (item) => !(
          item.id === productId && 
          item.selectedSize === selectedSize && 
          item.selectedColor === selectedColor
        )
      )
    );
  };

  const updateQuantity = (productId: string, quantity: number, selectedSize?: string, selectedColor?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedSize, selectedColor);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId && 
        item.selectedSize === selectedSize && 
        item.selectedColor === selectedColor
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const itemPrice = item.discount
        ? item.price * (1 - item.discount / 100)
        : item.price;
      return total + itemPrice * item.quantity;
    }, 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}