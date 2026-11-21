import StaticAuth from "@/components/common/staticAuth";
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="store-container grid items-center gap-10 py-12 lg:max-w-7xl lg:grid-cols-2 lg:py-20">
      <div className="hidden lg:block">
        <StaticAuth />
      </div>
      <div>{children}</div>
    </div>
  );
}
