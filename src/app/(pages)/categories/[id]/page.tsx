import { getCategories, getAllProducts, getSubcategories } from "@/services/product-services";
import PageHeading from "@/components/common/page-heading";
import Catalog from "@/components/products/catalog";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { SubcategoryInterface } from "@/types/subcategories.type";
export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ subcategory?: string }>;
}) {
  const { id } = await params;
  if (!/^[a-f\d]{24}$/i.test(id)) notFound();
  const { subcategory = "" } = await searchParams;
  const [categories, products, subcategories] = await Promise.all([
    getCategories(),
    getAllProducts(),
    getSubcategories(id),
  ]);
  const category = categories.find((c) => c._id === id);
  if (!category) notFound();
  return (
    <>
      <PageHeading
        title={category.name}
        description="Explore this category and its collections"
        kind="categories"
      />
      <div className="store-container flex flex-wrap gap-3 pt-8">
        <Link href={`/categories/${id}`} aria-current={!subcategory ? "page" : undefined} className={`rounded-full border px-4 py-2 text-sm ${!subcategory ? "bg-primary text-white" : "bg-white text-green-800"}`}>All products</Link>
        {subcategories.map((s: SubcategoryInterface) => (
          <Link
            key={s._id}
            href={`/categories/${id}?subcategory=${s._id}`}
            aria-current={subcategory === s._id ? "page" : undefined}
            className={`rounded-full border px-4 py-2 text-sm ${subcategory === s._id ? "bg-primary text-white" : "bg-green-50 text-green-800 hover:bg-green-100"}`}
          >
            {s.name}
          </Link>
        ))}
      </div>
      <Catalog key={`${id}:${subcategory}`} products={products} category={id} subcategory={subcategory} />
    </>
  );
}
