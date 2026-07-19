"use client";

import Link from "next/link";
import { useState } from "react";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaCreditCard,
  FaUniversity,
  FaWhatsapp,
  FaWallet,
} from "react-icons/fa";

import { useCart } from "@/context/CartContext";

const WHATSAPP_NUMBER = "917010400258";
const API_URL = "https://muthu-crackers-backend.onrender.com";

const paymentOptions = [
  {
    value: "UPI",
    label: "UPI / QR Code",
    description: "Payment details will be confirmed on WhatsApp.",
    icon: FaWallet,
  },
  {
    value: "Bank Transfer",
    label: "Bank Transfer",
    description: "Bank account details will be shared after confirmation.",
    icon: FaUniversity,
  },
  {
    value: "Cash on Delivery",
    label: "Cash on Delivery Request",
    description: "Availability depends on location and order value.",
    icon: FaCreditCard,
  },
  {
    value: "WhatsApp Confirmation",
    label: "Confirm on WhatsApp",
    description: "Discuss payment and delivery directly with our team.",
    icon: FaWhatsapp,
  },
];

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    city: "",
    district: "",
    state: "Tamil Nadu",
    pincode: "",
    gstNumber: "",
    paymentMethod: "WhatsApp Confirmation",
    notes: "",
  });

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

    const whatsappWindow = window.open("", "_blank");

    try {
      setSubmitting(true);
      setError("");

      const orderItems = cartItems.map((item) => ({
        productId: item._id,
        name: item.name,
        offerPrice: Number(item.offerPrice),
        quantity: item.quantity,
        subtotal: Number(item.offerPrice) * item.quantity,
      }));

      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: {
            name: form.name,
            mobile: form.mobile,
            email: form.email,
            address: form.address,
            city: form.city,
            district: form.district,
            state: form.state,
            pincode: form.pincode,
            gstNumber: form.gstNumber,
          },
          items: orderItems,
          totalAmount: Number(cartTotal),
          paymentMethod: form.paymentMethod,
          notes: form.notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to create order");
      }
const orderNumber =
  data.order?.orderNumber || data.order?._id || "Not generated";

const whatsappUrl =
  data.whatsappUrl ||
  `https://wa.me/${WHATSAPP_NUMBER}`;

const successUrl = `/order-success?orderNumber=${encodeURIComponent(
  orderNumber
)}`;

clearCart();

if (whatsappWindow) {
  whatsappWindow.location.href = whatsappUrl;
}

