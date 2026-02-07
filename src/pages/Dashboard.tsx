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

const COLOR_THEMES = [
  { name: "Teal", nav: "linear-gradient(135deg,#0f766e,#0d9488,#14b8a6)", primary: "175 70% 38%", darkPrimary: "175 65% 50%", dot: "#0d9488" },
  { name: "Blue", nav: "linear-gradient(135deg,#1e3a8a,#2563eb,#3b82f6)", primary: "224 76% 48%", darkPrimary: "217 91% 60%", dot: "#2563eb" },
  { name: "Indigo", nav: "linear-gradient(135deg,#312e81,#4338ca,#6366f1)", primary: "239 84% 67%", darkPrimary: "239 84% 67%", dot: "#4338ca" },
  { name: "Purple", nav: "linear-gradient(135deg,#581c87,#7c3aed,#a78bfa)", primary: "263 70% 50%", darkPrimary: "263 70% 58%", dot: "#7c3aed" },
  { name: "Violet", nav: "linear-gradient(135deg,#4c1d95,#6d28d9,#8b5cf6)", primary: "258 90% 66%", darkPrimary: "258 90% 66%", dot: "#6d28d9" },
  { name: "Fuchsia", nav: "linear-gradient(135deg,#86198f,#c026d3,#d946ef)", primary: "293 69% 49%", darkPrimary: "293 69% 58%", dot: "#c026d3" },
  { name: "Pink", nav: "linear-gradient(135deg,#9d174d,#db2777,#ec4899)", primary: "330 81% 60%", darkPrimary: "330 81% 60%", dot: "#db2777" },
  { name: "Rose", nav: "linear-gradient(135deg,#9f1239,#e11d48,#fb7185)", primary: "347 77% 50%", darkPrimary: "347 77% 60%", dot: "#e11d48" },
  { name: "Red", nav: "linear-gradient(135deg,#991b1b,#dc2626,#ef4444)", primary: "0 72% 51%", darkPrimary: "0 72% 58%", dot: "#dc2626" },
  { name: "Orange", nav: "linear-gradient(135deg,#9a3412,#ea580c,#f97316)", primary: "25 95% 53%", darkPrimary: "25 95% 58%", dot: "#ea580c" },
  { name: "Amber", nav: "linear-gradient(135deg,#92400e,#d97706,#f59e0b)", primary: "38 92% 50%", darkPrimary: "38 92% 58%", dot: "#d97706" },
  { name: "Yellow", nav: "linear-gradient(135deg,#854d0e,#ca8a04,#eab308)", primary: "48 96% 53%", darkPrimary: "48 96% 58%", dot: "#ca8a04" },
  { name: "Lime", nav: "linear-gradient(135deg,#3f6212,#65a30d,#84cc16)", primary: "84 81% 44%", darkPrimary: "84 81% 52%", dot: "#65a30d" },
  { name: "Green", nav: "linear-gradient(135deg,#166534,#16a34a,#22c55e)", primary: "142 71% 45%", darkPrimary: "142 71% 52%", dot: "#16a34a" },
  { name: "Emerald", nav: "linear-gradient(135deg,#065f46,#059669,#10b981)", primary: "160 84% 39%", darkPrimary: "160 84% 48%", dot: "#059669" },
  { name: "Cyan", nav: "linear-gradient(135deg,#155e75,#0891b2,#06b6d4)", primary: "189 94% 43%", darkPrimary: "189 94% 50%", dot: "#0891b2" },
  { name: "Sky", nav: "linear-gradient(135deg,#075985,#0284c7,#0ea5e9)", primary: "199 89% 48%", darkPrimary: "199 89% 55%", dot: "#0284c7" },
  { name: "Slate", nav: "linear-gradient(135deg,#1e293b,#475569,#64748b)", primary: "215 16% 47%", darkPrimary: "215 20% 55%", dot: "#475569" },
  { name: "Zinc", nav: "linear-gradient(135deg,#27272a,#52525b,#71717a)", primary: "240 4% 46%", darkPrimary: "240 5% 52%", dot: "#52525b" },
  { name: "Stone", nav: "linear-gradient(135deg,#44403c,#78716c,#a8a29e)", primary: "25 5% 45%", darkPrimary: "25 6% 52%", dot: "#78716c" },
  { name: "Maroon", nav: "linear-gradient(135deg,#7f1d1d,#b91c1c,#dc2626)", primary: "0 74% 42%", darkPrimary: "0 74% 50%", dot: "#b91c1c" },
  { name: "Navy", nav: "linear-gradient(135deg,#172554,#1e3a8a,#1e40af)", primary: "224 76% 38%", darkPrimary: "224 76% 48%", dot: "#1e3a8a" },
  { name: "Forest", nav: "linear-gradient(135deg,#14532d,#15803d,#16a34a)", primary: "142 76% 36%", darkPrimary: "142 76% 44%", dot: "#15803d" },
  { name: "Coffee", nav: "linear-gradient(135deg,#78350f,#a16207,#ca8a04)", primary: "38 88% 40%", darkPrimary: "38 88% 48%", dot: "#a16207" },
];

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
    ready: false,
  },
  {
    id: "grievance",
    title: "तक्रार नोंदणी (Grievance)",
    icon: AlertTriangle,
    iconBg: "linear-gradient(135deg, #FEF3C7, #FDE68A)",
    iconColor: "#D97706",
    path: "/grievance",
    ready: false,
    badge: "NEW",
    badgeType: "new",
  },
  {
    id: "new-application",
    title: "नवीन अर्ज (New Application)",
    icon: FilePlus,
    iconBg: "linear-gradient(135deg, #EDE9FE, #DDD6FE)",
    iconColor: "#7C3AED",
    path: "/new-application",
    ready: false,
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
    ready: false,
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
    title: "जात पडताळणीसाठी शपथपत्र",
    icon: BadgeCheck,
    iconBg: "linear-gradient(135deg, #CCFBF1, #99F6E4)",
    iconColor: "#0D9488",
    path: "/caste-validity",
    ready: false,
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
