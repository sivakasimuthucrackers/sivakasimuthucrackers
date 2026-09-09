"use client";

import { useEffect, useRef, useState } from "react";

const API_URL =
  "https://muthu-crackers-backend.onrender.com/api/gallery";

const emptyForm = {
  title: "",
  description: "",
  category: "General",
  displayOrder: 0,
  isActive: true,
};

export default function GalleryAdminPage() {
  const [gallery, setGallery] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [mediaFile, setMediaFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    loadGallery();
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const getToken = () => localStorage.getItem("muthuAdminToken");

  const loadGallery = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setGallery(data.galleryItems || []);
      } else {
        alert(data.message || "Unable to load gallery");
      }
    } catch (err) {
      console.error(err);
      alert("Unable to load gallery");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? Number(value)
          : value,
    }));
  };

  const handleMediaChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setMediaFile(null);
      return;
    }

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      alert("Please select an image or video file");
      e.target.value = "";
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      alert("File size must be 100 MB or less");
      e.target.value = "";
      return;
    }

    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setMediaFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const resetForm = () => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setForm(emptyForm);
    setEditingId(null);
    setMediaFile(null);
    setPreviewUrl("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const saveGallery = async (e) => {
    e.preventDefault();

    if (!editingId && !mediaFile) {
      alert("Please select an image or video");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("displayOrder", String(form.displayOrder));
      formData.append("isActive", String(form.isActive));

      if (mediaFile) {
        formData.append("media", mediaFile);
      }

      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert(data.message);
        resetForm();
        await loadGallery();
      } else {
        alert(data.message || "Unable to save gallery item");
      }
    } catch (err) {
      console.error(err);
      alert("Gallery upload failed");
    } finally {
      setSaving(false);
    }
  };

  const editGallery = (item) => {
    setEditingId(item._id);

    setForm({
      title: item.title || "",
      description: item.description || "",
      category: item.category || "General",
      displayOrder: item.displayOrder || 0,
      isActive: item.isActive !== false,
    });

    setMediaFile(null);
    setPreviewUrl(item.mediaUrl || item.image || "");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteGallery = async (id) => {
    if (!confirm("Delete this gallery image/video?")) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await response.json();

      alert(data.message || "Delete completed");

      if (response.ok && data.success) {
        await loadGallery();
      }
    } catch (err) {
      console.error(err);
      alert("Unable to delete gallery item");
    }
  };

  const currentPreviewIsVideo =
    mediaFile?.type?.startsWith("video/") ||
    (!mediaFile &&
      editingId &&
      gallery.find((item) => item._id === editingId)
        ?.resourceType === "video");

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Gallery Management
      </h1>

      <form
        onSubmit={saveGallery}
        className="bg-white rounded-xl shadow-lg p-5 md:p-6 mb-8 space-y-4"
      >
        <div>
          <label className="block font-semibold mb-2">
            Gallery Title
          </label>
          <input
            type="text"
            name="title"
            placeholder="Example: Diwali Celebration"
            value={form.title}
            onChange={handleChange}
            className="border w-full p-3 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">
            Description
          </label>
          <textarea
            name="description"
            placeholder="Optional description"
            value={form.description}
            onChange={handleChange}
            className="border w-full p-3 rounded-lg"
            rows={3}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-2">
              Category
            </label>
            <input
              type="text"
              name="category"
              placeholder="General"
              value={form.category}
              onChange={handleChange}
              className="border w-full p-3 rounded-lg"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Display Order
            </label>
            <input
              type="number"
              name="displayOrder"
              value={form.displayOrder}
              onChange={handleChange}
              className="border w-full p-3 rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-2">
            {editingId
              ? "Replace Image / Video (optional)"
              : "Upload Image / Video"}
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
            onChange={handleMediaChange}
            className="border w-full p-3 rounded-lg bg-white"
            required={!editingId}
          />

          <p className="text-sm text-gray-500 mt-2">
            Supported: JPG, PNG, WEBP, GIF, MP4, WEBM, MOV. Maximum 100 MB.
          </p>
        </div>

        {previewUrl && (
          <div className="border rounded-xl p-3 max-w-xl">
            <p className="font-semibold mb-2">Preview</p>

            {currentPreviewIsVideo ? (
              <video
                src={previewUrl}
                controls
                className="w-full max-h-80 rounded-lg bg-black"
              />
            ) : (
              <img
                src={previewUrl}
                alt="Gallery preview"
                className="w-full max-h-80 object-contain rounded-lg"
              />
            )}
          </div>
        )}

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
          />
          Active
        </label>

        <div className="flex flex-wrap gap-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-pink-600 disabled:opacity-60 text-white px-6 py-3 rounded-lg"
          >
            {saving
              ? "Uploading..."
              : editingId
              ? "Update Gallery"
              : "Upload to Gallery"}
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.map((item) => {
            const mediaUrl = item.mediaUrl || item.image;

            return (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                {item.resourceType === "video" ? (
                  <video
                    src={mediaUrl}
                    controls
                    preload="metadata"
                    className="w-full h-52 object-cover bg-black"
                  />
                ) : (
                  <img
                    src={mediaUrl}
                    alt={item.title}
                    className="w-full h-52 object-cover"
                  />
                )}

                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-xl font-bold">
                      {item.title}
                    </h2>

                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full uppercase">
                      {item.resourceType || "image"}
                    </span>
                  </div>

                  {item.description && (
                    <p className="text-gray-600 mt-2">
                      {item.description}
                    </p>
                  )}

                  <p className="mt-2">
                    <b>Category:</b> {item.category}
                  </p>

                  <p>
                    <b>Order:</b> {item.displayOrder}
                  </p>

                  <p>
                    <b>Status:</b>{" "}
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
            );
          })}

          {gallery.length === 0 && (
            <div className="col-span-full text-center py-10">
              <h2 className="text-2xl font-bold">
                No Gallery Images / Videos Found
              </h2>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
