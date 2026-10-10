"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { getProduct, type Product } from "@/lib/products";

interface CartLine {
  slug: string;
  qty: number;
}

export interface CartItem extends CartLine {
  product: Product;
}

/** A jar on its way from the page to the bag button. */
export interface Flight {
  id: number;
  slug: string;
  qty: number;
  from: { x: number; y: number; w: number; h: number };
  delay: number;
}

/** The most recent add, shown as a toast once the jar has landed. */
export interface AddNotice {
  id: number;
  slug: string;
  qty: number;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  /** Count shown on the bag: excludes jars still mid-flight, so it ticks up as each one lands. */
  shownCount: number;
  subtotal: number;
  isOpen: boolean;
  /** Increments every time a jar lands in the bag, so the bag icon can replay its animation. */
  addedTick: number;
  flights: Flight[];
  notice: AddNotice | null;
  /** Adds to the bag. Pass the element the jar should fly from to animate it into the bag. */
  add: (slug: string, qty?: number, origin?: Element | null, delay?: number) => void;
  land: (id: number) => void;
  dismissNotice: () => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  open: () => void;
  close: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "bb-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [addedTick, setAddedTick] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [notice, setNotice] = useState<AddNotice | null>(null);
  const nextId = useRef(1);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as CartLine[];
        // eslint-disable-next-line react-hooks/set-state-in-effect -- restoring persisted state after hydration
        setLines(parsed.filter((l) => getProduct(l.slug) && l.qty > 0));
      }
    } catch {
      /* storage unavailable: start with an empty bag */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines, hydrated]);

  const add = useCallback((slug: string, qty = 1, origin?: Element | null, delay = 0) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.slug === slug);
      if (existing) {
        return prev.map((l) => (l.slug === slug ? { ...l, qty: Math.min(l.qty + qty, 12) } : l));
      }
      return [...prev, { slug, qty }];
    });

    const id = nextId.current++;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const r = origin?.getBoundingClientRect();
    const visible = r && r.width > 0 && r.bottom > 0 && r.top < window.innerHeight;
    if (r && visible && !reduce) {
      setFlights((f) => [...f, { id, slug, qty, delay, from: { x: r.left, y: r.top, w: r.width, h: r.height } }]);
    } else {
      // Nothing to fly from: confirm straight away.
      setAddedTick((t) => t + 1);
      setNotice({ id, slug, qty });
    }
  }, []);

  const land = useCallback((id: number) => {
    setFlights((f) => {
      const flight = f.find((x) => x.id === id);
      if (flight) setNotice({ id, slug: flight.slug, qty: flight.qty });
      return f.filter((x) => x.id !== id);
    });
    setAddedTick((t) => t + 1);
  }, []);

  const dismissNotice = useCallback(() => setNotice(null), []);

  const setQty = useCallback((slug: string, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.slug !== slug)
        : prev.map((l) => (l.slug === slug ? { ...l, qty: Math.min(qty, 12) } : l)),
    );
  }, []);

  const remove = useCallback((slug: string) => {
    setLines((prev) => prev.filter((l) => l.slug !== slug));
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const items = lines
      .map((l) => ({ ...l, product: getProduct(l.slug)! }))
      .filter((i) => i.product);
    const count = items.reduce((n, i) => n + i.qty, 0);
    const inAir = flights.reduce((n, f) => n + f.qty, 0);
    return {
      items,
      count,
      shownCount: Math.max(count - inAir, 0),
      subtotal: items.reduce((n, i) => n + i.qty * i.product.price, 0),
      isOpen,
      addedTick,
      flights,
      notice,
      add,
      land,
      dismissNotice,
      setQty,
      remove,
      open: () => {
        setNotice(null);
        setIsOpen(true);
      },
      close: () => setIsOpen(false),
    };
  }, [lines, isOpen, addedTick, flights, notice, add, land, dismissNotice, setQty, remove]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
