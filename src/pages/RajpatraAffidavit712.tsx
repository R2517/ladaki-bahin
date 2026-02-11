import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, MapPin, Landmark, Sun, Moon } from "lucide-react";
import { getThemeGradient } from "@/lib/themes";
import { useFormSubmissions } from "@/hooks/useFormSubmissions";
import SubmissionsList from "@/components/SubmissionsList";
import type { FormSubmission } from "@/hooks/useFormSubmissions";

const DISTRICTS = ["अमरावती", "नागपूर", "पुणे", "मुंबई", "ठाणे", "नाशिक", "औरंगाबाद", "कोल्हापूर", "सोलापूर", "सांगली", "सातारा", "रत्नागिरी", "जळगाव", "धुळे", "नंदुरबार", "अहमदनगर", "बीड", "लातूर", "उस्मानाबाद", "परभणी", "हिंगोली", "नांदेड", "बुलढाणा", "अकोला", "वाशिम", "यवतमाळ", "वर्धा", "चंद्रपूर", "गडचिरोली", "भंडारा", "गोंदिया"];

const getTodayDate = () => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
};

const RajpatraAffidavit712 = () => {
  const navigate = useNavigate();
  const themeGradient = getThemeGradient();
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");
  const [saving, setSaving] = useState(false);
  const [printData, setPrintData] = useState<Record<string, any> | null>(null);

  const [oldName, setOldName] = useState("");
  const [newName, setNewName] = useState("");
  const [age, setAge] = useState("");
  const [occupation, setOccupation] = useState("");
  const [village, setVillage] = useState("");
  const [taluka, setTaluka] = useState("");
  const [district, setDistrict] = useState("");
  const [surveyNo, setSurveyNo] = useState("");
  const [mobile, setMobile] = useState("");

  const { submissions, loading, addSubmission, deleteSubmission } = useFormSubmissions("राजपत्र-७/१२");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const validate = () => {
    if (!oldName.trim()) { toast.error("चुकीचे नाव (7/12 वरील) भरा"); return false; }
    if (!newName.trim()) { toast.error("योग्य नाव भरा"); return false; }
    if (!age.trim()) { toast.error("वय भरा"); return false; }
    if (!village.trim()) { toast.error("गाव भरा"); return false; }
    if (!taluka.trim()) { toast.error("तालुका भरा"); return false; }
    if (!district) { toast.error("जिल्हा निवडा"); return false; }
    if (!surveyNo.trim()) { toast.error("सर्व्हे / गट नंबर भरा"); return false; }
    if (!mobile.trim() || !/^\d{10}$/.test(mobile)) { toast.error("मोबाईल क्र. 10 अंकी असावा"); return false; }
    return true;
  };

  const resetForm = () => {
    setOldName(""); setNewName(""); setAge(""); setOccupation("");
    setVillage(""); setTaluka(""); setDistrict(""); setSurveyNo(""); setMobile("");
  };

  const handleSaveAndPrint = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const formData = { oldName, newName, age, occupation, village, taluka, district, surveyNo, mobile, date: getTodayDate() };
      const saved = await addSubmission(newName, formData);
      if (!saved) { setSaving(false); return; }
      setPrintData(formData);
      setTimeout(() => { window.print(); resetForm(); }, 300);
    } finally { setSaving(false); }
  };

  const handlePrintRecord = (sub: FormSubmission) => {
    setPrintData({ ...sub.form_data });
    setTimeout(() => window.print(), 200);
  };

  // ===== PRINT VIEW (2 pages) =====
  if (printData) {
    return (
      <div className="rajpatra-print-page">
        <style>{`
          @media print {
            @page { size: A4 portrait; margin: 15mm 18mm 15mm 20mm; }
            body * { visibility: hidden !important; }
            .rajpatra-print-page, .rajpatra-print-page * { visibility: visible !important; }
            .rajpatra-print-page { position: absolute; left: 0; top: 0; width: 100%; }
            .no-print { display: none !important; }
            .rp712-box {
              border: 2px solid #000 !important; margin: 0 !important;
              padding: 28px 32px !important; page-break-after: always;
              width: 100% !important; max-width: 100% !important;
              min-height: calc(297mm - 30mm) !important;
              display: flex !important; flex-direction: column !important;
            }
            .rp712-box:last-of-type { page-break-after: auto; }
            .rp712-footer { margin-top: auto !important; padding-top: 20px; }
          }
          .rp712-box {
            max-width: 190mm; width: 190mm; margin: 24px auto; padding: 28px 32px;
            font-family: 'Noto Sans Devanagari', 'Mangal', serif;
            border: 2px solid #000; background: #fff; color: #000; line-height: 2;
            box-sizing: border-box; font-size: 14.5px; text-align: justify;
            display: flex; flex-direction: column;
          }
          .rp712-box + .rp712-box { margin-top: 30px; }
          .rp712-content { flex: 1; }
          .rp712-title { text-align: center; font-size: 30px; font-weight: 800; margin-bottom: 18px; letter-spacing: 2px; }
          .rp712-sub { font-size: 13px; text-align: center; font-style: italic; margin-bottom: 16px; color: #333; }
          .rp712-to { font-size: 14.5px; margin-bottom: 14px; line-height: 1.9; }
          .rp712-to p { margin: 3px 0; }
          .rp712-subject { font-size: 16px; font-weight: 800; margin: 16px 0 12px; }
          .rp712-body { font-size: 14.5px; margin-bottom: 12px; line-height: 2; }
          .rp712-list { margin: 10px 0 10px 28px; font-size: 14.5px; line-height: 2; }
          .rp712-list li { margin: 4px 0; }
          .rp712-ol { margin: 10px 0 10px 28px; font-size: 14.5px; line-height: 2; }
          .rp712-ol li { margin: 4px 0; }
          .rp712-footer { display: flex; justify-content: space-between; margin-top: auto; padding-top: 24px; font-size: 14.5px; }
          .rp712-footer p { margin: 3px 0; }
          .rp712-bold { font-weight: 700; }
          .rp712-info-row { display: flex; gap: 28px; flex-wrap: wrap; font-size: 14.5px; margin: 8px 0; line-height: 2; }
          .rp712-info-row span { white-space: nowrap; }
          .rp712-section-title { text-align: center; font-size: 20px; font-weight: 800; margin: 20px 0 14px; padding: 8px 0; border-top: 2px solid #000; border-bottom: 2px solid #000; }
        `}</style>

        {/* ===== PAGE 1: अर्ज ===== */}
        <div className="rp712-box">
          <div className="rp712-content">
            <div className="rp712-title">अर्ज</div>

            <div className="rp712-to">
              <p><b>प्रति,</b></p>
              <p>मा. विद्यमान कार्यकारी दंडाधिकारी साहेब,</p>
              <p>तहसील – <b>{printData.taluka}</b></p>
              <p>जिल्हा – <b>{printData.district}</b></p>
            </div>

            <p className="rp712-subject">विषय : 7/12 उताऱ्यावर चुकीचे नाव दुरुस्त करण्याबाबत अर्ज</p>

            <p className="rp712-body">महोदय,</p>

            <p className="rp712-body">
              मी खाली सही करणारा/करणारी, नम्रपणे अर्ज करतो/करते की, माझ्या शेतजमिनीच्या 7/12 उताऱ्यावर <b>नावामध्ये चूक झालेली आहे</b>. सदर चूक दुरुस्त करून <b>योग्य नाव नोंदविण्यात यावे</b>, ही नम्र विनंती आहे.
            </p>

            <p className="rp712-body">माझ्या शेतजमिनीचे तपशील पुढीलप्रमाणे आहेत –</p>

            <ul className="rp712-list">
              <li><b>गाव :</b> {printData.village}</li>
              <li><b>तालुका :</b> {printData.taluka}</li>
              <li><b>जिल्हा :</b> {printData.district}</li>
              <li><b>सर्व्हे नंबर / गट नंबर :</b> {printData.surveyNo}</li>
            </ul>

            <p className="rp712-body">सदर 7/12 उताऱ्यावर माझे नाव खालीलप्रमाणे चुकीच्या स्वरूपात नोंदलेले आहे –</p>
            <ul className="rp712-list" style={{ textAlign: "center", listStyle: "none", marginLeft: 0 }}>
              <li><b>चुकीचे नाव (7/12 वरील) :</b> {printData.oldName}</li>
            </ul>

            <p className="rp712-body">परंतु माझे योग्य व खरे नाव खालीलप्रमाणे आहे –</p>
            <ul className="rp712-list" style={{ textAlign: "center", listStyle: "none", marginLeft: 0 }}>
              <li><b>योग्य नाव (दुरुस्त करावयाचे) :</b> {printData.newName}</li>
            </ul>

            <p className="rp712-body">
              वरील नाव दुरुस्ती ही सादर केलेल्या <b>अधिकृत कागदपत्रांनुसार</b> करणे आवश्यक आहे. यासाठी मी माझ्या नावाचा <b>राजपत्र (Gazette Notification)</b> प्रकाशित केलेला असून, त्याची प्रत अर्जासोबत जोडलेली आहे.
            </p>

            <p className="rp712-body">सदर नाव दुरुस्ती करिता खालील कागदपत्रे अर्जासोबत सादर करीत आहे –</p>

            <ol className="rp712-ol">
              <li>नाव बदल / दुरुस्ती संबंधी <b>राजपत्राची प्रत</b></li>
              <li>आधार कार्ड</li>
              <li>पॅन कार्ड / इतर ओळखपत्र</li>
              <li>7/12 उताऱ्याची प्रत</li>
              <li>इतर संबंधित कागदपत्रे (असल्यास)</li>
            </ol>

            <p className="rp712-body">
              वरील सर्व कागदपत्रांनुसार माझ्या शेतजमिनीच्या 7/12 उताऱ्यावर <b>चुकीचे नाव दुरुस्त करून योग्य नाव नोंदविण्यात यावे</b>, ही नम्र विनंती. आपण या अर्जाचा सहानुभूतीपूर्वक विचार करून योग्य ती कार्यवाही करावी, ही विनंती.
            </p>

            <p className="rp712-body">धन्यवाद.</p>
          </div>

          <div className="rp712-footer">
            <div>
              <p><b>ठिकाण :</b> {printData.taluka}</p>
              <p><b>दिनांक :</b> {printData.date}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p><b>अर्जदाराचे नाव :</b> {printData.newName}</p>
              <p>सही : __________________________</p>
            </div>
          </div>
        </div>

        {/* ===== PAGE 2: शपथपत्र ===== */}
        <div className="rp712-box">
          <div className="rp712-content">
            <div className="rp712-title">शपथपत्र / प्रतिज्ञापत्र</div>
            <div className="rp712-sub">(7/12 उताऱ्यावर नाव दुरुस्ती करिता)</div>

            <div className="rp712-to">
              <p><b>मा. विद्यमान कार्यकारी दंडाधिकारी साहेब,</b></p>
              <p>तहसील – <b>{printData.taluka}</b>,</p>
              <p>जिल्हा – <b>{printData.district}</b></p>
            </div>

            <p className="rp712-body">मी खाली सही करणारा/करणारी,</p>

            <div className="rp712-info-row">
              <span><b>नाव :</b> {printData.newName}</span>
              <span><b>वय :</b> {printData.age} वर्षे</span>
              <span><b>व्यवसाय :</b> {printData.occupation || "—"}</span>
            </div>
            <div className="rp712-info-row">
              <span><b>रा. :</b> {printData.village}</span>
              <span><b>तालुका :</b> {printData.taluka}</span>
              <span><b>जिल्हा :</b> {printData.district}</span>
              <span><b>राज्य :</b> महाराष्ट्र</span>
            </div>

            <p className="rp712-body" style={{ marginTop: 10 }}>
              हा सत्यप्रतिज्ञेवर खालीलप्रमाणे शपथपूर्वक कथन करीत आहे की –
            </p>

            <p className="rp712-body">
              मी माझ्या शेतजमिनीच्या <b>7/12 उताऱ्यावर नाव दुरुस्ती करिता अर्ज</b> मा. विद्यमान कार्यकारी दंडाधिकारी साहेब, {printData.taluka} यांच्याकडे सादर केलेला आहे. सदर अर्जामध्ये नमूद केलेली सर्व माहिती, तपशील व निवेदन हे माझ्या <b>वैयक्तिक माहितीनुसार पूर्णतः खरे, अचूक व सत्य</b> आहेत.
            </p>

            <p className="rp712-body">
              माझ्या शेतजमिनीच्या 7/12 उताऱ्यावर <b>माझे नाव चुकीच्या स्वरूपात नोंदलेले आहे</b>, ते खालीलप्रमाणे –
            </p>

            <ul className="rp712-list" style={{ textAlign: "center", listStyle: "none", marginLeft: 0 }}>
              <li><b>चुकीचे नाव (7/12 वरील) :</b> {printData.oldName}</li>
            </ul>
            <p className="rp712-body">माझे योग्य व खरे नाव खालीलप्रमाणे आहे –</p>
            <ul className="rp712-list" style={{ textAlign: "center", listStyle: "none", marginLeft: 0 }}>
              <li><b>योग्य नाव (दुरुस्त करावयाचे) :</b> {printData.newName}</li>
            </ul>

            <p className="rp712-body">
              सदर नाव दुरुस्ती ही अर्जासोबत सादर केलेल्या <b>अधिकृत कागदपत्रांनुसार</b> करणे आवश्यक असून, यासाठी माझ्या नावाचा <b>राजपत्र (Gazette Notification)</b> प्रकाशित झालेला आहे व त्याची प्रत अर्जासोबत जोडलेली आहे. अर्जासोबत सादर केलेले सर्व कागदपत्रे (7/12 उतारा, राजपत्र, ओळखपत्रे इ.) ही <b>खरी, वैध व कोणताही फेरफार न केलेली</b> आहेत.
            </p>

            <p className="rp712-body">
              भविष्यात वरील माहितीपैकी कोणतीही माहिती <b>खोटी, चुकीची अथवा दिशाभूल करणारी</b> आढळल्यास, त्याबाबत होणाऱ्या सर्व <b>कायदेशीर कारवाईस मी स्वतः जबाबदार राहीन</b>. हे शपथपत्र मी कोणत्याही दबावाशिवाय, स्वेच्छेने व <b>पूर्ण शुद्धीत</b> देत आहे.
            </p>

            <div className="rp712-section-title">सत्यापन</div>

            <p className="rp712-body">
              मी, वरील शपथकर्ता, हे सत्यप्रतिज्ञेवर जाहीर करतो/करते की, वरील शपथपत्रातील सर्व मजकूर माझ्या माहितीनुसार <b>पूर्णतः खरा व सत्य</b> आहे. वरील माहिती खोटी आढळल्यास, मी <b>भा.दं.वि. कलम 193(2), 199 व 200</b> अन्वये शिक्षेस पात्र राहीन, याची मला पूर्ण जाणीव आहे. आज दिनांक <b>{printData.date}</b> रोजी समक्ष स्वाक्षरी करीत आहे.
            </p>
          </div>

          <div className="rp712-footer">
            <div>
              <p><b>ठिकाण :</b> {printData.taluka}</p>
              <p><b>दिनांक :</b> {printData.date}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p>सही : __________________________</p>
              <p><b>{printData.newName}</b></p>
            </div>
          </div>
        </div>

        <div className="no-print" style={{ textAlign: "center", marginTop: 20, display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={() => { window.print(); }} style={{
            padding: "10px 28px", background: "#16a34a", color: "#fff",
            border: "none", borderRadius: 8, cursor: "pointer", fontSize: 15, fontWeight: 600,
          }}>🖨️ पुन्हा प्रिंट करा</button>
          <button onClick={() => setPrintData(null)} style={{
            padding: "10px 28px", background: "hsl(var(--primary))", color: "#fff",
            border: "none", borderRadius: 8, cursor: "pointer", fontSize: 15, fontWeight: 600,
          }}>← फॉर्मवर परत जा</button>
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
              <span className="dash-brand-title">राजपत्र ७/१२ शपथपत्र</span>
              <span className="dash-brand-sub">Affidavit of 7/12</span>
            </div>
          </div>
          <button className="theme-toggle" onClick={() => setDark(!dark)}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
        </div>
      </nav>

      <div className="dash-content" style={{ maxWidth: 860, margin: "20px auto" }}>
        <div className="rp-form-card">
          <div className="rp-form-header" style={{ background: "linear-gradient(135deg, hsl(142 60% 40%), hsl(152 65% 45%))" }}>
            📝 ७/१२ उताऱ्यावर नाव दुरुस्ती — अर्ज व शपथपत्र
          </div>
          <p className="rp-form-note" style={{ color: "hsl(142 60% 35%)" }}>( हा फॉर्म मराठीतच भरावा )</p>

          {/* Old Name */}
          <div className="rp-section rp-section-old">
            <h4 className="rp-section-title">❌ चुकीचे नाव (7/12 वरील)</h4>
            <div className="rp-field" style={{ padding: 0 }}>
              <label>7/12 उताऱ्यावरील चुकीचे नाव <span className="rp-req">*</span></label>
              <input value={oldName} onChange={e => setOldName(e.target.value)} placeholder="7/12 वर नोंदलेले चुकीचे नाव" />
            </div>
          </div>

          {/* New Name */}
          <div className="rp-section rp-section-new">
            <h4 className="rp-section-title">✅ योग्य नाव (दुरुस्त करावयाचे)</h4>
            <div className="rp-field" style={{ padding: 0 }}>
              <label>योग्य व खरे नाव <span className="rp-req">*</span></label>
              <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="दुरुस्त करायचे योग्य नाव" className="rp-input-new" />
            </div>
          </div>

          {/* Personal Details */}
          <div className="rp-row-4">
            <div className="rp-field">
              <label>वय <span className="rp-req">*</span></label>
              <input value={age} onChange={e => setAge(e.target.value.replace(/\D/g, "").slice(0, 3))} placeholder="वय (वर्षे)" />
            </div>
            <div className="rp-field">
              <label>व्यवसाय</label>
              <input value={occupation} onChange={e => setOccupation(e.target.value)} placeholder="व्यवसाय" />
            </div>
            <div className="rp-field">
              <label>मोबाईल <span className="rp-req">*</span></label>
              <input value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="98XXXXXXXX" />
            </div>
            <div className="rp-field">
              <label>सर्व्हे / गट नंबर <span className="rp-req">*</span></label>
              <input value={surveyNo} onChange={e => setSurveyNo(e.target.value)} placeholder="सर्व्हे नंबर" />
            </div>
          </div>

          {/* Location */}
          <div className="rp-row-3" style={{ marginTop: 12 }}>
            <div className="rp-field">
              <label>गाव <span className="rp-req">*</span></label>
              <input value={village} onChange={e => setVillage(e.target.value)} placeholder="गाव" />
            </div>
            <div className="rp-field">
              <label>तालुका <span className="rp-req">*</span></label>
              <input value={taluka} onChange={e => setTaluka(e.target.value)} placeholder="तालुका" />
            </div>
            <div className="rp-field">
              <label>जिल्हा <span className="rp-req">*</span></label>
              <select value={district} onChange={e => setDistrict(e.target.value)}>
                <option value="">--निवडा--</option>
                {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: 20, paddingBottom: 4 }}>
            <button className="rp-submit-btn" style={{ background: "linear-gradient(135deg, hsl(142 60% 40%), hsl(152 65% 45%))" }} onClick={handleSaveAndPrint} disabled={saving}>
              {saving ? "⏳ Save होत आहे..." : "💾 माहिती सेव्ह करा & प्रिंट करा"}
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

export default RajpatraAffidavit712;
