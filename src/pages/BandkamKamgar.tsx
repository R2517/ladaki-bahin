import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  ArrowLeft, Plus, Search, Trash2, HardHat, IndianRupee,
  Pencil, Check, X, AlertTriangle, Calendar, RefreshCw,
  User, ChevronLeft, Package, GraduationCap, Baby, Heart, Skull,
} from "lucide-react";

// ---- Types ----
interface Registration {
  id: string;
  registration_type: string;
  applicant_name: string;
  mobile_number: string | null;
  aadhar_number: string | null;
  village: string | null;
  taluka: string | null;
  district: string | null;
  dob: string | null;
  form_date: string;
  appointment_date: string | null;
  activation_date: string | null;
  expiry_date: string | null;
  status: string;
  amount: number;
  received_amount: number;
  payment_status: string;
  payment_mode: string | null;
  created_at: string;
}

interface Scheme {
  id: string;
  registration_id: string | null;
  applicant_name: string;
  scheme_type: string;
  scholarship_category: string | null;
  student_name: string | null;
  year: string | null;
  amount: number;
  commission_percent: number;
  commission_amount: number;
  received_amount: number;
  payment_status: string;
  payment_mode: string | null;
  status: string;
  created_at: string;
}

// ---- Constants ----
const SCHEME_TYPES = [
  { value: "essential_kit", label: "Essential Kit", icon: "📦", isKit: true },
  { value: "safety_kit", label: "Safety Kit", icon: "🦺", isKit: true },
  { value: "scholarship", label: "Scholarship (शिष्यवृत्ती)", icon: "🎓", isKit: false },
  { value: "pregnancy", label: "Pregnancy (गर्भवती)", icon: "🤰", isKit: false },
  { value: "marriage", label: "Marriage (विवाह)", icon: "💒", isKit: false },
  { value: "death", label: "Death (मृत्यू)", icon: "🕯️", isKit: false },
];

const SCHOLARSHIP_CATS = [
  { value: "1-4", label: "इयत्ता 1 ते 4" },
  { value: "5-10", label: "इयत्ता 5 ते 10" },
  { value: "11-12", label: "इयत्ता 11 ते 12" },
  { value: "graduation", label: "Graduation" },
  { value: "iti", label: "ITI" },
  { value: "engineering", label: "Engineering" },
  { value: "10th_50_above", label: "10th - 50% Above" },
  { value: "12th_50_above", label: "12th - 50% Above" },
];

const emptyRegForm = {
  registration_type: "new",
  applicant_name: "",
  mobile_number: "",
  aadhar_number: "",
  village: "",
  taluka: "",
  district: "",
  dob: "",
  amount: "",
  received_amount: "",
  payment_status: "unpaid",
  payment_mode: "cash",
};

const emptySchemeForm = {
  scheme_type: "essential_kit",
  scholarship_category: "",
  student_name: "",
  year: new Date().getFullYear().toString(),
  amount: "",
  commission_percent: "",
  received_amount: "",
  payment_status: "unpaid",
  payment_mode: "cash",
  status: "applied",
};

// ---- Helpers ----
const addYears = (dateStr: string, years: number) => {
  const d = new Date(dateStr);
  d.setFullYear(d.getFullYear() + years);
  return d.toISOString().slice(0, 10);
};

