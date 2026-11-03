import { describe, expect, it } from "vitest";
import { calcTotals, filterProducts, PRODUCTS } from "@/lib/products";

describe("shop rules", () => {
  it("has 12 demo products", () => expect(PRODUCTS).toHaveLength(12));
  it("charges $9.99 shipping under $100", () => expect(calcTotals(50).shipping).toBe(9.99));
  it("ships free at $100 or more", () => expect(calcTotals(100).shipping).toBe(0));
  it("adds 8% tax", () => expect(calcTotals(100).total).toBe(108));
  it("filters by category", () => expect(filterProducts("", "beauty")).toHaveLength(3));
  it("searches by name", () => expect(filterProducts("sneakers", "all").map((p) => p.id)).toEqual(["court-sneakers"]));
});

import { PRODUCTS as __P } from "@/lib/products";
describe("stable product IDs for e2e", () => {
  it("keeps the 12 product IDs fixed", () => {
    expect(__P.map((p) => p.id)).toEqual(["aurora-headphones","pulse-smartwatch","echo-mini-speaker","classic-denim-jacket","court-sneakers","saddle-crossbody","radiant-serum","velora-parfum","matte-lipstick-trio","ceramic-table-lamp","linen-oak-candle","chunky-knit-throw"]);
  });
});
