

## Windsurf साठी Advanced SaaS Prompt

हा prompt Windsurf मध्ये paste करा. यात तुमच्या सर्व requirements cover आहेत:

---

### Prompt (Copy करा):

```text
PROJECT: SETU Suvidha — SaaS Government Forms Portal
REPO: https://github.com/R2517/ladaki-bahin.git
DOMAIN: setusuvidha.com

TECH STACK (DO NOT CHANGE):
- React 18 + Vite + TypeScript + Tailwind CSS + shadcn/ui
- Supabase (external, project ID: frfrfzhatedurmzhzopu)
- React Router DOM, React Hook Form + Zod, Lucide icons
- Razorpay for payment gateway

SUPABASE CREDENTIALS (already in .env):
- URL: https://frfrfzhatedurmzhzopu.supabase.co
- Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyZnJmemhhdGVkdXJtemh6b3B1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0NTE4MTEsImV4cCI6MjA4NjAyNzgxMX0.VskP4Aug8cbUXxPm16ZRIbaL9zoK9Zd02OzCgM97gJg

EXISTING SUPABASE TABLES (DO NOT DELETE):
- form_submissions (JSONB form data)
- pan_card_applications
- voter_id_applications
- bandkam_registrations
- bandkam_schemes
- Storage bucket: "documents" (public)

DO NOT MODIFY:
- src/integrations/supabase/types.ts (auto-generated)
- Existing shadcn/ui components unless necessary

═══════════════════════════════════════
FEATURE REQUEST: Complete Auth + SaaS System
═══════════════════════════════════════

Build a complete SaaS authentication and billing system with TWO user roles:

## ROLE 1: VLE (Village Level Entrepreneur)
- Independent user who uses the portal to fill forms, print them, manage customers
- Has their own Setu/CSC shop
- Fills forms → prints → bills customers from their own billing page
- Manages their customers in management section

## ROLE 2: ADMIN
- SaaS owner who manages all VLEs
- Creates/manages VLE accounts
- Sets per-form charges (how much each form costs)
- Manages subscription plans
- Views all VLE activity, revenue, analytics

═══════════════════════════════════════
DETAILED REQUIREMENTS:
═══════════════════════════════════════

### 1. AUTHENTICATION (Email only, Supabase Auth)
- Email + Password login/signup ONLY (no social login)
- Login page at /login, Signup page at /signup
- After login, redirect based on role:
  - VLE → /dashboard (existing dashboard)
  - Admin → /admin (new admin dashboard)
- Protect ALL existing routes — must be logged in
- Use Supabase Auth (auth.signUp, auth.signInWithPassword)
- Store session, auto-refresh tokens
- Logout button in header/sidebar

### 2. DATABASE SCHEMA (Supabase migrations via CLI: supabase migration new)

Create these NEW tables (use supabase db push to apply):

```sql
-- Role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'vle');

-- User roles table (NEVER store role on profiles table directly)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'vle',
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents RLS recursion)
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

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  shop_name TEXT, -- Setu/CSC shop name
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

-- Auto-create profile + assign VLE role on signup
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

-- Form pricing table (Admin sets these)
CREATE TABLE public.form_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_type TEXT NOT NULL UNIQUE, -- matches form_type in form_submissions
  form_name TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0, -- per form charge in INR
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.form_pricing ENABLE ROW LEVEL SECURITY;

-- Wallet transactions
CREATE TABLE public.wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('credit', 'debit')),
  description TEXT,
  reference_id TEXT, -- Razorpay payment ID or form_submission ID
  balance_after NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

-- Subscription plans
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

-- VLE subscriptions
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

-- Add user_id to existing form_submissions table
ALTER TABLE public.form_submissions ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
```

### 3. RLS POLICIES

```sql
-- Profiles: users see own, admins see all
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- User roles: only admins can manage
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

-- Subscriptions: users see own
CREATE POLICY "Users view own subscriptions" ON public.vle_subscriptions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins manage subscriptions" ON public.vle_subscriptions
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));
```

### 4. WALLET SYSTEM
- VLE adds money to SETU Suvidha wallet via Razorpay
- When VLE fills/prints any form, the form charge (set by admin in form_pricing) is auto-deducted from wallet
- If wallet balance < form price → show "Insufficient Balance, please recharge"
- Wallet page shows: current balance, transaction history (credits/debits), recharge button
- Create a Supabase Edge Function for wallet deduction (atomic operation):

```typescript
// supabase/functions/deduct-wallet/index.ts
// - Verify user auth
// - Check wallet balance >= form price
// - Deduct amount from profiles.wallet_balance
// - Insert wallet_transaction record
// - Return success/failure
```

### 5. RAZORPAY PAYMENT GATEWAY
- Integration for wallet recharge and subscription payments
- Use Razorpay Web SDK (checkout.js) on frontend
- Create Supabase Edge Function for order creation and payment verification:

```typescript
// supabase/functions/create-razorpay-order/index.ts
// - Create Razorpay order using Razorpay API
// - Return order_id to frontend

