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

  const mrp = Number(product?.mrp || 0);
  const offerPrice = Number(product?.offerPrice || 0);
  const discount = Number(product?.discount || 0);
  const savings = Math.max(mrp - offerPrice, 0);
  const stockQuantity = Number(product?.stockQuantity ?? 0);
  const isAvailable = product?.isActive !== false && stockQuantity > 0;
  const productLink = `/products/${product?._id}`;

  function decreaseQuantity() {
    setQuantity((current) => Math.max(current - 1, 1));
  }

  function increaseQuantity() {
    setQuantity((current) =>
      stockQuantity > 0 ? Math.min(current + 1, stockQuantity) : current + 1
    );
  }

  function handleAddToCart() {
    if (!isAvailable) return;

    for (let index = 0; index < quantity; index += 1) {
      addToCart(product);
    }

    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  }

  return (
    <article className="group overflow-hidden rounded-2xl border border-pink-500/20 bg-[#151515] shadow-lg transition duration-300 hover:border-pink-500 md:rounded-3xl md:bg-gradient-to-b md:from-white/10 md:to-white/5 md:hover:-translate-y-2">
      <div className="flex min-h-[120px] md:hidden">
        <Link
          href={productLink}
          className="relative flex w-[80px] shrink-0 items-center justify-center overflow-hidden bg-gradient-to-br from-pink-950 via-black to-orange-950"
        >
          {product?.image ? (
            <img
              src={product.image}
              alt={product?.name || "Product"}
              className="h-full w-full object-contain p-2"
            />
          ) : (
            <span className="text-4xl">🎆</span>
          )}

          {discount > 0 && (
            <span className="absolute left-2 top-2 rounded-full bg-yellow-400 px-2 py-1 text-[10px] font-black text-black">
              {discount}% OFF
            </span>
          )}
        </Link>

        <div className="flex min-w-0 flex-1 flex-col justify-between p-3">
          <div>
            <p className="truncate text-[10px] font-bold uppercase tracking-wide text-pink-500">
              {product?.category || "CRACKERS"}
            </p>

            <Link href={productLink}>
              <h3 className="mt-1 line-clamp-2 text-sm font-black leading-5 text-white hover:text-pink-500">
                {product?.name || "Product"}
              </h3>
            </Link>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-xl font-black text-yellow-400">
                ₹{offerPrice.toLocaleString("en-IN")}
              </span>
              {mrp > offerPrice && (
                <span className="text-xs text-gray-500 line-through">
                  ₹{mrp.toLocaleString("en-IN")}
                </span>
              )}
            </div>

            {savings > 0 && (
              <p className="mt-1 text-[11px] font-bold text-green-400">
                Save ₹{savings.toLocaleString("en-IN")}
              </p>
            )}
          </div>

          <div className="mt-2 flex items-center gap-2">
            <div className="flex h-8 items-center rounded-lg border border-white/10 bg-black/40">
              <button type="button" onClick={decreaseQuantity} aria-label="Decrease quantity" className="flex h-8 w-8 items-center justify-center text-xs transition hover:text-pink-500">
                <FaMinus />
              </button>
              <span className="min-w-7 text-center text-sm font-black">{quantity}</span>
              <button type="button" onClick={increaseQuantity} aria-label="Increase quantity" className="flex h-8 w-8 items-center justify-center text-xs transition hover:text-pink-500">
                <FaPlus />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!isAvailable}
              className={`flex h-8 flex-1 items-center justify-center gap-2 rounded-lg px-3 text-xs font-black transition ${
                added ? "bg-green-600 text-white" : "bg-pink-600 text-white hover:bg-pink-700"
              } disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-400`}
            >
              {added && <FaCheck />}
              {added ? "Added" : isAvailable ? "Add" : "Out of Stock"}
            </button>
          </div>
        </div>
      </div>

      <div className="hidden md:block">
        <Link href={productLink} className="block">
          <div className="relative flex h-60 items-center justify-center overflow-hidden bg-gradient-to-br from-pink-950 via-black to-orange-950">
            {product?.image ? (
              <img src={product.image} alt={product?.name || "Product"} className="h-full w-full object-contain p-4 transition duration-300 group-hover:scale-110" />
            ) : (
              <span className="text-8xl">🎆</span>
            )}
            {discount > 0 && (
              <span className="absolute left-4 top-4 rounded-full bg-yellow-400 px-3 py-1 text-sm font-black text-black">
                {discount}% OFF
              </span>
            )}
          </div>
        </Link>

        <div className="p-5">
          <p className="text-sm font-semibold text-pink-500">{product?.category || "CRACKERS"}</p>
          <Link href={productLink} className="block">
            <h3 className="mt-2 min-h-14 text-lg font-black leading-7 hover:text-pink-500">{product?.name || "Product"}</h3>
          </Link>

          <div className="mt-4 flex flex-wrap items-end gap-3">
            <span className="text-2xl font-black text-yellow-400">₹{offerPrice.toLocaleString("en-IN")}</span>
            {mrp > offerPrice && <span className="text-gray-500 line-through">₹{mrp.toLocaleString("en-IN")}</span>}
          </div>

          {savings > 0 && <p className="mt-2 text-sm font-bold text-green-400">You save ₹{savings.toLocaleString("en-IN")}</p>}

          <div className="mt-5 flex items-center justify-between gap-3">
            <div className="flex items-center rounded-xl border border-white/10 bg-black/30">
              <button type="button" onClick={decreaseQuantity} className="p-3 hover:text-pink-500"><FaMinus /></button>
              <span className="min-w-10 text-center font-black">{quantity}</span>
              <button type="button" onClick={increaseQuantity} className="p-3 hover:text-pink-500"><FaPlus /></button>
            </div>
            <p className="text-sm text-gray-400">Stock: {stockQuantity}</p>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!isAvailable}
            className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 font-black transition ${
              added ? "bg-green-600" : "bg-pink-600 hover:bg-pink-700"
            } disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-400`}
          >
            {added ? <FaCheck /> : <FaShoppingCart />}
            {added ? "Added to Cart" : isAvailable ? "Add to Cart" : "Out of Stock"}
          </button>

          <Link href={productLink} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-pink-500 px-5 py-3 font-black text-pink-500 transition hover:bg-pink-500 hover:text-white">
            <FaEye /> View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
