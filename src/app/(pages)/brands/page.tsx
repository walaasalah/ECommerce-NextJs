import PageHeading from "@/components/common/page-heading";
import { getBrands } from "@/services/product-services";
import Image from "next/image";
import Link from "next/link";
export default async function BrandsPage() {
  const brands = await getBrands();
  return (
    <>
      <PageHeading
        title="Top Brands"
        description="Shop from your favorite brands"
        kind="brands"
      />
      <section className="store-container grid grid-cols-2 gap-5 py-10 sm:grid-cols-4 lg:grid-cols-6">
        {brands.map((b) => (
          <Link
            key={b._id}
            href={`/product?brand=${b._id}`}
            className="rounded-2xl border bg-white p-5 text-center shadow-xs transition-all hover:-translate-y-1 hover:border-purple-300 hover:shadow-lg"
          >
            <div className="rounded-xl bg-slate-50 p-3">
              <Image
                src={b.image}
                alt={b.name}
                width={220}
                height={220}
                className="aspect-square w-full object-contain mix-blend-multiply"
              />
            </div>
            <h2 className="mt-5 mb-3 text-sm font-semibold">{b.name}</h2>
          </Link>
        ))}
      </section>
    </>
  );
}
