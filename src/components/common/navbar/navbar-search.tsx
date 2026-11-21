"use client";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type NavbarSearchProps = {
  className?: string;
  mobile?: boolean;
  onSearch?: () => void;
};

export default function NavbarSearch({
  className,
  mobile = false,
  onSearch,
}: NavbarSearchProps) {
  const router = useRouter();
  return (
    <form
      action="/product"
      method="get"
      onSubmit={event => {
        event.preventDefault();
        const query = String(new FormData(event.currentTarget).get("q") ?? "").trim();
        router.push(query ? `/product?${new URLSearchParams({ q: query })}` : "/product");
        onSearch?.();
      }}
      className={className ?? (mobile ? "shrink-0 border-b p-4" : "flex")}
      role="search"
    >
      <label
        className={`flex w-full items-center overflow-hidden border text-muted-foreground focus-within:ring-2 focus-within:ring-ring ${
          mobile
            ? "h-11 rounded-xl bg-muted/40 pl-3"
            : "h-10 min-w-0 flex-1 rounded-full bg-background pl-4"
        }`}
      >
        <Input
          aria-label="Search products"
          className={`min-w-0 flex-1 border-0 bg-transparent p-0 text-foreground shadow-none focus-visible:ring-0 ${
            "text-sm"
          }`}
          name="q"
          placeholder={mobile ? "Search products..." : "Search for products, brands and more..."}
          type="search"
        />
        <Button
          aria-label="Search"
          className={`mr-1 rounded-lg ${mobile ? "size-8" : "size-8 rounded-full"}`}
          size="icon"
          type="submit"
        >
          <Search aria-hidden="true" className="size-4" />
        </Button>
      </label>
    </form>
  );
}
