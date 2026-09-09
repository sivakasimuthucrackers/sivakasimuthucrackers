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

const styles = {
  page: {
    width: "100%",
    padding: "24px",
    color: "#111827",
    boxSizing: "border-box",
  },
  heading: {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "24px",
    color: "#ffffff",
  },
  form: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "32px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
    color: "#111827",
  },
  field: {
    marginBottom: "18px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    color: "#111827",
    fontWeight: "600",
    fontSize: "15px",
  },
  input: {
    display: "block",
    width: "100%",
    height: "46px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    padding: "0 12px",
    background: "#ffffff",
    color: "#111827",
    fontSize: "15px",
    boxSizing: "border-box",
    outline: "none",
  },
  textarea: {
    display: "block",
    width: "100%",
    minHeight: "90px",
    maxHeight: "180px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    padding: "12px",
    background: "#ffffff",
    color: "#111827",
    fontSize: "15px",
    boxSizing: "border-box",
    resize: "vertical",
    outline: "none",
  },
  file: {
    display: "block",
    width: "100%",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    padding: "10px",
    background: "#ffffff",
    color: "#111827",
    boxSizing: "border-box",
  },
  help: {
    color: "#6b7280",
    fontSize: "13px",
    marginTop: "7px",
  },
  twoCol: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
  },
  previewBox: {
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "12px",
    maxWidth: "600px",
    marginBottom: "18px",
  },
  previewMedia: {
    width: "100%",
    maxHeight: "320px",
    objectFit: "contain",
    borderRadius: "8px",
    background: "#111111",
  },
  activeRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "20px",
    color: "#111827",
    fontWeight: "600",
  },
  buttons: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  uploadBtn: {
    background: "#ec007a",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    padding: "12px 22px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
  },
  resetBtn: {
    background: "#6b7280",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    padding: "12px 22px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "#ffffff",
    borderRadius: "14px",
    overflow: "hidden",
    boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
    color: "#111827",
  },
  cardMedia: {
    width: "100%",
    height: "210px",
    objectFit: "cover",
    background: "#111111",
  },
  cardBody: {
    padding: "16px",
  },
  editBtn: {
    background: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: "7px",
    padding: "9px 15px",
    cursor: "pointer",
  },
  deleteBtn: {
    background: "#dc2626",
    color: "#ffffff",
    border: "none",
    borderRadius: "7px",
    padding: "9px 15px",
    cursor: "pointer",
  },
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
        console.error(data.message || "Unable to load gallery");
      }
    } catch (err) {
      console.error("Gallery load error:", err);
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
      alert("Please select an image or video file.");
      e.target.value = "";
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      alert("File size must be 100 MB or less.");
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
      alert("Please select an image or video.");
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

      const response = await fetch(
        editingId ? `${API_URL}/${editingId}` : API_URL,
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        alert(data.message);
        resetForm();
        await loadGallery();
      } else {
        alert(data.message || "Unable to save gallery item.");
      }
    } catch (err) {
      console.error("Gallery save error:", err);
      alert("Gallery upload failed.");
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

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteGallery = async (id) => {
    if (!window.confirm("Delete this gallery image/video?")) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await response.json();

      alert(data.message || "Delete completed.");

      if (response.ok && data.success) {
        await loadGallery();
      }
    } catch (err) {
      console.error("Gallery delete error:", err);
      alert("Unable to delete gallery item.");
    }
  };

  const currentItem = editingId
    ? gallery.find((item) => item._id === editingId)
    : null;

  const currentPreviewIsVideo =
    mediaFile?.type?.startsWith("video/") ||
    (!mediaFile && currentItem?.resourceType === "video");

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Gallery Management</h1>

      <form onSubmit={saveGallery} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>Gallery Title</label>
          <input
            type="text"
            name="title"
            placeholder="Example: Diwali Celebration"
            value={form.title}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Description</label>
          <textarea
            name="description"
            placeholder="Optional description"
            value={form.description}
            onChange={handleChange}
            style={styles.textarea}
            rows={3}
          />
        </div>

        <div style={styles.twoCol}>
          <div style={styles.field}>
            <label style={styles.label}>Category</label>
            <input
              type="text"
              name="category"
              placeholder="General"
              value={form.category}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Display Order</label>
            <input
              type="number"
              name="displayOrder"
              value={form.displayOrder}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>
            {editingId
              ? "Replace Image / Video (optional)"
              : "Upload Image / Video"}
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
            onChange={handleMediaChange}
            style={styles.file}
            required={!editingId}
          />

          <div style={styles.help}>
            Supported: JPG, PNG, WEBP, GIF, MP4, WEBM, MOV. Maximum 100 MB.
          </div>
        </div>

        {previewUrl && (
          <div style={styles.previewBox}>
            <div style={{ ...styles.label, marginBottom: "10px" }}>
              Preview
            </div>

            {currentPreviewIsVideo ? (
              <video
                src={previewUrl}
                controls
                playsInline
                style={styles.previewMedia}
              />
            ) : (
              <img
                src={previewUrl}
                alt="Gallery preview"
                style={styles.previewMedia}
              />
            )}
          </div>
        )}

        <label style={styles.activeRow}>
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
          />
          Active
        </label>

        <div style={styles.buttons}>
          <button
            type="submit"
            disabled={saving}
            style={{
              ...styles.uploadBtn,
              opacity: saving ? 0.6 : 1,
            }}
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
            style={styles.resetBtn}
          >
            Reset
          </button>
        </div>
      </form>

      {loading ? (
        <p style={{ color: "#ffffff", textAlign: "center" }}>
          Loading Gallery...
        </p>
      ) : (
        <div style={styles.grid}>
          {gallery.map((item) => {
            const mediaUrl = item.mediaUrl || item.image;

            return (
              <div key={item._id} style={styles.card}>
                {item.resourceType === "video" ? (
                  <video
                    src={mediaUrl}
                    controls
                    preload="metadata"
                    playsInline
                    style={styles.cardMedia}
                  />
                ) : (
                  <img
                    src={mediaUrl}
                    alt={item.title}
                    style={styles.cardMedia}
                  />
                )}

                <div style={styles.cardBody}>
                  <h2
                    style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      marginBottom: "8px",
                    }}
                  >
                    {item.title}
                  </h2>

                  {item.description && (
                    <p style={{ color: "#6b7280", marginBottom: "8px" }}>
                      {item.description}
                    </p>
                  )}

                  <p><b>Type:</b> {item.resourceType || "image"}</p>
                  <p><b>Category:</b> {item.category}</p>
                  <p><b>Order:</b> {item.displayOrder}</p>
                  <p>
                    <b>Status:</b>{" "}
                    <span
                      style={{
                        color: item.isActive ? "#16a34a" : "#dc2626",
                      }}
                    >
                      {item.isActive ? "Active" : "Inactive"}
                    </span>
                  </p>

                  <div style={{ ...styles.buttons, marginTop: "14px" }}>
                    <button
                      type="button"
                      onClick={() => editGallery(item)}
                      style={styles.editBtn}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteGallery(item._id)}
                      style={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {gallery.length === 0 && (
            <div
              style={{
                color: "#ffffff",
                textAlign: "center",
                gridColumn: "1 / -1",
                padding: "30px",
              }}
            >
              No Gallery Images / Videos Found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
