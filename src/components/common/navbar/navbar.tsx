"use client";
import {
  Gift,
  Headset,
  Heart,
  LogOut,
  Mail,
  Phone,
  ShoppingCart,
  Truck,
  UserRound,
  UserPlus,
  CircleUserRound,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/context/WishlistContext";
import { Badge } from "@/components/ui/badge";
import NavbarLogo from "./navbar-logo";
import NavbarSearch from "./navbar-search";
import { MobileNavbarMenu, NavbarMenu } from "./navbar-menu";
import { utilityPromos } from "./nav-links";
import { signOut, useSession } from "next-auth/react";
import { useContext } from "react";
import { Cartcontext } from "@/context/CartContext";

export default function Navbar() {
  const { products: wishlistProducts } = useWishlist();

  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const userName = session?.user?.name || "My Account";
  const noCartItem = useContext(Cartcontext)?.noCartItem ?? 0;

  return (
    <header className="sticky top-0 z-50 bg-background">
      <div className="hidden border-b text-muted-foreground xl:block">
        <div className="store-container flex h-10 items-center justify-between gap-6 text-sm">
          <div className="flex items-center gap-5">
            {utilityPromos.map((promo, index) => (
              <span className="inline-flex items-center gap-1.5" key={promo}>
                {index === 0 ? (
                  <Truck aria-hidden="true" className="size-3.5 text-primary" />
                ) : (
                  <Gift aria-hidden="true" className="size-3.5 text-primary" />
                )}
                {promo}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <a
              className="inline-flex items-center gap-1.5 hover:text-primary"
              href="tel:+18001234567"
            >
              <Phone aria-hidden="true" className="size-3.5" />
              +1 (800) 123-4567
            </a>
            <a
              className="inline-flex items-center gap-1.5 hover:text-primary"
              href="mailto:support@freshcart.com"
            >
              <Mail aria-hidden="true" className="size-3.5" />
              support@freshcart.com
            </a>
            {isAuthenticated ? (
              <>
                <span className="inline-flex items-center gap-1.5 border-l pl-4">
                  <UserRound aria-hidden="true" className="size-3.5" />
                  <span className="max-w-40 truncate">{userName}</span>
                </span>
                <button
                  className="inline-flex items-center gap-1.5 hover:text-primary"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  type="button"
                >
                  <LogOut aria-hidden="true" className="size-3.5" />
                  Sign Out
                </button>
              </>
            ) : status === "unauthenticated" ? (
              <>
                <Link
                  className="inline-flex items-center gap-1.5 border-l pl-4 hover:text-primary"
                  href="/login"
                >
                  <UserRound aria-hidden="true" className="size-3.5" />
                  Sign In
                </Link>
                <Link
                  className="inline-flex items-center gap-1.5 hover:text-primary"
                  href="/register"
                >
                  <UserPlus aria-hidden="true" className="size-3.5" />
                  Sign Up
                </Link>
              </>
            ) : null}
          </div>
        </div>
      </div>

      <div className="border-b">
        <div className="store-container flex h-[60px] items-center gap-2 sm:h-[72px] lg:gap-5">
          <NavbarLogo />
          <NavbarSearch className="hidden min-w-0 flex-1 lg:flex" />
          <NavbarMenu />

          <Link
            className="hidden shrink-0 items-center gap-2 text-[10px] font-medium leading-tight text-muted-foreground hover:text-primary xl:inline-flex"
            href="mailto:support@freshcart.com"
          >
            <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Headset aria-hidden="true" className="size-4" />
            </span>
            <span>
              Support
              <br />
              24/7 Help
            </span>
          </Link>

          <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2 lg:ml-0">
            <Button
              aria-label="Wishlist"
              asChild
              className="size-9 sm:size-10"
              size="icon"
              variant="ghost"
            >
              <Link href="/wishlist" className="relative">
                <Heart aria-hidden="true" className="size-5" />
                {wishlistProducts.length > 0 && (
                  <span className="absolute top-0 right-0 grid size-4 place-items-center rounded-full bg-rose-500 text-[10px] text-white">
                    {wishlistProducts.length}
                  </span>
                )}
              </Link>
            </Button>
            <Button
              aria-label="Shopping cart"
              asChild
              className="size-9 sm:size-10"
              size="icon"
              variant="ghost"
            >
              <Link href="/cart">
                <div className="relative">
                  <ShoppingCart aria-hidden="true" className="size-5" />
                  {noCartItem > 0 && (
                    <Badge
                      variant="default"
                      className="absolute -top-2 -right-2 size-4 justify-center rounded-full p-0 text-[10px]"
                    >
                      {noCartItem}
                    </Badge>
                  )}
                </div>
              </Link>
            </Button>
            <MobileNavbarMenu />
            {isAuthenticated ? (
              <details className="group relative">
                <summary
                  aria-label="My account"
                  className="flex size-9 cursor-pointer list-none items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-primary sm:size-10 [&::-webkit-details-marker]:hidden"
                >
                  <CircleUserRound aria-hidden="true" className="size-5" />
                </summary>
                <div className="absolute right-0 top-full z-50 mt-2 min-w-48 rounded-lg border bg-background p-2 shadow-lg">
                  <p className="max-w-64 truncate px-3 py-2 text-sm font-medium">
                    {userName}
                  </p>
                  <Link
                    href="/profile"
                    className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
                  >
                    My Account
                  </Link>
                  <Link
                    href="/allorders"
                    className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
                  >
                    My Orders
                  </Link>
                  <button
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted hover:text-primary"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    type="button"
                  >
                    <LogOut aria-hidden="true" className="size-4" />
                    Sign Out
                  </button>
                </div>
              </details>
            ) : status === "unauthenticated" ? (
              <Button
                asChild
                className="hidden h-10 rounded-full px-5 shadow-sm lg:inline-flex"
              >
                <Link href="/login">
                  <UserRound aria-hidden="true" className="size-4" />
                  Sign In
                </Link>
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
