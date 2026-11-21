"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { ChevronDown, Headset, Heart, Menu, ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import NavbarLogo from "./navbar-logo";
import NavbarSearch from "./navbar-search";
import { categoryLinks, navLinks } from "./nav-links";

export function NavbarMenu() {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  useEffect(() => {
    if (!isCategoriesOpen) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsCategoriesOpen(false);
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isCategoriesOpen]);

  return (
    <nav
      aria-label="Main navigation"
      className="hidden shrink-0 items-center gap-4 lg:flex"
    >
      {navLinks.map((link) =>
        link.label === "Categories" ? (
          <div className="relative" key={link.href}>
            <button
              aria-expanded={isCategoriesOpen}
              className="inline-flex items-center gap-1 text-sm font-medium text-foreground transition-colors hover:text-primary"
              onClick={() => setIsCategoriesOpen((open) => !open)}
              type="button"
            >
              {link.label}
              <ChevronDown
                aria-hidden="true"
                className={`size-3.5 transition-transform ${isCategoriesOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isCategoriesOpen && (
              <ul className="absolute left-0 top-full z-50 mt-3 min-w-52 rounded-lg border bg-background p-2 shadow-lg">
                {categoryLinks.map((category) => (
                  <li key={category.label}>
                    <Link
                      className="block rounded-md px-3 py-2.5 text-sm text-foreground hover:bg-muted hover:text-primary"
                      href={category.href}
                      onClick={() => setIsCategoriesOpen(false)}
                    >
                      {category.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <Link
            className="inline-flex items-center gap-1 text-sm font-medium text-foreground transition-colors hover:text-primary"
            href={link.href}
            key={link.href}
          >
            {link.label}
          </Link>
        ),
      )}
    </nav>
  );
}

export function MobileNavbarMenu() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  useEffect(() => {
    if (!isMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        setIsCategoriesOpen(false);
      }
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isMenuOpen]);

  function closeMenu() {
    setIsMenuOpen(false);
    setIsCategoriesOpen(false);
  }

  return (
    <>
      <Button
        aria-controls="mobile-navigation"
        aria-expanded={isMenuOpen}
        aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        className="size-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 lg:hidden"
        onClick={() => setIsMenuOpen((open) => !open)}
        size="icon"
        variant="default"
      >
        {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
      </Button>

      {isMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Dismiss menu"
            className="absolute inset-0 size-full cursor-default bg-black/50"
            onClick={closeMenu}
            tabIndex={-1}
            type="button"
          />
          <aside
            aria-label="Mobile navigation"
            aria-modal="true"
            className="absolute inset-y-0 right-0 flex w-[min(88vw,360px)] flex-col overflow-y-auto bg-background shadow-xl sm:w-[min(76vw,400px)]"
            id="mobile-navigation"
            role="dialog"
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b px-4">
              <NavbarLogo />
              <Button
                aria-label="Close menu"
                className="size-9 rounded-full bg-muted text-muted-foreground"
                onClick={closeMenu}
                size="icon"
                variant="ghost"
              >
                <X className="size-5" />
              </Button>
            </div>

            <NavbarSearch mobile onSearch={closeMenu} />

            <nav
              aria-label="Mobile navigation links"
              className="shrink-0 border-b px-4 py-3"
            >
              <ul>
                {navLinks.map((link) =>
                  link.label === "Categories" ? (
                    <li key={link.href}>
                      <button
                        aria-expanded={isCategoriesOpen}
                        className="flex w-full items-center justify-between rounded-lg px-3 py-3.5 text-left text-sm font-medium text-foreground hover:bg-muted"
                        onClick={() => setIsCategoriesOpen((open) => !open)}
                        type="button"
                      >
                        {link.label}
                        <ChevronDown
                          aria-hidden="true"
                          className={`size-4 transition-transform ${isCategoriesOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      {isCategoriesOpen && (
                        <ul className="mb-2 ml-3 border-l pl-3">
                          {categoryLinks.map((category) => (
                            <li key={category.label}>
                              <Link
                                className="block rounded-lg px-3 py-3 text-sm text-muted-foreground hover:bg-muted hover:text-primary"
                                href={category.href}
                                onClick={closeMenu}
                              >
                                {category.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ) : (
                    <li key={link.href}>
                      <Link
                        className="block rounded-lg px-3 py-3.5 text-sm font-medium text-foreground hover:bg-muted"
                        href={link.href}
                        onClick={closeMenu}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </nav>

            <div className="shrink-0 border-b px-4 py-3">
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-foreground hover:bg-muted"
                href="/wishlist"
                onClick={closeMenu}
              >
                <span className="flex size-9 items-center justify-center rounded-full bg-rose-50 text-rose-500">
                  <Heart aria-hidden="true" className="size-[18px]" />
                </span>
                Wishlist
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-foreground hover:bg-muted"
                href="/cart"
                onClick={closeMenu}
              >
                <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ShoppingCart aria-hidden="true" className="size-[18px]" />
                </span>
                Cart
              </Link>
            </div>

            <div className="grid shrink-0 grid-cols-2 gap-3 border-b p-4">
              {status === "authenticated" ? (
                <>
                  <p className="col-span-2 truncate text-sm font-medium">{session.user?.name || "My Account"}</p>
                  <Link href="/profile" className="py-3 text-sm text-primary" onClick={closeMenu}>My Account</Link>
                  <Link href="/allorders" className="py-3 text-sm text-primary" onClick={closeMenu}>My Orders</Link>
                  <Button
                    className="col-span-2 h-12"
                    onClick={() => {
                      closeMenu();
                      void signOut({ callbackUrl: "/" });
                    }}
                    variant="outline"
                  >
                    Sign Out
                  </Button>
                </>
              ) : status === "unauthenticated" ? (
                <>
              <Button asChild className="h-12" variant="default">
                <Link href="/login" onClick={closeMenu}>
                  Sign In
                </Link>
              </Button>
              <Button asChild className="h-12" variant="outline">
                <Link href="/register" onClick={closeMenu}>
                  Sign Up
                </Link>
              </Button>
                </>
              ) : null}
            </div>

            <a
              className="m-4 flex shrink-0 items-center gap-3 rounded-xl border bg-muted/40 p-4 text-sm hover:border-primary/30"
              href="mailto:support@freshcart.com"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Headset aria-hidden="true" className="size-5" />
              </span>
              <span>
                <span className="block font-medium text-foreground">Need Help?</span>
                <span className="text-primary">Contact Support</span>
              </span>
            </a>
          </aside>
        </div>
      )}
    </>
  );
}

