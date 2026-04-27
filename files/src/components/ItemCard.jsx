const BASE_URL = "http://localhost:5000";

export default function ItemCard({ item, index }) {
  const isLost = item.category === "Lost";

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
      }}
    >
      {/* Image */}
      <div
        style={{
          width: "100%",
          aspectRatio: "4/3",
          overflow: "hidden",
          background: "var(--bg-surface)",
          position: "relative",
          flexShrink: 0,
        }}
      >
        {item.image_url ? (
          <img
            src={item.image_url} /* <-- REMOVED BASE_URL HERE */
            alt={item.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.4s ease",
            }}
            onMouseEnter={e => (e.target.style.transform = "scale(1.04)")}
            onMouseLeave={e => (e.target.style.transform = "scale(1)")}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" opacity="0.3">
              <rect x="4" y="8" width="32" height="24" rx="4" stroke="var(--text-primary)" strokeWidth="2" />
              <circle cx="14" cy="18" r="4" stroke="var(--text-primary)" strokeWidth="2" />
              <path d="M4 28 L14 20 L22 26 L28 20 L36 28" stroke="var(--text-primary)" strokeWidth="2" strokeLinejoin="round" />
            </svg>
            <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>
              No image
            </span>
          </div>
        )}

        {/* Badge overlay */}
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
          }}
        >
          <span
            className={isLost ? "badge-lost" : "badge-found"}
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: "3px 10px",
              borderRadius: 999,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            {item.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "16px 18px 18px", flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        <h3
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 17,
            fontWeight: 700,
            color: "var(--text-primary)",
            lineHeight: 1.3,
          }}
        >
          {item.title}
        </h3>

        <p
          style={{
            fontSize: 13.5,
            color: "var(--text-secondary)",
            lineHeight: 1.55,
            flex: 1,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {item.description}
        </p>

        {/* Divider */}
        <div style={{ height: 1, background: "var(--border)", margin: "6px 0" }} />

        {/* Contact */}
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: isLost ? "#FDECEA" : "#E8F5ED",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path
                d="M6.5 1C4.5 1 2.5 2.8 2.5 5.2c0 2.8 4 6.8 4 6.8s4-4 4-6.8C10.5 2.8 8.5 1 6.5 1z"
                stroke={isLost ? "var(--accent-lost)" : "var(--accent-found)"}
                strokeWidth="1.3"
                fill="none"
              />
              <circle
                cx="6.5"
                cy="5"
                r="1.4"
                stroke={isLost ? "var(--accent-lost)" : "var(--accent-found)"}
                strokeWidth="1.3"
              />
            </svg>
          </div>
          <span
            style={{
              fontSize: 12.5,
              color: "var(--text-secondary)",
              fontWeight: 500,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {item.contact}
          </span>
        </div>
      </div>
    </div>
  );
}
