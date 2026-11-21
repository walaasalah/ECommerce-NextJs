"use client";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  PackageOpen,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import CartItem from "@/components/cart/cartItem";
import OrderSummary from "@/components/cart/orderSummary";
import { ClearUserCar, GetLoggedUserCart } from "@/actions/Cart.actions";
import { useContext, useEffect, useState } from "react";
import { CartDataInterface } from "@/types/cart.type";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { Cartcontext } from "@/context/CartContext";

export default function CartPage() {
  const [clearing, setClearing] = useState(false);
  const [cartError, setCartError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cartData, setCartData] = useState<CartDataInterface | null>(null);
  const { handleCart } = useContext(Cartcontext)!;
  const noCartItem = useContext(Cartcontext)?.noCartItem ?? 0;
  useEffect(() => {
    let active = true;
    GetLoggedUserCart()
      .then((res: CartDataInterface) => {
        if (active) setCartData(res);
      })
      .catch(() => {
        if (active) setCartError(true);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function ClearAllCart() {
    setClearing(true);
    try {
      const res = await ClearUserCar();
      setCartData(null);
      toast.success(res.message);
      handleCart();
    } catch (error) {
      toast.error("Error in Clear Cart");
    } finally {
      setClearing(false);
    }
  }

  if (isLoading) {
    return (
      <>
        <div className="flex h-screen flex-col  justify-center items-center">
          <h2 className="text-6xl font-black">Loading....</h2>
          <Spinner className="size-7" />
        </div>
      </>
    );
  }

  if (cartError) {
    return (
      <p role="alert" className="px-4 py-16 text-center text-muted-foreground">
        Could not load your cart.
      </p>
    );
  }

  if (!cartData || cartData.data.products.length === 0) {
    return (
      <section
        aria-labelledby="empty-cart-title"
        className="mx-auto flex w-full max-w-md flex-col items-center px-4 py-8 text-center"
      >
        <div className="flex size-24 items-center justify-center rounded-full bg-muted text-muted-foreground/45">
          <PackageOpen aria-hidden="true" className="size-10" />
        </div>
        <h1
          id="empty-cart-title"
          className="mt-6 font-heading text-xl font-bold"
        >
          Your cart is empty
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Looks like you haven&apos;t added anything to your cart yet.
          <br />
          Start exploring our products!
        </p>
        <Button
          asChild
          className="mt-6 rounded-lg px-6 font-semibold shadow-md shadow-primary/20"
        >
          <Link href="/product">
            Start Shopping <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
        <div className="mt-9 w-full max-w-xs border-t border-border pt-5">
          <h2 className="text-xs text-muted-foreground">Popular Categories</h2>
          <ul className="mt-3 flex flex-wrap justify-center gap-2">
            {["Electronics", "Fashion", "Home", "Beauty"].map((category) => (
              <li
                key={category}
                className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
              >
                {category}
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  return (
    <div className="container mx-auto my-6 px-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-bold">Shopping Cart</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="my-6">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <ShoppingCart className="size-6" />
          </span>
          <h1 className="font-heading text-3xl font-bold">Shopping Cart</h1>
        </div>
        <p className="mt-2 text-muted-foreground">
          You have{" "}
          <span className="font-semibold text-primary">{noCartItem} item</span>{" "}
          in your cart
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Cart items */}
        <div className="col-span-12 space-y-4 lg:col-span-8">
          {cartData.data.products.map((product) => (
            <CartItem
              key={product._id}
              product={product}
              setCartData={setCartData}
            />
          ))}

          <Separator />

          <div className="flex items-center justify-between">
            <Link
              href="/product"
              className="flex items-center gap-2 text-primary hover:underline"
            >
              <ArrowLeft className="size-4" />
              Continue Shopping
            </Link>
            <Button
              variant="ghost"
              disabled={clearing}
              className="text-muted-foreground"
              onClick={() => ClearAllCart()}
            >
              <Trash2 />
              Clear all items
            </Button>
          </div>
        </div>

        {/* Order summary */}
        <OrderSummary cartData={cartData} onCartUpdate={setCartData} />
      </div>
    </div>
  );
}
