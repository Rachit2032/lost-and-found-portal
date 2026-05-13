import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const res = await axios.post("http://localhost:5000/api/login", form);
        login(res.data.access_token, res.data.user);
        navigate("/");
      } else {
        await axios.post("http://localhost:5000/api/register", form);
        setIsLogin(true); // Switch to login after successful register
        setError("Registration successful! Please login.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <main style={{ maxWidth: 400, margin: "80px auto", padding: "0 24px" }}>
      <form onSubmit={handleSubmit} className="fade-up" style={{ background: "white", padding: 30, borderRadius: 16, border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
        <h2 style={{ marginBottom: 20, fontFamily: "'Playfair Display', serif" }}>{isLogin ? "Welcome Back" : "Create Account"}</h2>
        {error && <p style={{ color: "var(--accent-lost)", fontSize: 14, marginBottom: 15 }}>{error}</p>}
        
        <label style={{ display: "block", marginBottom: 15 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Username</span>
          <input className="input-field" type="text" required onChange={e => setForm({...form, username: e.target.value})} />
        </label>
        
        <label style={{ display: "block", marginBottom: 25 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Password</span>
          <input className="input-field" type="password" required onChange={e => setForm({...form, password: e.target.value})} />
        </label>
        
        <button type="submit" className="btn-primary" style={{ width: "100%", padding: "12px", borderRadius: 8 }}>
          {isLogin ? "Login" : "Sign Up"}
        </button>
        
        <p style={{ marginTop: 15, fontSize: 14, textAlign: "center", cursor: "pointer", color: "var(--accent-amber)" }} onClick={() => { setIsLogin(!isLogin); setError(""); }}>
          {isLogin ? "Need an account? Sign up" : "Already have an account? Login"}
        </p>
      </form>
    </main>
  );
}