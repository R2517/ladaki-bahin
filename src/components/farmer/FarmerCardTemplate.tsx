import { QRCodeSVG } from "qrcode.react";
import { Sprout } from "lucide-react";

export interface FarmerCardData {
  nameMarathi: string;
  nameEnglish: string;
  dateOfBirth: string;
  gender: string;
  mobile: string;
  aadhaar: string;
  farmerId: string;
  address: string;
  photoUrl: string;
  landHoldings: {
    district: string;
    taluka: string;
    village: string;
    gatNumber?: string;
    accountNumber?: string;
    areaHectares: string;
  }[];
  showAccountNumber?: boolean;
  issueDate?: string;
}

const maskAadhaar = (a: string) => {
  if (!a || a.length < 4) return a;
  return "XXXX XXXX " + a.slice(-4);
};

const formatDate = (d: string) => {
  if (!d) return "";
  const date = new Date(d);
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
};

const calcAge = (d: string) => {
  if (!d) return "";
  const birth = new Date(d);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  if (now.getMonth() < birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())) age--;
  return age;
};

/* ─── Standard ID card: 85.6mm × 53.98mm ─── */
const CARD_W = "85.6mm";
const CARD_H = "53.98mm";

/* Inline style objects — guaranteed to survive print & PDF */
const cardShell: React.CSSProperties = {
  width: CARD_W,
  height: CARD_H,
  position: "relative",
  background: "#fff",
  border: "2.5px solid #15803d",
  borderRadius: "10px",
  overflow: "hidden",
  fontFamily: "'Noto Sans Devanagari', 'Inter', sans-serif",
  WebkitPrintColorAdjust: "exact",
  printColorAdjust: "exact",
  colorAdjust: "exact",
  pageBreakInside: "avoid",
  boxSizing: "border-box",
};

const headerBar: React.CSSProperties = {
  background: "linear-gradient(to right, #15803d, #16a34a, #059669)",
  color: "#fff",
  padding: "3px 8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const footerBar: React.CSSProperties = {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  background: "#f0fdf4",
  borderTop: "1px solid #bbf7d0",
  padding: "2px 8px",
  display: "flex",
  justifyContent: "space-between",
  fontSize: "6.5pt",
  color: "#15803d",
};

const FarmerCardFront = ({ data }: { data: FarmerCardData }) => {
  const qrValue = `FARMER:${data.farmerId}|MOBILE:${data.mobile}|NAME:${data.nameEnglish}`;
  const issue = data.issueDate || new Date().toISOString().slice(0, 10);
  const validDate = new Date(issue);
  validDate.setFullYear(validDate.getFullYear() + 2);

  return (
    <div style={cardShell} className="farmer-id-card">
      {/* Green header bar */}
      <div style={headerBar}>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <Sprout size={13} style={{ color: "#fde047" }} />
          <span style={{ fontWeight: 700, fontSize: "8.5pt", letterSpacing: "0.3px" }}>शेतकरी ओळखपत्र</span>
        </div>
        <span style={{ fontSize: "7pt", fontWeight: 500, opacity: 0.9 }}>FARMER IDENTITY CARD</span>
      </div>

      {/* Body */}
      <div style={{ display: "flex", gap: "8px", padding: "5px 8px 0", position: "relative", zIndex: 1 }}>
        {/* Photo */}
        <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
          <div style={{
            width: "22mm", height: "26mm",
            border: "1.5px solid #16a34a", borderRadius: "4px",
            overflow: "hidden", background: "#f0fdf4",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {data.photoUrl ? (
              <img src={data.photoUrl} alt="Farmer" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <Sprout size={28} style={{ color: "#bbf7d0" }} />
            )}
          </div>
          <span style={{ fontSize: "5.5pt", color: "#15803d", fontWeight: 600 }}>{data.farmerId}</span>
        </div>

        {/* Details */}
        <div style={{ flex: 1, minWidth: 0, fontSize: "7.5pt", lineHeight: "11pt" }}>
          <div style={{ marginBottom: "1px" }}>
            <span style={{ fontWeight: 700, color: "#166534", fontSize: "9pt" }}>{data.nameMarathi}</span>
            <br />
            <span style={{ color: "#6b7280", fontSize: "7pt" }}>{data.nameEnglish}</span>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {[
                ["जन्मतारीख:", `${formatDate(data.dateOfBirth)} (वय: ${calcAge(data.dateOfBirth)})`],
                ["लिंग:", data.gender],
                ["मोबाईल:", data.mobile],
                ["आधार:", maskAadhaar(data.aadhaar)],
              ].map(([label, val]) => (
                <tr key={label}>
                  <td style={{ color: "#9ca3af", paddingRight: "3px", whiteSpace: "nowrap", fontSize: "7pt" }}>{label}</td>
                  <td style={{ fontWeight: 500, color: "#1f2937", fontSize: "7pt" }}>{val}</td>
                </tr>
              ))}
              <tr>
                <td style={{ color: "#9ca3af", paddingRight: "3px", whiteSpace: "nowrap", verticalAlign: "top", fontSize: "7pt" }}>पत्ता:</td>
                <td style={{ fontWeight: 500, color: "#1f2937", wordBreak: "break-word", fontSize: "6.5pt", lineHeight: "9pt" }}>{data.address}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* QR */}
        <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: "1px" }}>
          <div style={{ background: "#fff", padding: "2px", border: "1px solid #dcfce7", borderRadius: "3px" }}>
            <QRCodeSVG value={qrValue} size={48} level="M" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={footerBar}>
        <span>दिनांक: {formatDate(issue)}</span>
        <span>वैध: {formatDate(validDate.toISOString().slice(0, 10))}</span>
        <span style={{ fontWeight: 700 }}>SETU Suvidha</span>
      </div>
    </div>
  );
};

