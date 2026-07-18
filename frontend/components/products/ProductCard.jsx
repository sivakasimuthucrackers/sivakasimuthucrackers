"use client";

import Link from "next/link";
import { useState } from "react";
import {
  FaCheck,
  FaEye,
  FaMinus,
  FaPlus,
  FaShoppingCart,
} from "react-icons/fa";

import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const mrp = Number(product.mrp || 0);
  const offerPrice = Number(product.offerPrice || 0);
  const discount = Number(product.discount || 0);
  const savings = Math.max(mrp - offerPrice, 0);

  function decreaseQuantity() {
    setQuantity((current) => Math.max(current - 1, 1));
  }

  function increaseQuantity() {
    setQuantity((current) => current + 1);
  }

  function handleAddToCart() {
    for (let index = 0; index < quantity; index += 1) {
      addToCart(product);
    }

    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  }

  return (
    <article className="group overflow-hidden rounded-3xl border border-pink-500/20 bg-gradient-to-b from-white/10 to-white/5 shadow-lg transition duration-300 hover:-translate-y-2 hover:border-pink-500">
      <Link href={`/products/${product._id}`} className="block">
        <div className="relative flex h-60 items-center justify-center overflow-hidden bg-gradient-to-br from-pink-950 via-black to-orange-950">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-contain p-4 transition duration-300 group-hover:scale-110"
            />
          ) : (
            <span className="text-8xl">🎆</span>
          )}

          <span className="absolute left-4 top-4 rounded-full bg-yellow-400 px-3 py-1 text-sm font-black text-black">
            {discount}% OFF
          </span>
        </div>
      </Link>

      <div className="p-5">
        <p className="text-sm font-semibold text-pink-500">
          {product.category}
        </p>

        <Link href={`/products/${product._id}`} className="block">
          <h3 className="mt-2 min-h-14 text-lg font-black leading-7 hover:text-pink-500">
            {product.name}
          </h3>
        </Link>

        <div className="mt-4 flex flex-wrap items-end gap-3">
          <span className="text-2xl font-black text-yellow-400">
            ₹{offerPrice.toLocaleString("en-IN")}
          </span>
          <span className="text-gray-500 line-through">
            ₹{mrp.toLocaleString("en-IN")}
          </span>
        </div>

        {savings > 0 && (
          <p className="mt-2 text-sm font-bold text-green-400">
            You save ₹{savings.toLocaleString("en-IN")}
          </p>
        )}

        <div className="mt-5 flex items-center justify-between gap-3">
          <div className="flex items-center rounded-xl border border-white/10 bg-black/30">
            <button
              type="button"
              onClick={decreaseQuantity}
              className="p-3 hover:text-pink-500"
            >
              <FaMinus />
            </button>

            <span className="min-w-10 text-center font-black">
              {quantity}
            </span>

            <button
              type="button"
              onClick={increaseQuantity}
              className="p-3 hover:text-pink-500"
            >
              <FaPlus />
            </button>
          </div>

          <p className="text-sm text-gray-400">
            Stock: {product.stockQuantity ?? 0}
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!product.isActive}
          className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 font-black transition ${
            added
              ? "bg-green-600"
              : "bg-pink-600 hover:bg-pink-700"
          }`}
        >
          {added ? <FaCheck /> : <FaShoppingCart />}
          {added ? "Added to Cart" : "Add to Cart"}
        </button>

        <Link
          href={`/products/${product._id}`}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-pink-500 px-5 py-3 font-black text-pink-500 hover:bg-pink-500 hover:text-white"
        >
          <FaEye />
          View Details
        </Link>
      </div>
    </article>
  );
}
