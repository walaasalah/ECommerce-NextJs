"use server";
import { storeApi } from "@/lib/store-api";
import type { ProductReviewPage } from "@/types/review.type";

export async function getProductReviews(
  productId: string,
  page = 1,
): Promise<ProductReviewPage> {
  if (!/^[a-f\d]{24}$/i.test(productId) || !Number.isInteger(page) || page < 1)
    throw new Error("Invalid review request.");
  return storeApi(`products/${productId}/reviews?page=${page}&limit=10`);
}
export async function createProductReview(
  productId: string,
  values: { review: string; rating: number },
) {
  if (!/^[a-f\d]{24}$/i.test(productId))
    return { ok: false as const, error: "Invalid product." };
  const review = values.review.trim();
  if (
    !review ||
    review.length > 2000 ||
    !Number.isInteger(values.rating) ||
    values.rating < 1 ||
    values.rating > 5
  )
    return {
      ok: false as const,
      error: "Enter a review and a rating from 1 to 5.",
    };
  try {
    await storeApi(`products/${productId}/reviews`, {
      authenticated: true,
      method: "POST",
      body: { review, rating: values.rating },
    });
    return { ok: true as const };
  } catch (error) {
    return {
      ok: false as const,
      error:
        error instanceof Error
          ? error.message
          : "Could not submit your review.",
    };
  }
}
