import { useState, useEffect, useRef, useCallback, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft, Sprout, Plus, Search, Trash2, Eye, Download, Printer,
  Camera, Upload, X, ChevronDown, ChevronUp, User, MapPin, ImageIcon, Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

import { getThemeGradient } from "@/lib/themes";
import { useFormSubmissions } from "@/hooks/useFormSubmissions";
import { useAuth } from "@/contexts/AuthContext";
import { getDistricts, getTalukas } from "@/data/maharashtra-districts";
import type { FormSubmission } from "@/hooks/useFormSubmissions";

interface FarmerCardData {
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

const Cropper = lazy(() => import("react-easy-crop"));
const FarmerCardTemplate = lazy(() => import("@/components/farmer/FarmerCardTemplate"));

// ─── Crop helpers ────────────────────────────────────────────────
function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", (e) => reject(e));
    img.crossOrigin = "anonymous";
    img.src = url;
  });
}

async function getCroppedImg(imageSrc: string, pixelCrop: any): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(
    image,
    pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
    0, 0, pixelCrop.width, pixelCrop.height
  );
  return canvas.toDataURL("image/jpeg", 0.85);
}

// ─── Constants ───────────────────────────────────────────────────
const FORM_TYPE = "शेतकरी ओळखपत्र";
const districts = getDistricts();

const emptyLand = () => ({
  district: "",
  taluka: "",
  village: "",
  gatNumber: "",
  accountNumber: "",
  areaHectares: "",
});

