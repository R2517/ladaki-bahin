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
            .rp-print-box-eng { border: 2px solid #000 !important; margin: 15mm auto !important; }
          }
          .rp-print-box-eng {
            max-width: 170mm; width: 170mm; margin: 20px auto; padding: 28px 32px;
            font-family: 'Inter', sans-serif;
            border: 2px solid #000; background: #fff; color: #000; line-height: 1.6;
            box-sizing: border-box;
          }
          .rp-eng-logo-header { display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 10px; }
          .rp-eng-logo-header img { width: 56px; height: 56px; object-fit: contain; }
          .rp-eng-header-text { text-align: center; }
          .rp-eng-header-text h1 { font-size: 15px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin: 0; }
          .rp-eng-header-text h2 { font-size: 10px; font-weight: 700; text-transform: uppercase; margin: 2px 0 0; }
          .rp-eng-title-row { text-align: center; margin: 10px 0 8px; padding-bottom: 8px; border-bottom: 1.5px solid #333; }
          .rp-eng-title-row h3 { font-size: 14px; font-weight: 800; text-transform: uppercase; margin: 0; }
          .rp-eng-title-row h4 { font-size: 13px; font-weight: 700; text-transform: uppercase; margin: 2px 0 0; text-decoration: underline; }
          .rp-eng-notice { font-size: 9.5px; font-style: italic; margin-bottom: 8px; padding: 6px 8px; border-left: 2px solid #666; line-height: 1.45; text-align: justify; }
          .rp-eng-body { font-size: 11px; margin-bottom: 6px; text-align: justify; line-height: 1.5; }
          .rp-eng-table { width: 100%; border-collapse: collapse; margin: 8px 0; }
          .rp-eng-table th { border: 1.5px solid #333; padding: 4px 6px; font-size: 10px; background: #f4f4f4; font-weight: 700; text-align: center; }
          .rp-eng-table td { border: 1.5px solid #333; padding: 4px 6px; font-size: 11px; text-align: center; }
          .rp-eng-table td b { font-size: 12px; }
          .rp-eng-note { font-size: 9px; font-style: italic; margin: 8px 0; line-height: 1.4; text-align: justify; }
          .rp-eng-sig-row { display: flex; justify-content: space-between; margin: 14px 0; font-size: 10px; }
          .rp-eng-to { margin: 12px 0; font-size: 10px; line-height: 1.5; }
          .rp-eng-to p { margin: 1px 0; }
          .rp-eng-reason { font-size: 11px; margin: 10px 0; padding: 5px 8px; border: 1px dashed #666; }
          .rp-eng-signature { text-align: right; margin-top: 28px; font-size: 11px; }
          .rp-eng-address { margin-top: 16px; font-size: 10px; border-top: 1.5px solid #333; padding-top: 8px; line-height: 1.5; }
          .rp-eng-address p { margin: 1px 0; }
          .rp-eng-address b { font-size: 11px; }
        `}</style>
        <div className="rp-print-box-eng">
          {/* Logo + Header */}
          <div className="rp-eng-logo-header">
            <img src="/images/maharashtra-logo.png" alt="Government of Maharashtra" />
            <div className="rp-eng-header-text">
              <h1>Government of Maharashtra</h1>
              <h2>Directorate of Government Printing, Stationery and Publication</h2>
            </div>
          </div>
          <div className="rp-eng-title-row">
            <h3>Form for Change of Name</h3>
            <h4>Notice</h4>
          </div>

          <div className="rp-eng-notice">
            <b>N.B–</b> Instructions may be followed carefully before filling up this form. Only one word should be written in
            each space printed below. Please fill up this form in English version and in BLOCK LETTERS only.
          </div>

          <p className="rp-eng-body">
            <b>It is hereby notified that the undersigned has changed his/her name from</b>
          </p>

          <table className="rp-eng-table">
            <thead>
              <tr>
                <th style={{ width: "16%" }}></th>
                <th>Name</th>
                <th>Father's / Husband's Name</th>
                <th>Surname</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><b>Old Name</b></td>
                <td><b>{printData.oldFirstName?.toUpperCase()}</b></td>
                <td><b>{printData.oldFatherName?.toUpperCase()}</b></td>
                <td><b>{printData.oldSurname?.toUpperCase()}</b></td>
              </tr>
              <tr>
                <td><b>New Name</b></td>
                <td><b>{printData.newFirstName?.toUpperCase()}</b></td>
                <td><b>{printData.newFatherName?.toUpperCase()}</b></td>
                <td><b>{printData.newSurname?.toUpperCase()}</b></td>
              </tr>
            </tbody>
          </table>

          <p className="rp-eng-note">
            Note :– Government accepts no responsibility as to the authenticity of the contents of the notice. Since they are
            based entirely on the application of the concerned persons without verification of documents.
          </p>

          <div className="rp-eng-sig-row">
            <div>
              <p>Signature of the Guardian</p>
              <p>( In case of Minor )</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p>.............................................</p>
              <p>Signature in Old Name / Thumb Impression with Name and Date</p>
            </div>
          </div>

          <div className="rp-eng-to">
            <p>To</p>
            <p style={{ marginLeft: 20 }}><b>THE DIRECTOR,</b></p>
            <p style={{ marginLeft: 36 }}>
              Government Printing, Stationery and Publications, Maharashtra, Mumbai 400 004.
              Kindly publish the above Notice in the next issue of the Maharashtra Government Gazette, Part II.
            </p>
          </div>

          <div className="rp-eng-reason">
            Reason for change of Name : <b>{printData.reason}</b>
          </div>

          <div className="rp-eng-signature">
            <p>Signature in New Name / Thumb Impression with Name and Date,</p>
            <p style={{ marginTop: 24 }}>––––––––––––––––</p>
          </div>

          <div className="rp-eng-address">
            <p><b>FOR CORRESPONDING ADDRESS :</b></p>
            <p>New Name : <b>{printData.newFullName?.toUpperCase()}</b></p>
            <p>Address : <b>{printData.fullAddress || printData.address}</b></p>
            <p>Pincode : <b>{printData.pincode}</b></p>
            <p>Mobile No. : <b>{printData.mobile}</b></p>
            {printData.aadhaar && <p>Aadhaar No. : <b>{printData.aadhaar}</b></p>}
          </div>
        </div>
        <div className="no-print" style={{ textAlign: "center", marginTop: 20, display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={() => { window.print(); }} style={{
            padding: "10px 28px", background: "#16a34a", color: "#fff",
            border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600,
          }}>🖨️ Print Again</button>
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
