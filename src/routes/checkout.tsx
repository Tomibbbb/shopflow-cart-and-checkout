import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Page } from "@/components/Layout";
import { Summary } from "@/components/Summary";
import { calcTotals } from "@/lib/products";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — ShopFlow" },
      { name: "description", content: "Complete your ShopFlow order (simulated payment)." },
      { property: "og:title", content: "Checkout — ShopFlow" },
      { property: "og:description", content: "Simulated checkout — no real payment taken." },
    ],
  }),
  component: Checkout,
});

const empty = { name: "", email: "", address: "", city: "", zip: "", card: "", expiry: "", cvc: "" };

export function validateCheckout(f: typeof empty) {
  const e: Partial<Record<keyof typeof empty, string>> = {};
  if (!f.name.trim()) e.name = "Name is required";
  if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Valid email is required";
  if (!f.address.trim()) e.address = "Address is required";
  if (!f.city.trim()) e.city = "City is required";
  if (!/^[A-Za-z0-9 -]{3,10}$/.test(f.zip)) e.zip = "Valid postal code is required";
  if (!/^\d{16}$/.test(f.card.replace(/\s/g, ""))) e.card = "Card number must be 16 digits";
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(f.expiry)) e.expiry = "Use MM/YY";
  if (!/^\d{3,4}$/.test(f.cvc)) e.cvc = "CVC must be 3–4 digits";
  return e;
}

function Checkout() {
  const { lines, subtotal, user, placeOrder } = useStore();
  const navigate = useNavigate();
  const [f, setF] = useState(empty);
  const [errors, setErrors] = useState<ReturnType<typeof validateCheckout>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (user) setF((p) => ({ ...p, name: p.name || user.name, email: p.email || user.email })); }, [user]);

  if (lines.length === 0)
    return (
      <Page title="Checkout" back={{ fallback: "/cart", label: "Back to cart" }}>
        <p className="mb-4 text-muted-foreground" data-testid="checkout-empty">Your cart is empty.</p>
        <Link to="/products" className="btn-primary">Browse products</Link>
      </Page>
    );

  const field = (k: keyof typeof empty, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <label className="field">
      {label}
      <input className="input" value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} data-testid={`checkout-${k}`} aria-invalid={!!errors[k]} {...props} />
      {errors[k] && <span className="text-xs text-destructive" data-testid={`error-${k}`}>{errors[k]}</span>}
    </label>
  );

  return (
    <Page title="Checkout" back={{ fallback: "/cart", label: "Back to cart" }}>
      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <form
          id="checkout-form"
          noValidate
          data-testid="checkout-form"
          className="space-y-8"
          onSubmit={(e) => {
            e.preventDefault();
            const errs = validateCheckout(f);
            setErrors(errs);
            if (Object.keys(errs).length) return;
            setBusy(true);
            setTimeout(() => {
              placeOrder({ name: f.name, email: f.email, address: `${f.address}, ${f.city} ${f.zip}` }, calcTotals(subtotal).total);
              navigate({ to: "/order-confirmation" });
            }, 800);
          }}
        >
          <fieldset className="grid gap-4 sm:grid-cols-2">
            <legend className="mb-2 font-display text-lg font-bold">Shipping details</legend>
            {field("name", "Full name")}
            {field("email", "Email", { type: "email" })}
            <div className="sm:col-span-2">{field("address", "Street address")}</div>
            {field("city", "City")}
            {field("zip", "Postal code")}
          </fieldset>
          <fieldset className="grid gap-4 sm:grid-cols-3">
            <legend className="mb-2 font-display text-lg font-bold">Payment <span className="text-sm font-normal text-muted-foreground">(simulated — use 4242 4242 4242 4242)</span></legend>
            <div className="sm:col-span-3">{field("card", "Card number", { inputMode: "numeric", placeholder: "4242 4242 4242 4242" })}</div>
            {field("expiry", "Expiry", { placeholder: "MM/YY" })}
            {field("cvc", "CVC", { inputMode: "numeric", placeholder: "123" })}
          </fieldset>
        </form>
        <Summary subtotal={subtotal}>
          <button type="submit" form="checkout-form" className="btn-primary btn-lg w-full" disabled={busy} data-testid="place-order">
            {busy ? "Processing…" : "Place order"}
          </button>
        </Summary>
      </div>
    </Page>
  );
}
