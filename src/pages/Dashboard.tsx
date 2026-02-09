import { useNavigate } from "react-router-dom";
import {
  FileText, Shield, AlertTriangle, FilePlus,
  Landmark, Users, BookOpen, FileCheck,
  Search, LayoutGrid, Radio, Home,
  CreditCard, Fingerprint, FileSpreadsheet,
  Scale, Leaf, Award, GraduationCap, BadgeCheck,
  Sun, Moon, Palette, X,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { COLOR_THEMES } from "@/lib/themes";

interface FormCard {
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

const forms: FormCard[] = [
  {
    id: "hamipatra",
    title: "हमीपत्र (Disclaimer)",
    icon: FileText,
    iconBg: "linear-gradient(135deg, #DBEAFE, #BFDBFE)",
    iconColor: "#2563EB",
    path: "/hamipatra",
    ready: true,
    badge: "READY",
    badgeType: "ready",
  },
  {
    id: "self-declaration",
    title: "स्वयंघोषणापत्र",
    icon: Shield,
    iconBg: "linear-gradient(135deg, #D1FAE5, #A7F3D0)",
    iconColor: "#059669",
    path: "/self-declaration",
    ready: true,
    badge: "READY",
    badgeType: "ready",
  },
  {
    id: "grievance",
    title: "तक्रार नोंदणी (Grievance)",
    icon: AlertTriangle,
    iconBg: "linear-gradient(135deg, #FEF3C7, #FDE68A)",
    iconColor: "#D97706",
    path: "/grievance",
    ready: true,
    badge: "READY",
    badgeType: "ready",
  },
  {
    id: "new-application",
    title: "नवीन अर्ज (New Application)",
    icon: FilePlus,
    iconBg: "linear-gradient(135deg, #EDE9FE, #DDD6FE)",
    iconColor: "#7C3AED",
    path: "/new-application",
    ready: true,
    badge: "READY",
    badgeType: "ready",
  },
  {
    id: "farmer-id",
    title: "शेतकरी दाखला (FARMER ID CARD)",
    icon: Home,
    iconBg: "linear-gradient(135deg, #CFFAFE, #A5F3FC)",
    iconColor: "#0891B2",
    path: "/farmer-id",
    ready: false,
    badge: "HIGH DEMAND",
    badgeType: "hot",
  },
  {
    id: "aadhaar-hub",
    title: "आधार सेवा केंद्र (Hub)",
    icon: Fingerprint,
    iconBg: "linear-gradient(135deg, #FFE4E6, #FECDD3)",
    iconColor: "#E11D48",
    path: "/aadhaar-hub",
    ready: false,
    badge: "NEW",
    badgeType: "new",
  },
  {
    id: "pan-card",
    title: "पॅन कार्ड सेवा (PAN Card)",
    icon: CreditCard,
    iconBg: "linear-gradient(135deg, #E0E7FF, #C7D2FE)",
    iconColor: "#4338CA",
    path: "/pan-card",
    ready: false,
    badge: "FAST",
    badgeType: "fast",
  },
  {
    id: "bond-format",
    title: "बांधकाम कामगार 90 दिवस प्रमाणपत्र",
    icon: FileSpreadsheet,
    iconBg: "linear-gradient(135deg, #FFF7ED, #FED7AA)",
    iconColor: "#EA580C",
    path: "/bond-format",
    ready: false,
    badge: "NEW",
    badgeType: "new",
  },
  {
    id: "income-cert",
    title: "उत्पन्नाचे स्वयंघोषणापत्र",
    icon: Landmark,
    iconBg: "linear-gradient(135deg, #FCE7F3, #FBCFE8)",
    iconColor: "#DB2777",
    path: "/income-cert",
    ready: true,
    badge: "READY",
    badgeType: "ready",
  },
  {
    id: "revenue-notice",
    title: "राजपत्र नमुना नोटीस",
    icon: Scale,
    iconBg: "linear-gradient(135deg, #ECFDF5, #BBF7D0)",
    iconColor: "#16A34A",
    path: "/revenue-notice",
    ready: false,
  },
  {
    id: "caste-cert",
    title: "जात प्रमाणपत्रासाठीचे शपथपत्र",
    icon: Users,
    iconBg: "linear-gradient(135deg, #FDF4FF, #F5D0FE)",
    iconColor: "#A855F7",
    path: "/caste-cert",
    ready: false,
  },
  {
    id: "ews",
    title: "EWS प्रमाणपत्रासाठीचा अर्ज",
    icon: BookOpen,
    iconBg: "linear-gradient(135deg, #F0FDF4, #BBF7D0)",
    iconColor: "#15803D",
    path: "/ews",
    ready: false,
  },
  {
    id: "landless",
    title: "भूमिहीन प्रमाणपत्रासाठी अर्ज",
    icon: Leaf,
    iconBg: "linear-gradient(135deg, #ECFCCB, #BEF264)",
    iconColor: "#4D7C0F",
    path: "/landless",
    ready: false,
  },
  {
    id: "annasaheb",
    title: "अण्णासाहेब पाटील योजनेचा अर्ज",
    icon: Award,
    iconBg: "linear-gradient(135deg, #FFE4E6, #FDA4AF)",
    iconColor: "#BE123C",
    path: "/annasaheb",
    ready: false,
  },
  {
    id: "minority",
    title: "अल्पभूधारक प्रमाणपत्रासाठी अर्ज",
    icon: FileCheck,
    iconBg: "linear-gradient(135deg, #F3E8FF, #E9D5FF)",
    iconColor: "#9333EA",
    path: "/minority",
    ready: false,
  },
  {
    id: "non-creamy",
    title: "नॉन क्रिमिलीयर प्रमाणपत्रासाठी शपथपत्र",
    icon: GraduationCap,
    iconBg: "linear-gradient(135deg, #FEF9C3, #FDE047)",
    iconColor: "#A16207",
    path: "/non-creamy",
    ready: false,
  },
  {
    id: "caste-validity",
    title: "जात पडताळणी",
    icon: BadgeCheck,
    iconBg: "linear-gradient(135deg, #CCFBF1, #99F6E4)",
    iconColor: "#0D9488",
    path: "/caste-validity",
    ready: true,
    badge: "READY",
    badgeType: "ready",
  },
  {
    id: "domicile",
    title: "अधिवास प्रमाणपत्रासाठी स्वयंघोषणापत्र",
    icon: Home,
    iconBg: "linear-gradient(135deg, #DBEAFE, #93C5FD)",
    iconColor: "#1D4ED8",
    path: "/domicile",
    ready: false,
  },
];

const badgeStyles: Record<string, string> = {
  ready: "badge-ready",
  new: "badge-new",
  hot: "badge-hot",
  fast: "badge-fast",
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark";
    }
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

  // Close palette on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (paletteRef.current && !paletteRef.current.contains(e.target as Node)) {
        setShowPalette(false);
      }
    };
    if (showPalette) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showPalette]);

  const filtered = forms.filter((f) =>
    f.title.toLowerCase().includes(search.toLowerCase())
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
            {/* Color Theme Picker */}
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
          <button className="dash-nav-tab active" onClick={() => navigate("/")}>🏠 सेतू सुविधा</button>
          <button className="dash-nav-tab" onClick={() => navigate("/billing")}>💰 बिलिंग</button>
          <button className="dash-nav-tab" onClick={() => navigate("/management")}>⚙️ Management</button>
        </div>
      </nav>

      <div className="dash-banner-wrap">
        <div className="dash-banner" style={{ background: currentTheme.nav }}>
          <div className="banner-text">
            <h2 className="dash-welcome-title">🙏 नमस्कार!</h2>
            <p className="dash-welcome-sub">
              SETU Suvidha पोर्टलवर तुमचे स्वागत आहे. खालील सेवा निवडा आणि फॉर्म भरा.
            </p>
          </div>
          <div className="banner-stats">
            <div className="stat-chip">
              <span className="stat-num">{forms.length}</span>
              <span className="stat-label">सेवा उपलब्ध</span>
            </div>
            <div className="stat-chip">
              <span className="stat-num">{forms.filter(f => f.ready).length}</span>
              <span className="stat-label">तयार आहे</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Live News Ticker ===== */}
      <div className="ticker-wrap">
        <div className="ticker-bar">
          <span className="ticker-live-badge">
            <Radio size={12} /> LIVE
          </span>
          <span className="ticker-label">📢 नवीन:</span>
          <div className="ticker-scroll">
            <div className="ticker-content">
              <span className="ticker-item">⭐ लाडकी बहिण योजना हमीपत्र फॉर्म आता उपलब्ध!</span>
              <span className="ticker-sep">•</span>
              <span className="ticker-item">📋 स्वयंघोषणा पत्र, तक्रार नोंदणी फॉर्म लवकरच येत आहे</span>
              <span className="ticker-sep">•</span>
              <span className="ticker-item">💾 Google Sheet मध्ये data auto-save</span>
              <span className="ticker-sep">•</span>
              <span className="ticker-item">🖨️ Save & Print एका क्लिकवर</span>
              <span className="ticker-sep">•</span>
              <span className="ticker-item">⭐ लाडकी बहिण योजना हमीपत्र फॉर्म आता उपलब्ध!</span>
              <span className="ticker-sep">•</span>
              <span className="ticker-item">📋 स्वयंघोषणा पत्र, तक्रार नोंदणी फॉर्म लवकरच येत आहे</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Services Section ===== */}
      <div className="dash-content">
        <div className="dash-section-header">
          <div className="dash-section-title-row">
            <LayoutGrid size={18} />
            <h3 className="dash-section-title">उपलब्ध सेवा</h3>
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
          {filtered.map((form, i) => (
            <button
              key={form.id}
              className="dash-card"
              style={{ animationDelay: `${i * 0.04}s` }}
              onClick={() => {
                if (form.ready) {
                  navigate(form.path);
                } else {
                  alert("हा फॉर्म लवकरच उपलब्ध होईल.");
                }
              }}
            >
              {form.badge && (
                <span className={`dash-card-badge ${badgeStyles[form.badgeType || "new"]}`}>
                  {form.badge}
                </span>
              )}
              <div
                className="dash-card-icon"
                style={{ background: form.iconBg }}
              >
                <form.icon size={26} color={form.iconColor} strokeWidth={1.8} />
              </div>
              <span className="dash-card-label">{form.title}</span>
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

export default Dashboard;
