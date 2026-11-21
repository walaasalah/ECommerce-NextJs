"use server";
import { storeApi } from "@/lib/store-api";
export async function AddProductToCart(productId: string) {
  return storeApi("cart", {
    version: "v2",
    authenticated: true,
    method: "POST",
    body: { productId },
  });
}
export async function GetLoggedUserCart() {
  return storeApi("cart", { version: "v2", authenticated: true });
}
export async function DeleteProductFrmCart(productId: string) {
  return storeApi(`cart/${encodeURIComponent(productId)}`, {
    version: "v2",
    authenticated: true,
    method: "DELETE",
  });
}
export async function UpdateCartProductcount(productId: string, count: number) {
  if (!Number.isInteger(count) || count < 1)
    throw new Error("Quantity must be a positive whole number.");
  return storeApi(`cart/${encodeURIComponent(productId)}`, {
    version: "v2",
    authenticated: true,
    method: "PUT",
    body: { count },
  });
}
export async function ClearUserCar() {
  return storeApi("cart", {
    version: "v2",
    authenticated: true,
    method: "DELETE",
  });
}
export async function ApplyCartCoupon(couponName: string) {
  const name = couponName.trim();
  if (!name || name.length > 100)
    return { ok: false as const, error: "Enter a valid promo code." };
  try {
    await storeApi("cart/applyCoupon", {
      version: "v2",
      authenticated: true,
      method: "PUT",
      body: { couponName: name },
    });
    return { ok: true as const, cart: await GetLoggedUserCart() };
  } catch (error) {
    return {
      ok: false as const,
      error:
        error instanceof Error
          ? error.message
          : "Could not apply this promo code.",
    };
  }
}
