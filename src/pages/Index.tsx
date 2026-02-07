import { useState } from "react";
import { toast } from "sonner";

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxKjtz4R68s1lDUU2FwDxaI_Sp3qTFUKROTwZ6UPDVHGouzleZ72yeJ41nHWLH3n2Sf/exec";

const getTodayDate = () => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")} / ${String(d.getMonth() + 1).padStart(2, "0")} / ${d.getFullYear()}`;
};

const Index = () => {
  const [applicationNo, setApplicationNo] = useState("");
  const [name, setName] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [taluka, setTaluka] = useState("नांदगाव खंडेश्वर");
  const [district, setDistrict] = useState("अमरावती");
  const [saving, setSaving] = useState(false);

  const place = "पापळ";

  const handleSave = async () => {
    if (!name.trim() || !mobile.trim()) {
      toast.error("कृपया नाव आणि मोबाईल क्र. भरा");
      return;
    }

    setSaving(true);
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          applicationNumber: applicationNo,
          mobile,
          name,
          aadhaar,
          address,
          taluka,
          district,
          place,
        }),
        mode: "no-cors",
      });

      toast.success("Data Google Sheet मध्ये Saved झाला आहे");
    } catch {
      toast.error("Data Save करताना Error आला. कृपया पुन्हा प्रयत्न करा.");
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => window.print();

  return (
    <div className="a4-page-wrapper">
      <div className="a4-page">
        {/* Header - Application Number */}
        <div className="form-row" style={{ marginBottom: 10 }}>
          <label className="form-label" style={{ whiteSpace: "nowrap" }}>
            लाडकी बहिण अर्ज नंबर :
          </label>
          <input
            type="text"
            className="form-input flex-1"
            value={applicationNo}
            onChange={(e) => setApplicationNo(e.target.value)}
            placeholder="NYS-09250861-669e9d814e4b79726"
          />
        </div>

        <hr className="divider" />

        {/* Title */}
        <h2 className="page-title">हमीपत्र व (Disclaimer)</h2>
        <h3 className="page-subtitle">
          लाडकी बहिण योजना – Re‑Verification / Grievance साठी
        </h3>

        <p className="intro-line">मी खाली सही करणारी,</p>

        {/* Name */}
        <div className="form-row">
          <label className="form-label">नाव :</label>
          <input
            type="text"
            className="form-input flex-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Aadhaar + Mobile */}
        <div className="form-row">
          <label className="form-label">आधार क्रमांक :</label>
          <input
            type="text"
            className="form-input"
            style={{ width: "38%" }}
            value={aadhaar}
            onChange={(e) => setAadhaar(e.target.value)}
          />
          <label className="form-label" style={{ marginLeft: 16 }}>
            मोबाईल क्र. :
          </label>
          <input
            type="text"
            className="form-input"
            style={{ width: "25%" }}
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
        </div>

        {/* Address */}
        <div className="form-row">
          <label className="form-label">राहणार :</label>
          <input
            type="text"
            className="form-input flex-1"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        {/* Taluka + District */}
        <div className="form-row">
          <label className="form-label">तालुका :</label>
          <span className="readonly-value">{taluka}</span>
          <label className="form-label" style={{ marginLeft: 24 }}>
            जिल्हा :
          </label>
          <span className="readonly-value">{district}</span>
        </div>

        {/* State */}
        <div className="form-row">
          <label className="form-label">राज्य :</label>
          <span className="readonly-value">महाराष्ट्र</span>
        </div>

        <p className="oath-line">
          याद्वारे सत्यप्रतिज्ञेवर खालीलप्रमाणे स्पष्ट व बिनशर्त हमी देते की —
        </p>

        {/* Disclaimer Content - exact from PDF */}
        <div className="disclaimer-content">
          <ol>
            <li>
              लाडकी बहिण योजना अंतर्गत माझा अर्ज भरताना / पुन्हा तपासणी
              (Re‑Verification) / तक्रार (Grievance) नोंद करताना, माझा अर्ज मंजूर
              (Approve) होईल किंवा नामंजूर (Reject) होईल, याची कोणतीही हमी नाही,
              याची मला पूर्ण जाणीव आहे.
            </li>
            <li>
              माझा अर्ज पूर्वी Reject झालेला असल्यास, किंवा भविष्यात
              कागदपत्रांतील त्रुटी, माहितीतील चूक, e-KYC समस्या, बँक
              तपशीलातील अडचण इत्यादी कारणांमुळे अर्ज Reject झाल्यास, त्याची
              पूर्ण जबाबदारी माझी स्वतःची राहील.
            </li>
            <li>
              या अर्जाच्या संदर्भात CSC / VLE / SETU केंद्र चालक, Maha e-Seva
              Kendra किंवा कर्मचारी यांच्यावर कुठल्याही कारची जबाबदारी, दोष
              किंवा गुन्हा लागू होणार नाही, यास मी पूर्णपणे सहमत आहे.
            </li>
            <li>
              संबंधित केंद्राकडून मला फक्त अर्ज / तक्रार नोंदणीची सुविधा
              देण्यात येत असून अर्ज मंजुरी, दुरुस्ती किंवा लाभ मिळण्याची
              कोणतीही हमी दिली जात नाही, हे मला मान्य आहे.
            </li>
            <li>
              मी सादर केलेली सर्व माहिती व कागदपत्रे माझ्या माहितीनुसार खरी व
              अचूक आहेत. खोटी किंवा चुकीची माहिती आढळल्यास शासन जे निर्णय
              घेईल, यास मी पूर्णतः जबाबदार राहीन.
            </li>
          </ol>
        </div>

        <p className="closing-line">
          वरील सर्व अटी मला समजलेल्या असून त्या मला मान्य आहेत, म्हणून हे
          हमीपत्र मी स्वेच्छेने देत आहे.
        </p>

        <hr className="divider" />

        {/* Footer */}
        <div className="footer-section">
          <div className="footer-row">
            <span>ठिकाण : {place}</span>
            <span>अर्जदाराची सही / अंगठा</span>
          </div>
          <div className="footer-row" style={{ marginTop: 10 }}>
            <span>दिनांक : {getTodayDate()}</span>
            <span>
              अर्जदाराचे नाव : {name || "_______________"}
            </span>
          </div>
        </div>
      </div>

      {/* Buttons - hidden on print */}
      <div className="no-print button-bar">
        <button className="action-btn" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Data"}
        </button>
        <button className="action-btn" onClick={handlePrint}>
          Print / Save as PDF
        </button>
      </div>
    </div>
  );
};

export default Index;
