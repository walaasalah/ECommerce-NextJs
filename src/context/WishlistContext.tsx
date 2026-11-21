"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useSession } from "next-auth/react";
import { getWishlist, setWishlist } from "@/actions/store.actions";
import { ProductInterface } from "@/types/product.Type";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const WishlistContext = createContext<{
  products: ProductInterface[];
  loading: boolean;
  error: string;
  toggle(product: ProductInterface): Promise<void>;
  refresh(): Promise<void>;
} | null>(null);
export const useWishlist = () => useContext(WishlistContext)!;
export default function WishlistProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<ProductInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const refresh = useCallback(async () => {
    if (status !== "authenticated") {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      setProducts(await getWishlist());
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load wishlist.");
    } finally {
      setLoading(false);
    }
  }, [status]);
  useEffect(() => {
    void refresh();
  }, [refresh]);
  async function toggle(product: ProductInterface) {
    if (status !== "authenticated") {
      router.push("/login");
      return;
    }
    const saved = products.some((item) => item._id === product._id);
    await setWishlist(product._id, saved);
    setProducts((items) =>
      saved
        ? items.filter((item) => item._id !== product._id)
        : [...items, product],
    );
    toast.success(saved ? "Removed from wishlist" : "Added to wishlist");
  }
  return (
    <WishlistContext.Provider
      value={{ products, loading, error, toggle, refresh }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
