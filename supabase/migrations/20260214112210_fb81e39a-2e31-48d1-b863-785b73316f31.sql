
-- Add user_id column to bandkam_registrations
ALTER TABLE public.bandkam_registrations ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Add user_id column to bandkam_schemes  
ALTER TABLE public.bandkam_schemes ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Add user_id column to pan_card_applications
ALTER TABLE public.pan_card_applications ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Add user_id column to voter_id_applications
ALTER TABLE public.voter_id_applications ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Drop old permissive "true" policies on bandkam_registrations
DROP POLICY IF EXISTS "Allow authenticated read bandkam_reg" ON public.bandkam_registrations;
DROP POLICY IF EXISTS "Allow authenticated insert bandkam_reg" ON public.bandkam_registrations;
DROP POLICY IF EXISTS "Allow authenticated update bandkam_reg" ON public.bandkam_registrations;
DROP POLICY IF EXISTS "Allow authenticated delete bandkam_reg" ON public.bandkam_registrations;

-- New per-user + admin policies for bandkam_registrations
CREATE POLICY "Users view own bandkam_reg" ON public.bandkam_registrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins view all bandkam_reg" ON public.bandkam_registrations FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users insert own bandkam_reg" ON public.bandkam_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own bandkam_reg" ON public.bandkam_registrations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own bandkam_reg" ON public.bandkam_registrations FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins manage bandkam_reg" ON public.bandkam_registrations FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Drop old policies on bandkam_schemes
DROP POLICY IF EXISTS "Allow authenticated read bandkam_schemes" ON public.bandkam_schemes;
DROP POLICY IF EXISTS "Allow authenticated insert bandkam_schemes" ON public.bandkam_schemes;
DROP POLICY IF EXISTS "Allow authenticated update bandkam_schemes" ON public.bandkam_schemes;
DROP POLICY IF EXISTS "Allow authenticated delete bandkam_schemes" ON public.bandkam_schemes;

-- New per-user + admin policies for bandkam_schemes
CREATE POLICY "Users view own bandkam_schemes" ON public.bandkam_schemes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins view all bandkam_schemes" ON public.bandkam_schemes FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users insert own bandkam_schemes" ON public.bandkam_schemes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own bandkam_schemes" ON public.bandkam_schemes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own bandkam_schemes" ON public.bandkam_schemes FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins manage bandkam_schemes" ON public.bandkam_schemes FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Drop old policies on pan_card_applications
DROP POLICY IF EXISTS "Allow authenticated read pan_card" ON public.pan_card_applications;
DROP POLICY IF EXISTS "Allow authenticated insert pan_card" ON public.pan_card_applications;
DROP POLICY IF EXISTS "Allow authenticated update pan_card" ON public.pan_card_applications;
DROP POLICY IF EXISTS "Allow authenticated delete pan_card" ON public.pan_card_applications;

-- New per-user + admin policies for pan_card_applications
CREATE POLICY "Users view own pan_card" ON public.pan_card_applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins view all pan_card" ON public.pan_card_applications FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users insert own pan_card" ON public.pan_card_applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own pan_card" ON public.pan_card_applications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own pan_card" ON public.pan_card_applications FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins manage pan_card" ON public.pan_card_applications FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Drop old policies on voter_id_applications
DROP POLICY IF EXISTS "Allow authenticated read voter_id" ON public.voter_id_applications;
DROP POLICY IF EXISTS "Allow authenticated insert voter_id" ON public.voter_id_applications;
DROP POLICY IF EXISTS "Allow authenticated update voter_id" ON public.voter_id_applications;
DROP POLICY IF EXISTS "Allow authenticated delete voter_id" ON public.voter_id_applications;

-- New per-user + admin policies for voter_id_applications
CREATE POLICY "Users view own voter_id" ON public.voter_id_applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins view all voter_id" ON public.voter_id_applications FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users insert own voter_id" ON public.voter_id_applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own voter_id" ON public.voter_id_applications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own voter_id" ON public.voter_id_applications FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins manage voter_id" ON public.voter_id_applications FOR ALL USING (public.has_role(auth.uid(), 'admin'));
