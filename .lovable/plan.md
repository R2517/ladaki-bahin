

# Ladaki Bahin Yojana – Page 2 हमीपत्र (Disclaimer) App

## Overview
A single-page government document form application for Maha e-Seva / CSC centers. Designed to look and print like an official Marathi government affidavit — not a modern website.

---

## Page Layout & Design
- **A4 portrait layout** with exact margins (Top: 20mm, Bottom: 20mm, Left: 25mm, Right: 20mm)
- Full black border around the content area
- **Black & white only** — no colors, no animations, no icons
- **Font**: Noto Sans Devanagari for authentic government document appearance
- Print CSS ensures perfect A4 output with no browser headers/footers

---

## Form Structure (Top to Bottom)

### 1. Header
- **Left**: "लाडकी बहिण अर्ज नंबर :" with a long text input field (supports IDs like `NYS-09250861-669e9d814e4b79726`)

### 2. Form Fields
- **नाव** — Text input (auto-syncs to footer "अर्जदाराचे नाव")
- **आधार क्रमांक** — Text input | **मोबाईल क्र.** — Text input (same line, right side)
- **राहणार** — Full address text input
- **तालुका** — Read-only, prefilled: "नांदगाव खंडेश्वर"
- **जिल्हा** — Read-only, prefilled: "अमरावती"
- **राज्य** — Fixed text: "महाराष्ट्र"

### 3. Disclaimer Content
- Official-style Marathi legal paragraphs covering:
  - No guarantee of approval/rejection
  - Applicant responsible for document accuracy
  - CSC/Maha e-Seva/Operator not liable
  - Government decision is final
  - Applicant agrees voluntarily

### 4. Footer
- **Left**: "ठिकाण : पापळ" | **Right**: "अर्जदाराची सही / अंगठा"
- **Left**: "दिनांक" (auto-filled current date) | **Right**: "अर्जदाराचे नाव" (auto-synced from Name field)

---

## Buttons (hidden on print)
1. **Save Data** — Sends form data to Google Apps Script via POST (JSON). Shows Marathi success message: "Data Google Sheet मध्ये Saved झाला आहे"
2. **Print / Save as PDF** — Opens browser print dialog with A4 settings

---

## Google Sheets Integration
- On "Save Data" click, sends: Timestamp, Application Number, Mobile, Name, Aadhaar, Address, Taluka, District, Place
- Uses `fetch()` POST to a Google Apps Script Web App URL
- I will provide step-by-step guidance on creating the Google Apps Script endpoint
- The Google Script URL will be configurable in the code

---

## Operator Experience
- Extremely simple — village-level operator friendly
- No login, no OTP, no verification
- Fast loading, minimal UI
- Works offline except for Google Sheet save

