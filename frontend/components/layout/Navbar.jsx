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
      <div className="container flex min-h-20 items-center justify-between gap-4">
        <Logo />

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

        <div className="flex items-center gap-3">
          <Link
            href="/products"
            aria-label="Search products"
            className="rounded-full border border-white/15 p-3 transition hover:border-pink-500 hover:text-pink-500"
          >
            <FaSearch />
          </Link>

          <Link
            href="/cart"
            aria-label="Shopping cart"
            className="relative rounded-full border border-white/15 p-3 transition hover:border-pink-500 hover:text-pink-500"
          >
            <FaShoppingCart />

            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-pink-600 px-1 text-xs text-white">
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
            className="hidden items-center gap-2 rounded-full bg-green-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-600 sm:flex"
          >
            <FaWhatsapp className="text-lg" />
            WhatsApp Order
          </a>

          <button
            type="button"
            aria-label="Toggle navigation menu"
            onClick={() => setMenuOpen((current) => !current)}
            className="rounded-lg border border-white/15 p-3 lg:hidden"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-white/10 bg-black px-5 py-5 lg:hidden">
          <div className="flex flex-col gap-4">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-white/10 pb-3 font-semibold text-gray-200"
              >
                {item.name}
              </Link>
            ))}

            <a
              href="tel:+919600333302"
              className="flex items-center justify-center gap-2 rounded-lg border border-pink-500 px-5 py-3 font-bold text-pink-500"
            >
              <FaPhoneAlt />
              Call: 96003 33302
            </a>

            <a
              href="https://wa.me/917010400258"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg bg-green-500 px-5 py-3 font-bold text-white"
            >
              <FaWhatsapp />
              WhatsApp Order
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}