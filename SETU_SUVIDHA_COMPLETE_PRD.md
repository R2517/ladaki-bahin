# SETU Suvidha — Complete Technical PRD & Migration Guide
**(React/Supabase → PHP/Laravel/MySQL)**

This document contains **everything** needed to rebuild the SETU Suvidha platform using a **PHP (Laravel) + MySQL + Tailwind CSS** stack. It includes the database schema, UI specifications, business logic, API endpoints, complete form details, and a step-by-step implementation plan with prompts.

---

## 1. Project Overview

**SETU Suvidha** is a SaaS platform for **Village Level Entrepreneurs (VLEs)**, **CSC Centers**, and **Maha e-Seva Kendras** in Maharashtra. It allows VLEs to:
1.  **Fill & Print Government Forms** (12+ types like Hamipatra, Income Cert, Gazette).
2.  **Manage Customers** (CRM for PAN, Voter ID, Bandkam Kamgar).
3.  **Wallet System**: Pay-per-form model (Prepaid wallet recharged via Razorpay).
4.  **Admin Panel**: Manage VLEs, pricing, plans, and view analytics.

### Tech Stack (Target)
-   **Backend Framework**: PHP 8.2+ (Laravel 11 recommended)
-   **Database**: MySQL 8.0
-   **Frontend**: Blade Templates + Tailwind CSS v3.4 + Alpine.js (for interactivity)
-   **PDF Generation**: DomPDF or Snappy (wkhtmltopdf)
-   **Payment Gateway**: Razorpay
-   **Fonts**: `Noto Sans Devanagari` (Marathi), `Inter` (English)
-   **Hosting**: Linux (cPanel/VPS) or AWS

---

## 2. Complete Database Schema (MySQL)

Use `utf8mb4_unicode_ci` collation. **12 tables total.**

```sql
-- =========================================
-- 1. Users & Auth
-- =========================================
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email_verified_at TIMESTAMP NULL,
    remember_token VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =========================================
-- 2. User Roles (RBAC)
-- =========================================
CREATE TABLE user_roles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    role ENUM('admin', 'vle') DEFAULT 'vle',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_role (user_id, role)
);

-- Helper function (implement as middleware in Laravel)
-- has_role(user_id, role) → boolean

-- =========================================
-- 3. VLE Profiles (Extends User)
-- =========================================
CREATE TABLE profiles (
    id BIGINT UNSIGNED PRIMARY KEY, -- same as users.id (1:1)
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    shop_name VARCHAR(255),
    shop_type ENUM('setu', 'csc', 'other'),
    mobile VARCHAR(15),
    address TEXT,
    district VARCHAR(100),
    taluka VARCHAR(100),
    wallet_balance DECIMAL(10, 2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
);

-- =========================================
-- 4. Form Pricing (Admin Controlled)
-- =========================================
CREATE TABLE form_pricing (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    form_type VARCHAR(50) NOT NULL UNIQUE,  -- e.g., 'hamipatra', 'income_cert'
    form_name VARCHAR(100) NOT NULL,        -- e.g., 'हमीपत्र', 'उत्पन्नाचे स्वयंघोषणापत्र'
    price DECIMAL(8, 2) NOT NULL DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Seed data:
INSERT INTO form_pricing (form_type, form_name, price) VALUES
('hamipatra', 'हमीपत्र (Disclaimer)', 2.00),
('self_declaration', 'स्वयंघोषणापत्र', 2.00),
('grievance', 'तक्रार नोंदणी (Grievance)', 2.00),
('new_application', 'नवीन अर्ज (New Application)', 2.00),
('caste_validity', 'जात पडताळणी', 3.00),
('income_cert', 'उत्पन्नाचे स्वयंघोषणापत्र', 5.00),
('rajpatra_marathi', 'राजपत्र मराठी (Gazette)', 5.00),
('rajpatra_english', 'राजपत्र English (Gazette)', 5.00),
('rajpatra_affidavit_712', 'राजपत्र ७/१२ शपथपत्र', 5.00),
('farmer_id_card', 'शेतकरी ओळखपत्र (Farmer ID)', 3.00);

-- =========================================
-- 5. Wallet Transactions (Ledger)
-- =========================================
CREATE TABLE wallet_transactions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    type ENUM('credit', 'debit') NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    balance_after DECIMAL(10, 2) NOT NULL,
    description VARCHAR(255),
    reference_id VARCHAR(100),  -- Razorpay ID or Form Submission ID
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_created (user_id, created_at DESC)
);

-- =========================================
-- 6. Form Submissions (JSON Storage for Flexibility)
-- =========================================
CREATE TABLE form_submissions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    form_type VARCHAR(50) NOT NULL,
    applicant_name VARCHAR(255) NOT NULL,
    form_data JSON NOT NULL,  -- Stores all dynamic fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_form (user_id, form_type),
    INDEX idx_created (created_at DESC)
);

-- =========================================
-- 7. Subscription Plans
-- =========================================
CREATE TABLE subscription_plans (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(8, 2) NOT NULL,
    duration_days INT NOT NULL DEFAULT 30,
    features JSON DEFAULT '[]',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed:
INSERT INTO subscription_plans (name, price, duration_days, features) VALUES
('बेसिक', 0, 0, '["खाते तयार करा","सर्व फॉर्म्स वापरा","प्रति फॉर्म शुल्क","व्यवहार इतिहास"]'),
('प्रो', 49, 30, '["सर्व बेसिक फीचर्स","कमी शुल्क दर","प्राधान्य सपोर्ट","बल्क प्रिंट","अॅडव्हान्स रिपोर्ट्स"]'),
('एंटरप्राइज', 0, 0, '["सर्व प्रो फीचर्स","कस्टम ब्रँडिंग","API ऍक्सेस","डेडिकेटेड सपोर्ट","मल्टी-लोकेशन"]');

-- =========================================
-- 8. VLE Subscriptions
-- =========================================
CREATE TABLE vle_subscriptions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    plan_id BIGINT UNSIGNED,
    start_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP NOT NULL,
    status ENUM('active', 'expired') DEFAULT 'active',
    razorpay_payment_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES subscription_plans(id)
);

-- =========================================
-- 9. PAN Card Applications (CRM)
-- =========================================
CREATE TABLE pan_card_applications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED,
    application_type ENUM('new', 'correction', 'reprint') DEFAULT 'new',
    application_number VARCHAR(100) NOT NULL,
    applicant_name VARCHAR(255) NOT NULL,
    dob DATE,
    mobile_number VARCHAR(15),
    amount DECIMAL(10, 2) DEFAULT 0,
    received_amount DECIMAL(10, 2) DEFAULT 0,
    payment_status ENUM('unpaid', 'partial', 'paid') DEFAULT 'unpaid',
    payment_mode ENUM('cash', 'online', 'upi') DEFAULT 'cash',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user (user_id)
);

-- =========================================
-- 10. Voter ID Applications (CRM)
-- =========================================
CREATE TABLE voter_id_applications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED,
    application_type ENUM('new', 'correction', 'transfer', 'duplicate') DEFAULT 'new',
    application_number VARCHAR(100) NOT NULL,
    applicant_name VARCHAR(255) NOT NULL,
    dob DATE,
    mobile_number VARCHAR(15),
    amount DECIMAL(10, 2) DEFAULT 0,
    received_amount DECIMAL(10, 2) DEFAULT 0,
    payment_status ENUM('unpaid', 'partial', 'paid') DEFAULT 'unpaid',
    payment_mode ENUM('cash', 'online', 'upi') DEFAULT 'cash',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user (user_id)
);

-- =========================================
-- 11. Bandkam Kamgar Registrations (CRM)
-- =========================================
CREATE TABLE bandkam_registrations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED,
    applicant_name VARCHAR(255) NOT NULL,
    mobile_number VARCHAR(15),
    aadhar_number VARCHAR(12),
    dob DATE,
    district VARCHAR(100),
    taluka VARCHAR(100),
    village VARCHAR(100),
    registration_type ENUM('new', 'renewal') DEFAULT 'new',
    application_number VARCHAR(50),  -- MH...
    status ENUM('pending', 'activated', 'expired') DEFAULT 'pending',
    form_date DATE DEFAULT (CURRENT_DATE),
    appointment_date DATE,
    activation_date DATE,
    expiry_date DATE,
    online_date DATE,
    amount DECIMAL(10, 2) DEFAULT 0,
    received_amount DECIMAL(10, 2) DEFAULT 0,
    payment_status ENUM('unpaid', 'partial', 'paid') DEFAULT 'unpaid',
    payment_mode ENUM('cash', 'online', 'upi') DEFAULT 'cash',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_status (status)
);

-- =========================================
-- 12. Bandkam Kamgar Schemes
-- =========================================
CREATE TABLE bandkam_schemes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    registration_id BIGINT UNSIGNED,
    user_id BIGINT UNSIGNED,
    scheme_type VARCHAR(50) NOT NULL,  -- 'safety_kit', 'essential_kit', 'scholarship', etc.
    applicant_name VARCHAR(255) NOT NULL,
    beneficiary_name VARCHAR(255),
    student_name VARCHAR(255),
    scholarship_category VARCHAR(100),
    year VARCHAR(20),
    status ENUM('pending', 'applied', 'approved', 'delivered') DEFAULT 'applied',
    apply_date DATE,
    appointment_date DATE,
    delivery_date DATE,
    amount DECIMAL(10, 2) DEFAULT 0,
    received_amount DECIMAL(10, 2) DEFAULT 0,
    commission_percent DECIMAL(5, 2) DEFAULT 0,
    commission_amount DECIMAL(10, 2) DEFAULT 0,
    payment_status ENUM('unpaid', 'partial', 'paid') DEFAULT 'unpaid',
    payment_mode ENUM('cash', 'online', 'upi') DEFAULT 'cash',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (registration_id) REFERENCES bandkam_registrations(id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

---

## 3. Complete Route Map (45+ Routes)

### Public Routes
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | Home (Landing Page — Hero, Services, Benefits, Pricing, FAQ, CTA, Footer) |
| GET | `/about` | About Us |
| GET | `/contact` | Contact |
| GET | `/services` | Services List (12 services grid) |
| GET | `/how-it-works` | How It Works (4 steps) |
| GET | `/benefits` | Benefits Page |
| GET | `/faq` | FAQ Page |
| GET | `/bandkam-kamgar-info` | BOCW Info Page (17+ schemes, eligibility, documents) |
| GET | `/terms` | Terms & Conditions |
| GET | `/privacy` | Privacy Policy |
| GET | `/refund` | Refund Policy |
| GET | `/disclaimer` | Disclaimer |

### Auth Routes
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/login` | Login Page (Split layout) |
| POST | `/login` | Login Action |
| GET | `/signup` | Signup Page |
| POST | `/signup` | Register Action (auto-creates profile) |
| POST | `/logout` | Logout |

