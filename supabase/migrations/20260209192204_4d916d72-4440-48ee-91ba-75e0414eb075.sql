
CREATE TABLE public.voter_id_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_type TEXT NOT NULL DEFAULT 'new',
  application_number TEXT NOT NULL,
  applicant_name TEXT NOT NULL,
  dob DATE,
  mobile_number TEXT,
  amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  received_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  payment_status TEXT NOT NULL DEFAULT 'unpaid',
  payment_mode TEXT DEFAULT 'cash',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.voter_id_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read voter_id" ON public.voter_id_applications FOR SELECT USING (true);
CREATE POLICY "Allow public insert voter_id" ON public.voter_id_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete voter_id" ON public.voter_id_applications FOR DELETE USING (true);
CREATE POLICY "Allow public update voter_id" ON public.voter_id_applications FOR UPDATE USING (true);
