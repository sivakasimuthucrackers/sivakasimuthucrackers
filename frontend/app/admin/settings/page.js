"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaBuilding,
  FaCreditCard,
  FaSave,
  FaShareAlt,
  FaTruck,
} from "react-icons/fa";

const API_URL = "http://localhost:5000";

const initialForm = {
  businessName: "Sivakasi Muthu Crackers",
  phone: "96003 33302",
  whatsapp: "70104 00258",
  email: "sivakasimuthucrackers@gmail.com",
  address:
    "Opp AJ Polytechnic College, Near Sankari Mahal, Sattur - Sivakasi Road, Konampatti",
  gstin: "33CFNPM5329G3Z9",
  minimumOrderValue: 0,
  shippingCharge: 0,
  shippingMessage:
    "Shipping charges and delivery availability will be confirmed based on location and order value.",
  businessHours: "Monday to Sunday - 9:00 AM to 8:00 PM",
  upiId: "",
  bankAccountName: "",
  bankName: "",
  accountNumber: "",
  ifscCode: "",
  facebookUrl: "",
  instagramUrl: "",
  youtubeUrl: "",
  googleMapsUrl: "",
  logoPath: "/logo/logo.png",
  faviconPath: "/favicon.ico",
  priceListPath: "/downloads/price-list.pdf",
};

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-gray-300">
        {label}
      </span>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-4 outline-none transition focus:border-pink-500"
      />
    </label>
  );
}

export default function AdminSettingsPage() {
  const router = useRouter();

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("muthuAdminToken");

        if (!token) {
          router.push("/admin/login");
          return;
        }

        const response = await fetch(`${API_URL}/api/settings`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load settings"
          );
        }

        setForm({
          ...initialForm,
          ...(data.settings || {}),
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, [router]);

  function handleChange(event) {
    const { name, value, type } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        type === "number"
          ? Number(value)
          : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const token = localStorage.getItem("muthuAdminToken");

      if (!token) {
        router.push("/admin/login");
        return;
      }

      const response = await fetch(`${API_URL}/api/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to update settings"
        );
      }

      setForm({
        ...initialForm,
        ...(data.settings || {}),
      });

      setMessage(
        data.message || "Settings updated successfully"
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-gray-400">
          Loading website settings...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080808] p-5 md:p-8">
      <div className="mb-8">
        <p className="font-bold uppercase tracking-[4px] text-pink-500">
          Admin Panel
        </p>

        <h1 className="mt-2 text-4xl font-black">
          Website Settings
        </h1>

        <p className="mt-3 text-gray-400">
          Update business, payment, shipping and social details.
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

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <FaBuilding className="text-2xl text-pink-500" />
            <h2 className="text-2xl font-black">
              Business Details
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Business Name"
              name="businessName"
              value={form.businessName}
              onChange={handleChange}
            />

            <Field
              label="Phone Number"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />

            <Field
              label="WhatsApp Number"
              name="whatsapp"
              value={form.whatsapp}
              onChange={handleChange}
            />

            <Field
              label="Email Address"
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
            />

            <Field
              label="GSTIN"
              name="gstin"
              value={form.gstin}
              onChange={handleChange}
            />

            <Field
              label="Business Hours"
              name="businessHours"
              value={form.businessHours}
              onChange={handleChange}
            />
          </div>

          <label className="mt-5 block">
            <span className="mb-2 block text-sm font-bold text-gray-300">
              Full Address
            </span>

            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows="4"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-4 outline-none transition focus:border-pink-500"
            />
          </label>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <FaTruck className="text-2xl text-pink-500" />
            <h2 className="text-2xl font-black">
              Order and Shipping Settings
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Minimum Order Value"
              name="minimumOrderValue"
              value={form.minimumOrderValue}
              onChange={handleChange}
              type="number"
            />

            <Field
              label="Shipping Charge"
              name="shippingCharge"
              value={form.shippingCharge}
              onChange={handleChange}
              type="number"
            />
          </div>

          <label className="mt-5 block">
            <span className="mb-2 block text-sm font-bold text-gray-300">
              Shipping Message
            </span>

            <textarea
              name="shippingMessage"
              value={form.shippingMessage}
              onChange={handleChange}
              rows="4"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-4 outline-none transition focus:border-pink-500"
            />
          </label>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <FaCreditCard className="text-2xl text-pink-500" />
            <h2 className="text-2xl font-black">
              Payment Settings
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="UPI ID"
              name="upiId"
              value={form.upiId}
              onChange={handleChange}
              placeholder="example@upi"
            />

            <Field
              label="Bank Account Name"
              name="bankAccountName"
              value={form.bankAccountName}
              onChange={handleChange}
            />

            <Field
              label="Bank Name"
              name="bankName"
              value={form.bankName}
              onChange={handleChange}
            />

            <Field
              label="Account Number"
              name="accountNumber"
              value={form.accountNumber}
              onChange={handleChange}
            />

            <Field
              label="IFSC Code"
              name="ifscCode"
              value={form.ifscCode}
              onChange={handleChange}
            />
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <FaShareAlt className="text-2xl text-pink-500" />
            <h2 className="text-2xl font-black">
              Social and File Settings
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Facebook URL"
              name="facebookUrl"
              value={form.facebookUrl}
              onChange={handleChange}
            />

            <Field
              label="Instagram URL"
              name="instagramUrl"
              value={form.instagramUrl}
              onChange={handleChange}
            />

            <Field
              label="YouTube URL"
              name="youtubeUrl"
              value={form.youtubeUrl}
              onChange={handleChange}
            />

            <Field
              label="Google Maps URL"
              name="googleMapsUrl"
              value={form.googleMapsUrl}
              onChange={handleChange}
            />

            <Field
              label="Logo Path"
              name="logoPath"
              value={form.logoPath}
              onChange={handleChange}
            />

            <Field
              label="Favicon Path"
              name="faviconPath"
              value={form.faviconPath}
              onChange={handleChange}
            />

            <Field
              label="Price List Path"
              name="priceListPath"
              value={form.priceListPath}
              onChange={handleChange}
            />
          </div>
        </section>

        <button
          type="submit"
          disabled={saving}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-pink-600 px-6 py-5 text-lg font-black hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FaSave />
          {saving ? "Saving Settings..." : "Save Website Settings"}
        </button>
      </form>
    </main>
  );
}
