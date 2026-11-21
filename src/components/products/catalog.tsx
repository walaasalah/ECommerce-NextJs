"use client";
import { useState } from "react";
import { ProductInterface } from "@/types/product.Type";
import ProductCard from "./product-card";
import Link from "next/link";

export default function Catalog({
  products,
  initialQuery = "",
  category = "",
  subcategory = "",
  brand = "",
  deals = false,
}: {
  products: ProductInterface[];
  initialQuery?: string;
  category?: string;
  subcategory?: string;
  brand?: string;
  deals?: boolean;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState("");
  const matchesQuery = (p: ProductInterface) => {
    const term = query.trim().toLowerCase();
    if (term === "men's" || term === "women's")
      return p.category.name.toLowerCase().startsWith(term);
    return `${p.title} ${p.category.name} ${p.brand?.name ?? ""}`
      .toLowerCase()
      .includes(term);
  };
  const filtered = products.filter(
    (p) =>
      matchesQuery(p) &&
      (!category || p.category._id === category) &&
      (!subcategory || p.subcategory.some(item => item._id === subcategory)) &&
      (!brand || p.brand?._id === brand) &&
      (!deals ||
        (p.priceAfterDiscount != null && p.priceAfterDiscount < p.price)),
  );
  if (sort === "low")
    filtered.sort(
      (a, b) =>
        (a.priceAfterDiscount ?? a.price) - (b.priceAfterDiscount ?? b.price),
    );
  if (sort === "high")
    filtered.sort(
      (a, b) =>
        (b.priceAfterDiscount ?? b.price) - (a.priceAfterDiscount ?? a.price),
    );
  if (sort === "rating")
    filtered.sort((a, b) => b.ratingsAverage - a.ratingsAverage);
  return (
    <section className="store-container py-9">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-slate-500">
          Showing {filtered.length} products
          {query && (
            <>
              {" "}
              for <strong>“{query}”</strong>
            </>
          )}
        </p>
        <div className="flex flex-wrap gap-3">
          <input
            aria-label="Filter products"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="store-input max-w-60"
            placeholder="Search products..."
          />
          <select
            aria-label="Sort products"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="store-input w-auto"
          >
            <option value="">Recommended</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
            <option value="rating">Top rated</option>
          </select>
        </div>
      </div>
      {filtered.length ? (
        <div className="product-grid">
          {filtered.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      ) : (
        <div className="store-empty">
          <h2>No products found</h2>
          <p>Try another search or browse the full collection.</p>
          <Link href="/product" className="store-button mt-5">
            View all products
          </Link>
        </div>
      )}
    </section>
  );
}
