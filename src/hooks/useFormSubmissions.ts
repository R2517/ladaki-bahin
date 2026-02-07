import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface FormSubmission {
  id: string;
  form_type: string;
  applicant_name: string;
  form_data: Record<string, any>;
  created_at: string;
}

export const useFormSubmissions = (formType: string) => {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("form_submissions")
      .select("*")
      .eq("form_type", formType)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch error:", error);
      toast.error("Data लोड करताना Error आला");
    } else {
      setSubmissions((data as FormSubmission[]) || []);
    }
    setLoading(false);
  }, [formType]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const addSubmission = async (applicantName: string, formData: Record<string, any>) => {
    const { error } = await supabase.from("form_submissions").insert({
      form_type: formType,
      applicant_name: applicantName,
      form_data: formData,
    });

    if (error) {
      console.error("Insert error:", error);
      toast.error("Data Save करताना Error आला");
      return false;
    }
    toast.success("Data यशस्वीरित्या Save झाला!");
    await fetchSubmissions();
    return true;
  };

  const deleteSubmission = async (id: string) => {
    const { error } = await supabase.from("form_submissions").delete().eq("id", id);
    if (error) {
      console.error("Delete error:", error);
      toast.error("Delete करताना Error आला");
      return false;
    }
    toast.success("Record हटवला!");
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
    return true;
  };

  return { submissions, loading, addSubmission, deleteSubmission, refresh: fetchSubmissions };
};
