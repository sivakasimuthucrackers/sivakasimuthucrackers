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
    <div className="fixed bottom-2 left-1/2 z-[70] w-[92%] max-w-[420px] -translate-x-1/2 md:hidden">
      <Link
        href="/cart"
        className="flex h-12 items-center justify-between rounded-2xl border border-pink-400/40 bg-pink-600 px-3 text-white shadow-2xl"
      >
        <div className="flex min-w-0 items-center gap-2">
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20">
            <FaShoppingCart className="text-sm" />

            <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-yellow-400 px-1 text-[10px] font-black text-black">
              {cartCount}
            </span>
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-bold text-white/80">
              {cartCount} {cartCount === 1 ? "Item" : "Items"}
            </p>

            <p className="text-sm font-black">
              ₹{Number(cartTotal || 0).toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        <span className="shrink-0 rounded-lg bg-white px-3 py-1.5 text-xs font-black text-pink-600">
          View Cart
        </span>
      </Link>
    </div>
  );
}
