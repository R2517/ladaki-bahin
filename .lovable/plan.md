
# SETU Suvidha - Complete PRD Document (PHP/MySQL/Tailwind Stack)

तुम्हाला एक **single file** मध्ये पूर्ण PRD, database schema, UI specifications, API endpoints, page-by-page details, आणि implementation prompts दिले जातील. हे file `.md` format मध्ये असेल जे तुम्ही कोणत्याही AI tool मध्ये paste करू शकता.

---

## Plan: एक comprehensive `SETU_SUVIDHA_COMPLETE_PRD.md` file तयार करणे

या file मध्ये खालील सर्व sections असतील:

### 1. Project Overview & Tech Stack
- PHP 8.2+ (Laravel 11), MySQL 8.0, Tailwind CSS 3.4, Alpine.js
- Razorpay payment gateway, DomPDF for A4 prints

### 2. Complete Database Schema (MySQL)
- 12 tables: users, profiles, user_roles, form_submissions, form_pricing, wallet_transactions, subscription_plans, vle_subscriptions, pan_card_applications, voter_id_applications, bandkam_registrations, bandkam_schemes
- All relationships, indexes, constraints

### 3. Complete Route Map (40+ routes)
- Public routes: /, /about, /contact, /terms, /privacy, /refund, /disclaimer, /services, /how-it-works, /benefits, /faq, /bandkam-kamgar-info
- Auth routes: /login, /signup, /logout
- VLE Protected routes: /dashboard, /profile, /wallet, /billing, /management, /hamipatra, /self-declaration, /grievance, /new-application, /income-cert, /caste-validity, /rajpatra, /rajpatra-marathi, /rajpatra-english, /rajpatra-affidavit-712, /farmer-id-card, /pan-card, /voter-id, /bandkam-kamgar
- Admin routes: /admin, /admin/vles, /admin/pricing, /admin/plans, /admin/transactions, /admin/settings

### 4. Page-by-Page UI Specifications (सध्याच्या React code वरून exact copy)
- प्रत्येक page चा layout, components, forms, fields, buttons, colors
- Navbar: glassmorphism, logo, nav links, dark mode toggle, mobile hamburger
- Hero Section: gradient background, floating particles, stats cards, CTA buttons
- Dashboard: 24 color themes picker, search, service cards with badges (READY/NEW/HOT/FAST), live news ticker, wallet balance widget
- Login/Signup: split layout, branding panel, form with eye toggle
- Profile: 7 fields (name, mobile, shop name, shop type, address, district dropdown, taluka dropdown)
- Wallet: balance card, recharge dialog with preset amounts (100, 200, 500, 1000, 2000, 5000), transaction history table
- All 12 form pages with A4 print templates
- Admin pages: sidebar navigation, stats cards, VLE table, pricing table, plan editor

### 5. Complete CSS/Styling Details
- Glassmorphism effects, 24 color themes, dark/light mode
- Noto Sans Devanagari font for Marathi text
- All custom CSS classes (.dash-root, .dash-nav, .dash-card, .ticker-wrap, etc.)
- Print styles for A4 format (92% width border)
- Responsive breakpoints

### 6. API Endpoints (Backend)
- Auth: POST /login, POST /signup, POST /logout
- Wallet: POST /wallet/recharge, POST /wallet/deduct (atomic)
- Razorpay: POST /razorpay/create-order, POST /razorpay/verify
- Forms: CRUD for all 12 form types
- Admin: VLE management, pricing, plans, transactions, analytics

### 7. Wallet System Logic
- Atomic deduction with optimistic locking
- Razorpay integration flow (order create -> checkout -> verify -> credit)
- Balance check before form submit
- Transaction history with credit/debit tracking

### 8. Auth System
- Email + Password only (no social login)
- Role-based access (admin/vle)
- Session management, auto-refresh
- Middleware for route protection

### 9. Maharashtra Districts & Talukas Data
- All 36 districts with their talukas (complete data already in project)
- Dependent dropdown logic

### 10. Form Type Pricing Map
- hamipatra, self_declaration, grievance, new_application, caste_validity, income_cert, rajpatra_marathi, rajpatra_english, rajpatra_affidavit_712, farmer_id_card

### 11. Complete Marathi/Hindi Text Content
- All UI labels, error messages, toast messages, FAQs, benefits, pricing plans
- Footer content, legal pages text

### 12. Implementation Prompts (Phase-wise)
- 14 detailed prompts for building each section

---

## Technical Details

### File Structure (PHP/Laravel)
```text
app/
  Http/
    Controllers/
      AuthController.php
      DashboardController.php
      FormController.php (12 forms)
      WalletController.php
      RazorpayController.php
      ProfileController.php
      Admin/
        AdminDashboardController.php
        VleController.php
        PricingController.php
        PlanController.php
        TransactionController.php
        SettingsController.php
    Middleware/
      AdminMiddleware.php
      VleMiddleware.php
  Models/
    User.php, Profile.php, UserRole.php
    FormSubmission.php, FormPricing.php
    WalletTransaction.php
    SubscriptionPlan.php, VleSubscription.php
    PanCardApplication.php, VoterIdApplication.php
    BandkamRegistration.php, BandkamScheme.php
  Services/
    WalletService.php (atomic operations)
    RazorpayService.php
resources/
  views/
    layouts/app.blade.php, admin.blade.php
    home.blade.php (hero, services, benefits, pricing, FAQ, CTA, footer)
    auth/login.blade.php, signup.blade.php
    dashboard.blade.php
    profile.blade.php
    wallet.blade.php
    billing.blade.php
    management.blade.php
    forms/ (12 form blade files + print templates)
    admin/ (dashboard, vles, pricing, plans, transactions, settings)
  css/
    app.css (2700+ lines of custom styles)
  js/
    app.js (Alpine.js components)
config/
  maharashtra.php (districts & talukas data)
  themes.php (24 color themes)
```

### Key Data Points Captured from Current Project
- 18 form service cards on dashboard (12 ready, 6 coming soon)
- 3 management services (PAN, Voter ID, Bandkam)
- 24 color themes with gradient nav backgrounds
- 6 benefit items, 6 FAQs, 3 pricing plans on home page
- 4 trust badges on home page
- Live news ticker with scrolling text
- A4 print format with specific Marathi legal text (Hamipatra disclaimer)
- Wallet preset amounts: 100, 200, 500, 1000, 2000, 5000
- Admin stats: total VLEs, active VLEs, total revenue, total forms

Implementation मध्ये मी एक single markdown file create करेन (~2000+ lines) ज्यात हे सगळं detail असेल.
