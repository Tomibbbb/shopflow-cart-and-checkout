import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
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
  register: (name: string, email: string, password: string) => string | null;
  login: (email: string, password: string) => string | null;
  logout: () => void;
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

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCart(load("sf_cart", []));
    setUser(load("sf_user", null));
    setLastOrder(load("sf_last_order", null));
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem("sf_cart", JSON.stringify(cart)); }, [cart, ready]);
  useEffect(() => { if (ready) localStorage.setItem("sf_user", JSON.stringify(user)); }, [user, ready]);

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
    register: (name, email, password) => {
      const users = load<Record<string, { name: string; password: string }>>("sf_users", {});
      const key = email.toLowerCase();
      if (users[key]) return "An account with this email already exists";
      users[key] = { name, password };
      localStorage.setItem("sf_users", JSON.stringify(users));
      setUser({ name, email: key });
      return null;
    },
    login: (email, password) => {
      const users = load<Record<string, { name: string; password: string }>>("sf_users", {});
      const u = users[email.toLowerCase()];
      if (!u || u.password !== password) return "Invalid email or password";
      setUser({ name: u.name, email: email.toLowerCase() });
      return null;
    },
    logout: () => setUser(null),
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
