import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <nav style={{ /* ... your existing nav styles ... */ }}>
      <div style={{ /* ... your existing div styles ... */ }}>
        {/* Logo remains the same */}

        {/* Nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Link to="/" style={{ /* ... your existing browse link styles ... */ }}>
            Browse Items
          </Link>
          
          {user ? (
            <>
              <Link to="/add" style={{ textDecoration: "none" }}>
                <button className="btn-primary" style={{ padding: "8px 18px", borderRadius: 9, fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> Post Item
                </button>
              </Link>
              <button onClick={handleLogout} style={{ background: "transparent", border: "1px solid var(--border)", padding: "8px 14px", borderRadius: 9, cursor: "pointer", fontWeight: 600 }}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/auth" style={{ textDecoration: "none" }}>
              <button style={{ background: "var(--text-primary)", color: "white", border: "none", padding: "8px 18px", borderRadius: 9, cursor: "pointer", fontWeight: 600 }}>
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}