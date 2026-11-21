"use client";
import { useContext, useState } from "react";
import { Plus, ShoppingCart } from "lucide-react";
import { AddProductToCart } from "@/actions/Cart.actions";
import { Cartcontext } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
export default function AddToCartButton({
  productId,
  compact = false,
  disabled = false,
}: {
  productId: string;
  compact?: boolean;
  disabled?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const context = useContext(Cartcontext);
  const router = useRouter();
  const { status } = useSession();
  return (
    <button
      type="button"
      aria-label="Add to cart"
      disabled={busy || disabled}
      aria-busy={busy}
      className={
        compact
          ? "grid size-10 shrink-0 place-items-center rounded-full bg-primary text-white hover:bg-green-700 disabled:opacity-50"
          : "store-button w-full"
      }
      onClick={async () => {
        if (status !== "authenticated") {
          router.push("/login");
          return;
        }
        setBusy(true);
        try {
          const result = await AddProductToCart(productId);
          if (result.status !== "success")
            throw new Error(result.message || "Unable to add product");
          toast.success("Added to cart");
          await context?.handleCart();
        } catch (e) {
          toast.error(e instanceof Error ? e.message : "Unable to add product");
        } finally {
          setBusy(false);
        }
      }}
    >
      {busy ? (
        <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
      ) : compact ? (
        <Plus className="size-5" />
      ) : (
        <>
          <ShoppingCart className="size-4" />
          Add to cart
        </>
      )}
    </button>
  );
}
