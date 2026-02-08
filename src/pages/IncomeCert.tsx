import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Landmark, Sun, Moon, Search, Plus, RotateCcw } from "lucide-react";
import { getThemeGradient } from "@/lib/themes";
import { useFormSubmissions } from "@/hooks/useFormSubmissions";
import SubmissionsList from "@/components/SubmissionsList";
import IncomeCertPrint from "@/components/IncomeCertPrint";
import type { FormSubmission } from "@/hooks/useFormSubmissions";
import { supabase } from "@/integrations/supabase/client";

const OCCUPATIONS = ["शेतमजुरी", "शेती", "व्यापार", "नोकरी", "मजुरी", "इतर"];
const REASONS = [
  "शिक्षणासाठी",
  "मुलांच्या शिक्षणासाठी",
  "मुलींच्या शिक्षणासाठी",
  "शासकीय कामासाठी",
  "अण्णासाहेब पाटील महामंडळ",
  "इतर",
];
const DISTRICTS = ["अमरावती", "नागपूर", "पुणे", "मुंबई", "औरंगाबाद", "नाशिक", "कोल्हापूर", "सोलापूर", "जळगाव", "अकोला", "बुलढाणा", "वाशिम", "यवतमाळ"];
const TALUKAS: Record<string, string[]> = {
  "अमरावती": ["अमरावती", "भातकुली", "नांदगाव खंडेश्वर", "मोर्शी", "वरुड", "अचलपूर", "चांदूर बाजार", "चांदूर रेल्वे", "धामणगाव रेल्वे", "तिवसा", "दर्यापूर", "अंजनगाव सुर्जी", "चिखलदरा", "धारणी"],
  "नागपूर": ["नागपूर शहर", "नागपूर ग्रामीण", "हिंगणा", "कामठी", "सावनेर", "पारशिवणी", "रामटेक", "मौदा", "उमरेड", "कुही", "काटोल", "नरखेड", "भिवापूर"],
  "पुणे": ["पुणे शहर", "हवेली", "मावळ", "मुळशी", "बारामती", "इंदापूर", "दौंड", "शिरूर", "जुन्नर", "आंबेगाव", "खेड", "भोर", "वेल्हे", "पुरंदर"],
};

const getCurrentFY = () => {
  const now = new Date();
  const y = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  return y;
};

const getFinancialYears = (count: number) => {
  const fy = getCurrentFY();
  const years: string[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const start = fy - i;
    years.push(`${start}-${String(start + 1).slice(2)}`);
  }
  return years;
};

const getTodayDate = () => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")} / ${String(d.getMonth() + 1).padStart(2, "0")} / ${d.getFullYear()}`;
};

