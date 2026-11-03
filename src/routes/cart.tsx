import { createFileRoute, Link } from "@tanstack/react-router";
import { Page } from "@/components/Layout";
import { Summary } from "@/components/Summary";
import { formatPrice } from "@/lib/products";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — ShopFlow" },
      { name: "description", content: "Review the items in your ShopFlow cart." },
      { property: "og:title", content: "Your Cart — ShopFlow" },
      { property: "og:description", content: "Review your cart and proceed to checkout." },
    ],
  }),
  component: Cart,
});

function Cart() {
  const { lines, subtotal, setQty, remove } = useStore();
  if (lines.length === 0)
    return (
      <Page title="Shopping cart" back={{ fallback: "/products", label: "Continue shopping" }}>
        <div className="rounded-2xl border border-dashed border-border p-12 text-center" data-testid="empty-cart">
          <p className="mb-4 text-muted-foreground">Your cart is empty.</p>
          <Link to="/products" className="btn-primary">Continue shopping</Link>
        </div>
      </Page>
    );
  return (
    <Page title="Shopping cart" back={{ fallback: "/products", label: "Continue shopping" }}>
      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <ul className="divide-y divide-border rounded-2xl border border-border">
          {lines.map(({ product, qty }) => (
            <li key={product.id} className="flex gap-4 p-4" data-testid="cart-item" data-product-id={product.id}>
              <img src={product.image} alt={product.name} width={96} height={96} loading="lazy" className="h-24 w-24 rounded-xl object-cover" />
              <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Link to="/products/$id" params={{ id: product.id }} className="font-semibold hover:text-primary" data-testid="cart-item-name">{product.name}</Link>
                  <p className="text-sm text-muted-foreground">{formatPrice(product.price)} each</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="qty">
                    <button aria-label="Decrease quantity" data-testid="qty-decrease" onClick={() => setQty(product.id, qty - 1)}>−</button>
                    <span data-testid="cart-quantity" aria-live="polite">{qty}</span>
                    <button aria-label="Increase quantity" data-testid="qty-increase" onClick={() => setQty(product.id, qty + 1)}>+</button>
                  </div>
                  <span className="w-20 text-right font-bold" data-testid="item-total">{formatPrice(product.price * qty)}</span>
                  <button className="text-sm text-destructive hover:underline" data-testid="cart-remove" aria-label={`Remove ${product.name}`} onClick={() => remove(product.id)}>Remove</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <Summary subtotal={subtotal}>
          <Link to="/checkout" className="btn-primary btn-lg w-full" data-testid="checkout-button">Proceed to checkout</Link>
        </Summary>
      </div>
    </Page>
  );
}
