"use client";

import { useEffect, useState } from "react";
import { FaGooglePay, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";

export default function PaymentPage() {

  const [upiId, setUpiId] = useState("muthucrackers@upi");

  useEffect(() => {

    const savedUPI = localStorage.getItem("upiId");

    if (savedUPI) {
      setUpiId(savedUPI);
    }

  }, []);

  return (

    <div className="container mx-auto px-6 py-16">

      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-10">

        <h1 className="text-4xl font-bold text-center mb-8">
          Payment Details
        </h1>

        <div className="space-y-6">

          <div>

            <h2 className="font-bold text-lg">
              UPI ID
            </h2>

            <div className="border rounded-lg p-4 mt-2 text-xl font-bold text-pink-600">
              {upiId}
            </div>

          </div>

          <div>

            <h2 className="font-bold text-lg mb-2">
              Scan & Pay
            </h2>

            <img
              src="/images/payment/upi.png"
              alt="UPI QR"
              className="w-64 mx-auto"
            />

          </div>

          <div className="border rounded-lg p-4 bg-yellow-50">

            <p>
              After payment kindly send the screenshot through WhatsApp.
            </p>

          </div>

          <div className="flex flex-wrap gap-4 justify-center">

            <a
              href="tel:+919600333302"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2"
            >
              <FaPhoneAlt />
              Call
            </a>

            <a
              href="https://wa.me/917010400258"
              target="_blank"
              className="bg-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-2"
            >
              <FaWhatsapp />
              WhatsApp
            </a>

          </div>

        </div>

      </div>

    </div>

  );

}