const IncomeCert = () => {
  const navigate = useNavigate();
  const themeGradient = getThemeGradient();
  const [view, setView] = useState<"card" | "form" | "list">("card");
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");

  // Form fields
  const [firstName, setFirstName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [surname, setSurname] = useState("");
  const [age, setAge] = useState("");
  const [mobile, setMobile] = useState("");
  const [occupation, setOccupation] = useState(OCCUPATIONS[0]);
  const [hasFarm, setHasFarm] = useState("नाही");
  const [hectare, setHectare] = useState("");
  const [are, setAre] = useState("");

  // Address
  const [district, setDistrict] = useState("अमरावती");
  const [taluka, setTaluka] = useState("नांदगाव खंडेश्वर");
  const [village, setVillage] = useState("");
  const [place, setPlace] = useState("पापळ");

  // Other
  const [reason, setReason] = useState(REASONS[0]);
  const [yearType, setYearType] = useState<"1" | "3">("3");
  const [incomeData, setIncomeData] = useState<{ year: string; amount: string; words: string }[]>([]);
  const [aadhaar, setAadhaar] = useState("");

  // Photo & Signature
  const [photoUrl, setPhotoUrl] = useState("");
  const [signUrl, setSignUrl] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingSign, setUploadingSign] = useState(false);
  const photoRef = useRef<HTMLInputElement>(null);
  const signRef = useRef<HTMLInputElement>(null);

  const [saving, setSaving] = useState(false);
  const [printData, setPrintData] = useState<Record<string, any> | null>(null);
  const [printFormat, setPrintFormat] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const { submissions, loading, addSubmission, deleteSubmission } = useFormSubmissions("उत्पन्नाचे स्वयंघोषणापत्र");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  // Initialize income table when yearType changes
  useEffect(() => {
    const years = getFinancialYears(parseInt(yearType));
    setIncomeData(years.map((y) => ({ year: y, amount: "", words: "" })));
  }, [yearType]);

  const availableTalukas = TALUKAS[district] || [];

  const handleFileUpload = async (file: File, type: "photo" | "sign") => {
    const setter = type === "photo" ? setPhotoUrl : setSignUrl;
    const setUploading = type === "photo" ? setUploadingPhoto : setUploadingSign;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${type}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("documents").upload(path, file);
      if (error) { toast.error("Upload failed"); console.error(error); return; }
      const { data: urlData } = supabase.storage.from("documents").getPublicUrl(path);
      setter(urlData.publicUrl);
      toast.success(`${type === "photo" ? "फोटो" : "सही"} अपलोड झाला!`);
    } finally {
      setUploading(false);
    }
  };

  const validate = () => {
    if (!firstName.trim()) { toast.error("कृपया पहिले नाव भरा"); return false; }
    if (!fatherName.trim()) { toast.error("कृपया वडिलांचे/पतीचे नाव भरा"); return false; }
    if (!surname.trim()) { toast.error("कृपया आडनाव भरा"); return false; }
    if (!age.trim()) { toast.error("कृपया वय भरा"); return false; }
    if (!mobile.trim() || !/^\d{10}$/.test(mobile)) { toast.error("मोबाईल क्र. 10 अंकी असावा"); return false; }
    if (!village.trim()) { toast.error("कृपया गाव भरा"); return false; }
    if (aadhaar && !/^\d{12}$/.test(aadhaar)) { toast.error("आधार क्रमांक 12 अंकी असावा"); return false; }
    const hasIncome = incomeData.some((d) => d.amount.trim());
    if (!hasIncome) { toast.error("कृपया किमान एका वर्षाचे उत्पन्न भरा"); return false; }
    return true;
  };

  const getFullName = () => `${firstName} ${fatherName} ${surname}`.trim();

  const buildFormData = () => ({
    firstName, fatherName, surname, age, mobile, occupation, hasFarm, hectare, are,
    district, taluka, village, place, reason, yearType, incomeData, aadhaar,
    photoUrl, signUrl,
  });

  const handleSaveAndPrint = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const formData = buildFormData();
      const saved = await addSubmission(getFullName(), formData);
      if (!saved) { setSaving(false); return; }
    } finally {
      setSaving(false);
    }
    const data = { ...buildFormData(), name: getFullName() };
    setPrintData(data);
    setTimeout(() => window.print(), 300);
    // Reset
    setFirstName(""); setFatherName(""); setSurname(""); setAge(""); setMobile("");
    setOccupation(OCCUPATIONS[0]); setHasFarm("नाही"); setHectare(""); setAre("");
    setVillage(""); setReason(REASONS[0]); setAadhaar(""); setPhotoUrl(""); setSignUrl("");
    setIncomeData(getFinancialYears(parseInt(yearType)).map((y) => ({ year: y, amount: "", words: "" })));
  };

  const handlePrintRecord = (sub: FormSubmission) => {
    setPrintData({ ...sub.form_data, name: sub.applicant_name });
    setTimeout(() => window.print(), 200);
  };

  const updateIncome = (idx: number, field: "amount" | "words", val: string) => {
    setIncomeData((prev) => prev.map((d, i) => (i === idx ? { ...d, [field]: val } : d)));
  };

  const filteredSubmissions = submissions.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.applicant_name.toLowerCase().includes(q) ||
      (s.form_data?.mobile || "").toLowerCase().includes(q) ||
      (s.form_data?.village || "").toLowerCase().includes(q)
    );
  });

  const currentPrint = printData || { ...buildFormData(), name: getFullName() };

  return (
    <div className="dash-root">
      {/* Nav */}
      <nav className="dash-nav no-print" style={{ background: themeGradient }}>
        <div className="dash-nav-inner">
          <div className="dash-brand" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
            <div className="dash-brand-icon"><Landmark size={22} color="#fff" /></div>
            <div>
              <span className="dash-brand-title">SETU Suvidha</span>
              <span className="dash-brand-sub">सेतु सुविधा — महा ई-सेवा फॉर्म पोर्टल</span>
            </div>
          </div>
          <button className="theme-toggle" onClick={() => setDark(!dark)} aria-label="Toggle dark mode">
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </nav>

      {/* Back button */}
      <div className="no-print" style={{ padding: "12px 16px 0" }}>
        <button
          className="back-btn px-[9px] py-[7px] font-extralight font-sans shadow-sm rounded-sm"
          style={{ color: `hsl(var(--primary))` }}
          onClick={() => {
            if (view === "form") setView("card");
            else if (view === "list") setView("card");
            else navigate("/");
          }}
        >
          <ArrowLeft size={18} /> {view === "card" ? "डॅशबोर्ड वर परत जा" : "कार्ड वर परत जा"}
        </button>
      </div>

      {/* Main Content */}
      <div className="no-print" style={{ paddingTop: 0 }}>
        {view === "card" && (
          <div style={{ display: "flex", justifyContent: "center", paddingTop: 20 }}>
            <button
              className="dash-card hamipatra-hero-card"
              style={{ maxWidth: 240, padding: "32px 24px 24px", animationDelay: "0s" }}
              onClick={() => setView("form")}
            >
              <span className="dash-card-badge badge-ready">READY</span>
              <div className="dash-card-icon" style={{ background: "linear-gradient(135deg, #FCE7F3, #FBCFE8)", width: 64, height: 64 }}>
                <Landmark size={30} color="#DB2777" strokeWidth={1.8} />
              </div>
              <span className="dash-card-label" style={{ fontSize: 14 }}>उत्पन्नाचे स्वयंघोषणापत्र</span>
              <span style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", marginTop: 4 }}>फॉर्म भरण्यासाठी क्लिक करा →</span>
            </button>
          </div>
        )}

        {view === "form" && (
          <div className="inc-form-wrapper">
            <div className="form-container" style={{ maxWidth: 780, margin: "0 auto" }}>
              <div className="form-header" style={{ background: themeGradient }}>
                <h1 className="form-heading">उत्पन्नाचे स्वयंघोषणापत्र</h1>
                <p className="form-subheading">Income Self-Declaration Certificate</p>
              </div>
              <div className="form-body">
                {/* Section 1: Applicant Info */}
                <div className="inc-section-title">👤 अर्जदाराची माहिती</div>
                <div className="inc-form-grid">
                  <div className="inc-form-fields">
                    <div className="input-row-2">
                      <div className="input-group">
                        <label>पहिले नाव *</label>
                        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="पहिले नाव" />
                      </div>
                      <div className="input-group">
                        <label>वडिलांचे/पतीचे नाव *</label>
                        <input type="text" value={fatherName} onChange={(e) => setFatherName(e.target.value)} placeholder="वडिलांचे/पतीचे नाव" />
                      </div>
                    </div>
                    <div className="input-row-2">
                      <div className="input-group">
                        <label>आडनाव *</label>
                        <input type="text" value={surname} onChange={(e) => setSurname(e.target.value)} placeholder="आडनाव" />
                      </div>
                      <div className="input-group">
                        <label>वय *</label>
                        <input type="text" value={age} onChange={(e) => setAge(e.target.value.replace(/\D/g, "").slice(0, 3))} maxLength={3} inputMode="numeric" placeholder="वय" />
                      </div>
                    </div>
                    <div className="input-row-2">
                      <div className="input-group">
                        <label>मोबाईल *</label>
                        <input type="text" value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))} maxLength={10} inputMode="numeric" placeholder="10 अंकी क्र." />
                      </div>
                      <div className="input-group">
                        <label>व्यवसाय *</label>
                        <select value={occupation} onChange={(e) => setOccupation(e.target.value)} className="inc-select">
                          {OCCUPATIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="input-row-2">
                      <div className="input-group">
                        <label>शेती आहे का?</label>
                        <div className="inc-radio-row">
                          <label className="inc-radio-label">
                            <input type="radio" name="hasFarm" value="हो" checked={hasFarm === "हो"} onChange={() => setHasFarm("हो")} /> हो
                          </label>
                          <label className="inc-radio-label">
                            <input type="radio" name="hasFarm" value="नाही" checked={hasFarm === "नाही"} onChange={() => setHasFarm("नाही")} /> नाही
                          </label>
                        </div>
                      </div>
                      {hasFarm === "हो" && (
                        <div className="input-group" style={{ display: "flex", gap: 10 }}>
                          <div style={{ flex: 1 }}>
                            <label>H (हेक्टर)</label>
                            <input type="text" value={hectare} onChange={(e) => setHectare(e.target.value.replace(/\D/g, ""))} placeholder="H" inputMode="numeric" />
                          </div>
                          <div style={{ flex: 1 }}>
                            <label>R (आर)</label>
                            <input type="text" value={are} onChange={(e) => setAre(e.target.value.replace(/\D/g, ""))} placeholder="R" inputMode="numeric" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Document Upload (Right Side) */}
                  <div className="inc-doc-upload">
                    <div className="inc-upload-box">
                      <label>📷 फोटो निवडा</label>
                      <input ref={photoRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "photo")} />
                      <button className="inc-upload-btn" onClick={() => photoRef.current?.click()} disabled={uploadingPhoto}>
                        {uploadingPhoto ? "Uploading..." : photoUrl ? "✅ फोटो अपलोड" : "फोटो निवडा"}
                      </button>
                      {photoUrl && <img src={photoUrl} alt="Photo" className="inc-upload-preview" />}
                    </div>
                    <div className="inc-upload-box">
                      <label>✍️ सही निवडा</label>
                      <input ref={signRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "sign")} />
                      <button className="inc-upload-btn" onClick={() => signRef.current?.click()} disabled={uploadingSign}>
                        {uploadingSign ? "Uploading..." : signUrl ? "✅ सही अपलोड" : "सही निवडा"}
                      </button>
                      {signUrl && <img src={signUrl} alt="Signature" className="inc-upload-preview" />}
                    </div>
                  </div>
                </div>

                <hr className="section-divider" />

                {/* Section 2: Address */}
                <div className="inc-section-title">📍 पत्ता माहिती</div>
                <div className="input-row-2">
                  <div className="input-group">
                    <label>जिल्हा *</label>
                    <select value={district} onChange={(e) => { setDistrict(e.target.value); setTaluka(TALUKAS[e.target.value]?.[0] || ""); }} className="inc-select">
                      {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>तालुका *</label>
                    <select value={taluka} onChange={(e) => setTaluka(e.target.value)} className="inc-select">
                      {availableTalukas.length > 0 ? availableTalukas.map((t) => <option key={t} value={t}>{t}</option>) : <option value={taluka}>{taluka}</option>}
                    </select>
                  </div>
                </div>
                <div className="input-row-2">
                  <div className="input-group">
                    <label>गाव *</label>
                    <input type="text" value={village} onChange={(e) => setVillage(e.target.value)} placeholder="गावाचे नाव" />
                  </div>
                  <div className="input-group">
                    <label>ठिकाण</label>
                    <input type="text" value={place} onChange={(e) => setPlace(e.target.value)} placeholder="ठिकाण" />
                  </div>
                </div>

                <hr className="section-divider" />

                {/* Section 3: Income Details */}
                <div className="inc-section-title">💰 इतर तपशील</div>
                <div className="input-group">
                  <label>कारणाचे नाव *</label>
                  <select value={reason} onChange={(e) => setReason(e.target.value)} className="inc-select">
                    {REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div className="input-group">
                  <label>उत्पन्न तपशील *</label>
                  <div className="inc-radio-row">
                    <label className="inc-radio-label">
                      <input type="radio" name="yearType" value="1" checked={yearType === "1"} onChange={() => setYearType("1")} /> १ वर्ष
                    </label>
                    <label className="inc-radio-label">
                      <input type="radio" name="yearType" value="3" checked={yearType === "3"} onChange={() => setYearType("3")} /> ३ वर्षे
                    </label>
                  </div>
                </div>

                {/* Dynamic Income Table */}
                <div className="inc-income-table-wrap">
                  <table className="inc-income-table">
                    <thead>
                      <tr>
                        <th>आर्थिक वर्ष</th>
                        <th>उत्पन्न (अंकी) ₹</th>
                        <th>उत्पन्न (अक्षरी)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {incomeData.map((row, i) => (
                        <tr key={row.year}>
                          <td className="inc-fy-cell">{row.year}</td>
                          <td>
                            <input
                              type="text"
                              value={row.amount}
                              onChange={(e) => updateIncome(i, "amount", e.target.value.replace(/\D/g, ""))}
                              placeholder="₹"
                              inputMode="numeric"
                              className="inc-table-input"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={row.words}
                              onChange={(e) => updateIncome(i, "words", e.target.value)}
                              placeholder="अक्षरी"
                              className="inc-table-input"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="input-group" style={{ marginTop: 16 }}>
                  <label>आधार नंबर (ऐच्छिक)</label>
                  <input type="text" value={aadhaar} onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, "").slice(0, 12))} maxLength={12} inputMode="numeric" placeholder="12 अंकी आधार क्रमांक" />
                </div>

                <button className="submit-btn" style={{ background: themeGradient }} onClick={handleSaveAndPrint} disabled={saving}>
                  {saving ? "Saving..." : "💾 Save & Print / Save as PDF"}
                </button>
                <p className="form-footer-note">Data Supabase मध्ये Save होईल</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* History List */}
      {view !== "list" && (
        <div className="no-print" style={{ maxWidth: 900, margin: "20px auto", padding: "0 12px" }}>
          <div className="inc-history-header">
            <div className="inc-history-search">
              <Search size={16} className="dash-search-icon" />
              <input
                type="text"
                placeholder="नाव, गाव किंवा मोबाईल नंबर टाका..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="dash-search-input"
                style={{ paddingLeft: 38 }}
              />
            </div>
            <div className="inc-history-actions">
              <button className="inc-action-btn" onClick={() => setSearchQuery("")}>
                <RotateCcw size={14} /> Reset
              </button>
              <button className="inc-action-btn inc-action-btn-primary" onClick={() => setView("form")}>
                <Plus size={14} /> नवीन फॉर्म
              </button>
            </div>
          </div>
          <SubmissionsList
            submissions={filteredSubmissions}
            loading={loading}
            onDelete={deleteSubmission}
            onPrint={handlePrintRecord}
            columns={[
              { key: "mobile", label: "मोबाईल" },
              { key: "village", label: "गाव" },
            ]}
          />
        </div>
      )}

      <footer className="dash-footer no-print">© 2026 SETU Suvidha — सेतु सुविधा महा ई-सेवा पोर्टल</footer>

      {/* Print Output */}
      <IncomeCertPrint data={currentPrint} format={printFormat} onFormatChange={setPrintFormat} />
    </div>
  );
};

export default IncomeCert;
