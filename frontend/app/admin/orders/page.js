"use client";

import { useEffect, useState } from "react";
import {
  FaClipboardList,
  FaFilePdf,
  FaSave,
  FaTrash,
} from "react-icons/fa";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://muthu-crackers-backend.onrender.com";

const API_URL = `${BACKEND_URL}/api/orders`;

const orderStatusOptions = [
  "Pending",
  "Confirmed",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const paymentStatusOptions = [
  "Pending",
  "Paid",
  "Failed",
  "Refunded",
];

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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [editedOrders, setEditedOrders] = useState({});
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("muthuAdminToken");

      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load orders"
        );
      }

      const loadedOrders = data.orders || [];

      setOrders(loadedOrders);

      const initialEditedOrders = {};

      loadedOrders.forEach((order) => {
        initialEditedOrders[order._id] = {
          orderStatus:
            order.orderStatus || "Pending",
          paymentStatus:
            order.paymentStatus || "Pending",
        };
      });

      setEditedOrders(initialEditedOrders);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleStatusChange(id, field, value) {
    setEditedOrders((current) => ({
      ...current,
      [id]: {
        ...current[id],
        [field]: value,
      },
    }));
  }

  async function updateOrder(id) {
    try {
      setUpdatingId(id);
      setMessage("");
      setError("");

      const token =
        localStorage.getItem("muthuAdminToken");

      const statusData = editedOrders[id];

      const response = await fetch(
        `${API_URL}/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            orderStatus: statusData.orderStatus,
            paymentStatus:
              statusData.paymentStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to update order"
        );
      }

      setMessage(
        `Order ${
          data.order?.orderNumber || ""
        } updated successfully.`
      );

      await loadOrders();
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId("");
    }
  }

  async function deleteOrder(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmed) return;

    try {
      setMessage("");
      setError("");

      const token =
        localStorage.getItem("muthuAdminToken");

      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to delete order"
        );
      }

      setMessage(data.message);

      await loadOrders();
    } catch (err) {
      setError(err.message);
    }
  }

  function downloadInvoice(order) {
    const invoiceUrl =
      `${BACKEND_URL}/api/invoices/${order._id}`;

    window.open(
      invoiceUrl,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <main className="min-h-screen bg-[#080808] p-5 md:p-8">
      <div className="mb-8">
        <p className="font-bold uppercase tracking-[4px] text-pink-500">
          Admin Panel
        </p>

        <h1 className="mt-2 text-4xl font-black">
          Order Management
        </h1>

        <p className="mt-3 text-gray-400">
          Update order and payment statuses and download invoices.
        </p>
      </div>

      {message && (
        <p className="mb-6 rounded-xl bg-green-600/20 p-4 text-green-400">
          {message}
        </p>
      )}

      {error && (
        <p className="mb-6 rounded-xl bg-red-600/20 p-4 text-red-400">
          {error}
        </p>
      )}
      {loading ? (
        <div className="rounded-2xl bg-[#141414] p-12 text-center text-lg">
          Loading orders...
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-800 bg-[#141414]">
          <table className="min-w-full text-sm">
            <thead className="bg-[#1d1d1d] text-white">
              <tr>
                <th className="px-4 py-4 text-left">Order No</th>
                <th className="px-4 py-4 text-left">Customer</th>
                <th className="px-4 py-4 text-left">Phone</th>
                <th className="px-4 py-4 text-left">Amount</th>
                <th className="px-4 py-4 text-left">Order Status</th>
                <th className="px-4 py-4 text-left">Payment</th>
                <th className="px-4 py-4 text-left">Date</th>
                <th className="px-4 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-10 text-center text-gray-400"
                  >
                    No Orders Found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-t border-gray-800 hover:bg-[#1d1d1d]"
                  >
                    <td className="px-4 py-4 font-bold">
                      {order.orderNumber ||
                        order.invoiceNumber ||
                        order.estimateNumber ||
                        order._id.slice(-6)}
                    </td>

                    <td className="px-4 py-4">
                      <div className="font-semibold">
                        {order.customer?.name ||
                          order.customerName ||
                          "Customer"}
                      </div>

                      <div className="text-xs text-gray-400">
                        {order.customer?.email ||
                          order.email ||
                          ""}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      {order.customer?.mobile ||
                        order.phone ||
                        order.mobile ||
                        "-"}
                    </td>

                    <td className="px-4 py-4 font-bold text-green-400">
                      {formatCurrency(
                        order.totalAmount ??
                          order.grandTotal ??
                          order.cartTotal ??
                          0
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <select
                        value={
                          editedOrders[order._id]?.orderStatus ||
                          "Pending"
                        }
                        onChange={(e) =>
                          handleStatusChange(
                            order._id,
                            "orderStatus",
                            e.target.value
                          )
                        }
                        className="rounded-lg border border-gray-700 bg-black px-3 py-2"
                      >
                        {orderStatusOptions.map((status) => (
                          <option
                            key={status}
                            value={status}
                          >
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-4 py-4">
                      <select
                        value={
                          editedOrders[order._id]
                            ?.paymentStatus || "Pending"
                        }
                        onChange={(e) =>
                          handleStatusChange(
                            order._id,
                            "paymentStatus",
                            e.target.value
                          )
                        }
                        className="rounded-lg border border-gray-700 bg-black px-3 py-2"
                      >
                        {paymentStatusOptions.map((status) => (
                          <option
                            key={status}
                            value={status}
                          >
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-4 py-4">
                      {formatDate(order.createdAt)}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() =>
                            updateOrder(order._id)
                          }
                          disabled={
                            updatingId === order._id
                          }
                          className="flex items-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-white hover:bg-green-700"
                        >
                          <FaSave />
                          Update
                        </button>

                        <button
                          onClick={() =>
                            downloadInvoice(order)
                          }
                          className="flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-white hover:bg-red-700"
                        >
                          <FaFilePdf />
                          PDF
                        </button>

                        <button
                          onClick={() =>
                            deleteOrder(order._id)
                          }
                          className="flex items-center gap-2 rounded-lg bg-gray-700 px-3 py-2 text-white hover:bg-gray-800"
                        >
                          <FaTrash />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
