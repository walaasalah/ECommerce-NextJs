import Link from "next/link";
import Image from "next/image";
import logo from "@/asset/freshcart-logo.svg";
import {
  Headset,
  Mail,
  MapPin,
  Phone,
  RotateCcw,
  ShieldCheck,
  Truck,
} from "lucide-react";

export function Benefits({ cards = false }: { cards?: boolean }) {
  const benefits = [
    { icon: Truck, title: "Free Shipping", text: "On orders over 500 EGP" },
    { icon: RotateCcw, title: "Easy Returns", text: "14-day return policy" },
    {
      icon: ShieldCheck,
      title: "Secure Payment",
      text: "100% secure checkout",
    },
    { icon: Headset, title: "24/7 Support", text: "Contact us anytime" },
  ];
  return (
    <section
      className={
        cards
          ? "bg-slate-50 py-7"
          : "border-t border-green-100 bg-green-50 py-6"
      }
    >
      <div className="store-container grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className={`flex items-center gap-3 ${cards ? "rounded-xl border bg-white p-4 shadow-xs" : ""}`}
          >
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-green-100 text-primary">
              <Icon className="size-5" />
            </span>
            <div>
              <p className="text-sm font-semibold">{title}</p>
              <p className="text-sm text-slate-500">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
export default function Footer() {
  const groups = [
    {
      title: "Shop",
      links: [
        ["All Products", "/product"],
        ["Categories", "/categories"],
        ["Brands", "/brands"],
        ["Electronics", "/product?q=electronics"],
        ["Men’s Fashion", "/product?q=men%27s"],
        ["Women’s Fashion", "/product?q=women%27s"],
      ],
    },
    {
      title: "Account",
      links: [
        ["My Account", "/profile"],
        ["Order History", "/allorders"],
        ["Wishlist", "/wishlist"],
        ["Shopping Cart", "/cart"],
        ["Sign In", "/login"],
        ["Create Account", "/register"],
      ],
    },
    {
      title: "Support",
      links: [
        ["Contact Us", "mailto:support@freshcart.com"],
        ["Help Center", "/help"],
        ["Shipping Info", "/help#shipping"],
        ["Returns & Refunds", "/help#returns"],
        ["Track Order", "/allorders"],
      ],
    },
    {
      title: "Legal",
      links: [
        ["Privacy Policy", "/policies#privacy"],
        ["Terms of Service", "/policies#terms"],
        ["Cookie Policy", "/policies#cookies"],
      ],
    },
  ];
  return (
    <>
      <Benefits />
      <footer className="bg-[#101827] text-slate-400">
        <div className="store-container grid gap-9 py-12 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              className="inline-flex rounded-lg bg-white px-4 py-2"
            >
              <Image src={logo} alt="FreshCart" width={165} height={32} />
            </Link>
            <p className="mt-7 max-w-md text-sm leading-6">
              FreshCart is your one-stop destination for quality products. From
              fashion to electronics, we bring you the best brands at
              competitive prices with a seamless shopping experience.
            </p>
            <div className="mt-6 space-y-3 text-sm">
              <a href="tel:+18001234567" className="flex items-center gap-3">
                <Phone className="size-4 text-primary" />
                +1 (800) 123-4567
              </a>
              <a
                href="mailto:support@freshcart.com"
                className="flex items-center gap-3"
              >
                <Mail className="size-4 text-primary" />
                support@freshcart.com
              </a>
              <p className="flex gap-3">
                <MapPin className="size-4 shrink-0 text-primary" />
                123 Commerce Street, New York, NY 10001
              </p>
            </div>
          </div>
          {groups.map((group) => (
            <div key={group.title}>
              <h2 className="mb-7 font-semibold text-white">{group.title}</h2>
              <ul className="space-y-4 text-sm">
                {group.links.map(([title, href]) => (
                  <li key={title}>
                    <Link
                      className="transition-colors hover:text-white"
                      href={href}
                    >
                      {title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10">
          <div className="store-container flex flex-wrap justify-between gap-4 py-6 text-sm">
            <p>© 2026 FreshCart. All rights reserved.</p>
            <p>▣ Visa　 ▣ Mastercard　 ▣ PayPal</p>
          </div>
        </div>
      </footer>
    </>
  );
}
