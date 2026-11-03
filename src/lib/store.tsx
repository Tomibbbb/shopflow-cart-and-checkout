import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getProduct, type Product } from "./products";

export interface CartItem { id: string; qty: number }
export interface User { name: string; email: string }
export interface Order {
  id: string;
  items: { product: Product; qty: number }[];
  total: number;
  name: string;
  address: string;
  email: string;
  date: string;
}

export type AuthResult = { error: string | null; needsConfirmation?: boolean };

interface Store {
  cart: CartItem[];
  lines: { product: Product; qty: number }[];
  count: number;
  subtotal: number;
  add: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  user: User | null;
  authReady: boolean;
  register: (name: string, email: string, password: string) => Promise<AuthResult>;
  login: (email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  lastOrder: Order | null;
  placeOrder: (o: Omit<Order, "id" | "items" | "total" | "date">, total: number) => Order;
}

const Ctx = createContext<Store | null>(null);

const load = <T,>(k: string, d: T): T => {
  try {
    const v = localStorage.getItem(k);
    return v ? (JSON.parse(v) as T) : d;
  } catch {
    return d;
  }
};

type SbUser = { email?: string | null | undefined; user_metadata?: Record<string, unknown> } | null | undefined;
const toUser = (u: SbUser): User | null =>
  u ? { email: u.email ?? "", name: String(u.user_metadata?.["name"] || (u.email ?? "").split("@")[0] || "") } : null;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCart(load("sf_cart", []));
    setLastOrder(load("sf_last_order", null));
    localStorage.removeItem("sf_users"); // legacy insecure storage
    localStorage.removeItem("sf_user");
    setReady(true);
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setUser(toUser(session?.user)));
    supabase.auth.getUser().then(({ data }) => { setUser(toUser(data.user)); setAuthReady(true); });
    return () => sub.subscription.unsubscribe();
  }, []);
  useEffect(() => { if (ready) localStorage.setItem("sf_cart", JSON.stringify(cart)); }, [cart, ready]);

  const lines = cart.flatMap((c) => {
    const product = getProduct(c.id);
    return product ? [{ product, qty: c.qty }] : [];
  });
  const subtotal = Math.round(lines.reduce((s, l) => s + l.product.price * l.qty, 0) * 100) / 100;
  const count = lines.reduce((s, l) => s + l.qty, 0);

  const setQty = (id: string, qty: number) =>
    setCart((c) => (qty <= 0 ? c.filter((i) => i.id !== id) : c.map((i) => (i.id === id ? { ...i, qty: Math.min(qty, 99) } : i))));

  const value: Store = {
    cart, lines, count, subtotal,
    add: (id, qty = 1) =>
      setCart((c) => (c.some((i) => i.id === id) ? c.map((i) => (i.id === id ? { ...i, qty: Math.min(i.qty + qty, 99) } : i)) : [...c, { id, qty }])),
    setQty,
    remove: (id) => setCart((c) => c.filter((i) => i.id !== id)),
    clear: () => setCart([]),
    user,
    authReady,
    register: async (name, email, password) => {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: { emailRedirectTo: window.location.origin, data: { name } },
      });
      if (error) return { error: error.message };
      if (data.user && data.user.identities?.length === 0) return { error: "An account with this email already exists" };
      return { error: null, needsConfirmation: !data.session };
    },
    login: async (email, password) => {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
      if (error) return { error: error.message === "Invalid login credentials" ? "Invalid email or password" : error.message };
      return { error: null };
    },
    logout: async () => { await supabase.auth.signOut(); setUser(null); },
    lastOrder,
    placeOrder: (o, total) => {
      const order: Order = { ...o, id: "SF-" + Math.floor(100000 + Math.random() * 900000), items: lines, total, date: new Date().toISOString() };
      setLastOrder(order);
      localStorage.setItem("sf_last_order", JSON.stringify(order));
      setCart([]);
      return order;
    },
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore outside StoreProvider");
  return s;
}
