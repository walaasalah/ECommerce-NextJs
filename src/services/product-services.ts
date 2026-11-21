import { storeApi } from "@/lib/store-api";
import type { ProductInterface } from "@/types/product.Type";
import type { CategoryInterface } from "@/types/category.type";
import type { BrandInterface } from "@/types/brands.type";
import type { SubcategoryInterface } from "@/types/subcategories.type";
export async function getAllProducts(): Promise<ProductInterface[]> {
  const first = await storeApi("products?limit=50&page=1");
  const pageCount = first.metadata?.numberOfPages ?? 1;
  const remaining = await Promise.all(
    Array.from({ length: Math.max(0, pageCount - 1) }, (_, index) =>
      storeApi(`products?limit=50&page=${index + 2}`),
    ),
  );
  return [first, ...remaining].flatMap(page => page.data);
}
export async function getProductDetails(id: string): Promise<ProductInterface> {
  return (await storeApi(`products/${encodeURIComponent(id)}`)).data;
}
export async function getCategories(): Promise<CategoryInterface[]> {
  return (await storeApi("categories")).data;
}
export async function getSubcategories(categoryId: string): Promise<SubcategoryInterface[]> {
  const result = await storeApi(`subcategories?category=${encodeURIComponent(categoryId)}&limit=50`);
  return result.data.filter((subcategory: SubcategoryInterface) => subcategory.category === categoryId);
}
export async function getBrands(): Promise<BrandInterface[]> {
  return (await storeApi("brands?limit=100")).data;
}