// supabase/functions/verify-razorpay-payment/index.ts
// - Verify payment signature
// - Credit wallet or activate subscription
// - Insert wallet_transaction
```

- Razorpay API keys will be stored as Supabase secrets:
  - RAZORPAY_KEY_ID
  - RAZORPAY_KEY_SECRET
- Frontend uses RAZORPAY_KEY_ID (publishable) for checkout

### 6. VLE PAGES (after login)

a) **Dashboard** (/dashboard) — existing, add wallet balance widget at top
b) **Profile** (/profile) — edit shop name, type (Setu/CSC), mobile, address, district, taluka
c) **Wallet** (/wallet) — balance, recharge via Razorpay, transaction history
d) **Billing** (/billing) — VLE's own shop billing (existing page, enhance it)
e) **Management** (/management) — VLE's own customer management (existing page)
f) All form pages remain same but add wallet deduction on form submit/print

### 7. ADMIN PAGES (after login)

a) **Admin Dashboard** (/admin) — total VLEs, revenue, active subscriptions, charts
b) **VLE Management** (/admin/vles) — list all VLEs, activate/deactivate, view details
c) **Form Pricing** (/admin/pricing) — set price per form type, enable/disable forms
d) **Subscription Plans** (/admin/plans) — create/edit plans (name, price, duration, features)
e) **Revenue/Transactions** (/admin/transactions) — all wallet transactions across VLEs
f) **Settings** (/admin/settings) — platform settings

### 8. AUTH CONTEXT & ROUTE PROTECTION

Create AuthContext with:
- currentUser (from Supabase auth)
- profile (from profiles table)
- role ('admin' | 'vle')
- isAdmin boolean
- loading state

Route protection:
- /login, /signup → public only (redirect if logged in)
- /admin/* → admin only
- All other routes → authenticated only (VLE or Admin)

### 9. UI/UX REQUIREMENTS
- Login/Signup pages: clean, professional, SETU Suvidha branding
- Use existing shadcn/ui components (Button, Input, Card, Table, etc.)
- Marathi + Hindi/English mixed UI (keep existing Marathi text)
- Mobile-first responsive
- Dark/light mode support (existing theme system)
- Toast notifications for all actions (sonner)

### 10. FIRST ADMIN SETUP
- After building, I will manually insert admin role via Supabase SQL:
```sql
-- First create admin account via signup, then:
INSERT INTO public.user_roles (user_id, role)
VALUES ('<admin-user-uuid>', 'admin');
```

### 11. FILE STRUCTURE
```
src/
  contexts/AuthContext.tsx
  hooks/useAuth.ts
  hooks/useWallet.ts
  hooks/useAdmin.ts
  components/
    auth/LoginForm.tsx
    auth/SignupForm.tsx
    auth/ProtectedRoute.tsx
    auth/AdminRoute.tsx
    wallet/WalletCard.tsx
    wallet/RechargeDialog.tsx
    wallet/TransactionHistory.tsx
    admin/AdminSidebar.tsx
    admin/VleTable.tsx
    admin/PricingTable.tsx
    admin/PlanEditor.tsx
    admin/RevenueChart.tsx
  pages/
    Login.tsx
    Signup.tsx
    Profile.tsx
    Wallet.tsx
    admin/AdminDashboard.tsx
    admin/AdminVles.tsx
    admin/AdminPricing.tsx
    admin/AdminPlans.tsx
    admin/AdminTransactions.tsx
    admin/AdminSettings.tsx
supabase/
  functions/
    deduct-wallet/index.ts
    create-razorpay-order/index.ts
    verify-razorpay-payment/index.ts
  migrations/
    <timestamp>_auth_system.sql
```

### IMPLEMENTATION ORDER:
1. Database schema + RLS policies (supabase migration new + supabase db push)
2. Auth context + login/signup pages
3. Route protection (ProtectedRoute, AdminRoute)
4. Profile page
5. Wallet system (UI + edge function)
6. Razorpay integration (edge functions + frontend)
7. Form wallet deduction on submit
8. Admin dashboard + VLE management
9. Admin pricing management
10. Admin subscription plans
11. Admin revenue/analytics

IMPORTANT RULES:
- Use Supabase CLI for all database changes (supabase db push)
- Edge functions deploy via: supabase functions deploy <name>
- NEVER modify src/integrations/supabase/types.ts manually
- After db push, regenerate types: supabase gen types typescript --project-id frfrfzhatedurmzhzopu > src/integrations/supabase/types.ts
- Use existing Supabase client from src/integrations/supabase/client.ts
- All form charges are in INR (₹)
- Wallet balance cannot go negative
- Every wallet transaction must be atomic (use edge function)

START WITH: Step 1 (Database schema) and Step 2 (Auth + Login/Signup)
Ask me for Razorpay API keys when you reach Step 6.
```

---

### Technical Notes

- **Database**: 8 new tables + 1 altered table, all with RLS
- **Edge Functions**: 3 new functions (wallet deduct, Razorpay order, Razorpay verify)
- **Auth**: Supabase Auth with email/password, role-based access via `user_roles` table
- **Wallet**: Atomic operations via edge functions to prevent race conditions
- **Razorpay**: Keys stored as Supabase secrets, checkout.js on frontend
- **Implementation**: 11-step sequential build order, Windsurf should ask for Razorpay keys at step 6

