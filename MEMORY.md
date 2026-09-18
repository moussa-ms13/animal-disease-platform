# Project Memory: Animal Disease Surveillance Platform
# منصة المراقبة الوبائية للأمراض الحيوانية

## 1. Project Information
- **Project Name:** Animal Disease Surveillance Platform (Plateforme Nationale de Surveillance Épidémiologique Animale)
- **Target Context:** National animal disease surveillance, outbreak tracking, and veterinary alert platform (Algeria / Maghreb context).
- **Languages:** Bilingual Arabic (Default, RTL) and French (LTR).
- **Architecture Methodology:** SDD-Pro (Spec-Driven Development) & UI/UX Pro Max Principles.
- **Frontend Stack:** React 19 + Vite + Tailwind CSS + Lucide Icons + React Router DOM + Zustand + i18next + MUI Data Grid.
- **Backend / BaaS:** Supabase (Auth, Postgres, Realtime, Storage).

---

## 2. Current Status & Phase
- **Current Phase:** Phase 2 — Veterinarian Data Entry Component Implemented (`CaseEntryForm`).
- **Next Phase:** Phase 3 — Supabase Data Layer & Wilaya Validation Workflow (SDD-Pro).

---

## 3. Completed Tasks
- [x] **Project Initialization:**
  - Scaffolding Vite React application in `scratch/animal-disease-platform`.
  - Initialized Git tracking (`git init`).
- [x] **Dependencies Installation:**
  - Tailwind CSS, PostCSS, Autoprefixer configured.
  - Production libraries installed: `react-router-dom`, `zustand`, `lucide-react`, `clsx`, `tailwind-merge`, `@supabase/supabase-js`, `@mui/x-data-grid`, `@mui/material`, `@emotion/react`, `@emotion/styled`, `xlsx`, `jspdf`, `jspdf-autotable`, `i18next`, `react-i18next`.
- [x] **SDD & UI/UX Rules Injected:**
  - Created `.ai/` directory with `ui-ux-pro-max.md` and `sdd-pro.md`.
  - Contextualized rules into agent reasoning context.
- [x] **Folder Structure:**
  - Standard layered directories created (`assets`, `components`, `contexts`, `hooks`, `i18n`, `lib`, `pages`).
- [x] **Initial Configuration:**
  - Environment variables template (`.env.example`) and Supabase client (`src/lib/supabase.js`).
  - Bilingual i18n engine (`src/i18n/config.js`) with dynamic RTL/LTR direction switching.
  - Tailwind CSS configured with medical palettes and Arabic/Latin typography.
- [x] **Veterinarian CaseEntryForm (`FEAT-01`):**
  - Created `src/pages/veterinarian/CaseEntryForm.jsx`.
  - Replaced legacy spreadsheet with dynamic row-based entry form.
  - Implemented Data Dictionary:
    - **Species:** BOVIN, OVIN, CAPRIN, EQUIN, CAMELIN.
    - **Diseases:** HYDAT, TUBER, FASCIOL, CYSTIC, AUTRES.
    - **Organs:** FOIE, POUMON, COEUR.
    - **Severities:** 1C (Partial Seizure), 2C (Total Seizure).
  - Mocked slaughterhouse header ("Abattoir Communal de Hussein Dey", "Alger", Inspector & Date).
  - Urgent MDO block with visual warning state and expandable clinical notes textarea.
  - Dynamic findings list with add/remove rows, empty state, and desktop/mobile responsiveness.
  - Sticky bottom action bar with real-time metrics (total weight in kg, total cases) and action buttons (Save Draft, Submit to Wilaya).
  - Zero hardcoded strings: 100% translated in `src/i18n/locales/ar.json` and `src/i18n/locales/fr.json`.
  - Wired into `src/App.jsx` and `src/pages/veterinarian/VeterinarianDashboard.jsx`.

---

## 4. Next Steps
- [ ] **Data Persistence & Supabase Integration:**
  - Create Supabase database tables (`slaughterhouse_cases`, `case_findings`, `mdo_alerts`).
  - Connect `handleSaveDraft` and `handleSubmit` to Supabase Postgres API and local offline storage (`indexedDB` / `localStorage`).
- [ ] **Wilaya Inspection Dashboard:**
  - Implement real-time inspection view for transmitted slaughterhouse seizure records.
  - Validation / Rejection workflow with inspection certificate generation (PDF export).

---

## 5. Active Context & Technical Constraints
- **Direction Handling:** Dynamic RTL (Arabic) and LTR (French) controlled via `i18n.language` and `document.documentElement.dir`.
- **Form Path:** `/veterinarian/new-declaration`.
- **Working Directory:** `C:\Users\moham\Source\animal-disease-platform`.
