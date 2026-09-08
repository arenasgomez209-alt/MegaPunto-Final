import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('megapunto_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('megapunto_cart', JSON.stringify(items));
  }, [items]);

  // Add product or increase qty
  const addToCart = (product, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i._id === product._id);
      if (existing) {
        return prev.map(i =>
          i._id === product._id
            ? { ...i, qty: Math.min(i.qty + qty, i.stock || 99) }
            : i
        );
      }
      return [...prev, { ...product, qty }];
    });
  };

  // Remove one product
  const removeFromCart = (productId) => {
    setItems(prev => prev.filter(i => i._id !== productId));
  };

  // Update qty
  const updateQty = (productId, newQty) => {
    if (newQty < 1) {
      removeFromCart(productId);
      return;
    }
    setItems(prev =>
      prev.map(i => i._id === productId ? { ...i, qty: newQty } : i)
    );
  };

  // Clear all
  const clearCart = () => setItems([]);

  // Totals
  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = items.reduce((sum, i) => sum + (i.precio || 0) * i.qty, 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      totalItems,
      totalPrice,
      isCartOpen,
      setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
