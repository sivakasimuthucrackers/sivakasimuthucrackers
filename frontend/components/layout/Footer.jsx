"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";

const API_URL = "https://muthu-crackers-backend.onrender.com";

export default function Footer() {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    fetch(`${API_URL}/api/settings`)
      .then((response) => response.json())
      .then((data) => setSettings(data.settings || {}))
      .catch(() => {});
  }, []);

  const mapUrl =
    settings.googleMapsUrl ||
    "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(
        "Opp AJ Polytechnic College, Near Sankari Mahal, Sattur Sivakasi Road, Konampatti"
      );

  const socialLinks = [
    { url: settings.facebookUrl, icon: FaFacebookF, label: "Facebook" },
    { url: settings.instagramUrl, icon: FaInstagram, label: "Instagram" },
    { url: settings.youtubeUrl, icon: FaYoutube, label: "YouTube" },
  ];

  return (
    <footer className="border-t border-pink-500/20 bg-black">
      <div className="container grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <h2 className="text-2xl font-black text-pink-500">
            Sivakasi Muthu Crackers
          </h2>

          <p className="mt-4 leading-7 text-gray-400">
            Premium-quality crackers directly from Sivakasi at factory prices.
          </p>

          <div className="mt-6 flex items-center gap-4 text-lg">
            {socialLinks.map(({ url, icon: Icon, label }) =>
              url ? (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="rounded-full border border-white/10 p-3 text-gray-400 hover:border-pink-500 hover:text-pink-500"
                >
                  <Icon />
                </a>
              ) : (
                <span
                  key={label}
                  title={`Add ${label} URL in Admin Settings`}
                  className="cursor-not-allowed rounded-full border border-white/5 p-3 text-gray-700"
                >
                  <Icon />
                </span>
              )
            )}
          </div>
        </div>

        <div>
          <h3 className="mb-5 text-lg font-bold">Information</h3>
          <div className="flex flex-col gap-3 text-gray-400">
            <Link href="/about">About Us</Link>
            <Link href="/contact">Contact Us</Link>
            <Link href="/price-list">Price List</Link>
            <Link href="/gallery">Gallery</Link>
            <Link href="/safety">Safety Instructions</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms & Conditions</Link>
          </div>
        </div>

        <div>
          <h3 className="mb-5 text-lg font-bold">Customer Service</h3>
          <div className="flex flex-col gap-3 text-gray-400">
            <Link href="/products">All Products</Link>
            <Link href="/offers">Festival Offers</Link>
            <Link href="/shipping-policy">Shipping Policy</Link>
            <Link href="/refund-policy">Refund Policy</Link>
            <Link href="/cart">Shopping Cart</Link>
            <Link href="/orders">Track Order</Link>

            <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-pink-500">
              <FaMapMarkedAlt />
              Open Google Map
            </a>
          </div>
        </div>

        <div>
          <h3 className="mb-5 text-lg font-bold">Contact</h3>
          <div className="flex flex-col gap-4 text-gray-400">
            <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 hover:text-pink-500">
              <FaMapMarkerAlt className="mt-1 shrink-0 text-pink-500" />
              <span>
                Opp AJ Polytechnic College,<br />
                Near Sankari Mahal,<br />
                Sattur - Sivakasi Road,<br />
                Konampatti
              </span>
            </a>

            <a href="tel:+919600333302" className="flex items-center gap-3 hover:text-pink-500">
              <FaPhoneAlt className="text-pink-500" />
              +91 96003 33302
            </a>

            <a href="mailto:sivakasimuthucrackers@gmail.com" className="flex items-start gap-3 break-all hover:text-pink-500">
              <FaEnvelope className="mt-1 text-pink-500" />
              sivakasimuthucrackers@gmail.com
            </a>

            <a href="https://wa.me/917010400258" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-green-500">
              <FaWhatsapp className="text-green-500" />
              +91 70104 00258
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-sm text-gray-400">
        GSTIN: 33CFNPM5329G3Z9
      </div>

      <div className="border-t border-white/10 py-5 text-center text-sm text-gray-500">
        © 2026 Sivakasi Muthu Crackers. All rights reserved.
      </div>
    </footer>
  );
}
