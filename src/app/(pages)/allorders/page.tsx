import { getOrders } from "@/actions/store.actions";
import Image from "next/image";
import Link from "next/link";
import { Package, MapPin } from "lucide-react";
import type { ProductInterface } from "@/types/product.Type";
type Order = {
  _id: string;
  id: number;
  createdAt: string;
  isDelivered: boolean;
  isPaid: boolean;
  paymentMethodType: string;
  totalOrderPrice: number;
  shippingAddress?: { city: string; details: string; phone: string };
  cartItems: {
    _id: string;
    count: number;
    price: number;
    product: ProductInterface;
  }[];
};
export default async function OrdersPage() {
  const result = await getOrders();
  const orders: Order[] = Array.isArray(result) ? result : (result.data ?? []);
  return (
    <section className="store-container py-9">
      <p className="mb-7 text-sm text-slate-500">
        <Link href="/">Home</Link> / My Orders
      </p>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="rounded-2xl bg-primary p-4 text-white">
            <Package />
          </span>
          <div>
            <h1 className="font-heading text-3xl font-bold">My Orders</h1>
            <p className="mt-2 text-sm text-slate-500">
              Track and manage your {orders.length} orders
            </p>
          </div>
        </div>
        <Link href="/product" className="text-sm text-primary">
          Continue Shopping
        </Link>
      </div>
      {orders.length ? (
        <div className="space-y-5">
          {orders.map((order) => (
            <details
              key={order._id}
              className="group overflow-hidden rounded-2xl border bg-white shadow-xs open:border-green-200"
            >
              <summary className="flex cursor-pointer list-none flex-wrap items-center gap-5 p-6">
                <div className="relative size-24 shrink-0 rounded-xl border p-2">
                  {order.cartItems[0]?.product.imageCover && (
                    <Image
                      src={order.cartItems[0].product.imageCover}
                      alt=""
                      fill
                      sizes="96px"
                      className="object-contain p-2"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <span
                    className={`rounded-lg px-3 py-1 text-xs ${order.isDelivered ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-600"}`}
                  >
                    {order.isDelivered ? "Delivered" : "Processing"}
                  </span>
                  <h2 className="mt-3 text-lg font-bold"># {order.id}</h2>
                  <p className="mt-2 text-sm text-slate-500">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      timeZone: "Africa/Cairo",
                    })}{" "}
                    ·{" "}
                    {order.cartItems.reduce((sum, item) => sum + item.count, 0)}{" "}
                    items · {order.shippingAddress?.city}
                  </p>
                  <p className="mt-4 text-2xl font-bold">
                    {order.totalOrderPrice.toLocaleString()}{" "}
                    <span className="text-sm font-normal text-slate-400">
                      EGP
                    </span>
                  </p>
                </div>
                <span className="rounded-xl bg-slate-100 px-4 py-3 text-sm group-open:bg-green-50 group-open:text-primary">
                  Details
                </span>
              </summary>
              <div className="space-y-5 border-t bg-slate-50/50 p-6">
                <h3 className="font-semibold">Order Items</h3>
                {order.cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-4 rounded-xl border bg-white p-4"
                  >
                    <Image
                      src={item.product.imageCover}
                      alt={item.product.title}
                      width={64}
                      height={64}
                      className="size-16 object-contain"
                    />
                    <div className="flex-1">
                      <Link
                        href={`/product/${item.product._id}`}
                        className="text-sm"
                      >
                        {item.product.title}
                      </Link>
                      <p className="mt-2 text-sm text-slate-500">
                        {item.count} × {item.price} EGP
                      </p>
                    </div>
                    <strong className="text-sm">
                      {item.count * item.price} EGP
                    </strong>
                  </div>
                ))}
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="store-panel">
                    <h3 className="mb-4 flex items-center gap-2 font-semibold">
                      <MapPin className="size-4 text-primary" />
                      Delivery Address
                    </h3>
                    <p>{order.shippingAddress?.city}</p>
                    <p className="mt-2 text-sm text-slate-500">
                      {order.shippingAddress?.details}
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                      {order.shippingAddress?.phone}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
                    <h3 className="font-semibold">Order Summary</h3>
                    <p className="mt-4 flex justify-between text-sm">
                      <span>Payment</span>
                      <span>
                        {order.paymentMethodType} ·{" "}
                        {order.isPaid ? "Paid" : "Awaiting payment"}
                      </span>
                    </p>
                    <p className="mt-4 flex justify-between border-t pt-4 font-bold">
                      <span>Total</span>
                      <span>{order.totalOrderPrice.toLocaleString()} EGP</span>
                    </p>
                  </div>
                </div>
              </div>
            </details>
          ))}
        </div>
      ) : (
        <div className="store-empty">
          <Package className="mx-auto mb-5 size-16 text-green-200" />
          <h2>No orders yet</h2>
          <p>Your orders will appear here after checkout.</p>
          <Link href="/product" className="store-button mt-6">
            Start Shopping
          </Link>
        </div>
      )}
    </section>
  );
}
