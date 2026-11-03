import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ProductCard } from "@/components/ProductCard";
import { Page } from "@/components/Layout";
import { CATEGORIES, filterProducts, type Category } from "@/lib/products";

type Search = { q?: string | undefined; category?: Category | "all" | undefined };

export const Route = createFileRoute("/products/")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    q: typeof s["q"] === "string" && s["q"] ? s["q"] : undefined,
    category: CATEGORIES.some((c) => c.id === s["category"]) ? (s["category"] as Category) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "All Products — ShopFlow" },
      { name: "description", content: "Browse and search all ShopFlow products by category." },
      { property: "og:title", content: "All Products — ShopFlow" },
      { property: "og:description", content: "Browse electronics, fashion, beauty and home accessories." },
    ],
  }),
  component: Products,
});

function Products() {
  const { q = "", category = "all" } = Route.useSearch();
  const navigate = useNavigate({ from: "/products/" });
  const results = filterProducts(q, category);
  const set = (patch: Search) => navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true });

  return (
    <Page title="Products">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center">
        <input
          type="search"
          value={q}
          onChange={(e) => set({ q: e.target.value || undefined })}
          placeholder="Search products…"
          className="input md:max-w-sm"
          data-testid="search-input"
          aria-label="Search products"
        />
        <div className="flex flex-wrap gap-2" role="group" aria-label="Category filter">
          {[{ id: "all" as const, label: "All" }, ...CATEGORIES].map((c) => (
            <button
              key={c.id}
              className={category === c.id ? "chip chip-active" : "chip"}
              aria-pressed={category === c.id}
              data-testid={`filter-${c.id}`}
              onClick={() => set({ category: c.id === "all" ? undefined : c.id })}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
      <p className="mb-4 text-sm text-muted-foreground" data-testid="results-count">{results.length} product{results.length === 1 ? "" : "s"}</p>
      {results.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground" data-testid="no-results">
          No products match your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {results.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </Page>
  );
}
