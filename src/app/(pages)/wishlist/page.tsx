"use client";
import { useWishlist } from "@/context/WishlistContext";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/components/cart/addTocartButton";
import { WishlistButton } from "@/components/products/product-card";
export default function WishlistPage() {
  const { products, loading, error, refresh } = useWishlist();
  return (
    <section className="store-container py-9">
      <p className="mb-6 text-sm text-slate-500">
        <Link href="/">Home</Link> / Wishlist
      </p>
      <div className="mb-9 flex items-center gap-4">
        <span className="grid size-14 place-items-center rounded-xl bg-rose-50 text-rose-500">
          <Heart className="fill-current" />
        </span>
        <div>
          <h1 className="font-heading text-3xl font-bold">My Wishlist</h1>
          <p className="mt-1 text-sm text-slate-500">
            {products.length} items saved
          </p>
        </div>
      </div>
      {loading ? (
        <p role="status" className="py-20 text-center">
          Loading your wishlist...
        </p>
      ) : error ? (
        <div role="alert" className="store-empty">
          <p>{error}</p>
          <button className="store-button mt-4" onClick={() => refresh()}>
            Try again
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="store-empty">
          <Heart className="mx-auto mb-5 size-16 text-rose-200" />
          <h2>Your wishlist is waiting</h2>
          <p>Save products you love and find them here.</p>
          <Link className="store-button mt-6" href="/product">
            Explore products
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-white">
          <div className="hidden grid-cols-[3fr_1fr_1fr_1fr] gap-4 bg-slate-50 p-5 text-sm text-slate-500 md:grid">
            <span>Product</span>
            <span>Price</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          {products.map((p) => (
            <article
              key={p._id}
              className="grid items-center gap-5 border-t p-5 md:grid-cols-[3fr_1fr_1fr_1fr]"
            >
              <Link
                href={`/product/${p._id}`}
                className="flex items-center gap-5"
              >
                <Image
                  src={p.imageCover}
                  alt={p.title}
                  width={80}
                  height={80}
                  className="size-20 rounded-xl border object-contain p-2"
                />
                <div>
                  <h2 className="text-sm font-medium">{p.title}</h2>
                  <p className="mt-2 text-sm text-slate-400">
                    {p.category.name}
                  </p>
                </div>
              </Link>
              <strong>
                {(p.priceAfterDiscount ?? p.price).toLocaleString()} EGP
              </strong>
              <span className="w-fit rounded-full bg-green-50 px-3 py-1 text-xs text-primary">
                {p.quantity > 0 ? "In Stock" : "Out of Stock"}
              </span>
              <div className="flex items-center gap-2">
                <AddToCartButton productId={p._id} disabled={p.quantity < 1} />
                <WishlistButton product={p} />
              </div>
            </article>
          ))}
        </div>
      )}
      <Link
        className="mt-8 inline-block text-sm text-slate-500 hover:text-primary"
        href="/product"
      >
        Continue Shopping
      </Link>
    </section>
  );
}
