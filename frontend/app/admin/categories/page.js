"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaEdit,
  FaPlus,
  FaSave,
  FaTrash,
  FaTimes,
} from "react-icons/fa";

const API_URL = "http://localhost:5000";

const emptyForm = {
  name: "",
  image: "",
  description: "",
};

export default function AdminCategoriesPage() {
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadCategories() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/categories`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load categories"
        );
      }

      setCategories(data.categories || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("muthuAdminToken");

    if (!token) {
      router.push("/admin/login");
      return;
    }

    loadCategories();
  }, [router]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function openAddForm() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setMessage("");
    setError("");
  }

  function openEditForm(category) {
    setForm({
      name: category.name || "",
      image: category.image || "",
      description: category.description || "",
    });

    setEditingId(category._id);
    setShowForm(true);
    setMessage("");
    setError("");
  }

  function closeForm() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const token = localStorage.getItem("muthuAdminToken");

      const url = editingId
        ? `${API_URL}/api/categories/${editingId}`
        : `${API_URL}/api/categories`;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to save category"
        );
      }

      setMessage(data.message);
      closeForm();
      await loadCategories();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteCategory(categoryId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("muthuAdminToken");

      const response = await fetch(
        `${API_URL}/api/categories/${categoryId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to delete category"
        );
      }

      setMessage(data.message);
      await loadCategories();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="min-h-screen bg-[#080808] py-12">
      <div className="container">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-bold uppercase tracking-[4px] text-pink-500">
              Admin Panel
            </p>

            <h1 className="mt-2 text-4xl font-black">
              Category Management
            </h1>
          </div>

<div className="flex flex-wrap gap-3">

  <button
    type="button"
    onClick={async () => {

      try {

        setError("");
        setMessage("");

        const token = localStorage.getItem("muthuAdminToken");

        const response = await fetch(
          `${API_URL}/api/categories/generate-from-products`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message);
        }

        setMessage(
          `Generated Successfully - Added: ${data.summary.inserted}, Skipped: ${data.summary.skipped}`
        );

        loadCategories();

      } catch (err) {

        setError(err.message);

      }

    }}
    className="rounded-lg bg-green-600 px-5 py-3 font-bold hover:bg-green-700"
  >
    Generate Categories
  </button>

  <button
    type="button"
    onClick={openAddForm}
    className="flex items-center gap-2 rounded-lg bg-pink-600 px-5 py-3 font-bold hover:bg-pink-700"
  >
    <FaPlus />
    Add Category
  </button>

</div>
        </div>

        {message && (
          <p className="mb-5 rounded-lg bg-green-600/20 p-4 text-green-400">
            {message}
          </p>
        )}

        {error && (
          <p className="mb-5 rounded-lg bg-red-600/20 p-4 text-red-400">
            {error}
          </p>
        )}

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mb-10 rounded-2xl border border-pink-500/20 bg-white/5 p-6"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-black">
                {editingId ? "Edit Category" : "Add Category"}
              </h2>

              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg border border-white/10 p-3"
              >
                <FaTimes />
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <input
                name="name"
                placeholder="Category Name"
                value={form.name}
                onChange={handleChange}
                required
                className="rounded-lg border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-pink-500"
              />

              <input
                name="image"
                placeholder="Category Image URL"
                value={form.image}
                onChange={handleChange}
                className="rounded-lg border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-pink-500"
              />
            </div>

            <textarea
              name="description"
              placeholder="Category Description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              className="mt-5 w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-pink-500"
            />

            <button
              type="submit"
              disabled={saving}
              className="mt-5 flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-bold hover:bg-green-700 disabled:opacity-60"
            >
              <FaSave />
              {saving ? "Saving..." : "Save Category"}
            </button>
          </form>
        )}

        {loading ? (
          <p className="text-gray-400">Loading categories...</p>
        ) : categories.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
            <p className="text-gray-400">
              No categories available.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <div
                key={category._id}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="mb-5 h-40 w-full rounded-xl object-cover"
                  />
                ) : (
                  <div className="mb-5 flex h-40 items-center justify-center rounded-xl bg-black text-6xl">
                    🎆
                  </div>
                )}

                <h2 className="text-2xl font-black">
                  {category.name}
                </h2>

                <p className="mt-3 min-h-12 text-gray-400">
                  {category.description || "No description"}
                </p>

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => openEditForm(category)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-bold"
                  >
                    <FaEdit />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteCategory(category._id)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 font-bold"
                  >
                    <FaTrash />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}