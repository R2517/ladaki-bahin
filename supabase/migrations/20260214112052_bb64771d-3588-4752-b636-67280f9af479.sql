
-- Fix profiles: drop RESTRICTIVE and recreate as PERMISSIVE
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Fix user_roles: drop RESTRICTIVE and recreate as PERMISSIVE
DROP POLICY IF EXISTS "Users can view own role" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

CREATE POLICY "Users can view own role" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Fix form_submissions
DROP POLICY IF EXISTS "Users view own submissions" ON public.form_submissions;
DROP POLICY IF EXISTS "Admins view all submissions" ON public.form_submissions;
DROP POLICY IF EXISTS "Users insert own submissions" ON public.form_submissions;
DROP POLICY IF EXISTS "Users delete own submissions" ON public.form_submissions;
DROP POLICY IF EXISTS "Admins delete all submissions" ON public.form_submissions;

CREATE POLICY "Users view own submissions" ON public.form_submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins view all submissions" ON public.form_submissions FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users insert own submissions" ON public.form_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own submissions" ON public.form_submissions FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins delete all submissions" ON public.form_submissions FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Fix wallet_transactions
DROP POLICY IF EXISTS "Users view own wallet" ON public.wallet_transactions;
DROP POLICY IF EXISTS "Admins view all wallets" ON public.wallet_transactions;

CREATE POLICY "Users view own wallet" ON public.wallet_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins view all wallets" ON public.wallet_transactions FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Fix form_pricing
DROP POLICY IF EXISTS "Anyone can read pricing" ON public.form_pricing;
DROP POLICY IF EXISTS "Admins can manage pricing" ON public.form_pricing;

CREATE POLICY "Anyone can read pricing" ON public.form_pricing FOR SELECT USING (true);
CREATE POLICY "Admins can manage pricing" ON public.form_pricing FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Fix subscription_plans
DROP POLICY IF EXISTS "Anyone can read plans" ON public.subscription_plans;
DROP POLICY IF EXISTS "Admins can manage plans" ON public.subscription_plans;

CREATE POLICY "Anyone can read plans" ON public.subscription_plans FOR SELECT USING (true);
CREATE POLICY "Admins can manage plans" ON public.subscription_plans FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Fix vle_subscriptions
DROP POLICY IF EXISTS "Users view own subscriptions" ON public.vle_subscriptions;
DROP POLICY IF EXISTS "Admins manage subscriptions" ON public.vle_subscriptions;

CREATE POLICY "Users view own subscriptions" ON public.vle_subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins manage subscriptions" ON public.vle_subscriptions FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Fix bandkam_registrations
DROP POLICY IF EXISTS "Allow public read bandkam_reg" ON public.bandkam_registrations;
DROP POLICY IF EXISTS "Allow public insert bandkam_reg" ON public.bandkam_registrations;
DROP POLICY IF EXISTS "Allow public update bandkam_reg" ON public.bandkam_registrations;
DROP POLICY IF EXISTS "Allow public delete bandkam_reg" ON public.bandkam_registrations;

CREATE POLICY "Allow authenticated read bandkam_reg" ON public.bandkam_registrations FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert bandkam_reg" ON public.bandkam_registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update bandkam_reg" ON public.bandkam_registrations FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete bandkam_reg" ON public.bandkam_registrations FOR DELETE USING (true);

-- Fix bandkam_schemes
DROP POLICY IF EXISTS "Allow public read bandkam_schemes" ON public.bandkam_schemes;
DROP POLICY IF EXISTS "Allow public insert bandkam_schemes" ON public.bandkam_schemes;
DROP POLICY IF EXISTS "Allow public update bandkam_schemes" ON public.bandkam_schemes;
DROP POLICY IF EXISTS "Allow public delete bandkam_schemes" ON public.bandkam_schemes;

CREATE POLICY "Allow authenticated read bandkam_schemes" ON public.bandkam_schemes FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert bandkam_schemes" ON public.bandkam_schemes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update bandkam_schemes" ON public.bandkam_schemes FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete bandkam_schemes" ON public.bandkam_schemes FOR DELETE USING (true);

-- Fix pan_card_applications
DROP POLICY IF EXISTS "Allow public read pan_card" ON public.pan_card_applications;
DROP POLICY IF EXISTS "Allow public insert pan_card" ON public.pan_card_applications;
DROP POLICY IF EXISTS "Allow public update pan_card" ON public.pan_card_applications;
DROP POLICY IF EXISTS "Allow public delete pan_card" ON public.pan_card_applications;

CREATE POLICY "Allow authenticated read pan_card" ON public.pan_card_applications FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert pan_card" ON public.pan_card_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update pan_card" ON public.pan_card_applications FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete pan_card" ON public.pan_card_applications FOR DELETE USING (true);

-- Fix voter_id_applications
DROP POLICY IF EXISTS "Allow public read voter_id" ON public.voter_id_applications;
DROP POLICY IF EXISTS "Allow public insert voter_id" ON public.voter_id_applications;
DROP POLICY IF EXISTS "Allow public update voter_id" ON public.voter_id_applications;
DROP POLICY IF EXISTS "Allow public delete voter_id" ON public.voter_id_applications;

CREATE POLICY "Allow authenticated read voter_id" ON public.voter_id_applications FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert voter_id" ON public.voter_id_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update voter_id" ON public.voter_id_applications FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete voter_id" ON public.voter_id_applications FOR DELETE USING (true);
