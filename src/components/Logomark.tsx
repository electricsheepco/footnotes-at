import Image from "next/image";
import Link from "next/link";

interface LogomarkProps {
  size?: number;
  className?: string;
  linkToHome?: boolean;
}

export function Logomark({ size = 24, className = "", linkToHome = true }: LogomarkProps) {
  const image = (
    <Image
      src="/logomark.png"
      alt="footnotes.at"
      width={size}
      height={size}
      className={className}
    />
  );

  if (linkToHome) {
    return (
      <Link href="/" className="opacity-60 hover:opacity-100 transition-opacity">
        {image}
      </Link>
    );
  }

  return image;
}
