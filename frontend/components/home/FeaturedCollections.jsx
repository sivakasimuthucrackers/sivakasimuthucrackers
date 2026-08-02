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

function CollectionCard({ item, index, mobile = false }) {
  return (
    <Link
      href={`/products?category=${encodeURIComponent(item.category)}`}
      className={`group relative overflow-hidden border border-white/10 bg-white/[0.06] text-center shadow-xl backdrop-blur-md transition duration-500 hover:border-pink-500/60 hover:bg-white/[0.09] ${
        mobile
          ? "min-w-[155px] snap-start rounded-2xl p-3"
          : "rounded-[26px] p-4 hover:-translate-y-2"
      }`}
    >
      <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
        <div className="absolute inset-x-6 top-8 h-24 rounded-full bg-pink-500/20 blur-2xl" />
      </div>

      <div
        className={`relative mx-auto flex items-center justify-center ${
          mobile ? "h-28" : "h-36 md:h-40"
        }`}
      >
        <span
          className={`absolute right-1 top-1 flex items-center justify-center rounded-full border border-white/15 bg-black/40 font-black text-white/70 ${
            mobile
              ? "h-6 w-6 text-[9px]"
              : "h-7 w-7 text-[10px]"
          }`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <img
          src={item.image}
          alt={item.name}
          className={`w-auto max-w-full object-contain drop-shadow-[0_16px_20px_rgba(0,0,0,0.45)] transition duration-500 group-hover:scale-110 group-hover:-rotate-2 ${
            mobile
              ? "max-h-20"
              : "max-h-28 md:max-h-32"
          }`}
        />
      </div>

      <div className={mobile ? "relative mt-1" : "relative mt-2"}>
        <h3
          className={`font-black text-white ${
            mobile
              ? "text-sm"
              : "text-sm md:text-base"
          }`}
        >
          {item.name}
        </h3>

        <div
          className={`inline-flex items-center gap-2 font-black text-yellow-300 transition-all duration-300 group-hover:gap-3 ${
            mobile
              ? "mt-2 text-[11px]"
              : "mt-3 text-xs"
          }`}
        >
          Explore
          <FaArrowRight className="text-[10px]" />
        </div>
      </div>
    </Link>
  );
}

export default function FeaturedCollections() {
  return (
    <section className="relative overflow-hidden bg-[#0b0b0b] py-10 text-white md:py-20">
      <div className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-pink-600/15 blur-3xl" />

      <div className="absolute -right-24 bottom-8 h-80 w-80 rounded-full bg-orange-500/15 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4 md:px-5">
        <div className="mx-auto mb-6 max-w-3xl text-center md:mb-10">
          <span className="inline-flex rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-[3px] text-pink-400 md:px-5 md:py-2 md:text-xs">
            Featured Collections
          </span>

          <h2 className="mt-3 text-2xl font-black md:mt-5 md:text-5xl">
            Find Your Favourite{" "}
            <span className="bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
              Crackers
            </span>
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-400 md:mt-4 md:text-base md:leading-7">
            Explore popular Sivakasi cracker collections for family
            celebrations, kids, gifting and festival orders.
          </p>
        </div>

        {/* Mobile horizontal swipe */}
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 md:hidden">
          {collections.map((item, index) => (
            <CollectionCard
              key={item.name}
              item={item}
              index={index}
              mobile
            />
          ))}
        </div>

        {/* Desktop grid */}
        <div className="hidden gap-4 md:grid md:grid-cols-4 lg:grid-cols-5">
          {collections.map((item, index) => (
            <CollectionCard
              key={item.name}
              item={item}
              index={index}
            />
          ))}
        </div>

        <div className="mt-6 text-center md:mt-10">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-orange-500 px-6 py-3 text-sm font-black text-white shadow-[0_14px_35px_rgba(236,72,153,0.28)] transition duration-300 hover:-translate-y-1 hover:scale-105 md:gap-3 md:rounded-full md:px-7 md:py-3.5"
          >
            View All Products
            <FaArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
