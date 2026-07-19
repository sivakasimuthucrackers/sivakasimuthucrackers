"use client";

import { useEffect, useState } from "react";

const API_URL = "https://muthu-crackers-backend.onrender.com/api/gallery";

const emptyForm = {
  title: "",
  description: "",
  category: "General",
  image: "",
  displayOrder: 0,
  isActive: true,
};

export default function GalleryAdminPage() {
  const [gallery, setGallery] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("muthuAdminToken");

      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setGallery(data.galleryItems);
      }

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? Number(value)
          : value,
    });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const saveGallery = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("muthuAdminToken");

    const method = editingId ? "PUT" : "POST";

    const url = editingId
      ? `${API_URL}/${editingId}`
      : API_URL;

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (data.success) {
      alert(data.message);
      resetForm();
      loadGallery();
    } else {
      alert(data.message);
    }
  };
  const editGallery = (item) => {
    setEditingId(item._id);

    setForm({
      title: item.title,
      description: item.description || "",
      category: item.category,
      image: item.image,
      displayOrder: item.displayOrder,
      isActive: item.isActive,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteGallery = async (id) => {
    if (!confirm("Delete this gallery image?")) return;

    const token = localStorage.getItem("muthuAdminToken");

    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    alert(data.message);

    if (data.success) {
      loadGallery();
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">

      <h1 className="text-3xl font-bold mb-6">
        Gallery Management
      </h1>

      <form
        onSubmit={saveGallery}
        className="bg-white rounded-xl shadow-lg p-6 mb-8 space-y-4"
      >

        <input
          type="text"
          name="title"
          placeholder="Gallery Title"
          value={form.title}
          onChange={handleChange}
          className="border w-full p-3 rounded-lg"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border w-full p-3 rounded-lg"
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="border w-full p-3 rounded-lg"
        />

        <input
          type="text"
          name="image"
          placeholder="/images/gallery/image1.jpg"
          value={form.image}
          onChange={handleChange}
          className="border w-full p-3 rounded-lg"
          required
        />

        <input
          type="number"
          name="displayOrder"
          value={form.displayOrder}
          onChange={handleChange}
          className="border w-full p-3 rounded-lg"
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
          />

          Active
        </label>

        <div className="flex gap-4">

          <button
            type="submit"
            className="bg-pink-600 text-white px-6 py-3 rounded-lg"
          >
            {editingId ? "Update Gallery" : "Add Gallery"}
          </button>

          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg"
          >
            Reset
          </button>

        </div>

      </form>
      {loading ? (
        <p className="text-center text-lg font-semibold">
          Loading Gallery...
        </p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">

          {gallery.map((item) => (

            <div
              key={item._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >

              <img
                src={item.image}
                alt={item.title}
                className="w-full h-52 object-cover"
              />

              <div className="p-4">

                <h2 className="text-xl font-bold">
                  {item.title}
                </h2>

                <p className="text-gray-600 mt-2">
                  {item.description}
                </p>

                <p className="mt-2">
                  <b>Category :</b> {item.category}
                </p>

                <p>
                  <b>Order :</b> {item.displayOrder}
                </p>

                <p>
                  <b>Status :</b>{" "}
                  {item.isActive ? (
                    <span className="text-green-600">
                      Active
                    </span>
                  ) : (
                    <span className="text-red-600">
                      Inactive
                    </span>
                  )}
                </p>

                <div className="flex gap-3 mt-4">

                  <button
                    onClick={() => editGallery(item)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteGallery(item._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>

          ))}

          {gallery.length === 0 && (
            <div className="col-span-full text-center py-10">

              <h2 className="text-2xl font-bold">
                No Gallery Images Found
              </h2>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