### VLE Dashboard (Protected: `auth` middleware)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/dashboard` | Main Dashboard (Service Grid, Ticker, Theme Picker) |
| GET | `/wallet` | Wallet Page (Balance, Recharge, History) |
| POST | `/wallet/recharge` | Razorpay Order Create |
| POST | `/wallet/verify` | Razorpay Signature Verify + Credit |
| GET | `/profile` | Profile Edit (7 fields) |
| POST | `/profile` | Update Profile |
| GET | `/billing` | Billing History |
| GET | `/management` | CRM Hub (PAN, Voter, Bandkam cards) |

### Form Routes (Protected: `auth` middleware)
| Method | Route | Description |
|--------|-------|-------------|
| GET/POST | `/hamipatra` | हमीपत्र (Disclaimer) |
| GET/POST | `/self-declaration` | स्वयंघोषणापत्र |
| GET/POST | `/grievance` | तक्रार नोंदणी |
| GET/POST | `/new-application` | नवीन अर्ज |
| GET/POST | `/caste-validity` | जात पडताळणी |
| GET/POST | `/income-cert` | उत्पन्नाचे स्वयंघोषणापत्र (4 print formats) |
| GET | `/rajpatra` | राजपत्र Hub (3 sub-forms) |
| GET/POST | `/rajpatra-marathi` | राजपत्र मराठी |
| GET/POST | `/rajpatra-english` | राजपत्र English |
| GET/POST | `/rajpatra-affidavit-712` | राजपत्र ७/१२ शपथपत्र |
| GET/POST | `/farmer-id-card` | शेतकरी ओळखपत्र (ID Card + QR) |

### CRM Routes (Protected: `auth` middleware)
| Method | Route | Description |
|--------|-------|-------------|
| GET/POST | `/pan-card` | PAN Card CRM (CRUD) |
| GET/POST | `/voter-id` | Voter ID CRM (CRUD) |
| GET/POST | `/bandkam-kamgar` | Bandkam Kamgar CRM (Registration + Schemes) |

### Admin Routes (Protected: `auth` + `admin` middleware)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/admin` | Admin Dashboard (Stats) |
| GET | `/admin/vles` | VLE Management (Active/Inactive toggle) |
| GET | `/admin/pricing` | Form Pricing Editor |
| POST | `/admin/pricing` | Update Form Price |
| GET | `/admin/plans` | Subscription Plan Editor |
| GET | `/admin/transactions` | All Wallet Transaction Logs |
| GET | `/admin/settings` | Platform Settings |

---

## 4. Page-by-Page UI Specifications

### 4.1 Navbar (Public Pages)
- **Glassmorphism effect**: `backdrop-blur-xl`, `bg-white/80 dark:bg-gray-950/80`
- **Logo**: Landmark icon (Lucide) + "SETU Suvidha" + "सेतू सुविधा — ई-सेवा पोर्टल" subtitle
- **Nav Links**: मुख्यपृष्ठ, सेवा, फायदे, किंमती, FAQ, संपर्क
- **Right side**: Dark mode toggle, "लॉगिन" button, "नोंदणी" button (gradient amber→orange)
- **Mobile**: Hamburger menu with gradient background slide-in

### 4.2 Hero Section
- **Background**: `gradient-to-br from-amber-50 via-orange-50 to-yellow-50` (dark: gray-950/900)
- **Floating particles**: 6 amber dots with `float` animation
- **Grid pattern**: `radial-gradient(circle, #000 1px, transparent 1px)` at 40px spacing, opacity 2%
- **Content**:
  - Badge: `🟢 महाराष्ट्रातील #1 ई-सेवा पोर्टल` (pulsing green dot)
  - H1: "SETU Suvidha" (gradient text gray-900→800→900)
  - Subtitle: "तुमच्या सरकारी कामांचा विश्वासू साथीदार"
  - Description: "सेतु सुविधा केंद्र, CSC केंद्र आणि ई-सेवा दुकानदारांसाठी — सर्व सरकारी फॉर्म्स, बिलिंग, वॉलेट आणि ग्राहक व्यवस्थापन एकाच ठिकाणी."
  - CTA Buttons: "मोफत नोंदणी करा" (amber gradient + arrow), "लॉगिन करा" (outline)
  - Stats: 3 cards — "5,000+ VLE केंद्र", "1,00,000+ फॉर्म्स प्रोसेस", "36 जिल्हे"
- **Animation**: Staggered fade-in with translate-y (100ms, 150ms, 300ms, 450ms, 600ms delays)

### 4.3 Services Section (Home Page)
- **12 service cards** in 4-column grid:
  1. हमीपत्र (blue gradient icon)
  2. स्वयंघोषणापत्र (emerald gradient)
  3. तक्रार अर्ज (amber→orange gradient)
  4. नवीन अर्ज (purple gradient)
  5. जात पडताळणी (pink→rose gradient)
  6. उत्पन्न प्रमाणपत्र (teal→cyan gradient)
  7. PAN Card (indigo gradient)
  8. Voter ID Card (red gradient)
  9. बांधकाम कामगार (yellow→amber gradient)
  10. राजपत्र मराठी (sky→blue gradient)
  11. राजपत्र English (lime→green gradient)
  12. राजपत्र ७/१२ (fuchsia→purple gradient)
- **Each card**: Icon (44px rounded-xl with gradient), title, description
- **Hover**: `-translate-y-1.5`, `shadow-xl`, icon `scale-110 rotate-3`

### 4.4 Benefits Section
6 items in 3-column grid:
1. 💰 **वॉलेट सिस्टम** — "प्रत्येक फॉर्मचे शुल्क आपोआप वॉलेट मधून कापले जाते. Razorpay ने रिचार्ज करा."
2. 📊 **बिलिंग ट्रॅकिंग** — "प्रत्येक ग्राहकाचे फॉर्म, शुल्क आणि व्यवहार रेकॉर्ड ठेवा."
3. 🛡️ **सुरक्षित डेटा** — "Supabase वर एन्क्रिप्टेड डेटा. तुमचा आणि ग्राहकांचा डेटा पूर्णपणे सुरक्षित."
4. ⏰ **वेळ वाचवा** — "एकदा फॉर्म भरा, कधीही प्रिंट करा. रेकॉर्ड कायम सेव्ह राहतो."
5. 🎧 **सपोर्ट** — "कोणतीही अडचण आली तर आमची टीम मदतीसाठी तयार आहे."
6. ⚡ **वेगवान** — "मोबाईल आणि कॉम्प्युटर दोन्हीवर वेगाने चालते. कुठूनही वापरा."

