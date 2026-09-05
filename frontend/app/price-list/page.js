"use client";

import { useEffect, useState } from "react";
import {
  FaDownload,
  FaFileExcel,
  FaWhatsapp,
} from "react-icons/fa";

const API_URL = "https://muthu-crackers-backend.onrender.com";

export default function PriceListPage() {
  const [filePath, setFilePath] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPriceList() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/import/price-list`, {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.excelUrl) {
          throw new Error(data.message || "Price list is not available");
        }

        // Add a timestamp so the browser/CDN does not reuse an old cached file.
        const separator = data.excelUrl.includes("?") ? "&" : "?";
        setFilePath(`${data.excelUrl}${separator}v=${Date.now()}`);
      } catch (err) {
        setError(err.message || "Unable to load the latest price list");
      } finally {
        setLoading(false);
      }
    }

    loadPriceList();
  }, []);

  return (
    <main className="min-h-screen bg-[#080808] py-16 md:py-20">
      <div className="container">
        <section className="mx-auto max-w-4xl rounded-3xl border border-pink-500/20 bg-gradient-to-br from-white/10 to-white/5 p-8 text-center shadow-2xl md:p-12">
          <FaFileExcel className="mx-auto text-7xl text-green-500" />

          <p className="mt-6 font-bold uppercase tracking-[4px] text-pink-500">
            Latest Catalogue
          </p>

          <h1 className="mt-3 text-4xl font-black md:text-5xl">
            Muthu Crackers Price List
          </h1>

          <p className="mx-auto mt-5 max-w-2xl leading-8 text-gray-400">
            Download our latest product catalogue with product names,
            categories, MRP and offer prices.
          </p>

          {error && (
            <p className="mx-auto mt-6 max-w-xl rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">
              {error}
            </p>
          )}

          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <a
              href={filePath || "#"}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={!filePath}
              onClick={(event) => {
                if (!filePath) event.preventDefault();
              }}
              className={`inline-flex items-center gap-3 rounded-xl px-8 py-4 font-black text-white ${
                filePath
                  ? "bg-pink-600 hover:bg-pink-700"
                  : "cursor-not-allowed bg-gray-600"
              }`}
            >
              <FaDownload />
              {loading ? "Loading Price List..." : "Download Price List"}
            </a>

            <a
              href="https://wa.me/917010400258"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-xl bg-green-500 px-8 py-4 font-black text-white hover:bg-green-600"
            >
              <FaWhatsapp />
              Request on WhatsApp
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
