"use client";

import Link from "next/link";
import Image from "next/image";
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

function optimizeCategoryImage(url, width) {
  if (!url) return "";

  // Cloudinary: request a correctly sized modern image.
  if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
    return url.replace(
      "/upload/",
      `/upload/f_auto,q_auto,w_${width},c_fill/`
    );
  }

  // Local images are served through Next.js image optimizer below.
  return url;
}

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
    <section className="relative overflow-hidden bg-[#080808] py-10 text-white md:py-20">
      <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-pink-600/20 blur-3xl" />

      <div className="absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4 md:px-5">
        {/* Heading */}
        <div className="mb-6 text-center md:mb-12">
          <span className="inline-flex rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-[3px] text-pink-400 md:px-5 md:py-2 md:text-sm md:tracking-[4px]">
            Explore Our Range
          </span>

          <h2 className="mt-3 text-2xl font-black md:mt-5 md:text-6xl">
            Shop by{" "}
            <span className="bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
              Category
            </span>
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-400 md:mt-5 md:text-lg md:leading-8">
            Discover our Sivakasi cracker collection for every celebration.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <>
            {/* Mobile loading */}
            <div className="flex gap-3 overflow-hidden md:hidden">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[190px] min-w-[155px] animate-pulse rounded-2xl border border-white/10 bg-white/5"
                />
              ))}
            </div>

            {/* Desktop loading */}
            <div className="hidden gap-6 md:grid md:grid-cols-3 lg:grid-cols-5">
              {Array.from({ length: 10 }).map((_, index) => (
                <div
                  key={index}
                  className="h-72 animate-pulse rounded-3xl border border-white/10 bg-white/5"
                />
              ))}
            </div>
          </>
        )}

        {!loading && categories.length === 0 && (
          <p className="text-center text-gray-400">
            No categories available.
          </p>
        )}

        {!loading && categories.length > 0 && (
          <>
            {/* Mobile horizontal scroll */}
            <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 md:hidden">
              {categories.map((category, index) => (
                <Link
                  key={category._id}
                  href={`/products?category=${encodeURIComponent(
                    category.name
                  )}`}
                  className="group relative min-h-[190px] min-w-[155px] snap-start overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-xl"
                >
                  {category.image ? (
                    <Image
                      src={optimizeCategoryImage(category.image, 360)}
                      alt={category.name}
                      fill
                      sizes="155px"
                      loading="lazy"
                      quality={70}
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-pink-700 via-red-600 to-orange-500">
                      <span className="text-6xl">
                        {categoryIcons[index % categoryIcons.length]}
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <div className="mb-2 h-1 w-9 rounded-full bg-gradient-to-r from-pink-500 to-yellow-300" />

                    <h3 className="line-clamp-2 text-base font-black leading-5 text-white">
                      {category.name}
                    </h3>

                    <div className="mt-2 flex items-center gap-2 text-xs font-black text-yellow-300">
                      Shop
                      <FaArrowRight className="text-[10px]" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Desktop grid */}
            <div className="hidden gap-6 md:grid md:grid-cols-3 lg:grid-cols-5">
              {categories.map((category, index) => (
                <Link
                  key={category._id}
                  href={`/products?category=${encodeURIComponent(
                    category.name
                  )}`}
                  className="group relative min-h-[300px] overflow-hidden rounded-[30px] border border-white/10 bg-white/5 shadow-2xl transition duration-500 hover:-translate-y-3 hover:border-pink-500/60"
                >
                  {category.image ? (
                    <Image
                      src={optimizeCategoryImage(category.image, 480)}
                      alt={category.name}
                      fill
                      sizes="(min-width: 1024px) 20vw, (min-width: 768px) 33vw, 155px"
                      loading="lazy"
                      quality={72}
                      className="object-cover transition duration-700 group-hover:scale-110"
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
          </>
        )}

        <div className="mt-6 text-center md:mt-12">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-orange-500 px-6 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-1 md:gap-3 md:rounded-2xl md:px-9 md:py-4 md:text-base"
          >
            View All Products
            <FaArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
