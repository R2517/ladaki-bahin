
-- Add online_date to registrations (between received and appointment)
ALTER TABLE public.bandkam_registrations ADD COLUMN online_date date;

-- Add scheme-specific date/name fields
ALTER TABLE public.bandkam_schemes ADD COLUMN beneficiary_name text;
ALTER TABLE public.bandkam_schemes ADD COLUMN apply_date date;
ALTER TABLE public.bandkam_schemes ADD COLUMN appointment_date date;
ALTER TABLE public.bandkam_schemes ADD COLUMN delivery_date date;
