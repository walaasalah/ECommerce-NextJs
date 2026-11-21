"use server";
import { storeApi } from "@/lib/store-api";
import { GetOurToken } from "@/lib/auth";
import type { CheckoutSchemaType } from "@/lib/schemas/checkout.schema";
import { checkoutSchema } from "@/lib/schemas/checkout.schema";

export async function getWishlist() {
  return (await storeApi("wishlist", { authenticated: true })).data;
}
export async function setWishlist(id: string, saved: boolean) {
  if (!/^[a-f\d]{24}$/i.test(id)) throw new Error("Invalid product.");
  return storeApi(saved ? `wishlist/${id}` : "wishlist", {
    authenticated: true,
    method: saved ? "DELETE" : "POST",
    body: saved ? undefined : { productId: id },
  });
}
export async function getAddresses() {
  return (await storeApi("addresses", { authenticated: true })).data;
}
export async function saveAddress(address: {
  name: string;
  details: string;
  city: string;
  phone: string;
}) {
  checkoutSchema.parse(address);
  if (!address.name.trim()) throw new Error("Please enter an address name.");
  return storeApi("addresses", {
    authenticated: true,
    method: "POST",
    body: address,
  });
}
export async function removeAddress(id: string) {
  return storeApi(`addresses/${encodeURIComponent(id)}`, {
    authenticated: true,
    method: "DELETE",
  });
}
export async function updateProfile(values: {
  name: string;
  email: string;
  phone: string;
}) {
  await storeApi("users/updateMe", {
    authenticated: true,
    method: "PUT",
    body: values,
  });
  return { message: "Profile updated." };
}
export async function updatePassword(values: {
  currentPassword: string;
  password: string;
  rePassword: string;
}) {
  if (values.password.length < 8 || values.password !== values.rePassword)
    throw new Error("Passwords must match and contain at least 8 characters.");
  await storeApi("users/changeMyPassword", {
    authenticated: true,
    method: "PUT",
    body: values,
  });
  return { message: "Password changed. Please sign in again." };
}
export async function passwordRecovery(
  step: "email" | "verify" | "reset",
  values: { email?: string; resetCode?: string; newPassword?: string },
) {
  const routes = {
    email: "forgotPasswords",
    verify: "verifyResetCode",
    reset: "resetPassword",
  };
  const data = await storeApi(`auth/${routes[step]}`, {
    method: step === "reset" ? "PUT" : "POST",
    body: values,
  });
  return { message: data.message ?? "success" };
}
export async function placeOrder(
  cartId: string,
  address: CheckoutSchemaType,
  method: "cash" | "online",
) {
  const shippingAddress = checkoutSchema.parse(address);
  if (!/^[a-f\d]{24}$/i.test(cartId)) throw new Error("Invalid cart.");
  const { headers } = await import("next/headers");
  const requestHeaders = await headers();
  const origin =
    process.env.NEXTAUTH_URL ??
    `${requestHeaders.get("x-forwarded-proto") ?? "http"}://${requestHeaders.get("host")}`;
  const route =
    method === "online"
      ? `orders/checkout-session/${cartId}?url=${encodeURIComponent(origin)}`
      : `orders/${cartId}`;
  const data = await storeApi(route, {
    version: method === "cash" ? "v2" : "v1",
    authenticated: true,
    method: "POST",
    body: { shippingAddress },
  });
  return {
    url: method === "online" ? data.session?.url : undefined,
    success: data.status === "success",
  };
}
export async function getOrders() {
  const token = await GetOurToken();
  const payload = JSON.parse(
    Buffer.from(token.split(".")[1], "base64url").toString(),
  );
  if (!payload.id) throw new Error("Please sign in again.");
  return storeApi(`orders/user/${encodeURIComponent(payload.id)}`, {
    authenticated: true,
  });
}
