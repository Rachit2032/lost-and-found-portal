import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AddItem from "./pages/AddItem";
import Auth from "./pages/Auth";
import EditItem from "./pages/EditItem";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
        <Navbar />
        <Routes>
          <Route path="/edit/:id" element={<EditItem />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddItem />} />
        </Routes>
      </div>
    </Router>
  );
}
