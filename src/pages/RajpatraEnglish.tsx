import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Globe, Landmark, Sun, Moon } from "lucide-react";
import { getThemeGradient } from "@/lib/themes";
import { useFormSubmissions } from "@/hooks/useFormSubmissions";
import SubmissionsList from "@/components/SubmissionsList";
import type { FormSubmission } from "@/hooks/useFormSubmissions";

const REASONS = [
  "After Marriage",
  "Religious Conversion",
  "Personal Reason",
  "Name Correction",
  "Court Order",
  "Other",
];

const DISTRICTS = ["Amravati", "Nagpur", "Pune", "Mumbai", "Thane", "Nashik", "Aurangabad", "Kolhapur", "Solapur", "Sangli", "Satara", "Ratnagiri", "Jalgaon", "Dhule", "Nandurbar", "Ahmednagar", "Beed", "Latur", "Osmanabad", "Parbhani", "Hingoli", "Nanded", "Buldhana", "Akola", "Washim", "Yavatmal", "Wardha", "Chandrapur", "Gadchiroli", "Bhandara", "Gondia"];

const RajpatraEnglish = () => {
  const navigate = useNavigate();
  const themeGradient = getThemeGradient();
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
  // Other
  const [reason, setReason] = useState("");
  const [mobile, setMobile] = useState("");
  const [pincode, setPincode] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [district, setDistrict] = useState("");
  const [taluka, setTaluka] = useState("");
  const [village, setVillage] = useState("");
  const [address, setAddress] = useState("");

  const { submissions, loading, addSubmission, deleteSubmission } = useFormSubmissions("राजपत्र-english");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const oldFullName = [oldFirstName, oldFatherName, oldSurname].filter(Boolean).join(" ");
  const newFullName = [newFirstName, newFatherName, newSurname].filter(Boolean).join(" ");
  const fullAddress = [village, taluka, district, pincode].filter(Boolean).join(", ");

  const validate = () => {
    if (!oldFirstName.trim()) { toast.error("Enter Old First Name"); return false; }
    if (!oldSurname.trim()) { toast.error("Enter Old Surname"); return false; }
    if (!newFirstName.trim()) { toast.error("Enter New First Name"); return false; }
    if (!newSurname.trim()) { toast.error("Enter New Surname"); return false; }
    if (!reason) { toast.error("Select Reason for Name Change"); return false; }
    if (!mobile.trim() || !/^\d{10}$/.test(mobile)) { toast.error("Mobile must be 10 digits"); return false; }
    if (!pincode.trim() || !/^\d{6}$/.test(pincode)) { toast.error("Pincode must be 6 digits"); return false; }
    if (aadhaar && !/^\d{12}$/.test(aadhaar)) { toast.error("Aadhaar must be 12 digits"); return false; }
    if (!district) { toast.error("Select District"); return false; }
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
          maxWidth: 750, margin: "0 auto", padding: "30px 40px", fontFamily: "'Inter', sans-serif",
          border: "2px solid #000", background: "#fff", color: "#000", lineHeight: 1.8,
        }}>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <p style={{ fontSize: 16, fontWeight: 700, textTransform: "uppercase" }}>Government of Maharashtra</p>
            <p style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase" }}>Directorate of Government Printing, Stationery and Publication</p>
            <p style={{ fontSize: 16, fontWeight: 700, marginTop: 8, textTransform: "uppercase" }}>Form for Change of Name</p>
            <p style={{ fontSize: 15, fontWeight: 700, textTransform: "uppercase" }}>Notice</p>
          </div>

          <p style={{ fontSize: 11, fontStyle: "italic", marginBottom: 12 }}>
            <b>N.B-</b> (Instructions may be followed carefully before filling up this form. Only one word should be written in
            each space printed below. Please fill up this form in English version and in BLOCK LETTERS only)
          </p>

          <p style={{ fontSize: 13, marginBottom: 8 }}>
            <b>It is hereby notified that the undersigned has changed his/her name from</b>
          </p>

          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 12 }}>
            <thead>
              <tr>
                <th style={thStyle}></th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Father's/Husband's Name</th>
                <th style={thStyle}>Surname</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tdStyle}><b>Old Name</b></td>
                <td style={tdStyle}><b>{printData.oldFirstName?.toUpperCase()}</b></td>
                <td style={tdStyle}><b>{printData.oldFatherName?.toUpperCase()}</b></td>
                <td style={tdStyle}><b>{printData.oldSurname?.toUpperCase()}</b></td>
              </tr>
              <tr>
                <td style={tdStyle}><b>New Name</b></td>
                <td style={tdStyle}><b>{printData.newFirstName?.toUpperCase()}</b></td>
                <td style={tdStyle}><b>{printData.newFatherName?.toUpperCase()}</b></td>
                <td style={tdStyle}><b>{printData.newSurname?.toUpperCase()}</b></td>
              </tr>
            </tbody>
          </table>

          <p style={{ fontSize: 11, fontStyle: "italic", marginBottom: 16 }}>
            Note :- Government accepts no responsibility as to the authenticity of the contents of the notice. Since they are
            based entirely on the application of the concerned persons without verification of documents.
          </p>

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, margin: "20px 0" }}>
            <div>
              <p>Signature of the Guardian</p>
              <p style={{ fontSize: 11 }}>( In case of Minor )</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p>.............................................</p>
              <p style={{ fontSize: 11 }}>Signature in Old name/ Thumb Impression with Name and Date</p>
            </div>
          </div>

          <div style={{ margin: "24px 0" }}>
            <p style={{ fontSize: 13 }}>To</p>
            <p style={{ fontSize: 13 }}><b>THE DIRECTOR,</b></p>
            <p style={{ fontSize: 12, marginLeft: 20 }}>
              Government Printing, Stationery and Publications, Maharashtra, Mumbai 400 004.
            </p>
            <p style={{ fontSize: 12 }}>
              Kindly publish the above Notice in the next issue of the Maharashtra Government Gazette, Part II.
            </p>
          </div>

          <p style={{ fontSize: 13 }}>Reason for change of Name: <b>{printData.reason}</b></p>

          <div style={{ textAlign: "right", marginTop: 50, fontSize: 13 }}>
            <p>Signature in New Name/Thumb Impression with Name and Date,</p>
          </div>

          <div style={{ marginTop: 30, fontSize: 13, borderTop: "1px solid #000", paddingTop: 12 }}>
            <p><b>FOR CORRESPONDING ADDRESS:</b></p>
            <p>New Name : <b>{printData.newFullName?.toUpperCase()}</b></p>
            <p>Address : <b>{printData.fullAddress || printData.address}</b></p>
            <p>Pincode : <b>{printData.pincode}</b></p>
            <p>Mobile No : <b>{printData.mobile}</b></p>
            {printData.aadhaar && <p>Aadhaar No : <b>{printData.aadhaar}</b></p>}
          </div>
        </div>
        <div className="no-print" style={{ textAlign: "center", marginTop: 16 }}>
          <button onClick={() => setPrintData(null)} style={{
            padding: "10px 28px", background: "hsl(var(--primary))", color: "#fff",
            border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600,
          }}>← Back to Form</button>
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
            <button onClick={() => navigate("/rajpatra")} className="theme-toggle"><ArrowLeft size={18} /></button>
            <div className="dash-brand-icon"><Landmark size={22} color="#fff" /></div>
            <div>
              <span className="dash-brand-title">Rajpatra English</span>
              <span className="dash-brand-sub">Name Change (Gazette) Form</span>
            </div>
          </div>
          <button className="theme-toggle" onClick={() => setDark(!dark)}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
        </div>
      </nav>

      <div className="dash-content" style={{ maxWidth: 860, margin: "20px auto" }}>
        <div className="rp-form-card">
          <div className="rp-form-header rp-form-header-eng">📝 Name Change (Gazette) Form — English</div>
          <p className="rp-form-note">( Please fill this form in ENGLISH only )</p>

          {/* Old Name */}
          <div className="rp-section rp-section-old">
            <h4 className="rp-section-title">👤 1. Old Name</h4>
            <div className="rp-row-3">
              <div className="rp-field">
                <label>First Name <span className="rp-req">*</span></label>
                <input value={oldFirstName} onChange={e => setOldFirstName(e.target.value)} placeholder="Old First Name" />
              </div>
              <div className="rp-field">
                <label>Father's / Husband's Name</label>
                <input value={oldFatherName} onChange={e => setOldFatherName(e.target.value)} placeholder="Father's Name" />
              </div>
              <div className="rp-field">
                <label>Surname <span className="rp-req">*</span></label>
                <input value={oldSurname} onChange={e => setOldSurname(e.target.value)} placeholder="Surname" />
              </div>
            </div>
          </div>

          {/* New Name */}
          <div className="rp-section rp-section-new">
            <h4 className="rp-section-title">👤 2. New Name</h4>
            <div className="rp-row-3">
              <div className="rp-field">
                <label>First Name <span className="rp-req">*</span></label>
                <input value={newFirstName} onChange={e => setNewFirstName(e.target.value)} placeholder="New First Name" className="rp-input-new" />
              </div>
              <div className="rp-field">
                <label>Father's / Husband's Name</label>
                <input value={newFatherName} onChange={e => setNewFatherName(e.target.value)} placeholder="Father's Name" className="rp-input-new" />
              </div>
              <div className="rp-field">
                <label>Surname <span className="rp-req">*</span></label>
                <input value={newSurname} onChange={e => setNewSurname(e.target.value)} placeholder="Surname" className="rp-input-new" />
              </div>
            </div>
            {newFullName && <p className="rp-preview-name">Full New Name: <b>{newFullName}</b></p>}
          </div>

          {/* Other Details */}
          <div className="rp-row-4">
            <div className="rp-field rp-field-wide">
              <label>Reason for Name Change <span className="rp-req">*</span></label>
              <select value={reason} onChange={e => setReason(e.target.value)}>
                <option value="">-- Select Reason --</option>
                {REASONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="rp-field">
              <label>Mobile <span className="rp-req">*</span></label>
              <input value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="98XXXXXXXX" />
            </div>
            <div className="rp-field">
              <label>Pincode <span className="rp-req">*</span></label>
              <input value={pincode} onChange={e => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="Pincode" />
            </div>
            <div className="rp-field">
              <label>Aadhaar No (Optional)</label>
              <input value={aadhaar} onChange={e => setAadhaar(e.target.value.replace(/\D/g, "").slice(0, 12))} placeholder="Aadhaar Number" />
            </div>
          </div>

          {/* Location */}
          <div className="rp-row-3">
            <div className="rp-field">
              <label>District <span className="rp-req">*</span></label>
              <select value={district} onChange={e => setDistrict(e.target.value)}>
                <option value="">--Select--</option>
                {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="rp-field">
              <label>Taluka</label>
              <input value={taluka} onChange={e => setTaluka(e.target.value)} placeholder="Taluka" />
            </div>
            <div className="rp-field">
              <label>Village</label>
              <input value={village} onChange={e => setVillage(e.target.value)} placeholder="Village" />
            </div>
          </div>

          <div className="rp-field" style={{ marginTop: 8 }}>
            <label>Full Address (Auto Generated)</label>
            <textarea value={address || fullAddress} onChange={e => setAddress(e.target.value)} rows={2} />
          </div>

          <div style={{ textAlign: "center", marginTop: 20 }}>
            <button className="rp-submit-btn" onClick={handleSaveAndPrint} disabled={saving}>
              {saving ? "⏳ Saving..." : "💾 Save & Print"}
            </button>
          </div>
        </div>

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

export default RajpatraEnglish;
