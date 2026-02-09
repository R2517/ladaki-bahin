
-- Add new columns to bandkam_registrations for customer details
ALTER TABLE public.bandkam_registrations
  ADD COLUMN IF NOT EXISTS aadhar_number text,
  ADD COLUMN IF NOT EXISTS village text,
  ADD COLUMN IF NOT EXISTS taluka text,
  ADD COLUMN IF NOT EXISTS district text;
