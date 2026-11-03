import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORIES, PRODUCTS } from "@/lib/products";
import hero from "@/assets/p1.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ShopFlow — Electronics, Fashion, Beauty & Home" },
      { name: "description", content: "Shop curated electronics, fashion, beauty and home accessories at ShopFlow." },
      { property: "og:title", content: "ShopFlow — Modern Online Store" },
      { property: "og:description", content: "Curated electronics, fashion, beauty and home accessories." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main>
      <section className="hero-bg">
        <div className="container-page grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="badge">New season collection</span>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
              Shopping that <span className="text-primary">flows.</span>
            </h1>
            <p className="mt-4 max-w-md text-lg text-muted-foreground">Curated tech, style, beauty and home pieces — delivered fast, free over $100.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/products" className="btn-primary btn-lg" data-testid="shop-now">Shop now</Link>
              <Link to="/register" className="btn-outline btn-lg">Create account</Link>
            </div>
          </div>
          <div className="mx-auto w-full max-w-md overflow-hidden rounded-3xl bg-background shadow-elegant">
            <img src={hero} alt="Aurora Wireless Headphones" width={816} height={816} className="aspect-square w-full object-cover" />
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <h2 className="mb-6 font-display text-2xl font-bold">Shop by category</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {CATEGORIES.map((c) => (
            <Link key={c.id} to="/products" search={{ category: c.id }} className="category-tile" data-testid={`category-${c.id}`}>
              {c.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="container-page">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl font-bold">Featured products</h2>
          <Link to="/products" className="text-sm font-semibold text-primary hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.filter((_, i) => i % 3 === 0).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </main>
  );
}
