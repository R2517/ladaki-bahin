import { useNavigate, useLocation } from "react-router-dom";
import {
  CreditCard, UserCheck, HardHat, Landmark,
  Sun, Moon, Palette, X, LayoutGrid, Search, Radio,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { COLOR_THEMES } from "@/lib/themes";

interface ServiceCard {
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

const services: ServiceCard[] = [
  {
    id: "pan-card",
    title: "पॅन कार्ड (PAN Card)",
    icon: CreditCard,
    iconBg: "linear-gradient(135deg, #E0E7FF, #C7D2FE)",
    iconColor: "#4338CA",
    path: "/pan-card",
    ready: true,
    badge: "READY",
    badgeType: "ready",
  },
  {
    id: "voter-id",
    title: "मतदार ओळखपत्र (Voter ID)",
    icon: UserCheck,
    iconBg: "linear-gradient(135deg, #DBEAFE, #93C5FD)",
    iconColor: "#1D4ED8",
    path: "/voter-id",
    ready: true,
    badge: "READY",
    badgeType: "ready",
  },
  {
    id: "bandkam-kamgar",
    title: "बांधकाम कामगार (Bandkam Kamgar)",
    icon: HardHat,
    iconBg: "linear-gradient(135deg, #FEF3C7, #FDE68A)",
    iconColor: "#D97706",
    path: "/bandkam-kamgar",
    ready: true,
    badge: "READY",
    badgeType: "ready",
  },
];

const badgeStyles: Record<string, string> = {
  ready: "badge-ready",
  new: "badge-new",
  hot: "badge-hot",
  fast: "badge-fast",
};

const Management = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem("theme") === "dark";
    return false;
  });
  const [themeIdx, setThemeIdx] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("colorTheme");
      return saved ? parseInt(saved, 10) : 0;
    }
    return 0;
  });
  const [showPalette, setShowPalette] = useState(false);
  const paletteRef = useRef<HTMLDivElement>(null);

  const currentTheme = COLOR_THEMES[themeIdx] || COLOR_THEMES[0];

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--primary", currentTheme.primary);
    root.style.setProperty("--ring", currentTheme.primary);
    if (dark) {
      root.style.setProperty("--primary", currentTheme.darkPrimary);
      root.style.setProperty("--ring", currentTheme.darkPrimary);
    }
    localStorage.setItem("colorTheme", String(themeIdx));
  }, [themeIdx, dark, currentTheme]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (paletteRef.current && !paletteRef.current.contains(e.target as Node)) {
        setShowPalette(false);
      }
    };
    if (showPalette) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showPalette]);

  const filtered = services.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dash-root">
      {/* ===== Top Nav ===== */}
      <nav className="dash-nav" style={{ background: currentTheme.nav }}>
        <div className="dash-nav-inner">
          <div className="dash-brand">
            <div className="dash-brand-icon">
              <Landmark size={22} color="#fff" />
            </div>
            <div>
              <span className="dash-brand-title">SETU Suvidha</span>
              <span className="dash-brand-sub">सेतु सुविधा — महा ई-सेवा फॉर्म पोर्टल</span>
            </div>
            <div style={{ position: "relative", marginLeft: 8 }} ref={paletteRef}>
              <button
                className="theme-toggle"
                onClick={() => setShowPalette(!showPalette)}
                aria-label="Change color theme"
                title="Color Theme"
              >
                <Palette size={18} />
              </button>
              {showPalette && (
                <div className="color-palette-popup">
                  <div className="color-palette-header">
                    <span style={{ fontWeight: 700, fontSize: 13 }}>🎨 Theme निवडा</span>
                    <button className="color-palette-close" onClick={() => setShowPalette(false)}>
                      <X size={14} />
                    </button>
                  </div>
                  <div className="color-palette-grid">
                    {COLOR_THEMES.map((t, i) => (
                      <button
                        key={t.name}
                        className={`color-dot${i === themeIdx ? " active" : ""}`}
                        style={{ background: t.nav }}
                        onClick={() => { setThemeIdx(i); setShowPalette(false); }}
                        title={t.name}
                      >
                        {i === themeIdx && <span className="color-dot-check">✓</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <button
            className="theme-toggle"
            onClick={() => setDark(!dark)}
            aria-label="Toggle dark mode"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
        {/* === Nav Tabs === */}
        <div className="dash-nav-tabs">
          <button className="dash-nav-tab" onClick={() => navigate("/")}>🏠 सेतू सुविधा</button>
          <button className="dash-nav-tab" onClick={() => navigate("/billing")}>💰 बिलिंग</button>
          <button className="dash-nav-tab active" onClick={() => navigate("/management")}>⚙️ Management</button>
        </div>
      </nav>

      {/* ===== Banner ===== */}
      <div className="dash-banner-wrap">
        <div className="dash-banner" style={{ background: currentTheme.nav }}>
          <div className="banner-text">
            <h2 className="dash-welcome-title">⚙️ Management</h2>
            <p className="dash-welcome-sub">
              व्यवस्थापन सेवा — PAN Card, Voter ID आणि इतर सेवांचे CRM व्यवस्थापन करा.
            </p>
          </div>
          <div className="banner-stats">
            <div className="stat-chip">
              <span className="stat-num">{services.length}</span>
              <span className="stat-label">सेवा उपलब्ध</span>
            </div>
            <div className="stat-chip">
              <span className="stat-num">{services.filter((s) => s.ready).length}</span>
              <span className="stat-label">तयार आहे</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Ticker ===== */}
      <div className="ticker-wrap">
        <div className="ticker-bar">
          <span className="ticker-live-badge">
            <Radio size={12} /> LIVE
          </span>
          <span className="ticker-label">📢 नवीन:</span>
          <div className="ticker-scroll">
            <div className="ticker-content">
              <span className="ticker-item">⭐ PAN Card CRM आता उपलब्ध!</span>
              <span className="ticker-sep">•</span>
              <span className="ticker-item">📋 Voter ID Card CRM आता उपलब्ध!</span>
              <span className="ticker-sep">•</span>
              <span className="ticker-item">🔧 बांधकाम कामगार सेवा लवकरच येत आहे</span>
              <span className="ticker-sep">•</span>
              <span className="ticker-item">💼 सर्व entries inline edit करता येतात</span>
              <span className="ticker-sep">•</span>
              <span className="ticker-item">⭐ PAN Card CRM आता उपलब्ध!</span>
              <span className="ticker-sep">•</span>
              <span className="ticker-item">📋 Voter ID Card CRM आता उपलब्ध!</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Services Section ===== */}
      <div className="dash-content">
        <div className="dash-section-header">
          <div className="dash-section-title-row">
            <LayoutGrid size={18} />
            <h3 className="dash-section-title">व्यवस्थापन सेवा</h3>
          </div>
          <div className="dash-search-box">
            <Search size={16} className="dash-search-icon" />
            <input
              type="text"
              placeholder="सेवा शोधा..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="dash-search-input"
            />
          </div>
        </div>

        <div className="dash-cards-grid">
          {filtered.map((s, i) => (
            <button
              key={s.id}
              className="dash-card"
              style={{ animationDelay: `${i * 0.04}s` }}
              onClick={() => {
                if (s.ready) {
                  navigate(s.path);
                } else {
                  alert("हा विभाग लवकरच उपलब्ध होईल — Coming Soon");
                }
              }}
            >
              {s.badge && (
                <span className={`dash-card-badge ${badgeStyles[s.badgeType || "new"]}`}>
                  {s.badge}
                </span>
              )}
              <div className="dash-card-icon" style={{ background: s.iconBg }}>
                <s.icon size={26} color={s.iconColor} strokeWidth={1.8} />
              </div>
              <span className="dash-card-label">{s.title}</span>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="dash-no-results">कोणतीही सेवा सापडली नाही.</p>
        )}
      </div>

      {/* ===== Footer ===== */}
      <footer className="dash-footer">
        © 2026 SETU Suvidha — सेतु सुविधा महा ई-सेवा पोर्टल
      </footer>
    </div>
  );
};

export default Management;
