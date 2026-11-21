import Link from "next/link";
import { Layers, Package, Tags, UserRound } from "lucide-react";

export default function PageHeading({ title, description, kind = "products" }: { title: string; description: string; kind?: "products" | "categories" | "brands" | "account" }) {
  const Icon = { products: Package, categories: Layers, brands: Tags, account: UserRound }[kind];
  return <section className={`page-banner ${kind === "brands" ? "page-banner-purple" : ""}`}>
    <div className="store-container"><div className="mb-6 flex items-center gap-3 text-sm text-white/80"><Link href="/" className="hover:underline">Home</Link><span>/</span><span className="text-white">{title}</span></div>
      <div className="flex items-center gap-5"><span className="grid size-16 shrink-0 place-items-center rounded-2xl border border-white/20 bg-white/20"><Icon className="size-8" /></span><div><h1 className="font-heading text-3xl font-bold sm:text-4xl">{title}</h1><p className="mt-1 text-white/90">{description}</p></div></div>
    </div></section>;
}
