import { useState, useEffect } from "react";
import axios from "axios";
import ItemCard from "../components/ItemCard";

const FILTERS = ["All", "Lost", "Found"];
const ITEM_CATEGORIES = ["All Types", "Electronic Gadgets", "Stationery Items", "Clothing", "Accessories", "Documents", "Others"];

function SkeletonCard() {
  return (
    <div style={{ background: "var(--bg-card)", borderRadius: 16, overflow: "hidden", border: "1px solid var(--border)" }}>
      <div className="skeleton" style={{ aspectRatio: "4/3", width: "100%" }} />
      <div style={{ padding: "16px 18px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
        <div className="skeleton" style={{ height: 20, width: "70%" }} />
        <div className="skeleton" style={{ height: 14, width: "100%" }} />
        <div className="skeleton" style={{ height: 14, width: "80%" }} />
      </div>
    </div>
  );
}

export default function Home() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get("http://localhost:5000/api/items");
      setItems(res.data);
    } catch {
      setError("Could not connect to the server. Make sure the backend is running on port 5000.");
    } finally {
      setLoading(false);
    }
  }

  // Advanced Filtering Logic
  const filtered = items.filter(i => {
    // 1. HIDDEN IF RESOLVED: Skip this item entirely if it is found/returned
    if (i.is_resolved) return false;

    // 2. Status Filter
    const matchStatus = filter === "All" || i.category === filter;

    // 3. Type Filter
    const matchType = typeFilter === "All Types" || i.item_category === typeFilter;

    // 4. Search Filter
    const matchSearch = (i.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (i.description || "").toLowerCase().includes(searchQuery.toLowerCase());

    return matchStatus && matchType && matchSearch;
  });


  const activeItems = items.filter(i => !i.is_resolved);

  const lostCount = activeItems.filter(i => i.category === "Lost").length;
  const foundCount = activeItems.filter(i => i.category === "Found").length;

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px" }}>
      {/* Hero header */}
      <div style={{ marginBottom: 40 }} className="fade-up">
        <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent-amber)", marginBottom: 10 }}>
          Community Board
        </p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.15, marginBottom: 12 }}>
          Lost something?<br />
          <em style={{ fontStyle: "italic", color: "var(--text-secondary)" }}>Someone found it.</em>
        </h1>
        <p style={{ fontSize: 15.5, color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: 480 }}>
          Browse reported lost and found items in your community. Help reunite people with their belongings.
        </p>
      </div>

      {/* Stats strip */}
      {!loading && !error && (
        <div className="fade-up" style={{ display: "flex", gap: 12, marginBottom: 32, animationDelay: "80ms" }}>
          {[
            { label: "Total Items", value: activeItems.length, color: "var(--text-primary)" }, // <-- Update this value
            { label: "Lost", value: lostCount, color: "var(--accent-lost)" },
            { label: "Found", value: foundCount, color: "var(--accent-found)" },
          ].map(stat => (
            <div key={stat.label} style={{ background: "white", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 20px", minWidth: 90 }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: stat.color, fontFamily: "'Playfair Display', serif" }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* NEW: Search Bar & Type Filter */}
      <div className="fade-up" style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", animationDelay: "100ms" }}>
        <input
          type="text"
          placeholder="Search items..."
          className="input-field"
          style={{ flex: 1, minWidth: 250 }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="input-field"
          style={{ width: "auto", appearance: "auto", background: "white" }}
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          {ITEM_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      {/* Filter bar (Lost/Found/All) */}
      <div className="fade-up" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28, animationDelay: "120ms", flexWrap: "wrap" }}>
        <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500, marginRight: 4 }}>
          Status:
        </span>
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`filter-pill ${filter === f ? `active-${f.toLowerCase()}` : ""}`}
          >
            {f}
          </button>
        ))}

        {!loading && (
          <span style={{ marginLeft: "auto", fontSize: 13, color: "var(--text-muted)" }}>
            {filtered.length} item{filtered.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div style={{ background: "#FDECEA", border: "1px solid #F5C6C2", borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 24 }}>
          <span style={{ fontSize: 18 }}>⚠️</span>
          <div>
            <div style={{ fontWeight: 600, color: "var(--accent-lost)", fontSize: 14, marginBottom: 4 }}>Connection Error</div>
            <div style={{ fontSize: 13.5, color: "#7B2D26" }}>{error}</div>
            <button onClick={fetchItems} style={{ marginTop: 10, fontSize: 13, fontWeight: 600, color: "var(--accent-lost)", background: "none", border: "1.5px solid var(--accent-lost)", borderRadius: 7, padding: "5px 14px", cursor: "pointer" }}>
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 22 }}>
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : filtered.map((item, i) => (
            <ItemCard
              key={item.id ?? i}
              item={item}
              index={i}

              /* THIS IS THE CRUCIAL LINE RIGHT HERE */
              refreshItems={fetchItems}
            /* ----------------------------------- */
            />
          ))}
      </div>

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <div className="fade-up" style={{ textAlign: "center", padding: "80px 24px" }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>🔍</div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "var(--text-primary)", marginBottom: 8 }}>
            No items found
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            Try adjusting your search or filters to find what you're looking for.
          </p>
        </div>
      )}
    </main>
  );
}