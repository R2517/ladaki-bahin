
-- Create bandkam_registrations table
CREATE TABLE public.bandkam_registrations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  registration_type text NOT NULL DEFAULT 'new',
  applicant_name text NOT NULL,
  mobile_number text,
  dob date,
  form_date date NOT NULL DEFAULT CURRENT_DATE,
  appointment_date date,
  activation_date date,
  expiry_date date,
  status text NOT NULL DEFAULT 'pending',
  amount numeric NOT NULL DEFAULT 0,
  received_amount numeric NOT NULL DEFAULT 0,
  payment_status text NOT NULL DEFAULT 'unpaid',
  payment_mode text DEFAULT 'cash',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create bandkam_schemes table
CREATE TABLE public.bandkam_schemes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  registration_id uuid REFERENCES public.bandkam_registrations(id) ON DELETE SET NULL,
  applicant_name text NOT NULL,
  scheme_type text NOT NULL,
  scholarship_category text,
  student_name text,
  year text,
  amount numeric NOT NULL DEFAULT 0,
  commission_percent numeric NOT NULL DEFAULT 0,
  commission_amount numeric NOT NULL DEFAULT 0,
  received_amount numeric NOT NULL DEFAULT 0,
  payment_status text NOT NULL DEFAULT 'unpaid',
  payment_mode text DEFAULT 'cash',
  status text NOT NULL DEFAULT 'applied',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bandkam_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bandkam_schemes ENABLE ROW LEVEL SECURITY;

-- Public access policies for bandkam_registrations
CREATE POLICY "Allow public read bandkam_reg" ON public.bandkam_registrations FOR SELECT USING (true);
CREATE POLICY "Allow public insert bandkam_reg" ON public.bandkam_registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update bandkam_reg" ON public.bandkam_registrations FOR UPDATE USING (true);
CREATE POLICY "Allow public delete bandkam_reg" ON public.bandkam_registrations FOR DELETE USING (true);

-- Public access policies for bandkam_schemes
CREATE POLICY "Allow public read bandkam_schemes" ON public.bandkam_schemes FOR SELECT USING (true);
CREATE POLICY "Allow public insert bandkam_schemes" ON public.bandkam_schemes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update bandkam_schemes" ON public.bandkam_schemes FOR UPDATE USING (true);
CREATE POLICY "Allow public delete bandkam_schemes" ON public.bandkam_schemes FOR DELETE USING (true);
