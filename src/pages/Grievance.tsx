import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, AlertTriangle, Landmark, Sun, Moon } from "lucide-react";
import { getThemeGradient } from "@/lib/themes";
import { useFormSubmissions } from "@/hooks/useFormSubmissions";
import SubmissionsList from "@/components/SubmissionsList";
import type { FormSubmission } from "@/hooks/useFormSubmissions";

const getTodayDate = () => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")} / ${String(d.getMonth() + 1).padStart(2, "0")} / ${d.getFullYear()}`;
};

const Grievance = () => {
  const navigate = useNavigate();
  const themeGradient = getThemeGradient();
  const [showForm, setShowForm] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");
  const [name, setName] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [grievanceType, setGrievanceType] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [printData, setPrintData] = useState<Record<string, any> | null>(null);

  const { submissions, loading, addSubmission, deleteSubmission } = useFormSubmissions("तक्रार नोंदणी");

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
    if (!description.trim()) { toast.error("कृपया तक्रारीचे वर्णन लिहा"); return false; }
    return true;
  };

  const handleSaveAndPrint = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const formData = { mobile, aadhaar, address, grievanceType, description, taluka, district, place };
      const saved = await addSubmission(name, formData);
      if (!saved) { setSaving(false); return; }
    } finally {
      setSaving(false);
    }
    setPrintData({ name, aadhaar, mobile, address, grievanceType, description, taluka, district, place });
    setTimeout(() => {
      window.print();
      setName(""); setAadhaar(""); setMobile(""); setAddress(""); setGrievanceType(""); setDescription("");
    }, 300);
  };

  const handlePrintRecord = (sub: FormSubmission) => {
    setPrintData({ ...sub.form_data, name: sub.applicant_name });
    setTimeout(() => window.print(), 200);
  };

  const p = printData || { name, aadhaar, mobile, address, grievanceType, description, taluka, district, place };

  return (
    <div className="dash-root">
      <nav className="dash-nav no-print" style={{ background: themeGradient }}>
        <div className="dash-nav-inner">
          <div className="dash-brand" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
            <div className="dash-brand-icon"><Landmark size={22} color="#fff" /></div>
            <div><span className="dash-brand-title">SETU Suvidha</span><span className="dash-brand-sub">सेतु सुविधा — महा ई-सेवा फॉर्म पोर्टल</span></div>
          </div>
          <button className="theme-toggle" onClick={() => setDark(!dark)} aria-label="Toggle dark mode">{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
        </div>
      </nav>

      <div className="no-print" style={{ padding: "12px 16px 0" }}>
        <button className="back-btn px-[9px] py-[7px] font-extralight font-sans shadow-sm rounded-sm" style={{ color: `hsl(var(--primary))` }} onClick={() => showForm ? setShowForm(false) : navigate("/")}>
          <ArrowLeft size={18} /> {showForm ? "कार्ड वर परत जा" : "डॅशबोर्ड वर परत जा"}
        </button>
      </div>

      <div className="no-print form-page-wrapper" style={{ paddingTop: 0 }}>
        {!showForm ? (
          <div style={{ display: "flex", justifyContent: "center", paddingTop: 20 }}>
            <button className="dash-card hamipatra-hero-card" style={{ maxWidth: 240, padding: "32px 24px 24px", animationDelay: "0s" }} onClick={() => setShowForm(true)}>
              <span className="dash-card-badge badge-new">NEW</span>
              <div className="dash-card-icon" style={{ background: "linear-gradient(135deg, #FEF3C7, #FDE68A)", width: 64, height: 64 }}><AlertTriangle size={30} color="#D97706" strokeWidth={1.8} /></div>
              <span className="dash-card-label" style={{ fontSize: 14 }}>तक्रार नोंदणी (Grievance)</span>
              <span style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", marginTop: 4 }}>फॉर्म भरण्यासाठी क्लिक करा →</span>
            </button>
          </div>
        ) : (
          <div className="form-container">
            <div className="form-header" style={{ background: themeGradient }}><h1 className="form-heading">तक्रार नोंदणी (Grievance)</h1><p className="form-subheading">तक्रार नोंदणीसाठी माहिती भरा</p></div>
            <div className="form-body">
              <div className="input-group"><label>नाव *</label><input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="अर्जदाराचे पूर्ण नाव" /></div>
              <div className="input-row-2">
                <div className="input-group"><label>आधार क्रमांक</label><input type="text" value={aadhaar} onChange={e => setAadhaar(e.target.value.replace(/\D/g, "").slice(0, 12))} maxLength={12} inputMode="numeric" placeholder="12 अंकी क्रमांक" /></div>
                <div className="input-group"><label>मोबाईल क्र. *</label><input type="text" value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))} maxLength={10} inputMode="numeric" placeholder="10 अंकी क्र." /></div>
              </div>
              <div className="input-group"><label>राहणार (पूर्ण पत्ता)</label><input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="गाव / शहर, पोस्ट, तालुका" /></div>
              <div className="input-group"><label>तक्रारीचा प्रकार</label><input type="text" value={grievanceType} onChange={e => setGrievanceType(e.target.value)} placeholder="उदा. e-KYC, बँक तपशील, अर्ज नामंजूर" /></div>
              <div className="input-group"><label>तक्रारीचे वर्णन *</label><textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="तक्रारीचे सविस्तर वर्णन लिहा..." rows={4} style={{ width: "100%", padding: "10px 14px", fontSize: 13, fontFamily: "'Noto Sans Devanagari', sans-serif", border: "1.5px solid hsl(var(--border))", borderRadius: 10, background: "hsl(var(--card))", resize: "vertical", color: "hsl(var(--foreground))" }} /></div>
              <hr className="section-divider" />
              <div className="input-row-2">
                <div className="input-group"><label>तालुका</label><input type="text" value={taluka} readOnly className="readonly" /></div>
                <div className="input-group"><label>जिल्हा</label><input type="text" value={district} readOnly className="readonly" /></div>
              </div>
              <button className="submit-btn" style={{ background: themeGradient }} onClick={handleSaveAndPrint} disabled={saving}>{saving ? "Saving..." : "💾 Save & Print / Save as PDF"}</button>
              <p className="form-footer-note">Data Supabase मध्ये Save होईल</p>
            </div>
          </div>
        )}
      </div>

      <div className="no-print">
        <SubmissionsList submissions={submissions} loading={loading} onDelete={deleteSubmission} onPrint={handlePrintRecord} columns={[{ key: "mobile", label: "मोबाईल" }, { key: "grievanceType", label: "प्रकार" }]} />
      </div>

      <footer className="dash-footer no-print">© 2026 SETU Suvidha — सेतु सुविधा महा ई-सेवा पोर्टल</footer>

      <div className="print-only a4-page">
        <h2 className="print-title">तक्रार नोंदणी (Grievance)</h2>
        <p className="print-intro">मी खाली सही करणारा/री,</p>
        <div className="print-row"><span className="print-label">नाव :</span><span className="print-value-underline">{p.name}</span></div>
        <div className="print-row"><span className="print-label">आधार क्रमांक :</span><span className="print-value-underline">{p.aadhaar || "____________"}</span><span className="print-label" style={{ marginLeft: 20 }}>मोबाईल क्र. :</span><span className="print-value-underline">{p.mobile}</span></div>
        <div className="print-row"><span className="print-label">राहणार :</span><span className="print-value-underline">{p.address || "________________________"}</span></div>
        <div className="print-row"><span className="print-label">तालुका :</span><span className="print-value-underline">{p.taluka}</span><span className="print-label" style={{ marginLeft: 20 }}>जिल्हा :</span><span className="print-value-underline">{p.district}</span></div>
        <div className="print-row"><span className="print-label">तक्रारीचा प्रकार :</span><span className="print-value-underline">{p.grievanceType || "________________________"}</span></div>
        <div className="print-row"><span className="print-label">तक्रारीचे वर्णन :</span></div>
        <p style={{ border: "1px solid #333", padding: 12, minHeight: 80, marginTop: 4 }}>{p.description}</p>
        <hr className="print-divider" />
        <div className="print-footer">
          <div className="print-footer-row"><span>ठिकाण : {p.place || place}</span><span>अर्जदाराची सही / अंगठा</span></div>
          <div className="print-footer-row" style={{ marginTop: 10 }}><span>दिनांक : {getTodayDate()}</span><span>अर्जदाराचे नाव : {p.name || "_______________"}</span></div>
        </div>
      </div>
    </div>
  );
};

export default Grievance;
