import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddItem() {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Lost",
    contact: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: "" }));
  }

  function handleImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be under 10MB.");
      return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setError("");
  }

  function removeImage() {
    setImage(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  function validate() {
    const errors = {};
    if (!form.title.trim()) errors.title = "Title is required.";
    if (!form.description.trim()) errors.description = "Description is required.";
    if (!form.contact.trim()) errors.contact = "Contact info is required.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError("");

    try {
      const data = new FormData();
      data.append("title", form.title.trim());
      data.append("description", form.description.trim());
      data.append("category", form.category);
      data.append("contact", form.contact.trim());
      if (image) data.append("image", image);

      await axios.post("http://localhost:5000/api/items", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(true);
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to post item. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div
        style={{
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <div
          className="fade-up"
          style={{ textAlign: "center", maxWidth: 360 }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "#E8F5ED",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path
                d="M8 16 L13 21 L24 11"
                stroke="var(--accent-found)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 26,
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: 10,
            }}
          >
            Item Posted!
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 15, marginBottom: 6 }}>
            Your item has been successfully posted to the community board.
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
            Redirecting you back to browse…
          </p>
        </div>
      </div>
    );
  }

  const isLost = form.category === "Lost";

  return (
    <main style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px 80px" }}>
      {/* Header */}
      <div className="fade-up" style={{ marginBottom: 36 }}>
        <p
          style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--accent-amber)",
            marginBottom: 10,
          }}
        >
          New Submission
        </p>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(24px, 4vw, 36px)",
            fontWeight: 700,
            color: "var(--text-primary)",
            lineHeight: 1.2,
            marginBottom: 10,
          }}
        >
          Post a Lost or Found Item
        </h1>
        <p style={{ fontSize: 14.5, color: "var(--text-secondary)", lineHeight: 1.6 }}>
          Fill in the details below to help connect items with their owners.
        </p>
      </div>

      {/* Form card */}
      <form
        onSubmit={handleSubmit}
        className="fade-up"
        style={{
          background: "white",
          border: "1px solid var(--border)",
          borderRadius: 20,
          padding: "32px 36px",
          boxShadow: "var(--shadow-md)",
          animationDelay: "60ms",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {/* Category selector */}
        <div>
          <label
            style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 10 }}
          >
            Category <span style={{ color: "var(--accent-lost)" }}>*</span>
          </label>
          <div style={{ display: "flex", gap: 12 }}>
            {["Lost", "Found"].map(cat => (
              <button
                type="button"
                key={cat}
                onClick={() => setForm(prev => ({ ...prev, category: cat }))}
                style={{
                  flex: 1,
                  padding: "12px 0",
                  borderRadius: 12,
                  border: `2px solid ${
                    form.category === cat
                      ? cat === "Lost"
                        ? "var(--accent-lost)"
                        : "var(--accent-found)"
                      : "var(--border)"
                  }`,
                  background:
                    form.category === cat
                      ? cat === "Lost"
                        ? "#FDECEA"
                        : "#E8F5ED"
                      : "transparent",
                  color:
                    form.category === cat
                      ? cat === "Lost"
                        ? "var(--accent-lost)"
                        : "var(--accent-found)"
                      : "var(--text-secondary)",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                  transition: "all 0.18s ease",
                }}
              >
                {cat === "Lost" ? "Lost" : "Found"}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label
            style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}
          >
            Item Title <span style={{ color: "var(--accent-lost)" }}>*</span>
          </label>
          <input
            className="input-field"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder={isLost ? "e.g. Blue backpack with laptop" : "e.g. Found brown leather wallet"}
            maxLength={120}
          />
          {fieldErrors.title && (
            <p style={{ fontSize: 12, color: "var(--accent-lost)", marginTop: 5 }}>
              {fieldErrors.title}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}
          >
            Description <span style={{ color: "var(--accent-lost)" }}>*</span>
          </label>
          <textarea
            className="input-field"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the item in detail — color, size, distinctive marks, where it was lost/found, etc."
            rows={4}
            style={{ resize: "vertical", minHeight: 100 }}
          />
          {fieldErrors.description && (
            <p style={{ fontSize: 12, color: "var(--accent-lost)", marginTop: 5 }}>
              {fieldErrors.description}
            </p>
          )}
        </div>

        {/* Contact */}
        <div>
          <label
            style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}
          >
            Contact Info <span style={{ color: "var(--accent-lost)" }}>*</span>
          </label>
          <input
            className="input-field"
            name="contact"
            value={form.contact}
            onChange={handleChange}
            placeholder="Phone number, email, or any preferred contact method"
          />
          {fieldErrors.contact && (
            <p style={{ fontSize: 12, color: "var(--accent-lost)", marginTop: 5 }}>
              {fieldErrors.contact}
            </p>
          )}
        </div>

        {/* Image upload */}
        <div>
          <label
            style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}
          >
            Photo{" "}
            <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(optional)</span>
          </label>

          {preview ? (
            <div style={{ position: "relative", display: "inline-block" }}>
              <img
                src={preview}
                alt="Preview"
                style={{
                  width: "100%",
                  maxHeight: 220,
                  objectFit: "cover",
                  borderRadius: 12,
                  border: "1.5px solid var(--border)",
                }}
              />
              <button
                type="button"
                onClick={removeImage}
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: "rgba(0,0,0,0.55)",
                  border: "none",
                  color: "white",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 16,
                  lineHeight: 1,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ×
              </button>
              <div
                style={{
                  marginTop: 8,
                  fontSize: 12,
                  color: "var(--text-muted)",
                }}
              >
                📎 {image.name} ({(image.size / 1024).toFixed(0)} KB)
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                border: "2px dashed var(--border)",
                borderRadius: 12,
                padding: "32px 24px",
                textAlign: "center",
                cursor: "pointer",
                transition: "border-color 0.18s ease, background 0.18s ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "var(--accent-amber)";
                e.currentTarget.style.background = "#FFFBF5";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>📷</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>
                Click to upload a photo
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                PNG, JPG, WEBP up to 10 MB
              </div>
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleImage}
            style={{ display: "none" }}
          />
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              background: "#FDECEA",
              border: "1px solid #F5C6C2",
              borderRadius: 10,
              padding: "12px 16px",
              fontSize: 13.5,
              color: "#7B2D26",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>⚠️</span>
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
          style={{
            padding: "14px 0",
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? (
            <>
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                style={{ animation: "spin 0.8s linear infinite" }}
              >
                <circle cx="9" cy="9" r="7" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                <path d="M9 2 A7 7 0 0 1 16 9" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Posting…
            </>
          ) : (
            <>Post Item to Board</>
          )}
        </button>
      </form>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @media (max-width: 520px) {
          form { padding: 24px 20px !important; }
        }
      `}</style>
    </main>
  );
}
