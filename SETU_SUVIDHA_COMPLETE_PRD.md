# SETU Suvidha — Complete Technical PRD & Migration Guide
**(React/Supabase → PHP/Laravel/MySQL)**

This document contains **everything** needed to rebuild the SETU Suvidha platform using a **PHP (Laravel) + MySQL + Tailwind CSS** stack. It includes the database schema, UI specifications, business logic, API endpoints, and a step-by-step implementation plan with prompts.

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
-   **Hosting**: Linux (cPanel/VPS) or AWS

---

## 2. Database Schema (MySQL)

Here is the complete normalized schema. Use `utf8mb4_unicode_ci` collation.

```sql
-- 1. Users & Auth
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'vle') DEFAULT 'vle',
    is_active BOOLEAN DEFAULT TRUE,
    remember_token VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. VLE Profiles (Extends User)
CREATE TABLE profiles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL UNIQUE,
    shop_name VARCHAR(255),
    shop_type ENUM('setu', 'csc', 'other'),
    mobile VARCHAR(15),
    address TEXT,
    district VARCHAR(100),
    taluka VARCHAR(100),
    wallet_balance DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Form Pricing (Admin Controlled)
CREATE TABLE form_pricing (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    form_key VARCHAR(50) NOT NULL UNIQUE, -- e.g., 'income_cert'
    form_name VARCHAR(100) NOT NULL,      -- e.g., 'Income Certificate'
    price DECIMAL(8, 2) NOT NULL DEFAULT 10.00,
    is_active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. Wallet Transactions (Ledger)
CREATE TABLE wallet_transactions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    type ENUM('credit', 'debit') NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    balance_after DECIMAL(10, 2) NOT NULL,
    description VARCHAR(255),
    reference_id VARCHAR(100), -- Razorpay ID or Form Submission ID
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Form Submissions (JSON Storage for Flexibility)
CREATE TABLE form_submissions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    form_key VARCHAR(50) NOT NULL, -- Links to form_pricing.form_key
    applicant_name VARCHAR(255) NOT NULL,
    form_data JSON NOT NULL, -- Stores all dynamic fields (dob, aadhaar, address, etc.)
    status ENUM('pending', 'completed', 'rejected') DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (form_key) REFERENCES form_pricing(form_key)
);

-- 6. Subscription Plans (Optional SaaS Feature)
CREATE TABLE subscription_plans (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(8, 2) NOT NULL,
    duration_days INT NOT NULL,
    features JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. VLE Subscriptions
CREATE TABLE vle_subscriptions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    plan_id BIGINT UNSIGNED NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('active', 'expired') DEFAULT 'active',
    payment_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES subscription_plans(id)
);

-- Indexes for Performance
CREATE INDEX idx_transactions_user ON wallet_transactions(user_id);
CREATE INDEX idx_submissions_user ON form_submissions(user_id);
CREATE INDEX idx_submissions_form ON form_submissions(form_key);
```

---

## 3. Route Map & Application Structure

### Public Routes
-   `GET /` - Home (Landing Page)
-   `GET /about` - About Us
-   `GET /contact` - Contact
-   `GET /services` - Services List
-   `GET /pricing` - Pricing/Plans
-   `GET /terms`, `/privacy`, `/refund`, `/disclaimer` - Legal Pages
-   `GET /bandkam-kamgar-info` - Info Page

### Auth Routes
-   `GET /login` - Login Page
-   `POST /login` - Auth Action
-   `GET /signup` - Signup Page
-   `POST /signup` - Register Action
-   `POST /logout` - Logout

### VLE Dashboard (Protected: `auth`, `role:vle`)
-   `GET /dashboard` - Main Dashboard (Stats, Services Grid)
-   `GET /wallet` - Wallet Recharge & History
-   `POST /wallet/recharge` - Init Razorpay
-   `POST /wallet/verify` - Verify Payment webhook
-   `GET /profile` - Edit Profile
-   `POST /profile` - Update Profile
-   `GET /billing` - Billing History (Future)
-   `GET /management` - CRM Tools (PAN, Voter, etc.)

