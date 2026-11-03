import { createFileRoute, Link } from "@tanstack/react-router";
import { Page } from "@/components/Layout";
import { formatPrice } from "@/lib/products";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/order-confirmation")({
  head: () => ({
    meta: [
      { title: "Order Confirmed — ShopFlow" },
      { name: "description", content: "Your ShopFlow order has been placed." },
      { property: "og:title", content: "Order Confirmed — ShopFlow" },
      { property: "og:description", content: "Thanks for shopping with ShopFlow." },
    ],
  }),
  component: Confirmation,
});

function Confirmation() {
  const { lastOrder } = useStore();
  if (!lastOrder)
    return (
      <Page title="No recent order">
        <Link to="/products" className="btn-primary">Start shopping</Link>
      </Page>
    );
  return (
    <Page>
      <div className="mx-auto max-w-xl rounded-3xl border border-border p-8 text-center shadow-elegant" data-testid="order-confirmation">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-2xl text-primary-foreground">✓</div>
        <h1 className="font-display text-3xl font-extrabold">Thank you, {lastOrder.name}!</h1>
        <p className="mt-2 text-muted-foreground">Your order has been placed. A confirmation would be sent to {lastOrder.email}.</p>
        <p className="mt-4 text-sm">Order number: <strong data-testid="order-number">{lastOrder.id}</strong></p>
        <ul className="my-6 divide-y divide-border text-left text-sm">
          {lastOrder.items.map((i) => (
            <li key={i.product.id} className="flex justify-between py-2" data-testid="confirmation-item">
              <span>{i.product.name} × {i.qty}</span>
              <span>{formatPrice(i.product.price * i.qty)}</span>
            </li>
          ))}
        </ul>
        <p className="text-lg font-bold">Total paid: <span data-testid="order-total">{formatPrice(lastOrder.total)}</span></p>
        <p className="mt-1 text-xs text-muted-foreground">Ships to {lastOrder.address}</p>
        <Link to="/products" className="btn-primary btn-lg mt-8" data-testid="continue-shopping">Continue shopping</Link>
      </div>
    </Page>
  );
}
