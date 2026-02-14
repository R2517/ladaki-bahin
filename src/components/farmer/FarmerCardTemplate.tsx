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

const FarmerCardFront = ({ data }: { data: FarmerCardData }) => {
  const qrValue = `FARMER:${data.farmerId}|MOBILE:${data.mobile}|NAME:${data.nameEnglish}`;
  const issue = data.issueDate || new Date().toISOString().slice(0, 10);
  const validDate = new Date(issue);
  validDate.setFullYear(validDate.getFullYear() + 2);

  return (
    <div
      className="relative bg-white border-[3px] border-green-700 rounded-xl overflow-hidden"
      style={{ width: "400px", height: "252px" }}
    >
      {/* Green header bar */}
      <div className="bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 text-white px-3 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Sprout size={16} className="text-yellow-300" />
          <span className="font-bold text-[11px] tracking-wide">शेतकरी ओळखपत्र</span>
        </div>
        <span className="text-[9px] font-medium opacity-90">FARMER IDENTITY CARD</span>
      </div>

      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
        <Sprout size={160} className="text-green-800" />
      </div>

      {/* Body */}
      <div className="flex gap-3 px-3 pt-2 relative z-10">
        {/* Photo */}
        <div className="flex-shrink-0 flex flex-col items-center gap-1">
          <div className="w-[80px] h-[95px] border-2 border-green-600 rounded-md overflow-hidden bg-green-50">
            {data.photoUrl ? (
              <img src={data.photoUrl} alt="Farmer" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-green-300">
                <Sprout size={32} />
              </div>
            )}
          </div>
          <span className="text-[7px] text-green-700 font-semibold">{data.farmerId}</span>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0 text-[9.5px] leading-[15px]">
          <div className="mb-0.5">
            <span className="font-bold text-green-800 text-[11px]">{data.nameMarathi}</span>
            <br />
            <span className="text-gray-600 text-[9px]">{data.nameEnglish}</span>
          </div>
          <table className="w-full">
            <tbody>
              <tr>
                <td className="text-gray-500 pr-1 whitespace-nowrap">जन्मतारीख:</td>
                <td className="font-medium text-gray-800">{formatDate(data.dateOfBirth)} (वय: {calcAge(data.dateOfBirth)})</td>
              </tr>
              <tr>
                <td className="text-gray-500 pr-1 whitespace-nowrap">लिंग:</td>
                <td className="font-medium text-gray-800">{data.gender}</td>
              </tr>
              <tr>
                <td className="text-gray-500 pr-1 whitespace-nowrap">मोबाईल:</td>
                <td className="font-medium text-gray-800">{data.mobile}</td>
              </tr>
              <tr>
                <td className="text-gray-500 pr-1 whitespace-nowrap">आधार:</td>
                <td className="font-medium text-gray-800">{maskAadhaar(data.aadhaar)}</td>
              </tr>
              <tr>
                <td className="text-gray-500 pr-1 whitespace-nowrap align-top">पत्ता:</td>
                <td className="font-medium text-gray-800 break-words text-[8.5px] leading-[12px]">{data.address}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* QR */}
        <div className="flex-shrink-0 flex flex-col items-center gap-0.5">
          <div className="bg-white p-1 border border-green-200 rounded">
            <QRCodeSVG value={qrValue} size={52} level="M" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 bg-green-50 border-t border-green-200 px-3 py-1 flex justify-between text-[7.5px] text-green-700">
        <span>दिनांक: {formatDate(issue)}</span>
        <span>वैध: {formatDate(validDate.toISOString().slice(0, 10))}</span>
        <span className="font-semibold">SETU Suvidha</span>
      </div>
    </div>
  );
};

const FarmerCardBack = ({ data }: { data: FarmerCardData }) => {
  const totalArea = data.landHoldings.reduce((sum, l) => sum + (parseFloat(l.areaHectares) || 0), 0);

  return (
    <div
      className="relative bg-white border-[3px] border-green-700 rounded-xl overflow-hidden"
      style={{ width: "400px", height: "252px" }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 text-white px-3 py-1.5 text-center">
        <span className="font-bold text-[10px]">जमिनीचा तपशील — Land Holdings</span>
      </div>

      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
        <Sprout size={140} className="text-green-800" />
      </div>

      {/* Table */}
      <div className="px-2 pt-1.5 relative z-10">
        <table className="w-full text-[8px] border-collapse">
          <thead>
            <tr className="bg-green-100 text-green-800">
              <th className="border border-green-300 px-1 py-0.5 text-left">क्र.</th>
              <th className="border border-green-300 px-1 py-0.5 text-left">जिल्हा</th>
              <th className="border border-green-300 px-1 py-0.5 text-left">तालुका</th>
              <th className="border border-green-300 px-1 py-0.5 text-left">गाव</th>
              <th className="border border-green-300 px-1 py-0.5 text-left">गट नं.</th>
              {data.showAccountNumber && (
                <th className="border border-green-300 px-1 py-0.5 text-left">खाते नं.</th>
              )}
              <th className="border border-green-300 px-1 py-0.5 text-right">क्षेत्र (हे.)</th>
            </tr>
          </thead>
          <tbody>
            {data.landHoldings.slice(0, 6).map((l, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-green-50/50"}>
                <td className="border border-green-200 px-1 py-0.5">{i + 1}</td>
                <td className="border border-green-200 px-1 py-0.5 truncate max-w-[60px]">{l.district?.split(" (")[0]}</td>
                <td className="border border-green-200 px-1 py-0.5 truncate max-w-[50px]">{l.taluka}</td>
                <td className="border border-green-200 px-1 py-0.5 truncate max-w-[50px]">{l.village}</td>
                <td className="border border-green-200 px-1 py-0.5">{l.gatNumber || "-"}</td>
                {data.showAccountNumber && (
                  <td className="border border-green-200 px-1 py-0.5">{l.accountNumber || "-"}</td>
                )}
                <td className="border border-green-200 px-1 py-0.5 text-right">{parseFloat(l.areaHectares).toFixed(2)}</td>
              </tr>
            ))}
            <tr className="bg-green-100 font-bold text-green-800">
              <td className="border border-green-300 px-1 py-0.5" colSpan={data.showAccountNumber ? 6 : 5}>
                एकूण क्षेत्र (Total Area)
              </td>
              <td className="border border-green-300 px-1 py-0.5 text-right">{totalArea.toFixed(2)} हे.</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 bg-green-50 border-t border-green-200 px-3 py-1 flex justify-between items-center text-[7px] text-green-700">
        <span>हे ओळखपत्र SETU Suvidha पोर्टलद्वारे तयार केले आहे.</span>
        <span className="font-bold text-[8px]">setusuvidha.com</span>
      </div>
    </div>
  );
};

const FarmerCardTemplate = ({ data, id }: { data: FarmerCardData; id?: string }) => (
  <div id={id || "farmer-card"} className="flex flex-col items-center gap-4">
    <FarmerCardFront data={data} />
    <FarmerCardBack data={data} />
  </div>
);

export default FarmerCardTemplate;
