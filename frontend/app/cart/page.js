"use client";

import Link from "next/link";
import {
  FaArrowLeft,
  FaMinus,
  FaPlus,
  FaShoppingBag,
  FaTrash,
} from "react-icons/fa";

import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const {
    cartItems,
    cartTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080808] px-5 py-20">
        <div className="text-center">
          <FaShoppingBag className="mx-auto text-7xl text-pink-500" />

          <h1 className="mt-6 text-4xl font-black">
            Your Cart is Empty
          </h1>

          <p className="mt-3 text-gray-400">
            Add products from our latest cracker catalogue.
          </p>

          <Link
            href="/products"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-pink-600 px-7 py-4 font-black hover:bg-pink-700"
          >
            <FaArrowLeft />
            Shop Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080808] py-12 md:py-16">
      <div className="container">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-bold uppercase tracking-[4px] text-pink-500">
              Your Selection
            </p>

            <h1 className="mt-2 text-4xl font-black md:text-5xl">
              Shopping Cart
            </h1>

            <p className="mt-3 text-gray-400">
              {cartItems.length} product{cartItems.length !== 1 ? "s" : ""} in
              your cart
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-xl border border-pink-500 px-5 py-3 font-black text-pink-500 transition hover:bg-pink-500 hover:text-white"
          >
            <FaArrowLeft />
            Continue Shopping
          </Link>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1fr_380px]">
          <section className="space-y-5">
            {cartItems.map((item) => {
              const price = Number(item.offerPrice || 0);
              const itemSubtotal = price * item.quantity;

              return (
                <article
                  key={item._id}
                  className="grid gap-5 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg sm:grid-cols-[120px_1fr] lg:grid-cols-[120px_1fr_auto]"
                >
                  <Link
                    href={`/products/${item._id}`}
                    className="flex h-28 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-pink-950 to-black"
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-contain p-2"
                      />
                    ) : (
                      <span className="text-5xl">🎆</span>
                    )}
                  </Link>

                  <div>
                    <p className="text-sm font-semibold text-pink-500">
                      {item.category}
                    </p>

                    <Link href={`/products/${item._id}`}>
                      <h2 className="mt-1 text-xl font-black transition hover:text-pink-500">
                        {item.name}
                      </h2>
                    </Link>

                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-400">
                      <p>Code: {item.productCode || "—"}</p>
                      <p>Unit: {item.unit || "—"}</p>
                    </div>

                    <p className="mt-4 text-xl font-black text-yellow-400">
                      ₹{price.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="flex flex-col justify-between gap-5 lg:items-end">
                    <button
                      type="button"
                      onClick={() => removeFromCart(item._id)}
                      className="flex w-fit items-center gap-2 rounded-xl bg-red-600/15 px-4 py-3 font-bold text-red-400 transition hover:bg-red-600 hover:text-white"
                    >
                      <FaTrash />
                      Remove
                    </button>

                    <div>
                      <div className="flex items-center rounded-xl border border-white/10 bg-black/40">
                        <button
                          type="button"
                          onClick={() => decreaseQuantity(item._id)}
                          className="p-3 transition hover:text-pink-500"
                          aria-label="Decrease quantity"
                        >
                          <FaMinus />
                        </button>

                        <span className="min-w-12 text-center text-lg font-black">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() => increaseQuantity(item._id)}
                          className="p-3 transition hover:text-pink-500"
                          aria-label="Increase quantity"
                        >
                          <FaPlus />
                        </button>
                      </div>

                      <p className="mt-3 text-right text-sm text-gray-400">
                        Subtotal
                      </p>

                      <p className="text-right text-xl font-black text-yellow-400">
                        ₹{itemSubtotal.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          <aside className="h-fit rounded-3xl border border-pink-500/20 bg-gradient-to-b from-white/10 to-white/5 p-6 shadow-xl xl:sticky xl:top-28">
            <h2 className="text-2xl font-black">Order Summary</h2>

            <div className="mt-6 space-y-4 border-b border-white/10 pb-6">
              <div className="flex justify-between text-gray-400">
                <span>Products</span>
                <span>{cartItems.length}</span>
              </div>

              <div className="flex justify-between text-gray-400">
                <span>Shipping</span>
                <span>Confirmed later</span>
              </div>
            </div>

            <div className="mt-6 flex items-end justify-between gap-4">
              <span className="text-lg font-bold">Cart Total</span>

              <span className="text-3xl font-black text-yellow-400">
                ₹{Number(cartTotal || 0).toLocaleString("en-IN")}
              </span>
            </div>

            <p className="mt-4 text-sm leading-6 text-gray-400">
              Shipping charges, product availability and final payment details
              will be confirmed before dispatch.
            </p>

            <Link
              href="/checkout"
              className="mt-7 block rounded-xl bg-pink-600 px-5 py-4 text-center text-lg font-black transition hover:bg-pink-700"
            >
              Proceed to Checkout
            </Link>

            <a
              href="https://wa.me/917010400258"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 block rounded-xl border border-green-500 px-5 py-4 text-center font-black text-green-500 transition hover:bg-green-500 hover:text-white"
            >
              Ask on WhatsApp
            </a>
          </aside>
        </div>
      </div>
    </main>
  );
}
