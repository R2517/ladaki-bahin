# SETU Suvidha — Complete Build Prompt for Windsurf/Cursor

> **इस prompt को Windsurf में paste करो और PRD file (`SETU_SUVIDHA_COMPLETE_PRD.md`) भी project root में रखो।**

---

## MASTER PROMPT

तुम्हें एक **complete Laravel 11 + MySQL + Tailwind CSS + Alpine.js** web application बनानी है जिसका नाम **SETU Suvidha** है। यह Maharashtra के VLE (Village Level Entrepreneurs), CSC Centers और Maha e-Seva Kendras के लिए एक SaaS platform है।

**पूरा PRD document `SETU_SUVIDHA_COMPLETE_PRD.md` file में है — उसे पहले पढ़ो और उसके अनुसार exactly build करो।**

### Tech Stack (MUST USE):
- **PHP 8.2+** with **Laravel 11**
- **MySQL 8.0** (`utf8mb4_unicode_ci`)
- **Tailwind CSS v3.4** (compiled via Vite)
- **Alpine.js** (for interactivity — theme picker, dark mode, modals, dropdowns)
- **Laravel Breeze** (email+password auth only, NO social login)
- **Razorpay PHP SDK** (`razorpay/razorpay`) for payments
- **DomPDF** (`barryvdh/laravel-dompdf`) for A4 print/PDF
- **QR Code** (`simplesoftwareio/simple-qrcode`) for Farmer ID Card
- **Fonts**: `Noto Sans Devanagari` (Marathi text), `Inter` (English)

### Project Summary:
1. **12 Government Form Types** — Hamipatra, Self-Declaration, Grievance, New Application, Caste Validity, Income Certificate (4 print formats), Rajpatra Marathi, Rajpatra English, Rajpatra 7/12 Affidavit, Farmer ID Card
2. **3 CRM Modules** — PAN Card, Voter ID, Bandkam Kamgar (with schemes)
3. **Wallet System** — Prepaid wallet, Razorpay recharge, atomic deduction per form, transaction history
4. **Admin Panel** — VLE management, form pricing editor, subscription plans, transactions log, settings
5. **24 Color Themes** — Dashboard nav gradient changes per theme, stored in localStorage
6. **Dark/Light Mode** — Alpine.js + Tailwind `dark:` classes
7. **Role-Based Access** — Admin and VLE roles via `user_roles` table
8. **Maharashtra Data** — All 36 districts with talukas (dependent dropdowns)
9. **A4 Print Engine** — CSS `@media print` with 92% width border, Marathi legal text
10. **Marathi UI** — All labels, buttons, toasts, errors in Marathi/Hindi

---

## STEP-BY-STEP BUILD ORDER

### Phase 1: Project Setup & Database
```
laravel new setu-suvidha
cd setu-suvidha
composer require laravel/breeze razorpay/razorpay barryvdh/laravel-dompdf simplesoftwareio/simple-qrcode
php artisan breeze:install blade
npm install -D tailwindcss@3.4 @tailwindcss/forms alpinejs
```

- PRD Section 2 से **12 database migrations** बनाओ (users, profiles, user_roles, form_pricing, wallet_transactions, form_submissions, subscription_plans, vle_subscriptions, pan_card_applications, voter_id_applications, bandkam_registrations, bandkam_schemes)
- PRD से **3 seeders** बनाओ: FormPricingSeeder (10 forms), SubscriptionPlanSeeder (3 plans), AdminUserSeeder
- `config/maharashtra.php` — PRD Section 10 से पूरा 36-district data copy करो
- `config/themes.php` — PRD Section 6 से 24 themes copy करो

### Phase 2: Authentication
- Login page: **Split layout** — Left 50% amber gradient branding panel (3 feature items with icons), Right 50% form (email, password with eye toggle button)
- Signup page: Same split layout
- On registration: auto-create `profiles` row + `user_roles` row (role: 'vle')
- `AdminMiddleware`: check `user_roles` for `role = 'admin'`
- Redirect to `/dashboard` after login

### Phase 3: Layouts & Public Pages
- **app.blade.php**: Glassmorphism Navbar (backdrop-blur-xl, bg-white/80 dark:bg-gray-950/80), logo (Landmark icon + "SETU Suvidha"), nav links (मुख्यपृष्ठ, सेवा, फायदे, किंमती, FAQ, संपर्क), dark mode toggle, login/signup buttons, mobile hamburger. Footer with 4 columns.
- **Home page**: Hero (gradient bg, floating particles, stats), Services (12 cards grid), Benefits (6 items), Pricing (3 plans), Trust badges (4), FAQ (6 accordion), CTA section — **PRD Section 4.1-4.9 exactly follow करो**
- Static pages: About, Contact, Terms, Privacy, Refund, Disclaimer, Services, How It Works, Benefits, FAQ, Bandkam Info

