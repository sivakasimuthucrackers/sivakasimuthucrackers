"use client";

import Link from "next/link";
import { useState } from "react";
import { FaArrowLeft, FaWhatsapp, FaWallet, FaCheckCircle } from "react-icons/fa";
import { useCart } from "@/context/CartContext";

const paymentOptions = [
  { value: "UPI", label: "PhonePe / Google Pay", description: "Scan QR or pay to 7010400258", icon: FaWallet },
  { value: "WhatsApp Confirmation", label: "Confirm on WhatsApp", description: "Send payment screenshot on WhatsApp", icon: FaWhatsapp },
];

export default function CheckoutPage() {
  const { cartItems, cartTotal } = useCart();

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    address: "",
    city: "",
    district: "",
    pincode: "",
    paymentMethod: "UPI",
    notes: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const msg = encodeURIComponent(
      `New Order\nName: ${form.name}\nMobile: ${form.mobile}\nCity: ${form.city}\nDistrict: ${form.district}\nPincode: ${form.pincode}\nPayment: ${form.paymentMethod}\nTotal: ₹${cartTotal}`
    );
    window.open(`https://wa.me/917010400258?text=${msg}`, "_blank");
  }

  if (cartItems.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080808] px-5 py-16">
        <div className="text-center">
          <FaCheckCircle className="mx-auto text-6xl text-pink-500" />
          <h1 className="mt-5 text-3xl font-black">Your Cart is Empty</h1>
          <p className="mt-2 text-gray-400">Add products before checkout.</p>
          <Link href="/products" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-pink-600 px-6 py-3 font-black">
            <FaArrowLeft />
            Shop Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080808] py-5">
      <div className="container max-w-6xl">
        <Link href="/cart" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-pink-500">
          <FaArrowLeft />
          Back to Cart
        </Link>

        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[3px] text-pink-500">Complete your order</p>
          <h1 className="mt-2 text-3xl font-black">Checkout</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-white/10 bg-white/5 p-4 md:p-6">
              <h2 className="text-xl font-black">Customer & Delivery Details</h2>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange}
                  className="rounded-lg border border-white/10 bg-black/40 px-3 py-3 text-sm outline-none focus:border-pink-500" />
                <input name="mobile" placeholder="Mobile Number" value={form.mobile} onChange={handleChange}
                  className="rounded-lg border border-white/10 bg-black/40 px-3 py-3 text-sm outline-none focus:border-pink-500" />
                <input name="city" placeholder="City" value={form.city} onChange={handleChange}
                  className="rounded-lg border border-white/10 bg-black/40 px-3 py-3 text-sm outline-none focus:border-pink-500" />
                <input name="district" placeholder="District" value={form.district} onChange={handleChange}
                  className="rounded-lg border border-white/10 bg-black/40 px-3 py-3 text-sm outline-none focus:border-pink-500" />
                <input name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange}
                  className="rounded-lg border border-white/10 bg-black/40 px-3 py-3 text-sm outline-none focus:border-pink-500 md:col-span-2" />
              </div>

              <textarea name="address" placeholder="Complete Delivery Address" value={form.address} onChange={handleChange}
                rows="3" className="mt-4 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-3 text-sm outline-none focus:border-pink-500" />

              <textarea name="notes" placeholder="Order Notes (Optional)" value={form.notes} onChange={handleChange}
                rows="2" className="mt-4 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-3 text-sm outline-none focus:border-pink-500" />
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/5 p-4 md:p-6">
              <h2 className="text-xl font-black">Payment Method</h2>
              <div className="mt-4 grid gap-3">
                {paymentOptions.map(({ value, label, description, icon: Icon }) => (
                  <label key={value} className={`cursor-pointer rounded-xl border p-4 ${form.paymentMethod === value ? "border-pink-500 bg-pink-500/10" : "border-white/10 bg-black/20"}`}>
                    <input type="radio" name="paymentMethod" value={value} checked={form.paymentMethod === value}
                      onChange={handleChange} className="sr-only" />
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
                <h3 className="text-lg font-black text-white">Scan & Pay</h3>
                <div className="mt-3 flex justify-center">
                  <img src="/images/phonepe-qr.jpg" alt="PhonePe QR Code"
                    className="w-full max-w-[220px] rounded-lg bg-white p-2" />
                </div>
                <div className="mt-4 rounded-lg border border-pink-500/20 bg-pink-500/10 p-3 text-center">
                  <p className="text-xs text-gray-300">Google Pay Number</p>
                  <p className="mt-1 text-lg font-black text-yellow-400">7010400258</p>
                </div>
              </div>
            </section>
          </div>

          <aside className="h-fit rounded-2xl border border-pink-500/20 bg-gradient-to-b from-white/10 to-white/5 p-4 shadow-xl">
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
                    ₹{(Number(item.offerPrice) * item.quantity).toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-end justify-between gap-3 border-t border-white/10 pt-4">
              <span className="font-bold">Cart Total</span>
              <span className="text-2xl font-black text-yellow-400">
                ₹{Number(cartTotal || 0).toLocaleString("en-IN")}
              </span>
            </div>

            <button type="submit" className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-3 text-base font-black">
              <FaWhatsapp />
              Place Order & Open WhatsApp
            </button>

            <div className="mt-4 space-y-1 text-xs text-gray-400">
              <p>Phone: +91 96003 33302</p>
              <p>WhatsApp: +91 70104 00258</p>
              <p>Google Pay: 7010400258</p>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}
