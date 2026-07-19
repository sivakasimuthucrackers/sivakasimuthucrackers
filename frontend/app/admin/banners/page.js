"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaEdit,
  FaImage,
  FaPlus,
  FaSave,
  FaTimes,
  FaTrash,
} from "react-icons/fa";

const API_URL = "https://muthu-crackers-backend.onrender.com";

const emptyForm = {
  title: "",
  subtitle: "",
  offerText: "",
  description: "",
  image: "",
  mobileImage: "",
  buttonText: "Shop Now",
  buttonLink: "/products",
  secondaryButtonText: "Price List",
  secondaryButtonLink: "/price-list",
  backgroundFrom: "#7f002f",
  backgroundVia: "#d91464",
  backgroundTo: "#ff6a00",
  displayOrder: 1,
  isActive: true,
};

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-gray-300">
        {label}
      </span>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-4 outline-none transition focus:border-pink-500"
      />
    </label>
  );
}

export default function AdminBannersPage() {
  const router = useRouter();

  const [banners, setBanners] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadBanners() {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("muthuAdminToken");

      if (!token) {
        router.push("/admin/login");
        return;
      }

      const response = await fetch(`${API_URL}/api/banners`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load banners"
        );
      }

      setBanners(data.banners || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBanners();
  }, []);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? Number(value)
            : value,
    }));
  }

  function openCreateForm() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
    setMessage("");
    setError("");
  }

  function openEditForm(banner) {
    setEditingId(banner._id);
    setForm({
      ...emptyForm,
      ...banner,
    });
    setShowForm(true);
    setMessage("");
    setError("");
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const token = localStorage.getItem("muthuAdminToken");

      const url = editingId
        ? `${API_URL}/api/banners/${editingId}`
        : `${API_URL}/api/banners`;

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
          data.message || "Unable to save banner"
        );
      }

      setMessage(data.message);
      closeForm();
      await loadBanners();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function toggleBanner(banner) {
    try {
      const token = localStorage.getItem("muthuAdminToken");

      const response = await fetch(
        `${API_URL}/api/banners/${banner._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            isActive: !banner.isActive,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to update banner"
        );
      }

      setMessage(data.message);
      await loadBanners();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteBanner(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this banner?"
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("muthuAdminToken");

      const response = await fetch(
        `${API_URL}/api/banners/${id}`,
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
          data.message || "Unable to delete banner"
        );
      }

      setMessage(data.message);
      await loadBanners();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="min-h-screen bg-[#080808] p-5 md:p-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="font-bold uppercase tracking-[4px] text-pink-500">
            Admin Panel
          </p>

          <h1 className="mt-2 text-4xl font-black">
            Banner Management
          </h1>

          <p className="mt-3 text-gray-400">
            Manage homepage slider banners and promotional text.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="flex items-center gap-2 rounded-xl bg-pink-600 px-6 py-3 font-black hover:bg-pink-700"
        >
          <FaPlus />
          Add Banner
        </button>
      </div>

      {message && (
        <p className="mb-6 rounded-xl bg-green-600/20 p-4 text-green-400">
          {message}
        </p>
      )}

      {error && (
        <p className="mb-6 rounded-xl bg-red-600/20 p-4 text-red-400">
          {error}
        </p>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 rounded-3xl border border-pink-500/20 bg-white/5 p-6 md:p-8"
        >
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-black">
              {editingId ? "Edit Banner" : "Add Banner"}
            </h2>

            <button
              type="button"
              onClick={closeForm}
              className="rounded-full border border-white/10 p-3 hover:border-pink-500"
            >
              <FaTimes />
            </button>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />

            <Field
              label="Subtitle"
              name="subtitle"
              value={form.subtitle}
              onChange={handleChange}
            />

            <Field
              label="Offer Text"
              name="offerText"
              value={form.offerText}
              onChange={handleChange}
            />

            <Field
              label="Display Order"
              name="displayOrder"
              value={form.displayOrder}
              onChange={handleChange}
              type="number"
            />

            <Field
              label="Desktop Image URL / Path"
              name="image"
              value={form.image}
              onChange={handleChange}
            />

            <Field
              label="Mobile Image URL / Path"
              name="mobileImage"
              value={form.mobileImage}
              onChange={handleChange}
            />

            <Field
              label="Primary Button Text"
              name="buttonText"
              value={form.buttonText}
              onChange={handleChange}
            />

            <Field
              label="Primary Button Link"
              name="buttonLink"
              value={form.buttonLink}
              onChange={handleChange}
            />

            <Field
              label="Secondary Button Text"
              name="secondaryButtonText"
              value={form.secondaryButtonText}
              onChange={handleChange}
            />

            <Field
              label="Secondary Button Link"
              name="secondaryButtonLink"
              value={form.secondaryButtonLink}
              onChange={handleChange}
            />

            <Field
              label="Gradient Start"
              name="backgroundFrom"
              value={form.backgroundFrom}
              onChange={handleChange}
              type="color"
            />

            <Field
              label="Gradient Middle"
              name="backgroundVia"
              value={form.backgroundVia}
              onChange={handleChange}
              type="color"
            />

            <Field
              label="Gradient End"
              name="backgroundTo"
              value={form.backgroundTo}
              onChange={handleChange}
              type="color"
            />
          </div>

          <label className="mt-5 block">
            <span className="mb-2 block text-sm font-bold text-gray-300">
              Description
            </span>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-4 outline-none focus:border-pink-500"
            />
          </label>

          <label className="mt-5 flex items-center gap-3">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
              className="h-5 w-5 accent-pink-600"
            />

            <span className="font-bold">
              Active Banner
            </span>
          </label>

          <button
            type="submit"
            disabled={saving}
            className="mt-7 flex w-full items-center justify-center gap-3 rounded-xl bg-pink-600 px-6 py-4 text-lg font-black hover:bg-pink-700 disabled:opacity-60"
          >
            <FaSave />
            {saving ? "Saving Banner..." : "Save Banner"}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-gray-400">
          Loading banners...
        </p>
      ) : banners.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
          <FaImage className="mx-auto text-6xl text-gray-600" />

          <h2 className="mt-5 text-2xl font-black">
            No banners available
          </h2>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          {banners.map((banner) => (
            <article
              key={banner._id}
              className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-lg"
            >
              <div
                className="relative flex min-h-72 items-center justify-center overflow-hidden p-8 text-center"
                style={{
                  background: banner.image
                    ? `linear-gradient(rgba(0,0,0,.55), rgba(0,0,0,.65)), url("${banner.image}") center/cover`
                    : `linear-gradient(135deg, ${banner.backgroundFrom}, ${banner.backgroundVia}, ${banner.backgroundTo})`,
                }}
              >
                <div>
                  <p className="font-bold uppercase tracking-[4px] text-yellow-200">
                    {banner.subtitle}
                  </p>

                  <h2 className="mt-3 text-4xl font-black">
                    {banner.title}
                  </h2>

                  <p className="mt-3 text-2xl font-black text-yellow-300">
                    {banner.offerText}
                  </p>

                  <p className="mx-auto mt-4 max-w-lg text-white/80">
                    {banner.description}
                  </p>
                </div>

                <span
                  className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-black ${
                    banner.isActive
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {banner.isActive ? "ACTIVE" : "INACTIVE"}
                </span>
              </div>

              <div className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-gray-400">
                    Display Order:{" "}
                    <span className="font-black text-white">
                      {banner.displayOrder}
                    </span>
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => toggleBanner(banner)}
                      className="rounded-xl border border-yellow-500 px-4 py-2 font-bold text-yellow-400"
                    >
                      {banner.isActive
                        ? "Deactivate"
                        : "Activate"}
                    </button>

                    <button
                      type="button"
                      onClick={() => openEditForm(banner)}
                      className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 font-bold hover:bg-blue-700"
                    >
                      <FaEdit />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteBanner(banner._id)}
                      className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 font-bold hover:bg-red-700"
                    >
                      <FaTrash />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
