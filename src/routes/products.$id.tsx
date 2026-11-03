import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Page } from "@/components/Layout";
import { CATEGORIES, formatPrice, getProduct } from "@/lib/products";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/products/$id")({
  loader: ({ params }) => {
    const p = getProduct(params.id);
    if (!p) throw notFound();
    return { name: p.name, description: p.description };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} — ShopFlow` },
          { name: "description", content: loaderData.description },
          { property: "og:title", content: `${loaderData.name} — ShopFlow` },
          { property: "og:description", content: loaderData.description },
          { property: "og:type", content: "product" },
        ]
      : [{ title: "Product unavailable — ShopFlow" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => (
    <Page title="Product not found"><Link to="/products" className="btn-primary">Back to products</Link></Page>
  ),
  component: Detail,
});

function Detail() {
  const { id } = Route.useParams();
  const product = getProduct(id)!;
  const { add } = useStore();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  return (
    <Page>
      <Link to="/products" className="mb-6 inline-block text-sm text-muted-foreground hover:text-primary">← Back to products</Link>
      <div className="grid gap-10 md:grid-cols-2">
        <div className="overflow-hidden rounded-3xl bg-muted">
          <img src={product.image} alt={product.name} width={816} height={816} className="aspect-square w-full object-cover" />
        </div>
        <div className="flex flex-col gap-4">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">{CATEGORIES.find((c) => c.id === product.category)?.label}</span>
          <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl" data-testid="detail-name">{product.name}</h1>
          <p className="text-sm text-muted-foreground">★ {product.rating} rating</p>
          <p className="text-3xl font-bold" data-testid="detail-price">{formatPrice(product.price)}</p>
          <p className="leading-relaxed text-muted-foreground" data-testid="detail-description">{product.description}</p>
          <div className="mt-4 flex items-center gap-4">
            <div className="qty">
              <button aria-label="Decrease quantity" data-testid="detail-qty-decrease" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <span data-testid="detail-qty">{qty}</span>
              <button aria-label="Increase quantity" data-testid="detail-qty-increase" onClick={() => setQty(Math.min(99, qty + 1))}>+</button>
            </div>
            <button className="btn-primary btn-lg flex-1" data-testid="detail-add-to-cart" onClick={() => { add(product.id, qty); setAdded(true); }}>
              Add to cart
            </button>
          </div>
          {added && (
            <p className="text-sm text-primary" data-testid="added-message">
              Added to cart. <Link to="/cart" className="font-semibold underline">View cart</Link>
            </p>
          )}
        </div>
      </div>
    </Page>
  );
}