### Service Routes (Form Engine)
**Pattern:** `GET /forms/{form_key}` (View) | `POST /forms/{form_key}` (Save & Print)

-   `/forms/hamipatra`
-   `/forms/self-declaration`
-   `/forms/grievance`
-   `/forms/new-application`
-   `/forms/caste-validity`
-   `/forms/income-cert`
-   `/forms/rajpatra-marathi`
-   `/forms/rajpatra-english`
-   `/forms/rajpatra-affidavit-712`
-   `/forms/farmer-id-card`
-   `/forms/pan-card` (CRM style)
-   `/forms/voter-id` (CRM style)
-   `/forms/bandkam-kamgar` (CRM style)

### Admin Routes (Protected: `auth`, `role:admin`)
-   `GET /admin/dashboard` - Stats
-   `GET /admin/vles` - Manage Users (Toggle Active)
-   `GET /admin/pricing` - Edit Form Prices
-   `POST /admin/pricing` - Update Price
-   `GET /admin/transactions` - All Wallet Logs
-   `GET /admin/settings` - Global Settings

---

## 4. UI/UX Specifications (Tailwind + Alpine)

### Global Design System (CSS Variables)
Use these Tailwind config colors to match the React app exactly.

```js
// tailwind.config.js
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
}
```

### Key Components

1.  **Navbar**: Glassmorphism effect (`backdrop-blur-xl`, `bg-white/80`). Gradient background on mobile menu.
2.  **Dashboard Grid**:
    *   Cards with specific gradients (e.g., `linear-gradient(135deg, #E0E7FF, #C7D2FE)` for PAN).
    *   Badges: `READY` (Green), `NEW` (Orange), `HOT` (Red).
    *   Hover effects: `hover:-translate-y-1.5`, `hover:shadow-xl`.
3.  **Forms**:
    *   Left side: Input fields (Floating labels or standard labels above inputs).
    *   Right side (Desktop): Form preview or instructions.
    *   **Print Button**: Triggers `window.print()` with specific `@media print` CSS.
4.  **Wallet Page**:
    *   Large balance display.
    *   Preset amount buttons (100, 200, 500...).
    *   Transaction table with Green (Credit) / Red (Debit) amounts.

---

## 5. Wallet & Payment Logic (Critical)

**Logic Flow:**
1.  **Recharge**:
    *   User enters amount → Backend creates Razorpay Order.
    *   Frontend opens Razorpay Modal.
    *   On Success → Backend verifies signature → Updates `wallet_balance` (+ amount) → Logs `credit` transaction.
2.  **Deduct (On Form Submit)**:
    *   Backend checks `form_pricing` for that form.
    *   Checks `users.wallet_balance >= price`.
    *   If Yes → Deduct balance → Log `debit` transaction → Save Form Data → Return Success.
    *   If No → Return Error "Insufficient Balance".
3.  **Atomic Locks**:
    *   Use database transactions (`DB::transaction` in Laravel) to ensure balance doesn't go negative during concurrent requests.

---

## 6. Form Details & Print Specs

All forms must support **A4 size printing** perfectly.

### 1. Hamipatra (Disclaimer)
*   **Fields**: Name, Aadhaar, Mobile, Address, Taluka, District.
*   **Print Layout**: Standard Government affidavit format.
*   **Pricing**: ₹10 (example).

### 2. Income Certificate Affidavit
*   **Fields**: Name, Age, Occupation, Income (3 years), Family Members.
*   **Dynamic Table**: Rows for each financial year (2023-24, 2024-25, etc.).
*   **Photo/Sign**: Upload support (store in `public/uploads`).

### 3. Rajpatra (Gazette) - Marathi & English
*   **Fields**: Old Name, New Name, Reason, DOB, Address.
*   **Print Layout**: Two-column layout (Left: Old details, Right: New details).
*   **Special**: Needs specific font (`Noto Sans Devanagari` for Marathi).

