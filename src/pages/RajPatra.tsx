import { useNavigate } from "react-router-dom";
import {
  Landmark, Sun, Moon, Palette, X, LayoutGrid, Search, Radio,
  FileText, Globe, MapPin,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { COLOR_THEMES } from "@/lib/themes";

interface ServiceCard {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  path: string;
  ready: boolean;
  badge?: string;
  badgeType?: "ready" | "new" | "hot" | "fast";
  description: string;
}

const services: ServiceCard[] = [
  {
    id: "rajpatra-marathi",
    title: "राजपत्र मराठी",
    subtitle: "Rajpatra Marathi",
    icon: FileText,
    iconBg: "linear-gradient(135deg, #FEF3C7, #FDE68A)",
    iconColor: "#B45309",
    path: "/rajpatra-marathi",
    ready: true,
    badge: "READY",
    badgeType: "ready",
    description: "मराठी भाषेतील राजपत्र नोटीस तयार करा व प्रिंट करा",
  },
  {
    id: "rajpatra-english",
    title: "राजपत्र इंग्रजी",
    subtitle: "Rajpatra English",
    icon: Globe,
    iconBg: "linear-gradient(135deg, #DBEAFE, #93C5FD)",
    iconColor: "#1D4ED8",
    path: "/rajpatra-english",
    ready: true,
    badge: "READY",
    badgeType: "ready",
    description: "English Gazette Notice — create and print official gazette notifications",
  },
  {
    id: "rajpatra-affidavit-712",
    title: "राजपत्र ७/१२ शपथपत्र",
    subtitle: "Affidavit of 7/12",
    icon: MapPin,
    iconBg: "linear-gradient(135deg, #D1FAE5, #A7F3D0)",
    iconColor: "#059669",
    path: "/rajpatra-affidavit-712",
    ready: true,
    badge: "READY",
    badgeType: "ready",
    description: "७/१२ उतारा बदलासाठी राजपत्र शपथपत्र (Affidavit) तयार करा",
  },
];

const badgeStyles: Record<string, string> = {
  ready: "badge-ready",
  new: "badge-new",
  hot: "badge-hot",
  fast: "badge-fast",
};

const RajPatra = () => {
  const navigate = useNavigate();
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
    const p = dark ? currentTheme.darkPrimary : currentTheme.primary;
    root.style.setProperty("--primary", p);
    root.style.setProperty("--ring", p);
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
    (s.title + s.subtitle).toLowerCase().includes(search.toLowerCase())
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
          <button className="dash-nav-tab" onClick={() => navigate("/dashboard")}>🏠 सेतू सुविधा</button>
          <button className="dash-nav-tab" onClick={() => navigate("/billing")}>💰 बिलिंग</button>
          <button className="dash-nav-tab" onClick={() => navigate("/management")}>⚙️ Management</button>
        </div>
      </nav>

      {/* ===== Banner ===== */}
      <div className="dash-banner-wrap">
        <div className="dash-banner" style={{ background: currentTheme.nav }}>
          <div className="banner-text">
            <h2 className="dash-welcome-title">📜 राजपत्र सेवा</h2>
            <p className="dash-welcome-sub">
              राजपत्र (Gazette) नोटीस — मराठी, इंग्रजी आणि ७/१२ शपथपत्र तयार करा.
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
              <span className="ticker-item">⭐ राजपत्र मराठी नोटीस फॉर्म आता उपलब्ध!</span>
              <span className="ticker-sep">•</span>
              <span className="ticker-item">📋 राजपत्र इंग्रजी नोटीस फॉर्म आता उपलब्ध!</span>
              <span className="ticker-sep">•</span>
              <span className="ticker-item">📝 ७/१२ शपथपत्र (Affidavit) फॉर्म आता उपलब्ध!</span>
              <span className="ticker-sep">•</span>
              <span className="ticker-item">🖨️ Save & Print एका क्लिकवर</span>
              <span className="ticker-sep">•</span>
              <span className="ticker-item">⭐ राजपत्र मराठी नोटीस फॉर्म आता उपलब्ध!</span>
              <span className="ticker-sep">•</span>
              <span className="ticker-item">📋 राजपत्र इंग्रजी नोटीस फॉर्म आता उपलब्ध!</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Services Section ===== */}
      <div className="dash-content">
        <div className="dash-section-header">
          <div className="dash-section-title-row">
            <LayoutGrid size={18} />
            <h3 className="dash-section-title">राजपत्र सेवा</h3>
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

        <div className="dash-cards-grid rajpatra-cards-grid">
          {filtered.map((s, i) => (
            <button
              key={s.id}
              className="dash-card rajpatra-card"
              style={{ animationDelay: `${i * 0.06}s` }}
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
              <div className="dash-card-icon rajpatra-card-icon" style={{ background: s.iconBg }}>
                <s.icon size={32} color={s.iconColor} strokeWidth={1.6} />
              </div>
              <span className="dash-card-label" style={{ fontSize: 15, fontWeight: 700 }}>{s.title}</span>
              <span className="rajpatra-card-subtitle">{s.subtitle}</span>
              <span className="rajpatra-card-desc">{s.description}</span>
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

export default RajPatra;
