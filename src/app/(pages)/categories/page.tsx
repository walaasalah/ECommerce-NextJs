import PageHeading from "@/components/common/page-heading";
import { getCategories } from "@/services/product-services";
import Image from "next/image";
import Link from "next/link";
export default async function CategoriesPage() {
  const categories = await getCategories();
  return (
    <>
      <PageHeading
        title="All Categories"
        description="Browse our wide range of product categories"
        kind="categories"
      />
      <section className="store-container grid grid-cols-2 gap-5 py-10 sm:grid-cols-3 lg:grid-cols-5">
        {categories.map((c) => (
          <Link
            key={c._id}
            href={`/categories/${c._id}`}
            className="group rounded-2xl border bg-white p-5 text-center shadow-xs transition-all hover:-translate-y-1 hover:border-green-300 hover:shadow-lg"
          >
            <Image
              src={c.image}
              alt={c.name}
              width={300}
              height={300}
              className="aspect-square w-full rounded-xl object-cover"
            />
            <h2 className="mt-5 font-semibold group-hover:text-primary">
              {c.name}
            </h2>
            <p className="mt-2 text-xs text-primary">View subcategories</p>
          </Link>
        ))}
      </section>
    </>
  );
}
