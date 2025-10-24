import type { Product } from '@/services/products';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';

export type CartItem = {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    imageBase64?: string;
    imageMime?: string;
    observations?: string;
};

export type CartContextValue = {
    items: CartItem[];
    addItem: (product: Product, quantity: number, observations?: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    removeItem: (productId: string) => void;
    clear: () => void;
    total: number;
};

const CartContext = React.createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = React.useState<CartItem[]>([]);
    const STORAGE_KEY = 'cart:v1';

    React.useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const raw = await AsyncStorage.getItem(STORAGE_KEY);
                if (mounted && raw) {
                    const parsed = JSON.parse(raw) as CartItem[];
                    if (Array.isArray(parsed)) setItems(parsed);
                }
            } catch { }
        })();
        return () => { mounted = false; };
    }, []);

    React.useEffect(() => {
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items)).catch(() => { });
    }, [items]);

    const addItem = React.useCallback((product: Product, quantity: number, observations?: string) => {
        if (quantity <= 0) return;
        setItems((prev) => {
            const idx = prev.findIndex((i) => i.productId === product.id);
            if (idx >= 0) {
                const next = [...prev];
                next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity, observations: observations ?? next[idx].observations };
                return next;
            }
            return [
                ...prev,
                {
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    quantity,
                    imageBase64: product.imageBase64,
                    imageMime: product.imageMime,
                    observations,
                },
            ];
        });
    }, []);

    const updateQuantity = React.useCallback((productId: string, quantity: number) => {
        setItems((prev) => prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)));
    }, []);

    const removeItem = React.useCallback((productId: string) => {
        setItems((prev) => prev.filter((i) => i.productId !== productId));
    }, []);

    const clear = React.useCallback(() => setItems([]), []);

    const total = React.useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items]);

    const value = React.useMemo(
        () => ({ items, addItem, updateQuantity, removeItem, clear, total }),
        [items, addItem, updateQuantity, removeItem, clear, total]
    );

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const ctx = React.useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
}
