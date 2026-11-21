import PageHeading from "@/components/common/page-heading";
import Catalog from "@/components/products/catalog";
import { getAllProducts } from "@/services/product-services";
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    brand?: string;
    deals?: string;
    subcategory?: string;
  }>;
}) {
  const params = await searchParams;
  const products = await getAllProducts();
  return (
    <>
      <PageHeading
        title={params.q ? "Search Results" : "All Products"}
        description={
          params.q
            ? `Find your favorites for ${params.q}`
            : "Explore our complete product collection"
        }
      />
      <Catalog
        key={JSON.stringify(params)}
        products={products}
        initialQuery={params.q}
        category={params.category}
        subcategory={params.subcategory}
        brand={params.brand}
        deals={params.deals === "true"}
      />
    </>
  );
}