### 4.5 Pricing Section
3 plans in 3-column grid:
1. **बेसिक** — "मोफत" — ["खाते तयार करा", "सर्व फॉर्म्स वापरा", "प्रति फॉर्म शुल्क", "व्यवहार इतिहास"]
2. **प्रो** (Popular badge: "लोकप्रिय") — "₹49/महिना" — ["सर्व बेसिक फीचर्स", "कमी शुल्क दर", "प्राधान्य सपोर्ट", "बल्क प्रिंट", "अॅडव्हान्स रिपोर्ट्स"]
3. **एंटरप्राइज** — "संपर्क करा" — ["सर्व प्रो फीचर्स", "कस्टम ब्रँडिंग", "API ऍक्सेस", "डेडिकेटेड सपोर्ट", "मल्टी-लोकेशन"]

### 4.6 Trust Badges
4 badges: "🔒 SSL Encrypted", "🏛️ Government Forms", "💳 Razorpay Secure", "📱 Mobile Friendly"

### 4.7 FAQ Section
6 FAQ items (Accordion):
1. **"SETU Suvidha म्हणजे काय?"** — "SETU Suvidha हे महाराष्ट्रातील सेतु केंद्र, CSC केंद्र आणि ई-सेवा दुकानदारांसाठी एक ऑनलाइन फॉर्म पोर्टल आहे..."
2. **"नोंदणी मोफत आहे का?"** — "होय! नोंदणी पूर्णपणे मोफत आहे..."
3. **"वॉलेट कसे रिचार्ज करायचे?"** — "Razorpay पेमेंट गेटवे द्वारे..."
4. **"प्रत्येक फॉर्मचे शुल्क किती?"** — "₹1 ते ₹5 प्रति फॉर्म..."
5. **"डेटा सुरक्षित आहे का?"** — "होय. एन्क्रिप्टेड कनेक्शन आणि Row Level Security..."
6. **"परतावा मिळतो का?"** — "वॉलेट रिचार्ज केल्यानंतर रक्कम non-refundable..."

### 4.8 CTA Section
- **Background**: `gradient-to-r from-amber-600 to-orange-600`
- **Decorative blobs**: `white/5` circles with blur
- **Text**: "आजच सुरू करा!" + "मोफत नोंदणी करा आणि तुमच्या केंद्राचे सर्व फॉर्म काम डिजिटल करा."
- **Buttons**: "मोफत नोंदणी करा" (white bg), "संपर्क करा" (outline)

### 4.9 Footer
- **Background**: `gray-950` (dark)
- **4 columns**: Brand, Pages (5 links), Legal (4 links), Contact (email, phone, location)
- **Bottom bar**: Copyright + Terms/Privacy/Refund links

### 4.10 Login Page
- **Split layout**: Left 50% branding panel, Right 50% form
- **Left Panel** (hidden on mobile):
  - Background: `gradient-to-br from-amber-600 via-orange-600 to-amber-700`
  - Animated shapes: 3 pulsing circles (white/5)
  - Grid dots: `radial-gradient` at 30px spacing
  - Landmark icon (16x16 rounded-2xl, white/10 bg)
  - "SETU Suvidha" title
  - "सेतू सुविधा — तुमच्या सरकारी कामांचा विश्वासू साथीदार"
  - 3 feature items: "12+ सरकारी फॉर्म्स", "सुरक्षित डेटा, SSL एन्क्रिप्शन", "5,000+ VLE केंद्रांचा विश्वास"
- **Right Panel**:
  - "मुख्यपृष्ठावर जा" back link
  - Mobile logo (hidden on desktop)
  - H1: "लॉगिन करा"
  - Sub: "तुमच्या खात्यात लॉगिन करण्यासाठी माहिती भरा"
  - Email input, Password input (with eye toggle)
  - "लॉगिन करा" button (amber gradient)
  - "खातं नाही? मोफत नोंदणी करा" link
  - Footer: Terms + Privacy links

### 4.11 Dashboard (VLE)
- **Top Nav**: Gradient background (from selected theme), sticky
  - Left: Brand icon + "SETU Suvidha" + "सेतु सुविधा — महा ई-सेवा फॉर्म पोर्टल"
  - Color theme picker (🎨 button → popup with 24 color dots)
  - Wallet balance button (₹ amount)
  - Profile, Admin (if admin), Dark mode, Logout buttons
  - Nav Tabs: "🏠 सेतू सुविधा", "💰 बिलिंग", "⚙️ Management", "💳 वॉलेट", "👤 प्रोफाइल"
- **Banner**: Gradient rounded card with welcome message + stats chips
- **Live News Ticker**: Scrolling bar with LIVE badge, news items
- **Service Grid**: 4-column grid, 18 service cards (see section 5.1 for full list)
- **Search**: "सेवा शोधा..." input with search icon
- **Footer**: "© 2026 SETU Suvidha — सेतु सुविधा महा ई-सेवा पोर्टल"

### 4.12 Profile Page
- **7 form fields** in 2-column grid:
  1. पूर्ण नाव (full_name) *
  2. मोबाइल नंबर (mobile)
  3. दुकान/सेंटर नाव (shop_name)
  4. दुकान प्रकार (shop_type) — Dropdown: "सेतू सुविधा केंद्र", "CSC केंद्र", "इतर"
  5. पत्ता (address) — full width
  6. जिल्हा (district) — Dropdown (36 districts, dependent)
  7. तालुका (taluka) — Dropdown (dependent on district)
- **Button**: "प्रोफाइल सेव्ह करा"

### 4.13 Wallet Page
- **Balance Card**: Large ₹ amount display with wallet icon
- **Recharge Card**: "वॉलेट रिचार्ज" button opens dialog
- **Recharge Dialog**:
  - Preset amounts: ₹100, ₹200, ₹500, ₹1000, ₹2000, ₹5000 (3x2 grid)
  - Custom amount input
  - "₹{amount} Razorpay ने भरा" button
- **Transaction History Table**: तारीख, वर्णन, प्रकार (जमा/खर्च badge), रक्कम (green/red), शिल्लक

### 4.14 Admin Sidebar
- **Width**: 264px, fixed left
- **Navigation items**:
  1. 📊 डॅशबोर्ड → `/admin`
  2. 👥 VLE व्यवस्थापन → `/admin/vles`
  3. ₹ फॉर्म किंमत → `/admin/pricing`
  4. 💳 सबस्क्रिप्शन प्लॅन → `/admin/plans`
  5. ↔️ व्यवहार → `/admin/transactions`
  6. ⚙️ सेटिंग्ज → `/admin/settings`
- **Bottom**: "VLE Dashboard" link + "लॉगआउट" button

### 4.15 Admin Dashboard
4 stat cards:
1. एकूण VLE (blue icon)
2. सक्रिय VLE (green icon)
3. एकूण महसूल ₹ (emerald icon)
4. एकूण फॉर्म (purple icon)

---

## 5. Complete Form Details

### 5.1 Dashboard Service Cards (18 cards)

