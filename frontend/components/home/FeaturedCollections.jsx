"use client";

import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

const collections = [
  {
    name: "Gift Boxes",
    image: "/images/hero-products/gift-box.png",
    category: "GIFT BOX",
  },
  {
    name: "Rockets",
    image: "/images/hero-products/rocket.png",
    category: "ROCKETS",
  },
  {
    name: "Sparklers",
    image: "/images/hero-products/sparkler.png",
    category: "SPARKLERS",
  },
  {
    name: "Flower Pots",
    image: "/images/hero-products/flower-pot.png",
    category: "FLOWER POTS",
  },
  {
    name: "Bombs",
    image: "/images/hero-products/bomb.png",
    category: "BOMBS",
  },
  {
    name: "Mega Shots",
    image: "/images/hero-products/mega-shot.png",
    category: "MEGA JUMPERS / MULTI COLOUR SHOTS",
  },
  {
    name: "Kids Packs",
    image: "/images/hero-products/kids-pack.png",
    category: "KIDS CRACKERS",
  },
  {
    name: "Combo Packs",
    image: "/images/hero-products/combo-pack.png",
    category: "FESTIVAL COMBOS",
  },
  {
    name: "Fancy Items",
    image: "/images/hero-products/fancy-item.png",
    category: "FANCY ITEMS",
  },
  {
    name: "Festival Packs",
    image: "/images/hero-products/festival-pack.png",
    category: "FAMILY PACK",
  },
];

export default function FeaturedCollections() {
  return (
    <section className="relative overflow-hidden bg-[#0b0b0b] py-16 text-white md:py-20">
      <div className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-pink-600/15 blur-3xl" />
      <div className="absolute -right-24 bottom-8 h-80 w-80 rounded-full bg-orange-500/15 blur-3xl" />

      <div className="container relative z-10 mx-auto px-5">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-pink-500/30 bg-pink-500/10 px-5 py-2 text-xs font-black uppercase tracking-[3px] text-pink-400">
            Featured Collections
          </span>

          <h2 className="mt-5 text-3xl font-black md:text-5xl">
            Find Your Favourite{" "}
            <span className="bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
              Crackers
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-400 md:text-base">
            Explore popular Sivakasi cracker collections for family celebrations,
            kids, gifting and festival orders.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {collections.map((item, index) => (
            <Link
              key={item.name}
              href={`/products?category=${encodeURIComponent(item.category)}`}
              className="group relative overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.06] p-4 text-center shadow-xl backdrop-blur-md transition duration-500 hover:-translate-y-2 hover:border-pink-500/60 hover:bg-white/[0.09]"
            >
              <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
                <div className="absolute inset-x-6 top-8 h-24 rounded-full bg-pink-500/20 blur-2xl" />
              </div>

              <div className="relative mx-auto flex h-36 items-center justify-center md:h-40">
                <span className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-black/40 text-[10px] font-black text-white/70">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <img
                  src={item.image}
                  alt={item.name}
                  className="max-h-28 w-auto max-w-full object-contain drop-shadow-[0_16px_20px_rgba(0,0,0,0.45)] transition duration-500 group-hover:scale-110 group-hover:-rotate-2 md:max-h-32"
                />
              </div>

              <div className="relative mt-2">
                <h3 className="text-sm font-black text-white md:text-base">
                  {item.name}
                </h3>

                <div className="mt-3 inline-flex items-center gap-2 text-xs font-black text-yellow-300 transition-all duration-300 group-hover:gap-3">
                  Explore
                  <FaArrowRight className="text-[10px]" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-pink-600 to-orange-500 px-7 py-3.5 text-sm font-black text-white shadow-[0_14px_35px_rgba(236,72,153,0.28)] transition duration-300 hover:-translate-y-1 hover:scale-105"
          >
            View All Products
            <FaArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
