"use client";

import { useState } from "react";
import {
  FaBox,
  FaSearch,
  FaTruck,
} from "react-icons/fa";

const API_URL = "https://muthu-crackers-backend.onrender.com/api/orders";

export default function OrderTrackingPage() {
  const [identifier, setIdentifier] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function searchOrder(event) {
    event.preventDefault();

    if (!identifier.trim()) {
      setError("Enter your order number or order ID.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setOrder(null);

      const response = await fetch(
        `${API_URL}/track/${encodeURIComponent(identifier.trim())}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Order not found");
      }

      setOrder(data.order);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#080808] py-16 md:py-20">
      <div className="container">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <FaTruck className="mx-auto text-6xl text-pink-500" />

            <h1 className="mt-5 text-4xl font-black md:text-5xl">
              Track Your Order
            </h1>

            <p className="mt-4 text-gray-400">
              Enter the order number received after checkout.
            </p>
          </div>

          <form
            onSubmit={searchOrder}
            className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8"
          >
            <div className="flex flex-col gap-4 sm:flex-row">
              <input
                type="text"
                placeholder="Example: MUTHU-12345"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/40 px-5 py-4 text-white outline-none placeholder:text-gray-500 focus:border-pink-500"
              />

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-pink-600 px-7 py-4 font-black hover:bg-pink-700 disabled:opacity-60"
              >
                <FaSearch />
                {loading ? "Searching..." : "Track Order"}
              </button>
            </div>

            {error && (
              <p className="mt-5 rounded-xl bg-red-600/20 p-4 text-red-400">
                {error}
              </p>
            )}

            {order && (
              <section className="mt-7 rounded-2xl border border-pink-500/20 bg-black/30 p-6">
                <div className="flex flex-wrap items-start justify-between gap-5">
                  <div>
                    <p className="text-sm text-pink-500">Order Number</p>
                    <h2 className="mt-1 text-2xl font-black">
                      {order.orderNumber || order._id}
                    </h2>
                  </div>

                  <span className="rounded-full bg-green-500/15 px-4 py-2 font-black text-green-400">
                    {order.orderStatus}
                  </span>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <p>
                    <span className="text-gray-400">Customer:</span>{" "}
                    <strong>{order.customer?.name}</strong>
                  </p>

                  <p>
                    <span className="text-gray-400">Mobile:</span>{" "}
                    <strong>{order.customer?.mobile}</strong>
                  </p>

                  <p>
                    <span className="text-gray-400">Total:</span>{" "}
                    <strong className="text-yellow-400">
                      ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
                    </strong>
                  </p>

                  <p>
                    <span className="text-gray-400">Payment:</span>{" "}
                    <strong>{order.paymentStatus}</strong>
                  </p>
                </div>
              </section>
            )}

            {!order && !error && (
              <div className="mt-7 flex items-center justify-center gap-3 text-gray-500">
                <FaBox />
                Your order status will appear here.
              </div>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}