| # | ID | Title | Icon | Icon BG Gradient | Icon Color | Path | Ready | Badge |
|---|---|---|---|---|---|---|---|---|
| 1 | hamipatra | हमीपत्र (Disclaimer) | FileText | #DBEAFE→#BFDBFE | #2563EB | /hamipatra | ✅ | READY |
| 2 | self-declaration | स्वयंघोषणापत्र | Shield | #D1FAE5→#A7F3D0 | #059669 | /self-declaration | ✅ | READY |
| 3 | grievance | तक्रार नोंदणी (Grievance) | AlertTriangle | #FEF3C7→#FDE68A | #D97706 | /grievance | ✅ | READY |
| 4 | new-application | नवीन अर्ज (New Application) | FilePlus | #EDE9FE→#DDD6FE | #7C3AED | /new-application | ✅ | READY |
| 5 | farmer-id | शेतकरी ओळखपत्र (FARMER ID CARD) | Leaf | #DCFCE7→#BBF7D0 | #16A34A | /farmer-id-card | ✅ | NEW |
| 6 | aadhaar-hub | आधार सेवा केंद्र (Hub) | Fingerprint | #FFE4E6→#FECDD3 | #E11D48 | /aadhaar-hub | ❌ | NEW |
| 7 | pan-card | पॅन कार्ड सेवा (PAN Card) | CreditCard | #E0E7FF→#C7D2FE | #4338CA | /pan-card | ❌ | FAST |
| 8 | bond-format | बांधकाम कामगार 90 दिवस प्रमाणपत्र | FileSpreadsheet | #FFF7ED→#FED7AA | #EA580C | /bond-format | ❌ | NEW |
| 9 | income-cert | उत्पन्नाचे स्वयंघोषणापत्र | Landmark | #FCE7F3→#FBCFE8 | #DB2777 | /income-cert | ✅ | READY |
| 10 | revenue-notice | राजपत्र नमुना नोटीस | Scale | #ECFDF5→#BBF7D0 | #16A34A | /rajpatra | ✅ | READY |
| 11 | caste-cert | जात प्रमाणपत्रासाठीचे शपथपत्र | Users | #FDF4FF→#F5D0FE | #A855F7 | /caste-cert | ❌ | — |
| 12 | ews | EWS प्रमाणपत्रासाठीचा अर्ज | BookOpen | #F0FDF4→#BBF7D0 | #15803D | /ews | ❌ | — |
| 13 | landless | भूमिहीन प्रमाणपत्रासाठी अर्ज | Leaf | #ECFCCB→#BEF264 | #4D7C0F | /landless | ❌ | — |
| 14 | annasaheb | अण्णासाहेब पाटील योजनेचा अर्ज | Award | #FFE4E6→#FDA4AF | #BE123C | /annasaheb | ❌ | — |
| 15 | minority | अल्पभूधारक प्रमाणपत्रासाठी अर्ज | FileCheck | #F3E8FF→#E9D5FF | #9333EA | /minority | ❌ | — |
| 16 | non-creamy | नॉन क्रिमिलीयर प्रमाणपत्रासाठी शपथपत्र | GraduationCap | #FEF9C3→#FDE047 | #A16207 | /non-creamy | ❌ | — |
| 17 | caste-validity | जात पडताळणी | BadgeCheck | #CCFBF1→#99F6E4 | #0D9488 | /caste-validity | ✅ | READY |
| 18 | domicile | अधिवास प्रमाणपत्रासाठी स्वयंघोषणापत्र | Home | #DBEAFE→#93C5FD | #1D4ED8 | /domicile | ❌ | — |

