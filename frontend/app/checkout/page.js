"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimes,
  FaWallet,
  FaWhatsapp,
} from "react-icons/fa";

import { useCart } from "@/context/CartContext";

const API_URL = "https://muthu-crackers-backend.onrender.com";

const paymentOptions = [
  {
    value: "UPI",
    label: "PhonePe / Google Pay",
    description: "Scan QR or pay to 7010400258 or 7871916863",
    icon: FaWallet,
  },
  {
    value: "WhatsApp Confirmation",
    label: "Confirm on WhatsApp",
    description: "Send the payment screenshot on WhatsApp",
    icon: FaWhatsapp,
  },
];

export default function CheckoutPage() {
  const {
  cartItems,
  cartTotal,
  clearCart,
} = useCart();

  const [settings, setSettings] = useState({
    minimumOrderValue: 3000,
    shippingMessage:
      "Shipping charges and delivery availability will be confirmed separately.",
  });

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
    paymentMethod: "UPI",
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [minimumModalOpen, setMinimumModalOpen] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch(`${API_URL}/api/settings`);
        const data = await response.json();

        if (response.ok && data.settings) {
          setSettings((current) => ({
            ...current,
            ...data.settings,
            minimumOrderValue: Number(
              data.settings.minimumOrderValue ?? current.minimumOrderValue
            ),
          }));
        }
      } catch (error) {
        console.error("Unable to load checkout settings:", error);
      }
    }

    loadSettings();
  }, []);

  const minimumOrderValue = Number(settings.minimumOrderValue || 0);
  const currentCartTotal = Number(cartTotal || 0);
  const remainingAmount = Math.max(minimumOrderValue - currentCartTotal, 0);
  const minimumReached =
    minimumOrderValue === 0 || currentCartTotal >= minimumOrderValue;

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setFormError("");
  }

  function validateForm() {
    if (!form.name.trim()) return "Please enter the customer name.";

    const mobile = form.mobile.replace(/\D/g, "");
    if (mobile.length !== 10) {
      return "Please enter a valid 10-digit mobile number.";
    }

    if (form.email.trim()) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(form.email.trim())) {
        return "Please enter a valid email address.";
      }
    }

    if (!form.address.trim()) return "Please enter the complete delivery address.";
    if (!form.city.trim()) return "Please enter the city.";
    if (!form.district.trim()) return "Please enter the district.";
    if (!form.state.trim()) return "Please enter the state.";
    if (!/^\d{6}$/.test(form.pincode.trim())) {
      return "Please enter a valid 6-digit pincode.";
    }

    return "";
  }

  function buildOrderItems() {
    return cartItems.map((item) => {
      const quantity = Number(item.quantity || 1);
      const price = Number(item.offerPrice || 0);

      return {
        product: item._id,
        productId: item._id,
        productCode: item.productCode || "",
        name: item.name,
        category: item.category || "",
        unit: item.unit || "",
        quantity,
        price,
        offerPrice: price,
        mrp: Number(item.mrp || 0),
        subtotal: price * quantity,
        image: item.image || "",
      };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    if (!minimumReached) {
      setMinimumModalOpen(true);
      return;
    }

    const validationMessage = validateForm();
    if (validationMessage) {
      setFormError(validationMessage);
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        customer: {
          name: form.name.trim(),
          mobile: form.mobile.replace(/\D/g, ""),
          email: form.email.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          district: form.district.trim(),
          state: form.state.trim(),
          pincode: form.pincode.trim(),
          gstNumber: form.gstNumber.trim(),
        },
        items: buildOrderItems(),
        totalAmount: currentCartTotal,
        paymentMethod: form.paymentMethod,
        paymentStatus: "Pending",
        orderStatus: "Pending",
        notes: form.notes.trim(),
      };

      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        if (
          response.status === 400 &&
          String(data.message || "").toLowerCase().includes("minimum order")
        ) {
          setMinimumModalOpen(true);
          return;
        }

        throw new Error(data.message || "Unable to place the order.");
      }

      setSuccessOrder(data.order);
clearCart();

      if (data.whatsappUrl) {
        window.setTimeout(() => {
          window.open(data.whatsappUrl, "_blank", "noopener,noreferrer");
        }, 700);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setFormError(error.message || "Unable to place the order.");
    } finally {
      setSubmitting(false);
    }
  }

  if (cartItems.length === 0 && !successOrder) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080808] px-5 py-16 text-white">
        <div className="text-center">
          <FaCheckCircle className="mx-auto text-6xl text-pink-500" />
          <h1 className="mt-5 text-3xl font-black">Your Cart is Empty</h1>
          <p className="mt-2 text-gray-400">Add products before checkout.</p>
          <Link
            href="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-pink-600 px-6 py-3 font-black"
          >
            <FaArrowLeft />
            Shop Products
          </Link>
        </div>
      </main>
    );
  }

  if (successOrder) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080808] px-5 py-16 text-white">
        <div className="w-full max-w-xl rounded-3xl border border-green-500/30 bg-white/5 p-6 text-center shadow-2xl md:p-10">
          <FaCheckCircle className="mx-auto text-6xl text-green-500" />
          <p className="mt-5 text-xs font-bold uppercase tracking-[3px] text-green-400">
            Order Created Successfully
          </p>
          <h1 className="mt-2 text-3xl font-black">Thank You!</h1>
          <p className="mt-4 text-gray-300">
            Your order has been saved. Customer and admin email notifications
            are now processed by the backend.
          </p>
          <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4">
            <p className="text-sm text-gray-400">Order Number</p>
            <p className="mt-1 text-xl font-black text-yellow-400">
              {successOrder.orderNumber}
            </p>
          </div>
          <p className="mt-4 text-sm text-gray-400">
            WhatsApp will open automatically for order confirmation.
          </p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <Link
              href="/products"
              className="rounded-xl border border-pink-500 px-5 py-3 font-black text-pink-500"
            >
              Continue Shopping
            </Link>
            <Link
              href={`/track-order?order=${encodeURIComponent(
                successOrder.orderNumber || ""
              )}`}
              className="rounded-xl bg-pink-600 px-5 py-3 font-black"
            >
              Track Order
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080808] py-5 text-white">
      <div className="container max-w-6xl">
        <Link
          href="/cart"
          className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-pink-500"
        >
          <FaArrowLeft />
          Back to Cart
        </Link>

        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[3px] text-pink-500">
            Complete Your Order
          </p>
          <h1 className="mt-2 text-3xl font-black">Checkout</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-6 xl:grid-cols-[1fr_340px]"
        >
          <div className="space-y-6">
            <section className="rounded-2xl border border-white/10 bg-white/5 p-4 md:p-6">
              <h2 className="text-xl font-black">Customer & Delivery Details</h2>

              {!minimumReached && (
                <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
                  <p className="font-black">
                    Minimum order value is ₹
                    {minimumOrderValue.toLocaleString("en-IN")}
                  </p>
                  <p className="mt-1">
                    Add ₹{remainingAmount.toLocaleString("en-IN")} more to continue.
                  </p>
                </div>
              )}

              {formError && (
                <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-semibold text-red-300">
                  {formError}
                </div>
              )}

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <input required name="name" placeholder="Full Name" value={form.name} onChange={handleChange} className="rounded-lg border border-white/10 bg-black/40 px-3 py-3 text-sm outline-none focus:border-pink-500" />
                <input required type="tel" inputMode="numeric" name="mobile" placeholder="Mobile Number" value={form.mobile} onChange={handleChange} maxLength={10} className="rounded-lg border border-white/10 bg-black/40 px-3 py-3 text-sm outline-none focus:border-pink-500" />
                <input type="email" name="email" placeholder="Email Address (Optional)" value={form.email} onChange={handleChange} className="rounded-lg border border-white/10 bg-black/40 px-3 py-3 text-sm outline-none focus:border-pink-500" />
                <input required name="city" placeholder="City" value={form.city} onChange={handleChange} className="rounded-lg border border-white/10 bg-black/40 px-3 py-3 text-sm outline-none focus:border-pink-500" />
                <input required name="district" placeholder="District" value={form.district} onChange={handleChange} className="rounded-lg border border-white/10 bg-black/40 px-3 py-3 text-sm outline-none focus:border-pink-500" />
                <input required name="state" placeholder="State" value={form.state} onChange={handleChange} className="rounded-lg border border-white/10 bg-black/40 px-3 py-3 text-sm outline-none focus:border-pink-500" />
                <input required inputMode="numeric" name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} maxLength={6} className="rounded-lg border border-white/10 bg-black/40 px-3 py-3 text-sm outline-none focus:border-pink-500" />
                <input name="gstNumber" placeholder="Customer GST Number (Optional)" value={form.gstNumber} onChange={handleChange} className="rounded-lg border border-white/10 bg-black/40 px-3 py-3 text-sm uppercase outline-none focus:border-pink-500" />
              </div>

              <textarea required name="address" placeholder="Complete Delivery Address" value={form.address} onChange={handleChange} rows="3" className="mt-4 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-3 text-sm outline-none focus:border-pink-500" />
              <textarea name="notes" placeholder="Order Notes (Optional)" value={form.notes} onChange={handleChange} rows="2" className="mt-4 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-3 text-sm outline-none focus:border-pink-500" />
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/5 p-4 md:p-6">
              <h2 className="text-xl font-black">Payment Method</h2>

              <div className="mt-4 grid gap-3">
                {paymentOptions.map(({ value, label, description, icon: Icon }) => (
                  <label key={value} className={`cursor-pointer rounded-xl border p-4 ${form.paymentMethod === value ? "border-pink-500 bg-pink-500/10" : "border-white/10 bg-black/20"}`}>
                    <input type="radio" name="paymentMethod" value={value} checked={form.paymentMethod === value} onChange={handleChange} className="sr-only" />
                    <div className="flex items-start gap-3">
                      <Icon className="mt-1 text-xl text-pink-500" />
                      <div>
                        <h3 className="font-bold">{label}</h3>
                        <p className="mt-1 text-sm text-gray-400">{description}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4">
                <h3 className="text-lg font-black">Scan & Pay</h3>
                <div className="mt-3 flex justify-center">
                  <img src="/images/phonepe-qr.jpg" alt="PhonePe QR Code" className="w-full max-w-[220px] rounded-lg bg-white p-2" />
                </div>
                <div className="mt-4 rounded-lg border border-pink-500/20 bg-pink-500/10 p-3 text-center">
                  <p className="text-xs text-gray-300">Google Pay Number</p>
                  <p className="mt-1 text-lg font-black text-yellow-400">7010400258 or 7871916863</p>
                </div>
              </div>
            </section>
          </div>

          <aside className="h-fit rounded-2xl border border-pink-500/20 bg-gradient-to-b from-white/10 to-white/5 p-4 shadow-xl xl:sticky xl:top-24">
            <h2 className="text-xl font-black">Order Summary</h2>

            <div className="mt-4 max-h-[320px] space-y-3 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item._id} className="flex justify-between gap-3 border-b border-white/10 pb-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{item.name}</p>
                    <p className="mt-1 text-xs text-gray-400">
                      {item.quantity} × ₹{Number(item.offerPrice).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-black text-yellow-400">
                    ₹{(Number(item.offerPrice) * Number(item.quantity || 1)).toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-end justify-between gap-3 border-t border-white/10 pt-4">
              <span className="font-bold">Cart Total</span>
              <span className="text-2xl font-black text-yellow-400">
                ₹{currentCartTotal.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="mt-4 rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-3 text-xs leading-5 text-yellow-200">
              {settings.shippingMessage}
            </div>

            <button type="submit" disabled={submitting} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-3 text-base font-black transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60">
              <FaWhatsapp />
              {submitting ? "Placing Order..." : "Place Order & Open WhatsApp"}
            </button>

            {!minimumReached && (
              <p className="mt-3 text-center text-xs font-bold text-red-400">
                Add ₹{remainingAmount.toLocaleString("en-IN")} more before checkout.
              </p>
            )}

            <div className="mt-4 space-y-1 text-xs text-gray-400">
              <p>Phone: +91 96003 33302</p>
              <p>WhatsApp: +91 70104 00258</p>
              <p>Google Pay: 7010400258 or 7871916863</p>
            </div>
          </aside>
        </form>
      </div>

      {minimumModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="relative w-full max-w-md rounded-3xl border border-red-500/30 bg-[#151515] p-6 text-center shadow-2xl">
            <button type="button" onClick={() => setMinimumModalOpen(false)} className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-gray-300" aria-label="Close minimum-order message">
              <FaTimes />
            </button>
            <FaExclamationTriangle className="mx-auto text-5xl text-yellow-400" />
            <h2 className="mt-5 text-2xl font-black">Minimum Order Required</h2>
            <p className="mt-3 leading-7 text-gray-300">
              The minimum order value is <strong className="text-yellow-400">₹{minimumOrderValue.toLocaleString("en-IN")}</strong>.
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Your current cart total is ₹{currentCartTotal.toLocaleString("en-IN")}. Please add ₹{remainingAmount.toLocaleString("en-IN")} more.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={() => setMinimumModalOpen(false)} className="rounded-xl border border-white/10 px-5 py-3 font-black text-gray-300">
                Stay Here
              </button>
              <Link href="/products" className="rounded-xl bg-pink-600 px-5 py-3 font-black text-white">
                Add Products
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
