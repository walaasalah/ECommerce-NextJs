"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    title: "Fresh Products Delivered to your Door",
    text: "Get 20% off your first order",
    href: "/product",
  },
  {
    title: "Your Favorite Brands, All in One Place",
    text: "Discover quality essentials for every day",
    href: "/brands",
  },
  {
    title: "Great Finds. Even Better Prices.",
    text: "Explore the latest offers across our collection",
    href: "/product?deals=true",
  },
];
export default function Hero() {
  const [active, setActive] = useState(0);
  return (
    <section
      aria-label="Featured offers"
      aria-roledescription="carousel"
      className="relative isolate flex min-h-80 items-center overflow-hidden bg-green-600 py-20 text-white sm:min-h-[400px]"
    >
      <Image
        src="/images/fresh-produce.jpg"
        alt="Fresh vegetables and groceries"
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-center"
      />
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-green-500/80 to-emerald-700/10" />
      <div className="store-container">
        <div className="max-w-sm" aria-live="polite">
          <h1 className="font-heading text-3xl leading-tight font-bold sm:text-4xl">
            {slides[active].title}
          </h1>
          <p className="mt-5">{slides[active].text}</p>
          <div className="mt-5 flex gap-3">
            <Link
              className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-primary"
              href={slides[active].href}
            >
              Shop Now
            </Link>
            <Link
              className="rounded-lg border border-white/80 px-6 py-3 text-sm font-semibold"
              href="/product?deals=true"
            >
              View Deals
            </Link>
          </div>
        </div>
      </div>
      <button
        aria-label="Previous offer"
        className="absolute left-3 hidden size-11 place-items-center rounded-full bg-white/90 text-primary sm:grid"
        onClick={() => setActive((active + 2) % 3)}
      >
        <ChevronLeft />
      </button>
      <button
        aria-label="Next offer"
        className="absolute right-3 hidden size-11 place-items-center rounded-full bg-white/90 text-primary sm:grid"
        onClick={() => setActive((active + 1) % 3)}
      >
        <ChevronRight />
      </button>
      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((s, i) => (
          <button
            key={s.title}
            aria-label={`Show offer ${i + 1}`}
            aria-current={active === i}
            onClick={() => setActive(i)}
            className={`h-2.5 rounded-full ${i === active ? "w-8 bg-white" : "w-2.5 bg-white/50"}`}
          />
        ))}
      </div>
    </section>
  );
}
