"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FaFilter,
  FaSearch,
  FaSortAmountDown,
  FaTimes,
} from "react-icons/fa";

import ProductCard from "./ProductCard";

const API_URL = "http://localhost:5000";
const ITEMS_PER_PAGE = 12;

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name-asc");
  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const categoryFromUrl = params.get("category");

    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, []);

  useEffect(() => {
    async function getAllProducts() {
      try {
        setLoading(true);
        setError("");

        const firstResponse = await fetch(
          `${API_URL}/api/products?page=1&limit=100`
        );

        const firstData = await firstResponse.json();

        if (!firstResponse.ok) {
          throw new Error(firstData.message || "Unable to load products");
        }

        let allProducts = firstData.products || [];
        const totalPages = Number(firstData.pages || 1);

        if (totalPages > 1) {
          const requests = [];

          for (let page = 2; page <= totalPages; page += 1) {
            requests.push(
              fetch(`${API_URL}/api/products?page=${page}&limit=100`)
                .then((response) => response.json())
            );
          }

          const remainingPages = await Promise.all(requests);

          remainingPages.forEach((pageData) => {
            allProducts = allProducts.concat(pageData.products || []);
          });
        }

        const uniqueProducts = Array.from(
          new Map(
            allProducts.map((product) => [product._id, product])
          ).values()
        );

        setProducts(uniqueProducts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    getAllProducts();
  }, []);

  const categories = useMemo(() => {
    const values = products
      .map((product) => product.category)
      .filter(Boolean)
      .sort((first, second) =>
        first.localeCompare(second)
      );

    return ["All", ...new Set(values)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const searchableText = [
        product.name,
        product.productCode,
        product.category,
        product.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        searchableText.includes(normalizedSearch);

      const matchesCategory =
        selectedCategory === "All" ||
        product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    return [...filtered].sort((first, second) => {
      const firstPrice = Number(first.offerPrice || 0);
      const secondPrice = Number(second.offerPrice || 0);

      if (sortBy === "price-low") {
        return firstPrice - secondPrice;
      }

      if (sortBy === "price-high") {
        return secondPrice - firstPrice;
      }

      if (sortBy === "discount-high") {
        return Number(second.discount || 0) - Number(first.discount || 0);
      }

      if (sortBy === "newest") {
        return (
          new Date(second.createdAt || 0) -
          new Date(first.createdAt || 0)
        );
      }

      return String(first.name || "").localeCompare(
        String(second.name || "")
      );
    });
  }, [products, search, selectedCategory, sortBy]);

  const totalPages = Math.max(
    Math.ceil(filteredProducts.length / ITEMS_PER_PAGE),
    1
  );

  const visibleProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory, sortBy]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  function clearFilters() {
    setSearch("");
    setSelectedCategory("All");
    setSortBy("name-asc");
    setCurrentPage(1);

    window.history.replaceState({}, "", "/products");
  }

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="h-[470px] animate-pulse rounded-3xl border border-white/10 bg-white/5"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center text-red-400">
        {error}
      </div>
    );
  }

  return (
    <>
      <section className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-5 md:p-6">
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr_auto]">
          <label className="relative">
            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" />

            <input
              type="search"
              placeholder="Search name, code or category..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 py-4 pl-12 pr-5 text-white outline-none transition focus:border-pink-500"
            />
          </label>

          <label className="relative">
            <FaFilter className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" />

            <select
              value={selectedCategory}
              onChange={(event) =>
                setSelectedCategory(event.target.value)
              }
              className="w-full appearance-none rounded-xl border border-white/10 bg-[#151515] py-4 pl-12 pr-5 text-white outline-none transition focus:border-pink-500"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="relative">
            <FaSortAmountDown className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" />

            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="w-full appearance-none rounded-xl border border-white/10 bg-[#151515] py-4 pl-12 pr-5 text-white outline-none transition focus:border-pink-500"
            >
              <option value="name-asc">Name: A to Z</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="discount-high">Highest Discount</option>
              <option value="newest">Newest Products</option>
            </select>
          </label>

          <button
            type="button"
            onClick={clearFilters}
            className="flex items-center justify-center gap-2 rounded-xl border border-pink-500 px-5 py-4 font-black text-pink-500 transition hover:bg-pink-500 hover:text-white"
          >
            <FaTimes />
            Clear
          </button>
        </div>
      </section>

      <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
        <p className="text-gray-400">
          Showing{" "}
          <span className="font-black text-white">
            {visibleProducts.length}
          </span>{" "}
          of{" "}
          <span className="font-black text-white">
            {filteredProducts.length}
          </span>{" "}
          products
        </p>

        <p className="text-sm text-gray-500">
          Page {currentPage} of {totalPages}
        </p>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center">
          <p className="text-6xl">🔍</p>
          <h2 className="mt-5 text-2xl font-black">
            No products found
          </h2>
          <p className="mt-3 text-gray-400">
            Change the search or clear the selected filters.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {visibleProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="mt-12 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() =>
              setCurrentPage((current) => Math.max(current - 1, 1))
            }
            disabled={currentPage === 1}
            className="rounded-xl border border-white/10 px-5 py-3 font-bold transition hover:border-pink-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }).map((_, index) => {
            const pageNumber = index + 1;

            return (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setCurrentPage(pageNumber)}
                className={`h-12 min-w-12 rounded-xl px-4 font-black transition ${
                  currentPage === pageNumber
                    ? "bg-pink-600 text-white"
                    : "border border-white/10 hover:border-pink-500"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() =>
              setCurrentPage((current) =>
                Math.min(current + 1, totalPages)
              )
            }
            disabled={currentPage === totalPages}
            className="rounded-xl border border-white/10 px-5 py-3 font-bold transition hover:border-pink-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </nav>
      )}
    </>
  );
}
