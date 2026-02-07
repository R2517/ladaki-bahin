import { useNavigate } from "react-router-dom";
import {
  FileText, Shield, AlertTriangle, FilePlus,
  Landmark, Users, BookOpen, FileCheck,
  Search, LayoutGrid, Radio,
} from "lucide-react";
import { useState } from "react";

interface FormCard {
  id: string;
  title: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  path: string;
  ready: boolean;
  badge?: string;
  badgeColor?: string;
}

const forms: FormCard[] = [
  {
    id: "hamipatra",
    title: "हमीपत्र (Disclaimer)",
    icon: FileText,
    iconBg: "#EBF5FF",
    iconColor: "#3B82F6",
    path: "/hamipatra",
    ready: true,
    badge: "READY",
    badgeColor: "#22C55E",
  },
  {
    id: "self-declaration",
    title: "स्वयंघोषणा पत्र",
    icon: Shield,
    iconBg: "#F0FDF4",
    iconColor: "#16A34A",
    path: "/self-declaration",
    ready: false,
  },
  {
    id: "grievance",
    title: "तक्रार नोंदणी (Grievance)",
    icon: AlertTriangle,
    iconBg: "#FFFBEB",
    iconColor: "#F59E0B",
    path: "/grievance",
    ready: false,
  },
  {
    id: "new-application",
    title: "नवीन अर्ज (New Application)",
    icon: FilePlus,
    iconBg: "#F5F3FF",
    iconColor: "#8B5CF6",
    path: "/new-application",
    ready: false,
  },
  {
    id: "income-cert",
    title: "उत्पन्नाचे स्वयंघोषणापत्र",
    icon: Landmark,
    iconBg: "#FFF1F2",
    iconColor: "#E11D48",
    path: "/income-cert",
    ready: false,
  },
  {
    id: "caste-cert",
    title: "जात प्रमाणपत्रासाठी शपथपत्र",
    icon: Users,
    iconBg: "#ECFDF5",
    iconColor: "#059669",
    path: "/caste-cert",
    ready: false,
  },
  {
    id: "domicile",
    title: "अधिवास प्रमाणपत्र",
    icon: BookOpen,
    iconBg: "#EFF6FF",
    iconColor: "#2563EB",
    path: "/domicile",
    ready: false,
  },
  {
    id: "ews",
    title: "EWS प्रमाणपत्रासाठीचा अर्ज",
    icon: FileCheck,
    iconBg: "#FDF4FF",
    iconColor: "#A855F7",
    path: "/ews",
    ready: false,
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = forms.filter((f) =>
    f.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dash-root">
      {/* ===== Top Nav ===== */}
      <nav className="dash-nav">
        <div className="dash-nav-inner">
          <div className="dash-brand">
            <div className="dash-brand-icon">
              <Landmark size={22} color="#fff" />
            </div>
            <div>
              <span className="dash-brand-title">महा ई-सेवा केंद्र</span>
              <span className="dash-brand-sub">लाडकी बहिण योजना — फॉर्म पोर्टल</span>
            </div>
          </div>
        </div>
      </nav>

      {/* ===== Welcome Banner ===== */}
      <div className="dash-banner-wrap">
        <div className="dash-banner">
          <div>
            <h2 className="dash-welcome-title">🙏 नमस्कार!</h2>
            <p className="dash-welcome-sub">
              महा ई-सेवा पोर्टलवर तुमचे स्वागत आहे. खालील सेवा निवडा.
            </p>
          </div>
        </div>
      </div>

      {/* ===== Live News Ticker ===== */}
      <div className="ticker-wrap">
        <div className="ticker-bar">
          <span className="ticker-live-badge">
            <Radio size={12} /> LIVE
          </span>
          <span className="ticker-label">📢 नवीन फिचर:</span>
          <div className="ticker-scroll">
            <div className="ticker-content">
              <span className="ticker-item">⭐ **मोठी बातमी:** लाडकी बहिण योजना Re-Verification साठी हमीपत्र फॉर्म आता उपलब्ध आहे!</span>
              <span className="ticker-sep">|</span>
              <span className="ticker-item">📋 स्वयंघोषणा पत्र, तक्रार नोंदणी व नवीन अर्ज फॉर्म लवकरच येत आहेत.</span>
              <span className="ticker-sep">|</span>
              <span className="ticker-item">💾 Google Sheet मध्ये data auto-save होतो — इंटरनेट आवश्यक.</span>
              <span className="ticker-sep">|</span>
              <span className="ticker-item">🖨️ Save & Print एका क्लिकवर — A4 format मध्ये print होतो.</span>
              <span className="ticker-sep">|</span>
              <span className="ticker-item">⭐ **मोठी बातमी:** लाडकी बहिण योजना Re-Verification साठी हमीपत्र फॉर्म आता उपलब्ध आहे!</span>
              <span className="ticker-sep">|</span>
              <span className="ticker-item">📋 स्वयंघोषणा पत्र, तक्रार नोंदणी व नवीन अर्ज फॉर्म लवकरच येत आहेत.</span>
            </div>
          </div>
        </div>
      </div>

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
          {filtered.map((form) => (
            <button
              key={form.id}
              className="dash-card"
              onClick={() => {
                if (form.ready) {
                  navigate(form.path);
                } else {
                  alert("हा फॉर्म लवकरच उपलब्ध होईल.");
                }
              }}
            >
              {form.badge && (
                <span
                  className="dash-card-badge"
                  style={{ background: form.badgeColor }}
                >
                  {form.badge}
                </span>
              )}
              <div
                className="dash-card-icon"
                style={{ background: form.iconBg }}
              >
                <form.icon size={28} color={form.iconColor} />
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
        © 2026 महा ई-सेवा केंद्र — लाडकी बहिण योजना
      </footer>
    </div>
  );
};

export default Dashboard;
