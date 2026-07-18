"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaChevronDown,
  FaChevronUp,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaSearch,
  FaShoppingBag,
  FaUserFriends,
} from "react-icons/fa";

const API_URL = "http://localhost:5000";

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function formatDate(value) {
  if (!value) return "Not available";

  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AdminCustomersPage() {
  const router = useRouter();

  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [expandedCustomer, setExpandedCustomer] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCustomers() {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("muthuAdminToken");

        if (!token) {
          router.push("/admin/login");
          return;
        }

        const response = await fetch(
          `${API_URL}/api/orders/customers`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load customers"
          );
        }

        setCustomers(data.customers || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadCustomers();
  }, [router]);

  const filteredCustomers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return customers;
    }

    return customers.filter((customer) => {
      const searchableText = [
        customer.name,
        customer.mobile,
        customer.email,
        customer.city,
        customer.district,
        customer.state,
        customer.gstNumber,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedSearch);
    });
  }, [customers, search]);

  const totalCustomerRevenue = useMemo(() => {
    return customers.reduce(
      (total, customer) =>
        total + Number(customer.totalSpent || 0),
      0
    );
  }, [customers]);

  return (
    <main className="min-h-screen bg-[#080808] p-5 md:p-8">
      <div className="mb-8">
        <p className="font-bold uppercase tracking-[4px] text-pink-500">
          Admin Panel
        </p>

        <h1 className="mt-2 text-4xl font-black">
          Customer Management
        </h1>

        <p className="mt-3 text-gray-400">
          View customer details, total spending and purchase history.
        </p>
      </div>

      <section className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-3xl bg-gradient-to-br from-pink-600 to-pink-950 p-6">
          <FaUserFriends className="text-3xl" />

          <p className="mt-4 text-sm text-white/75">
            Total Customers
          </p>

          <p className="mt-2 text-3xl font-black">
            {customers.length}
          </p>
        </div>

        <div className="rounded-3xl bg-gradient-to-br from-purple-600 to-purple-950 p-6">
          <FaShoppingBag className="text-3xl" />

          <p className="mt-4 text-sm text-white/75">
            Customer Orders
          </p>

          <p className="mt-2 text-3xl font-black">
            {customers.reduce(
              (total, customer) =>
                total + Number(customer.totalOrders || 0),
              0
            )}
          </p>
        </div>

        <div className="rounded-3xl bg-gradient-to-br from-green-600 to-emerald-950 p-6">
          <span className="text-3xl">₹</span>

          <p className="mt-4 text-sm text-white/75">
            Customer Revenue
          </p>

          <p className="mt-2 text-3xl font-black">
            {formatCurrency(totalCustomerRevenue)}
          </p>
        </div>
      </section>

      <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-5">
        <label className="relative block">
          <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" />

          <input
            type="search"
            placeholder="Search customer, mobile, email or location..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/40 py-4 pl-12 pr-5 outline-none focus:border-pink-500"
          />
        </label>
      </div>

      {error && (
        <p className="mb-5 rounded-xl bg-red-600/20 p-4 text-red-400">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-gray-400">Loading customers...</p>
      ) : filteredCustomers.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
          <FaUserFriends className="mx-auto text-6xl text-gray-600" />

          <h2 className="mt-5 text-2xl font-black">
            No customers available
          </h2>

          <p className="mt-3 text-gray-400">
            Customers will appear after orders are created.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredCustomers.map((customer) => {
            const isExpanded =
              expandedCustomer === customer.customerId;

            return (
              <article
                key={customer.customerId}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg"
              >
                <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
                  <div>
                    <h2 className="text-2xl font-black">
                      {customer.name || "Customer"}
                    </h2>

                    <div className="mt-4 grid gap-3 text-gray-400 sm:grid-cols-2">
                      <p className="flex items-center gap-3">
                        <FaPhoneAlt className="text-pink-500" />
                        {customer.mobile}
                      </p>

                      <p className="flex items-center gap-3">
                        <FaEnvelope className="text-pink-500" />
                        {customer.email || "Email not provided"}
                      </p>

                      <p className="flex items-start gap-3 sm:col-span-2">
                        <FaMapMarkerAlt className="mt-1 text-pink-500" />

                        <span>
                          {customer.address || "Address not provided"}
                          <br />
                          {customer.city}, {customer.district},{" "}
                          {customer.state} - {customer.pincode}
                        </span>
                      </p>
                    </div>

                    {customer.gstNumber && (
                      <p className="mt-4 text-sm text-gray-400">
                        Customer GST:{" "}
                        <span className="font-bold text-white">
                          {customer.gstNumber}
                        </span>
                      </p>
                    )}
                  </div>

                  <div className="grid min-w-[230px] gap-3 sm:grid-cols-3 lg:grid-cols-1">
                    <div className="rounded-2xl bg-black/30 p-4">
                      <p className="text-sm text-gray-400">
                        Total Orders
                      </p>

                      <p className="mt-2 text-2xl font-black text-pink-500">
                        {customer.totalOrders}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-black/30 p-4">
                      <p className="text-sm text-gray-400">
                        Total Spent
                      </p>

                      <p className="mt-2 text-2xl font-black text-yellow-400">
                        {formatCurrency(customer.totalSpent)}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-black/30 p-4">
                      <p className="text-sm text-gray-400">
                        Last Order
                      </p>

                      <p className="mt-2 text-sm font-bold">
                        {formatDate(customer.lastOrderDate)}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setExpandedCustomer(
                      isExpanded ? null : customer.customerId
                    )
                  }
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-pink-500 px-5 py-3 font-black text-pink-500 transition hover:bg-pink-500 hover:text-white"
                >
                  {isExpanded ? (
                    <>
                      <FaChevronUp />
                      Hide Purchase History
                    </>
                  ) : (
                    <>
                      <FaChevronDown />
                      View Purchase History
                    </>
                  )}
                </button>

                {isExpanded && (
                  <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
                    <table className="min-w-full">
                      <thead className="bg-black/40 text-left text-sm text-gray-400">
                        <tr>
                          <th className="px-5 py-4">Order</th>
                          <th className="px-5 py-4">Date</th>
                          <th className="px-5 py-4">Items</th>
                          <th className="px-5 py-4">Amount</th>
                          <th className="px-5 py-4">Order Status</th>
                          <th className="px-5 py-4">Payment</th>
                        </tr>
                      </thead>

                      <tbody>
                        {(customer.orders || []).map((order) => (
                          <tr
                            key={order._id}
                            className="border-t border-white/10"
                          >
                            <td className="px-5 py-4 font-bold">
                              {order.orderNumber || order._id}
                            </td>

                            <td className="px-5 py-4 text-gray-400">
                              {formatDate(order.createdAt)}
                            </td>

                            <td className="px-5 py-4">
                              {(order.items || []).reduce(
                                (total, item) =>
                                  total +
                                  Number(item.quantity || 0),
                                0
                              )}
                            </td>

                            <td className="px-5 py-4 font-black text-yellow-400">
                              {formatCurrency(order.totalAmount)}
                            </td>

                            <td className="px-5 py-4">
                              <span className="rounded-full bg-pink-600/20 px-3 py-1 text-sm text-pink-400">
                                {order.orderStatus}
                              </span>
                            </td>

                            <td className="px-5 py-4">
                              <span className="rounded-full bg-green-600/20 px-3 py-1 text-sm text-green-400">
                                {order.paymentStatus}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
