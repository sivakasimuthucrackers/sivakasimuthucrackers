"use client";

import { useEffect, useState } from "react";
import {
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";

const API_URL = "https://muthu-crackers-backend.onrender.com";

export default function TopBar() {
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
    <div className="border-b border-white/10 bg-black text-xs text-gray-300">
      <div className="container flex flex-wrap items-center justify-between gap-3 py-2">
        <div className="flex flex-wrap items-center gap-4">
          <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-pink-500">
            <FaMapMarkerAlt className="text-pink-500" />
            Konampatti, Sivakasi
          </a>

          <a href="tel:+919600333302" className="flex items-center gap-2 hover:text-pink-500">
            <FaPhoneAlt className="text-pink-500" />
            +91 96003 33302
          </a>

          <a href="mailto:sivakasimuthucrackers@gmail.com" className="hidden items-center gap-2 hover:text-pink-500 lg:flex">
            <FaEnvelope className="text-pink-500" />
            sivakasimuthucrackers@gmail.com
          </a>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden md:inline">Follow us:</span>

          {socialLinks.map(({ url, icon: Icon, label }) =>
            url ? (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-gray-400 hover:text-pink-500"
              >
                <Icon />
              </a>
            ) : (
              <span
                key={label}
                title={`Add ${label} URL in Admin Settings`}
                className="cursor-not-allowed text-gray-700"
              >
                <Icon />
              </span>
            )
          )}

          <a href="https://wa.me/917010400258" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-bold text-green-500">
            <FaWhatsapp />
            <span className="hidden sm:inline">+91 70104 00258</span>
          </a>
        </div>
      </div>
    </div>
  );
}
