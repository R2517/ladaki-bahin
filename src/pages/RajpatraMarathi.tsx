import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, FileText, Landmark, Sun, Moon } from "lucide-react";
import { getThemeGradient } from "@/lib/themes";
import { useFormSubmissions } from "@/hooks/useFormSubmissions";
import SubmissionsList from "@/components/SubmissionsList";
import type { FormSubmission } from "@/hooks/useFormSubmissions";

const REASONS = [
  "लग्नानंतर नाव बदल",
  "धर्मांतर",
  "वैयक्तिक कारण",
  "नावातील चूक दुरुस्ती",
  "न्यायालयीन आदेश",
  "इतर",
];

const DISTRICTS = ["अमरावती", "नागपूर", "पुणे", "मुंबई", "ठाणे", "नाशिक", "औरंगाबाद", "कोल्हापूर", "सोलापूर", "सांगली", "सातारा", "रत्नागिरी", "जळगाव", "धुळे", "नंदुरबार", "अहमदनगर", "बीड", "लातूर", "उस्मानाबाद", "परभणी", "हिंगोली", "नांदेड", "बुलढाणा", "अकोला", "वाशिम", "यवतमाळ", "वर्धा", "चंद्रपूर", "गडचिरोली", "भंडारा", "गोंदिया"];

