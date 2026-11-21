"use client";
import { useContext, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Minus,
  Plus,
  Share2,
  ShieldCheck,
  ShoppingCart,
  Truck,
  RotateCcw,
  Zap,
} from "lucide-react";
import { ProductInterface } from "@/types/product.Type";
import { Rating, WishlistButton } from "./product-card";
import {
  AddProductToCart,
  UpdateCartProductcount,
} from "@/actions/Cart.actions";
import { Cartcontext } from "@/context/CartContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ProductReviews from "./product-reviews";

export default function ProductDetail({
  product: p,
}: {
  product: ProductInterface;
}) {
  const images = p.images.length ? p.images : [p.imageCover];
  const [image, setImage] = useState(images[0]);
  const [quantity, setQuantity] = useState(1);
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState("Product Details");
  const context = useContext(Cartcontext);
  const { status } = useSession();
  const router = useRouter();
  async function add(buy = false) {
    if (status !== "authenticated") {
      router.push("/login");
      return;
    }
    setBusy(true);
    try {
      const data = await AddProductToCart(p._id);
      if (data.status !== "success") throw new Error(data.message);
      if (quantity > 1) {
        const added = data.data.products.find(
          (item: { product: string | { _id: string } }) =>
            (typeof item.product === "string"
              ? item.product
              : item.product._id) === p._id,
        );
        const updated = await UpdateCartProductcount(
          p._id,
          (added?.count ?? 1) + quantity - 1,
        );
        if (updated.status !== "success") throw new Error(updated.message);
      }
      await context?.handleCart();
      toast.success("Added to cart");
      if (buy) router.push("/checkOut");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Unable to add product");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <div className="grid items-start gap-7 lg:grid-cols-[1fr_2.8fr]">
        <div className="store-panel !p-4">
          <div className="relative aspect-[3/4]">
            <Image
              src={image}
              alt={p.title}
              fill
              priority
              sizes="(max-width: 1023px) 90vw, 25vw"
              className="object-contain"
            />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {images.map((src, i) => (
              <button
                key={`${src}-${i}`}
                aria-label={`View product image ${i + 1}`}
                aria-pressed={image === src}
                onClick={() => setImage(src)}
                className={`relative aspect-square overflow-hidden rounded border-2 ${image === src ? "border-primary" : "border-transparent"}`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="90px"
                  className="object-contain"
                />
              </button>
            ))}
          </div>
        </div>
        <div className="store-panel space-y-6">
          <div className="flex gap-2 text-xs">
            <Link
              className="rounded-full bg-green-50 px-3 py-2 text-green-700"
              href={`/product?category=${p.category._id}`}
            >
              {p.category.name}
            </Link>
            {p.brand && (
              <Link
                className="rounded-full bg-slate-100 px-3 py-2"
                href={`/product?brand=${p.brand._id}`}
              >
                {p.brand.name}
              </Link>
            )}
          </div>
          <h1 className="font-heading text-3xl font-bold">{p.title}</h1>
          <Rating value={p.ratingsAverage} count={p.ratingsQuantity} />
          <p className="text-3xl font-bold">
            {(p.priceAfterDiscount ?? p.price).toLocaleString()} EGP{" "}
            {p.priceAfterDiscount && (
              <del className="text-base font-normal text-slate-400">
                {p.price} EGP
              </del>
            )}
          </p>
          <span className="inline-flex rounded-full bg-green-50 px-3 py-2 text-sm text-primary">
            {p.quantity > 0 ? "In Stock" : "Out of Stock"}
          </span>
          <p className="border-t pt-5 text-sm leading-7 text-slate-500">
            {p.description}
          </p>
          <div>
            <p className="mb-2 text-sm">Quantity</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center rounded-lg border">
                <button
                  className="p-3 disabled:opacity-30"
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity(quantity - 1)}
                >
                  <Minus className="size-4" />
                </button>
                <span className="w-10 text-center">{quantity}</span>
                <button
                  className="p-3 disabled:opacity-30"
                  aria-label="Increase quantity"
                  disabled={quantity >= p.quantity}
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="size-4" />
                </button>
              </div>
              <span className="text-sm text-slate-500">
                {p.quantity} available
              </span>
            </div>
          </div>
          <div className="flex justify-between gap-3 rounded-xl bg-slate-50 p-4">
            <span>Total Price:</span>
            <strong className="text-xl text-primary">
              {((p.priceAfterDiscount ?? p.price) * quantity).toLocaleString()}{" "}
              EGP
            </strong>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              className="store-button"
              disabled={busy || p.quantity < 1}
              onClick={() => add()}
            >
              <ShoppingCart className="size-4" />
              {busy ? "Adding..." : "Add to Cart"}
            </button>
            <button
              className="store-button !bg-slate-900"
              disabled={busy || p.quantity < 1}
              onClick={() => add(true)}
            >
              <Zap className="size-4" />
              Buy Now
            </button>
          </div>
          <div className="flex gap-3">
            <WishlistButton product={p} label />
            <button
              className="store-button-outline"
              aria-label="Share product"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(location.href);
                  toast.success("Product link copied");
                } catch {
                  toast.error("Could not copy the link");
                }
              }}
            >
              <Share2 className="size-4" />
            </button>
          </div>
          <div className="grid gap-4 border-t pt-5 sm:grid-cols-3">
            {[
              {
                Icon: Truck,
                title: "Free Delivery",
                text: "Orders over 500 EGP",
              },
              {
                Icon: RotateCcw,
                title: "Easy Returns",
                text: "14-day return policy",
              },
              {
                Icon: ShieldCheck,
                title: "Secure Payment",
                text: "Protected checkout",
              },
            ].map(({ Icon, title, text }) => (
              <div key={title} className="flex items-center gap-3">
                <Icon className="size-5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm">{title}</p>
                  <p className="mt-1 text-xs text-slate-500">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <section className="store-panel mt-10">
        <div
          role="tablist"
          aria-label="Product information"
          className="mb-6 flex flex-wrap gap-4 border-b"
        >
          {["Product Details", "Reviews", "Shipping & Returns"].map((t) => (
            <button
              key={t}
              role="tab"
              id={`tab-${t.split(" ")[0]}`}
              aria-controls="product-tab-panel"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`border-b-2 px-2 py-4 text-sm ${tab === t ? "border-primary text-primary" : "border-transparent text-slate-500"}`}
            >
              {t}
              {t === "Reviews" ? ` (${p.ratingsQuantity})` : ""}
            </button>
          ))}
        </div>
        <div
          role="tabpanel"
          id="product-tab-panel"
          aria-labelledby={`tab-${tab.split(" ")[0]}`}
          className="text-sm leading-7 text-slate-500"
        >
          {tab === "Product Details" ? (
            <>
              <h2 className="mb-3 font-semibold text-foreground">
                About this Product
              </h2>
              <p>{p.description}</p>
              <dl className="mt-5 grid gap-2 rounded-xl bg-slate-50 p-5">
                <div className="flex justify-between">
                  <dt>Category</dt>
                  <dd>{p.category.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Brand</dt>
                  <dd>{p.brand?.name ?? "-"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Availability</dt>
                  <dd>{p.quantity} in stock</dd>
                </div>
              </dl>
            </>
          ) : tab === "Reviews" ? (
            <ProductReviews productId={p._id} />
          ) : (
            <>
              <p>
                Free shipping on orders over 500 EGP. Delivery details are shown
                at checkout.
              </p>
              <p>
                Contact{" "}
                <a className="text-primary" href="mailto:support@freshcart.com">
                  support@freshcart.com
                </a>{" "}
                for help with returns within 14 days.
              </p>
            </>
          )}
        </div>
      </section>
    </>
  );
}
