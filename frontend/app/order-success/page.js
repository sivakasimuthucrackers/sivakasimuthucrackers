"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  FaCheckCircle,
  FaHome,
  FaShoppingBag,
  FaWhatsapp,
} from "react-icons/fa";

const WHATSAPP_NUMBER = "917010400258";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();

  const orderNumber =
    searchParams.get("orderNumber") || "Order Created";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080808] px-5 py-20">
      <div className="w-full max-w-2xl rounded-3xl border border-green-500/20 bg-white/5 p-8 text-center shadow-2xl md:p-12">
        <FaCheckCircle className="mx-auto text-8xl text-green-500" />

        <p className="mt-6 font-bold uppercase tracking-[4px] text-green-400">
          Order Submitted
        </p>

        <h1 className="mt-3 text-4xl font-black md:text-5xl">
          Thank You for Your Order
        </h1>

        <p className="mt-5 text-lg text-gray-300">
          Your order has been saved successfully.
        </p>

        <div className="mx-auto mt-7 max-w-md rounded-2xl border border-white/10 bg-black/30 p-5">
          <p className="text-sm text-gray-400">
            Order Number
          </p>

          <p className="mt-2 break-all text-2xl font-black text-yellow-400">
            {orderNumber}
          </p>
        </div>

        <p className="mx-auto mt-7 max-w-xl leading-8 text-gray-400">
          Our team will confirm product availability, shipping charges,
          payment details and delivery timeline through phone or WhatsApp.
        </p>

        <div className="mt-8 rounded-2xl border border-pink-500/20 bg-pink-500/10 p-5 text-left">
          <h2 className="text-xl font-black">
            Business Contact
          </h2>

          <div className="mt-3 space-y-2 text-gray-300">
            <p>Phone: +91 96003 33302</p>
            <p>WhatsApp: +91 70104 00258</p>
            <p>Email: sivakasimuthucrackers@gmail.com</p>
            <p>GSTIN: 33CFNPM5329G3Z9</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-4 font-black transition hover:border-pink-500 hover:text-pink-500"
          >
            <FaHome />
            Home
          </Link>

          <Link
            href="/products"
            className="flex items-center justify-center gap-2 rounded-xl bg-pink-600 px-5 py-4 font-black transition hover:bg-pink-700"
          >
            <FaShoppingBag />
            Continue Shopping
          </Link>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-green-500 px-5 py-4 font-black transition hover:bg-green-600"
          >
            <FaWhatsapp />
            WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}