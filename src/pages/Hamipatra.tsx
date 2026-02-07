import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, FileText, Landmark, Sun, Moon } from "lucide-react";
import { getThemeGradient } from "@/lib/themes";

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxKjtz4R68s1lDUU2FwDxaI_Sp3qTFUKROTwZ6UPDVHGouzleZ72yeJ41nHWLH3n2Sf/exec";

const getTodayDate = () => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")} / ${String(d.getMonth() + 1).padStart(2, "0")} / ${d.getFullYear()}`;
};

const Hamipatra = () => {
  const navigate = useNavigate();
  const themeGradient = getThemeGradient();
  const [showForm, setShowForm] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");
  const [applicationNo, setApplicationNo] = useState("");
  const [name, setName] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const taluka = "नांदगाव खंडेश्वर";
  const district = "अमरावती";
  const place = "पापळ";

  const validate = () => {
    if (!name.trim()) { toast.error("कृपया नाव भरा"); return false; }
    if (aadhaar && !/^\d{12}$/.test(aadhaar)) { toast.error("आधार क्रमांक 12 अंकी असावा"); return false; }
    if (!mobile.trim() || !/^\d{10}$/.test(mobile)) { toast.error("मोबाईल क्र. 10 अंकी असावा"); return false; }
    return true;
  };

  const handleSaveAndPrint = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          applicationNumber: applicationNo, mobile, name, aadhaar, address, taluka, district, place,
        }),
        mode: "no-cors",
      });
      toast.success("Data Google Sheet मध्ये Saved झाला आहे");
    } catch {
      toast.error("Data Save करताना Error आला.");
      setSaving(false);
      return;
    } finally {
      setSaving(false);
    }
    setTimeout(() => {
      window.print();
      setApplicationNo(""); setName(""); setAadhaar(""); setMobile(""); setAddress("");
    }, 300);
  };

  return (
    <div className="dash-root">
      {/* ===== Top Nav (same as Dashboard) ===== */}
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
          <button
            className="theme-toggle"
            onClick={() => setDark(!dark)}
            aria-label="Toggle dark mode"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </nav>

      {/* ===== Content ===== */}
      <div className="no-print form-page-wrapper">
        <button className="back-btn" style={{ color: `hsl(var(--primary))` }} onClick={() => showForm ? setShowForm(false) : navigate("/")}>
          <ArrowLeft size={18} /> {showForm ? "कार्ड वर परत जा" : "डॅशबोर्ड वर परत जा"}
        </button>

        {!showForm ? (
          /* ===== CARD VIEW ===== */
          <div style={{ display: "flex", justifyContent: "center", paddingTop: 20 }}>
            <button
              className="dash-card hamipatra-hero-card"
              style={{ maxWidth: 240, padding: "32px 24px 24px", animationDelay: "0s" }}
              onClick={() => setShowForm(true)}
            >
              <span className="dash-card-badge badge-ready">READY</span>
              <div
                className="dash-card-icon"
                style={{ background: "linear-gradient(135deg, #DBEAFE, #BFDBFE)", width: 64, height: 64 }}
              >
                <FileText size={30} color="#2563EB" strokeWidth={1.8} />
              </div>
              <span className="dash-card-label" style={{ fontSize: 14 }}>हमीपत्र (Disclaimer)</span>
              <span style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", marginTop: 4 }}>
                फॉर्म भरण्यासाठी क्लिक करा →
              </span>
            </button>
          </div>
        ) : (
          <div className="form-container">
            <div className="form-header" style={{ background: themeGradient }}>
              <h1 className="form-heading">हमीपत्र व (Disclaimer)</h1>
              <p className="form-subheading">Re‑Verification / Grievance साठी माहिती भरा</p>
            </div>
            <div className="form-body">
              <div className="input-group">
                <label>लाडकी बहिण अर्ज नंबर</label>
                <input type="text" value={applicationNo} onChange={(e) => setApplicationNo(e.target.value)} placeholder="NYS-09250861-669e9d814e4b79726" />
              </div>
              <div className="input-group">
                <label>नाव *</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="अर्जदाराचे पूर्ण नाव" />
              </div>
              <div className="input-row-2">
                <div className="input-group">
                  <label>आधार क्रमांक</label>
                  <input type="text" value={aadhaar} onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, "").slice(0, 12))} maxLength={12} inputMode="numeric" placeholder="12 अंकी क्रमांक" />
                </div>
                <div className="input-group">
                  <label>मोबाईल क्र. *</label>
                  <input type="text" value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))} maxLength={10} inputMode="numeric" placeholder="10 अंकी क्र." />
                </div>
              </div>
              <div className="input-group">
                <label>राहणार (पूर्ण पत्ता)</label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="गाव / शहर, पोस्ट, तालुका" />
              </div>
              <hr className="section-divider" />
              <div className="input-row-2">
                <div className="input-group">
                  <label>तालुका</label>
                  <input type="text" value={taluka} readOnly className="readonly" />
                </div>
                <div className="input-group">
                  <label>जिल्हा</label>
                  <input type="text" value={district} readOnly className="readonly" />
                </div>
              </div>
              <button className="submit-btn" style={{ background: themeGradient }} onClick={handleSaveAndPrint} disabled={saving}>
                {saving ? "Saving..." : "💾 Save & Print / Save as PDF"}
              </button>
              <p className="form-footer-note">Data Google Sheet मध्ये Save होईल आणि A4 format मध्ये Print होईल</p>
            </div>
          </div>
        )}
      </div>

      {/* ===== Footer ===== */}
      <footer className="dash-footer no-print">
        © 2026 SETU Suvidha — सेतु सुविधा महा ई-सेवा पोर्टल
      </footer>

      {/* ===== A4 PRINT FORMAT ===== */}
      <div className="print-only a4-page">
        <div className="print-row">
          <span className="print-label">लाडकी बहिण अर्ज नंबर :</span>
          <span className="print-value-underline">{applicationNo || "________________________"}</span>
        </div>
        <hr className="print-divider" />
        <h2 className="print-title">हमीपत्र व (Disclaimer)</h2>
        <h3 className="print-subtitle">लाडकी बहिण योजना – Re‑Verification / Grievance साठी</h3>
        <p className="print-intro">मी खाली सही करणारी,</p>
        <div className="print-row"><span className="print-label">नाव :</span><span className="print-value-underline">{name}</span></div>
        <div className="print-row">
          <span className="print-label">आधार क्रमांक :</span><span className="print-value-underline">{aadhaar || "____________"}</span>
          <span className="print-label" style={{ marginLeft: 20 }}>मोबाईल क्र. :</span><span className="print-value-underline">{mobile}</span>
        </div>
        <div className="print-row"><span className="print-label">राहणार :</span><span className="print-value-underline">{address || "________________________"}</span></div>
        <div className="print-row">
          <span className="print-label">तालुका :</span><span className="print-value-underline">{taluka}</span>
          <span className="print-label" style={{ marginLeft: 20 }}>जिल्हा :</span><span className="print-value-underline">{district}</span>
        </div>
        <div className="print-row"><span className="print-label">राज्य :</span><span className="print-value-underline">महाराष्ट्र</span></div>
        <p className="print-oath">याद्वारे सत्यप्रतिज्ञेवर खालीलप्रमाणे स्पष्ट व बिनशर्त हमी देते की —</p>
        <ol className="print-disclaimer">
          <li>लाडकी बहिण योजना अंतर्गत माझा अर्ज भरताना / पुन्हा तपासणी (Re‑Verification) / तक्रार (Grievance) नोंद करताना, माझा अर्ज मंजूर (Approve) होईल किंवा नामंजूर (Reject) होईल, याची कोणतीही हमी नाही, याची मला पूर्ण जाणीव आहे.</li>
          <li>माझा अर्ज पूर्वी Reject झालेला असल्यास, किंवा भविष्यात कागदपत्रांतील त्रुटी, माहितीतील चूक, e-KYC समस्या, बँक तपशीलातील अडचण इत्यादी कारणांमुळे अर्ज Reject झाल्यास, त्याची पूर्ण जबाबदारी माझी स्वतःची राहील.</li>
          <li>या अर्जाच्या संदर्भात CSC / VLE / SETU केंद्र चालक, Maha e-Seva Kendra किंवा कर्मचारी यांच्यावर कुठल्याही कारची जबाबदारी, दोष किंवा गुन्हा लागू होणार नाही, यास मी पूर्णपणे सहमत आहे.</li>
          <li>संबंधित केंद्राकडून मला फक्त अर्ज / तक्रार नोंदणीची सुविधा देण्यात येत असून अर्ज मंजुरी, दुरुस्ती किंवा लाभ मिळण्याची कोणतीही हमी दिली जात नाही, हे मला मान्य आहे.</li>
          <li>मी सादर केलेली सर्व माहिती व कागदपत्रे माझ्या माहितीनुसार खरी व अचूक आहेत. खोटी किंवा चुकीची माहिती आढळल्यास शासन जे निर्णय घेईल, यास मी पूर्णतः जबाबदार राहीन.</li>
        </ol>
        <p className="print-closing">वरील सर्व अटी मला समजलेल्या असून त्या मला मान्य आहेत, म्हणून हे हमीपत्र मी स्वेच्छेने देत आहे.</p>
        <hr className="print-divider" />
        <div className="print-footer">
          <div className="print-footer-row"><span>ठिकाण : {place}</span><span>अर्जदाराची सही / अंगठा</span></div>
          <div className="print-footer-row" style={{ marginTop: 10 }}><span>दिनांक : {getTodayDate()}</span><span>अर्जदाराचे नाव : {name || "_______________"}</span></div>
        </div>
      </div>
    </div>
  );
};

export default Hamipatra;
