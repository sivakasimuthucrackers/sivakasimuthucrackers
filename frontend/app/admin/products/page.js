"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaEdit,
  FaImage,
  FaPlus,
  FaSave,
  FaTrash,
  FaTimes,
} from "react-icons/fa";

const API_URL = "http://localhost:5000";

const emptyForm = {
  productCode: "",
  name: "",
  slug: "",
  category: "",
  mrp: "",
  offerPrice: "",
  discount: "",
  unit: "Box",
  description: "",
  stockQuantity: "100",
  image: "",
  isActive: true,
};

export default function AdminProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

async function loadProducts() {
  try {
    setLoading(true);
    setError("");

    let page = 1;
    let totalPages = 1;
    let allProducts = [];

    do {
      const response = await fetch(
        `${API_URL}/api/products?page=${page}&limit=100`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load products");
      }

      allProducts = [...allProducts, ...(data.products || [])];
      totalPages = data.pages || 1;
      page += 1;
    } while (page <= totalPages);

    // Remove duplicate products using MongoDB _id
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

  useEffect(() => {
    const token = localStorage.getItem("muthuAdminToken");

    if (!token) {
      router.push("/admin/login");
      return;
    }

    loadProducts();
  }, [router]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function createSlug(value) {
    return String(value)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0] || null;

    setSelectedImage(file);

    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(form.image || "");
    }
  }

  function resetForm() {
    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setForm(emptyForm);
    setEditingId(null);
    setSelectedImage(null);
    setImagePreview("");
    setShowForm(false);
  }

  function openAddForm() {
    resetForm();

    setForm(emptyForm);
    setShowForm(true);
    setMessage("");
    setError("");
  }

  function openEditForm(product) {
    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setForm({
      productCode: product.productCode || "",
      name: product.name || "",
      slug: product.slug || "",
      category: product.category || "",
      mrp: product.mrp ?? "",
      offerPrice: product.offerPrice ?? "",
      discount: product.discount ?? "",
      unit: product.unit || "Box",
      description: product.description || "",
      stockQuantity: product.stockQuantity ?? "0",
      image: product.image || "",
      isActive: product.isActive ?? true,
    });

    setEditingId(product._id);
    setSelectedImage(null);
    setImagePreview(product.image || "");
    setShowForm(true);
    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function uploadImage() {
    if (!selectedImage) {
      return form.image;
    }

    try {
      setUploadingImage(true);

      const token = localStorage.getItem("muthuAdminToken");

      const formData = new FormData();
      formData.append("image", selectedImage);

      const response = await fetch(
        `${API_URL}/api/upload/product-image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Image upload failed");
      }

      return data.imageUrl;
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const token = localStorage.getItem("muthuAdminToken");

      if (!token) {
        router.push("/admin/login");
        return;
      }

      const uploadedImage = await uploadImage();

      const payload = {
        ...form,
        image: uploadedImage || form.image,
        slug: form.slug || createSlug(form.name),
        mrp: Number(form.mrp),
        offerPrice: Number(form.offerPrice),
        discount: Number(form.discount),
        stockQuantity: Number(form.stockQuantity),
      };

      const url = editingId
        ? `${API_URL}/api/products/${editingId}`
        : `${API_URL}/api/products`;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save product");
      }

      setMessage(data.message || "Product saved successfully");
      resetForm();

      await loadProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct(productId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      const token = localStorage.getItem("muthuAdminToken");

      const response = await fetch(
        `${API_URL}/api/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete product");
      }

      setMessage(data.message || "Product deleted successfully");
      await loadProducts();
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
              Product Management
            </h1>

            <p className="mt-2 text-gray-400">
              Total products: {products.length}
            </p>
          </div>

          <button
            type="button"
            onClick={openAddForm}
            className="flex items-center gap-2 rounded-lg bg-pink-600 px-5 py-3 font-bold hover:bg-pink-700"
          >
            <FaPlus />
            Add Product
          </button>
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
                {editingId ? "Edit Product" : "Add Product"}
              </h2>

              <button
                type="button"
                onClick={resetForm}
                aria-label="Close form"
                className="rounded-lg border border-white/10 p-3"
              >
                <FaTimes />
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              <input
                name="productCode"
                placeholder="Product Code"
                value={form.productCode}
                onChange={handleChange}
                required
                className="rounded-lg border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-pink-500"
              />

              <input
                name="name"
                placeholder="Product Name"
                value={form.name}
                onChange={handleChange}
                required
                className="rounded-lg border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-pink-500"
              />

              <input
                name="category"
                placeholder="Category"
                value={form.category}
                onChange={handleChange}
                required
                className="rounded-lg border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-pink-500"
              />

              <input
                type="number"
                name="mrp"
                placeholder="MRP"
                min="0"
                value={form.mrp}
                onChange={handleChange}
                required
                className="rounded-lg border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-pink-500"
              />

              <input
                type="number"
                name="offerPrice"
                placeholder="Offer Price"
                min="0"
                value={form.offerPrice}
                onChange={handleChange}
                required
                className="rounded-lg border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-pink-500"
              />

              <input
                type="number"
                name="discount"
                placeholder="Discount %"
                min="0"
                max="100"
                value={form.discount}
                onChange={handleChange}
                className="rounded-lg border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-pink-500"
              />

              <input
                name="unit"
                placeholder="Unit"
                value={form.unit}
                onChange={handleChange}
                className="rounded-lg border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-pink-500"
              />

              <input
                type="number"
                name="stockQuantity"
                placeholder="Stock Quantity"
                min="0"
                value={form.stockQuantity}
                onChange={handleChange}
                className="rounded-lg border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-pink-500"
              />

              <label className="rounded-lg border border-white/10 bg-black/40 px-4 py-3">
                <span className="mb-2 flex items-center gap-2 text-sm text-gray-300">
                  <FaImage className="text-pink-500" />
                  Product Image
                </span>

                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-400"
                />
              </label>
            </div>

            {selectedImage && (
              <p className="mt-4 text-sm text-green-400">
                Selected: {selectedImage.name}
              </p>
            )}

            {imagePreview && (
              <div className="mt-5">
                <p className="mb-2 text-sm text-gray-400">
                  Image Preview
                </p>

                <img
                  src={imagePreview}
                  alt="Product preview"
                  className="h-40 w-40 rounded-xl border border-white/10 bg-black object-contain p-2"
                />
              </div>
            )}

            <textarea
              name="description"
              placeholder="Product Description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              className="mt-5 w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-pink-500"
            />

            <button
              type="submit"
              disabled={saving || uploadingImage}
              className="mt-5 flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-bold hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FaSave />

              {uploadingImage
                ? "Uploading Image..."
                : saving
                  ? "Saving Product..."
                  : "Save Product"}
            </button>
          </form>
        )}

        {loading ? (
          <p className="text-gray-400">Loading products...</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="min-w-full bg-white/5">
              <thead className="bg-black">
                <tr>
                  <th className="px-4 py-4 text-left">Image</th>
                  <th className="px-4 py-4 text-left">Code</th>
                  <th className="px-4 py-4 text-left">Product</th>
                  <th className="px-4 py-4 text-left">Category</th>
                  <th className="px-4 py-4 text-left">MRP</th>
                  <th className="px-4 py-4 text-left">Offer</th>
                  <th className="px-4 py-4 text-left">Stock</th>
                  <th className="px-4 py-4 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr
                    key={product._id}
                    className="border-t border-white/10"
                  >
                    <td className="px-4 py-4">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-14 w-14 rounded-lg bg-black object-contain"
                        />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-black text-2xl">
                          🎆
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      {product.productCode}
                    </td>

                    <td className="px-4 py-4">
                      {product.name}
                    </td>

                    <td className="px-4 py-4">
                      {product.category}
                    </td>

                    <td className="px-4 py-4">
                      ₹{product.mrp}
                    </td>

                    <td className="px-4 py-4 text-yellow-400">
                      ₹{product.offerPrice}
                    </td>

                    <td className="px-4 py-4">
                      {product.stockQuantity}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => openEditForm(product)}
                          className="rounded-lg bg-blue-600 p-3"
                          aria-label="Edit product"
                        >
                          <FaEdit />
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteProduct(product._id)}
                          className="rounded-lg bg-red-600 p-3"
                          aria-label="Delete product"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}