

# उत्पन्नाचे स्वयंघोषणापत्र (Income Certificate) - Implementation Plan

## Overview
Dashboard वर "उत्पन्नाचे स्वयंघोषणापत्र" card already आहे (income-cert, path: /income-cert). सध्या ते "Coming Soon" आहे. ते activate करून full form + print formats + history list बनवायचे आहे, तुमच्या reference images आणि PDFs प्रमाणे.

---

## 1. Dashboard Update
- `income-cert` card ला `ready: true` आणि `badge: "READY"` set करणे
- Route `/income-cert` add करणे App.tsx मध्ये

## 2. Form (Data Entry) - Reference: image-3, 4, 5

### Section 1: अर्जदाराची माहिती
| Field | Type | Required |
|-------|------|----------|
| पहिले नाव | Text | Yes |
| वडिलांचे/पतीचे नाव | Text | Yes |
| आडनाव | Text | Yes |
| वय | Number | Yes |
| मोबाईल | Number (10 digit) | Yes |
| व्यवसाय | Dropdown (शेतमजुरी, शेती, व्यापार, नोकरी, इतर) | Yes |
| शेती आहे का? | Radio (हो / नाही) | No |
| H / R | Text (short) | No |

### Section 2: पत्ता माहिती
| Field | Type | Required |
|-------|------|----------|
| जिल्हा | Dropdown | Yes |
| तालुका | Dropdown | Yes |
| गाव | Text | Yes |
| ठिकाण | Text | Yes |

### Section 3: इतर तपशील
| Field | Type | Required |
|-------|------|----------|
| कारणाचे नाव | Dropdown (शिक्षणासाठी, मुलांच्या शिक्षणासाठी, मुलींच्या शिक्षणासाठी, शासकीय कामासाठी, अण्णासाहेब पाटील महामंडळ, इतर) | Yes |
| उत्पन्न तपशील | Radio (१ वर्ष / ३ वर्षे) | Yes |
| उत्पन्न Table | Dynamic table - years auto-calculated, अंकी (number) + अक्षरी (text) per year | Yes |
| आधार नंबर | Number (12 digit, Optional) | No |

### Document Upload (Right Side)
| Field | Type | Required |
|-------|------|----------|
| फोटो निवडा | File Upload (image) | No |
| सही निवडा | File Upload (image) | No |

Note: Photos/signatures will be stored in **Supabase Storage** (a new bucket will be created). Only URLs will be saved in the database - no base64 in DB.

## 3. History List - Reference: image-6
- Search bar: नाव, गाव किंवा मोबाईल नंबर टाका
- Search, Reset, + नवीन फॉर्म (Add) buttons
- Table columns: अ.क्र, नाव, वडिलांचे/पतीचे नाव, मोबाईल, गाव, तारीख, Action (Print + Delete)

## 4. Print Formats - Reference: image-7, INC_1.pdf, INC_2.pdf

Left sidebar with format selection buttons:

### Format 1 (नवीन - 3 वर्षे) - INC_1.pdf
- **Page 1**: उत्पन्न अहवाल स्वयंघोषणापत्र
  - Official header with government references
  - Applicant details paragraph
  - Family income table (3 years: 22-23, 23-24, 24-25) with columns: अ.क्र, कुटुंबातील व्यक्तीचे नावे, वय, नाते, व्यवसाय, आर्थिक वर्ष, उत्पन्न
  - Legal declaration text
  - **प्रपत्र-अ (स्वयंघोषणापत्र)** section with photo, government GR reference, detailed declaration, signature block

### Format 2 (नवीन - 1 वर्ष)
- Same as Format 1 but with only current year's income row

### Format 3 (जुना फॉर्मॅट) - INC_2.pdf
- **स्वयंघोषणापत्र** with year/amount/words-in-text table
- **स्वयंघोषित रहिवासी प्रमाणपत्र** section
- Applicant info at bottom

### Format 4: भूमीहीन प्रमाणपत्र
- Landless certificate variant

## 5. Supabase Storage Setup
- Create `documents` storage bucket for photo and signature uploads
- Add appropriate RLS policies for public upload/read

---

## Technical Details

### Files to Create
- `src/pages/IncomeCert.tsx` - Main page component with form, history list, and print layouts

### Files to Modify
- `src/pages/Dashboard.tsx` - Set income-cert card to `ready: true`
- `src/App.tsx` - Add `/income-cert` route
- `src/index.css` - Add print styles for income certificate formats

### Database
- Reuse existing `form_submissions` table with `form_type: "उत्पन्नाचे स्वयंघोषणापत्र"`
- All form fields stored in `form_data` JSONB column
- Photo/signature URLs stored as fields within `form_data`

### SQL Migration
- Create `documents` storage bucket
- Add RLS policies for upload and read access

### Key Implementation Patterns
- Follow existing page pattern (Hamipatra/SelfDeclaration) for Card -> Form transition
- Use `useFormSubmissions` hook for CRUD operations
- Dynamic income table: radio toggle between 1 year and 3 years, auto-calculate financial year labels
- Print format selector with left sidebar (only visible in print view)
- Photo/signature: upload to Supabase Storage, display in print output

