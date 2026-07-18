"use client";

import { useEffect, useState } from "react";
import {
  FaClipboardList,
  FaSave,
  FaTrash,
} from "react-icons/fa";

const API_URL = "http://localhost:5000/api/orders";

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
          orderStatus: order.orderStatus || "Pending",
          paymentStatus: order.paymentStatus || "Pending",
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

      const token = localStorage.getItem("muthuAdminToken");
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
            paymentStatus: statusData.paymentStatus,
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
        `Order ${data.order?.orderNumber || ""} updated successfully.`
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

      const token = localStorage.getItem("muthuAdminToken");

      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
          Update order and payment statuses.
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
        <p className="text-gray-400">
          Loading orders...
        </p>
      ) : orders.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
          <FaClipboardList className="mx-auto text-6xl text-gray-600" />

          <h2 className="mt-5 text-2xl font-black">
            No Orders Found
          </h2>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
          <div className="overflow-x-auto">
            <table className="min-w-[1300px] w-full">
              <thead className="bg-pink-600 text-left text-white">
                <tr>
                  <th className="px-5 py-4">
                    Order
                  </th>

                  <th className="px-5 py-4">
                    Customer
                  </th>

                  <th className="px-5 py-4">
                    Mobile
                  </th>

                  <th className="px-5 py-4">
                    Amount
                  </th>

                  <th className="px-5 py-4">
                    Payment Method
                  </th>

                  <th className="px-5 py-4">
                    Payment Status
                  </th>

                  <th className="px-5 py-4">
                    Order Status
                  </th>

                  <th className="px-5 py-4">
                    Date
                  </th>

                  <th className="px-5 py-4">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => {
                  const edited =
                    editedOrders[order._id] || {
                      orderStatus:
                        order.orderStatus || "Pending",
                      paymentStatus:
                        order.paymentStatus || "Pending",
                    };

                  return (
                    <tr
                      key={order._id}
                      className="border-t border-white/10"
                    >
                      <td className="px-5 py-4 font-black">
  <button
    type="button"
    onClick={() =>
      window.location.href = `/admin/orders/${order._id}`
    }
    className="text-pink-400 hover:text-pink-300 hover:underline font-bold"
  >
    {order.orderNumber || order._id.slice(-8)}
  </button>
</td>

                      <td className="px-5 py-4">
                        {order.customer?.name ||
                          "Customer"}
                      </td>

                      <td className="px-5 py-4">
                        {order.customer?.mobile || "-"}
                      </td>

                      <td className="px-5 py-4 font-black text-yellow-400">
                        {formatCurrency(
                          order.totalAmount
                        )}
                      </td>

                      <td className="px-5 py-4">
                        {order.paymentMethod}
                      </td>

                      <td className="px-5 py-4">
                        <select
                          value={edited.paymentStatus}
                          onChange={(event) =>
                            handleStatusChange(
                              order._id,
                              "paymentStatus",
                              event.target.value
                            )
                          }
                          className="w-full rounded-lg border border-white/10 bg-[#151515] px-3 py-2 text-white outline-none focus:border-pink-500"
                        >
                          {paymentStatusOptions.map(
                            (status) => (
                              <option
                                key={status}
                                value={status}
                              >
                                {status}
                              </option>
                            )
                          )}
                        </select>
                      </td>

                      <td className="px-5 py-4">
                        <select
                          value={edited.orderStatus}
                          onChange={(event) =>
                            handleStatusChange(
                              order._id,
                              "orderStatus",
                              event.target.value
                            )
                          }
                          className="w-full rounded-lg border border-white/10 bg-[#151515] px-3 py-2 text-white outline-none focus:border-pink-500"
                        >
                          {orderStatusOptions.map(
                            (status) => (
                              <option
                                key={status}
                                value={status}
                              >
                                {status}
                              </option>
                            )
                          )}
                        </select>
                      </td>

                      <td className="px-5 py-4 text-gray-400">
                        {formatDate(order.createdAt)}
                      </td>
<td className="px-5 py-4">
  <div className="flex gap-2">

    <button
      type="button"
      onClick={() => updateOrder(order._id)}
      disabled={updatingId === order._id}
      className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-bold hover:bg-green-700 disabled:opacity-60"
    >
      <FaSave />
      {updatingId === order._id ? "Saving..." : "Update"}
    </button>

    <button
      type="button"
      onClick={() =>
        window.location.href = `/admin/orders/${order._id}`
      }
      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-bold hover:bg-blue-700"
    >
      View
    </button>

    <button
      type="button"
      onClick={() => deleteOrder(order._id)}
      className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-bold hover:bg-red-700"
    >
      <FaTrash />
      Delete
    </button>

  </div>
</td> 
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}