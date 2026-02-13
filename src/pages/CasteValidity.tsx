import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, BadgeCheck, Landmark, Sun, Moon } from "lucide-react";
import { getThemeGradient } from "@/lib/themes";
import { useFormSubmissions } from "@/hooks/useFormSubmissions";
import SubmissionsList from "@/components/SubmissionsList";
import type { FormSubmission } from "@/hooks/useFormSubmissions";

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxKjtz4R68s1lDUU2FwDxaI_Sp3qTFUKROTwZ6UPDVHGouzleZ72yeJ41nHWLH3n2Sf/exec";

const getTodayDate = () => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")} / ${String(d.getMonth() + 1).padStart(2, "0")} / ${d.getFullYear()}`;
};

const CasteValidity = () => {
  const navigate = useNavigate();
  const themeGradient = getThemeGradient();
  const [showForm, setShowForm] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");
  const [name, setName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [caste, setCaste] = useState("");
  const [subCaste, setSubCaste] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDob] = useState("");
  const [saving, setSaving] = useState(false);
  const [printData, setPrintData] = useState<Record<string, any> | null>(null);

  const { submissions, loading, addSubmission, deleteSubmission } = useFormSubmissions("जात पडताळणी");

  const taluka = "नांदगाव खंडेश्वर";
  const district = "अमरावती";
  const place = "पापळ";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const validate = () => {
    if (!name.trim()) { toast.error("कृपया नाव भरा"); return false; }
    if (!caste.trim()) { toast.error("कृपया जात भरा"); return false; }
    if (aadhaar && !/^\d{12}$/.test(aadhaar)) { toast.error("आधार क्रमांक 12 अंकी असावा"); return false; }
    if (!mobile.trim() || !/^\d{10}$/.test(mobile)) { toast.error("मोबाईल क्र. 10 अंकी असावा"); return false; }
    return true;
  };

  const handleSaveAndPrint = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      // Google Sheet backup
      fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({ formType: "जात पडताळणी", timestamp: new Date().toISOString(), name, fatherName, caste, subCaste, aadhaar, mobile, address, dob, taluka, district, place }),
        mode: "no-cors",
      }).catch(() => {});

      const formData = { fatherName, caste, subCaste, aadhaar, mobile, address, dob, taluka, district, place };
      const saved = await addSubmission(name, formData);
      if (!saved) { setSaving(false); return; }
    } finally {
      setSaving(false);
    }
    setPrintData({ name, fatherName, caste, subCaste, aadhaar, mobile, address, dob, taluka, district, place });
    setTimeout(() => {
      window.print();
      setName(""); setFatherName(""); setCaste(""); setSubCaste(""); setAadhaar(""); setMobile(""); setAddress(""); setDob("");
    }, 300);
  };

  const handlePrintRecord = (sub: FormSubmission) => {
    setPrintData({ ...sub.form_data, name: sub.applicant_name });
    setTimeout(() => window.print(), 200);
  };

  const p = printData || { name, fatherName, caste, subCaste, aadhaar, mobile, address, dob, taluka, district, place };

  return (
    <div className="dash-root">
      <nav className="dash-nav no-print" style={{ background: themeGradient }}>
        <div className="dash-nav-inner">
          <div className="dash-brand" style={{ cursor: "pointer" }} onClick={() => navigate("/dashboard")}>
            <div className="dash-brand-icon"><Landmark size={22} color="#fff" /></div>
            <div><span className="dash-brand-title">SETU Suvidha</span><span className="dash-brand-sub">सेतु सुविधा — महा ई-सेवा फॉर्म पोर्टल</span></div>
          </div>
          <button className="theme-toggle" onClick={() => setDark(!dark)} aria-label="Toggle dark mode">{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
        </div>
      </nav>

      <div className="no-print" style={{ padding: "12px 16px 0" }}>
        <button className="back-btn px-[9px] py-[7px] font-extralight font-sans shadow-sm rounded-sm" style={{ color: `hsl(var(--primary))` }} onClick={() => showForm ? setShowForm(false) : navigate("/dashboard")}>
          <ArrowLeft size={18} /> {showForm ? "कार्ड वर परत जा" : "डॅशबोर्ड वर परत जा"}
        </button>
      </div>

      <div className="no-print form-page-wrapper" style={{ paddingTop: 0 }}>
        {!showForm ? (
          <div style={{ display: "flex", justifyContent: "center", paddingTop: 20 }}>
            <button className="dash-card hamipatra-hero-card" style={{ maxWidth: 240, padding: "32px 24px 24px", animationDelay: "0s" }} onClick={() => setShowForm(true)}>
              <span className="dash-card-badge badge-ready">READY</span>
              <div className="dash-card-icon" style={{ background: "linear-gradient(135deg, #CCFBF1, #99F6E4)", width: 64, height: 64 }}><BadgeCheck size={30} color="#0D9488" strokeWidth={1.8} /></div>
              <span className="dash-card-label" style={{ fontSize: 14 }}>जात पडताळणी</span>
              <span style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", marginTop: 4 }}>फॉर्म भरण्यासाठी क्लिक करा →</span>
            </button>
          </div>
        ) : (
          <div className="form-container">
            <div className="form-header" style={{ background: themeGradient }}><h1 className="form-heading">जात पडताळणी</h1><p className="form-subheading">जात पडताळणी प्रमाणपत्रासाठी माहिती भरा</p></div>
            <div className="form-body">
              <div className="input-group"><label>अर्जदाराचे पूर्ण नाव *</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="अर्जदाराचे पूर्ण नाव" /></div>
              <div className="input-group"><label>वडिलांचे / पतीचे नाव</label><input type="text" value={fatherName} onChange={(e) => setFatherName(e.target.value)} placeholder="वडिलांचे / पतीचे पूर्ण नाव" /></div>
              <div className="input-row-2">
                <div className="input-group"><label>जात *</label><input type="text" value={caste} onChange={(e) => setCaste(e.target.value)} placeholder="जात" /></div>
                <div className="input-group"><label>पोटजात</label><input type="text" value={subCaste} onChange={(e) => setSubCaste(e.target.value)} placeholder="पोटजात" /></div>
              </div>
              <div className="input-group"><label>जन्मतारीख</label><input type="date" value={dob} onChange={(e) => setDob(e.target.value)} /></div>
              <div className="input-row-2">
                <div className="input-group"><label>आधार क्रमांक</label><input type="text" value={aadhaar} onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, "").slice(0, 12))} maxLength={12} inputMode="numeric" placeholder="12 अंकी क्रमांक" /></div>
                <div className="input-group"><label>मोबाईल क्र. *</label><input type="text" value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))} maxLength={10} inputMode="numeric" placeholder="10 अंकी क्र." /></div>
              </div>
              <div className="input-group"><label>राहणार (पूर्ण पत्ता)</label><input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="गाव / शहर, पोस्ट, तालुका" /></div>
              <hr className="section-divider" />
              <div className="input-row-2">
                <div className="input-group"><label>तालुका</label><input type="text" value={taluka} readOnly className="readonly" /></div>
                <div className="input-group"><label>जिल्हा</label><input type="text" value={district} readOnly className="readonly" /></div>
              </div>
              <button className="submit-btn" style={{ background: themeGradient }} onClick={handleSaveAndPrint} disabled={saving}>{saving ? "Saving..." : "💾 Save & Print / Save as PDF"}</button>
              <p className="form-footer-note">Data Supabase + Google Sheet मध्ये Save होईल</p>
            </div>
          </div>
        )}
      </div>

      <div className="no-print">
        <SubmissionsList submissions={submissions} loading={loading} onDelete={deleteSubmission} onPrint={handlePrintRecord} columns={[{ key: "mobile", label: "मोबाईल" }, { key: "caste", label: "जात" }]} />
      </div>

      <footer className="dash-footer no-print">© 2026 SETU Suvidha — सेतु सुविधा महा ई-सेवा पोर्टल</footer>

      <div className="print-only a4-page">
        <h2 className="print-title">जात पडताळणी प्रमाणपत्र अर्ज</h2>
        <h3 className="print-subtitle">Caste Validity Certificate Application</h3>
        <hr className="print-divider" />
        <div className="print-row"><span className="print-label">अर्जदाराचे नाव :</span><span className="print-value-underline">{p.name}</span></div>
        <div className="print-row"><span className="print-label">वडिलांचे / पतीचे नाव :</span><span className="print-value-underline">{p.fatherName || "________________________"}</span></div>
        <div className="print-row"><span className="print-label">जात :</span><span className="print-value-underline">{p.caste}</span><span className="print-label" style={{ marginLeft: 20 }}>पोटजात :</span><span className="print-value-underline">{p.subCaste || "____________"}</span></div>
        <div className="print-row"><span className="print-label">जन्मतारीख :</span><span className="print-value-underline">{p.dob || "________________________"}</span></div>
        <div className="print-row"><span className="print-label">आधार क्रमांक :</span><span className="print-value-underline">{p.aadhaar || "____________"}</span><span className="print-label" style={{ marginLeft: 20 }}>मोबाईल क्र. :</span><span className="print-value-underline">{p.mobile}</span></div>
        <div className="print-row"><span className="print-label">राहणार :</span><span className="print-value-underline">{p.address || "________________________"}</span></div>
        <div className="print-row"><span className="print-label">तालुका :</span><span className="print-value-underline">{p.taluka}</span><span className="print-label" style={{ marginLeft: 20 }}>जिल्हा :</span><span className="print-value-underline">{p.district}</span></div>
        <div className="print-row"><span className="print-label">राज्य :</span><span className="print-value-underline">महाराष्ट्र</span></div>
        <hr className="print-divider" />
        <p className="print-oath">मी वरील माहिती सत्य व अचूक असल्याचे प्रतिज्ञापूर्वक सांगतो/सांगते.</p>
        <div className="print-footer">
          <div className="print-footer-row"><span>ठिकाण : {p.place || place}</span><span>अर्जदाराची सही / अंगठा</span></div>
          <div className="print-footer-row" style={{ marginTop: 10 }}><span>दिनांक : {getTodayDate()}</span><span>अर्जदाराचे नाव : {p.name || "_______________"}</span></div>
        </div>
      </div>
    </div>
  );
};

export default CasteValidity;
