"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaCheck,
  FaEye,
  FaShoppingCart,
} from "react-icons/fa";

import { useCart } from "@/context/CartContext";

const API_URL = "https://muthu-crackers-backend.onrender.com";

export default function BestSellers() {
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addedProductId, setAddedProductId] = useState(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/products/latest?limit=4`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load products"
          );
        }

        setProducts(data.products || []);
      } catch (err) {
        setError(err.message || "Unable to load products");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  function handleAddToCart(product) {
    addToCart(product);
    setAddedProductId(product._id);

    window.setTimeout(() => {
      setAddedProductId(null);
    }, 1500);
  }

  function MobileProductCard({ product }) {
    const mrp = Number(product.mrp || 0);
    const offerPrice = Number(product.offerPrice || 0);
    const discount = Number(product.discount || 0);
    const isAdded = addedProductId === product._id;

    return (
      <article className="min-w-[250px] snap-start overflow-hidden rounded-2xl border border-pink-500/20 bg-gradient-to-b from-white/10 to-white/5 shadow-xl">
        <Link href={`/products/${product._id}`}>
          <div className="relative flex h-[150px] items-center justify-center overflow-hidden bg-gradient-to-br from-pink-950 to-black">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-contain p-3"
              />
            ) : (
              <span className="text-6xl">🎆</span>
            )}

            {discount > 0 && (
              <span className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-2.5 py-1 text-[10px] font-black text-white">
                {discount}% OFF
              </span>
            )}

            <span className="absolute right-3 top-3 rounded-full bg-green-600 px-2 py-1 text-[9px] font-bold text-white">
              Factory Price
            </span>
          </div>
        </Link>

        <div className="p-4">
          <p className="truncate text-[10px] font-semibold uppercase tracking-wide text-pink-500">
            {product.category}
          </p>

          <Link href={`/products/${product._id}`}>
            <h3 className="mt-1 line-clamp-2 min-h-10 text-sm font-black leading-5 transition hover:text-pink-500">
              {product.name}
            </h3>
          </Link>

          <p className="mt-1 text-[11px] text-gray-400">
            Unit: {product.unit || "—"}
          </p>

          <div className="mt-3 flex items-end gap-2">
            <span className="text-xl font-black text-yellow-300">
              ₹{offerPrice.toLocaleString("en-IN")}
            </span>

            {mrp > offerPrice && (
              <span className="text-xs text-gray-500 line-through">
                ₹{mrp.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleAddToCart(product)}
              className={`flex items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-xs font-black transition ${
                isAdded
                  ? "bg-green-600 text-white"
                  : "bg-pink-600 text-white hover:bg-pink-700"
              }`}
            >
              {isAdded ? <FaCheck /> : <FaShoppingCart />}
              {isAdded ? "Added" : "Add"}
            </button>

            <Link
              href={`/products/${product._id}`}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-pink-500 px-3 py-2.5 text-xs font-black text-pink-500 transition hover:bg-pink-500 hover:text-white"
            >
              <FaEye />
              Details
            </Link>
          </div>
        </div>
      </article>
    );
  }

  function DesktopProductCard({ product }) {
    const mrp = Number(product.mrp || 0);
    const offerPrice = Number(product.offerPrice || 0);
    const discount = Number(product.discount || 0);
    const isAdded = addedProductId === product._id;

    return (
      <article className="group overflow-hidden rounded-3xl border border-pink-500/20 bg-gradient-to-b from-white/10 to-white/5 shadow-lg transition duration-300 hover:-translate-y-4 hover:scale-[1.02] hover:border-pink-500">
        <Link href={`/products/${product._id}`}>
          <div className="relative flex h-56 items-center justify-center overflow-hidden bg-gradient-to-br from-pink-950 to-black">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-contain p-4 transition duration-300 group-hover:scale-125 group-hover:rotate-2"
              />
            ) : (
              <span className="text-8xl">🎆</span>
            )}

            <span className="absolute left-4 top-4 rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-3 py-1 text-sm font-black text-white">
              {discount}% OFF
            </span>

            <span className="absolute right-4 top-4 rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white">
              Factory Price
            </span>
          </div>
        </Link>

        <div className="p-5">
          <p className="text-sm font-semibold text-pink-500">
            {product.category}
          </p>

          <Link href={`/products/${product._id}`}>
            <h3 className="mt-2 min-h-14 text-lg font-black transition hover:text-pink-500">
              {product.name}
            </h3>
          </Link>

          <p className="mt-2 text-sm text-gray-400">
            Unit: {product.unit || "—"}
          </p>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-3xl font-black text-yellow-300">
              ₹{offerPrice.toLocaleString("en-IN")}
            </span>

            {mrp > offerPrice && (
              <span className="text-lg text-gray-500 line-through">
                ₹{mrp.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => handleAddToCart(product)}
            className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 font-black shadow-lg transition ${
              isAdded
                ? "bg-green-600 text-white"
                : "bg-pink-600 text-white hover:bg-pink-700 hover:shadow-pink-600/50"
            }`}
          >
            {isAdded ? <FaCheck /> : <FaShoppingCart />}
            {isAdded ? "Added to Cart" : "Add to Cart"}
          </button>

          <Link
            href={`/products/${product._id}`}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-pink-500 px-5 py-3 font-black text-pink-500 transition hover:bg-pink-500 hover:text-white hover:shadow-lg"
          >
            <FaEye />
            View Details
          </Link>
        </div>
      </article>
    );
  }

  return (
    <section className="relative overflow-hidden bg-[#050505] py-10 text-white md:py-20">
      <div className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-pink-600/20 blur-3xl" />
      <div className="absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4 md:px-5">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4 md:mb-10 md:gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[4px] text-pink-500 md:text-base">
              Customer Favourites
            </p>

            <h2 className="mt-2 text-2xl font-black md:mt-3 md:text-5xl">
              <span className="bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
                Best Selling Products
              </span>
            </h2>
          </div>

          <Link
            href="/products"
            className="rounded-lg border border-pink-500 px-4 py-2 text-sm font-black text-pink-500 transition hover:bg-pink-500 hover:text-white md:rounded-xl md:px-6 md:py-3 md:text-base"
          >
            View All Products
          </Link>
        </div>

        {loading && (
          <>
            <div className="flex gap-3 overflow-hidden md:hidden">
              {Array.from({ length: 2 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[330px] min-w-[250px] animate-pulse rounded-2xl border border-white/10 bg-white/5"
                />
              ))}
            </div>

            <div className="hidden gap-6 md:grid md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[470px] animate-pulse rounded-3xl border border-white/10 bg-white/5"
                />
              ))}
            </div>
          </>
        )}

        {error && (
          <p className="text-center text-red-400">
            {error}
          </p>
        )}

        {!loading && !error && products.length === 0 && (
          <p className="text-center text-gray-400">
            No products available.
          </p>
        )}

        {!loading && !error && products.length > 0 && (
          <>
            {/* Mobile horizontal swipe */}
            <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 md:hidden">
              {products.map((product) => (
                <MobileProductCard
                  key={product._id}
                  product={product}
                />
              ))}
            </div>

            {/* Desktop grid */}
            <div className="hidden gap-6 md:grid md:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <DesktopProductCard
                  key={product._id}
                  product={product}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
