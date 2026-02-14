import { useState, useEffect, useCallback, useRef } from "react";
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

// Safety timeout — never let loading hang for more than 10 seconds
const FETCH_TIMEOUT_MS = 10000;

export const useFormSubmissions = (formType: string) => {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const fetchSubmissions = useCallback(async () => {
    if (!mountedRef.current) return;
    setLoading(true);
    setFetchError(null);

    // Safety timeout
    const timer = setTimeout(() => {
      if (mountedRef.current) {
        console.warn("[useFormSubmissions] Fetch timeout for:", formType);
        setLoading(false);
        setFetchError("डेटा लोड करण्यास खूप वेळ लागत आहे. कृपया पुन्हा प्रयत्न करा.");
      }
    }, FETCH_TIMEOUT_MS);

    try {
      const { data, error } = await supabase
        .from("form_submissions")
        .select("*")
        .eq("form_type", formType)
        .order("created_at", { ascending: false });

      clearTimeout(timer);
      if (!mountedRef.current) return;

      if (error) {
        console.error("[useFormSubmissions] Fetch error:", error);
        setFetchError("Data लोड करताना Error आला. कृपया पुन्हा प्रयत्न करा.");
        toast.error("Data लोड करताना Error आला");
      } else {
        setSubmissions((data as FormSubmission[]) || []);
        setFetchError(null);
      }
    } catch (err) {
      clearTimeout(timer);
      if (!mountedRef.current) return;
      console.error("[useFormSubmissions] Unexpected error:", err);
      setFetchError("नेटवर्क Error — कृपया इंटरनेट कनेक्शन तपासा.");
      toast.error("Data लोड करताना Error आला");
    } finally {
      clearTimeout(timer);
      if (mountedRef.current) setLoading(false);
    }
  }, [formType]);

  useEffect(() => {
    mountedRef.current = true;
    fetchSubmissions();
    return () => { mountedRef.current = false; };
  }, [fetchSubmissions]);

  const addSubmission = async (applicantName: string, formData: Record<string, any>) => {
    try {
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
        console.error("[useFormSubmissions] Insert error:", error);
        toast.error("Data Save करताना Error आला");
        return false;
      }
      toast.success("Data यशस्वीरित्या Save झाला!");
      await fetchSubmissions();
      return true;
    } catch (err) {
      console.error("[useFormSubmissions] addSubmission error:", err);
      toast.error("Data Save करताना Error आला. कृपया पुन्हा प्रयत्न करा.");
      return false;
    }
  };

  const deleteSubmission = async (id: string) => {
    try {
      const { error } = await supabase.from("form_submissions").delete().eq("id", id);
      if (error) {
        console.error("[useFormSubmissions] Delete error:", error);
        toast.error("Delete करताना Error आला");
        return false;
      }
      toast.success("Record हटवला!");
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
      return true;
    } catch (err) {
      console.error("[useFormSubmissions] deleteSubmission error:", err);
      toast.error("Delete करताना Error आला");
      return false;
    }
  };

  return { submissions, loading, fetchError, addSubmission, deleteSubmission, refresh: fetchSubmissions };
};
