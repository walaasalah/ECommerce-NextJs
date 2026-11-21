"use client";
import Image from "next/image";
import {
  Clock3,
  ShieldCheck,
  Truck,
  LockKeyhole,
  Mail,
  KeyRound,
} from "lucide-react";
import { usePathname } from "next/navigation";
import authImage from "@/asset/auth.png";

const benefits = [
  { label: "Free Delivery", icon: Truck },
  { label: "Secure Payment", icon: ShieldCheck },
  { label: "24/7 Support", icon: Clock3 },
];

export default function StaticAuth() {
  const recovery = usePathname() === "/forget-password";
  if (recovery)
    return (
      <section className="px-4 py-10 text-center">
        <div className="relative flex aspect-[16/10] items-center justify-center gap-5 overflow-hidden rounded-2xl bg-linear-to-br from-green-50 to-slate-50 shadow-lg">
          <span className="absolute top-8 left-8 size-24 rounded-full bg-green-100/60" />
          <span className="absolute right-6 bottom-8 size-28 rounded-full bg-green-100/60" />
          <span className="z-10 -rotate-12 rounded-2xl bg-white p-5 text-primary shadow-lg">
            <Mail />
          </span>
          <span className="z-10 rounded-3xl border-[14px] border-white bg-green-100 p-7 text-primary shadow-xl">
            <LockKeyhole className="size-12" />
          </span>
          <span className="z-10 rotate-12 rounded-2xl bg-white p-5 text-primary shadow-lg">
            <KeyRound />
          </span>
        </div>
        <h2 className="mt-7 font-heading text-3xl font-bold">
          Reset Your Password
        </h2>
        <p className="mt-5 text-lg leading-7 text-slate-500">
          Don’t worry, it happens to the best of us. We’ll help you get back
          into your account in no time.
        </p>
        <div className="mt-7 flex justify-center gap-7 text-sm text-slate-500">
          <span>Email Verification</span>
          <span>Secure Reset</span>
          <span>Encrypted</span>
        </div>
      </section>
    );
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col items-center gap-5 px-4 py-8 text-center sm:py-12">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-card shadow-lg ring-1 ring-border/50">
        <Image
          src={authImage}
          alt="A shopping cart filled with fresh vegetables"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover"
        />
      </div>

      <div className="space-y-3">
        <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          FreshCart - Your One-Stop Shop for Fresh Products
        </h2>
        <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
          Join thousands of happy customers who trust FreshCart for their daily
          grocery needs
        </p>
      </div>

      <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
        {benefits.map(({ label, icon: Icon }) => (
          <li
            key={label}
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <Icon aria-hidden="true" className="size-4 text-primary" />
            <span>{label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
