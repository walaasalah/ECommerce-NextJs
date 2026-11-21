"use client";
import Image from "next/image";
import Link from "next/link";
import { Eye, Heart, Star } from "lucide-react";
import { useState } from "react";
import { ProductInterface } from "@/types/product.Type";
import AddToCartButton from "@/components/cart/addTocartButton";
import { useWishlist } from "@/context/WishlistContext";
import { toast } from "sonner";

export function Rating({ value, count }: { value: number; count: number }) {
  return (
    <div
      className="flex flex-wrap items-center gap-2"
      aria-label={`${value} out of 5, ${count} reviews`}
    >
      <span className="flex text-amber-400">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            className={`size-4 ${n <= Math.round(value) ? "fill-current" : ""}`}
          />
        ))}
      </span>
      <span className="text-xs text-slate-500">
        {value} ({count})
      </span>
    </div>
  );
}
export function WishlistButton({
  product,
  label = false,
}: {
  product: ProductInterface;
  label?: boolean;
}) {
  const { products, toggle } = useWishlist();
  const [busy, setBusy] = useState(false);
  const saved = products.some((item) => item._id === product._id);
  return (
    <button
      type="button"
      aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={saved}
      disabled={busy}
      className={
        label
          ? "store-button-outline flex-1"
          : "grid size-9 place-items-center rounded-full border border-slate-100 bg-white text-slate-500 shadow-xs hover:text-rose-500"
      }
      onClick={async () => {
        setBusy(true);
        try {
          await toggle(product);
        } catch (e) {
          toast.error(
            e instanceof Error ? e.message : "Unable to update wishlist",
          );
        } finally {
          setBusy(false);
        }
      }}
    >
      <Heart
        className={`size-4 ${saved ? "fill-rose-500 text-rose-500" : ""}`}
      />
      {label && (saved ? "Saved to Wishlist" : "Add to Wishlist")}
    </button>
  );
}
export default function ProductCard({
  product,
}: {
  product: ProductInterface;
}) {
  const discounted =
    product.priceAfterDiscount != null &&
    product.priceAfterDiscount < product.price;
  return (
    <article className="product-card group relative flex min-w-0 flex-col overflow-hidden rounded-lg border bg-white transition-shadow hover:shadow-lg">
      <Link
        href={`/product/${product._id}`}
        className="relative block aspect-square overflow-hidden"
      >
        <Image
          src={product.imageCover}
          alt={product.title}
          fill
          sizes="(max-width: 639px) 90vw, (max-width: 1023px) 30vw, 20vw"
          className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
        />
      </Link>
      {discounted && (
        <span className="absolute top-3 left-3 rounded bg-rose-500 px-2 py-1 text-xs text-white">
          -{Math.round((1 - product.priceAfterDiscount! / product.price) * 100)}
          %
        </span>
      )}
      <div className="absolute top-3 right-3 flex flex-col gap-2">
        <WishlistButton product={product} />
        <Link
          aria-label={`View ${product.title}`}
          href={`/product/${product._id}`}
          className="grid size-9 place-items-center rounded-full border border-slate-100 bg-white text-slate-500 shadow-xs"
        >
          <Eye className="size-4" />
        </Link>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs text-slate-500">{product.category.name}</p>
        <Link
          className="line-clamp-2 text-sm leading-6 hover:text-primary"
          href={`/product/${product._id}`}
        >
          {product.title}
        </Link>
        <Rating
          value={product.ratingsAverage}
          count={product.ratingsQuantity}
        />
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
          <p className={`font-bold ${discounted ? "text-primary" : ""}`}>
            {(product.priceAfterDiscount ?? product.price).toLocaleString()} EGP{" "}
            {discounted && (
              <del className="ml-1 text-xs font-normal text-slate-400">
                {product.price} EGP
              </del>
            )}
          </p>
          <AddToCartButton
            productId={product._id}
            compact
            disabled={product.quantity < 1}
          />
        </div>
      </div>
    </article>
  );
}
