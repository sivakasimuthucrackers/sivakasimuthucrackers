"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaBoxOpen,
  FaCalendarDay,
  FaCheckCircle,
  FaClipboardList,
  FaExclamationTriangle,
  FaMoneyBillWave,
  FaShoppingBag,
  FaTruck,
  FaUsers,
} from "react-icons/fa";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const API_URL = "http://localhost:5000";

const initialDashboard = {
  totalProducts: 0,
  totalOrders: 0,
  pendingOrders: 0,
  completedOrders: 0,
  todayOrders: 0,
  totalCustomers: 0,
  revenue: 0,
};

const PIE_COLORS = [
  "#ec4899",
  "#8b5cf6",
  "#f59e0b",
  "#06b6d4",
  "#22c55e",
  "#ef4444",
];

export default function AdminDashboardPage() {
  const router = useRouter();

  const [dashboard, setDashboard] = useState(initialDashboard);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [bestSelling, setBestSelling] = useState([]);
  const [orderSummary, setOrderSummary] = useState([]);
  const [salesReport, setSalesReport] = useState([]);

  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("muthuAdminToken");
        const savedAdmin = localStorage.getItem("muthuAdminDetails");

        if (!token) {
          router.push("/admin/login");
          return;
        }

        if (savedAdmin) {
          try {
            setAdmin(JSON.parse(savedAdmin));
          } catch {
            localStorage.removeItem("muthuAdminDetails");
          }
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [
          dashboardResponse,
          recentOrdersResponse,
          lowStockResponse,
          bestSellingResponse,
          orderSummaryResponse,
          salesReportResponse,
        ] = await Promise.all([
          fetch(`${API_URL}/api/admin/dashboard`, { headers }),
          fetch(`${API_URL}/api/admin/recent-orders`, { headers }),
          fetch(`${API_URL}/api/admin/low-stock?threshold=10`, {
            headers,
          }),
          fetch(`${API_URL}/api/admin/best-selling`, { headers }),
          fetch(`${API_URL}/api/admin/order-summary`, { headers }),
          fetch(`${API_URL}/api/admin/sales-report?days=7`, {
            headers,
          }),
        ]);

        const [
          dashboardData,
          recentOrdersData,
          lowStockData,
          bestSellingData,
          orderSummaryData,
          salesReportData,
        ] = await Promise.all([
          dashboardResponse.json(),
          recentOrdersResponse.json(),
          lowStockResponse.json(),
          bestSellingResponse.json(),
          orderSummaryResponse.json(),
          salesReportResponse.json(),
        ]);

        if (!dashboardResponse.ok) {
          throw new Error(
            dashboardData.message || "Unable to load dashboard"
          );
        }

        setDashboard({
          ...initialDashboard,
          ...(dashboardData.dashboard || {}),
        });

        setRecentOrders(recentOrdersData.orders || []);
        setLowStock(lowStockData.products || []);
        setBestSelling(bestSellingData.products || []);
        setSalesReport(salesReportData.report || []);

        const summaryObject = orderSummaryData.summary || {};

        setOrderSummary(
          Object.entries(summaryObject).map(([name, value]) => ({
            name,
            value,
          }))
        );
      } catch (err) {
        setError(err.message);

        if (
          err.message.toLowerCase().includes("token") ||
          err.message.toLowerCase().includes("authorized")
        ) {
          localStorage.removeItem("muthuAdminToken");
          localStorage.removeItem("muthuAdminDetails");
          router.push("/admin/login");
        }
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [router]);

  const cards = [
    {
      title: "Total Products",
      value: dashboard.totalProducts,
      icon: FaBoxOpen,
      className: "from-pink-600 to-pink-900",
    },
    {
      title: "Total Orders",
      value: dashboard.totalOrders,
      icon: FaClipboardList,
      className: "from-purple-600 to-purple-900",
    },
    {
      title: "Today's Orders",
      value: dashboard.todayOrders,
      icon: FaCalendarDay,
      className: "from-orange-500 to-red-800",
    },
    {
      title: "Customers",
      value: dashboard.totalCustomers,
      icon: FaUsers,
      className: "from-cyan-600 to-blue-900",
    },
    {
      title: "Pending Orders",
      value: dashboard.pendingOrders,
      icon: FaTruck,
      className: "from-yellow-500 to-orange-800",
    },
    {
      title: "Delivered Orders",
      value: dashboard.completedOrders,
      icon: FaCheckCircle,
      className: "from-green-600 to-emerald-900",
    },
    {
      title: "Total Revenue",
      value: `₹${Number(
        dashboard.revenue || 0
      ).toLocaleString("en-IN")}`,
      icon: FaMoneyBillWave,
      className: "from-rose-600 to-red-900",
    },
  ];

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-gray-400">
          Loading dashboard...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-5 md:p-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-5">
        <div>
          <p className="font-bold uppercase tracking-[4px] text-pink-500">
            Dashboard Overview
          </p>

          <h1 className="mt-2 text-3xl font-black md:text-4xl">
            Welcome, {admin?.name || "Admin"}
          </h1>

          <p className="mt-2 text-gray-400">
            Monitor products, orders, customers and sales.
          </p>
        </div>

        <Link
          href="/admin/orders"
          className="rounded-xl bg-pink-600 px-6 py-3 font-black hover:bg-pink-700"
        >
          View Orders
        </Link>
      </div>

      {error && (
        <div className="mb-6 rounded-xl bg-red-600/20 p-4 text-red-400">
          {error}
        </div>
      )}

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cards.map(({ title, value, icon: Icon, className }) => (
          <div
            key={title}
            className={`rounded-3xl bg-gradient-to-br ${className} p-6 shadow-xl transition hover:-translate-y-2`}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white/75">
                  {title}
                </p>

                <p className="mt-3 text-3xl font-black">
                  {value}
                </p>
              </div>

              <div className="rounded-full bg-black/20 p-4 text-2xl">
                <Icon />
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-black">
              Sales Overview
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Revenue and orders for the last 7 days
            </p>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesReport}>
                <defs>
                  <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#ec4899"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="#ec4899"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#ffffff15"
                />

                <XAxis
                  dataKey="date"
                  stroke="#9ca3af"
                  tickFormatter={(value) =>
                    value.slice(5)
                  }
                />

                <YAxis stroke="#9ca3af" />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111",
                    border: "1px solid #333",
                    borderRadius: "12px",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#ec4899"
                  fill="url(#revenueGradient)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="mb-5">
            <h2 className="text-2xl font-black">
              Order Summary
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Orders grouped by current status
            </p>
          </div>

          {orderSummary.every((item) => item.value === 0) ? (
            <div className="flex h-72 items-center justify-center text-gray-500">
              No order data available
            </div>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderSummary}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={4}
                  >
                    {orderSummary.map((item, index) => (
                      <Cell
                        key={item.name}
                        fill={
                          PIE_COLORS[
                            index % PIE_COLORS.length
                          ]
                        }
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111",
                      border: "1px solid #333",
                      borderRadius: "12px",
                    }}
                  />

                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-2">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
          <div className="flex items-center justify-between border-b border-white/10 p-6">
            <div>
              <h2 className="text-2xl font-black">
                Recent Orders
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                Latest customer orders
              </p>
            </div>

            <FaClipboardList className="text-2xl text-pink-500" />
          </div>

          {recentOrders.length === 0 ? (
            <p className="p-8 text-center text-gray-500">
              No orders available.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-black/40 text-left text-sm text-gray-400">
                  <tr>
                    <th className="px-5 py-4">Order</th>
                    <th className="px-5 py-4">Customer</th>
                    <th className="px-5 py-4">Amount</th>
                    <th className="px-5 py-4">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {recentOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-t border-white/10"
                    >
                      <td className="px-5 py-4 font-semibold">
                        {order.orderNumber ||
                          order._id.slice(-6)}
                      </td>

                      <td className="px-5 py-4">
                        {order.customer?.name ||
                          "Customer"}
                      </td>

                      <td className="px-5 py-4 text-yellow-400">
                        ₹{Number(
                          order.totalAmount || 0
                        ).toLocaleString("en-IN")}
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-pink-600/20 px-3 py-1 text-sm text-pink-400">
                          {order.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5">
          <div className="flex items-center justify-between border-b border-white/10 p-6">
            <div>
              <h2 className="text-2xl font-black">
                Best-Selling Products
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                Products with the highest ordered quantity
              </p>
            </div>

            <FaShoppingBag className="text-2xl text-pink-500" />
          </div>

          {bestSelling.length === 0 ? (
            <p className="p-8 text-center text-gray-500">
              No sales data available.
            </p>
          ) : (
            <div className="space-y-4 p-6">
              {bestSelling.slice(0, 6).map((product, index) => (
                <div
                  key={`${product.productId}-${index}`}
                  className="flex items-center justify-between gap-4 rounded-2xl bg-black/30 p-4"
                >
                  <div>
                    <p className="font-black">
                      {product.name}
                    </p>

                    <p className="mt-1 text-sm text-gray-400">
                      Orders: {product.orderCount}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-black text-yellow-400">
                      Qty {product.totalQuantity}
                    </p>

                    <p className="text-sm text-gray-400">
                      ₹{Number(
                        product.totalRevenue || 0
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-white/10 bg-white/5">
        <div className="flex items-center justify-between border-b border-white/10 p-6">
          <div>
            <h2 className="text-2xl font-black">
              Low-Stock Alerts
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Products with stock quantity of 10 or less
            </p>
          </div>

          <FaExclamationTriangle className="text-2xl text-yellow-400" />
        </div>

        {lowStock.length === 0 ? (
          <div className="p-8 text-center text-green-400">
            All products have sufficient stock.
          </div>
        ) : (
          <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">
            {lowStock.map((product) => (
              <div
                key={product._id}
                className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-5"
              >
                <p className="text-sm text-yellow-400">
                  {product.productCode}
                </p>

                <h3 className="mt-2 font-black">
                  {product.name}
                </h3>

                <p className="mt-2 text-sm text-gray-400">
                  {product.category}
                </p>

                <p className="mt-4 font-black text-red-400">
                  Stock: {product.stockQuantity}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-3">
        <Link
          href="/admin/products"
          className="rounded-3xl border border-pink-500/20 bg-white/5 p-6 transition hover:-translate-y-2 hover:border-pink-500"
        >
          <FaBoxOpen className="text-3xl text-pink-500" />
          <h3 className="mt-4 text-xl font-black">
            Manage Products
          </h3>
          <p className="mt-2 text-gray-400">
            Add, edit, delete and upload product images.
          </p>
        </Link>

        <Link
          href="/admin/orders"
          className="rounded-3xl border border-pink-500/20 bg-white/5 p-6 transition hover:-translate-y-2 hover:border-pink-500"
        >
          <FaClipboardList className="text-3xl text-pink-500" />
          <h3 className="mt-4 text-xl font-black">
            Manage Orders
          </h3>
          <p className="mt-2 text-gray-400">
            Update order and payment statuses.
          </p>
        </Link>

        <Link
          href="/admin/import"
          className="rounded-3xl border border-pink-500/20 bg-white/5 p-6 transition hover:-translate-y-2 hover:border-pink-500"
        >
          <FaBoxOpen className="text-3xl text-pink-500" />
          <h3 className="mt-4 text-xl font-black">
            Import Excel
          </h3>
          <p className="mt-2 text-gray-400">
            Upload the latest cracker price list.
          </p>
        </Link>
      </section>
    </main>
  );
}