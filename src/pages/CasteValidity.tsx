import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Landmark, Sun, Moon, BadgeCheck, FileText, FileSpreadsheet } from "lucide-react";
import { getThemeGradient } from "@/lib/themes";

interface SubCard {
  id: string;
  title: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  path: string;
  ready: boolean;
  badge?: string;
  badgeType?: "ready" | "new" | "hot" | "fast";
}

const subCards: SubCard[] = [
  {
    id: "namuna-03",
    title: "नमुना 03",
    icon: FileText,
    iconBg: "linear-gradient(135deg, #CCFBF1, #99F6E4)",
    iconColor: "#0D9488",
    path: "/caste-validity/namuna-03",
    ready: false,
    badge: "NEW",
    badgeType: "new",
  },
  {
    id: "namuna-17",
    title: "नमुना 17",
    icon: FileSpreadsheet,
    iconBg: "linear-gradient(135deg, #E0E7FF, #C7D2FE)",
    iconColor: "#4338CA",
    path: "/caste-validity/namuna-17",
    ready: false,
    badge: "NEW",
    badgeType: "new",
  },
];

const badgeStyles: Record<string, string> = {
  ready: "badge-ready",
  new: "badge-new",
  hot: "badge-hot",
  fast: "badge-fast",
};

const CasteValidity = () => {
  const navigate = useNavigate();
  const themeGradient = getThemeGradient();
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <div className="dash-root">
      {/* ===== Top Nav ===== */}
      <nav className="dash-nav no-print" style={{ background: themeGradient }}>
        <div className="dash-nav-inner">
          <div className="dash-brand" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
            <div className="dash-brand-icon">
              <Landmark size={22} color="#fff" />
            </div>
            <div>
              <span className="dash-brand-title">SETU Suvidha</span>
              <span className="dash-brand-sub">सेतु सुविधा — महा ई-सेवा फॉर्म पोर्टल</span>
            </div>
          </div>
          <button className="theme-toggle" onClick={() => setDark(!dark)} aria-label="Toggle dark mode">
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </nav>

      {/* ===== Back Button ===== */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "18px 16px 0" }}>
        <button className="back-btn no-print" onClick={() => navigate("/")}>
          <ArrowLeft size={18} />
          <span>मुख्यपृष्ठ</span>
        </button>
      </div>

      {/* ===== Banner ===== */}
      <div className="dash-banner-wrap">
        <div className="dash-banner" style={{ background: themeGradient }}>
          <div className="banner-text">
            <h2 className="dash-welcome-title">
              <BadgeCheck size={28} style={{ marginRight: 8, verticalAlign: "middle" }} />
              जात पडताळणी
            </h2>
            <p className="dash-welcome-sub">
              जात पडताळणीसाठी आवश्यक नमुने खाली निवडा.
            </p>
          </div>
          <div className="banner-stats">
            <div className="stat-chip">
              <span className="stat-num">{subCards.length}</span>
              <span className="stat-label">नमुने उपलब्ध</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Cards ===== */}
      <div className="dash-content">
        <div className="dash-cards-grid" style={{ maxWidth: 600, margin: "0 auto" }}>
          {subCards.map((card, i) => (
            <button
              key={card.id}
              className="dash-card"
              style={{ animationDelay: `${i * 0.04}s` }}
              onClick={() => {
                if (card.ready) {
                  navigate(card.path);
                } else {
                  alert("हा नमुना लवकरच उपलब्ध होईल.");
                }
              }}
            >
              {card.badge && (
                <span className={`dash-card-badge ${badgeStyles[card.badgeType || "new"]}`}>
                  {card.badge}
                </span>
              )}
              <div className="dash-card-icon" style={{ background: card.iconBg }}>
                <card.icon size={26} color={card.iconColor} strokeWidth={1.8} />
              </div>
              <span className="dash-card-label">{card.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ===== Footer ===== */}
      <footer className="dash-footer">
        © 2026 SETU Suvidha — सेतु सुविधा महा ई-सेवा पोर्टल
      </footer>
    </div>
  );
};

export default CasteValidity;
