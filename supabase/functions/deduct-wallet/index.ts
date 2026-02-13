import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { form_type, form_submission_id, description } = await req.json();
    if (!form_type) {
      return new Response(JSON.stringify({ error: "form_type is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get form price
    const { data: pricing, error: pricingError } = await supabase
      .from("form_pricing")
      .select("price, form_name, is_active")
      .eq("form_type", form_type)
      .single();

    if (pricingError || !pricing) {
      return new Response(JSON.stringify({ error: "Form pricing not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!pricing.is_active) {
      return new Response(JSON.stringify({ error: "This form is currently disabled" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const formPrice = Number(pricing.price);

    // Get current wallet balance
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("wallet_balance")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return new Response(JSON.stringify({ error: "Profile not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const currentBalance = Number(profile.wallet_balance);

    if (currentBalance < formPrice) {
      return new Response(
        JSON.stringify({
          error: "Insufficient balance",
          required: formPrice,
          current: currentBalance,
          message: `शिल्लक अपुरी आहे. आवश्यक: ₹${formPrice}, उपलब्ध: ₹${currentBalance}`,
        }),
        {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Atomic deduction
    const newBalance = currentBalance - formPrice;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ wallet_balance: newBalance, updated_at: new Date().toISOString() })
      .eq("id", user.id)
      .eq("wallet_balance", currentBalance); // Optimistic lock

    if (updateError) {
      return new Response(JSON.stringify({ error: "Failed to deduct wallet" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Record transaction
    const { error: txError } = await supabase
      .from("wallet_transactions")
      .insert({
        user_id: user.id,
        amount: formPrice,
        type: "debit",
        description: description || `${pricing.form_name} फॉर्म शुल्क`,
        reference_id: form_submission_id || null,
        balance_after: newBalance,
      });

    if (txError) {
      // Rollback balance
      await supabase
        .from("profiles")
        .update({ wallet_balance: currentBalance })
        .eq("id", user.id);

      return new Response(JSON.stringify({ error: "Failed to record transaction" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        deducted: formPrice,
        balance_after: newBalance,
        message: `₹${formPrice} वजा केले. नवीन शिल्लक: ₹${newBalance}`,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
