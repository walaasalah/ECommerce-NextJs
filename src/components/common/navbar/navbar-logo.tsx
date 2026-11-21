import Image from "next/image";
import Link from "next/link";
import freshCartLogo from "@/asset/freshcart-logo.svg";

export default function NavbarLogo() {
  return (
    <Link
      aria-label="FreshCart home"
      className="flex shrink-0 items-center"
      href="/"
    >
      <Image
        alt="FreshCart"
        className="h-auto w-[140px] sm:w-[160px]"
        priority
        src={freshCartLogo}
      />
    </Link>
  );
}