const RajpatraMarathi = () => {
  const navigate = useNavigate();
  const themeGradient = getThemeGradient();
  const [showForm, setShowForm] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");
  const [saving, setSaving] = useState(false);
  const [printData, setPrintData] = useState<Record<string, any> | null>(null);

  // Old Name
  const [oldFirstName, setOldFirstName] = useState("");
  const [oldFatherName, setOldFatherName] = useState("");
  const [oldSurname, setOldSurname] = useState("");
  // New Name
  const [newFirstName, setNewFirstName] = useState("");
  const [newFatherName, setNewFatherName] = useState("");
  const [newSurname, setNewSurname] = useState("");
  // Other fields
  const [reason, setReason] = useState("");
  const [mobile, setMobile] = useState("");
  const [pincode, setPincode] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [district, setDistrict] = useState("");
  const [taluka, setTaluka] = useState("");
  const [village, setVillage] = useState("");
  const [address, setAddress] = useState("");

  const { submissions, loading, addSubmission, deleteSubmission } = useFormSubmissions("राजपत्र-मराठी");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const oldFullName = [oldFirstName, oldFatherName, oldSurname].filter(Boolean).join(" ");
  const newFullName = [newFirstName, newFatherName, newSurname].filter(Boolean).join(" ");
  const fullAddress = [village, taluka, district, pincode].filter(Boolean).join(", ");

  const validate = () => {
    if (!oldFirstName.trim()) { toast.error("जुने स्वत:चे नाव भरा"); return false; }
    if (!oldSurname.trim()) { toast.error("जुने आडनाव भरा"); return false; }
    if (!newFirstName.trim()) { toast.error("नवीन स्वत:चे नाव भरा"); return false; }
    if (!newSurname.trim()) { toast.error("नवीन आडनाव भरा"); return false; }
    if (!reason) { toast.error("नाव बदलण्याचे कारण निवडा"); return false; }
    if (!mobile.trim() || !/^\d{10}$/.test(mobile)) { toast.error("मोबाईल क्र. 10 अंकी असावा"); return false; }
    if (!pincode.trim() || !/^\d{6}$/.test(pincode)) { toast.error("पिन कोड 6 अंकी असावा"); return false; }
    if (aadhaar && !/^\d{12}$/.test(aadhaar)) { toast.error("आधार क्रमांक 12 अंकी असावा"); return false; }
    if (!district) { toast.error("जिल्हा निवडा"); return false; }
    return true;
  };

  const resetForm = () => {
    setOldFirstName(""); setOldFatherName(""); setOldSurname("");
    setNewFirstName(""); setNewFatherName(""); setNewSurname("");
    setReason(""); setMobile(""); setPincode(""); setAadhaar("");
    setDistrict(""); setTaluka(""); setVillage(""); setAddress("");
  };

  const handleSaveAndPrint = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const formData = {
        oldFirstName, oldFatherName, oldSurname, oldFullName,
        newFirstName, newFatherName, newSurname, newFullName,
        reason, mobile, pincode, aadhaar, district, taluka, village, address, fullAddress,
      };
      const saved = await addSubmission(newFullName, formData);
      if (!saved) { setSaving(false); return; }
      setPrintData(formData);
      setTimeout(() => { window.print(); resetForm(); }, 300);
    } finally {
      setSaving(false);
    }
  };

  const handlePrintRecord = (sub: FormSubmission) => {
    setPrintData({ ...sub.form_data });
    setTimeout(() => window.print(), 200);
  };

  // ===== PRINT VIEW =====
  if (printData) {
    return (
      <div className="rajpatra-print-page">
        <style>{`
          @media print {
            body * { visibility: hidden !important; }
            .rajpatra-print-page, .rajpatra-print-page * { visibility: visible !important; }
            .rajpatra-print-page { position: absolute; left: 0; top: 0; width: 210mm; }
            .no-print { display: none !important; }
          }
        `}</style>
        <div className="rajpatra-print-container" style={{
          maxWidth: 750, margin: "0 auto", padding: "30px 40px", fontFamily: "'Noto Sans Devanagari', serif'",
          border: "2px solid #000", background: "#fff", color: "#000", lineHeight: 1.8,
        }}>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <p style={{ fontSize: 16, fontWeight: 700 }}>महाराष्ट्र शासन</p>
            <p style={{ fontSize: 14, fontWeight: 700 }}>शासन मुद्रण, लेखनसामग्री व प्रकाशन संचालनालय</p>
            <p style={{ fontSize: 16, fontWeight: 700, marginTop: 8 }}>नाव बदलण्याचा नमुना</p>
            <p style={{ fontSize: 15, fontWeight: 700 }}>नोटीस</p>
          </div>

          <p style={{ fontSize: 12, fontStyle: "italic", marginBottom: 12 }}>
            <b>विशेष सूचना :-</b> हा नमुना भरण्यापूर्वी मागील बाजूस दिलेल्या सूचना काळजीपूर्वक अनुसरल्या पाहिजेत. खाली छापलेल्या प्रत्येक
            मोकळ्या जागी फक्त एकच शब्द लिहिला पाहिजे. कोणतीही पडताळणी न करता अर्जदारांनी अर्जात सदर केलेल्या माहितीवर
            आधारित सदर जाहिरात असल्यामुळे जाहिरातीत असलेल्या मजकुराबावतच्या सत्यवेदिपयी शासन कुठलीव जबाबदारी
            स्वीकारणार नाही.खालील नोटीस फक्त मराठीतच लिहावी.
          </p>

          <p style={{ fontSize: 13, marginBottom: 8 }}>
            यारूपन असे जाहीर करण्यात येत आहे की, <b>खाली सही करणाऱ्याने /करणारीने</b> आपले जुने नाव –
          </p>

          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 12 }}>
            <thead>
              <tr>
                <th style={thStyle}>जुने नाव</th>
                <th style={thStyle}>नाव</th>
                <th style={thStyle}>वडिलांचे/पतीचे नाव</th>
                <th style={thStyle}>आडनाव</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tdStyle}>बदलून</td>
                <td style={tdStyle}><b>{printData.oldFirstName}</b></td>
                <td style={tdStyle}><b>{printData.oldFatherName}</b></td>
                <td style={tdStyle}><b>{printData.oldSurname}</b></td>
              </tr>
              <tr>
                <td style={tdStyle}>नवीन नाव</td>
                <td style={tdStyle}><b>{printData.newFirstName}</b></td>
                <td style={tdStyle}><b>{printData.newFatherName}</b></td>
                <td style={tdStyle}><b>{printData.newSurname}</b></td>
              </tr>
            </tbody>
          </table>

          <p style={{ fontSize: 13 }}>हे नवीन नाव धारण केले आहे.</p>

          <p style={{ fontSize: 13, margin: "16px 0" }}>आई / वडिलांची अथवा पालकाची सही ....................</p>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
            <span>( फक्त अल्पवयीन इसमाच्या बाबतीत )</span>
            <span>जुन्या नावाप्रमाणे सही व तारीख</span>
          </div>

          <div style={{ margin: "24px 0" }}>
            <p style={{ fontSize: 13 }}>प्रति</p>
            <p style={{ fontSize: 13, marginLeft: 20 }}><b>संचालक,</b></p>
            <p style={{ fontSize: 12, marginLeft: 40 }}>
              शासन मुद्रण, लेखनसामग्री व प्रकाशन संचालनालय, महाराष्ट्र राज्य, नेताजी सुभाष रोड, मुंबई ४०००००४, यांस-
              महाराष्ट्र शासन राजपत्र, भाग दोन याच्या पुढील अंकात वरील नोटीस प्रसिद्ध करावी.
            </p>
          </div>

          <p style={{ fontSize: 13 }}>नाव बदलण्याचे कारण: <b>{printData.reason}</b></p>

          <div style={{ textAlign: "right", marginTop: 50, fontSize: 13 }}>
            <p>आपला/आपली विश्वासू,</p>
            <p>अर्जदाराची सही––––––––––––––––</p>
          </div>

          <div style={{ marginTop: 30, fontSize: 13, borderTop: "1px solid #000", paddingTop: 12 }}>
            <p><b>पत्रव्यवहाराचा पत्ता:</b></p>
            <p>अर्जदाराचे नवीन नाव : <b>{printData.newFullName}</b></p>
            <p>संपूर्ण पत्ता : <b>{printData.fullAddress || printData.address}</b></p>
            <p>पिन क्र. : <b>{printData.pincode}</b></p>
            <p>दूरध्वनी क्र : <b>{printData.mobile}</b></p>
            {printData.aadhaar && <p>आधार क्र : <b>{printData.aadhaar}</b></p>}
          </div>
        </div>
        <div className="no-print" style={{ textAlign: "center", marginTop: 16 }}>
          <button onClick={() => setPrintData(null)} style={{
            padding: "10px 28px", background: "hsl(var(--primary))", color: "#fff",
            border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600,
          }}>← फॉर्मवर परत जा</button>
        </div>
      </div>
    );
  }

  // ===== CARD VIEW (before form) =====
  if (!showForm) {
    return (
      <div className="dash-root">
        <nav className="dash-nav" style={{ background: themeGradient }}>
          <div className="dash-nav-inner">
            <div className="dash-brand">
              <button onClick={() => navigate("/rajpatra")} className="theme-toggle"><ArrowLeft size={18} /></button>
              <div className="dash-brand-icon"><Landmark size={22} color="#fff" /></div>
              <div>
                <span className="dash-brand-title">राजपत्र मराठी</span>
                <span className="dash-brand-sub">Gazette Notice — Marathi</span>
              </div>
            </div>
            <button className="theme-toggle" onClick={() => setDark(!dark)}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
          </div>
        </nav>
        <div className="dash-content" style={{ maxWidth: 480, margin: "40px auto" }}>
          <button className="dash-card" onClick={() => setShowForm(true)} style={{ width: "100%", minHeight: 160 }}>
            <div className="dash-card-icon" style={{ background: "linear-gradient(135deg, #FEF3C7, #FDE68A)" }}>
              <FileText size={32} color="#B45309" strokeWidth={1.6} />
            </div>
            <span className="dash-card-label" style={{ fontSize: 16 }}>📝 नाव बदल (Gazette) अर्ज — मराठी</span>
          </button>
        </div>
      </div>
    );
  }

  // ===== FORM VIEW =====
  return (
    <div className="dash-root">
      <nav className="dash-nav" style={{ background: themeGradient }}>
        <div className="dash-nav-inner">
          <div className="dash-brand">
            <button onClick={() => setShowForm(false)} className="theme-toggle"><ArrowLeft size={18} /></button>
            <div className="dash-brand-icon"><Landmark size={22} color="#fff" /></div>
            <div>
              <span className="dash-brand-title">राजपत्र मराठी</span>
              <span className="dash-brand-sub">नाव बदल (Gazette) अर्ज</span>
            </div>
          </div>
          <button className="theme-toggle" onClick={() => setDark(!dark)}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
        </div>
      </nav>

      <div className="dash-content" style={{ maxWidth: 860, margin: "20px auto" }}>
        <div className="rp-form-card">
          <div className="rp-form-header">📝 नाव बदल (Gazette) अर्ज — मराठी</div>
          <p className="rp-form-note">( हा फॉर्म शक्यतो मराठीतच भरावा )</p>

          {/* Old Name Section */}
          <div className="rp-section rp-section-old">
            <h4 className="rp-section-title">👤 १. जुने नाव (Old Name)</h4>
            <div className="rp-row-3">
              <div className="rp-field">
                <label>स्वत:चे नाव <span className="rp-req">*</span></label>
                <input value={oldFirstName} onChange={e => setOldFirstName(e.target.value)} placeholder="जुने नाव" />
              </div>
              <div className="rp-field">
                <label>वडिलांचे नाव <span className="rp-req">*</span></label>
                <input value={oldFatherName} onChange={e => setOldFatherName(e.target.value)} placeholder="वडिलांचे नाव" />
              </div>
              <div className="rp-field">
                <label>आडनाव <span className="rp-req">*</span></label>
                <input value={oldSurname} onChange={e => setOldSurname(e.target.value)} placeholder="आडनाव" />
              </div>
            </div>
          </div>

          {/* New Name Section */}
          <div className="rp-section rp-section-new">
            <h4 className="rp-section-title">👤 २. नवीन नाव (New Name)</h4>
            <div className="rp-row-3">
              <div className="rp-field">
                <label>स्वत:चे नाव <span className="rp-req">*</span></label>
                <input value={newFirstName} onChange={e => setNewFirstName(e.target.value)} placeholder="नवीन नाव" className="rp-input-new" />
              </div>
              <div className="rp-field">
                <label>वडिलांचे नाव <span className="rp-req">*</span></label>
                <input value={newFatherName} onChange={e => setNewFatherName(e.target.value)} placeholder="वडिलांचे नाव" className="rp-input-new" />
              </div>
              <div className="rp-field">
                <label>आडनाव <span className="rp-req">*</span></label>
                <input value={newSurname} onChange={e => setNewSurname(e.target.value)} placeholder="आडनाव" className="rp-input-new" />
              </div>
            </div>
            {newFullName && <p className="rp-preview-name">पूर्ण नवीन नाव: <b>{newFullName}</b></p>}
          </div>

          {/* Other Details */}
          <div className="rp-row-4">
            <div className="rp-field rp-field-wide">
              <label>नाव बदलण्याचे कारण <span className="rp-req">*</span></label>
              <select value={reason} onChange={e => setReason(e.target.value)}>
                <option value="">-- कारण निवडा --</option>
                {REASONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="rp-field">
              <label>मोबाईल <span className="rp-req">*</span></label>
              <input value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="98XXXXXXXX" />
            </div>
            <div className="rp-field">
              <label>पिन कोड <span className="rp-req">*</span></label>
              <input value={pincode} onChange={e => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="पिन कोड" />
            </div>
            <div className="rp-field">
              <label>आधार क्रमांक (Optional)</label>
              <input value={aadhaar} onChange={e => setAadhaar(e.target.value.replace(/\D/g, "").slice(0, 12))} placeholder="आधार क्रमांक" />
            </div>
          </div>

          {/* Location */}
          <div className="rp-row-3">
            <div className="rp-field">
              <label>जिल्हा <span className="rp-req">*</span></label>
              <select value={district} onChange={e => setDistrict(e.target.value)}>
                <option value="">--निवडा--</option>
                {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="rp-field">
              <label>तालुका</label>
              <input value={taluka} onChange={e => setTaluka(e.target.value)} placeholder="तालुका" />
            </div>
            <div className="rp-field">
              <label>गाव</label>
              <input value={village} onChange={e => setVillage(e.target.value)} placeholder="गाव" />
            </div>
          </div>

          <div className="rp-field" style={{ marginTop: 8 }}>
            <label>पूर्ण पत्ता (Auto Generated)</label>
            <textarea value={address || fullAddress} onChange={e => setAddress(e.target.value)} rows={2} />
          </div>

          <div style={{ textAlign: "center", marginTop: 20 }}>
            <button className="rp-submit-btn" onClick={handleSaveAndPrint} disabled={saving}>
              {saving ? "⏳ Save होत आहे..." : "💾 माहिती सेव्ह करा & प्रिंट करा"}
            </button>
          </div>
        </div>

        {/* History */}
        <SubmissionsList
          submissions={submissions}
          loading={loading}
          onPrint={handlePrintRecord}
          onDelete={deleteSubmission}
        />
      </div>
    </div>
  );
};

const thStyle: React.CSSProperties = { border: "1px solid #000", padding: "4px 8px", fontSize: 12, background: "#f5f5f5" };
const tdStyle: React.CSSProperties = { border: "1px solid #000", padding: "4px 8px", fontSize: 13 };

export default RajpatraMarathi;
