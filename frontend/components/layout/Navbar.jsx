"use client";

import Link from "next/link";
import { useState } from "react";
import {
  FaBars,
  FaPhoneAlt,
  FaSearch,
  FaShoppingCart,
  FaTimes,
  FaWhatsapp,
} from "react-icons/fa";

import Logo from "./Logo";
import { useCart } from "@/context/CartContext";

const menuItems = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "Festival Offers", href: "/offers" },
  { name: "Price List", href: "/price-list" },
  { name: "About Us", href: "/about" },
  { name: "Contact Us", href: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount } = useCart();

  return (
    <nav className="sticky top-0 z-50 border-b border-pink-500/20 bg-black/95 backdrop-blur">
      <div className="container flex min-h-14 items-center justify-between gap-2 py-1 md:min-h-18 md:gap-4">
        <div className="min-w-0 shrink">
          <Logo />
        </div>

        <div className="hidden items-center gap-6 lg:flex">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-semibold text-gray-200 transition hover:text-pink-500"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-2 md:gap-3">
          <Link
            href="/products"
            aria-label="Search products"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-sm transition hover:border-pink-500 hover:text-pink-500 md:h-11 md:w-11"
          >
            <FaSearch />
          </Link>

          <Link
            href="/cart"
            aria-label="Shopping cart"
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-base transition hover:border-pink-500 hover:text-pink-500 md:h-12 md:w-12"
          >
            <FaShoppingCart />

            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-pink-600 px-1 text-xs font-bold text-white">
              {cartCount}
            </span>
          </Link>

          <a
            href="tel:+919600333302"
            className="hidden items-center gap-2 rounded-full border border-pink-500 px-5 py-3 text-sm font-bold text-pink-500 transition hover:bg-pink-500 hover:text-white xl:flex"
          >
            <FaPhoneAlt />
            Call Now
          </a>

          <a
            href="https://wa.me/917010400258"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-full bg-green-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-600 xl:flex"
          >
            <FaWhatsapp className="text-lg" />
            WhatsApp Order
          </a>

          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((current) => !current)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-base transition hover:border-pink-500 hover:text-pink-500 lg:hidden"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-white/10 bg-black px-5 py-5 lg:hidden">
          <div className="flex flex-col gap-1">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg border-b border-white/10 px-2 py-3 font-semibold text-gray-200 transition hover:bg-white/5 hover:text-pink-500"
              >
                {item.name}
              </Link>
            ))}

            <div className="mt-4 grid grid-cols-2 gap-3">
              <a
                href="tel:+919600333302"
                className="flex items-center justify-center gap-2 rounded-xl border border-pink-500 px-3 py-3 text-sm font-bold text-pink-500"
              >
                <FaPhoneAlt />
                Call
              </a>

              <a
                href="https://wa.me/917010400258"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-green-500 px-3 py-3 text-sm font-bold text-white"
              >
                <FaWhatsapp />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
