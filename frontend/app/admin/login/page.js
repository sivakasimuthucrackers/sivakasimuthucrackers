"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaSignInAlt,
} from "react-icons/fa";

const API_URL = "https://muthu-crackers-backend.onrender.com";

export default function AdminLoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "admin@sivakasimuthucrackers.com",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("muthuAdminToken", data.token);
      localStorage.setItem(
        "muthuAdminDetails",
        JSON.stringify(data.admin)
      );

      router.push("/admin/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_right,_#831843,_#050505_55%)] px-5 py-16">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-pink-500/20 bg-black/80 shadow-2xl shadow-pink-500/20 lg:grid-cols-2">
        <section className="hidden bg-gradient-to-br from-pink-700 via-pink-900 to-black p-12 lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[4px] text-yellow-400">
              Sivakasi Factory Direct
            </p>

            <h1 className="mt-6 text-5xl font-black leading-tight">
              Muthu Crackers
              <span className="block text-pink-300">Admin Panel</span>
            </h1>

            <p className="mt-6 max-w-md leading-8 text-pink-100/80">
              Manage products, orders, customers, offers, inventory and
              website settings from one secure dashboard.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 p-6">
            <p className="text-sm text-white/70">Admin Access</p>
            <p className="mt-2 font-bold text-white">
              Authorized users only
            </p>
          </div>
        </section>

        <section className="p-7 sm:p-10 lg:p-12">
          <div className="mx-auto max-w-md">
            <div className="mb-8">
              <p className="font-bold uppercase tracking-[4px] text-pink-500">
                Welcome Back
              </p>

              <h2 className="mt-3 text-4xl font-black text-white">
                Admin Login
              </h2>

              <p className="mt-3 text-gray-400">
                Sign in to manage the Muthu Crackers website.
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-300">
                  Email Address
                </label>

                <div className="flex items-center rounded-xl border border-white/10 bg-white/5 px-4 focus-within:border-pink-500">
                  <FaEnvelope className="text-pink-500" />

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="admin@example.com"
                    className="w-full bg-transparent px-4 py-4 text-white outline-none placeholder:text-gray-600"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-300">
                  Password
                </label>

                <div className="flex items-center rounded-xl border border-white/10 bg-white/5 px-4 focus-within:border-pink-500">
                  <FaLock className="text-pink-500" />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter password"
                    className="w-full bg-transparent px-4 py-4 text-white outline-none placeholder:text-gray-600"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="text-gray-400 hover:text-pink-500"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-pink-600 px-5 py-4 font-bold text-white transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FaSignInAlt />

                {submitting ? "Signing In..." : "Login to Dashboard"}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-500">
              Secure administrator access for Sivakasi Muthu Crackers
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
