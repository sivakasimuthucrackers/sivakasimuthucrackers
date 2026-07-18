"use client";

import { useState } from "react";
import {
  FaFileExcel,
  FaUpload,
} from "react-icons/fa";

const API_URL = "http://localhost:5000/api/import";

export default function ImportProductsPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  async function uploadExcel(event) {
    event.preventDefault();

    if (!file) {
      setResult("Please select an Excel file.");
      return;
    }

    try {
      setLoading(true);
      setResult("");

      const token = localStorage.getItem("muthuAdminToken");
      const formData = new FormData();

      formData.append("excelFile", file);

      const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Import failed");
      }

      setResult(
        `${data.message || "Import completed"} — Added: ${
          data.summary?.added ?? data.importedCount ?? 0
        }, Skipped: ${data.summary?.skipped ?? data.skippedCount ?? 0}`
      );
    } catch (error) {
      setResult(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#080808] p-5 md:p-8">
      <div className="mb-8">
        <p className="font-bold uppercase tracking-[4px] text-pink-500">
          Admin Panel
        </p>

        <h1 className="mt-2 text-4xl font-black">
          Import Products
        </h1>

        <p className="mt-3 text-gray-400">
          Upload your Excel price list to add or update products.
        </p>
      </div>

      <form
        onSubmit={uploadExcel}
        className="max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-7 shadow-xl"
      >
        <div className="rounded-2xl border-2 border-dashed border-pink-500/30 bg-black/30 p-8 text-center">
          <FaFileExcel className="mx-auto text-6xl text-green-500" />

          <label className="mt-6 block cursor-pointer">
            <span className="inline-flex rounded-xl bg-pink-600 px-6 py-3 font-black hover:bg-pink-700">
              Choose Excel File
            </span>

            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(event) => setFile(event.target.files?.[0] || null)}
              className="sr-only"
            />
          </label>

          <p className="mt-4 text-gray-400">
            {file ? file.name : "Accepted formats: .xlsx and .xls"}
          </p>
        </div>

        {result && (
          <p className="mt-5 rounded-xl bg-pink-500/10 p-4 text-pink-300">
            {result}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-green-600 px-6 py-4 text-lg font-black hover:bg-green-700 disabled:opacity-60"
        >
          <FaUpload />
          {loading ? "Importing..." : "Import Excel"}
        </button>
      </form>
    </main>
  );
}