### 4. Farmer ID Card
*   **Fields**: Photo, Name, Address, Land Details (Gat No, Area).
*   **Output**: ID Card size (approx 85mm x 55mm), printable on PVC card or A4 paper (multiple cards).
*   **QR Code**: Generate QR containing Farmer ID & Name.

---

## 7. Migration Implementation Plan (Step-by-Step Prompts)

Use these prompts with an AI coder (like me or others) to build the PHP version.

### Phase 1: Setup & Auth
**Prompt:**
> "Initialize a Laravel 11 project with MySQL.
> 1. Set up the database schema provided in the PRD (users, profiles, etc.).
> 2. Create Authentication (Login, Signup) using Laravel Breeze or manual Auth controllers.
> 3. Create the `Profile` model and ensure a profile is created when a user registers.
> 4. Add `is_admin` middleware."

### Phase 2: Layout & Dashboard
**Prompt:**
> "Create the main layout using Tailwind CSS.
> 1. Implement the Glassmorphism Navbar and Sidebar.
> 2. Create the VLE Dashboard (`/dashboard`) with the exact Service Grid shown in the React code (Use the same icons and gradient colors).
> 3. Implement the Dark/Light mode toggle using Alpine.js and Tailwind `dark:` classes."

### Phase 3: Wallet System
**Prompt:**
> "Implement the Wallet System.
> 1. Create `WalletController`.
> 2. Implement `recharge` method (Razorpay Order Create).
> 3. Implement `verify` method (Signature check + Balance Update + Transaction Log).
> 4. Create the Wallet UI with transaction history table."

### Phase 4: Form Engine (Core)
**Prompt:**
> "Create a generic `FormController` to handle submissions.
> 1. `show($form_key)`: Renders the Blade view for the specific form.
> 2. `store(Request $request, $form_key)`:
>    - Validates inputs.
>    - Checks Wallet Balance (Atomic transaction).
>    - Deducts Amount.
>    - Saves to `form_submissions` table (JSON data).
>    - Returns success JSON."

### Phase 5: Specific Forms (Iterative)
**Prompt:**
> "Implement the 'Hamipatra' and 'Income Certificate' forms.
> 1. Create Blade views with Tailwind forms.
> 2. Add the specific print CSS (`@media print`) to hide navbar/sidebar and format the content as A4.
> 3. Ensure Marathi fonts (`Noto Sans Devanagari`) work correctly in Print view."

### Phase 6: Admin Panel
**Prompt:**
> "Build the Admin Panel.
> 1. Dashboard with Stats (Total Users, Today's Revenue).
> 2. VLE List (Table with 'Active/Inactive' toggle).
> 3. Pricing Manager (Table to edit `form_pricing` prices).
> 4. Transaction Logs (Global history)."

---

## 8. Essential Data (Maharashtra Config)

Include this array in `config/maharashtra.php` for dropdowns.

```php
<?php
return [
    'districts' => [
        'Ahmednagar' => ['Ahmednagar', 'Sangamner', 'Kopergaon', ...],
        'Amravati' => ['Amravati', 'Achalpur', 'Chandur', ...],
        'Pune' => ['Pune City', 'Haveli', 'Baramati', ...],
        // ... add all 36 districts from the React 'maharashtra-districts.ts' file
    ]
];
```

## 9. Deployment Checklist
1.  Set up VPS/Shared Hosting with PHP 8.2.
2.  Install Composer & Node.js (for building assets).
3.  Configure `.env` with DB credentials and Razorpay Keys.
4.  Run `php artisan migrate --seed` (Seed initial admin and form prices).
5.  Set up Cron job for `php artisan schedule:run` (if needed for subscription expiry checks).
6.  Point domain `setusuvidha.com` to `public/` folder.

---

**End of PRD**
This document serves as the "Source of Truth" for the migration.
