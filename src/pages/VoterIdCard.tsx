import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  ArrowLeft,
  Plus,
  Search,
  Trash2,
  UserCheck,
  IndianRupee,
  Pencil,
  Check,
  X,
} from "lucide-react";

interface VoterApp {
  id: string;
  application_type: string;
  application_number: string;
  applicant_name: string;
  dob: string | null;
  mobile_number: string | null;
  amount: number;
  received_amount: number;
  payment_status: string;
  payment_mode: string | null;
  created_at: string;
}

const emptyForm = {
  application_type: "new",
  application_number: "",
  applicant_name: "",
  dob: "",
  mobile_number: "",
  amount: "",
  received_amount: "",
  payment_status: "unpaid",
  payment_mode: "cash",
};

const VoterIdCard = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<VoterApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ received_amount: "", payment_status: "", payment_mode: "" });

  const fetchRows = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("voter_id_applications")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error(error);
      toast.error("Data लोड करताना Error आला");
    } else {
      setRows((data as VoterApp[]) || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchRows(); }, [fetchRows]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.application_number.trim() || !form.applicant_name.trim()) {
      toast.error("Application Number आणि Name आवश्यक आहे");
      return;
    }
    if (form.mobile_number && !/^\d{10}$/.test(form.mobile_number)) {
      toast.error("Mobile number 10 अंकी असावा");
      return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("voter_id_applications").insert({
      application_type: form.application_type,
      application_number: form.application_number.trim(),
      applicant_name: form.applicant_name.trim(),
      dob: form.dob || null,
      mobile_number: form.mobile_number || null,
      amount: parseFloat(form.amount) || 0,
      received_amount: parseFloat(form.received_amount) || 0,
      payment_status: form.payment_status,
      payment_mode: form.payment_mode,
      user_id: user?.id,
    });
    if (error) { console.error(error); toast.error("Save करताना Error आला"); return; }
    toast.success("Record यशस्वीरित्या Save झाला!");
    setForm(emptyForm);
    setShowForm(false);
    fetchRows();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("हा रेकॉर्ड हटवायचा आहे?")) return;
    const { error } = await supabase.from("voter_id_applications").delete().eq("id", id);
    if (error) { toast.error("Delete करताना Error आला"); return; }
    toast.success("Record हटवला!");
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const startEdit = (r: VoterApp) => {
    setEditId(r.id);
    setEditData({ received_amount: String(r.received_amount), payment_status: r.payment_status, payment_mode: r.payment_mode || "cash" });
  };
  const cancelEdit = () => setEditId(null);
  const saveEdit = async (id: string) => {
    const { error } = await supabase.from("voter_id_applications").update({
      received_amount: parseFloat(editData.received_amount) || 0,
      payment_status: editData.payment_status,
      payment_mode: editData.payment_mode,
    }).eq("id", id);
    if (error) { console.error(error); toast.error("Update करताना Error आला"); return; }
    toast.success("Record updated!");
    setEditId(null);
    fetchRows();
  };

  const filtered = rows.filter((r) =>
    r.applicant_name.toLowerCase().includes(search.toLowerCase()) ||
    r.application_number.toLowerCase().includes(search.toLowerCase()) ||
    (r.mobile_number && r.mobile_number.includes(search))
  );

  const statusLabel = (s: string) => { if (s === "paid") return "Paid ✅"; if (s === "partially_paid") return "Partial ⚠️"; return "Unpaid ❌"; };
  const statusClass = (s: string) => { if (s === "paid") return "pan-status-paid"; if (s === "partially_paid") return "pan-status-partial"; return "pan-status-unpaid"; };
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="dash-root">
      <nav className="mgmt-header">
        <button className="mgmt-back" onClick={() => navigate("/management")}>
          <ArrowLeft size={18} /> Management
        </button>
        <h1 className="mgmt-title">
          <UserCheck size={24} style={{ display: "inline", verticalAlign: "-3px" }} />{" "}
          Voter ID Card
        </h1>
        <p className="mgmt-sub">New Voter ID / Correction — CRM</p>
      </nav>

      <div className="pan-container">
        <div className="pan-topbar">
          <button className="pan-add-btn" onClick={() => setShowForm((p) => !p)}>
            <Plus size={16} /> {showForm ? "बंद करा" : "नवीन Entry"}
          </button>
          <div className="pan-search-wrap">
            <Search size={15} />
            <input type="text" placeholder="Search name / app no / mobile..." value={search} onChange={(e) => setSearch(e.target.value)} className="pan-search" />
          </div>
        </div>

        {showForm && (
          <form className="pan-form" onSubmit={handleSubmit}>
            <h3 className="pan-form-title">📝 नवीन Voter ID Entry</h3>
            <div className="pan-form-grid">
              <div className="pan-field">
                <label>प्रकार (Type)</label>
                <select name="application_type" value={form.application_type} onChange={handleChange}>
                  <option value="new">New Voter ID</option>
                  <option value="correction">Voter ID Correction</option>
                </select>
              </div>
              <div className="pan-field"><label>Date</label><input type="date" value={today} disabled /></div>
              <div className="pan-field"><label>Application Number *</label><input name="application_number" value={form.application_number} onChange={handleChange} placeholder="Application No." maxLength={50} /></div>
              <div className="pan-field"><label>अर्जदाराचे नाव (Name) *</label><input name="applicant_name" value={form.applicant_name} onChange={handleChange} placeholder="Full Name" maxLength={100} /></div>
              <div className="pan-field"><label>जन्मतारीख (DOB)</label><input type="date" name="dob" value={form.dob} onChange={handleChange} /></div>
              <div className="pan-field"><label>मोबाईल (Mobile)</label><input name="mobile_number" value={form.mobile_number} onChange={handleChange} placeholder="10 digit mobile" maxLength={10} inputMode="numeric" /></div>
              <div className="pan-field"><label>रक्कम (Amount) ₹</label><input name="amount" value={form.amount} onChange={handleChange} placeholder="0" type="number" min="0" step="0.01" /></div>
              <div className="pan-field"><label>प्राप्त रक्कम (Received) ₹</label><input name="received_amount" value={form.received_amount} onChange={handleChange} placeholder="0" type="number" min="0" step="0.01" /></div>
              <div className="pan-field">
                <label>पेमेंट स्थिती</label>
                <select name="payment_status" value={form.payment_status} onChange={handleChange}>
                  <option value="unpaid">Unpaid</option><option value="paid">Paid</option><option value="partially_paid">Partially Paid</option>
                </select>
              </div>
              <div className="pan-field">
                <label>पेमेंट मोड</label>
                <select name="payment_mode" value={form.payment_mode} onChange={handleChange}>
                  <option value="cash">Cash 💵</option><option value="upi">UPI 📱</option>
                </select>
              </div>
            </div>
            <button type="submit" className="pan-submit-btn"><IndianRupee size={16} /> Save Entry</button>
          </form>
        )}

        <div className="pan-table-wrap">
          <h3 className="pan-table-heading">📋 Voter ID Applications ({filtered.length})</h3>
          {loading ? (
            <p style={{ textAlign: "center", padding: 32, opacity: 0.6 }}>Loading...</p>
          ) : filtered.length === 0 ? (
            <p style={{ textAlign: "center", padding: 32, opacity: 0.6 }}>कोणताही रेकॉर्ड नाही</p>
          ) : (
            <div className="pan-table-scroll">
              <table className="pan-table">
                <thead>
                  <tr><th>#</th><th>Date</th><th>Type</th><th>App No.</th><th>Name</th><th>Mobile</th><th>Amount</th><th>Received</th><th>Status</th><th>Mode</th><th></th></tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => {
                    const isEditing = editId === r.id;
                    return (
                      <tr key={r.id} className={isEditing ? "pan-row-editing" : ""}>
                        <td>{i + 1}</td>
                        <td>{new Date(r.created_at).toLocaleDateString("en-IN")}</td>
                        <td><span className="pan-type-badge">{r.application_type === "new" ? "New" : "Correction"}</span></td>
                        <td className="pan-app-no">{r.application_number}</td>
                        <td className="pan-name">{r.applicant_name}</td>
                        <td>{r.mobile_number || "—"}</td>
                        <td>₹{Number(r.amount).toFixed(0)}</td>
                        <td>{isEditing ? <input type="number" className="pan-inline-input" value={editData.received_amount} onChange={(e) => setEditData((p) => ({ ...p, received_amount: e.target.value }))} min="0" step="0.01" /> : <>₹{Number(r.received_amount).toFixed(0)}</>}</td>
                        <td>{isEditing ? <select className="pan-inline-select" value={editData.payment_status} onChange={(e) => setEditData((p) => ({ ...p, payment_status: e.target.value }))}><option value="unpaid">Unpaid</option><option value="paid">Paid</option><option value="partially_paid">Partial</option></select> : <span className={`pan-status ${statusClass(r.payment_status)}`}>{statusLabel(r.payment_status)}</span>}</td>
                        <td>{isEditing ? <select className="pan-inline-select" value={editData.payment_mode} onChange={(e) => setEditData((p) => ({ ...p, payment_mode: e.target.value }))}><option value="cash">Cash</option><option value="upi">UPI</option></select> : <>{r.payment_mode === "upi" ? "UPI" : "Cash"}</>}</td>
                        <td>
                          <div className="pan-action-btns">
                            {isEditing ? (<><button className="pan-save-btn" onClick={() => saveEdit(r.id)} title="Save"><Check size={15} /></button><button className="pan-cancel-btn" onClick={cancelEdit} title="Cancel"><X size={15} /></button></>) : (<><button className="pan-edit-btn" onClick={() => startEdit(r)} title="Edit"><Pencil size={14} /></button><button className="pan-del-btn" onClick={() => handleDelete(r.id)} title="Delete"><Trash2 size={15} /></button></>)}
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
  );
};

export default VoterIdCard;
