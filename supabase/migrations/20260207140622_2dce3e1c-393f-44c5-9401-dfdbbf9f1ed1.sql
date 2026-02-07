
-- Generic form submissions table for all services
CREATE TABLE public.form_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  form_type TEXT NOT NULL,
  applicant_name TEXT NOT NULL,
  form_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;

-- Public read/write for now (no auth yet)
CREATE POLICY "Allow public read" ON public.form_submissions FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.form_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete" ON public.form_submissions FOR DELETE USING (true);

-- Index for fast filtering by form_type
CREATE INDEX idx_form_submissions_type ON public.form_submissions (form_type);
CREATE INDEX idx_form_submissions_created ON public.form_submissions (created_at DESC);
