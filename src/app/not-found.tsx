import Link from "next/link";
export default function NotFound() { return <section className="store-empty"><p className="mb-3 text-6xl font-bold text-primary">404</p><h1>Page not found</h1><p>Let’s get you back to something fresh.</p><Link href="/product" className="store-button mt-6">Browse products</Link></section>; }
