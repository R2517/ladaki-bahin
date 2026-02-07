import { useState } from "react";
import { toast } from "sonner";

// CONFIGURE: Replace with your Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = "YOUR_GOOGLE_SCRIPT_URL_HERE";

const getTodayDate = () => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
};

const Index = () => {
  const [applicationNo, setApplicationNo] = useState("");
  const [name, setName] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);

  const taluka = "नांदगाव खंडेश्वर";
  const district = "अमरावती";
  const place = "पापळ";

  const handleSave = async () => {
    if (!name.trim() || !mobile.trim()) {
      toast.error("कृपया नाव आणि मोबाईल क्र. भरा");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        timestamp: new Date().toISOString(),
        applicationNumber: applicationNo,
        mobile,
        name,
        aadhaar,
        address,
        taluka,
        district,
        place,
      };

      const res = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
        {/* Header */}
        <div className="form-row" style={{ marginBottom: 12 }}>
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

        <h2 className="page-title">हमीपत्र</h2>

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
            style={{ width: "40%" }}
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

        {/* Taluka, District, State */}
        <div className="form-row">
          <label className="form-label">तालुका :</label>
          <span className="readonly-value">{taluka}</span>
          <label className="form-label" style={{ marginLeft: 24 }}>
            जिल्हा :
          </label>
          <span className="readonly-value">{district}</span>
          <label className="form-label" style={{ marginLeft: 24 }}>
            राज्य :
          </label>
          <span className="readonly-value">महाराष्ट्र</span>
        </div>

        <hr className="divider" />

        {/* Disclaimer */}
        <div className="disclaimer-content">
          <p>
            मी वर नमूद अर्जदार/अर्जदारिणी, खालील हमीपत्र स्वखुशीने व कोणत्याही
            दबावाशिवाय देत आहे:
          </p>
          <ol>
            <li>
              माझ्या अर्जामध्ये दिलेली सर्व माहिती व सादर केलेली कागदपत्रे खरी,
              अचूक व पूर्ण आहेत. कोणतीही माहिती खोटी अथवा दिशाभूल करणारी
              नसल्याची मी खात्री देतो/देते.
            </li>
            <li>
              सदर अर्ज मंजूर अथवा नामंजूर होण्याची कोणतीही हमी महा ई-सेवा केंद्र /
              CSC ऑपरेटर यांनी दिलेली नाही, याची मला पूर्ण जाणीव आहे.
            </li>
            <li>
              अर्जातील माहितीमध्ये कोणतीही त्रुटी, चूक अथवा खोटी माहिती
              आढळल्यास त्याची संपूर्ण जबाबदारी माझी असेल. महा ई-सेवा केंद्र /
              CSC ऑपरेटर यांना यासाठी जबाबदार धरता येणार नाही.
            </li>
            <li>
              शासनाचा अंतिम निर्णय मला मान्य असेल. अर्ज मंजूर अथवा नामंजूर
              करण्याचा अधिकार पूर्णपणे शासनाचा आहे.
            </li>
            <li>
              मी हे हमीपत्र स्वइच्छेने व पूर्ण समजूतदारीने देत आहे. यामध्ये
              कोणत्याही प्रकारची जबरदस्ती अथवा दबाव नाही.
            </li>
          </ol>
        </div>

        <hr className="divider" />

        {/* Footer */}
        <div className="footer-section">
          <div className="footer-row">
            <span>ठिकाण : {place}</span>
            <span>अर्जदाराची सही / अंगठा</span>
          </div>
          <div className="footer-row" style={{ marginTop: 8 }}>
            <span>दिनांक : {getTodayDate()}</span>
            <span>अर्जदाराचे नाव : {name || "_______________"}</span>
          </div>
        </div>
      </div>

      {/* Buttons - hidden on print */}
      <div className="no-print button-bar">
        <button
          className="action-btn"
          onClick={handleSave}
          disabled={saving}
        >
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
