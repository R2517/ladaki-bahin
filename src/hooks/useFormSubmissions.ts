import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface FormSubmission {
  id: string;
  form_type: string;
  applicant_name: string;
  form_data: Record<string, any>;
  created_at: string;
  user_id?: string;
}

const FORM_TYPE_TO_PRICING_KEY: Record<string, string> = {
  "हमीपत्र": "hamipatra",
  "स्वयंघोषणापत्र": "self_declaration",
  "तक्रार नोंदणी": "grievance",
  "नवीन अर्ज": "new_application",
  "जात पडताळणी": "caste_validity",
  "उत्पन्नाचे स्वयंघोषणापत्र": "income_cert",
  "राजपत्र-मराठी": "rajpatra_marathi",
  "राजपत्र-english": "rajpatra_english",
  "राजपत्र-७/१२": "rajpatra_affidavit_712",
  "शेतकरी ओळखपत्र": "farmer_id_card",
};

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
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    // Deduct wallet if pricing key exists
    const pricingKey = FORM_TYPE_TO_PRICING_KEY[formType];
    if (pricingKey && user) {
      const { data: deductResult, error: deductError } = await supabase.functions.invoke("deduct-wallet", {
        body: { form_type: pricingKey },
      });

      if (deductError) {
        toast.error("वॉलेट शुल्क कापता आलं नाही");
        return false;
      }

      if (deductResult?.error) {
        if (deductResult.error === "Insufficient balance") {
          toast.error(deductResult.message || "शिल्लक अपुरी आहे. कृपया वॉलेट रिचार्ज करा.");
        } else {
          toast.error(deductResult.error);
        }
        return false;
      }
    }

    const { error } = await supabase.from("form_submissions").insert({
      form_type: formType,
      applicant_name: applicantName,
      form_data: formData,
      user_id: user?.id,
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
