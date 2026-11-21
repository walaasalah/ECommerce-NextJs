"use client";

import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { placeOrder } from "@/actions/store.actions";
import { Cartcontext } from "@/context/CartContext";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Banknote,
  Building2,
  CircleCheck,
  CreditCard,
  House,
  Info,
  MapPin,
  Phone,
  ReceiptText,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import type { CartDataInterface } from "@/types/cart.type";
import { GetLoggedUserCart } from "@/actions/Cart.actions";
import {
  checkoutSchema,
  CheckoutSchemaType,
} from "@/lib/schemas/checkout.schema";
import OrderSummary from "@/components/cart/orderSummary";

const paymentOptions = [
  {
    value: "cash",
    title: "Cash on Delivery",
    description: "Pay when your order arrives at your doorstep",
    icon: Banknote,
    activeIcon: "from-emerald-500 to-green-600",
    activeBg: "from-emerald-50 to-green-50",
    showCardBrands: false,
  },
  {
    value: "online",
    title: "Pay Online",
    description: "Secure payment with Credit/Debit Card via Stripe",
    icon: CreditCard,
    activeIcon: "from-emerald-500 to-blue-500",
    activeBg: "from-emerald-50 to-sky-50",
    showCardBrands: true,
  },
] as const;

const cardHeaderClasses =
  "bg-linear-to-r from-emerald-600 to-primary px-6 py-5 text-primary-foreground";

const fieldIconClasses =
  "pointer-events-none absolute left-3 flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground";

// Overrides the default Input look: boxed border, rounded-xl and room for the left icon.
const fieldControlClasses =
  "rounded-xl border-2 border-border bg-background pl-14 focus-visible:border-primary focus-visible:ring-primary/20";

