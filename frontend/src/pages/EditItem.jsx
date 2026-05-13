import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ITEM_CATEGORIES = ["Electronic Gadgets", "Stationery Items", "Clothing", "Accessories", "Documents", "Others"];

export default function EditItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "", description: "", category: "Lost", item_category: "Others", contact: ""
  });

  useEffect(() => {
    // Fetch the existing data to fill the form
    const fetchItem = async () => {
      try {
        const res = await axios.get(`https://lost-and-found-portal-et2c.onrender.com/api/items`);
        const itemToEdit = res.data.find(i => String(i.id) === String(id));
        if (itemToEdit) {
          setForm({
            title: itemToEdit.title,
            description: itemToEdit.description,
            category: itemToEdit.category,
            item_category: itemToEdit.item_category,
            contact: itemToEdit.contact
          });
        }
        setLoading(false);
      } catch (err) {
        alert("Error fetching item data");
        navigate("/");
      }
    };
    fetchItem();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const data = new FormData();
    Object.keys(form).forEach(key => data.append(key, form[key]));

    try {
      await axios.put(`https://lost-and-found-portal-et2c.onrender.com/api/items/${id}`, data, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      navigate("/");
    } catch (err) {
      alert("Failed to update item");
    }
  };

  if (loading) return <div style={{ textAlign: "center", padding: 50 }}>Loading data...</div>;

  return (
    <main style={{ maxWidth: 600, margin: "40px auto", padding: "0 24px" }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", marginBottom: 24 }}>Edit Post</h2>
      <form onSubmit={handleSubmit} style={{ background: "white", padding: 30, borderRadius: 16, border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 20 }}>
        
        <label>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Title</span>
          <input className="input-field" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
        </label>

        <label>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Description</span>
          <textarea className="input-field" rows={4} value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
        </label>

        <label>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Item Category</span>
          <select className="input-field" value={form.item_category} onChange={e => setForm({...form, item_category: e.target.value})} style={{ appearance: "auto" }}>
            {ITEM_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>

        <label>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Contact Info</span>
          <input className="input-field" value={form.contact} onChange={e => setForm({...form, contact: e.target.value})} required />
        </label>

        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          <button type="submit" className="btn-primary" style={{ flex: 1, padding: 12, borderRadius: 8 }}>Save Changes</button>
          <button type="button" onClick={() => navigate("/")} style={{ flex: 1, background: "transparent", border: "1px solid var(--border)", borderRadius: 8 }}>Cancel</button>
        </div>
      </form>
    </main>
  );
}