// ─── Main Page Component ─────────────────────────────────────────
const FarmerIdCard = () => {
  const navigate = useNavigate();
  const themeGradient = getThemeGradient();
  const { profile } = useAuth();
  const { submissions, loading, addSubmission, deleteSubmission } = useFormSubmissions(FORM_TYPE);

  // View state
  const [view, setView] = useState<"list" | "form" | "preview">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewData, setPreviewData] = useState<FarmerCardData | null>(null);

  // Form state — Personal Details
  const [nameMarathi, setNameMarathi] = useState("");
  const [nameEnglish, setNameEnglish] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [mobile, setMobile] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [farmerId, setFarmerId] = useState("");
  const [address, setAddress] = useState("");

  // Form state — Land Details
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [autoFillVillage, setAutoFillVillage] = useState(false);
  const [landHoldings, setLandHoldings] = useState([emptyLand()]);

  // Form state — Photo
  const [photoUrl, setPhotoUrl] = useState("");
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [showCropDialog, setShowCropDialog] = useState(false);

  // UI state
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [expandedSection, setExpandedSection] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "शेतकरी ओळखपत्र — Farmer ID Card | SETU Suvidha";
  }, []);

  // ─── Validation ──────────────────────────────────────────────
  const validate = (): boolean => {
    if (!nameMarathi.trim()) { toast.error("कृपया मराठी नाव टाका"); return false; }
    if (!nameEnglish.trim()) { toast.error("Please enter name in English"); return false; }
    if (!dateOfBirth) { toast.error("कृपया जन्मतारीख निवडा"); return false; }
    if (!gender) { toast.error("कृपया लिंग निवडा"); return false; }
    if (!/^[6-9]\d{9}$/.test(mobile)) { toast.error("१० अंकी मोबाईल नंबर टाका"); return false; }
    if (!/^\d{12}$/.test(aadhaar)) { toast.error("१२ अंकी आधार नंबर टाका"); return false; }
    if (!/^\d{11}$/.test(farmerId)) { toast.error("११ अंकी शेतकरी ID टाका"); return false; }
    if (address.trim().length < 10) { toast.error("संपूर्ण पत्ता टाका (किमान १० अक्षरे)"); return false; }
    if (!photoUrl) { toast.error("शेतकरी फोटो अपलोड करणे अनिवार्य आहे"); return false; }

    for (let i = 0; i < landHoldings.length; i++) {
      const l = landHoldings[i];
      if (!l.district) { toast.error(`जमीन ${i + 1}: जिल्हा निवडा`); return false; }
      if (!l.taluka) { toast.error(`जमीन ${i + 1}: तालुका निवडा`); return false; }
      if (!l.village.trim()) { toast.error(`जमीन ${i + 1}: गाव टाका`); return false; }
      const area = parseFloat(l.areaHectares);
      if (!area || area <= 0) { toast.error(`जमीन ${i + 1}: क्षेत्र ० पेक्षा जास्त असावे`); return false; }
    }
    return true;
  };

  // ─── Build card data ─────────────────────────────────────────
  const buildCardData = (): FarmerCardData => ({
    nameMarathi, nameEnglish, dateOfBirth, gender, mobile, aadhaar, farmerId,
    address, photoUrl, showAccountNumber, landHoldings,
    issueDate: new Date().toISOString().slice(0, 10),
  });

  // ─── Save & Generate ─────────────────────────────────────────
  const handleSave = async () => {
    if (!validate()) return;

    if (profile && (profile.wallet_balance ?? 0) < 10) {
      toast.error("वॉलेट शिल्लक अपुरी आहे (किमान ₹10 आवश्यक). कृपया रिचार्ज करा.");
      return;
    }

    setSaving(true);
    try {
      const formData = buildCardData();
      const saved = await addSubmission(nameMarathi, formData);
      if (!saved) { setSaving(false); return; }
      setPreviewData(formData);
      setView("preview");
      resetForm();
    } finally {
      setSaving(false);
    }
  };

  // ─── PDF Download ─────────────────────────────────────────────
  const handleDownloadPDF = async () => {
    const el = document.getElementById("farmer-card-print");
    if (!el) return;
    setDownloading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");
      const canvas = await html2canvas(el, { scale: 3, useCORS: true, backgroundColor: "#ffffff" });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pdfW = pdf.internal.pageSize.getWidth();
      const cardW = pdfW - 20;
      const cardH = (canvas.height / canvas.width) * cardW;
      pdf.addImage(imgData, "PNG", 10, 10, cardW, cardH);
      pdf.save(`farmer-card-${previewData?.farmerId || "card"}.pdf`);
      toast.success("PDF डाउनलोड झाली!");
    } catch {
      toast.error("PDF तयार करताना Error आला");
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    const el = document.getElementById("farmer-card-print");
    if (!el) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<html><head><title>Farmer Card</title><style>body{margin:0;display:flex;justify-content:center;padding:20px}@media print{body{padding:0}}</style></head><body>${el.innerHTML}</body></html>`);
    win.document.close();
    setTimeout(() => { win.print(); win.close(); }, 500);
  };

  // ─── Photo handling ───────────────────────────────────────────
  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("फोटो 5MB पेक्षा कमी असावा"); return; }
    const reader = new FileReader();
    reader.onload = () => {
      setRawImage(reader.result as string);
      setShowCropDialog(true);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const onCropComplete = useCallback((_: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleCropSave = async () => {
    if (!rawImage || !croppedAreaPixels) return;
    try {
      const cropped = await getCroppedImg(rawImage, croppedAreaPixels);
      setPhotoUrl(cropped);
      setShowCropDialog(false);
      setRawImage(null);
    } catch {
      toast.error("फोटो क्रॉप करताना Error");
    }
  };

  // ─── Land row helpers ─────────────────────────────────────────
  const updateLand = (idx: number, field: string, value: string) => {
    setLandHoldings((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      if (field === "district") copy[idx].taluka = "";
      return copy;
    });
  };

  const addLandRow = () => {
    const last = landHoldings[landHoldings.length - 1];
    const newRow = emptyLand();
    if (autoFillVillage && last) {
      newRow.district = last.district;
      newRow.taluka = last.taluka;
      newRow.village = last.village;
    }
    setLandHoldings((prev) => [...prev, newRow]);
  };

  const removeLandRow = (idx: number) => {
    if (landHoldings.length <= 1) return;
    setLandHoldings((prev) => prev.filter((_, i) => i !== idx));
  };

  // ─── Reset form ───────────────────────────────────────────────
  const resetForm = () => {
    setNameMarathi(""); setNameEnglish(""); setDateOfBirth(""); setGender("");
    setMobile(""); setAadhaar(""); setFarmerId(""); setAddress("");
    setPhotoUrl(""); setLandHoldings([emptyLand()]);
    setShowAccountNumber(false); setAutoFillVillage(false);
    setExpandedSection(0);
  };

  // ─── View existing card ───────────────────────────────────────
  const viewCard = (sub: FormSubmission) => {
    setPreviewData(sub.form_data as unknown as FarmerCardData);
    setView("preview");
  };

  // ─── Search filter ────────────────────────────────────────────
  const filtered = submissions.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const d = s.form_data as any;
    return (
      s.applicant_name?.toLowerCase().includes(q) ||
      d?.farmerId?.toLowerCase().includes(q) ||
      d?.mobile?.includes(q) ||
      d?.landHoldings?.some((l: any) => l.village?.toLowerCase().includes(q))
    );
  });

  // ─── Section toggle ───────────────────────────────────────────
  const SectionHeader = ({ idx, icon: Icon, title }: { idx: number; icon: any; title: string }) => (
    <button
      type="button"
      onClick={() => setExpandedSection(expandedSection === idx ? -1 : idx)}
      className="w-full flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/30 rounded-lg hover:bg-green-100 dark:hover:bg-green-950/50 transition-colors"
    >
      <div className="flex items-center gap-2">
        <Icon size={18} className="text-green-600" />
        <span className="font-semibold text-green-800 dark:text-green-200">{title}</span>
      </div>
      {expandedSection === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
    </button>
  );

  // ═══════════════════════════════════════════════════════════════
  // RENDER: PREVIEW VIEW
  // ═══════════════════════════════════════════════════════════════
  if (view === "preview" && previewData) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="print:hidden text-white py-3 px-4 flex items-center gap-3" style={{ background: themeGradient }}>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={() => { setView("list"); setPreviewData(null); }}>
            <ArrowLeft size={20} />
          </Button>
          <Sprout size={22} className="text-yellow-300" />
          <h1 className="text-lg font-bold">शेतकरी ओळखपत्र — Preview</h1>
        </header>

        <div className="max-w-2xl mx-auto p-4 space-y-4">
          {/* Actions */}
          <div className="print:hidden flex flex-wrap gap-2">
            <Button onClick={handleDownloadPDF} disabled={downloading} className="bg-green-600 hover:bg-green-700">
              <Download size={16} className="mr-2" />{downloading ? "डाउनलोड..." : "PDF डाउनलोड"}
            </Button>
            <Button onClick={handlePrint} variant="outline">
              <Printer size={16} className="mr-2" />प्रिंट
            </Button>
            <Button variant="outline" onClick={() => { setView("list"); setPreviewData(null); }}>
              <ArrowLeft size={16} className="mr-2" />मागे
            </Button>
          </div>

          {/* Card */}
          <div id="farmer-card-print" className="bg-white p-6 rounded-xl flex flex-col items-center gap-4">
            <Suspense fallback={<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />}>
              <FarmerCardTemplate data={previewData} />
            </Suspense>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // RENDER: FORM VIEW
  // ═══════════════════════════════════════════════════════════════
  if (view === "form") {
    return (
      <div className="min-h-screen bg-background">
        <header className="print:hidden text-white py-3 px-4 flex items-center gap-3" style={{ background: themeGradient }}>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={() => setView("list")}>
            <ArrowLeft size={20} />
          </Button>
          <Sprout size={22} className="text-yellow-300" />
          <h1 className="text-lg font-bold">नवीन शेतकरी ओळखपत्र</h1>
        </header>

        <div className="max-w-3xl mx-auto p-4 space-y-3">
          {/* Wallet indicator */}
          <div className="flex items-center justify-between bg-green-50 dark:bg-green-950/30 rounded-lg px-4 py-2 text-sm">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <Wallet size={16} />
              <span>शुल्क: <b>₹10</b> प्रति कार्ड</span>
            </div>
            <span className="font-bold text-green-800 dark:text-green-200">
              शिल्लक: ₹{profile?.wallet_balance?.toFixed(2) ?? "0.00"}
            </span>
          </div>

          {/* ─── Section 1: Personal Details ─── */}
          <Card>
            <SectionHeader idx={0} icon={User} title="वैयक्तिक माहिती (Personal Details)" />
            {expandedSection === 0 && (
              <CardContent className="pt-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>नाव (मराठी) *</Label>
                    <Input value={nameMarathi} onChange={(e) => setNameMarathi(e.target.value)} placeholder="शेतकऱ्याचे पूर्ण नाव" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Name (English) *</Label>
                    <Input value={nameEnglish} onChange={(e) => setNameEnglish(e.target.value)} placeholder="Full name in English" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>जन्मतारीख *</Label>
                    <Input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} max={new Date().toISOString().slice(0, 10)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>लिंग *</Label>
                    <Select value={gender} onValueChange={setGender}>
                      <SelectTrigger><SelectValue placeholder="निवडा" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="पुरुष (Male)">पुरुष (Male)</SelectItem>
                        <SelectItem value="स्त्री (Female)">स्त्री (Female)</SelectItem>
                        <SelectItem value="इतर (Other)">इतर (Other)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>मोबाईल नंबर *</Label>
                    <Input value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="10 अंकी मोबाईल" maxLength={10} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>आधार नंबर *</Label>
                    <Input value={aadhaar} onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, "").slice(0, 12))} placeholder="12 अंकी आधार" maxLength={12} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>शेतकरी ID *</Label>
                    <Input value={farmerId} onChange={(e) => setFarmerId(e.target.value.replace(/\D/g, "").slice(0, 11))} placeholder="11 अंकी शेतकरी ID" maxLength={11} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>पूर्ण पत्ता *</Label>
                  <Textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="गाव, तालुका, जिल्हा, पिनकोड" rows={2} />
                </div>
                <Button type="button" onClick={() => setExpandedSection(1)} className="bg-green-600 hover:bg-green-700">
                  पुढे — जमीन तपशील →
                </Button>
              </CardContent>
            )}
          </Card>

          {/* ─── Section 2: Land Details ─── */}
          <Card>
            <SectionHeader idx={1} icon={MapPin} title="जमिनीचा तपशील (Land Details)" />
            {expandedSection === 1 && (
              <CardContent className="pt-4 space-y-4">
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <Checkbox checked={showAccountNumber} onCheckedChange={(v) => setShowAccountNumber(!!v)} />
                    खाते नं. दाखवा
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <Checkbox checked={autoFillVillage} onCheckedChange={(v) => setAutoFillVillage(!!v)} />
                    पुढील जमीन त्याच गावात
                  </label>
                </div>

                {landHoldings.map((land, idx) => (
                  <div key={idx} className="border border-green-200 dark:border-green-800 rounded-lg p-3 space-y-3 bg-green-50/50 dark:bg-green-950/20">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-green-700 dark:text-green-300">जमीन #{idx + 1}</span>
                      {landHoldings.length > 1 && (
                        <Button variant="ghost" size="sm" className="text-red-500 h-7 px-2" onClick={() => removeLandRow(idx)}>
                          <Trash2 size={14} className="mr-1" />काढा
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">जिल्हा *</Label>
                        <Select value={land.district} onValueChange={(v) => updateLand(idx, "district", v)}>
                          <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="जिल्हा निवडा" /></SelectTrigger>
                          <SelectContent>
                            {districts.map((d) => <SelectItem key={d} value={d} className="text-xs">{d}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">तालुका *</Label>
                        <Select value={land.taluka} onValueChange={(v) => updateLand(idx, "taluka", v)} disabled={!land.district}>
                          <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="तालुका निवडा" /></SelectTrigger>
                          <SelectContent>
                            {getTalukas(land.district).map((t) => <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">गाव *</Label>
                        <Input className="h-9 text-xs" value={land.village} onChange={(e) => updateLand(idx, "village", e.target.value)} placeholder="गावाचे नाव" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">गट नंबर</Label>
                        <Input className="h-9 text-xs" value={land.gatNumber} onChange={(e) => updateLand(idx, "gatNumber", e.target.value)} placeholder="गट नं." />
                      </div>
                      {showAccountNumber && (
                        <div className="space-y-1">
                          <Label className="text-xs">खाते नंबर</Label>
                          <Input className="h-9 text-xs" value={land.accountNumber} onChange={(e) => updateLand(idx, "accountNumber", e.target.value)} placeholder="खाते नं." />
                        </div>
                      )}
                      <div className="space-y-1">
                        <Label className="text-xs">क्षेत्र (हेक्टर) *</Label>
                        <Input className="h-9 text-xs" type="number" step="0.01" min="0" value={land.areaHectares} onChange={(e) => updateLand(idx, "areaHectares", e.target.value)} placeholder="00.00" />
                      </div>
                    </div>
                  </div>
                ))}

                <Button type="button" variant="outline" onClick={addLandRow} className="border-green-300 text-green-700">
                  <Plus size={16} className="mr-1" />जमीन जोडा
                </Button>

                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setExpandedSection(0)}>← मागे</Button>
                  <Button type="button" onClick={() => setExpandedSection(2)} className="bg-green-600 hover:bg-green-700">
                    पुढे — फोटो अपलोड →
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>

          {/* ─── Section 3: Photo Upload ─── */}
          <Card>
            <SectionHeader idx={2} icon={ImageIcon} title="शेतकरी फोटो (Photo Upload)" />
            {expandedSection === 2 && (
              <CardContent className="pt-4 space-y-4">
                <div className="flex flex-col items-center gap-4">
                  {photoUrl ? (
                    <div className="relative">
                      <img src={photoUrl} alt="Farmer" className="w-36 h-36 rounded-lg border-4 border-green-500 object-cover shadow-lg" />
                      <Button
                        variant="destructive" size="icon"
                        className="absolute -top-2 -right-2 h-7 w-7 rounded-full"
                        onClick={() => setPhotoUrl("")}
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="w-36 h-36 rounded-lg border-2 border-dashed border-green-400 flex flex-col items-center justify-center gap-2 cursor-pointer bg-green-50 dark:bg-green-950/20 hover:bg-green-100 dark:hover:bg-green-950/40 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera size={32} className="text-green-400" />
                      <span className="text-xs text-green-600">फोटो अपलोड करा</span>
                    </div>
                  )}

                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onFileSelect} />

                  <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                      <Upload size={14} className="mr-1" />{photoUrl ? "बदला" : "अपलोड"}
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setExpandedSection(1)}>← मागे</Button>
                  <Button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-green-600 hover:bg-green-700 flex-1"
                  >
                    {saving ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    ) : (
                      <>
                        <Sprout size={16} className="mr-2" />
                        ओळखपत्र बनवा (₹10)
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        </div>

        {/* Crop Dialog */}
        <Dialog open={showCropDialog} onOpenChange={setShowCropDialog}>
          <DialogContent className="max-w-md">
            <DialogTitle>फोटो क्रॉप करा</DialogTitle>
            <div className="relative w-full h-64 bg-black rounded-lg overflow-hidden">
              {rawImage && (
                <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" /></div>}>
                  <Cropper
                    image={rawImage}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                </Suspense>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-xs whitespace-nowrap">Zoom:</Label>
              <input type="range" min={1} max={3} step={0.1} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="flex-1" />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => { setShowCropDialog(false); setRawImage(null); }}>रद्द करा</Button>
              <Button onClick={handleCropSave} className="bg-green-600 hover:bg-green-700">सेव्ह करा</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // RENDER: LIST VIEW (History)
  // ═══════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-background">
      <header className="text-white py-3 px-4 flex items-center gap-3" style={{ background: themeGradient }}>
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={() => navigate("/dashboard")}>
          <ArrowLeft size={20} />
        </Button>
        <Sprout size={22} className="text-yellow-300" />
        <h1 className="text-lg font-bold flex-1">शेतकरी ओळखपत्र</h1>
        <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white" onClick={() => setView("form")}>
          <Plus size={16} className="mr-1" />नवीन कार्ड
        </Button>
      </header>

      <div className="max-w-5xl mx-auto p-4 space-y-4">
        {/* Add New Card — prominent CTA */}
        <Button
          onClick={() => setView("form")}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-base font-bold shadow-lg rounded-xl flex items-center justify-center gap-2"
        >
          <Plus size={22} />
          <span>+ नवीन शेतकरी ओळखपत्र बनवा</span>
        </Button>

        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-10"
            placeholder="नाव, गाव, मोबाईल किंवा ID शोधा..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Sprout size={48} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">कोणतेही रेकॉर्ड सापडले नाही.</p>
            <p className="text-sm mt-1">नवीन शेतकरी ओळखपत्र तयार करण्यासाठी "नवीन कार्ड" बटण दाबा.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-200">
                  <th className="text-left p-3 font-semibold">अ.क्र.</th>
                  <th className="text-left p-3 font-semibold">पूर्ण नाव (मराठी)</th>
                  <th className="text-left p-3 font-semibold hidden sm:table-cell">गाव</th>
                  <th className="text-left p-3 font-semibold hidden md:table-cell">शेतकरी ID</th>
                  <th className="text-left p-3 font-semibold hidden md:table-cell">मोबाईल</th>
                  <th className="text-left p-3 font-semibold hidden lg:table-cell">तारीख</th>
                  <th className="text-right p-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((sub, i) => {
                  const d = sub.form_data as any;
                  const village = d?.landHoldings?.[0]?.village || "-";
                  return (
                    <tr key={sub.id} className="border-t hover:bg-muted/50 transition-colors">
                      <td className="p-3">{i + 1}</td>
                      <td className="p-3 font-medium">{sub.applicant_name}</td>
                      <td className="p-3 hidden sm:table-cell">{village}</td>
                      <td className="p-3 hidden md:table-cell font-mono text-xs">{d?.farmerId || "-"}</td>
                      <td className="p-3 hidden md:table-cell">{d?.mobile || "-"}</td>
                      <td className="p-3 hidden lg:table-cell text-xs text-muted-foreground">
                        {new Date(sub.created_at).toLocaleDateString("mr-IN")}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex gap-1 justify-end">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600" onClick={() => viewCard(sub)} title="पहा">
                            <Eye size={15} />
                          </Button>
                          <Button
                            variant="ghost" size="icon" className="h-8 w-8 text-red-500"
                            onClick={async () => {
                              if (confirm("हे रेकॉर्ड हटवायचे का?")) await deleteSubmission(sub.id);
                            }}
                            title="हटवा"
                          >
                            <Trash2 size={15} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerIdCard;
