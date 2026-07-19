"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  FaArrowLeft,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaPrint,
  FaWhatsapp,
} from "react-icons/fa";

const API_URL = "https://muthu-crackers-backend.onrender.com";

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function formatDate(value) {
  if (!value) return "-";

  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminOrderDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrder() {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("muthuAdminToken");

        if (!token) {
          router.push("/admin/login");
          return;
        }

        const response = await fetch(
          `${API_URL}/api/orders/${params.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load order"
          );
        }

        setOrder(data.order);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      loadOrder();
    }
  }, [params.id, router]);

  function openWhatsApp() {
    if (!order) return;

    const message = `
Hello ${order.customer?.name || "Customer"},

Your Sivakasi Muthu Crackers order details:

Order Number: ${order.orderNumber || order._id}
Total Amount: ${formatCurrency(order.totalAmount)}
Payment Status: ${order.paymentStatus}
Order Status: ${order.orderStatus}

Thank you.
    `.trim();

    window.open(
      `https://wa.me/91${order.customer?.mobile}?text=${encodeURIComponent(
        message
      )}`,
      "_blank"
    );
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080808]">
        <p className="text-gray-400">
          Loading order details...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#080808] p-8">
        <div className="rounded-2xl bg-red-600/20 p-5 text-red-400">
          {error}
        </div>

        <Link
          href="/admin/orders"
          className="mt-6 inline-flex items-center gap-2 text-pink-500"
        >
          <FaArrowLeft />
          Back to Orders
        </Link>
      </main>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#080808] p-5 md:p-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 font-bold text-pink-500"
        >
          <FaArrowLeft />
          Back to Orders
        </Link>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={openWhatsApp}
            className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-black hover:bg-green-700"
          >
            <FaWhatsapp />
            WhatsApp
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-xl bg-pink-600 px-5 py-3 font-black hover:bg-pink-700"
          >
            <FaPrint />
            Print
          </button>
        </div>
      </div>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-5 border-b border-white/10 pb-6">
          <div>
            <p className="font-bold uppercase tracking-[4px] text-pink-500">
              Order Details
            </p>

            <h1 className="mt-2 text-3xl font-black md:text-4xl">
              {order.orderNumber || order._id}
            </h1>

            <p className="mt-2 text-gray-400">
              Created: {formatDate(order.createdAt)}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <span className="rounded-full bg-yellow-500/15 px-4 py-2 font-black text-yellow-400">
              Payment: {order.paymentStatus}
            </span>

            <span className="rounded-full bg-green-500/15 px-4 py-2 font-black text-green-400">
              Order: {order.orderStatus}
            </span>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <section className="rounded-2xl border border-white/10 bg-black/30 p-6">
            <h2 className="text-2xl font-black">
              Customer Details
            </h2>

            <div className="mt-5 space-y-4 text-gray-300">
              <p>
                <strong>Name:</strong>{" "}
                {order.customer?.name || "-"}
              </p>

              <p className="flex items-center gap-3">
                <FaPhoneAlt className="text-pink-500" />
                {order.customer?.mobile || "-"}
              </p>

              <p className="flex items-center gap-3">
                <FaEnvelope className="text-pink-500" />
                {order.customer?.email || "Not provided"}
              </p>

              <p>
                <strong>GST Number:</strong>{" "}
                {order.customer?.gstNumber ||
                  "Not provided"}
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-black/30 p-6">
            <h2 className="text-2xl font-black">
              Delivery Address
            </h2>

            <div className="mt-5 flex items-start gap-3 text-gray-300">
              <FaMapMarkerAlt className="mt-1 shrink-0 text-pink-500" />

              <p className="leading-7">
                {order.customer?.address}
                <br />
                {order.customer?.city},{" "}
                {order.customer?.district}
                <br />
                {order.customer?.state} -{" "}
                {order.customer?.pincode}
              </p>
            </div>
          </section>
        </div>

        <section className="mt-8 overflow-hidden rounded-2xl border border-white/10">
          <div className="border-b border-white/10 bg-black/30 p-5">
            <h2 className="text-2xl font-black">
              Ordered Products
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-black/40 text-left text-sm text-gray-400">
                <tr>
                  <th className="px-5 py-4">
                    Product
                  </th>

                  <th className="px-5 py-4">
                    Unit Price
                  </th>

                  <th className="px-5 py-4">
                    Quantity
                  </th>

                  <th className="px-5 py-4">
                    Subtotal
                  </th>
                </tr>
              </thead>

              <tbody>
                {(order.items || []).map(
                  (item, index) => (
                    <tr
                      key={`${item.productId}-${index}`}
                      className="border-t border-white/10"
                    >
                      <td className="px-5 py-4 font-bold">
                        {item.name}
                      </td>

                      <td className="px-5 py-4">
                        {formatCurrency(
                          item.offerPrice
                        )}
                      </td>

                      <td className="px-5 py-4">
                        {item.quantity}
                      </td>

                      <td className="px-5 py-4 font-black text-yellow-400">
                        {formatCurrency(
                          item.subtotal
                        )}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_350px]">
          <section className="rounded-2xl border border-white/10 bg-black/30 p-6">
            <h2 className="text-xl font-black">
              Order Information
            </h2>

            <div className="mt-5 space-y-3 text-gray-300">
              <p>
                <strong>Payment Method:</strong>{" "}
                {order.paymentMethod}
              </p>

              <p>
                <strong>Customer Notes:</strong>{" "}
                {order.notes || "No notes"}
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-pink-500/20 bg-pink-500/10 p-6">
            <p className="text-gray-300">
              Products Total
            </p>

            <p className="mt-2 text-4xl font-black text-yellow-400">
              {formatCurrency(order.totalAmount)}
            </p>

            <p className="mt-4 text-sm leading-6 text-gray-400">
              Shipping charges are confirmed separately
              based on delivery location and transport
              availability.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
