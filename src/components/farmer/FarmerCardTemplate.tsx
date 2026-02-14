import { QRCodeSVG } from "qrcode.react";
import { Phone } from "lucide-react";

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

// ─── Helpers ──────────────────────────────────────────────
const maskAadhaar = (a: string) => {
  if (!a || a.length < 4) return a;
  return "XXXX-XXXX-" + a.slice(-4);
};

const formatDate = (d: string) => {
  if (!d) return "";
  const date = new Date(d);
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
};

// ─── Standard ID card: 85.6mm × 53.98mm (CR80) ────────────
const CARD_W = "85.6mm";
const CARD_H = "53.98mm";

// ─── Shared card shell style ───────────────────────────────
const cardShell: React.CSSProperties = {
  width: CARD_W,
  height: CARD_H,
  position: "relative",
  background: "linear-gradient(160deg, #ffffff 0%, #fff9f0 40%, #fff5e6 100%)",
  border: "1.5px solid #d4af37",
  borderRadius: "3mm",
  overflow: "hidden",
  fontFamily: "'Noto Sans Devanagari', 'Inter', sans-serif",
  WebkitPrintColorAdjust: "exact",
  printColorAdjust: "exact",
  colorAdjust: "exact",
  pageBreakInside: "avoid",
  boxSizing: "border-box",
};

