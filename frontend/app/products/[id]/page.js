"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaMinus,
  FaPlus,
  FaShieldAlt,
  FaShoppingCart,
  FaWhatsapp,
} from "react-icons/fa";

import { useCart } from "@/context/CartContext";

const API_URL = "http://localhost:5000";
const WHATSAPP_NUMBER = "917010400258";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [imageZoom, setImageZoom] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/products/${params.id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load product"
          );
        }

        setProduct(data.product);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      loadProduct();
    }
  }, [params.id]);

  function decreaseQuantity() {
    setQuantity((current) => Math.max(current - 1, 1));
  }

  function increaseQuantity() {
    if (
      product?.stockQuantity &&
      quantity >= product.stockQuantity
    ) {
      return;
    }

    setQuantity((current) => current + 1);
  }

  function addSelectedQuantityToCart() {
    for (let index = 0; index < quantity; index += 1) {
      addToCart(product);
    }
  }

  function handleBuyNow() {
    addSelectedQuantityToCart();
    router.push("/cart");
  }

  function createWhatsAppMessage() {
    return encodeURIComponent(
      `Hello Sivakasi Muthu Crackers,

I am interested in this product:

Product: ${product.name}
Product Code: ${product.productCode}
Category: ${product.category}
Quantity: ${quantity}
Offer Price: ₹${product.offerPrice}

Please confirm availability and delivery details.`
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#080808] px-5 py-20">
        <div className="container">
          <div className="grid animate-pulse gap-10 lg:grid-cols-2">
            <div className="min-h-[480px] rounded-3xl bg-white/5" />

            <div className="space-y-5">
              <div className="h-5 w-40 rounded bg-white/10" />
              <div className="h-14 rounded bg-white/10" />
              <div className="h-8 w-48 rounded bg-white/10" />
              <div className="h-32 rounded bg-white/10" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080808] px-5 py-20 text-center">
        <div>
          <p className="text-6xl">⚠️</p>

          <h1 className="mt-5 text-3xl font-black">
            Product Not Found
          </h1>

          <p className="mt-3 text-red-400">
            {error || "Product not found"}
          </p>

          <Link
            href="/products"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-pink-600 px-6 py-3 font-black hover:bg-pink-700"
          >
            <FaArrowLeft />
            Back to Products
          </Link>
        </div>
      </main>
    );
  }

  const mrp = Number(product.mrp || 0);
  const offerPrice = Number(product.offerPrice || 0);
  const discount = Number(product.discount || 0);
  const savings = Math.max(mrp - offerPrice, 0);

  const isInStock =
    product.isActive && Number(product.stockQuantity || 0) > 0;

  return (
    <main className="min-h-screen bg-[#080808] py-12 md:py-16">
      <div className="container">
        <Link
          href="/products"
          className="mb-8 inline-flex items-center gap-2 font-bold text-pink-500 transition hover:text-pink-400"
        >
          <FaArrowLeft />
          Back to Products
        </Link>

        <section className="grid gap-10 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl md:p-8 lg:grid-cols-2">
          <div>
            <button
              type="button"
              onClick={() => product.image && setImageZoom(true)}
              className="relative flex min-h-[420px] w-full items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-pink-950 via-black to-orange-950"
            >
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-[470px] w-full object-contain p-6 transition duration-300 hover:scale-110"
                />
              ) : (
                <span className="text-9xl">🎆</span>
              )}

              <span className="absolute left-5 top-5 rounded-full bg-yellow-400 px-4 py-2 font-black text-black shadow-lg">
                {discount}% OFF
              </span>

              {product.image && (
                <span className="absolute bottom-5 right-5 rounded-full bg-black/70 px-4 py-2 text-sm font-bold">
                  Click to Zoom
                </span>
              )}
            </button>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-center">
                <FaShieldAlt className="mx-auto text-2xl text-pink-500" />
                <p className="mt-2 text-sm font-bold">
                  Quality Assured
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-center">
                <FaCheckCircle className="mx-auto text-2xl text-green-500" />
                <p className="mt-2 text-sm font-bold">
                  Factory Direct
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-center">
                <span className="text-2xl">📦</span>
                <p className="mt-2 text-sm font-bold">
                  Safe Packing
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <p className="font-black uppercase tracking-[3px] text-pink-500">
              {product.category}
            </p>

            <h1 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
              {product.name}
            </h1>

            <div className="mt-5 grid gap-3 text-sm text-gray-400 sm:grid-cols-2">
              <p>
                Product Code:{" "}
                <span className="font-bold text-white">
                  {product.productCode}
                </span>
              </p>

              <p>
                Unit:{" "}
                <span className="font-bold text-white">
                  {product.unit}
                </span>
              </p>
            </div>

            <div className="mt-7 flex flex-wrap items-end gap-4">
              <span className="text-4xl font-black text-yellow-400">
                ₹{offerPrice.toLocaleString("en-IN")}
              </span>

              <span className="text-xl text-gray-500 line-through">
                ₹{mrp.toLocaleString("en-IN")}
              </span>
            </div>

            {savings > 0 && (
              <p className="mt-3 font-bold text-green-400">
                You save ₹{savings.toLocaleString("en-IN")}
              </p>
            )}

            <div
              className={`mt-6 inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-black ${
                isInStock
                  ? "bg-green-500/15 text-green-400"
                  : "bg-red-500/15 text-red-400"
              }`}
            >
              <FaCheckCircle />
              {isInStock
                ? `In Stock: ${product.stockQuantity}`
                : "Currently Unavailable"}
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-black/30 p-5">
              <h2 className="text-xl font-black">
                Product Description
              </h2>

              <p className="mt-3 leading-8 text-gray-300">
                {product.description ||
                  "Premium-quality crackers supplied directly from Sivakasi at factory-direct prices."}
              </p>
            </div>

            <div className="mt-7">
              <p className="mb-3 font-bold">Select Quantity</p>

              <div className="flex w-fit items-center rounded-xl border border-white/10 bg-black/40">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  className="p-4 transition hover:text-pink-500"
                  aria-label="Decrease quantity"
                >
                  <FaMinus />
                </button>

                <span className="min-w-14 text-center text-lg font-black">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  className="p-4 transition hover:text-pink-500"
                  aria-label="Increase quantity"
                >
                  <FaPlus />
                </button>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={addSelectedQuantityToCart}
                disabled={!isInStock}
                className="flex items-center justify-center gap-3 rounded-xl bg-pink-600 px-6 py-4 text-lg font-black transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FaShoppingCart />
                Add to Cart
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={!isInStock}
                className="rounded-xl bg-yellow-400 px-6 py-4 text-lg font-black text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Buy Now
              </button>
            </div>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${createWhatsAppMessage()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center justify-center gap-3 rounded-xl bg-green-500 px-6 py-4 text-lg font-black transition hover:bg-green-600"
            >
              <FaWhatsapp />
              Enquire on WhatsApp
            </a>

            <div className="mt-7 rounded-2xl border border-pink-500/20 bg-pink-500/10 p-5 text-sm leading-7 text-gray-300">
              For wholesale pricing, stock confirmation and delivery
              information, contact us before payment.
            </div>
          </div>
        </section>
      </div>

      {imageZoom && product.image && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-5"
          onClick={() => setImageZoom(false)}
        >
          <button
            type="button"
            onClick={() => setImageZoom(false)}
            className="absolute right-6 top-6 rounded-full bg-white px-5 py-3 font-black text-black"
          >
            Close
          </button>

          <img
            src={product.image}
            alt={product.name}
            className="max-h-[90vh] max-w-[95vw] object-contain"
          />
        </div>
      )}
    </main>
  );
}