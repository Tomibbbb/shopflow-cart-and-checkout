import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { formatPrice, CATEGORIES, type Product } from "@/lib/products";
import { useStore } from "@/lib/store";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useStore();
  const [added, setAdded] = useState(false);
  return (
    <article className="product-card group" data-testid="product-card" data-product-id={product.id}>
      <Link to="/products/$id" params={{ id: product.id }} className="block overflow-hidden rounded-xl bg-muted">
        <img src={product.image} alt={product.name} loading="lazy" width={816} height={816} className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">{CATEGORIES.find((c) => c.id === product.category)?.label}</span>
        <Link to="/products/$id" params={{ id: product.id }} className="font-semibold hover:text-primary" data-testid="product-name">{product.name}</Link>
        <span className="text-xs text-muted-foreground">★ {product.rating}</span>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-lg font-bold" data-testid="product-price">{formatPrice(product.price)}</span>
          <button
            className="btn-primary btn-sm"
            data-testid="add-to-cart"
            onClick={() => { add(product.id); setAdded(true); setTimeout(() => setAdded(false), 1200); }}
          >
            {added ? "Added ✓" : "Add to cart"}
          </button>
        </div>
      </div>
    </article>
  );
}
