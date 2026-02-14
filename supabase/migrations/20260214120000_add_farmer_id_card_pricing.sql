-- Add farmer_id_card pricing entry
INSERT INTO public.form_pricing (form_type, form_name, price) VALUES
  ('farmer_id_card', 'शेतकरी ओळखपत्र', 10)
ON CONFLICT (form_type) DO NOTHING;
