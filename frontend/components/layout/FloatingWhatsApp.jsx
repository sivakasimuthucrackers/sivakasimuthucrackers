"use client";

import { FaWhatsapp } from "react-icons/fa";

export default function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/917010400258"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-2xl text-white shadow-2xl transition hover:scale-110 hover:bg-green-600 md:bottom-6 md:right-6 md:h-16 md:w-16 md:text-3xl"
      aria-label="Order through WhatsApp"
      title="Order through WhatsApp"
    >
      <FaWhatsapp />
    </a>
  );
}
