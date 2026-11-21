export default function PoliciesPage() {
  return (
    <article className="store-container space-y-8 py-14">
      <h1 className="text-3xl font-bold">Store Policies</h1>
      <section id="privacy" className="store-panel">
        <h2 className="text-xl font-bold">Privacy</h2>
        <p className="mt-4 text-slate-500">
          Account, delivery, and order details are sent to the store service to
          process your requests. Contact support@freshcart.com for questions
          about your account data.
        </p>
      </section>
      <section id="terms" className="store-panel">
        <h2 className="text-xl font-bold">Terms of Service</h2>
        <p className="mt-4 text-slate-500">
          Check current pricing, availability, and your delivery details before
          placing an order. Contact support for assistance with an existing
          purchase.
        </p>
      </section>
      <section id="cookies" className="store-panel">
        <h2 className="text-xl font-bold">Cookies & Local Storage</h2>
        <p className="mt-4 text-slate-500">
          Sign-in uses session cookies. Newsletter preferences are saved in this
          browser. Clearing browser data removes local preferences.
        </p>
      </section>
    </article>
  );
}