export default function CheckoutPage() {
  const router = useRouter();
  const cartContext = useContext(Cartcontext);
  const [orderError, setOrderError] = useState("");
  const [cartData, setCartData] = useState<CartDataInterface | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "online">("cash");

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<CheckoutSchemaType>({
    mode: "all",
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      city: "",
      details: "",
      phone: "",
    },
  });

  // Runs only when the form is valid (otherwise the field errors show instead).
  async function handleCheckout(values: CheckoutSchemaType) {
    if (!cartData?.data.products.length) return;
    setOrderError("");
    try {
      const result = await placeOrder(
        cartData.cartId ?? cartData.data._id,
        values,
        paymentMethod,
      );
      if (paymentMethod === "online") {
        if (!result.url)
          throw new Error("Could not start payment. Please try again.");
        window.location.assign(result.url);
      } else {
        if (!result.success)
          throw new Error("Could not place order. Please try again.");
        await cartContext?.handleCart();
        toast.success("Order placed successfully");
        router.push("/allorders");
      }
    } catch (e) {
      setOrderError(e instanceof Error ? e.message : "Unable to place order.");
    }
  }

  useEffect(() => {
    async function getCart() {
      try {
        const response: CartDataInterface = await GetLoggedUserCart();
        setCartData(response);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }

    getCart();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <h2 className="text-6xl font-black">Loading .......</h2>
        <Spinner className="size-7" />
      </div>
    );
  }

  if (!cartData) {
    return (
      <p role="alert" className="px-4 py-16 text-center text-muted-foreground">
        Could not load your cart.
      </p>
    );
  }

  if (cartData.data.products.length === 0)
    return (
      <div className="store-empty">
        <h1>Your cart is empty</h1>
        <p>Add products before checking out.</p>
        <Link href="/product" className="store-button mt-6">
          Start Shopping
        </Link>
      </div>
    );

  return (
    <div className="container mx-auto my-6 px-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/cart">Cart</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-bold">Checkout</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="my-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-xl bg-linear-to-br from-emerald-600 to-primary text-primary-foreground">
              <ReceiptText className="size-6" />
            </span>
            <h1 className="font-heading text-3xl font-bold">
              Complete Your Order
            </h1>
          </div>
          <p className="mt-2 text-muted-foreground">
            Review your items and complete your purchase
          </p>
        </div>

        <Link
          href="/cart"
          className="flex items-center gap-2 text-primary hover:underline"
        >
          <ArrowLeft className="size-4" />
          Back to Cart
        </Link>
      </div>

      {orderError && (
        <p
          role="alert"
          className="mb-5 rounded-xl bg-rose-50 p-4 text-rose-600"
        >
          {orderError}
        </p>
      )}
      <form
        onSubmit={handleSubmit(handleCheckout)}
        className="grid grid-cols-12 gap-6"
      >
        {/* Shipping + payment */}
        <div className="col-span-12 space-y-6 lg:col-span-8">
          {/* Shipping address */}
          <Card className="gap-0 overflow-hidden rounded-2xl py-0 shadow-sm">
            <div className={cardHeaderClasses}>
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <House className="size-5" />
                Shipping Address
              </h2>
              <p className="mt-1 text-sm opacity-90">
                Where should we deliver your order?
              </p>
            </div>

            <CardContent className="space-y-5 p-6">
              <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-100">
                  <Info className="size-4 fill-blue-600 text-white" />
                </span>
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    Delivery Information
                  </p>
                  <p className="text-xs text-blue-600">
                    Please ensure your address is accurate for smooth delivery
                  </p>
                </div>
              </div>

              <Controller
                name="city"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name} className="gap-1">
                      City <span className="text-destructive">*</span>
                    </FieldLabel>
                    <div className="relative">
                      <span
                        aria-hidden
                        className={cn(
                          fieldIconClasses,
                          "top-1/2 -translate-y-1/2",
                        )}
                      >
                        <Building2 className="size-4" />
                      </span>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        autoComplete="address-level2"
                        placeholder="e.g. Cairo, Alexandria, Giza"
                        className={cn("h-14", fieldControlClasses)}
                      />
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="details"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name} className="gap-1">
                      Street Address <span className="text-destructive">*</span>
                    </FieldLabel>
                    <div className="relative">
                      <span
                        aria-hidden
                        className={cn(fieldIconClasses, "top-3")}
                      >
                        <MapPin className="size-4" />
                      </span>
                      <textarea
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        rows={3}
                        autoComplete="street-address"
                        placeholder="Street name, building number, floor, apartment..."
                        className={cn(
                          "w-full min-w-0 resize-none py-3.5 pr-3 text-base outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:ring-3 md:text-sm",
                          "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
                          fieldControlClasses,
                        )}
                      />
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="phone"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name} className="gap-1">
                      Phone Number <span className="text-destructive">*</span>
                    </FieldLabel>
                    <div className="relative">
                      <span
                        aria-hidden
                        className={cn(
                          fieldIconClasses,
                          "top-1/2 -translate-y-1/2",
                        )}
                      >
                        <Phone className="size-4" />
                      </span>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel"
                        maxLength={11}
                        placeholder="01xxxxxxxxx"
                        className={cn("h-14 sm:pr-40", fieldControlClasses)}
                      />
                      <span className="pointer-events-none absolute top-1/2 right-4 hidden -translate-y-1/2 text-xs text-muted-foreground sm:block">
                        Egyptian numbers only
                      </span>
                    </div>
                    {/* On small screens the hint sits below the input so it doesn't cover the number. */}
                    <FieldDescription className="text-xs sm:hidden">
                      Egyptian numbers only
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </CardContent>
          </Card>

          {/* Payment method */}
          <Card className="gap-0 overflow-hidden rounded-2xl py-0 shadow-sm">
            <div className={cardHeaderClasses}>
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <Wallet className="size-5" />
                Payment Method
              </h2>
              <p className="mt-1 text-sm opacity-90">
                Choose how you&apos;d like to pay
              </p>
            </div>

            <CardContent className="space-y-4 p-6">
              <fieldset className="space-y-4">
                <legend className="sr-only">Payment method</legend>

                {paymentOptions.map((option) => {
                  const isSelected = option.value === paymentMethod;
                  const Icon = option.icon;

                  return (
                    <label
                      key={option.value}
                      className={cn(
                        "flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-colors has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-primary/30",
                        isSelected
                          ? cn(
                              "border-primary bg-linear-to-r shadow-sm",
                              option.activeBg,
                            )
                          : "border-border hover:border-primary/40 hover:bg-muted/40",
                      )}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={option.value}
                        checked={isSelected}
                        onChange={() => setPaymentMethod(option.value)}
                        className="sr-only"
                      />

                      <span
                        className={cn(
                          "flex size-14 shrink-0 items-center justify-center rounded-xl transition-colors",
                          isSelected
                            ? cn(
                                "bg-linear-to-br text-white shadow-md",
                                option.activeIcon,
                              )
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        <Icon className="size-6" />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span
                          className={cn(
                            "block text-base font-semibold",
                            isSelected && "text-primary",
                          )}
                        >
                          {option.title}
                        </span>
                        <span className="block text-sm text-muted-foreground">
                          {option.description}
                        </span>

                        {option.showCardBrands && (
                          <span
                            aria-hidden
                            className="mt-2 flex items-center gap-1.5"
                          >
                            <span className="flex h-4 items-center rounded-sm bg-blue-800 px-1 text-[8px] font-black text-white italic">
                              VISA
                            </span>
                            <span className="flex h-4 items-center rounded-sm bg-slate-800 px-1">
                              <span className="size-2.5 rounded-full bg-red-500" />
                              <span className="-ml-1 size-2.5 rounded-full bg-amber-400/90" />
                            </span>
                            <span className="flex h-4 items-center rounded-sm bg-sky-600 px-1 text-[7px] font-bold text-white">
                              AMEX
                            </span>
                          </span>
                        )}
                      </span>

                      {isSelected ? (
                        <CircleCheck className="size-7 shrink-0 fill-primary text-white" />
                      ) : (
                        <span className="size-6 shrink-0 rounded-full border-2 border-border" />
                      )}
                    </label>
                  );
                })}
              </fieldset>

              <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                  <ShieldCheck className="size-5 text-primary" />
                </span>
                <div>
                  <p className="text-sm font-medium">Secure &amp; Encrypted</p>
                  <p className="text-xs text-primary">
                    Your payment info is protected with 256-bit SSL encryption
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order summary */}
        <OrderSummary
          cartData={cartData}
          onCartUpdate={setCartData}
          isCheckOut
          isSubmitting={isSubmitting}
        />
      </form>
    </div>
  );
}
