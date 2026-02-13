import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useWallet = () => {
  const { session, refreshProfile } = useAuth();

  const deductWallet = async (formType: string, formSubmissionId?: string) => {
    if (!session?.access_token) {
      toast.error("कृपया लॉगिन करा");
      return { success: false, error: "Not authenticated" };
    }

    try {
      const { data, error } = await supabase.functions.invoke("deduct-wallet", {
        body: {
          form_type: formType,
          form_submission_id: formSubmissionId,
        },
      });

      if (error) {
        toast.error("वॉलेट शुल्क कापता आलं नाही");
        return { success: false, error: error.message };
      }

      if (data?.error) {
        if (data.error === "Insufficient balance") {
          toast.error(data.message || "शिल्लक अपुरी आहे. कृपया रिचार्ज करा.");
        } else {
          toast.error(data.error);
        }
        return { success: false, error: data.error, data };
      }

      toast.success(data.message || "शुल्क यशस्वीरित्या कापलं!");
      await refreshProfile();
      return { success: true, data };
    } catch (err: any) {
      toast.error("वॉलेट ऑपरेशन अयशस्वी");
      return { success: false, error: err.message };
    }
  };

  const rechargeWallet = async (amount: number) => {
    if (!session?.access_token) {
      toast.error("कृपया लॉगिन करा");
      return null;
    }

    try {
      const { data, error } = await supabase.functions.invoke("create-razorpay-order", {
        body: { amount, purpose: "wallet_recharge" },
      });

      if (error || data?.error) {
        toast.error("Razorpay ऑर्डर तयार करता आली नाही");
        return null;
      }

      return data;
    } catch (err: any) {
      toast.error("रिचार्ज अयशस्वी");
      return null;
    }
  };

  const verifyPayment = async (
    razorpay_order_id: string,
    razorpay_payment_id: string,
    razorpay_signature: string,
    amount: number,
    purpose: string = "wallet_recharge"
  ) => {
    try {
      const { data, error } = await supabase.functions.invoke("verify-razorpay-payment", {
        body: {
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          amount,
          purpose,
        },
      });

      if (error || data?.error) {
        toast.error("पेमेंट सत्यापन अयशस्वी");
        return { success: false };
      }

      toast.success(data.message || "पेमेंट यशस्वी!");
      await refreshProfile();
      return { success: true, data };
    } catch (err: any) {
      toast.error("पेमेंट सत्यापन अयशस्वी");
      return { success: false };
    }
  };

  return { deductWallet, rechargeWallet, verifyPayment };
};
