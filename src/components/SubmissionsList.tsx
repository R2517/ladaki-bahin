import { Printer, Trash2, Loader2 } from "lucide-react";
import type { FormSubmission } from "@/hooks/useFormSubmissions";

interface SubmissionsListProps {
  submissions: FormSubmission[];
  loading: boolean;
  onDelete: (id: string) => void;
  onPrint: (submission: FormSubmission) => void;
  columns?: { key: string; label: string }[];
}

const SubmissionsList = ({
  submissions,
  loading,
  onDelete,
  onPrint,
  columns = [
    { key: "mobile", label: "मोबाईल" },
    { key: "aadhaar", label: "आधार" },
  ],
}: SubmissionsListProps) => {
  if (loading) {
    return (
      <div className="submissions-loading">
        <Loader2 size={20} className="animate-spin" style={{ color: "hsl(var(--primary))" }} />
        <span>डेटा लोड होत आहे...</span>
      </div>
    );
  }

  return (
    <div className="submissions-section">
      <div className="submissions-header">
        <h4 className="submissions-title">📋 भरलेले फॉर्म ({submissions.length})</h4>
      </div>

      {submissions.length === 0 ? (
        <p className="submissions-empty">अजून कोणताही फॉर्म भरलेला नाही.</p>
      ) : (
        <div className="submissions-table-wrap">
          <table className="submissions-table">
            <thead>
              <tr>
                <th>#</th>
                <th>नाव</th>
                {columns.map((col) => (
                  <th key={col.key}>{col.label}</th>
                ))}
                <th>तारीख</th>
                <th style={{ textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub, i) => (
                <tr key={sub.id}>
                  <td>{i + 1}</td>
                  <td className="submissions-name-cell">{sub.applicant_name}</td>
                  {columns.map((col) => (
                    <td key={col.key}>{sub.form_data?.[col.key] || "—"}</td>
                  ))}
                  <td className="submissions-date-cell">
                    {new Date(sub.created_at).toLocaleDateString("mr-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td>
                    <div className="submissions-actions">
                      <button
                        className="submissions-btn submissions-btn-print"
                        onClick={() => onPrint(sub)}
                        title="Print"
                      >
                        <Printer size={14} />
                      </button>
                      <button
                        className="submissions-btn submissions-btn-delete"
                        onClick={() => {
                          if (window.confirm("हा record हटवायचा आहे?")) {
                            onDelete(sub.id);
                          }
                        }}
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SubmissionsList;