### Phase 4: Dashboard
- **dashboard.blade.php** layout: Gradient nav (from selected theme), brand, **24-color theme picker** (Alpine.js popup with 24 dots), wallet balance button (₹), profile/admin/dark/logout buttons, 5 nav tabs
- Welcome banner with user name + stats chips
- **Live news ticker** with CSS marquee animation and LIVE badge
- **18 service cards** in 4-column grid — PRD Section 5.1 table exactly copy करो (icons, gradients, badges READY/NEW/HOT/FAST)
- Search filter for services
- Coming-soon cards show alert toast on click

### Phase 5: Profile Page
- 7 fields in 2-column grid: full_name*, mobile, shop_name, shop_type (dropdown: setu/csc/other), address (full-width), district (dropdown — 36 districts), taluka (dependent dropdown)
- Save button with loading spinner
- Back button to dashboard

### Phase 6: Wallet System
- **WalletService.php**: Atomic DB::transaction with `lockForUpdate()` for deduction. Check balance ≥ price, deduct, log transaction, rollback on failure.
- **Balance card**: Large ₹ amount with wallet icon
- **Recharge dialog**: 6 preset amounts (₹100, ₹200, ₹500, ₹1000, ₹2000, ₹5000) in 3x2 grid + custom input
- **Razorpay flow**: Create order → Open checkout → Verify HMAC-SHA256 → Credit wallet → Log transaction
- **Transaction history table**: Date, Description, Type (जमा green / खर्च red badge), Amount (green +/red -), Balance

### Phase 7: Form Engine (Generic)
- **FormController**: `show($formKey)` → render blade, `store(Request, $formKey)` → validate + wallet deduct + save JSON to form_submissions, `submissions($formKey)` → list, `delete($id)`, `print($id)`
- Each form page: Hero card first → click "फॉर्म भरा" → form slides in → submit → auto-reset → submissions table below
- Wallet deduction happens on form save (if pricing exists for that form_type)

### Phase 8: Build All 12 Forms
Follow PRD Sections 5.2 to 5.11 **EXACTLY**:
1. **हमीपत्र** — 7 fields, A4 print with 5-point Marathi disclaimer
2. **स्वयंघोषणापत्र** — 7 fields + purpose, oath text print
3. **तक्रार नोंदणी** — 7 fields + type + description textarea
4. **नवीन अर्ज** — 7 fields + type + description
5. **जात पडताळणी** — 7 fields + caste + sub-caste
6. **उत्पन्न प्रमाणपत्र** — Complex: applicant section, farm radio, photo+signature upload, district/taluka/village, 1yr/3yr income table with auto financial years, reason dropdown, **4 print formats** (New 3yr, New 1yr, Old, Landless)
7. **राजपत्र मराठी** — Old/New name (3 parts each), reason, print with Maharashtra logo
8. **राजपत्र English** — Same, names UPPERCASE, English gazette format
9. **राजपत्र ७/१२** — Same + address toggle checkbox
10. **शेतकरी ओळखपत्र** — Photo, name, address, gat no, area, mobile, QR code, ID card size print (85x55mm)

### Phase 9: CRM Modules
- **Management hub page**: 3 cards (PAN, Voter ID, Bandkam) linking to CRM pages
- **PAN Card CRM**: CRUD form (type, application_number, name, dob, mobile, amount, received, status, mode) + searchable table
- **Voter ID CRM**: Same pattern (type: new/correction/transfer/duplicate)
- **Bandkam Kamgar CRM**: Registration form + Schemes management, status cards (Pending/Activated/Expiring/Expired/All), sidebar filters, popups on name/scheme click

### Phase 10: Admin Panel
- **Sidebar layout** (264px fixed): 6 nav items (Dashboard, VLEs, Pricing, Plans, Transactions, Settings) + VLE Dashboard link + Logout
- **Dashboard**: 4 stat cards (Total VLEs, Active VLEs, Revenue, Forms)
- **VLE Management**: Table with active/inactive toggle switch
- **Pricing**: Inline price editor for all form types
- **Plans**: CRUD with JSON features editor
- **Transactions**: Global transaction log with filters
- **Settings**: Platform info

