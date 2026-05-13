import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ItemCard({ item, index, refreshItems }) {
  const { user } = useContext(AuthContext);
  const isLost = item.category === "Lost";

  // Important: Convert user_id to string for comparison since JWT identity is a string
  const isOwner = user && String(user.id) === String(item.user_id);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(`https://lost-and-found-portal-et2c.onrender.com/api/items/${item.id}`);
      refreshItems();
    } catch (err) {
      alert("Failed to delete. Make sure you are the owner.");
    }
  };

  const handleResolve = async () => {
    try {
      await axios.put(`https://lost-and-found-portal-et2c.onrender.com/api/items/${item.id}`);
      refreshItems();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  return (
    <div
      className="card-hover fade-up"
      style={{
        background: "var(--bg-card)",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "var(--shadow-sm)",
        border: "1px solid var(--border)",
        animationDelay: `${index * 60}ms`,
        display: "flex",
        flexDirection: "column",
        opacity: item.is_resolved ? 0.7 : 1,
      }}
    >
      {/* 1. Image Section */}
      <div style={{ width: "100%", aspectRatio: "4/3", overflow: "hidden", background: "var(--bg-surface)", position: "relative" }}>
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
            No image
          </div>
        )}

        <div style={{ position: "absolute", top: 12, left: 12 }}>
          <span className={isLost ? "badge-lost" : "badge-found"} style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 999, textTransform: "uppercase" }}>
            {item.category} {item.item_category ? `• ${item.item_category}` : ""}
          </span>
        </div>
      </div>

      {/* 2. Content Section */}
      <div style={{ padding: "16px 18px 18px", flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.3 }}>
          {item.title}
        </h3>
        <p style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.55, flex: 1 }}>
          {item.description}
        </p>

        <div style={{ height: 1, background: "var(--border)", margin: "6px 0" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, color: "var(--text-secondary)" }}>
          👤 {item.owner_username || "Anonymous"} • 📞 {item.contact}
        </div>
      </div>

      {/* 3. Resolved Overlay */}
      {item.is_resolved && (
        <div style={{ background: "#E8F5ED", color: "var(--accent-found)", padding: "6px 0", textAlign: "center", fontSize: 12, fontWeight: "bold", borderTop: "1px solid var(--border)" }}>
          ✓ {isLost ? "ITEM FOUND" : "ITEM RETURNED"}
        </div>
      )}

      {/* 4. Owner Actions Section */}
      {isOwner && !item.is_resolved && (
        <div style={{ padding: "10px 18px", borderTop: "1px solid var(--border)", display: "flex", gap: 10, background: "#fcfcfc" }}>
          <button onClick={handleResolve} style={{ flex: 2, padding: "8px", fontSize: 12, borderRadius: 8, border: "1px solid var(--accent-found)", background: "white", cursor: "pointer", color: "var(--accent-found)", fontWeight: 600 }}>
            Mark {isLost ? "Found" : "Returned"}
          </button>

          <Link to={`/edit/${item.id}`} style={{ flex: 1, textDecoration: "none" }}>
            <button style={{ width: "100%", padding: "8px", fontSize: 12, borderRadius: 8, border: "1px solid var(--border)", background: "white", cursor: "pointer", color: "var(--text-secondary)", fontWeight: 600 }}>
              Edit
            </button>
          </Link>

          <button onClick={handleDelete} style={{ flex: 1, padding: "8px", fontSize: 12, borderRadius: 8, border: "none", background: "#FDECEA", color: "var(--accent-lost)", cursor: "pointer", fontWeight: 600 }}>
            Delete
          </button>

        </div>
      )}
    </div>
  );
}