const daysUntil = (dateStr: string) => {
  const diff = new Date(dateStr).getTime() - new Date().setHours(0, 0, 0, 0);
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const statusLabel = (s: string) => {
  if (s === "paid") return "Paid ✅";
  if (s === "partially_paid") return "Partial ⚠️";
  return "Unpaid ❌";
};

const statusClass = (s: string) => {
  if (s === "paid") return "pan-status-paid";
  if (s === "partially_paid") return "pan-status-partial";
  return "pan-status-unpaid";
};

const regStatusBadge = (status: string, expiryDate: string | null) => {
  if (status === "expired" || (expiryDate && daysUntil(expiryDate) < 0))
    return { label: "Expired ❌", cls: "bk-badge-expired" };
  if (expiryDate && daysUntil(expiryDate) <= 7)
    return { label: `Expiring (${daysUntil(expiryDate)}d)`, cls: "bk-badge-expiring" };
  if (status === "active")
    return { label: "Active ✅", cls: "bk-badge-active" };
  return { label: "Pending ⏳", cls: "bk-badge-pending" };
};

const schemeStatusLabel = (s: string) => {
  if (s === "approved") return "Approved ✅";
  if (s === "received") return "Received 📦";
  if (s === "rejected") return "Rejected ❌";
  return "Applied 📋";
};

// ============ COMPONENT ============
const BandkamKamgar = () => {
  const navigate = useNavigate();

  // --- View state: "list" or "profile" ---
  const [view, setView] = useState<"list" | "profile">("list");
  const [selectedCustomer, setSelectedCustomer] = useState<Registration | null>(null);

  // --- Registration state ---
  const [regs, setRegs] = useState<Registration[]>([]);
  const [regLoading, setRegLoading] = useState(true);
  const [regForm, setRegForm] = useState(emptyRegForm);
  const [showRegForm, setShowRegForm] = useState(false);
  const [regSearch, setRegSearch] = useState("");

  // --- Profile state ---
  const [profileDates, setProfileDates] = useState({ appointment_date: "", activation_date: "" });
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [schemeLoading, setSchemeLoading] = useState(false);
  const [showSchemeForm, setShowSchemeForm] = useState(false);
  const [schemeForm, setSchemeForm] = useState(emptySchemeForm);
  const [schemeEditId, setSchemeEditId] = useState<string | null>(null);
  const [schemeEditData, setSchemeEditData] = useState({ received_amount: "", payment_status: "", payment_mode: "", status: "" });

  // ---- Fetchers ----
  const fetchRegs = useCallback(async () => {
    setRegLoading(true);
    const { data, error } = await supabase
      .from("bandkam_registrations")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error("Data load Error");
    else setRegs((data as Registration[]) || []);
    setRegLoading(false);
  }, []);

  const fetchSchemes = useCallback(async (regId: string) => {
    setSchemeLoading(true);
    const { data, error } = await supabase
      .from("bandkam_schemes")
      .select("*")
      .eq("registration_id", regId)
      .order("created_at", { ascending: false });
    if (error) toast.error("Scheme data Error");
    else setSchemes((data as Scheme[]) || []);
    setSchemeLoading(false);
  }, []);

  useEffect(() => { fetchRegs(); }, [fetchRegs]);

  // ---- Expiry Alert ----
  const expiringRegs = useMemo(() =>
    regs.filter((r) => r.expiry_date && daysUntil(r.expiry_date) >= 0 && daysUntil(r.expiry_date) <= 7),
    [regs]
  );

  const expiredRegs = useMemo(() =>
    regs.filter((r) => r.expiry_date && daysUntil(r.expiry_date) < 0 && r.status !== "expired"),
    [regs]
  );

  // ---- Registration CRUD ----
  const handleRegChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setRegForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const today = new Date().toISOString().slice(0, 10);

  const handleRegSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.applicant_name.trim()) { toast.error("नाव आवश्यक आहे"); return; }
    if (regForm.mobile_number && !/^\d{10}$/.test(regForm.mobile_number)) { toast.error("Mobile 10 अंकी असावा"); return; }
    if (regForm.aadhar_number && !/^\d{12}$/.test(regForm.aadhar_number)) { toast.error("Aadhar 12 अंकी असावा"); return; }

    const isAlreadyActivated = regForm.registration_type === "already_activated";

    const { error } = await supabase.from("bandkam_registrations").insert({
      registration_type: regForm.registration_type,
      applicant_name: regForm.applicant_name.trim(),
      mobile_number: regForm.mobile_number || null,
      aadhar_number: regForm.aadhar_number || null,
      village: regForm.village || null,
      taluka: regForm.taluka || null,
      district: regForm.district || null,
      dob: regForm.dob || null,
      form_date: today,
      appointment_date: null,
      activation_date: null,
      expiry_date: null,
      status: "pending",
      amount: parseFloat(regForm.amount) || 0,
      received_amount: parseFloat(regForm.received_amount) || 0,
      payment_status: regForm.payment_status,
      payment_mode: regForm.payment_mode,
    });
    if (error) { toast.error("Save Error"); console.error(error); return; }
    toast.success("Customer Entry Save झाली! ✅");
    setRegForm(emptyRegForm);
    setShowRegForm(false);
    fetchRegs();
  };

  const deleteReg = async (id: string) => {
    if (!confirm("हा Customer रेकॉर्ड हटवायचा? सर्व Schemes पण हटतील!")) return;
    // Delete schemes first
    await supabase.from("bandkam_schemes").delete().eq("registration_id", id);
    const { error } = await supabase.from("bandkam_registrations").delete().eq("id", id);
    if (error) { toast.error("Delete Error"); return; }
    toast.success("Customer हटवला!");
    setRegs((p) => p.filter((r) => r.id !== id));
    if (selectedCustomer?.id === id) { setView("list"); setSelectedCustomer(null); }
  };

  // ---- Open Profile ----
  const openProfile = (reg: Registration) => {
    setSelectedCustomer(reg);
    setProfileDates({
      appointment_date: reg.appointment_date || "",
      activation_date: reg.activation_date || "",
    });
    setView("profile");
    fetchSchemes(reg.id);
  };

  // ---- Profile: Update Dates ----
  const saveProfileDates = async () => {
    if (!selectedCustomer) return;
    const activationDate = profileDates.activation_date || null;
    const expiryDate = activationDate ? addYears(activationDate, 1) : null;
    let status = "pending";
    if (activationDate) {
      status = expiryDate && daysUntil(expiryDate) < 0 ? "expired" : "active";
    }

    const { error } = await supabase.from("bandkam_registrations").update({
      appointment_date: profileDates.appointment_date || null,
      activation_date: activationDate,
      expiry_date: expiryDate,
      status,
    }).eq("id", selectedCustomer.id);

    if (error) { toast.error("Update Error"); return; }
    toast.success("Dates Updated! ✅");
    // Refresh
    const { data } = await supabase.from("bandkam_registrations").select("*").eq("id", selectedCustomer.id).single();
    if (data) {
      setSelectedCustomer(data as Registration);
      setRegs((p) => p.map((r) => r.id === data.id ? data as Registration : r));
    }
  };

  // ---- Profile: Scheme CRUD ----
  const handleSchemeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSchemeForm((p) => {
      const next = { ...p, [name]: value };
      if (name === "scheme_type" && value !== "scholarship") {
        next.scholarship_category = "";
        next.student_name = "";
      }
      return next;
    });
  };

  const commissionCalc = useMemo(() => {
    const amt = parseFloat(schemeForm.amount) || 0;
    const pct = parseFloat(schemeForm.commission_percent) || 0;
    return Math.round((amt * pct) / 100);
  }, [schemeForm.amount, schemeForm.commission_percent]);

  const handleSchemeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    const amt = parseFloat(schemeForm.amount) || 0;
    const pct = parseFloat(schemeForm.commission_percent) || 0;
    const commAmt = Math.round((amt * pct) / 100);

    const { error } = await supabase.from("bandkam_schemes").insert({
      registration_id: selectedCustomer.id,
      applicant_name: selectedCustomer.applicant_name,
      scheme_type: schemeForm.scheme_type,
      scholarship_category: schemeForm.scheme_type === "scholarship" ? schemeForm.scholarship_category || null : null,
      student_name: schemeForm.student_name.trim() || null,
      year: schemeForm.year || null,
      amount: amt,
      commission_percent: pct,
      commission_amount: commAmt,
      received_amount: parseFloat(schemeForm.received_amount) || 0,
      payment_status: schemeForm.payment_status,
      payment_mode: schemeForm.payment_mode,
      status: schemeForm.status,
    });
    if (error) { toast.error("Save Error"); console.error(error); return; }
    toast.success("Scheme Entry Save! ✅");
    setSchemeForm(emptySchemeForm);
    setShowSchemeForm(false);
    fetchSchemes(selectedCustomer.id);
  };

  const deleteScheme = async (id: string) => {
    if (!confirm("हा Scheme रेकॉर्ड हटवायचा?")) return;
    const { error } = await supabase.from("bandkam_schemes").delete().eq("id", id);
    if (error) { toast.error("Delete Error"); return; }
    toast.success("Scheme हटवला!");
    setSchemes((p) => p.filter((s) => s.id !== id));
  };

  const startSchemeEdit = (s: Scheme) => {
    setSchemeEditId(s.id);
    setSchemeEditData({
      received_amount: String(s.received_amount),
      payment_status: s.payment_status,
      payment_mode: s.payment_mode || "cash",
      status: s.status,
    });
  };

  const saveSchemeEdit = async (id: string) => {
    const { error } = await supabase.from("bandkam_schemes").update({
      received_amount: parseFloat(schemeEditData.received_amount) || 0,
      payment_status: schemeEditData.payment_status,
      payment_mode: schemeEditData.payment_mode,
      status: schemeEditData.status,
    }).eq("id", id);
    if (error) { toast.error("Update Error"); return; }
    toast.success("Updated!");
    setSchemeEditId(null);
    if (selectedCustomer) fetchSchemes(selectedCustomer.id);
  };

  const filteredRegs = regs.filter((r) =>
    r.applicant_name.toLowerCase().includes(regSearch.toLowerCase()) ||
    (r.mobile_number && r.mobile_number.includes(regSearch)) ||
    (r.village && r.village.toLowerCase().includes(regSearch.toLowerCase()))
  );

  // ============ RENDER ============
  return (
    <div className="dash-root">
      {/* Header */}
      <nav className="mgmt-header">
        <button className="mgmt-back" onClick={() => view === "profile" ? (setView("list"), setSelectedCustomer(null)) : navigate("/management")}>
          <ArrowLeft size={18} /> {view === "profile" ? "Customer List" : "Management"}
        </button>
        <h1 className="mgmt-title">
          <HardHat size={24} style={{ display: "inline", verticalAlign: "-3px" }} />{" "}
          बांधकाम कामगार CRM
        </h1>
        <p className="mgmt-sub">Customer Registration & Schemes Management</p>
      </nav>

      <div className="pan-container">
        {/* ========== LIST VIEW ========== */}
        {view === "list" && (
          <>
            {/* Expiry Alert */}
            {expiringRegs.length > 0 && (
              <div className="bk-alert-banner">
                <AlertTriangle size={18} />
                <div>
                  <strong>⚠️ {expiringRegs.length} Customer(s) — Renewal in 7 days!</strong>
                  <div className="bk-alert-names">
                    {expiringRegs.map((r) => (
                      <span key={r.id} className="bk-alert-name-chip" onClick={() => openProfile(r)} style={{ cursor: "pointer" }}>
                        {r.applicant_name} — {r.expiry_date && new Date(r.expiry_date).toLocaleDateString("en-IN")}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Top bar */}
            <div className="pan-topbar">
              <button className="pan-add-btn" onClick={() => setShowRegForm((p) => !p)}>
                <Plus size={16} /> {showRegForm ? "बंद करा" : "नवीन Customer"}
              </button>
              <div className="pan-search-wrap">
                <Search size={15} />
                <input type="text" placeholder="Search name / mobile / village..." value={regSearch} onChange={(e) => setRegSearch(e.target.value)} className="pan-search" />
              </div>
            </div>

            {/* Customer Entry Form */}
            {showRegForm && (
              <form className="pan-form" onSubmit={handleRegSubmit}>
                <h3 className="pan-form-title">📝 नवीन Customer Entry</h3>
                <div className="pan-form-grid">
                  <div className="pan-field">
                    <label>प्रकार (Type)</label>
                    <select name="registration_type" value={regForm.registration_type} onChange={handleRegChange}>
                      <option value="new">New (नवीन)</option>
                      <option value="renewal">Renewal (नूतनीकरण)</option>
                      <option value="already_activated">Already Activated</option>
                    </select>
                  </div>
                  <div className="pan-field">
                    <label>File Received Date</label>
                    <input type="date" value={today} disabled />
                  </div>
                  <div className="pan-field">
                    <label>Customer नाव (Name) *</label>
                    <input name="applicant_name" value={regForm.applicant_name} onChange={handleRegChange} placeholder="Full Name" maxLength={100} />
                  </div>
                  <div className="pan-field">
                    <label>मोबाईल (Mobile)</label>
                    <input name="mobile_number" value={regForm.mobile_number} onChange={handleRegChange} placeholder="10 digit" maxLength={10} inputMode="numeric" />
                  </div>
                  <div className="pan-field">
                    <label>आधार नंबर (Aadhar)</label>
                    <input name="aadhar_number" value={regForm.aadhar_number} onChange={handleRegChange} placeholder="12 digit" maxLength={12} inputMode="numeric" />
                  </div>
                  <div className="pan-field">
                    <label>गाव (Village)</label>
                    <input name="village" value={regForm.village} onChange={handleRegChange} placeholder="Village" maxLength={100} />
                  </div>
                  <div className="pan-field">
                    <label>तालुका (Taluka)</label>
                    <input name="taluka" value={regForm.taluka} onChange={handleRegChange} placeholder="Taluka" maxLength={100} />
                  </div>
                  <div className="pan-field">
                    <label>जिल्हा (District)</label>
                    <input name="district" value={regForm.district} onChange={handleRegChange} placeholder="District" maxLength={100} />
                  </div>
                  <div className="pan-field">
                    <label>रक्कम (Amount) ₹</label>
                    <input name="amount" value={regForm.amount} onChange={handleRegChange} placeholder="0" type="number" min="0" step="1" />
                  </div>
                  <div className="pan-field">
                    <label>प्राप्त रक्कम (Received) ₹</label>
                    <input name="received_amount" value={regForm.received_amount} onChange={handleRegChange} placeholder="0" type="number" min="0" step="1" />
                  </div>
                  <div className="pan-field">
                    <label>बाकी (Pending) ₹</label>
                    <input value={`₹${Math.max(0, (parseFloat(regForm.amount) || 0) - (parseFloat(regForm.received_amount) || 0))}`} disabled />
                  </div>
                  <div className="pan-field">
                    <label>पेमेंट मोड</label>
                    <select name="payment_mode" value={regForm.payment_mode} onChange={handleRegChange}>
                      <option value="cash">Cash 💵</option>
                      <option value="upi">UPI / Online 📱</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="pan-submit-btn"><IndianRupee size={16} /> Save Customer</button>
              </form>
            )}

            {/* Customer List Table */}
            <div className="pan-table-wrap">
              <h3 className="pan-table-heading">👥 Customers ({filteredRegs.length})</h3>
              {regLoading ? (
                <p style={{ textAlign: "center", padding: 32, opacity: 0.6 }}>Loading...</p>
              ) : filteredRegs.length === 0 ? (
                <p style={{ textAlign: "center", padding: 32, opacity: 0.6 }}>कोणताही Customer नाही</p>
              ) : (
                <div className="pan-table-scroll">
                  <table className="pan-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Type</th>
                        <th>Name</th>
                        <th>Mobile</th>
                        <th>Village</th>
                        <th>Status</th>
                        <th>Amount</th>
                        <th>Received</th>
                        <th>Payment</th>
                        <th>Expiry</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRegs.map((r, i) => {
                        const badge = regStatusBadge(r.status, r.expiry_date);
                        return (
                          <tr key={r.id} className="bk-customer-row" onClick={() => openProfile(r)} style={{ cursor: "pointer" }}>
                            <td>{i + 1}</td>
                            <td>
                              <span className="pan-type-badge">
                                {r.registration_type === "new" ? "New" : r.registration_type === "renewal" ? "Renewal" : "Activated"}
                              </span>
                            </td>
                            <td className="pan-name" style={{ fontWeight: 600 }}>{r.applicant_name}</td>
                            <td>{r.mobile_number || "—"}</td>
                            <td>{r.village || "—"}</td>
                            <td><span className={`bk-reg-badge ${badge.cls}`}>{badge.label}</span></td>
                            <td>₹{Number(r.amount).toFixed(0)}</td>
                            <td>₹{Number(r.received_amount).toFixed(0)}</td>
                            <td><span className={`pan-status ${statusClass(r.payment_status)}`}>{statusLabel(r.payment_status)}</span></td>
                            <td>{r.expiry_date ? new Date(r.expiry_date).toLocaleDateString("en-IN") : "—"}</td>
                            <td>
                              <div className="pan-action-btns" onClick={(e) => e.stopPropagation()}>
                                <button className="pan-edit-btn" onClick={() => openProfile(r)} title="Profile"><User size={14} /></button>
                                <button className="pan-del-btn" onClick={() => deleteReg(r.id)} title="Delete"><Trash2 size={15} /></button>
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
          </>
        )}

        {/* ========== PROFILE VIEW ========== */}
        {view === "profile" && selectedCustomer && (
          <div className="bk-profile">
            {/* Customer Info Card */}
            <div className="bk-profile-card">
              <div className="bk-profile-header">
                <div className="bk-profile-avatar">
                  <User size={32} />
                </div>
                <div className="bk-profile-info">
                  <h2 className="bk-profile-name">{selectedCustomer.applicant_name}</h2>
                  <div className="bk-profile-meta">
                    {selectedCustomer.mobile_number && <span>📱 {selectedCustomer.mobile_number}</span>}
                    {selectedCustomer.aadhar_number && <span>🆔 {selectedCustomer.aadhar_number}</span>}
                    {selectedCustomer.village && <span>🏘️ {selectedCustomer.village}</span>}
                    {selectedCustomer.taluka && <span>📍 {selectedCustomer.taluka}</span>}
                    {selectedCustomer.district && <span>🏛️ {selectedCustomer.district}</span>}
                  </div>
                  <div className="bk-profile-badges">
                    <span className="pan-type-badge">
                      {selectedCustomer.registration_type === "new" ? "New" : selectedCustomer.registration_type === "renewal" ? "Renewal" : "Activated"}
                    </span>
                    <span className={`bk-reg-badge ${regStatusBadge(selectedCustomer.status, selectedCustomer.expiry_date).cls}`}>
                      {regStatusBadge(selectedCustomer.status, selectedCustomer.expiry_date).label}
                    </span>
                    <span className={`pan-status ${statusClass(selectedCustomer.payment_status)}`}>
                      {statusLabel(selectedCustomer.payment_status)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Date Management */}
              <div className="bk-dates-section">
                <h3 className="bk-section-title"><Calendar size={16} /> Date Management</h3>
                <div className="bk-dates-grid">
                  <div className="bk-date-field">
                    <label>📅 File Received</label>
                    <input type="date" value={selectedCustomer.form_date} disabled />
                  </div>
                  <div className="bk-date-field">
                    <label>📅 Appointment Date (Online/Thumb)</label>
                    <input type="date" value={profileDates.appointment_date} onChange={(e) => setProfileDates((p) => ({ ...p, appointment_date: e.target.value }))} />
                  </div>
                  <div className="bk-date-field">
                    <label>✅ Activation Date</label>
                    <input type="date" value={profileDates.activation_date} onChange={(e) => setProfileDates((p) => ({ ...p, activation_date: e.target.value }))} />
                  </div>
                  <div className="bk-date-field">
                    <label>⏰ Expiry Date (Auto — 1 Year)</label>
                    <input type="date" value={profileDates.activation_date ? addYears(profileDates.activation_date, 1) : ""} disabled />
                  </div>
                </div>
                <button className="pan-submit-btn" style={{ marginTop: 12 }} onClick={saveProfileDates}>
                  <Check size={16} /> Save Dates
                </button>
              </div>
            </div>

            {/* Schemes Section */}
            <div className="bk-schemes-section">
              <div className="bk-schemes-header">
                <h3 className="bk-section-title">🎁 योजना / Schemes & Kits</h3>
                <button className="pan-add-btn" onClick={() => setShowSchemeForm((p) => !p)}>
                  <Plus size={16} /> {showSchemeForm ? "बंद करा" : "Add Scheme/Kit"}
                </button>
              </div>

              {showSchemeForm && (
                <form className="pan-form" onSubmit={handleSchemeSubmit}>
                  <h3 className="pan-form-title">🎁 नवीन Scheme / Kit Entry</h3>
                  <div className="pan-form-grid">
                    <div className="pan-field">
                      <label>Scheme / Kit Type</label>
                      <select name="scheme_type" value={schemeForm.scheme_type} onChange={handleSchemeChange}>
                        {SCHEME_TYPES.map((t) => <option key={t.value} value={t.value}>{t.icon} {t.label}</option>)}
                      </select>
                    </div>
                    {schemeForm.scheme_type === "scholarship" && (
                      <>
                        <div className="pan-field">
                          <label>Scholarship Category</label>
                          <select name="scholarship_category" value={schemeForm.scholarship_category} onChange={handleSchemeChange}>
                            <option value="">-- Select --</option>
                            {SCHOLARSHIP_CATS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                          </select>
                        </div>
                        <div className="pan-field">
                          <label>विद्यार्थ्याचे नाव (Student)</label>
                          <input name="student_name" value={schemeForm.student_name} onChange={handleSchemeChange} placeholder="Student Name" maxLength={100} />
                        </div>
                      </>
                    )}
                    <div className="pan-field">
                      <label>Year</label>
                      <input name="year" value={schemeForm.year} onChange={handleSchemeChange} placeholder="2026" maxLength={4} />
                    </div>
                    <div className="pan-field">
                      <label>रक्कम (Amount) ₹</label>
                      <input name="amount" value={schemeForm.amount} onChange={handleSchemeChange} placeholder="0" type="number" min="0" step="1" />
                    </div>
                    <div className="pan-field">
                      <label>Commission %</label>
                      <input name="commission_percent" value={schemeForm.commission_percent} onChange={handleSchemeChange} placeholder="0" type="number" min="0" max="100" step="0.01" />
                    </div>
                    <div className="pan-field">
                      <label>Commission (Auto) ₹</label>
                      <input value={`₹${commissionCalc}`} disabled />
                    </div>
                    <div className="pan-field">
                      <label>प्राप्त रक्कम (Received) ₹</label>
                      <input name="received_amount" value={schemeForm.received_amount} onChange={handleSchemeChange} placeholder="0" type="number" min="0" step="1" />
                    </div>
                    <div className="pan-field">
                      <label>Status</label>
                      <select name="status" value={schemeForm.status} onChange={handleSchemeChange}>
                        <option value="applied">Applied</option>
                        <option value="approved">Approved</option>
                        <option value="received">Received / लाभ मिळाला</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                    <div className="pan-field">
                      <label>पेमेंट मोड</label>
                      <select name="payment_mode" value={schemeForm.payment_mode} onChange={handleSchemeChange}>
                        <option value="cash">Cash 💵</option>
                        <option value="upi">UPI / Online 📱</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="pan-submit-btn"><IndianRupee size={16} /> Save Scheme</button>
                </form>
              )}

              {/* Schemes Table */}
              <div className="pan-table-wrap" style={{ marginTop: 16 }}>
                {schemeLoading ? (
                  <p style={{ textAlign: "center", padding: 24, opacity: 0.6 }}>Loading...</p>
                ) : schemes.length === 0 ? (
                  <p style={{ textAlign: "center", padding: 24, opacity: 0.6 }}>कोणतीही Scheme/Kit नाही — Add करा ⬆️</p>
                ) : (
                  <div className="pan-table-scroll">
                    <table className="pan-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Type</th>
                          <th>Category</th>
                          <th>Student</th>
                          <th>Year</th>
                          <th>Amount</th>
                          <th>Comm%</th>
                          <th>Commission</th>
                          <th>Received</th>
                          <th>Payment</th>
                          <th>Status</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {schemes.map((s, i) => {
                          const isEditing = schemeEditId === s.id;
                          const st = SCHEME_TYPES.find((t) => t.value === s.scheme_type);
                          const catLabel = SCHOLARSHIP_CATS.find((c) => c.value === s.scholarship_category)?.label || s.scholarship_category || "—";
                          return (
                            <tr key={s.id} className={isEditing ? "pan-row-editing" : ""}>
                              <td>{i + 1}</td>
                              <td><span className="pan-type-badge">{st?.icon} {st?.label || s.scheme_type}</span></td>
                              <td>{s.scheme_type === "scholarship" ? catLabel : "—"}</td>
                              <td>{s.student_name || "—"}</td>
                              <td>{s.year || "—"}</td>
                              <td>₹{Number(s.amount).toFixed(0)}</td>
                              <td>{s.commission_percent}%</td>
                              <td>₹{Number(s.commission_amount).toFixed(0)}</td>
                              <td>
                                {isEditing ? (
                                  <input type="number" className="pan-inline-input" value={schemeEditData.received_amount} onChange={(e) => setSchemeEditData((p) => ({ ...p, received_amount: e.target.value }))} min="0" />
                                ) : (
                                  <>₹{Number(s.received_amount).toFixed(0)}</>
                                )}
                              </td>
                              <td>
                                {isEditing ? (
                                  <select className="pan-inline-select" value={schemeEditData.payment_status} onChange={(e) => setSchemeEditData((p) => ({ ...p, payment_status: e.target.value }))}>
                                    <option value="unpaid">Unpaid</option>
                                    <option value="paid">Paid</option>
                                    <option value="partially_paid">Partial</option>
                                  </select>
                                ) : (
                                  <span className={`pan-status ${statusClass(s.payment_status)}`}>{statusLabel(s.payment_status)}</span>
                                )}
                              </td>
                              <td>
                                {isEditing ? (
                                  <select className="pan-inline-select" value={schemeEditData.status} onChange={(e) => setSchemeEditData((p) => ({ ...p, status: e.target.value }))}>
                                    <option value="applied">Applied</option>
                                    <option value="approved">Approved</option>
                                    <option value="received">Received</option>
                                    <option value="rejected">Rejected</option>
                                  </select>
                                ) : (
                                  schemeStatusLabel(s.status)
                                )}
                              </td>
                              <td>
                                <div className="pan-action-btns">
                                  {isEditing ? (
                                    <>
                                      <button className="pan-save-btn" onClick={() => saveSchemeEdit(s.id)} title="Save"><Check size={15} /></button>
                                      <button className="pan-cancel-btn" onClick={() => setSchemeEditId(null)} title="Cancel"><X size={15} /></button>
                                    </>
                                  ) : (
                                    <>
                                      <button className="pan-edit-btn" onClick={() => startSchemeEdit(s)} title="Edit"><Pencil size={14} /></button>
                                      <button className="pan-del-btn" onClick={() => deleteScheme(s.id)} title="Delete"><Trash2 size={15} /></button>
                                    </>
                                  )}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default BandkamKamgar;
