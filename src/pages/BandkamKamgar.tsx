import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  ArrowLeft, Plus, Search, Trash2, HardHat, IndianRupee,
  Pencil, Check, X, AlertTriangle, Calendar, RefreshCw,
} from "lucide-react";

// ---- Types ----
interface Registration {
  id: string;
  registration_type: string;
  applicant_name: string;
  mobile_number: string | null;
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
  { value: "essential_kit", label: "Essential Kit" },
  { value: "soft_kit", label: "Soft Kit" },
  { value: "scholarship", label: "Scholarship (शिष्यवृत्ती)" },
  { value: "pregnancy", label: "Pregnancy (गर्भवती)" },
  { value: "marriage", label: "Marriage (विवाह)" },
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
  dob: "",
  appointment_date: "",
  activation_date: "",
  amount: "",
  received_amount: "",
  payment_status: "unpaid",
  payment_mode: "cash",
};

const emptySchemeForm = {
  applicant_name: "",
  scheme_type: "essential_kit",
  scholarship_category: "",
  student_name: "",
  year: new Date().getFullYear().toString(),
  amount: "",
  commission_percent: "",
  received_amount: "",
  payment_status: "unpaid",
  payment_mode: "cash",
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
    return { label: "Expired", cls: "bk-badge-expired" };
  if (expiryDate && daysUntil(expiryDate) <= 7)
    return { label: "Expiring Soon", cls: "bk-badge-expiring" };
  if (status === "active")
    return { label: "Active", cls: "bk-badge-active" };
  return { label: "Pending", cls: "bk-badge-pending" };
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
  const [tab, setTab] = useState<"registration" | "schemes">("registration");

  // --- Registration state ---
  const [regs, setRegs] = useState<Registration[]>([]);
  const [regLoading, setRegLoading] = useState(true);
  const [regForm, setRegForm] = useState(emptyRegForm);
  const [showRegForm, setShowRegForm] = useState(false);
  const [regSearch, setRegSearch] = useState("");
  const [regEditId, setRegEditId] = useState<string | null>(null);
  const [regEditData, setRegEditData] = useState({ received_amount: "", payment_status: "", payment_mode: "", activation_date: "" });

  // --- Scheme state ---
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [schemeLoading, setSchemeLoading] = useState(true);
  const [schemeForm, setSchemeForm] = useState(emptySchemeForm);
  const [showSchemeForm, setShowSchemeForm] = useState(false);
  const [schemeSearch, setSchemeSearch] = useState("");
  const [schemeFilter, setSchemeFilter] = useState("all");
  const [schemeEditId, setSchemeEditId] = useState<string | null>(null);
  const [schemeEditData, setSchemeEditData] = useState({ received_amount: "", payment_status: "", payment_mode: "", status: "" });

  // ---- Fetchers ----
  const fetchRegs = useCallback(async () => {
    setRegLoading(true);
    const { data, error } = await supabase
      .from("bandkam_registrations")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error("Registration data लोड करताना Error");
    else setRegs((data as Registration[]) || []);
    setRegLoading(false);
  }, []);

  const fetchSchemes = useCallback(async () => {
    setSchemeLoading(true);
    const { data, error } = await supabase
      .from("bandkam_schemes")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error("Scheme data लोड करताना Error");
    else setSchemes((data as Scheme[]) || []);
    setSchemeLoading(false);
  }, []);

  useEffect(() => { fetchRegs(); fetchSchemes(); }, [fetchRegs, fetchSchemes]);

  // ---- Expiry Alert ----
  const expiringRegs = useMemo(() =>
    regs.filter((r) => r.expiry_date && daysUntil(r.expiry_date) >= 0 && daysUntil(r.expiry_date) <= 7),
    [regs]
  );

  // ---- Registration CRUD ----
  const handleRegChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setRegForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleRegSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.applicant_name.trim()) { toast.error("नाव आवश्यक आहे"); return; }
    if (regForm.mobile_number && !/^\d{10}$/.test(regForm.mobile_number)) { toast.error("Mobile 10 अंकी असावा"); return; }

    const activationDate = regForm.activation_date || null;
    const expiryDate = activationDate ? addYears(activationDate, 1) : null;
    const status = activationDate ? "active" : "pending";

    const { error } = await supabase.from("bandkam_registrations").insert({
      registration_type: regForm.registration_type,
      applicant_name: regForm.applicant_name.trim(),
      mobile_number: regForm.mobile_number || null,
      dob: regForm.dob || null,
      appointment_date: regForm.appointment_date || null,
      activation_date: activationDate,
      expiry_date: expiryDate,
      status,
      amount: parseFloat(regForm.amount) || 0,
      received_amount: parseFloat(regForm.received_amount) || 0,
      payment_status: regForm.payment_status,
      payment_mode: regForm.payment_mode,
    });
    if (error) { toast.error("Save करताना Error"); return; }
    toast.success("Registration Save झाला!");
    setRegForm(emptyRegForm);
    setShowRegForm(false);
    fetchRegs();
  };

  const deleteReg = async (id: string) => {
    if (!confirm("हा रेकॉर्ड हटवायचा?")) return;
    const { error } = await supabase.from("bandkam_registrations").delete().eq("id", id);
    if (error) { toast.error("Delete Error"); return; }
    toast.success("Record हटवला!");
    setRegs((p) => p.filter((r) => r.id !== id));
  };

  const startRegEdit = (r: Registration) => {
    setRegEditId(r.id);
    setRegEditData({
      received_amount: String(r.received_amount),
      payment_status: r.payment_status,
      payment_mode: r.payment_mode || "cash",
      activation_date: r.activation_date || "",
    });
  };

  const saveRegEdit = async (id: string) => {
    const activationDate = regEditData.activation_date || null;
    const expiryDate = activationDate ? addYears(activationDate, 1) : null;
    const status = activationDate ? (expiryDate && daysUntil(expiryDate) < 0 ? "expired" : "active") : "pending";

    const { error } = await supabase.from("bandkam_registrations").update({
      received_amount: parseFloat(regEditData.received_amount) || 0,
      payment_status: regEditData.payment_status,
      payment_mode: regEditData.payment_mode,
      activation_date: activationDate,
      expiry_date: expiryDate,
      status,
    }).eq("id", id);
    if (error) { toast.error("Update Error"); return; }
    toast.success("Updated!");
    setRegEditId(null);
    fetchRegs();
  };

  const filteredRegs = regs.filter((r) =>
    r.applicant_name.toLowerCase().includes(regSearch.toLowerCase()) ||
    (r.mobile_number && r.mobile_number.includes(regSearch))
  );

  // ---- Scheme CRUD ----
  const handleSchemeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSchemeForm((p) => {
      const next = { ...p, [name]: value };
      if (name === "scheme_type" && value !== "scholarship") next.scholarship_category = "";
      if (name === "amount" || name === "commission_percent") {
        const amt = parseFloat(name === "amount" ? value : p.amount) || 0;
        const pct = parseFloat(name === "commission_percent" ? value : p.commission_percent) || 0;
        // commission auto-calc is display only
      }
      return next;
    });
  };

  const handleSchemeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schemeForm.applicant_name.trim()) { toast.error("नाव आवश्यक"); return; }
    const amt = parseFloat(schemeForm.amount) || 0;
    const pct = parseFloat(schemeForm.commission_percent) || 0;
    const commAmt = Math.round((amt * pct) / 100);

    const { error } = await supabase.from("bandkam_schemes").insert({
      applicant_name: schemeForm.applicant_name.trim(),
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
    });
    if (error) { toast.error("Save Error"); return; }
    toast.success("Scheme Entry Save!");
    setSchemeForm(emptySchemeForm);
    setShowSchemeForm(false);
    fetchSchemes();
  };

  const deleteScheme = async (id: string) => {
    if (!confirm("हा रेकॉर्ड हटवायचा?")) return;
    const { error } = await supabase.from("bandkam_schemes").delete().eq("id", id);
    if (error) { toast.error("Delete Error"); return; }
    toast.success("Record हटवला!");
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
    fetchSchemes();
  };

  const filteredSchemes = schemes.filter((s) => {
    const matchSearch = s.applicant_name.toLowerCase().includes(schemeSearch.toLowerCase()) ||
      (s.student_name && s.student_name.toLowerCase().includes(schemeSearch.toLowerCase()));
    const matchFilter = schemeFilter === "all" || s.scheme_type === schemeFilter;
    return matchSearch && matchFilter;
  });

  const commissionCalc = useMemo(() => {
    const amt = parseFloat(schemeForm.amount) || 0;
    const pct = parseFloat(schemeForm.commission_percent) || 0;
    return Math.round((amt * pct) / 100);
  }, [schemeForm.amount, schemeForm.commission_percent]);

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="dash-root">
      {/* Header */}
      <nav className="mgmt-header">
        <button className="mgmt-back" onClick={() => navigate("/management")}>
          <ArrowLeft size={18} /> Management
        </button>
        <h1 className="mgmt-title">
          <HardHat size={24} style={{ display: "inline", verticalAlign: "-3px" }} />{" "}
          बांधकाम कामगार
        </h1>
        <p className="mgmt-sub">Bandkam Kamgar — Registration & Schemes CRM</p>
      </nav>

      <div className="pan-container">
        {/* Expiry Alert */}
        {expiringRegs.length > 0 && (
          <div className="bk-alert-banner">
            <AlertTriangle size={18} />
            <div>
              <strong>⚠️ {expiringRegs.length} Registration(s) expiring in 7 days!</strong>
              <div className="bk-alert-names">
                {expiringRegs.map((r) => (
                  <span key={r.id}>
                    {r.applicant_name} — {r.expiry_date && new Date(r.expiry_date).toLocaleDateString("en-IN")}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="bk-tabs">
          <button className={`bk-tab ${tab === "registration" ? "active" : ""}`} onClick={() => setTab("registration")}>
            📋 Registration
          </button>
          <button className={`bk-tab ${tab === "schemes" ? "active" : ""}`} onClick={() => setTab("schemes")}>
            🎁 Schemes
          </button>
        </div>

        {/* ========== REGISTRATION TAB ========== */}
        {tab === "registration" && (
          <>
            <div className="pan-topbar">
              <button className="pan-add-btn" onClick={() => setShowRegForm((p) => !p)}>
                <Plus size={16} /> {showRegForm ? "बंद करा" : "नवीन Registration"}
              </button>
              <div className="pan-search-wrap">
                <Search size={15} />
                <input type="text" placeholder="Search name / mobile..." value={regSearch} onChange={(e) => setRegSearch(e.target.value)} className="pan-search" />
              </div>
            </div>

            {showRegForm && (
              <form className="pan-form" onSubmit={handleRegSubmit}>
                <h3 className="pan-form-title">📝 नवीन Registration Entry</h3>
                <div className="pan-form-grid">
                  <div className="pan-field">
                    <label>प्रकार (Type)</label>
                    <select name="registration_type" value={regForm.registration_type} onChange={handleRegChange}>
                      <option value="new">New (नवीन)</option>
                      <option value="renewal">Renewal (नूतनीकरण)</option>
                    </select>
                  </div>
                  <div className="pan-field">
                    <label>Form Date</label>
                    <input type="date" value={today} disabled />
                  </div>
                  <div className="pan-field">
                    <label>अर्जदाराचे नाव (Name) *</label>
                    <input name="applicant_name" value={regForm.applicant_name} onChange={handleRegChange} placeholder="Full Name" maxLength={100} />
                  </div>
                  <div className="pan-field">
                    <label>मोबाईल (Mobile)</label>
                    <input name="mobile_number" value={regForm.mobile_number} onChange={handleRegChange} placeholder="10 digit" maxLength={10} inputMode="numeric" />
                  </div>
                  <div className="pan-field">
                    <label>जन्मतारीख (DOB)</label>
                    <input type="date" name="dob" value={regForm.dob} onChange={handleRegChange} />
                  </div>
                  <div className="pan-field">
                    <label>Appointment Date (Thumb)</label>
                    <input type="date" name="appointment_date" value={regForm.appointment_date} onChange={handleRegChange} />
                  </div>
                  <div className="pan-field">
                    <label>Activation Date</label>
                    <input type="date" name="activation_date" value={regForm.activation_date} onChange={handleRegChange} />
                  </div>
                  <div className="pan-field">
                    <label>Expiry Date (Auto)</label>
                    <input type="date" value={regForm.activation_date ? addYears(regForm.activation_date, 1) : ""} disabled />
                  </div>
                  <div className="pan-field">
                    <label>रक्कम (Amount) ₹</label>
                    <input name="amount" value={regForm.amount} onChange={handleRegChange} placeholder="0" type="number" min="0" step="0.01" />
                  </div>
                  <div className="pan-field">
                    <label>प्राप्त रक्कम (Received) ₹</label>
                    <input name="received_amount" value={regForm.received_amount} onChange={handleRegChange} placeholder="0" type="number" min="0" step="0.01" />
                  </div>
                  <div className="pan-field">
                    <label>पेमेंट स्थिती</label>
                    <select name="payment_status" value={regForm.payment_status} onChange={handleRegChange}>
                      <option value="unpaid">Unpaid</option>
                      <option value="paid">Paid</option>
                      <option value="partially_paid">Partially Paid</option>
                    </select>
                  </div>
                  <div className="pan-field">
                    <label>पेमेंट मोड</label>
                    <select name="payment_mode" value={regForm.payment_mode} onChange={handleRegChange}>
                      <option value="cash">Cash 💵</option>
                      <option value="upi">UPI 📱</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="pan-submit-btn"><IndianRupee size={16} /> Save Entry</button>
              </form>
            )}

            <div className="pan-table-wrap">
              <h3 className="pan-table-heading">📋 Registrations ({filteredRegs.length})</h3>
              {regLoading ? (
                <p style={{ textAlign: "center", padding: 32, opacity: 0.6 }}>Loading...</p>
              ) : filteredRegs.length === 0 ? (
                <p style={{ textAlign: "center", padding: 32, opacity: 0.6 }}>कोणताही रेकॉर्ड नाही</p>
              ) : (
                <div className="pan-table-scroll">
                  <table className="pan-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Type</th>
                        <th>Name</th>
                        <th>Mobile</th>
                        <th>Appointment</th>
                        <th>Activation</th>
                        <th>Expiry</th>
                        <th>Status</th>
                        <th>Amount</th>
                        <th>Received</th>
                        <th>Payment</th>
                        <th>Mode</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRegs.map((r, i) => {
                        const isEditing = regEditId === r.id;
                        const badge = regStatusBadge(r.status, r.expiry_date);
                        return (
                          <tr key={r.id} className={isEditing ? "pan-row-editing" : ""}>
                            <td>{i + 1}</td>
                            <td><span className="pan-type-badge">{r.registration_type === "new" ? "New" : "Renewal"}</span></td>
                            <td className="pan-name">{r.applicant_name}</td>
                            <td>{r.mobile_number || "—"}</td>
                            <td>{r.appointment_date ? new Date(r.appointment_date).toLocaleDateString("en-IN") : "—"}</td>
                            <td>
                              {isEditing ? (
                                <input type="date" className="pan-inline-input" style={{ width: 130 }} value={regEditData.activation_date} onChange={(e) => setRegEditData((p) => ({ ...p, activation_date: e.target.value }))} />
                              ) : (
                                r.activation_date ? new Date(r.activation_date).toLocaleDateString("en-IN") : "—"
                              )}
                            </td>
                            <td>{r.expiry_date ? new Date(r.expiry_date).toLocaleDateString("en-IN") : "—"}</td>
                            <td><span className={`bk-reg-badge ${badge.cls}`}>{badge.label}</span></td>
                            <td>₹{Number(r.amount).toFixed(0)}</td>
                            <td>
                              {isEditing ? (
                                <input type="number" className="pan-inline-input" value={regEditData.received_amount} onChange={(e) => setRegEditData((p) => ({ ...p, received_amount: e.target.value }))} min="0" step="0.01" />
                              ) : (
                                <>₹{Number(r.received_amount).toFixed(0)}</>
                              )}
                            </td>
                            <td>
                              {isEditing ? (
                                <select className="pan-inline-select" value={regEditData.payment_status} onChange={(e) => setRegEditData((p) => ({ ...p, payment_status: e.target.value }))}>
                                  <option value="unpaid">Unpaid</option>
                                  <option value="paid">Paid</option>
                                  <option value="partially_paid">Partial</option>
                                </select>
                              ) : (
                                <span className={`pan-status ${statusClass(r.payment_status)}`}>{statusLabel(r.payment_status)}</span>
                              )}
                            </td>
                            <td>
                              {isEditing ? (
                                <select className="pan-inline-select" value={regEditData.payment_mode} onChange={(e) => setRegEditData((p) => ({ ...p, payment_mode: e.target.value }))}>
                                  <option value="cash">Cash</option>
                                  <option value="upi">UPI</option>
                                </select>
                              ) : (
                                <>{r.payment_mode === "upi" ? "UPI" : "Cash"}</>
                              )}
                            </td>
                            <td>
                              <div className="pan-action-btns">
                                {isEditing ? (
                                  <>
                                    <button className="pan-save-btn" onClick={() => saveRegEdit(r.id)} title="Save"><Check size={15} /></button>
                                    <button className="pan-cancel-btn" onClick={() => setRegEditId(null)} title="Cancel"><X size={15} /></button>
                                  </>
                                ) : (
                                  <>
                                    <button className="pan-edit-btn" onClick={() => startRegEdit(r)} title="Edit"><Pencil size={14} /></button>
                                    <button className="pan-del-btn" onClick={() => deleteReg(r.id)} title="Delete"><Trash2 size={15} /></button>
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
          </>
        )}

        {/* ========== SCHEMES TAB ========== */}
        {tab === "schemes" && (
          <>
            <div className="pan-topbar">
              <button className="pan-add-btn" onClick={() => setShowSchemeForm((p) => !p)}>
                <Plus size={16} /> {showSchemeForm ? "बंद करा" : "नवीन Scheme Entry"}
              </button>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", flex: 1, justifyContent: "flex-end" }}>
                <select className="pan-inline-select" style={{ padding: "8px 12px", fontSize: 13 }} value={schemeFilter} onChange={(e) => setSchemeFilter(e.target.value)}>
                  <option value="all">All Schemes</option>
                  {SCHEME_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
                <div className="pan-search-wrap" style={{ maxWidth: 280 }}>
                  <Search size={15} />
                  <input type="text" placeholder="Search name..." value={schemeSearch} onChange={(e) => setSchemeSearch(e.target.value)} className="pan-search" />
                </div>
              </div>
            </div>

            {showSchemeForm && (
              <form className="pan-form" onSubmit={handleSchemeSubmit}>
                <h3 className="pan-form-title">🎁 नवीन Scheme Entry</h3>
                <div className="pan-form-grid">
                  <div className="pan-field">
                    <label>अर्जदाराचे नाव *</label>
                    <input name="applicant_name" value={schemeForm.applicant_name} onChange={handleSchemeChange} placeholder="Full Name" maxLength={100} />
                  </div>
                  <div className="pan-field">
                    <label>Scheme Type</label>
                    <select name="scheme_type" value={schemeForm.scheme_type} onChange={handleSchemeChange}>
                      {SCHEME_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                  {schemeForm.scheme_type === "scholarship" && (
                    <div className="pan-field">
                      <label>Scholarship Category</label>
                      <select name="scholarship_category" value={schemeForm.scholarship_category} onChange={handleSchemeChange}>
                        <option value="">-- Select --</option>
                        {SCHOLARSHIP_CATS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                      </select>
                    </div>
                  )}
                  {schemeForm.scheme_type === "scholarship" && (
                    <div className="pan-field">
                      <label>विद्यार्थ्याचे नाव (Student)</label>
                      <input name="student_name" value={schemeForm.student_name} onChange={handleSchemeChange} placeholder="Student Name" maxLength={100} />
                    </div>
                  )}
                  <div className="pan-field">
                    <label>Year</label>
                    <input name="year" value={schemeForm.year} onChange={handleSchemeChange} placeholder="2026" maxLength={4} />
                  </div>
                  <div className="pan-field">
                    <label>रक्कम (Amount) ₹</label>
                    <input name="amount" value={schemeForm.amount} onChange={handleSchemeChange} placeholder="0" type="number" min="0" step="0.01" />
                  </div>
                  <div className="pan-field">
                    <label>Commission %</label>
                    <input name="commission_percent" value={schemeForm.commission_percent} onChange={handleSchemeChange} placeholder="0" type="number" min="0" max="100" step="0.01" />
                  </div>
                  <div className="pan-field">
                    <label>Commission Amount (Auto)</label>
                    <input value={`₹${commissionCalc}`} disabled />
                  </div>
                  <div className="pan-field">
                    <label>प्राप्त रक्कम (Received) ₹</label>
                    <input name="received_amount" value={schemeForm.received_amount} onChange={handleSchemeChange} placeholder="0" type="number" min="0" step="0.01" />
                  </div>
                  <div className="pan-field">
                    <label>पेमेंट स्थिती</label>
                    <select name="payment_status" value={schemeForm.payment_status} onChange={handleSchemeChange}>
                      <option value="unpaid">Unpaid</option>
                      <option value="paid">Paid</option>
                      <option value="partially_paid">Partially Paid</option>
                    </select>
                  </div>
                  <div className="pan-field">
                    <label>पेमेंट मोड</label>
                    <select name="payment_mode" value={schemeForm.payment_mode} onChange={handleSchemeChange}>
                      <option value="cash">Cash 💵</option>
                      <option value="upi">UPI 📱</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="pan-submit-btn"><IndianRupee size={16} /> Save Entry</button>
              </form>
            )}

            <div className="pan-table-wrap">
              <h3 className="pan-table-heading">🎁 Schemes ({filteredSchemes.length})</h3>
              {schemeLoading ? (
                <p style={{ textAlign: "center", padding: 32, opacity: 0.6 }}>Loading...</p>
              ) : filteredSchemes.length === 0 ? (
                <p style={{ textAlign: "center", padding: 32, opacity: 0.6 }}>कोणताही रेकॉर्ड नाही</p>
              ) : (
                <div className="pan-table-scroll">
                  <table className="pan-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Scheme</th>
                        <th>Category</th>
                        <th>Student</th>
                        <th>Year</th>
                        <th>Amount</th>
                        <th>Comm%</th>
                        <th>Commission</th>
                        <th>Received</th>
                        <th>Payment</th>
                        <th>Mode</th>
                        <th>Status</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSchemes.map((s, i) => {
                        const isEditing = schemeEditId === s.id;
                        const schemeLabel = SCHEME_TYPES.find((t) => t.value === s.scheme_type)?.label || s.scheme_type;
                        const catLabel = SCHOLARSHIP_CATS.find((c) => c.value === s.scholarship_category)?.label || s.scholarship_category || "—";
                        return (
                          <tr key={s.id} className={isEditing ? "pan-row-editing" : ""}>
                            <td>{i + 1}</td>
                            <td className="pan-name">{s.applicant_name}</td>
                            <td><span className="pan-type-badge">{schemeLabel}</span></td>
                            <td>{s.scheme_type === "scholarship" ? catLabel : "—"}</td>
                            <td>{s.student_name || "—"}</td>
                            <td>{s.year || "—"}</td>
                            <td>₹{Number(s.amount).toFixed(0)}</td>
                            <td>{s.commission_percent}%</td>
                            <td>₹{Number(s.commission_amount).toFixed(0)}</td>
                            <td>
                              {isEditing ? (
                                <input type="number" className="pan-inline-input" value={schemeEditData.received_amount} onChange={(e) => setSchemeEditData((p) => ({ ...p, received_amount: e.target.value }))} min="0" step="0.01" />
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
                                <select className="pan-inline-select" value={schemeEditData.payment_mode} onChange={(e) => setSchemeEditData((p) => ({ ...p, payment_mode: e.target.value }))}>
                                  <option value="cash">Cash</option>
                                  <option value="upi">UPI</option>
                                </select>
                              ) : (
                                <>{s.payment_mode === "upi" ? "UPI" : "Cash"}</>
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
          </>
        )}
      </div>
    </div>
  );
};

export default BandkamKamgar;
