export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/product" },
  { label: "Categories", href: "/categories" },
  { label: "Brands", href: "/brands" },
] as const;

export const categoryLinks = [
  { label: "All Categories", href: "/categories" },
  { label: "Electronics", href: "/categories/6439d2d167d9aa4ca970649f" },
  { label: "Women's Fashion", href: "/categories/6439d58a0049ad0b52b9003f" },
  { label: "Men's Fashion", href: "/categories/6439d5b90049ad0b52b90048" },
  { label: "Beauty & Health", href: "/categories/6439d30b67d9aa4ca97064b1" },
] as const;

export const utilityPromos = [
  "Free Shipping on Orders 500 EGP",
  "New Arrivals Daily",
] as const;