Badge styles:
- `READY` → Green gradient (#22C55E→#16A34A)
- `NEW` → Orange gradient (#F97316→#EA580C)
- `HOT` → Red gradient (#EF4444→#DC2626)
- `FAST` → Cyan gradient (#06B6D4→#0891B2)

### 5.2 Form 1: हमीपत्र (Disclaimer)
**Fields**: लाडकी बहिण अर्ज नंबर, नाव*, आधार क्रमांक (12 digits), मोबाईल* (10 digits), राहणार (पत्ता), तालुका (readonly), जिल्हा (readonly)
**Validation**: Name required, Aadhaar 12 digits, Mobile 10 digits
**Print Layout (A4)**:
- Title: "हमीपत्र व (Disclaimer)"
- Subtitle: "लाडकी बहिण योजना – Re‑Verification / Grievance साठी"
- Body: "मी खाली सही करणारी..." → Name, Aadhaar, Mobile, Address, Taluka, District
- 5-point disclaimer in Marathi (ol list, justified text)
- Footer: Place, Date (auto), Signature line, Applicant name (auto-synced)
**After save**: Form auto-resets for next entry

### 5.3 Form 2: स्वयंघोषणापत्र (Self Declaration)
**Fields**: नाव*, आधार, मोबाईल*, राहणार, घोषणेचा उद्देश, तालुका (readonly), जिल्हा (readonly)
**Print**: Standard A4 with "मी याद्वारे सत्यप्रतिज्ञेवर घोषित करतो/करते..."

### 5.4 Form 3: तक्रार नोंदणी (Grievance)
**Fields**: नाव*, आधार, मोबाईल*, राहणार, तक्रारीचा प्रकार, तक्रारीचे वर्णन* (textarea)
**Print**: Title + applicant info + description in bordered box

### 5.5 Form 4: नवीन अर्ज (New Application)
**Fields**: नाव*, आधार, मोबाईल*, राहणार, अर्जाचा प्रकार, वर्णन
**Print**: Standard A4 government application format

### 5.6 Form 5: जात पडताळणी (Caste Validity)
**Fields**: नाव*, आधार, मोबाईल*, राहणार, जात, उपजात
**Print**: Caste validity affidavit format

### 5.7 Form 6: उत्पन्नाचे स्वयंघोषणापत्र (Income Certificate)
**Fields**:
- अर्जदार: पहिले नाव*, वडिलांचे/पतीचे नाव*, आडनाव*, वय*, मोबाईल*, व्यवसाय (dropdown: शेतमजुरी, शेती, व्यापार, नोकरी, मजुरी, इतर)
- शेती: हो/नाही radio → if हो: H (हेक्टर), R (आर)
- Photo upload, Signature upload
- पत्ता: जिल्हा (dropdown), तालुका (dependent dropdown), गाव
- उत्पन्न: Year type (1-year/3-year radio) → Dynamic table with financial years (auto-calculated), amount, words columns
- कारण: dropdown (शिक्षणासाठी, मुलांच्या शिक्षणासाठी, शासकीय कामासाठी, etc.)
- आधार

**4 Print Formats** (user selects before print):
1. नवीन ३-वर्ष — 3 year table, photos
2. नवीन १-वर्ष — 1 year, photos
3. जुना (Old format) — Without photos, different layout
4. भूमिहीन (Landless) — Special format for landless farmers

**Print**: A4 with Maharashtra government logo, bordered table, photo+signature boxes, "ठिकाण" + "दिनांक" pinned to bottom

### 5.8 Form 7: राजपत्र मराठी (Gazette - Marathi)
**Fields**: Old Name (3 parts: स्वत:चे नाव, वडिलांचे नाव, आडनाव), New Name (3 parts), कारण (dropdown: लग्नानंतर नाव बदल, धर्मांतर, वैयक्तिक कारण, नावातील चूक दुरुस्ती, न्यायालयीन आदेश, इतर), मोबाईल*, पिन कोड* (6 digits), आधार, जिल्हा, तालुका, गाव, पत्ता
**Print**: Maharashtra Government logo header, "नाव बदलण्याचा नमुना" title, Old/New name comparison table, notice text, signature lines, address section. Uses `Noto Sans Devanagari` font.

### 5.9 Form 8: राजपत्र English (Gazette - English)
**Fields**: Same as Marathi but in English. Names auto-converted to BLOCK LETTERS.
**Print**: English gazette format with government header

### 5.10 Form 9: राजपत्र ७/१२ शपथपत्र (Affidavit 7/12)
**Fields**: Same as Gazette + Address Toggle (checkbox: "जमिनीचा पत्ता आणि राहण्याचा पत्ता वेगळा आहे")
**Print**: 7/12 land record correction affidavit format

### 5.11 Form 10: शेतकरी ओळखपत्र (Farmer ID Card)
**Fields**: Photo, नाव, पत्ता, गट नं, क्षेत्र, मोबाईल
**Output**: ID Card size (85mm x 55mm) with QR code containing Farmer ID & Name
**Print**: Multiple cards per A4 page

### 5.12 Management CRM Hub
3 cards: PAN Card Service, Voter ID Service, Bandkam Kamgar
Each navigates to its respective CRM page with:
- Add new record form (4-column grid)
- Search/filter
- Table with edit/delete actions
- Payment tracking (amount, received, status, mode)

---

## 6. 24 Color Themes

Complete theme data for the color picker:

```php
// config/themes.php
<?php
return [
    ['name' => 'Teal', 'nav' => 'linear-gradient(135deg,#0f766e,#0d9488,#14b8a6)', 'primary' => '175 70% 38%', 'dark_primary' => '175 65% 50%', 'dot' => '#0d9488'],
    ['name' => 'Blue', 'nav' => 'linear-gradient(135deg,#1e3a8a,#2563eb,#3b82f6)', 'primary' => '224 76% 48%', 'dark_primary' => '217 91% 60%', 'dot' => '#2563eb'],
    ['name' => 'Indigo', 'nav' => 'linear-gradient(135deg,#312e81,#4338ca,#6366f1)', 'primary' => '239 84% 67%', 'dark_primary' => '239 84% 67%', 'dot' => '#4338ca'],
    ['name' => 'Purple', 'nav' => 'linear-gradient(135deg,#581c87,#7c3aed,#a78bfa)', 'primary' => '263 70% 50%', 'dark_primary' => '263 70% 58%', 'dot' => '#7c3aed'],
    ['name' => 'Violet', 'nav' => 'linear-gradient(135deg,#4c1d95,#6d28d9,#8b5cf6)', 'primary' => '258 90% 66%', 'dark_primary' => '258 90% 66%', 'dot' => '#6d28d9'],
    ['name' => 'Fuchsia', 'nav' => 'linear-gradient(135deg,#86198f,#c026d3,#d946ef)', 'primary' => '293 69% 49%', 'dark_primary' => '293 69% 58%', 'dot' => '#c026d3'],
    ['name' => 'Pink', 'nav' => 'linear-gradient(135deg,#9d174d,#db2777,#ec4899)', 'primary' => '330 81% 60%', 'dark_primary' => '330 81% 60%', 'dot' => '#db2777'],
    ['name' => 'Rose', 'nav' => 'linear-gradient(135deg,#9f1239,#e11d48,#fb7185)', 'primary' => '347 77% 50%', 'dark_primary' => '347 77% 60%', 'dot' => '#e11d48'],
    ['name' => 'Red', 'nav' => 'linear-gradient(135deg,#991b1b,#dc2626,#ef4444)', 'primary' => '0 72% 51%', 'dark_primary' => '0 72% 58%', 'dot' => '#dc2626'],
    ['name' => 'Orange', 'nav' => 'linear-gradient(135deg,#9a3412,#ea580c,#f97316)', 'primary' => '25 95% 53%', 'dark_primary' => '25 95% 58%', 'dot' => '#ea580c'],
    ['name' => 'Amber', 'nav' => 'linear-gradient(135deg,#92400e,#d97706,#f59e0b)', 'primary' => '38 92% 50%', 'dark_primary' => '38 92% 58%', 'dot' => '#d97706'],
    ['name' => 'Yellow', 'nav' => 'linear-gradient(135deg,#854d0e,#ca8a04,#eab308)', 'primary' => '48 96% 53%', 'dark_primary' => '48 96% 58%', 'dot' => '#ca8a04'],
    ['name' => 'Lime', 'nav' => 'linear-gradient(135deg,#3f6212,#65a30d,#84cc16)', 'primary' => '84 81% 44%', 'dark_primary' => '84 81% 52%', 'dot' => '#65a30d'],
    ['name' => 'Green', 'nav' => 'linear-gradient(135deg,#166534,#16a34a,#22c55e)', 'primary' => '142 71% 45%', 'dark_primary' => '142 71% 52%', 'dot' => '#16a34a'],
    ['name' => 'Emerald', 'nav' => 'linear-gradient(135deg,#065f46,#059669,#10b981)', 'primary' => '160 84% 39%', 'dark_primary' => '160 84% 48%', 'dot' => '#059669'],
    ['name' => 'Cyan', 'nav' => 'linear-gradient(135deg,#155e75,#0891b2,#06b6d4)', 'primary' => '189 94% 43%', 'dark_primary' => '189 94% 50%', 'dot' => '#0891b2'],
    ['name' => 'Sky', 'nav' => 'linear-gradient(135deg,#075985,#0284c7,#0ea5e9)', 'primary' => '199 89% 48%', 'dark_primary' => '199 89% 55%', 'dot' => '#0284c7'],
    ['name' => 'Slate', 'nav' => 'linear-gradient(135deg,#1e293b,#475569,#64748b)', 'primary' => '215 16% 47%', 'dark_primary' => '215 20% 55%', 'dot' => '#475569'],
    ['name' => 'Zinc', 'nav' => 'linear-gradient(135deg,#27272a,#52525b,#71717a)', 'primary' => '240 4% 46%', 'dark_primary' => '240 5% 52%', 'dot' => '#52525b'],
    ['name' => 'Stone', 'nav' => 'linear-gradient(135deg,#44403c,#78716c,#a8a29e)', 'primary' => '25 5% 45%', 'dark_primary' => '25 6% 52%', 'dot' => '#78716c'],
    ['name' => 'Maroon', 'nav' => 'linear-gradient(135deg,#7f1d1d,#b91c1c,#dc2626)', 'primary' => '0 74% 42%', 'dark_primary' => '0 74% 50%', 'dot' => '#b91c1c'],
    ['name' => 'Navy', 'nav' => 'linear-gradient(135deg,#172554,#1e3a8a,#1e40af)', 'primary' => '224 76% 38%', 'dark_primary' => '224 76% 48%', 'dot' => '#1e3a8a'],
    ['name' => 'Forest', 'nav' => 'linear-gradient(135deg,#14532d,#15803d,#16a34a)', 'primary' => '142 76% 36%', 'dark_primary' => '142 76% 44%', 'dot' => '#15803d'],
    ['name' => 'Coffee', 'nav' => 'linear-gradient(135deg,#78350f,#a16207,#ca8a04)', 'primary' => '38 88% 40%', 'dark_primary' => '38 88% 48%', 'dot' => '#a16207'],
];
```

---

## 7. Complete CSS/Styling Specifications

### 7.1 Design Tokens (CSS Variables)

```css
/* Light Mode */
:root {
    --background: 220 20% 97%;
    --foreground: 220 25% 10%;
    --card: 0 0% 100%;
    --card-foreground: 220 25% 10%;
    --popover: 0 0% 100%;
    --popover-foreground: 220 25% 10%;
    --primary: 175 70% 38%;  /* Changes with theme */
    --primary-foreground: 0 0% 100%;
    --secondary: 220 14% 93%;
    --secondary-foreground: 220 25% 10%;
    --muted: 220 14% 93%;
    --muted-foreground: 220 8% 50%;
    --accent: 220 14% 93%;
    --accent-foreground: 220 25% 10%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;
    --border: 220 13% 90%;
    --input: 220 13% 90%;
    --ring: 175 70% 38%;
    --radius: 16px;
    --glass-bg: rgba(255, 255, 255, 0.6);
    --glass-border: rgba(255, 255, 255, 0.4);
    --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
}

/* Dark Mode */
.dark {
    --background: 225 30% 6%;
    --foreground: 220 15% 92%;
    --card: 225 25% 10%;
    --card-foreground: 220 15% 92%;
    --primary: 175 65% 50%;
    --primary-foreground: 0 0% 100%;
    --secondary: 225 20% 14%;
    --secondary-foreground: 220 15% 92%;
    --muted: 225 20% 14%;
    --muted-foreground: 220 10% 50%;
    --accent: 225 20% 14%;
    --accent-foreground: 220 15% 92%;
    --destructive: 0 62% 30%;
    --destructive-foreground: 220 15% 92%;
    --border: 225 18% 16%;
    --input: 225 18% 16%;
    --ring: 175 65% 50%;
    --glass-bg: rgba(15, 20, 35, 0.65);
    --glass-border: rgba(255, 255, 255, 0.08);
    --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
}
```

### 7.2 Key Effects

**Glassmorphism Cards**: `backdrop-filter: blur(16px) saturate(180%); border: 1px solid var(--glass-border); background: var(--glass-bg);`

**Nav Animation**: `background-size: 200% 200%; animation: nav-gradient-shift 6s ease infinite;`

**Card Enter**: `animation: card-enter 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;` (translateY 30px → 0, scale 0.92 → 1)

**Hover**: `transform: translateY(-6px) scale(1.03);` with shimmer overlay

**Ticker**: `animation: ticker-scroll 28s linear infinite;` (translateX 0 → -50%)

### 7.3 Print Styles (A4)

```css
@media print {
    @page { size: A4 portrait; margin: 10mm; }
    html, body { background: #fff !important; margin: 0; font-size: 13px; }
    .no-print { display: none !important; }
    .print-only { display: block !important; }
    .a4-page { width: 100%; padding: 20mm 20mm 20mm 25mm; border: 2px solid #000; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
}
```

**Print standards**: 92% width border, Noto Sans Devanagari font (14.5px), justified text, flexbox layout with `margin-top: auto` for signature/date sections, `page-break-inside: avoid` for multi-page documents.

### 7.4 Responsive Breakpoints
- `1000px`: 3-column grid
- `700px`: 2-column grid, banner stacks, search full width
- `420px`: Single column inputs, compact padding, smaller icons

---

## 8. Wallet & Payment Logic

### 8.1 Recharge Flow
1. User enters amount → Frontend calls `POST /wallet/recharge`
2. Backend creates Razorpay Order (Basic Auth: `KEY_ID:KEY_SECRET`)
   - `amount` in paise (× 100)
   - `currency: "INR"`
   - `receipt: "wallet_{user_id}_{timestamp}"`
3. Frontend opens Razorpay Checkout modal
4. On success → Frontend calls `POST /wallet/verify` with `razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature`
5. Backend verifies HMAC-SHA256 signature: `HMAC(order_id|payment_id, secret) === signature`
6. If valid → Update `profiles.wallet_balance += amount` → Insert `wallet_transactions` (type: credit) → Return success

### 8.2 Deduction Flow (On Form Submit)
1. Frontend calls `POST /wallet/deduct` with `form_type`
2. Backend:
   ```
   START TRANSACTION;
   SELECT wallet_balance FROM profiles WHERE id = {user_id} FOR UPDATE;
   IF balance < price → ROLLBACK, return "Insufficient balance"
   UPDATE profiles SET wallet_balance = balance - price WHERE id = {user_id} AND wallet_balance = {current_balance}; -- Optimistic lock
   INSERT INTO wallet_transactions (type: 'debit', amount: price, balance_after: new_balance);
   COMMIT;
   ```
3. If transaction fails → Rollback balance to original

### 8.3 PHP WalletService

```php
class WalletService {
    public function deduct(User $user, string $formType, ?string $submissionId = null): array {
        $pricing = FormPricing::where('form_type', $formType)->where('is_active', true)->firstOrFail();
        
        return DB::transaction(function () use ($user, $pricing, $submissionId) {
            $profile = Profile::where('id', $user->id)->lockForUpdate()->first();
            
            if ($profile->wallet_balance < $pricing->price) {
                throw new InsufficientBalanceException(
                    "शिल्लक अपुरी आहे. आवश्यक: ₹{$pricing->price}, उपलब्ध: ₹{$profile->wallet_balance}"
                );
            }
            
            $newBalance = $profile->wallet_balance - $pricing->price;
            $profile->update(['wallet_balance' => $newBalance]);
            
            WalletTransaction::create([
                'user_id' => $user->id,
                'type' => 'debit',
                'amount' => $pricing->price,
                'balance_after' => $newBalance,
                'description' => "{$pricing->form_name} फॉर्म शुल्क",
                'reference_id' => $submissionId,
            ]);
            
            return ['deducted' => $pricing->price, 'balance_after' => $newBalance];
        });
    }
}
```

---

## 9. Auth System

### 9.1 Registration
- Email + Password only (no social login)
- On register: Create `users` row → Create `profiles` row (same ID) → Create `user_roles` row (role: 'vle')
- Auto-login after registration → redirect to `/dashboard`

### 9.2 Role-Based Access
- `AdminMiddleware`: Check `user_roles` table for `role = 'admin'`
- `VleMiddleware`: Check user is authenticated (any role)
- Helper: `has_role($userId, $role)` → boolean

### 9.3 Session Management
- Laravel session-based auth (not JWT)
- `remember_token` for "Remember me" functionality
- Auto-redirect to `/login` if session expired

---

## 10. Maharashtra Districts & Talukas Data

```php
// config/maharashtra.php
<?php
return [
    'districts' => [
        'अहमदनगर (Ahmednagar)' => ['अहमदनगर', 'शेवगाव', 'पाथर्डी', 'पारनेर', 'श्रीगोंदा', 'कर्जत', 'जामखेड', 'नेवासा', 'राहुरी', 'राहता', 'संगमनेर', 'कोपरगाव', 'अकोले', 'श्रीरामपूर'],
        'अकोला (Akola)' => ['अकोला', 'अकोट', 'बाळापूर', 'पातूर', 'मूर्तिजापूर', 'तेल्हारा', 'बार्शीटाकळी'],
        'अमरावती (Amravati)' => ['अमरावती', 'भातकुली', 'नांदगाव खंडेश्वर', 'मोर्शी', 'वरूड', 'अचलपूर', 'चांदूर बाजार', 'चांदूर रेल्वे', 'धारणी', 'चिखलदरा', 'अंजनगाव सुर्जी', 'तिवसा', 'दर्यापूर', 'धामणगाव रेल्वे'],
        'औरंगाबाद (Aurangabad)' => ['औरंगाबाद', 'कन्नड', 'सोयगाव', 'सिल्लोड', 'फुलंब्री', 'खुलताबाद', 'वैजापूर', 'गंगापूर', 'पैठण'],
        'बीड (Beed)' => ['बीड', 'गेवराई', 'माजलगाव', 'परळी', 'अंबाजोगाई', 'केज', 'धारूर', 'पाटोदा', 'शिरूर कासार', 'आष्टी', 'वडवणी'],
        'भंडारा (Bhandara)' => ['भंडारा', 'तुमसर', 'पवनी', 'मोहाडी', 'साकोली', 'लाखनी', 'लाखांदूर'],
        'बुलढाणा (Buldhana)' => ['बुलढाणा', 'चिखली', 'देऊळगाव राजा', 'सिंदखेड राजा', 'लोणार', 'मेहकर', 'खामगाव', 'शेगाव', 'मलकापूर', 'मोताळा', 'नांदुरा', 'जळगाव जामोद', 'संग्रामपूर'],
        'चंद्रपूर (Chandrapur)' => ['चंद्रपूर', 'भद्रावती', 'वरोरा', 'चिमूर', 'नागभीड', 'ब्रम्हपुरी', 'सिंदेवाही', 'मूल', 'गोंडपिंपरी', 'पोंभुर्णा', 'सावली', 'बल्लारपूर', 'राजुरा', 'कोरपना', 'जिवती'],
        'धुळे (Dhule)' => ['धुळे', 'साक्री', 'शिंदखेडा', 'शिरपूर'],
        'गडचिरोली (Gadchiroli)' => ['गडचिरोली', 'देसाईगंज', 'आरमोरी', 'चामोर्शी', 'मुलचेरा', 'कुरखेडा', 'अहेरी', 'एटापल्ली', 'सिरोंचा', 'भामरागड', 'धानोरा', 'कोरची'],
        'गोंदिया (Gondia)' => ['गोंदिया', 'गोरेगाव', 'तिरोडा', 'आमगाव', 'सालेकसा', 'अर्जुनी मोरगाव', 'देवरी', 'सडक अर्जुनी'],
        'हिंगोली (Hingoli)' => ['हिंगोली', 'सेनगाव', 'कळमनुरी', 'औंढा नागनाथ', 'बसमत'],
        'जळगाव (Jalgaon)' => ['जळगाव', 'भुसावळ', 'जामनेर', 'पाचोरा', 'चोपडा', 'एरंडोल', 'धरणगाव', 'अमळनेर', 'पारोळा', 'रावेर', 'यावल', 'मुक्ताईनगर', 'बोदवड', 'चाळीसगाव', 'भडगाव'],
        'जालना (Jalna)' => ['जालना', 'अंबड', 'भोकरदन', 'बदनापूर', 'परतूर', 'मंठा', 'घनसावंगी', 'जाफराबाद'],
        'कोल्हापूर (Kolhapur)' => ['कोल्हापूर', 'पन्हाळा', 'शाहूवाडी', 'करवीर', 'हातकणंगले', 'शिरोळ', 'इचलकरंजी', 'कागल', 'गडहिंग्लज', 'चंदगड', 'आजरा', 'भुदरगड', 'राधानगरी'],
        'लातूर (Latur)' => ['लातूर', 'उदगीर', 'अहमदपूर', 'निलंगा', 'औसा', 'रेणापूर', 'चाकूर', 'देवणी', 'शिरूर अनंतपाळ', 'जळकोट'],
        'मुंबई शहर (Mumbai City)' => ['मुंबई शहर'],
        'मुंबई उपनगर (Mumbai Suburban)' => ['अंधेरी', 'बोरिवली', 'कुर्ला'],
        'नागपूर (Nagpur)' => ['नागपूर शहर', 'नागपूर ग्रामीण', 'हिंगणा', 'काटोल', 'सावनेर', 'नरखेड', 'कळमेश्वर', 'रामटेक', 'पारशिवनी', 'मौदा', 'उमरेड', 'कुही', 'भिवापूर', 'कामठी'],
        'नांदेड (Nanded)' => ['नांदेड', 'अर्धापूर', 'मुदखेड', 'भोकर', 'हदगाव', 'किनवट', 'माहूर', 'देगलूर', 'बिलोली', 'मुखेड', 'कंधार', 'लोहा', 'नायगाव', 'धर्माबाद', 'हिमायतनगर', 'उमरी'],
        'नंदुरबार (Nandurbar)' => ['नंदुरबार', 'शहादा', 'नवापूर', 'तळोदा', 'अक्कलकुवा', 'अक्राणी'],
        'नाशिक (Nashik)' => ['नाशिक', 'इगतपुरी', 'दिंडोरी', 'पेठ', 'त्र्यंबकेश्वर', 'कळवण', 'सुरगाणा', 'सटाणा', 'मालेगाव', 'नांदगाव', 'चांदवड', 'देवळा', 'सिन्नर', 'निफाड', 'येवला'],
        'उस्मानाबाद (Osmanabad)' => ['उस्मानाबाद', 'तुळजापूर', 'उमरगा', 'लोहारा', 'कळंब', 'भूम', 'परांडा', 'वाशी'],
        'पालघर (Palghar)' => ['पालघर', 'वसई', 'डहाणू', 'तलासरी', 'जव्हार', 'मोखाडा', 'विक्रमगड', 'वाडा'],
        'परभणी (Parbhani)' => ['परभणी', 'जिंतूर', 'सेलू', 'सोनपेठ', 'गंगाखेड', 'पाथरी', 'पूर्णा', 'मानवत', 'पालम'],
        'पुणे (Pune)' => ['पुणे शहर', 'हवेली', 'मुळशी', 'मावळ', 'वेल्हे', 'भोर', 'पुरंदर', 'बारामती', 'इंदापूर', 'दौंड', 'शिरूर', 'खेड', 'जुन्नर', 'आंबेगाव', 'मंचर'],
        'रायगड (Raigad)' => ['अलिबाग', 'पेण', 'पनवेल', 'उरण', 'कर्जत', 'खालापूर', 'सुधागड', 'रोहा', 'माणगाव', 'महाड', 'पोलादपूर', 'श्रीवर्धन', 'म्हसळा', 'तळा', 'मुरूड'],
        'रत्नागिरी (Ratnagiri)' => ['रत्नागिरी', 'संगमेश्वर', 'लांजा', 'राजापूर', 'चिपळूण', 'गुहागर', 'दापोली', 'मंडणगड', 'खेड'],
        'सांगली (Sangli)' => ['सांगली', 'मिरज', 'तासगाव', 'कवठेमहांकाळ', 'खानापूर', 'आटपाडी', 'पलूस', 'कडेगाव', 'जत', 'वाळवा', 'शिराळा'],
        'सातारा (Satara)' => ['सातारा', 'जावळी', 'वाई', 'महाबळेश्वर', 'खंडाळा', 'फलटण', 'माण', 'खटाव', 'कोरेगाव', 'पाटण', 'कराड'],
        'सिंधुदुर्ग (Sindhudurg)' => ['सिंधुदुर्ग', 'कणकवली', 'कुडाळ', 'सावंतवाडी', 'मालवण', 'देवगड', 'वैभववाडी', 'दोडामार्ग'],
        'सोलापूर (Solapur)' => ['सोलापूर उत्तर', 'सोलापूर दक्षिण', 'अक्कलकोट', 'बार्शी', 'मोहोळ', 'माढा', 'करमाळा', 'पंढरपूर', 'माळशिरस', 'सांगोला', 'मंगळवेढा'],
        'ठाणे (Thane)' => ['ठाणे', 'कल्याण', 'भिवंडी', 'मुरबाड', 'शहापूर', 'अंबरनाथ', 'उल्हासनगर'],
        'वर्धा (Wardha)' => ['वर्धा', 'देवळी', 'हिंगणघाट', 'सेलू', 'आर्वी', 'आष्टी', 'कारंजा', 'समुद्रपूर'],
        'वाशीम (Washim)' => ['वाशीम', 'रिसोड', 'मालेगाव', 'मंगरूळपीर', 'मानोरा', 'कारंजा'],
        'यवतमाळ (Yavatmal)' => ['यवतमाळ', 'अर्णी', 'बाभूळगाव', 'कळंब', 'दारव्हा', 'दिग्रस', 'घाटंजी', 'केळापूर', 'महागाव', 'नेर', 'पुसद', 'राळेगाव', 'उमरखेड', 'वणी', 'झरी जामणी', 'मारेगाव'],
    ],
];
```

---

## 11. Marathi/Hindi Text Content

### 11.1 Toast Messages
```
// Success
"लॉगिन यशस्वी!" 
"प्रोफाइल यशस्वीरित्या अपडेट झालं!"
"शुल्क यशस्वीरित्या कापलं!"
"पेमेंट यशस्वी!"
"फोटो अपलोड झाला!"
"सही अपलोड झाला!"

// Error
"कृपया लॉगिन करा"
"कृपया ईमेल आणि पासवर्ड टाका"
"लॉगिन अयशस्वी झाले"
"प्रोफाइल अपडेट करता आलं नाही"
"वॉलेट शुल्क कापता आलं नाही"
"शिल्लक अपुरी आहे. कृपया रिचार्ज करा."
"Razorpay ऑर्डर तयार करता आली नाही"
"पेमेंट सत्यापन अयशस्वी"
"कृपया वैध रक्कम टाका"
"वॉलेट ऑपरेशन अयशस्वी"
"Upload failed"
"व्यवहार लोड करता आले नाहीत"

// Validation
"कृपया नाव भरा"
"आधार क्रमांक 12 अंकी असावा"
"मोबाईल क्र. 10 अंकी असावा"
"कृपया तक्रारीचे वर्णन लिहा"
"कृपया किमान एका वर्षाचे उत्पन्न भरा"
"जुने स्वत:चे नाव भरा"
"नवीन आडनाव भरा"
"पिन कोड 6 अंकी असावा"
"जिल्हा निवडा"
```

### 11.2 Dashboard Labels
```
"🙏 नमस्कार!" — Welcome title
"SETU Suvidha पोर्टलवर तुमचे स्वागत आहे. खालील सेवा निवडा आणि फॉर्म भरा."
"सेवा उपलब्ध" — Total services label
"तयार आहे" — Ready services label
"उपलब्ध सेवा" — Section title
"सेवा शोधा..." — Search placeholder
"कोणतीही सेवा सापडली नाही." — No results
"© 2026 SETU Suvidha — सेतु सुविधा महा ई-सेवा पोर्टल" — Footer
"हा फॉर्म लवकरच उपलब्ध होईल." — Coming soon alert
```

### 11.3 News Ticker Items
```
"⭐ SETU Suvidha — सर्व सरकारी फॉर्म एकाच ठिकाणी! setusuvidha.com"
"📋 हमीपत्र, स्वयंघोषणा, तक्रार नोंदणी फॉर्म उपलब्ध!"
"🔧 राजपत्र, उत्पन्न दाखला, PAN Card सेवा उपलब्ध"
"🖨️ Save & Print एका क्लिकवर"
```

---

## 12. Laravel File Structure

```text
app/
├── Http/
│   ├── Controllers/
│   │   ├── AuthController.php
│   │   ├── DashboardController.php
│   │   ├── ProfileController.php
│   │   ├── WalletController.php
│   │   ├── RazorpayController.php
│   │   ├── FormController.php          # Generic form CRUD
│   │   ├── ManagementController.php
│   │   ├── PanCardController.php
│   │   ├── VoterIdController.php
│   │   ├── BandkamKamgarController.php
│   │   └── Admin/
│   │       ├── AdminDashboardController.php
│   │       ├── VleController.php
│   │       ├── PricingController.php
│   │       ├── PlanController.php
│   │       ├── TransactionController.php
│   │       └── SettingsController.php
│   └── Middleware/
│       ├── AdminMiddleware.php
│       └── EnsureVleActive.php
├── Models/
│   ├── User.php
│   ├── Profile.php
│   ├── UserRole.php
│   ├── FormSubmission.php
│   ├── FormPricing.php
│   ├── WalletTransaction.php
│   ├── SubscriptionPlan.php
│   ├── VleSubscription.php
│   ├── PanCardApplication.php
│   ├── VoterIdApplication.php
│   ├── BandkamRegistration.php
│   └── BandkamScheme.php
├── Services/
│   ├── WalletService.php
│   └── RazorpayService.php
resources/
├── views/
│   ├── layouts/
│   │   ├── app.blade.php         # Main layout (Navbar, Footer)
│   │   ├── dashboard.blade.php   # Dashboard layout (Nav tabs, ticker)
│   │   └── admin.blade.php       # Admin layout (Sidebar)
│   ├── home.blade.php            # Landing page (all sections)
│   ├── auth/
│   │   ├── login.blade.php
│   │   └── signup.blade.php
│   ├── dashboard.blade.php
│   ├── profile.blade.php
│   ├── wallet.blade.php
│   ├── billing.blade.php
│   ├── management.blade.php
│   ├── forms/
│   │   ├── hamipatra.blade.php
│   │   ├── self-declaration.blade.php
│   │   ├── grievance.blade.php
│   │   ├── new-application.blade.php
│   │   ├── caste-validity.blade.php
│   │   ├── income-cert.blade.php
│   │   ├── rajpatra-hub.blade.php
│   │   ├── rajpatra-marathi.blade.php
│   │   ├── rajpatra-english.blade.php
│   │   ├── rajpatra-affidavit-712.blade.php
│   │   └── farmer-id-card.blade.php
│   ├── crm/
│   │   ├── pan-card.blade.php
│   │   ├── voter-id.blade.php
│   │   └── bandkam-kamgar.blade.php
│   ├── admin/
│   │   ├── dashboard.blade.php
│   │   ├── vles.blade.php
│   │   ├── pricing.blade.php
│   │   ├── plans.blade.php
│   │   ├── transactions.blade.php
│   │   └── settings.blade.php
│   └── pages/
│       ├── about.blade.php
│       ├── contact.blade.php
│       ├── terms.blade.php
│       ├── privacy.blade.php
│       ├── refund.blade.php
│       ├── disclaimer.blade.php
│       ├── services.blade.php
│       ├── how-it-works.blade.php
│       ├── benefits.blade.php
│       ├── faq.blade.php
│       └── bandkam-kamgar-info.blade.php
├── css/
│   └── app.css                   # All custom styles (2700+ lines)
└── js/
    └── app.js                    # Alpine.js components
config/
├── maharashtra.php               # Districts & Talukas
└── themes.php                    # 24 color themes
database/
├── migrations/                   # 12 table migrations
└── seeders/
    ├── FormPricingSeeder.php
    ├── SubscriptionPlanSeeder.php
    └── AdminUserSeeder.php
```

---

## 13. Implementation Prompts (14 Phases)

### Phase 1: Laravel Setup & Database
> "Initialize a Laravel 11 project with MySQL. Create all 12 database migrations from the PRD schema (users, profiles, user_roles, form_pricing, wallet_transactions, form_submissions, subscription_plans, vle_subscriptions, pan_card_applications, voter_id_applications, bandkam_registrations, bandkam_schemes). Create seeders for form_pricing (10 form types with prices), subscription_plans (3 plans), and an admin user. Run migrations and seeds."

### Phase 2: Authentication & RBAC
> "Implement Email+Password authentication using Laravel Breeze. Create AdminMiddleware that checks user_roles table for 'admin' role. On registration, auto-create a profile row and user_roles row (role: 'vle'). Create Login page with split layout (left: amber gradient branding panel with 3 feature items, right: form with email, password, eye toggle). Create Signup page with same split layout. Redirect to /dashboard after login."

### Phase 3: Layout & Navbar
> "Create the main Blade layout with: (1) Glassmorphism Navbar (backdrop-blur, bg-white/80) with Landmark icon logo, nav links, dark mode toggle (Alpine.js), and login/signup buttons. (2) Footer with 4-column grid (Brand, Pages, Legal, Contact). (3) Dark mode using Alpine.js x-data with localStorage persistence and Tailwind 'dark:' classes. Use Noto Sans Devanagari and Inter fonts."

### Phase 4: Home Page (Landing)
> "Build the home page with these sections: (1) Hero — gradient background, floating particles, badge with pulsing dot, H1 'SETU Suvidha', subtitle, description, 2 CTA buttons, 3 stat cards. (2) Services — 12 cards in 4-column grid with gradient icons. (3) How It Works — 4 steps. (4) Bandkam Kamgar highlight section. (5) Benefits — 6 items. (6) Pricing — 3 plans with 'लोकप्रिय' badge on Pro. (7) Trust badges. (8) FAQ — 6 accordion items. (9) CTA — amber gradient section. All sections with scroll-triggered fade-in animations."

### Phase 5: Dashboard
> "Build the VLE Dashboard: (1) Top nav with gradient background (from selected color theme), brand, 24-color theme picker popup (Alpine.js), wallet balance, profile/admin/dark/logout buttons, 5 nav tabs. (2) Welcome banner with stats. (3) Live news ticker with scrolling animation. (4) Service grid — 18 cards in 4-column responsive grid with glassmorphism, icon gradients, READY/NEW/HOT/FAST badges, hover effects. (5) Search filter. (6) Footer. Use Alpine.js for theme picker and localStorage."

### Phase 6: Wallet System
> "Implement WalletService with atomic DB transactions. Create WalletController with: (1) index — show balance, recharge dialog (preset amounts: 100, 200, 500, 1000, 2000, 5000), transaction history table with green credit/red debit badges. (2) recharge — create Razorpay order. (3) verify — HMAC-SHA256 signature verification, credit balance, log transaction. (4) deduct — check pricing, optimistic lock deduction, rollback on failure. Create RazorpayService for API calls."

### Phase 7: Form Engine
> "Create generic FormController: (1) show($formKey) — render Blade view, show hero card first, click to open form. (2) store(Request $request, $formKey) — validate, optionally deduct wallet (if pricing exists), save to form_submissions (JSON data), return success. (3) submissions($formKey) — list user's past submissions. (4) delete($id) — delete submission. (5) print($id) — load submission data for print view. All forms follow Card→Form pattern with submission history table below."

### Phase 8: Hamipatra + Self Declaration + Grievance + New Application
> "Implement 4 basic forms using the form engine: (1) Hamipatra — fields: applicationNo, name, aadhaar(12), mobile(10), address, readonly taluka/district. Print: A4 with title, 5-point Marathi disclaimer, signature section. (2) Self Declaration — +purpose field. Print: oath text. (3) Grievance — +grievanceType, +description(textarea). Print: description in bordered box. (4) New Application — +applicationType, +description. All forms auto-reset after save, support print from history."

### Phase 9: Income Certificate
> "Build Income Certificate form with: (1) Applicant section: firstName, fatherName, surname, age, mobile, occupation dropdown, farm radio (H/R inputs). (2) Photo+Signature upload (store in public/uploads). (3) Address: district dropdown, taluka dependent dropdown, village. (4) Income table: 1-year/3-year radio → dynamic table with auto-calculated financial years, amount, words columns. (5) Reason dropdown. (6) 4 print formats (New 3-yr, New 1-yr, Old, Landless) with format selector before print. Print: Maharashtra logo, bordered table, photo/sign boxes."

### Phase 10: Rajpatra (Gazette) — Marathi, English, 7/12
> "Implement 3 Rajpatra forms: (1) Marathi — Old Name (3 parts), New Name (3 parts), reason dropdown, mobile, pincode, aadhaar, district, taluka, village, address. Print: Maharashtra Government logo header, name comparison table, notice text in Noto Sans Devanagari, signature lines. (2) English — same fields, names auto-UPPERCASE. Print: English gazette format. (3) 7/12 Affidavit — same + address toggle checkbox for separate land/residential address. Print: land record correction format."

### Phase 11: Farmer ID Card + Caste Validity
> "Implement: (1) Farmer ID Card — photo, name, address, gat no, area, mobile. Generate QR code with farmer data. Print: ID card size (85x55mm), multiple cards per A4 page. (2) Caste Validity — name, aadhaar, mobile, address, caste, sub-caste. Print: standard affidavit format."

### Phase 12: CRM Modules (PAN, Voter ID, Bandkam)
> "Build 3 CRM modules on Management page: (1) PAN Card — CRUD with 4-column form grid: type(new/correction/reprint), application_number, name, dob, mobile, amount, received, payment_status, payment_mode. Table with search. (2) Voter ID — same pattern with type(new/correction/transfer/duplicate). (3) Bandkam Kamgar — Complex CRM: registration form + schemes management, status cards (Pending, Activated, Expiring, Expired, All), left sidebar filters (Location cascading, Schemes, Status), interactive popups on name click (dates+payment) and schemes click (status+balance)."

### Phase 13: Admin Panel
> "Build Admin Panel with sidebar layout: (1) Dashboard — 4 stat cards (Total VLEs, Active VLEs, Total Revenue, Total Forms) from DB queries. (2) VLE Management — table with all profiles, active/inactive toggle switch. (3) Pricing Manager — table listing all form_pricing rows with inline price edit. (4) Subscription Plans — CRUD for plans with features JSON editor. (5) Transactions — global wallet_transactions table with filters. (6) Settings — platform info display."

### Phase 14: Deployment & Optimization
> "Prepare for deployment: (1) Configure .env with DB, Razorpay keys. (2) Set up @media print CSS for all forms (A4 portrait, 92% width border, hide nav/footer). (3) Add SEO meta tags, sitemap, robots.txt. (4) Optimize queries with eager loading and indexes. (5) Add CSRF protection to all forms. (6) Test wallet atomic operations under concurrent requests. (7) Set up cron for subscription expiry checks. (8) Deploy to VPS with Nginx, PHP-FPM, SSL certificate."

---

## 14. Deployment Checklist
1. Set up VPS/Shared Hosting with PHP 8.2+
2. Install Composer & Node.js (for building assets)
3. Configure `.env` with DB credentials and Razorpay Keys (`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`)
4. Run `php artisan migrate --seed` (Seed initial admin, form prices, plans)
5. Run `npm run build` for Tailwind CSS compilation
6. Set up Cron: `* * * * * cd /path && php artisan schedule:run >> /dev/null 2>&1`
7. Point domain `setusuvidha.com` to `public/` folder
8. Install SSL certificate (Let's Encrypt)
9. Set up daily DB backups

---

**End of PRD — This document is the "Source of Truth" for the migration.**
**Total: 12 DB tables, 45+ routes, 18 dashboard cards, 12 active forms, 24 color themes, 36 districts, 14 implementation phases.**
