import { useNavigate } from "react-router-dom";
import { FileText, AlertTriangle, FilePlus, Shield, ClipboardList } from "lucide-react";

const forms = [
  {
    id: "hamipatra",
    title: "हमीपत्र (Disclaimer)",
    subtitle: "Re‑Verification / Grievance साठी",
    description: "लाडकी बहिण योजना अंतर्गत हमीपत्र व Disclaimer फॉर्म भरा.",
    icon: FileText,
    path: "/hamipatra",
    color: "from-blue-500 to-blue-700",
    ready: true,
  },
  {
    id: "self-declaration",
    title: "स्वयंघोषणा पत्र",
    subtitle: "Self Declaration Form",
    description: "अर्जदाराचे स्वयंघोषणा पत्र / शपथपत्र भरा.",
    icon: Shield,
    path: "/self-declaration",
    color: "from-emerald-500 to-emerald-700",
    ready: false,
  },
  {
    id: "grievance",
    title: "तक्रार नोंदणी",
    subtitle: "Grievance Registration",
    description: "तक्रार / Complaint नोंदणी फॉर्म भरा.",
    icon: AlertTriangle,
    path: "/grievance",
    color: "from-amber-500 to-amber-700",
    ready: false,
  },
  {
    id: "new-application",
    title: "नवीन अर्ज",
    subtitle: "New Application Form",
    description: "लाडकी बहिण योजना नवीन अर्ज भरा.",
    icon: FilePlus,
    path: "/new-application",
    color: "from-violet-500 to-violet-700",
    ready: false,
  },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-wrapper">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <ClipboardList size={32} className="header-icon" />
          <div>
            <h1 className="header-title">लाडकी बहिण योजना</h1>
            <p className="header-subtitle">महा ई-सेवा केंद्र — फॉर्म डॅशबोर्ड</p>
          </div>
        </div>
      </header>

      {/* Cards Grid */}
      <main className="dashboard-main">
        <div className="cards-grid">
          {forms.map((form) => (
            <button
              key={form.id}
              className="form-card"
              onClick={() => {
                if (form.ready) {
                  navigate(form.path);
                } else {
                  alert("हा फॉर्म लवकरच उपलब्ध होईल.");
                }
              }}
            >
              <div className={`card-icon-bar bg-gradient-to-r ${form.color}`}>
                <form.icon size={28} color="#fff" />
              </div>
              <div className="card-body">
                <h2 className="card-title">{form.title}</h2>
                <p className="card-subtitle">{form.subtitle}</p>
                <p className="card-desc">{form.description}</p>
                {!form.ready && (
                  <span className="card-badge">लवकरच</span>
                )}
                {form.ready && (
                  <span className="card-badge card-badge-ready">तयार आहे</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>© 2026 महा ई-सेवा केंद्र — लाडकी बहिण योजना</p>
      </footer>
    </div>
  );
};

export default Dashboard;
