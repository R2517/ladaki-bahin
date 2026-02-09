

# Bandkam Kamgar CRM Module - Plan

## Overview
Bandkam Kamgar (Construction Worker Welfare) module with two main parts:
1. **Registration CRM** - New/Renewal applications with activation dates, expiry tracking, and 7-day renewal alerts
2. **Schemes CRM** - Scholarships, Essential Kit, Soft Kit, Pregnancy, Marriage benefits with commission tracking

## Database Design

### Table 1: `bandkam_registrations`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Auto-generated |
| registration_type | text | 'new' / 'renewal' |
| applicant_name | text | Customer name |
| mobile_number | text | 10-digit mobile |
| dob | date | Date of birth |
| form_date | date | Form submission date (auto) |
| appointment_date | date | Thumb impression date |
| activation_date | date | When form activates |
| expiry_date | date | activation_date + 1 year |
| status | text | 'pending' / 'active' / 'expired' |
| amount | numeric | Total fee |
| received_amount | numeric | Received |
| payment_status | text | paid/unpaid/partially_paid |
| payment_mode | text | cash/upi |
| created_at | timestamptz | Auto |

### Table 2: `bandkam_schemes`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Auto-generated |
| registration_id | uuid (FK) | Links to registration |
| applicant_name | text | Customer name |
| scheme_type | text | 'essential_kit' / 'soft_kit' / 'scholarship' / 'pregnancy' / 'marriage' |
| scholarship_category | text | '1-4' / '5-10' / '11-12' / 'graduation' / 'iti' / 'engineering' / '10th_50_above' / '12th_50_above' (nullable) |
| student_name | text | Student name (for scholarship) |
| year | text | Application year |
| amount | numeric | Total scheme amount |
| commission_percent | numeric | Commission % |
| commission_amount | numeric | Commission earned |
| received_amount | numeric | Amount received |
| payment_status | text | paid/unpaid/partially_paid |
| payment_mode | text | cash/upi |
| status | text | 'applied' / 'approved' / 'received' / 'rejected' |
| created_at | timestamptz | Auto |

Both tables: RLS enabled with public access (matching existing pattern).

## Frontend: `/bandkam-kamgar` Page with Tabs

### Tab 1: Registration (New/Renewal)
- Entry form: type (New/Renewal), name, mobile, DOB, appointment date, activation date (auto-calculates expiry = activation + 1 year), amount, payment details
- **Alert Banner at top**: Shows count of registrations expiring in next 7 days with names -- highlighted in red/orange
- Table with all registrations, color-coded status (Active = green, Expiring Soon = orange, Expired = red)
- Inline editing for payment and dates
- Search by name/mobile

### Tab 2: Schemes
- Entry form: select scheme type, if scholarship then sub-category dropdown, student name, amount, commission %, auto-calculate commission amount
- Table with all scheme entries, inline edit, search
- Filter by scheme type

## Architecture
- Single page component `src/pages/BandkamKamgar.tsx` with tab-based navigation
- Follows existing PAN Card CRM pattern (same styling classes, inline edit pattern)
- Route: `/bandkam-kamgar`
- Update Management.tsx to set `ready: true` for Bandkam card

## Renewal Alert Logic
- On page load, query registrations where `expiry_date` is within next 7 days
- Show alert banner: "X registrations expiring soon" with list of names and expiry dates
- Expired entries shown with red badge in table

## Technical Details

### Files to create:
- `src/pages/BandkamKamgar.tsx` - Main CRM page with tabs

### Files to modify:
- `src/pages/Management.tsx` - Set bandkam card `ready: true`, update path
- `src/App.tsx` - Add `/bandkam-kamgar` route
- `src/index.css` - Add tab styles and alert banner styles

### Database migration:
- Create `bandkam_registrations` table
- Create `bandkam_schemes` table
- Enable RLS with public access policies on both

