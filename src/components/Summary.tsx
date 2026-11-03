import { calcTotals, formatPrice } from "@/lib/products";
import type { ReactNode } from "react";

export function Summary({ subtotal, children }: { subtotal: number; children?: ReactNode }) {
  const t = calcTotals(subtotal);
  return (
    <aside className="h-fit rounded-2xl border border-border bg-secondary p-6" data-testid="order-summary">
      <h2 className="mb-4 font-display text-lg font-bold">Order summary</h2>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between"><dt>Subtotal</dt><dd data-testid="summary-subtotal">{formatPrice(t.subtotal)}</dd></div>
        <div className="flex justify-between"><dt>Shipping</dt><dd data-testid="summary-shipping">{t.shipping === 0 ? "Free" : formatPrice(t.shipping)}</dd></div>
        <div className="flex justify-between"><dt>Tax (8%)</dt><dd data-testid="summary-tax">{formatPrice(t.tax)}</dd></div>
        <div className="flex justify-between border-t border-border pt-3 text-base font-bold"><dt>Total</dt><dd data-testid="summary-total">{formatPrice(t.total)}</dd></div>
      </dl>
      {children && <div className="mt-6">{children}</div>}
    </aside>
  );
}
