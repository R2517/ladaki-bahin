interface IncomeRow {
  year: string;
  amount: string;
  words: string;
}

interface IncomeCertPrintProps {
  data: Record<string, any>;
  format: number;
  onFormatChange: (f: number) => void;
}

const getTodayDate = () => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")} / ${String(d.getMonth() + 1).padStart(2, "0")} / ${d.getFullYear()}`;
};

const fullName = (d: Record<string, any>) =>
  d.name || `${d.firstName || ""} ${d.fatherName || ""} ${d.surname || ""}`.trim();

const IncomeCertPrint = ({ data, format, onFormatChange }: IncomeCertPrintProps) => {
  const d = data;
  const incomeData: IncomeRow[] = d.incomeData || [];
  const name = fullName(d);
  const place = d.place || "पापळ";
  const taluka = d.taluka || "नांदगाव खंडेश्वर";
  const district = d.district || "अमरावती";

  return (
    <>
      {/* Format Selector Sidebar - visible in print */}
      <div className="print-only inc-print-sidebar no-print-content">
        <div className="inc-format-selector">
          <span className="inc-format-title">📄 Print Format</span>
          {[
            { id: 1, label: "फॉर्मॅट 1 - ३ वर्षे (नवीन)" },
            { id: 2, label: "फॉर्मॅट 2 - १ वर्ष (नवीन)" },
            { id: 3, label: "फॉर्मॅट 3 - जुना" },
            { id: 4, label: "भूमीहीन प्रमाणपत्र" },
          ].map((f) => (
            <button
              key={f.id}
              className={`inc-format-btn ${format === f.id ? "active" : ""}`}
              onClick={() => onFormatChange(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Format 1: 3 Year (New) */}
      {format === 1 && (
        <div className="print-only a4-page inc-print-page">
          <h2 className="print-title" style={{ textDecoration: "none", fontSize: 16 }}>उत्पन्न अहवाल स्वयंघोषणापत्र</h2>
          <p style={{ textAlign: "center", fontSize: 11, marginBottom: 8 }}>(शासन निर्णय क्र. सीबीसी-२०२२/प्र.क्र.३८/विनियमन, दि. ०१/०४/२०२३ अन्वये)</p>
          <hr className="print-divider" />
          <p style={{ textAlign: "justify", lineHeight: 1.8 }}>
            मी, <strong>{name}</strong>, वय <strong>{d.age || "___"}</strong> वर्षे, व्यवसाय <strong>{d.occupation || "___"}</strong>,
            राहणार गाव/शहर <strong>{d.village || "___"}</strong>, तालुका <strong>{taluka}</strong>, जिल्हा <strong>{district}</strong>,
            राज्य महाराष्ट्र, {d.reason || "शिक्षणासाठी"} उत्पन्नाचे स्वयंघोषणापत्र सादर करीत आहे.
          </p>

          <p style={{ fontWeight: 700, margin: "14px 0 6px" }}>कुटुंबातील सर्व सदस्यांचे एकत्रित वार्षिक उत्पन्न खालीलप्रमाणे आहे:</p>
          <table className="inc-print-table">
            <thead>
              <tr>
                <th>अ.क्र.</th>
                <th>आर्थिक वर्ष</th>
                <th>वार्षिक उत्पन्न (₹ अंकी)</th>
                <th>वार्षिक उत्पन्न (अक्षरी)</th>
              </tr>
            </thead>
            <tbody>
              {incomeData.map((row, i) => (
                <tr key={row.year}>
                  <td style={{ textAlign: "center" }}>{i + 1}</td>
                  <td>{row.year}</td>
                  <td>₹ {row.amount || "____________"}</td>
                  <td>{row.words || "____________"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {d.hasFarm === "हो" && (
            <p style={{ marginTop: 8 }}>शेतजमीन: <strong>{d.hectare || "___"}</strong> हेक्टर <strong>{d.are || "___"}</strong> आर</p>
          )}

          <p style={{ textAlign: "justify", marginTop: 12 }}>
            मी प्रतिज्ञापूर्वक सांगतो/सांगते की, वरील माहिती माझ्या माहितीनुसार खरी व अचूक आहे.
            खोटी माहिती दिल्यास कायदेशीर कारवाई होऊ शकते, याची मला जाणीव आहे.
          </p>

          <hr className="print-divider" />

          {/* प्रपत्र-अ Section */}
          <h3 style={{ textAlign: "center", fontSize: 15, fontWeight: 700, margin: "12px 0 4px", textDecoration: "underline" }}>प्रपत्र-अ (स्वयंघोषणापत्र)</h3>
          <p style={{ textAlign: "center", fontSize: 10, marginBottom: 10 }}>(शासन निर्णय दि. ०१/०४/२०२३ अन्वये)</p>

          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
            {d.photoUrl ? (
              <img src={d.photoUrl} alt="Photo" style={{ width: 90, height: 110, objectFit: "cover", border: "1px solid #000" }} />
            ) : (
              <div style={{ width: 90, height: 110, border: "1px solid #000", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>फोटो</div>
            )}
          </div>

          <p style={{ textAlign: "justify", lineHeight: 1.8 }}>
            मी, <strong>{name}</strong>, वय <strong>{d.age || "___"}</strong> वर्षे,
            राहणार गाव <strong>{d.village || "___"}</strong>, ता. <strong>{taluka}</strong>,
            जि. <strong>{district}</strong>, सत्यप्रतिज्ञेवर घोषित करतो/करते की, माझ्या कुटुंबाचे
            सर्व मार्गांद्वारे मिळणारे एकूण वार्षिक उत्पन्न वरील तक्त्यानुसार आहे.
          </p>

          <div className="print-footer" style={{ marginTop: 40 }}>
            <div className="print-footer-row">
              <span>ठिकाण: {place}</span>
              <div style={{ textAlign: "center" }}>
                {d.signUrl ? (
                  <img src={d.signUrl} alt="Sign" style={{ width: 120, height: 50, objectFit: "contain" }} />
                ) : (
                  <span>___________________</span>
                )}
                <br />
                <span>अर्जदाराची सही / अंगठा</span>
              </div>
            </div>
            <div className="print-footer-row" style={{ marginTop: 10 }}>
              <span>दिनांक: {getTodayDate()}</span>
              <span>नाव: {name || "_______________"}</span>
            </div>
            {d.aadhaar && (
              <div className="print-footer-row" style={{ marginTop: 6 }}>
                <span>आधार क्र.: {d.aadhaar}</span>
                <span>मोबाईल: {d.mobile || "___"}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Format 2: 1 Year (New) */}
      {format === 2 && (
        <div className="print-only a4-page inc-print-page">
          <h2 className="print-title" style={{ textDecoration: "none", fontSize: 16 }}>उत्पन्न अहवाल स्वयंघोषणापत्र</h2>
          <p style={{ textAlign: "center", fontSize: 11, marginBottom: 8 }}>(शासन निर्णय क्र. सीबीसी-२०२२/प्र.क्र.३८/विनियमन, दि. ०१/०४/२०२३ अन्वये)</p>
          <hr className="print-divider" />
          <p style={{ textAlign: "justify", lineHeight: 1.8 }}>
            मी, <strong>{name}</strong>, वय <strong>{d.age || "___"}</strong> वर्षे, व्यवसाय <strong>{d.occupation || "___"}</strong>,
            राहणार गाव/शहर <strong>{d.village || "___"}</strong>, तालुका <strong>{taluka}</strong>, जिल्हा <strong>{district}</strong>,
            राज्य महाराष्ट्र, {d.reason || "शिक्षणासाठी"} उत्पन्नाचे स्वयंघोषणापत्र सादर करीत आहे.
          </p>

          <table className="inc-print-table">
            <thead>
              <tr>
                <th>अ.क्र.</th>
                <th>आर्थिक वर्ष</th>
                <th>वार्षिक उत्पन्न (₹ अंकी)</th>
                <th>वार्षिक उत्पन्न (अक्षरी)</th>
              </tr>
            </thead>
            <tbody>
              {(incomeData.length > 0 ? [incomeData[incomeData.length - 1]] : [{ year: "___", amount: "", words: "" }]).map((row, i) => (
                <tr key={i}>
                  <td style={{ textAlign: "center" }}>1</td>
                  <td>{row.year}</td>
                  <td>₹ {row.amount || "____________"}</td>
                  <td>{row.words || "____________"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p style={{ textAlign: "justify", marginTop: 12 }}>
            मी प्रतिज्ञापूर्वक सांगतो/सांगते की, वरील माहिती माझ्या माहितीनुसार खरी व अचूक आहे.
          </p>

          <div className="print-footer" style={{ marginTop: 50 }}>
            <div className="print-footer-row">
              <span>ठिकाण: {place}</span>
              <div style={{ textAlign: "center" }}>
                {d.signUrl ? <img src={d.signUrl} alt="Sign" style={{ width: 120, height: 50, objectFit: "contain" }} /> : <span>___________________</span>}
                <br /><span>अर्जदाराची सही / अंगठा</span>
              </div>
            </div>
            <div className="print-footer-row" style={{ marginTop: 10 }}>
              <span>दिनांक: {getTodayDate()}</span>
              <span>नाव: {name || "_______________"}</span>
            </div>
          </div>
        </div>
      )}

      {/* Format 3: Old Format */}
      {format === 3 && (
        <div className="print-only a4-page inc-print-page">
          <h2 className="print-title">स्वयंघोषणापत्र</h2>
          <h3 className="print-subtitle">(उत्पन्नाबाबत)</h3>
          <hr className="print-divider" />
          <p style={{ textAlign: "justify", lineHeight: 1.8 }}>
            मी, <strong>{name}</strong>, वय <strong>{d.age || "___"}</strong>, व्यवसाय <strong>{d.occupation || "___"}</strong>,
            राहणार <strong>{d.village || "___"}</strong>, ता. <strong>{taluka}</strong>, जि. <strong>{district}</strong>,
            सत्यप्रतिज्ञेवर खालील माहिती घोषित करतो/करते.
          </p>

          <p style={{ fontWeight: 700, margin: "12px 0 6px" }}>माझे/माझ्या कुटुंबाचे वार्षिक उत्पन्न खालीलप्रमाणे:</p>
          <table className="inc-print-table">
            <thead>
              <tr>
                <th>अ.क्र.</th>
                <th>आर्थिक वर्ष</th>
                <th>वार्षिक उत्पन्न (₹)</th>
                <th>अक्षरी</th>
              </tr>
            </thead>
            <tbody>
              {incomeData.map((row, i) => (
                <tr key={row.year}>
                  <td style={{ textAlign: "center" }}>{i + 1}</td>
                  <td>{row.year}</td>
                  <td>₹ {row.amount || "____________"}</td>
                  <td>{row.words || "____________"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p style={{ textAlign: "justify", marginTop: 14 }}>
            वरील माहिती सत्य व अचूक आहे. खोटी माहिती दिल्यास कायदेशीर कारवाई होऊ शकते, याची मला जाणीव आहे.
          </p>

          <hr className="print-divider" />
          <h3 style={{ textAlign: "center", fontSize: 15, fontWeight: 700, textDecoration: "underline", margin: "12px 0 6px" }}>स्वयंघोषित रहिवासी प्रमाणपत्र</h3>
          <p style={{ textAlign: "justify", lineHeight: 1.8 }}>
            मी, <strong>{name}</strong>, राहणार <strong>{d.village || "___"}</strong>, ता. <strong>{taluka}</strong>,
            जि. <strong>{district}</strong>, राज्य महाराष्ट्र, येथील रहिवासी आहे. मी गेल्या अनेक वर्षांपासून येथे कायमचा/कायमची राहत आहे,
            हे मी सत्यप्रतिज्ञेवर घोषित करतो/करते.
          </p>

          <div className="print-footer" style={{ marginTop: 40 }}>
            <div className="print-footer-row">
              <span>ठिकाण: {place}</span>
              <span>अर्जदाराची सही / अंगठा</span>
            </div>
            <div className="print-footer-row" style={{ marginTop: 10 }}>
              <span>दिनांक: {getTodayDate()}</span>
              <span>नाव: {name || "_______________"}</span>
            </div>
          </div>
        </div>
      )}

      {/* Format 4: Bhumiheen */}
      {format === 4 && (
        <div className="print-only a4-page inc-print-page">
          <h2 className="print-title">भूमीहीन प्रमाणपत्र</h2>
          <h3 className="print-subtitle">(स्वयंघोषणापत्र)</h3>
          <hr className="print-divider" />
          <p style={{ textAlign: "justify", lineHeight: 1.8 }}>
            मी, <strong>{name}</strong>, वय <strong>{d.age || "___"}</strong>, व्यवसाय <strong>{d.occupation || "___"}</strong>,
            राहणार <strong>{d.village || "___"}</strong>, ता. <strong>{taluka}</strong>, जि. <strong>{district}</strong>,
            राज्य महाराष्ट्र, सत्यप्रतिज्ञेवर घोषित करतो/करते की,
          </p>

          <ol style={{ paddingLeft: 20, lineHeight: 2, textAlign: "justify" }}>
            <li>माझ्या नावावर किंवा माझ्या कुटुंबातील कोणत्याही सदस्याच्या नावावर कोणतीही शेतजमीन नाही.</li>
            <li>मी भूमीहीन आहे आणि माझा उदरनिर्वाह <strong>{d.occupation || "मजुरी"}</strong> करून चालवतो/चालवते.</li>
            <li>माझे/माझ्या कुटुंबाचे वार्षिक उत्पन्न ₹ <strong>{incomeData[incomeData.length - 1]?.amount || "____________"}</strong> ({incomeData[incomeData.length - 1]?.words || "____________"}) इतके आहे.</li>
            <li>वरील माहिती खोटी आढळल्यास कायदेशीर कारवाई होऊ शकते, याची मला जाणीव आहे.</li>
          </ol>

          <div className="print-footer" style={{ marginTop: 50 }}>
            <div className="print-footer-row">
              <span>ठिकाण: {place}</span>
              <span>अर्जदाराची सही / अंगठा</span>
            </div>
            <div className="print-footer-row" style={{ marginTop: 10 }}>
              <span>दिनांक: {getTodayDate()}</span>
              <span>नाव: {name || "_______________"}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default IncomeCertPrint;
