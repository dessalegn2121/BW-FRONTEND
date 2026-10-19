import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import type { CartLine, MenuItem } from '../types';

interface CartContextValue {
  lines: CartLine[];
  add: (item: MenuItem, quantity?: number, customizations?: CartLine['customizations']) => void;
  remove: (menuItemId: string) => void;
  updateQty: (menuItemId: string, quantity: number) => void;
  clear: () => void;
  subtotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = 'bw_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'); }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines]);

  const add: CartContextValue['add'] = (item, quantity = 1, customizations) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.menuItemId === item._id);
      if (existing) {
        return prev.map((l) =>
          l.menuItemId === item._id ? { ...l, quantity: l.quantity + quantity } : l
        );
      }
      return [
        ...prev,
        {
          menuItemId: item._id,
          name: item.name,
          unitPrice: item.price,
          quantity,
          imageUrl: item.imageUrl,
          customizations,
        },
      ];
    });
  };

  const remove = (menuItemId: string) =>
    setLines((prev) => prev.filter((l) => l.menuItemId !== menuItemId));

  const updateQty = (menuItemId: string, quantity: number) => {
    if (quantity < 1) return remove(menuItemId);
    setLines((prev) => prev.map((l) => (l.menuItemId === menuItemId ? { ...l, quantity } : l)));
  };

  const clear = () => setLines([]);

  const subtotal = useMemo(
    () => lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0),
    [lines]
  );
  const itemCount = useMemo(() => lines.reduce((s, l) => s + l.quantity, 0), [lines]);

  return (
    <CartContext.Provider value={{ lines, add, remove, updateQty, clear, subtotal, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}