-- =============================================
-- SETU Suvidha Auth + SaaS System Migration
-- =============================================

-- 1. Role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'vle');

-- 2. User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'vle',
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 4. Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  shop_name TEXT,
  shop_type TEXT CHECK (shop_type IN ('setu', 'csc', 'other')),
  mobile TEXT,
  address TEXT,
  district TEXT,
  taluka TEXT,
  is_active BOOLEAN DEFAULT true,
  wallet_balance NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 5. Auto-create profile + assign VLE role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'vle');

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Form pricing table (Admin sets these)
CREATE TABLE public.form_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_type TEXT NOT NULL UNIQUE,
  form_name TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.form_pricing ENABLE ROW LEVEL SECURITY;

-- 7. Wallet transactions
CREATE TABLE public.wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('credit', 'debit')),
  description TEXT,
  reference_id TEXT,
  balance_after NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

-- 8. Subscription plans
CREATE TABLE public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  duration_days INTEGER NOT NULL DEFAULT 30,
  features JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

-- 9. VLE subscriptions
CREATE TABLE public.vle_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_id UUID REFERENCES public.subscription_plans(id),
  start_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  end_date TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  razorpay_payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.vle_subscriptions ENABLE ROW LEVEL SECURITY;

-- 10. Add user_id to existing form_submissions table
ALTER TABLE public.form_submissions ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- =============================================
-- RLS POLICIES
-- =============================================

-- Profiles: users see own, admins see all
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- User roles: users see own, admins manage all
CREATE POLICY "Users can view own role" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Form pricing: everyone reads, admin writes
CREATE POLICY "Anyone can read pricing" ON public.form_pricing
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage pricing" ON public.form_pricing
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Wallet: users see own, admins see all
CREATE POLICY "Users view own wallet" ON public.wallet_transactions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins view all wallets" ON public.wallet_transactions
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Subscription plans: everyone reads, admin writes
CREATE POLICY "Anyone can read plans" ON public.subscription_plans
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage plans" ON public.subscription_plans
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- VLE subscriptions: users see own, admins manage all
CREATE POLICY "Users view own subscriptions" ON public.vle_subscriptions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins manage subscriptions" ON public.vle_subscriptions
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Form submissions: add policy for user_id
CREATE POLICY "Users view own submissions" ON public.form_submissions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own submissions" ON public.form_submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins view all submissions" ON public.form_submissions
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- Seed default form pricing
-- =============================================
INSERT INTO public.form_pricing (form_type, form_name, price) VALUES
  ('hamipatra', 'हमीपत्र', 30),
  ('self_declaration', 'स्वघोषणापत्र', 30),
  ('grievance', 'तक्रार अर्ज', 30),
  ('new_application', 'नवीन अर्ज', 30),
  ('caste_validity', 'जात वैधता', 50),
  ('income_cert', 'उत्पन्न प्रमाणपत्र', 50),
  ('pan_card', 'PAN Card', 100),
  ('voter_id', 'Voter ID Card', 100),
  ('bandkam_kamgar', 'बांधकाम कामगार', 50),
  ('rajpatra_marathi', 'राजपत्र (मराठी)', 80),
  ('rajpatra_english', 'राजपत्र (English)', 80),
  ('rajpatra_affidavit_712', 'राजपत्र शपथपत्र 7/12', 80)
ON CONFLICT (form_type) DO NOTHING;