const FarmerCardBack = ({ data }: { data: FarmerCardData }) => {
  const totalArea = data.landHoldings.reduce((sum, l) => sum + (parseFloat(l.areaHectares) || 0), 0);
  const thCell: React.CSSProperties = {
    border: "1px solid #86efac", padding: "1px 3px", textAlign: "left",
    fontSize: "6.5pt", fontWeight: 700, color: "#166534", background: "#dcfce7",
  };
  const tdCell: React.CSSProperties = {
    border: "1px solid #bbf7d0", padding: "1px 3px", fontSize: "6.5pt", color: "#1f2937",
  };

  return (
    <div style={cardShell} className="farmer-id-card">
      {/* Header */}
      <div style={{ ...headerBar, justifyContent: "center" }}>
        <span style={{ fontWeight: 700, fontSize: "8pt" }}>जमिनीचा तपशील — Land Holdings</span>
      </div>

      {/* Table */}
      <div style={{ padding: "4px 6px 0", position: "relative", zIndex: 1 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thCell}>क्र.</th>
              <th style={thCell}>जिल्हा</th>
              <th style={thCell}>तालुका</th>
              <th style={thCell}>गाव</th>
              <th style={thCell}>गट नं.</th>
              {data.showAccountNumber && <th style={thCell}>खाते नं.</th>}
              <th style={{ ...thCell, textAlign: "right" }}>क्षेत्र (हे.)</th>
            </tr>
          </thead>
          <tbody>
            {data.landHoldings.slice(0, 6).map((l, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#f0fdf4" }}>
                <td style={tdCell}>{i + 1}</td>
                <td style={{ ...tdCell, maxWidth: "16mm", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.district?.split(" (")[0]}</td>
                <td style={{ ...tdCell, maxWidth: "14mm", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.taluka}</td>
                <td style={{ ...tdCell, maxWidth: "14mm", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.village}</td>
                <td style={tdCell}>{l.gatNumber || "-"}</td>
                {data.showAccountNumber && <td style={tdCell}>{l.accountNumber || "-"}</td>}
                <td style={{ ...tdCell, textAlign: "right" }}>{parseFloat(l.areaHectares).toFixed(2)}</td>
              </tr>
            ))}
            <tr>
              <td style={{ ...thCell, fontWeight: 700 }} colSpan={data.showAccountNumber ? 6 : 5}>
                एकूण क्षेत्र (Total Area)
              </td>
              <td style={{ ...thCell, textAlign: "right", fontWeight: 700 }}>{totalArea.toFixed(2)} हे.</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div style={footerBar}>
        <span>हे ओळखपत्र SETU Suvidha पोर्टलद्वारे तयार केले आहे.</span>
        <span style={{ fontWeight: 700, fontSize: "7pt" }}>setusuvidha.com</span>
      </div>
    </div>
  );
};

const FarmerCardTemplate = ({ data, id }: { data: FarmerCardData; id?: string }) => (
  <div id={id || "farmer-card"} className="farmer-card-wrapper" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
    <FarmerCardFront data={data} />
    <FarmerCardBack data={data} />
  </div>
);

export default FarmerCardTemplate;
