import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import p5 from "@/assets/p5.jpg";
import p6 from "@/assets/p6.jpg";
import p7 from "@/assets/p7.jpg";
import p8 from "@/assets/p8.jpg";
import p9 from "@/assets/p9.jpg";
import p10 from "@/assets/p10.jpg";
import p11 from "@/assets/p11.jpg";
import p12 from "@/assets/p12.jpg";

export type Category = "electronics" | "fashion" | "beauty" | "home";

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: "electronics", label: "Electronics" },
  { id: "fashion", label: "Fashion" },
  { id: "beauty", label: "Beauty" },
  { id: "home", label: "Home Accessories" },
];

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  image: string;
  rating: number;
  description: string;
}

export const PRODUCTS: Product[] = [
  { id: "aurora-headphones", name: "Aurora Wireless Headphones", price: 149.99, category: "electronics", image: p1, rating: 4.7, description: "Over-ear headphones with active noise cancellation, 30-hour battery life and plush memory-foam cushions for all-day comfort." },
  { id: "pulse-smartwatch", name: "Pulse Smartwatch", price: 199.0, category: "electronics", image: p2, rating: 4.5, description: "Track heart rate, sleep and workouts with a bright AMOLED display, GPS and up to 7 days of battery." },
  { id: "echo-mini-speaker", name: "Echo Mini Speaker", price: 59.99, category: "electronics", image: p3, rating: 4.4, description: "Pocket-sized Bluetooth speaker with rich 360° sound, IPX7 water resistance and a handy carry strap." },
  { id: "classic-denim-jacket", name: "Classic Denim Jacket", price: 79.5, category: "fashion", image: p4, rating: 4.6, description: "A timeless mid-wash denim jacket cut from durable cotton with button chest pockets." },
  { id: "court-sneakers", name: "Court Leather Sneakers", price: 95.0, category: "fashion", image: p5, rating: 4.8, description: "Minimal white sneakers in full-grain leather with a cushioned insole and rubber cupsole." },
  { id: "saddle-crossbody", name: "Saddle Crossbody Bag", price: 120.0, category: "fashion", image: p6, rating: 4.3, description: "Tan leather crossbody with an adjustable strap, brass buckle and roomy interior pocket." },
  { id: "radiant-serum", name: "Radiant Face Serum", price: 34.0, category: "beauty", image: p7, rating: 4.6, description: "Vitamin C and hyaluronic acid serum that brightens and hydrates for a glowing complexion." },
  { id: "velora-parfum", name: "Velora Eau de Parfum", price: 88.0, category: "beauty", image: p8, rating: 4.7, description: "A warm floral fragrance with notes of jasmine, amber and vanilla. 100 ml." },
  { id: "matte-lipstick-trio", name: "Matte Lipstick Trio", price: 42.0, category: "beauty", image: p9, rating: 4.2, description: "Three long-wearing matte shades — rose, terracotta and berry — in one gift set." },
  { id: "ceramic-table-lamp", name: "Ceramic Table Lamp", price: 110.0, category: "home", image: p10, rating: 4.5, description: "Glazed ceramic base topped with a natural linen shade for a soft, warm glow." },
  { id: "linen-oak-candle", name: "Linen & Oak Soy Candle", price: 26.0, category: "home", image: p11, rating: 4.9, description: "Hand-poured soy wax candle with a clean linen and oak scent. 50-hour burn time." },
  { id: "chunky-knit-throw", name: "Chunky Knit Throw", price: 68.0, category: "home", image: p12, rating: 4.6, description: "Cosy hand-knitted throw blanket in oatmeal beige, perfect for sofas and beds." },
];

export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id);

export const formatPrice = (n: number) => `$${n.toFixed(2)}`;

export function filterProducts(query: string, category: Category | "all") {
  const q = query.trim().toLowerCase();
  return PRODUCTS.filter(
    (p) =>
      (category === "all" || p.category === category) &&
      (!q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)),
  );
}

export const SHIPPING_THRESHOLD = 100;
export const SHIPPING_FEE = 9.99;
export const TAX_RATE = 0.08;

export function calcTotals(subtotal: number) {
  const shipping = subtotal === 0 || subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  return { subtotal, shipping, tax, total: Math.round((subtotal + shipping + tax) * 100) / 100 };
}
