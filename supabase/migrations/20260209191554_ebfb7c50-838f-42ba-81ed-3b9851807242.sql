
-- PAN Card Applications CRM Table
CREATE TABLE public.pan_card_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_type TEXT NOT NULL DEFAULT 'new', -- 'new' or 'correction'
  application_number TEXT NOT NULL,
  applicant_name TEXT NOT NULL,
  dob DATE,
  mobile_number TEXT,
  amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  received_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  payment_status TEXT NOT NULL DEFAULT 'unpaid', -- 'paid', 'unpaid', 'partially_paid'
  payment_mode TEXT DEFAULT 'cash', -- 'cash', 'upi'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pan_card_applications ENABLE ROW LEVEL SECURITY;

-- Public access policies (matching existing pattern)
CREATE POLICY "Allow public read pan_card" ON public.pan_card_applications FOR SELECT USING (true);
CREATE POLICY "Allow public insert pan_card" ON public.pan_card_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete pan_card" ON public.pan_card_applications FOR DELETE USING (true);
CREATE POLICY "Allow public update pan_card" ON public.pan_card_applications FOR UPDATE USING (true);
