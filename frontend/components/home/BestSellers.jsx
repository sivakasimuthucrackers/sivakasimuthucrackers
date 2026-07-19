"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaEye, FaShoppingCart } from "react-icons/fa";
import { useCart } from "@/context/CartContext";

const API_URL = "https://muthu-crackers-backend.onrender.com";

export default function BestSellers() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch(`${API_URL}/api/products/latest?limit=4`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load products");
        }

        setProducts(data.products || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#050505] py-20 text-white">
      <div className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-pink-600/20 blur-3xl" />
      <div className="absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl" />

      <div className="container relative z-10 mx-auto px-5">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="font-bold uppercase tracking-[4px] text-pink-500">
              Customer Favourites
            </p>

            <h2 className="mt-3 text-3xl font-black md:text-5xl">
              <span className="bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
                Best Selling Products
              </span>
            </h2>
          </div>

          <Link
            href="/products"
            className="rounded-xl border border-pink-500 px-6 py-3 font-black text-pink-500 transition hover:bg-pink-500 hover:text-white"
          >
            View All Products
          </Link>
        </div>

        {loading && (
          <p className="text-center text-gray-400">Loading products...</p>
        )}

        {error && <p className="text-center text-red-400">{error}</p>}

        {!loading && !error && products.length === 0 && (
          <p className="text-center text-gray-400">No products available.</p>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <article
                key={product._id}
                className="group overflow-hidden rounded-3xl border border-pink-500/20 bg-gradient-to-b from-white/10 to-white/5 shadow-lg transition duration-300 hover:-translate-y-4 hover:scale-[1.02] hover:border-pink-500"
              >
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
                      {product.discount || 0}% OFF
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
                    Unit: {product.unit}
                  </p>

                  <div className="mt-4 flex items-center gap-3">
                    <span className="text-3xl font-black text-yellow-300">
                      ₹{product.offerPrice}
                    </span>

                    <span className="text-lg text-gray-500 line-through">
                      ₹{product.mrp}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => addToCart(product)}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-pink-600 px-5 py-3 font-black shadow-lg transition hover:bg-pink-700 hover:shadow-pink-600/50"
                  >
                    <FaShoppingCart />
                    Add to Cart
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
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