// ─── Inline AgriStack Logo SVG ─────────────────────────────
const AgriStackLogo = ({ size = 40 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="48" fill="#f0fdf4" stroke="#16a34a" strokeWidth="2"/>
    <path d="M50 18 C45 28, 35 35, 30 50 C25 65, 35 80, 50 82 C65 80, 75 65, 70 50 C65 35, 55 28, 50 18Z" fill="#16a34a" opacity="0.15"/>
    <path d="M50 25 L50 70" stroke="#15803d" strokeWidth="3" strokeLinecap="round"/>
    <path d="M50 35 C42 30, 32 32, 30 40" stroke="#16a34a" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <path d="M50 45 C58 40, 68 42, 70 50" stroke="#16a34a" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <path d="M50 55 C42 50, 32 52, 30 60" stroke="#22c55e" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <ellipse cx="50" cy="22" rx="4" ry="6" fill="#16a34a"/>
    <ellipse cx="43" cy="27" rx="3" ry="5" fill="#22c55e" transform="rotate(-30 43 27)"/>
    <ellipse cx="57" cy="27" rx="3" ry="5" fill="#22c55e" transform="rotate(30 57 27)"/>
    <text x="50" y="94" textAnchor="middle" fontSize="10" fontWeight="700" fill="#d4af37" fontFamily="Inter, sans-serif">AgriStack</text>
  </svg>
);

// ─── Wheat Pattern Background SVG ──────────────────────────
const WheatPattern = ({ opacity = 0.12 }: { opacity?: number }) => (
  <svg
    style={{ position: "absolute", bottom: 0, left: 0, right: 0, width: "100%", height: "60%", opacity, pointerEvents: "none", zIndex: 0 }}
    viewBox="0 0 400 150" preserveAspectRatio="xMidYMax slice" fill="none" xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#daa520" stopOpacity="0.6"/>
        <stop offset="100%" stopColor="#b8860b" stopOpacity="1"/>
      </linearGradient>
    </defs>
    {/* Wheat stalks */}
    {[40, 80, 130, 175, 220, 265, 310, 355].map((x, i) => (
      <g key={i} transform={`translate(${x},0) rotate(${(i % 2 === 0 ? -3 : 3)}, 0, 150)`}>
        <line x1="0" y1="150" x2="0" y2="30" stroke="url(#wg)" strokeWidth="2"/>
        <ellipse cx="-4" cy="35" rx="3.5" ry="8" fill="url(#wg)" transform="rotate(-25 -4 35)"/>
        <ellipse cx="4" cy="28" rx="3.5" ry="8" fill="url(#wg)" transform="rotate(25 4 28)"/>
        <ellipse cx="-4" cy="48" rx="3" ry="7" fill="url(#wg)" transform="rotate(-20 -4 48)"/>
        <ellipse cx="4" cy="42" rx="3" ry="7" fill="url(#wg)" transform="rotate(20 4 42)"/>
        <ellipse cx="-3" cy="60" rx="2.5" ry="6" fill="url(#wg)" transform="rotate(-15 -3 60)"/>
        <ellipse cx="3" cy="55" rx="2.5" ry="6" fill="url(#wg)" transform="rotate(15 3 55)"/>
        <ellipse cx="0" cy="22" rx="3" ry="7" fill="url(#wg)"/>
      </g>
    ))}
    {/* Ground line */}
    <path d="M0 140 Q50 130, 100 138 Q150 146, 200 135 Q250 125, 300 137 Q350 148, 400 133" stroke="#d4af37" strokeWidth="1" opacity="0.4" fill="none"/>
    <rect x="0" y="142" width="400" height="10" fill="#d4af37" opacity="0.08"/>
  </svg>
);

// ═══════════════════════════════════════════════════════════
// FRONT SIDE — Inspired by Image 1 reference
// ═══════════════════════════════════════════════════════════
const FarmerCardFront = ({ data }: { data: FarmerCardData }) => {
  const qrData = JSON.stringify({
    fid: data.farmerId,
    name: data.nameEnglish,
    mobile: data.mobile,
    village: data.landHoldings?.[0]?.village || "",
  });
  const village = data.landHoldings?.[0]?.village || "";
  const district = data.landHoldings?.[0]?.district?.split(" (")[0] || "";

  return (
    <div style={cardShell} className="farmer-id-card">
      <WheatPattern opacity={0.12} />

      {/* ── Header: Logo + Title ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "2.5mm 3mm 1mm", position: "relative", zIndex: 1,
      }}>
        <AgriStackLogo size={36} />
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "11pt", fontWeight: 800, color: "#1a5f3a", letterSpacing: "0.5px", lineHeight: 1.1 }}>
            FARMER ID CARD
          </div>
          <div style={{ fontSize: "8.5pt", fontWeight: 600, color: "#1a5f3a", opacity: 0.85 }}>
            शेतकरी ओळखपत्र
          </div>
        </div>
      </div>

      {/* ── Name Section ── */}
      <div style={{ padding: "0 3mm", position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: "12pt", fontWeight: 700, color: "#000", lineHeight: 1.15 }}>
          {data.nameEnglish}
        </div>
        <div style={{ fontSize: "9.5pt", fontWeight: 600, color: "#333", marginTop: "0.5mm" }}>
          {data.nameMarathi}
        </div>
      </div>

      {/* ── Body: Photo + Details + QR ── */}
      <div style={{
        display: "flex", alignItems: "flex-start", gap: "3mm",
        padding: "1.5mm 3mm 0", position: "relative", zIndex: 1,
      }}>
        {/* Photo */}
        <div style={{
          width: "18mm", height: "22mm", flexShrink: 0,
          border: "1px solid #1a5f3a", borderRadius: "2mm",
          overflow: "hidden", background: "#f5f5f0",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {data.photoUrl ? (
            <img src={data.photoUrl} alt="Photo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <svg width="20" height="24" viewBox="0 0 20 24" fill="none"><circle cx="10" cy="7" r="5" fill="#ccc"/><path d="M0 22 C0 16, 5 13, 10 13 C15 13, 20 16, 20 22" fill="#ccc"/></svg>
          )}
        </div>

        {/* Details column */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "10pt", fontWeight: 700, fontFamily: "'Courier New', monospace", color: "#000", letterSpacing: "0.5px" }}>
            FID-{data.farmerId}
          </div>
          <div style={{ fontSize: "8.5pt", fontFamily: "'Courier New', monospace", color: "#333", marginTop: "1mm" }}>
            {maskAadhaar(data.aadhaar)}
          </div>
          <div style={{ fontSize: "7.5pt", color: "#666", marginTop: "1.5mm" }}>
            {village}{district ? `, ${district}` : ""}
          </div>
        </div>

        {/* QR Code */}
        <div style={{
          flexShrink: 0, background: "#fff", padding: "1.5mm",
          border: "1px solid #ccc", borderRadius: "2mm",
        }}>
          <QRCodeSVG value={qrData} size={56} level="H" />
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 1,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "1mm 3mm", fontSize: "5.5pt", color: "#888",
      }}>
        <span>Issue: {formatDate(data.issueDate || new Date().toISOString().slice(0, 10))}</span>
        <span style={{ fontWeight: 600, color: "#1a5f3a", fontSize: "6pt" }}>SETU Suvidha</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// BACK SIDE — Land details + disclaimer
// ═══════════════════════════════════════════════════════════
const FarmerCardBack = ({ data }: { data: FarmerCardData }) => {
  const totalArea = data.landHoldings.reduce((sum, l) => sum + (parseFloat(l.areaHectares) || 0), 0);

  const thStyle: React.CSSProperties = {
    border: "1px solid #ccc", padding: "1mm 1.5mm", textAlign: "center",
    fontSize: "6pt", fontWeight: 700, color: "#1a5f3a", background: "#e8f5e9",
    lineHeight: 1.25,
  };
  const tdStyle: React.CSSProperties = {
    border: "1px solid #ddd", padding: "0.8mm 1.5mm", textAlign: "center",
    fontSize: "6pt", color: "#333",
  };

  return (
    <div style={{ ...cardShell, background: "linear-gradient(160deg, #ffffff 0%, #fafaf5 100%)" }} className="farmer-id-card">
      <WheatPattern opacity={0.07} />

      {/* ── Header ── */}
      <div style={{
        textAlign: "center", padding: "2mm 3mm 1.5mm",
        borderBottom: "1px solid #d4af37", position: "relative", zIndex: 1,
      }}>
        <div style={{ fontSize: "9pt", fontWeight: 700, color: "#1a5f3a" }}>
          जमिनीची माहिती / Land Details
        </div>
      </div>

      {/* ── Land Table ── */}
      <div style={{ padding: "1.5mm 2.5mm 0", position: "relative", zIndex: 1 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", borderRadius: "2mm" }}>
          <thead>
            <tr>
              <th style={thStyle}>जिल्हा<br/><span style={{ fontWeight: 400, fontSize: "5pt" }}>District</span></th>
              <th style={thStyle}>तालुका<br/><span style={{ fontWeight: 400, fontSize: "5pt" }}>Taluka</span></th>
              <th style={thStyle}>गाव<br/><span style={{ fontWeight: 400, fontSize: "5pt" }}>Village</span></th>
              <th style={thStyle}>गट नं.<br/><span style={{ fontWeight: 400, fontSize: "5pt" }}>Survey</span></th>
              {data.showAccountNumber && <th style={thStyle}>खाते</th>}
              <th style={{ ...thStyle, textAlign: "right" }}>हेक्टर<br/><span style={{ fontWeight: 400, fontSize: "5pt" }}>Hectares</span></th>
            </tr>
          </thead>
          <tbody>
            {data.landHoldings.slice(0, 4).map((l, i) => (
              <tr key={i} style={{ background: i % 2 === 1 ? "#f9f9f6" : "#fff" }}>
                <td style={{ ...tdStyle, maxWidth: "15mm", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.district?.split(" (")[0]}</td>
                <td style={{ ...tdStyle, maxWidth: "13mm", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.taluka}</td>
                <td style={{ ...tdStyle, maxWidth: "13mm", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.village}</td>
                <td style={tdStyle}>{l.gatNumber || "-"}</td>
                {data.showAccountNumber && <td style={tdStyle}>{l.accountNumber || "-"}</td>}
                <td style={{ ...tdStyle, textAlign: "right", fontWeight: 600 }}>{parseFloat(l.areaHectares).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total */}
        <div style={{
          textAlign: "center", fontSize: "8pt", fontWeight: 700, color: "#1a5f3a",
          marginTop: "1.5mm",
        }}>
          Total Land: {totalArea.toFixed(2)} Hectares
        </div>
      </div>

      {/* ── Disclaimer ── */}
      <div style={{
        margin: "1.5mm 2.5mm 0", padding: "1.5mm 2mm",
        background: "#fffbf0", border: "1px dashed #d4af37", borderRadius: "1.5mm",
        textAlign: "center", position: "relative", zIndex: 1,
      }}>
        <div style={{ fontSize: "5.5pt", fontStyle: "italic", color: "#666", lineHeight: 1.3 }}>
          वैयक्तिक वापरासाठी, सरकारी ओळखपत्र नाही
        </div>
        <div style={{ fontSize: "5pt", fontStyle: "italic", color: "#888" }}>
          For personal use only. Not a government-issued ID
        </div>
      </div>

      {/* ── Footer: Logo + Mobile ── */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 1,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "1mm 3mm",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5mm" }}>
          <AgriStackLogo size={18} />
          <span style={{ fontSize: "5.5pt", fontWeight: 600, color: "#1a5f3a" }}>SETU Suvidha</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1mm", fontSize: "6pt", color: "#333" }}>
          <Phone size={8} style={{ color: "#1a5f3a" }} />
          <span>+91-{data.mobile}</span>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// WRAPPER
// ═══════════════════════════════════════════════════════════
const FarmerCardTemplate = ({ data, id }: { data: FarmerCardData; id?: string }) => (
  <div
    id={id || "farmer-card"}
    className="farmer-card-wrapper"
    style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}
  >
    <FarmerCardFront data={data} />
    <FarmerCardBack data={data} />
  </div>
);

export default FarmerCardTemplate;
