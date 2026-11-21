export default function Loading() {
  return <div role="status" className="store-container py-16"><p className="mb-6 text-slate-500">Loading your FreshCart favorites…</p><div className="grid animate-pulse gap-6 sm:grid-cols-3 lg:grid-cols-5">{[1,2,3,4,5].map(n => <div key={n} className="h-80 rounded-xl bg-slate-100" />)}</div></div>;
}
