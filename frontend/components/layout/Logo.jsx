import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      aria-label="Sivakasi Muthu Crackers Home"
      className="flex items-center"
    >
      <Image
        src="/images/logo/logo-en.jpeg"
        alt="Sivakasi Muthu Crackers"
        width={220}
        height={80}
        priority
        className="h-16 w-auto object-contain md:h-20"
      />
    </Link>
  );
}