window.location.href = successUrl;
    } catch (err) {
      if (whatsappWindow) {
        whatsappWindow.close();
      }

      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (cartItems.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080808] px-5 py-20">
        <div className="text-center">
          <FaCheckCircle className="mx-auto text-7xl text-pink-500" />

          <h1 className="mt-6 text-4xl font-black">
            Your Cart is Empty
          </h1>

          <p className="mt-3 text-gray-400">
            Add products before opening checkout.
          </p>

          <Link
            href="/products"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-pink-600 px-7 py-4 font-black"
          >
            <FaArrowLeft />
            Shop Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080808] py-12 md:py-16">
      <div className="container">
        <Link
          href="/cart"
          className="mb-8 inline-flex items-center gap-2 font-bold text-pink-500"
        >
          <FaArrowLeft />
          Back to Cart
        </Link>

        <div className="mb-10">
          <p className="font-bold uppercase tracking-[4px] text-pink-500">
            Complete Your Order
          </p>

          <h1 className="mt-2 text-4xl font-black md:text-5xl">
            Checkout
          </h1>

          <p className="mt-3 text-gray-400">
            Enter your delivery details and choose your preferred payment
            method.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-8 xl:grid-cols-[1fr_400px]"
        >
          <div className="space-y-8">
            <section className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
              <h2 className="text-2xl font-black">
                Customer and Delivery Details
              </h2>

              {error && (
                <p className="mt-5 rounded-xl bg-red-600/20 p-4 text-red-400">
                  {error}
                </p>
              )}

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="rounded-xl border border-white/10 bg-black/40 px-4 py-4 outline-none focus:border-pink-500"
                />

                <input
                  type="tel"
                  name="mobile"
                  placeholder="10-digit Mobile Number"
                  value={form.mobile}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{10}"
                  maxLength="10"
                  inputMode="numeric"
                  className="rounded-xl border border-white/10 bg-black/40 px-4 py-4 outline-none focus:border-pink-500"
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email Address (Optional)"
                  value={form.email}
                  onChange={handleChange}
                  className="rounded-xl border border-white/10 bg-black/40 px-4 py-4 outline-none focus:border-pink-500"
                />

                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={form.city}
                  onChange={handleChange}
                  required
                  className="rounded-xl border border-white/10 bg-black/40 px-4 py-4 outline-none focus:border-pink-500"
                />

                <input
                  type="text"
                  name="district"
                  placeholder="District"
                  value={form.district}
                  onChange={handleChange}
                  required
                  className="rounded-xl border border-white/10 bg-black/40 px-4 py-4 outline-none focus:border-pink-500"
                />

                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={form.state}
                  onChange={handleChange}
                  required
                  className="rounded-xl border border-white/10 bg-black/40 px-4 py-4 outline-none focus:border-pink-500"
                />

                <input
                  type="text"
                  name="pincode"
                  placeholder="6-digit Pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{6}"
                  maxLength="6"
                  inputMode="numeric"
                  className="rounded-xl border border-white/10 bg-black/40 px-4 py-4 outline-none focus:border-pink-500"
                />

                <input
                  type="text"
                  name="gstNumber"
                  placeholder="Customer GST Number (Optional)"
                  value={form.gstNumber}
                  onChange={handleChange}
                  className="rounded-xl border border-white/10 bg-black/40 px-4 py-4 uppercase outline-none focus:border-pink-500"
                />
              </div>

              <textarea
                name="address"
                placeholder="Complete Delivery Address"
                value={form.address}
                onChange={handleChange}
                required
                rows="5"
                className="mt-5 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-4 outline-none focus:border-pink-500"
              />

              <textarea
                name="notes"
                placeholder="Order Notes (Optional)"
                value={form.notes}
                onChange={handleChange}
                rows="3"
                className="mt-5 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-4 outline-none focus:border-pink-500"
              />
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
              <h2 className="text-2xl font-black">
                Payment Preference
              </h2>

              <p className="mt-2 text-sm text-gray-400">
                This website records your preference. Final payment details
                are confirmed after stock and delivery verification.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {paymentOptions.map(
                  ({
                    value,
                    label,
                    description,
                    icon: Icon,
                  }) => (
                    <label
                      key={value}
                      className={`cursor-pointer rounded-2xl border p-5 transition ${
                        form.paymentMethod === value
                          ? "border-pink-500 bg-pink-500/10"
                          : "border-white/10 bg-black/20 hover:border-pink-500/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={value}
                        checked={form.paymentMethod === value}
                        onChange={handleChange}
                        className="sr-only"
                      />

                      <Icon className="text-2xl text-pink-500" />

                      <h3 className="mt-3 font-black">{label}</h3>

                      <p className="mt-2 text-sm leading-6 text-gray-400">
                        {description}
                      </p>
                    </label>
                  )
                )}
              </div>
            </section>
          </div>

          <aside className="h-fit rounded-3xl border border-pink-500/20 bg-gradient-to-b from-white/10 to-white/5 p-6 shadow-xl xl:sticky xl:top-28">
            <h2 className="text-2xl font-black">Order Summary</h2>

            <div className="mt-6 max-h-[420px] space-y-4 overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between gap-4 border-b border-white/10 pb-4"
                >
                  <div>
                    <p className="font-semibold">{item.name}</p>

                    <p className="mt-1 text-sm text-gray-400">
                      {item.quantity} × ₹
                      {Number(item.offerPrice).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <p className="shrink-0 font-black text-yellow-400">
                    ₹
                    {(
                      Number(item.offerPrice) * item.quantity
                    ).toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-end justify-between gap-4">
              <span className="text-lg font-bold">Cart Total</span>

              <span className="text-3xl font-black text-yellow-400">
                ₹{Number(cartTotal || 0).toLocaleString("en-IN")}
              </span>
            </div>

            <div className="mt-5 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-4 text-sm leading-6 text-yellow-200">
              Shipping charges are confirmed separately based on location,
              quantity and transport availability.
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-green-500 px-5 py-4 text-lg font-black hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FaWhatsapp />

              {submitting
                ? "Creating Order..."
                : "Place Order & Open WhatsApp"}
            </button>

            <div className="mt-5 space-y-2 text-sm text-gray-400">
              <p>Phone: +91 96003 33302</p>
              <p>WhatsApp: +91 70104 00258</p>
              <p>GSTIN: 33CFNPM5329G3Z9</p>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}
