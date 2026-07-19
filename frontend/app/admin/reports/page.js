"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaDownload,
  FaFileCsv,
  FaFileInvoiceDollar,
  FaPrint,
  FaSearch,
  FaShoppingBag,
  FaUsers,
} from "react-icons/fa";

const API_URL = "https://muthu-crackers-backend.onrender.com";

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function formatDate(value) {
  if (!value) return "Not available";

  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function downloadCsv(filename, rows) {
  if (!rows.length) {
    window.alert("No data available to export.");
    return;
  }

  const headers = Object.keys(rows[0]);

  const escapeCell = (value) => {
    const text = String(value ?? "").replaceAll('"', '""');
    return `"${text}"`;
  };

  const csv = [
    headers.map(escapeCell).join(","),
    ...rows.map((row) =>
      headers.map((header) => escapeCell(row[header])).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}

export default function AdminReportsPage() {
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadReports() {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("muthuAdminToken");

        if (!token) {
          router.push("/admin/login");
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [
          ordersResponse,
          customersResponse,
          productsResponse,
        ] = await Promise.all([
          fetch(`${API_URL}/api/orders`, { headers }),
          fetch(`${API_URL}/api/orders/customers`, { headers }),
          fetch(`${API_URL}/api/products?page=1&limit=500`),
        ]);

        const [
          ordersData,
          customersData,
          productsData,
        ] = await Promise.all([
          ordersResponse.json(),
          customersResponse.json(),
          productsResponse.json(),
        ]);

        if (!ordersResponse.ok) {
          throw new Error(
            ordersData.message || "Unable to load orders"
          );
        }

        if (!customersResponse.ok) {
          throw new Error(
            customersData.message || "Unable to load customers"
          );
        }

        if (!productsResponse.ok) {
          throw new Error(
            productsData.message || "Unable to load products"
          );
        }

        setOrders(ordersData.orders || []);
        setCustomers(customersData.customers || []);
        setProducts(productsData.products || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadReports();
  }, [router]);

  const filteredOrders = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt);

      const afterStart =
        !dateFrom ||
        orderDate >= new Date(`${dateFrom}T00:00:00`);

      const beforeEnd =
        !dateTo ||
        orderDate <= new Date(`${dateTo}T23:59:59`);

      const searchableText = [
        order.orderNumber,
        order.customer?.name,
        order.customer?.mobile,
        order.orderStatus,
        order.paymentStatus,
        order.paymentMethod,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        searchableText.includes(normalizedSearch);

      return afterStart && beforeEnd && matchesSearch;
    });
  }, [orders, search, dateFrom, dateTo]);

  const reportSummary = useMemo(() => {
    const validOrders = filteredOrders.filter(
      (order) => order.orderStatus !== "Cancelled"
    );

    const revenue = validOrders.reduce(
      (total, order) =>
        total + Number(order.totalAmount || 0),
      0
    );

    const paidRevenue = validOrders
      .filter((order) => order.paymentStatus === "Paid")
      .reduce(
        (total, order) =>
          total + Number(order.totalAmount || 0),
        0
      );

    const pendingPayments = validOrders
      .filter((order) => order.paymentStatus === "Pending")
      .reduce(
        (total, order) =>
          total + Number(order.totalAmount || 0),
        0
      );

    return {
      totalOrders: filteredOrders.length,
      revenue,
      paidRevenue,
      pendingPayments,
    };
  }, [filteredOrders]);

  const productSales = useMemo(() => {
    const map = new Map();

    filteredOrders
      .filter((order) => order.orderStatus !== "Cancelled")
      .forEach((order) => {
        (order.items || []).forEach((item) => {
          const current = map.get(item.name) || {
            name: item.name,
            quantity: 0,
            revenue: 0,
          };

          current.quantity += Number(item.quantity || 0);
          current.revenue += Number(item.subtotal || 0);

          map.set(item.name, current);
        });
      });

    return Array.from(map.values()).sort(
      (first, second) =>
        second.quantity - first.quantity
    );
  }, [filteredOrders]);

  const gstReport = useMemo(() => {
    return filteredOrders
      .filter((order) => order.customer?.gstNumber)
      .map((order) => ({
        orderNumber: order.orderNumber || order._id,
        customer: order.customer?.name || "",
        customerGST: order.customer?.gstNumber || "",
        amount: Number(order.totalAmount || 0),
        date: formatDate(order.createdAt),
        paymentStatus: order.paymentStatus,
      }));
  }, [filteredOrders]);

  function exportSales() {
    downloadCsv(
      "sales-report.csv",
      filteredOrders.map((order) => ({
        orderNumber: order.orderNumber || order._id,
        date: formatDate(order.createdAt),
        customer: order.customer?.name || "",
        mobile: order.customer?.mobile || "",
        amount: Number(order.totalAmount || 0),
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        paymentMethod:
          order.paymentMethod || "WhatsApp Confirmation",
      }))
    );
  }

  function exportCustomers() {
    downloadCsv(
      "customer-report.csv",
      customers.map((customer) => ({
        name: customer.name || "",
        mobile: customer.mobile || "",
        email: customer.email || "",
        city: customer.city || "",
        district: customer.district || "",
        state: customer.state || "",
        totalOrders: customer.totalOrders || 0,
        totalSpent: Number(customer.totalSpent || 0),
        lastOrderDate: formatDate(customer.lastOrderDate),
        gstNumber: customer.gstNumber || "",
      }))
    );
  }

  function exportProducts() {
    downloadCsv(
      "product-report.csv",
      products.map((product) => ({
        productCode: product.productCode || "",
        name: product.name || "",
        category: product.category || "",
        mrp: Number(product.mrp || 0),
        offerPrice: Number(product.offerPrice || 0),
        discount: Number(product.discount || 0),
        stockQuantity: Number(product.stockQuantity || 0),
        unit: product.unit || "",
        status: product.isActive ? "Active" : "Inactive",
      }))
    );
  }

  function exportGst() {
    downloadCsv("gst-report.csv", gstReport);
  }

  function printReport() {
    window.print();
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-gray-400">
          Loading reports...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080808] p-5 md:p-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="font-bold uppercase tracking-[4px] text-pink-500">
            Admin Panel
          </p>

          <h1 className="mt-2 text-4xl font-black">
            Reports
          </h1>

          <p className="mt-3 text-gray-400">
            Sales, customer, product and GST reports.
          </p>
        </div>

        <button
          type="button"
          onClick={printReport}
          className="flex items-center gap-2 rounded-xl border border-pink-500 px-6 py-3 font-black text-pink-500 hover:bg-pink-500 hover:text-white print:hidden"
        >
          <FaPrint />
          Print / Save PDF
        </button>
      </div>

      {error && (
        <p className="mb-6 rounded-xl bg-red-600/20 p-4 text-red-400">
          {error}
        </p>
      )}

      <section className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl bg-gradient-to-br from-pink-600 to-pink-950 p-6">
          <FaShoppingBag className="text-3xl" />

          <p className="mt-4 text-sm text-white/75">
            Orders
          </p>

          <p className="mt-2 text-3xl font-black">
            {reportSummary.totalOrders}
          </p>
        </div>

        <div className="rounded-3xl bg-gradient-to-br from-purple-600 to-purple-950 p-6">
          <FaFileInvoiceDollar className="text-3xl" />

          <p className="mt-4 text-sm text-white/75">
            Total Revenue
          </p>

          <p className="mt-2 text-3xl font-black">
            {formatCurrency(reportSummary.revenue)}
          </p>
        </div>

        <div className="rounded-3xl bg-gradient-to-br from-green-600 to-emerald-950 p-6">
          <span className="text-3xl">₹</span>

          <p className="mt-4 text-sm text-white/75">
            Paid Revenue
          </p>

          <p className="mt-2 text-3xl font-black">
            {formatCurrency(reportSummary.paidRevenue)}
          </p>
        </div>

        <div className="rounded-3xl bg-gradient-to-br from-orange-500 to-red-900 p-6">
          <span className="text-3xl">⏳</span>

          <p className="mt-4 text-sm text-white/75">
            Pending Payment
          </p>

          <p className="mt-2 text-3xl font-black">
            {formatCurrency(
              reportSummary.pendingPayments
            )}
          </p>
        </div>
      </section>

      <section className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-5 print:hidden">
        <div className="grid gap-4 lg:grid-cols-[1fr_220px_220px]">
          <label className="relative">
            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" />

            <input
              type="search"
              placeholder="Search order, customer, mobile or status..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              className="w-full rounded-xl border border-white/10 bg-black/40 py-4 pl-12 pr-5 outline-none focus:border-pink-500"
            />
          </label>

          <input
            type="date"
            value={dateFrom}
            onChange={(event) =>
              setDateFrom(event.target.value)
            }
            className="rounded-xl border border-white/10 bg-[#151515] px-4 py-4 outline-none focus:border-pink-500"
          />

          <input
            type="date"
            value={dateTo}
            onChange={(event) =>
              setDateTo(event.target.value)
            }
            className="rounded-xl border border-white/10 bg-[#151515] px-4 py-4 outline-none focus:border-pink-500"
          />
        </div>
      </section>

      <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4 print:hidden">
        <button
          type="button"
          onClick={exportSales}
          className="flex items-center justify-center gap-3 rounded-2xl bg-pink-600 px-5 py-4 font-black hover:bg-pink-700"
        >
          <FaFileCsv />
          Sales CSV
        </button>

        <button
          type="button"
          onClick={exportCustomers}
          className="flex items-center justify-center gap-3 rounded-2xl bg-purple-600 px-5 py-4 font-black hover:bg-purple-700"
        >
          <FaUsers />
          Customer CSV
        </button>

        <button
          type="button"
          onClick={exportProducts}
          className="flex items-center justify-center gap-3 rounded-2xl bg-blue-600 px-5 py-4 font-black hover:bg-blue-700"
        >
          <FaDownload />
          Product CSV
        </button>

        <button
          type="button"
          onClick={exportGst}
          className="flex items-center justify-center gap-3 rounded-2xl bg-green-600 px-5 py-4 font-black hover:bg-green-700"
        >
          <FaFileInvoiceDollar />
          GST CSV
        </button>
      </section>

      <section className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
        <div className="border-b border-white/10 p-6">
          <h2 className="text-2xl font-black">
            Sales Report
          </h2>

          <p className="mt-2 text-gray-400">
            Showing {filteredOrders.length} orders
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-black/40 text-left text-sm text-gray-400">
              <tr>
                <th className="px-5 py-4">Order</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Order Status</th>
                <th className="px-5 py-4">Payment</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order) => (
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
                    {order.customer?.name || "Customer"}
                  </td>

                  <td className="px-5 py-4 font-black text-yellow-400">
                    {formatCurrency(order.totalAmount)}
                  </td>

                  <td className="px-5 py-4">
                    {order.orderStatus}
                  </td>

                  <td className="px-5 py-4">
                    {order.paymentStatus}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-black">
            Best-Selling Products
          </h2>

          <div className="mt-5 space-y-3">
            {productSales.slice(0, 10).map((product) => (
              <div
                key={product.name}
                className="flex items-center justify-between gap-4 rounded-2xl bg-black/30 p-4"
              >
                <div>
                  <p className="font-black">
                    {product.name}
                  </p>

                  <p className="mt-1 text-sm text-gray-400">
                    Quantity: {product.quantity}
                  </p>
                </div>

                <p className="font-black text-yellow-400">
                  {formatCurrency(product.revenue)}
                </p>
              </div>
            ))}

            {productSales.length === 0 && (
              <p className="py-6 text-center text-gray-500">
                No product sales available.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-black">
            GST Customer Orders
          </h2>

          <div className="mt-5 space-y-3">
            {gstReport.slice(0, 10).map((item) => (
              <div
                key={item.orderNumber}
                className="rounded-2xl bg-black/30 p-4"
              >
                <div className="flex justify-between gap-4">
                  <div>
                    <p className="font-black">
                      {item.customer}
                    </p>

                    <p className="mt-1 text-sm text-gray-400">
                      {item.customerGST}
                    </p>
                  </div>

                  <p className="font-black text-yellow-400">
                    {formatCurrency(item.amount)}
                  </p>
                </div>
              </div>
            ))}

            {gstReport.length === 0 && (
              <p className="py-6 text-center text-gray-500">
                No customer GST orders available.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
