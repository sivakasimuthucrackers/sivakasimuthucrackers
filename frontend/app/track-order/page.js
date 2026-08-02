"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  FaArrowLeft,
  FaBox,
  FaCheckCircle,
  FaClock,
  FaTruck,
} from "react-icons/fa";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://muthu-crackers-backend.onrender.com";

function StatusIcon({ status }) {
  if (status === "Delivered") {
    return <FaCheckCircle className="text-green-500" />;
  }

  if (status === "Shipped") {
    return <FaTruck className="text-blue-400" />;
  }

  if (status === "Confirmed") {
    return <FaBox className="text-pink-500" />;
  }

  return <FaClock className="text-yellow-400" />;
}

function Detail({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/30 p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 break-words font-black text-white">{value}</p>
    </div>
  );
}

export default function TrackOrderPage() {
  const searchParams = useSearchParams();
  const initialOrder = searchParams.get("order") || "";

  const [identifier, setIdentifier] = useState(initialOrder);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(Boolean(initialOrder));
  const [error, setError] = useState("");

  async function findOrder(orderIdentifier = identifier) {
    const value = String(orderIdentifier || "").trim();

    if (!value) {
      setError("Please enter your order number.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setOrder(null);

      const response = await fetch(
        `${API_URL}/api/orders/track/${encodeURIComponent(value)}`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Order not found.");
      }

      setOrder(data.order);
    } catch (err) {
      setError(err.message || "Unable to track the order.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (initialOrder) {
      findOrder(initialOrder);
    }
  }, [initialOrder]);

  function handleSubmit(event) {
    event.preventDefault();
    findOrder();
  }

  return (
    <main className="min-h-screen bg-[#080808] px-4 py-10 text-white md:py-16">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-pink-500"
        >
          <FaArrowLeft />
          Back to Home
        </Link>

        <div className="mt-7 text-center">
          <p className="text-xs font-bold uppercase tracking-[4px] text-pink-500">
            Order Tracking
          </p>

          <h1 className="mt-2 text-3xl font-black md:text-5xl">
            Track Your Order
          </h1>

          <p className="mt-3 text-sm text-gray-400 md:text-base">
            Enter the order number received after checkout.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-7 flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-3"
        >
          <input
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            placeholder="Example: MC202608027433"
            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-pink-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-pink-600 px-5 py-3 text-sm font-black disabled:opacity-60"
          >
            {loading ? "Checking..." : "Track"}
          </button>
        </form>

        {error && (
          <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center text-sm text-red-300">
            {error}
          </div>
        )}

        {order && (
          <section className="mt-6 rounded-3xl border border-pink-500/20 bg-white/5 p-5 shadow-2xl md:p-7">
            <div className="flex items-center gap-3">
              <div className="text-3xl">
                <StatusIcon status={order.orderStatus} />
              </div>

              <div>
                <p className="text-xs uppercase tracking-[2px] text-gray-400">
                  Current Status
                </p>

                <h2 className="text-2xl font-black text-pink-500">
                  {order.orderStatus}
                </h2>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Detail label="Order Number" value={order.orderNumber} />

              <Detail
                label="Customer"
                value={order.customer?.name || "Customer"}
              />

              <Detail
                label="Total Amount"
                value={`₹${Number(order.totalAmount || 0).toLocaleString(
                  "en-IN"
                )}`}
              />

              <Detail
                label="Payment Method"
                value={order.paymentMethod || "-"}
              />

              <Detail
                label="Payment Status"
                value={order.paymentStatus || "Pending"}
              />

              <Detail
                label="Order Date"
                value={
                  order.createdAt
                    ? new Date(order.createdAt).toLocaleString("en-IN")
                    : "-"
                }
              />
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
