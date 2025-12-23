"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function TopRightLogomark() {
  const pathname = usePathname();

  // Don't show on homepage - it's already in the header there
  if (pathname === "/") {
    return null;
  }

  return (
    <Link
      href="/"
      className="fixed top-6 right-6 opacity-40 hover:opacity-100 transition-opacity z-50"
      aria-label="Back to homepage"
    >
      <Image
        src="/logomark.png"
        alt=""
        width={24}
        height={24}
        className="w-6 h-6"
      />
    </Link>
  );
}
