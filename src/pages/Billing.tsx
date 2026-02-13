import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Billing = () => {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "hsl(var(--background))", color: "hsl(var(--foreground))" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>💰 बिलिंग</h1>
      <p style={{ fontSize: 16, opacity: 0.7, marginBottom: 24 }}>हे पेज लवकरच उपलब्ध होईल — Coming Soon</p>
      <button onClick={() => navigate("/dashboard")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--muted))", cursor: "pointer", color: "hsl(var(--foreground))" }}>
        <ArrowLeft size={16} /> मुख्यपृष्ठ
      </button>
    </div>
  );
};

export default Billing;
