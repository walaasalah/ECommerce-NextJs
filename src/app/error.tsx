"use client";
import Link from "next/link";
export default function StoreError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <section className="store-empty">
      <h1>We couldn’t load this page</h1>
      <p>Please check your connection and try again.</p>
      <div className="mt-6 flex justify-center gap-3">
        <button className="store-button" onClick={reset}>
          Try again
        </button>
        <Link className="store-button-outline" href="/">
          Back to home
        </Link>
      </div>
    </section>
  );
}