### Phase 11: Print Styles & Final Polish
- `@media print` CSS: Hide nav/footer, A4 portrait, 92% width border, `Noto Sans Devanagari` font
- All toast messages in Marathi (PRD Section 11.1)
- Responsive: Mobile-first, hamburger menu, stacked grids
- SEO: Title tags, meta descriptions, sitemap.xml, robots.txt
- CSRF on all forms
- Billing page: User's form usage history with pricing

---

## IMPORTANT RULES

1. **PRD is the source of truth** — `SETU_SUVIDHA_COMPLETE_PRD.md` file पढ़ो और exactly follow करो
2. **All UI text in Marathi/Hindi** — Labels, buttons, toasts, placeholders, errors सब Marathi में (PRD Section 11)
3. **Wallet is atomic** — `DB::transaction` + `lockForUpdate()` mandatory, no race conditions
4. **24 themes work via Alpine.js** — Theme selection → update CSS custom properties + nav gradient → save to localStorage
5. **Dark mode via Alpine.js** — `x-data` with localStorage, Tailwind `dark:` classes
6. **District→Taluka dependent dropdown** — Use `config('maharashtra.districts')` data
7. **Forms save as JSON** — `form_data` column in `form_submissions` table stores all dynamic fields
8. **Print = A4 CSS** — `@media print` with specific styles, NOT server-side PDF (except Farmer ID Card QR)
9. **Razorpay flow**: Edge function creates order → Frontend opens checkout → Callback verifies signature → Credit wallet
10. **No social login** — Email + Password only

---

## QUICK REFERENCE — DATABASE TABLES

| # | Table | Purpose |
|---|-------|---------|
| 1 | users | Laravel default auth |
| 2 | profiles | VLE profile (1:1 with users), has wallet_balance |
| 3 | user_roles | RBAC (admin/vle) |
| 4 | form_pricing | Admin-controlled per-form prices |
| 5 | wallet_transactions | Credit/Debit ledger |
| 6 | form_submissions | All form data (JSON) |
| 7 | subscription_plans | 3 plans (Basic/Pro/Enterprise) |
| 8 | vle_subscriptions | User↔Plan mapping |
| 9 | pan_card_applications | PAN CRM |
| 10 | voter_id_applications | Voter ID CRM |
| 11 | bandkam_registrations | Bandkam worker registrations |
| 12 | bandkam_schemes | Bandkam schemes (linked to registrations) |

---

## QUICK REFERENCE — 18 DASHBOARD SERVICE CARDS

| # | Title | Ready | Badge | Path |
|---|-------|-------|-------|------|
| 1 | हमीपत्र | ✅ | READY | /hamipatra |
| 2 | स्वयंघोषणापत्र | ✅ | READY | /self-declaration |
| 3 | तक्रार नोंदणी | ✅ | READY | /grievance |
| 4 | नवीन अर्ज | ✅ | READY | /new-application |
| 5 | शेतकरी ओळखपत्र | ✅ | NEW | /farmer-id-card |
| 6 | आधार सेवा केंद्र | ❌ | NEW | /aadhaar-hub |
| 7 | पॅन कार्ड सेवा | ❌ | FAST | /pan-card |
| 8 | बांधकाम कामगार 90 दिवस | ❌ | NEW | /bond-format |
| 9 | उत्पन्नाचे स्वयंघोषणापत्र | ✅ | READY | /income-cert |
| 10 | राजपत्र नमुना नोटीस | ✅ | READY | /rajpatra |
| 11 | जात प्रमाणपत्र शपथपत्र | ❌ | — | /caste-cert |
| 12 | EWS प्रमाणपत्र अर्ज | ❌ | — | /ews |
| 13 | भूमिहीन प्रमाणपत्र अर्ज | ❌ | — | /landless |
| 14 | अण्णासाहेब पाटील योजना | ❌ | — | /annasaheb |
| 15 | अल्पभूधारक प्रमाणपत्र | ❌ | — | /minority |
| 16 | नॉन क्रिमिलीयर शपथपत्र | ❌ | — | /non-creamy |
| 17 | जात पडताळणी | ✅ | READY | /caste-validity |
| 18 | अधिवास प्रमाणपत्र | ❌ | — | /domicile |

---

**START BUILDING FROM PHASE 1. Read `SETU_SUVIDHA_COMPLETE_PRD.md` for all detailed specs, CSS values, Marathi text content, form fields, print layouts, and theme configurations.**
