import { getProductDetails, getAllProducts } from "@/services/product-services";
import ProductDetail from "@/components/products/product-detail";
import ProductCard from "@/components/products/product-card";
import Link from "next/link";
import { notFound } from "next/navigation";
export default async function Details({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!/^[a-f\d]{24}$/i.test(id)) notFound();
  const [product, all] = await Promise.all([
    getProductDetails(id),
    getAllProducts(),
  ]);
  if (!product) notFound();
  return (
    <section className="store-container py-8">
      <nav
        aria-label="Breadcrumb"
        className="mb-8 flex flex-wrap gap-3 text-sm text-slate-500"
      >
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href={`/product?category=${product.category._id}`}>
          {product.category.name}
        </Link>
        <span>/</span>
        <span>{product.title}</span>
      </nav>
      <ProductDetail product={product} />
      <h2 className="section-title mt-16 mb-8">
        You May Also <span>Like</span>
      </h2>
      <div className="product-grid">
        {all
          .filter(
            (p) => p.category._id === product.category._id && p._id !== id,
          )
          .slice(0, 5)
          .map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
      </div>
    </section>
  );
}
