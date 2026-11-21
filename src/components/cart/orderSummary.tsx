"use client";
import { Lock, ShoppingBag, Tag, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CartDataInterface } from "@/types/cart.type";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ApplyCartCoupon } from "@/actions/Cart.actions";
export default function OrderSummary({
  cartData,
  isCheckOut = false,
  isSubmitting = false,
  onCartUpdate,
}: {
  cartData: CartDataInterface;
  isCheckOut?: boolean;
  isSubmitting?: boolean;
  onCartUpdate: (cart: CartDataInterface) => void;
}) {
  const noCartItem = cartData.data.products.reduce(
    (sum, item) => sum + item.count,
    0,
  );
  const [promoOpen, setPromoOpen] = useState(false);
  const [promoMessage, setPromoMessage] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [applyingPromo, setApplyingPromo] = useState(false);
  const total =
    cartData.data.totalAfterDiscount ?? cartData.data.totalCartPrice;
  const discount = Math.max(0, cartData.data.totalCartPrice - total);
  const remaining = Math.max(0, 500 - cartData.data.totalCartPrice);

  async function applyPromo() {
    setApplyingPromo(true);
    setPromoMessage("");
    try {
      const result = await ApplyCartCoupon(promoCode);
      if (!result.ok) {
        setPromoMessage(result.error);
        return;
      }
      onCartUpdate(result.cart);
      setPromoMessage("Promo code applied. Your totals are updated.");
    } catch (error) {
      setPromoMessage(
        error instanceof Error
          ? error.message
          : "Could not apply this promo code.",
      );
    } finally {
      setApplyingPromo(false);
    }
  }

  return (
    <>
      <div className="col-span-12 lg:col-span-4">
        <Card className="gap-0 overflow-hidden rounded-2xl py-0 shadow-sm">
          <div className="bg-primary p-5 text-primary-foreground">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <ShoppingBag className="size-5" />
              Order Summary
            </h2>
            <p className="mt-1 text-sm">{noCartItem} item in your cart</p>
          </div>

          <CardContent className="space-y-4 p-5">
            {isCheckOut ? (
              <div
                role="region"
                aria-label="Cart items"
                tabIndex={0}
                className="max-h-[300px] space-y-3 overflow-y-auto pr-2"
              >
                {cartData.data.products.map((product) => (
                  <div
                    key={product._id}
                    className="flex bg-gray-100 rounded-2xl my-2 p-3 items-center justify-between gap-2"
                  >
                    <Image
                      src={product.product.imageCover}
                      alt={product.product.title}
                      className="h-auto w-[15%]"
                      width={80}
                      height={80}
                    />
                    <div className="flex flex-col">
                      <h2>
                        {product.product.title.split(" ").slice(0, 2).join(" ")}
                      </h2>
                      <p>
                        {product.count}x{product.price}
                      </p>
                    </div>
                    <h2 className="font-black">
                      {product.count * product.price} EGP
                    </h2>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2 rounded-xl bg-orange-50 p-4">
                <p className="flex items-center gap-2 text-sm">
                  <Truck className="size-4 text-orange-500" />
                  {remaining > 0
                    ? `Add ${remaining.toLocaleString()} EGP for free shipping`
                    : "Your order qualifies for free shipping"}
                </p>
                <div className="h-2 rounded-full bg-orange-100">
                  <div
                    style={{
                      width: `${Math.min(100, cartData.data.totalCartPrice / 5)}%`,
                    }}
                    className="h-full rounded-full bg-orange-500"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{cartData.data.totalCartPrice} EGP</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{remaining === 0 ? "Free" : "Calculated by store"}</span>
            </div>

            <Separator />
            {discount > 0 && (
              <div className="flex justify-between text-primary">
                <span>Promo discount</span>
                <span>−{discount.toLocaleString()} EGP</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="font-semibold">Total</span>
              <span className="text-2xl font-bold">
                {total.toLocaleString()}{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  EGP
                </span>
              </span>
            </div>

            <Button
              type="button"
              aria-expanded={promoOpen}
              onClick={() => setPromoOpen(!promoOpen)}
              variant="outline"
              className="h-12 w-full border-dashed"
            >
              <Tag />
              Apply Promo Code
            </Button>
            {promoOpen && (
              <div className="space-y-2">
                <label className="text-sm" htmlFor="promo-code">
                  Promo code
                </label>
                <div className="flex gap-2">
                  <input
                    id="promo-code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    disabled={applyingPromo || isSubmitting}
                    maxLength={100}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (promoCode.trim() && !applyingPromo && !isSubmitting)
                          void applyPromo();
                      }
                    }}
                    className="store-input"
                    placeholder="Enter code"
                  />
                  <button
                    type="button"
                    disabled={
                      applyingPromo || isSubmitting || !promoCode.trim()
                    }
                    className="store-button"
                    onClick={applyPromo}
                  >
                    {applyingPromo ? "Applying…" : "Apply"}
                  </button>
                </div>
                <p role="status" className="text-xs text-slate-500">
                  {promoMessage}
                </p>
              </div>
            )}

            {isCheckOut ? (
              <Button
                type="submit"
                size="lg"
                className="h-12 w-full"
                disabled={isSubmitting || applyingPromo}
              >
                <Lock />
                Place Order
              </Button>
            ) : (
              <Button asChild size="lg" className="h-12 w-full">
                <Link href="/checkOut">
                  <Lock />
                  Secure Checkout
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
