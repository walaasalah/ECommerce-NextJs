export default function HelpPage() {
  return (
    <article className="store-container space-y-8 py-14">
      <h1 className="text-3xl font-bold">How can we help?</h1>
      <section id="shipping" className="store-panel">
        <h2 className="text-xl font-bold">Shipping & Delivery</h2>
        <p className="mt-4 text-slate-500">
          Free shipping on orders over 500 EGP. Review your shipping details at
          checkout and track your purchase from My Orders.
        </p>
      </section>
      <section id="returns" className="store-panel">
        <h2 className="text-xl font-bold">Returns & Refunds</h2>
        <p className="mt-4 text-slate-500">
          Contact our support team within 14 days for help returning an item.
          Include your order number and the item you wish to return.
        </p>
      </section>
      <section className="store-panel">
        <h2 className="text-xl font-bold">Contact Support</h2>
        <a
          className="mt-4 inline-block text-primary"
          href="mailto:support@freshcart.com"
        >
          support@freshcart.com
        </a>
      </section>
    </article>
  );
}
