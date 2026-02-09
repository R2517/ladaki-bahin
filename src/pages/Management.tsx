import { useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, UserCheck, HardHat } from "lucide-react";

const services = [
  {
    id: "pan-card",
    title: "पॅन कार्ड (PAN Card)",
    icon: CreditCard,
    iconBg: "linear-gradient(135deg, #E0E7FF, #C7D2FE)",
    iconColor: "#4338CA",
  },
  {
    id: "voter-id",
    title: "मतदार ओळखपत्र (Voter ID Card)",
    icon: UserCheck,
    iconBg: "linear-gradient(135deg, #DBEAFE, #93C5FD)",
    iconColor: "#1D4ED8",
  },
  {
    id: "bandkam-kamgar",
    title: "बांधकाम कामगार (Bandkam Kamgar)",
    icon: HardHat,
    iconBg: "linear-gradient(135deg, #FEF3C7, #FDE68A)",
    iconColor: "#D97706",
  },
];

const Management = () => {
  const navigate = useNavigate();

  return (
    <div className="dash-root">
      {/* Header */}
      <nav className="mgmt-header">
        <button className="mgmt-back" onClick={() => navigate("/")}>
          <ArrowLeft size={18} /> मुख्यपृष्ठ
        </button>
        <h1 className="mgmt-title">⚙️ Management</h1>
        <p className="mgmt-sub">व्यवस्थापन सेवा — खालील सेवा निवडा</p>
      </nav>

      {/* Cards */}
      <div className="mgmt-grid">
        {services.map((s) => (
          <button
            key={s.id}
            className="mgmt-card"
            onClick={() => alert("हा विभाग लवकरच उपलब्ध होईल — Coming Soon")}
          >
            <div className="mgmt-card-icon" style={{ background: s.iconBg }}>
              <s.icon size={30} color={s.iconColor} strokeWidth={1.8} />
            </div>
            <span className="mgmt-card-title">{s.title}</span>
            <span className="mgmt-card-badge">Coming Soon</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Management;
