"use client";
import { useState } from "react";
import { Mail, Leaf, Tag, Truck } from "lucide-react";

export default function Newsletter() {
  const [saved, setSaved] = useState(false);
  return (
    <section className="store-container py-16">
      <div className="grid gap-10 rounded-3xl border border-emerald-100 bg-linear-to-br from-slate-50 via-white to-rose-50 p-6 sm:p-12 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <div className="flex items-center gap-4">
            <span className="grid size-14 place-items-center rounded-2xl bg-emerald-500 text-white">
              <Mail />
            </span>
            <p className="text-sm font-semibold text-emerald-600">
              NEWSLETTER
              <br />
              <span className="text-xs font-normal text-slate-500">
                Fresh offers, straight to your inbox
              </span>
            </p>
          </div>
          <h2 className="mt-7 font-heading text-3xl font-bold">
            Get the Freshest Updates{" "}
            <span className="text-emerald-600">Delivered Free</span>
          </h2>
          <p className="mt-4 text-slate-500">
            Weekly recipes, seasonal offers &amp; exclusive member perks.
          </p>
          <div className="my-6 flex flex-wrap gap-3">
            {[
              [Leaf, "Fresh Picks Weekly"],
              [Truck, "Free Delivery Codes"],
              [Tag, "Members-Only Deals"],
            ].map(([Icon, label]) => {
              const ItemIcon = Icon as typeof Leaf;
              return (
                <span
                  key={String(label)}
                  className="flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-3 py-2 text-xs"
                >
                  <ItemIcon className="size-4 text-emerald-500" />
                  {String(label)}
                </span>
              );
            })}
          </div>
          <form
            className="flex flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              const form = new FormData(e.currentTarget);
              localStorage.setItem(
                "freshcart-newsletter",
                String(form.get("email")),
              );
              setSaved(true);
            }}
          >
            <input
              name="email"
              type="email"
              required
              aria-label="Newsletter email"
              placeholder="you@example.com"
              className="store-input flex-1"
            />
            <button className="store-button" type="submit">
              Save subscription
            </button>
          </form>
          <p role="status" className="mt-3 text-xs text-slate-500">
            {saved
              ? "Your email preference is saved on this device. Email delivery is not connected yet."
              : "Unsubscribe anytime. No spam, ever."}
          </p>
        </div>
        <div className="rounded-3xl bg-linear-to-br from-slate-900 to-slate-700 p-8 text-white">
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
            MOBILE APP
          </span>
          <h3 className="mt-7 font-heading text-2xl font-bold">
            Shop Faster on Our App
          </h3>
          <p className="mt-4 text-sm leading-6 text-slate-400">
            Your favorite products, wherever you are.
          </p>
          <div className="mt-7 space-y-3">
            <p className="rounded-xl border border-white/10 bg-white/10 p-4 text-sm">
              App Store · Coming soon
            </p>
            <p className="rounded-xl border border-white/10 bg-white/10 p-4 text-sm">
              Google Play · Coming soon
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
