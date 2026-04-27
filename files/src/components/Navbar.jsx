import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav
      style={{
        background: "rgba(250,247,242,0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 24px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "var(--text-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="8" cy="8" r="5" stroke="#FAF7F2" strokeWidth="1.8" />
                <path d="M12 12 L16 16" stroke="#FAF7F2" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M8 5.5 V8 H10.5" stroke="#FAF7F2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 17,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  lineHeight: 1.1,
                }}
              >
                Found & Lost
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "var(--text-muted)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                }}
              >
                Community Board
              </div>
            </div>
          </div>
        </Link>

        {/* Nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Link
            to="/"
            style={{
              textDecoration: "none",
              padding: "7px 16px",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              color: pathname === "/" ? "var(--text-primary)" : "var(--text-secondary)",
              background: pathname === "/" ? "var(--bg-surface)" : "transparent",
              transition: "all 0.16s ease",
            }}
          >
            Browse Items
          </Link>
          <Link
            to="/add"
            style={{ textDecoration: "none" }}
          >
            <button
              className="btn-primary"
              style={{
                padding: "8px 18px",
                borderRadius: 9,
                fontSize: 14,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span style={{ fontSize: 16, lineHeight: 1 }}>+</span>
              Post Item
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
