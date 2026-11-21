"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Star } from "lucide-react";
import {
  createProductReview,
  getProductReviews,
} from "@/actions/reviews.actions";
import type { ProductReviewPage } from "@/types/review.type";

export default function ProductReviews({ productId }: { productId: string }) {
  const { status } = useSession();
  const [page, setPage] = useState(1);
  const [refresh, setRefresh] = useState(0);
  const [reviews, setReviews] = useState<ProductReviewPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    getProductReviews(productId, page)
      .then((data) => {
        if (active) setReviews(data);
      })
      .catch(() => {
        if (active)
          setError("Could not load customer reviews. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [productId, page, refresh]);
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-foreground">
        Customer Reviews
      </h2>
      {loading ? (
        <p role="status">Loading reviews…</p>
      ) : error ? (
        <div role="alert">
          <p>{error}</p>
          <button
            className="store-button mt-3"
            onClick={() => setRefresh((value) => value + 1)}
          >
            Try again
          </button>
        </div>
      ) : reviews?.data.length ? (
        <>
          <p>{reviews.results} customer reviews</p>
          <div className="divide-y">
            {reviews.data.map((review) => (
              <article key={review._id} className="py-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-medium text-foreground">
                    {review.user?.name ?? "FreshCart customer"}
                  </h3>
                  <time className="text-xs" dateTime={review.createdAt}>
                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                      timeZone: "Africa/Cairo",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                </div>
                <div
                  aria-label={`${review.rating} out of 5 stars`}
                  className="mt-2 flex text-amber-400"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      className={`size-4 ${n <= review.rating ? "fill-current" : ""}`}
                    />
                  ))}
                </div>
                <p className="mt-3 whitespace-pre-wrap break-words">
                  {review.review}
                </p>
              </article>
            ))}
          </div>
          {reviews.metadata.numberOfPages > 1 && (
            <div className="flex flex-wrap items-center gap-4">
              <button
                className="store-button-outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>
              <span>
                Page {page} of {reviews.metadata.numberOfPages}
              </span>
              <button
                className="store-button-outline"
                disabled={page >= reviews.metadata.numberOfPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <p>No reviews yet. Share your experience with this product.</p>
      )}
      {status === "authenticated" ? (
        <form
          className="space-y-4 border-t pt-6"
          onSubmit={async (event) => {
            event.preventDefault();
            const form = event.currentTarget;
            const values = new FormData(form);
            setSubmitting(true);
            setMessage("");
            try {
              const result = await createProductReview(productId, {
                review: String(values.get("review")),
                rating: Number(values.get("rating")),
              });
              if (!result.ok) {
                setMessage(result.error);
                return;
              }
              form.reset();
              setMessage("Thank you! Your review has been submitted.");
              setPage(1);
              setRefresh((value) => value + 1);
            } catch {
              setMessage("Could not submit your review. Please try again.");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <h3 className="font-semibold text-foreground">Write a Review</h3>
          <label className="block">
            Your Rating
            <select
              name="rating"
              required
              defaultValue="5"
              className="store-input mt-2 max-w-52"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option value={n} key={n}>
                  {n} {n === 1 ? "star" : "stars"}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            Your Review
            <textarea
              name="review"
              required
              maxLength={2000}
              rows={4}
              className="store-input mt-2"
              placeholder="Tell other shoppers about your experience"
            />
          </label>
          <button type="submit" disabled={submitting} className="store-button">
            {submitting ? "Submitting…" : "Submit Review"}
          </button>
          <p role="status">{message}</p>
        </form>
      ) : status === "unauthenticated" ? (
        <p className="border-t pt-5">
          <Link href="/login" className="font-medium text-primary">
            Sign in
          </Link>{" "}
          to write a review.
        </p>
      ) : null}
    </div>
  );
}
