"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";

const API_URL = "https://muthu-crackers-backend.onrender.com";

const categoryIcons = [
  "✨",
  "🌋",
  "🌀",
  "🚀",
  "🎇",
  "💥",
  "🎁",
  "🎆",
  "🎉",
  "🧨",
];

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch(`${API_URL}/api/categories`);
        const data = await response.json();

        if (response.ok) {
          setCategories((data.categories || []).slice(0, 10));
        }
      } catch (error) {
        console.error("Category loading error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#080808] py-20 text-white">
      <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-pink-600/20 blur-3xl" />
      <div className="absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl" />

      <div className="container relative z-10 mx-auto px-5">
        <div className="mb-12 text-center">
          <span className="inline-flex rounded-full border border-pink-500/30 bg-pink-500/10 px-5 py-2 text-sm font-black uppercase tracking-[4px] text-pink-400">
            Explore Our Range
          </span>

          <h2 className="mt-5 text-4xl font-black md:text-6xl">
            Shop by{" "}
            <span className="bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
              Category
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-gray-400 md:text-lg">
            Discover our complete Sivakasi cracker collection for every
            celebration, family function and festival order.
          </p>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="h-72 animate-pulse rounded-3xl border border-white/10 bg-white/5"
              />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <p className="text-center text-gray-400">
            No categories available.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {categories.map((category, index) => (
              <Link
                key={category._id}
                href={`/products?category=${encodeURIComponent(category.name)}`}
                className="group relative min-h-[300px] overflow-hidden rounded-[30px] border border-white/10 bg-white/5 shadow-2xl transition duration-500 hover:-translate-y-3 hover:border-pink-500/60"
              >
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-pink-700 via-red-600 to-orange-500">
                    <span className="text-8xl transition duration-500 group-hover:scale-125 group-hover:rotate-6">
                      {categoryIcons[index % categoryIcons.length]}
                    </span>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="mb-3 h-1 w-12 rounded-full bg-gradient-to-r from-pink-500 to-yellow-300 transition-all duration-500 group-hover:w-24" />

                  <h3 className="text-xl font-black leading-tight text-white">
                    {category.name}
                  </h3>

                  <div className="mt-4 flex items-center gap-2 text-sm font-black text-yellow-300 transition duration-300 group-hover:gap-4">
                    Shop Products
                    <FaArrowRight />
                  </div>
                </div>

                <div className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/45 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                  View
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-pink-600 to-orange-500 px-9 py-4 font-black text-white shadow-[0_15px_40px_rgba(236,72,153,0.3)] transition duration-300 hover:-translate-y-1 hover:scale-105"
          >
            View All Products
            <FaArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
