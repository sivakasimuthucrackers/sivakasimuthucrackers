"use client";

import Link from "next/link";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "@/context/CartContext";

export default function MobileCartBar() {
  const { cartCount, cartTotal } = useCart();

  if (cartCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-3 right-20 z-[60] md:hidden">
      <Link
        href="/cart"
        className="flex items-center justify-between rounded-2xl border border-pink-400/40 bg-pink-600 px-4 py-3 text-white shadow-2xl"
      >
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
            <FaShoppingCart className="text-lg" />
            <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-yellow-400 px-1 text-xs font-black text-black">
              {cartCount}
            </span>
          </div>

          <div>
            <p className="text-xs font-bold text-white/80">
              {cartCount} {cartCount === 1 ? "Item" : "Items"}
            </p>
            <p className="text-lg font-black">
              ₹{cartTotal.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        <span className="rounded-lg bg-white px-3 py-2 text-xs font-black text-pink-600">
          View Cart
        </span>
      </Link>
    </div>
  );
}
