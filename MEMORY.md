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
- **Current Phase:** Phase 1 — Architecture Initialization & Workspace Rules Injected (Completed).
- **Next Phase:** Phase 2 — Veterinarian Dashboard Specifications & Data Contracts (SDD-Pro).

---

## 3. Completed Tasks (Initialization Steps)
- [x] **Project Initialization:**
  - Scaffolding Vite React application in `scratch/animal-disease-platform`.
  - Initialized Git tracking (`git init`).
- [x] **Dependencies Installation:**
  - Tailwind CSS, PostCSS, Autoprefixer configured.
  - Production libraries installed: `react-router-dom`, `zustand`, `lucide-react`, `clsx`, `tailwind-merge`, `@supabase/supabase-js`, `@mui/x-data-grid`, `@mui/material`, `@emotion/react`, `@emotion/styled`, `xlsx`, `jspdf`, `jspdf-autotable`, `i18next`, `react-i18next`.
- [x] **SDD & UI/UX Rules Injected:**
  - Created `.ai/` directory.
  - Injected `ui-ux-pro-max.md` (UI/UX design intelligence, color harmony, typography pairing, anti-pattern rules).
  - Injected `sdd-pro.md` (Spec-Driven Development, deterministic gates, traceability FEAT -> US -> Plan -> Code).
  - Contextualized rules into agent reasoning context.
- [x] **Folder Structure:**
  - Created standard layered directories:
    - `src/assets`
    - `src/components/layout`
    - `src/components/ui`
    - `src/contexts`
    - `src/hooks`
    - `src/i18n/locales`
    - `src/lib`
    - `src/pages/auth`
    - `src/pages/veterinarian`
    - `src/pages/wilaya`
    - `src/pages/ministry`
    - `src/pages/admin`
- [x] **Initial Configuration:**
  - Created `.env.example` and `.env` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
  - Configured Supabase client in `src/lib/supabase.js`.
  - Configured bilingual i18n engine in `src/i18n/config.js` with dynamic HTML `dir="rtl"` / `dir="ltr"` attribute and locale files (`ar.json`, `fr.json`).
  - Configured `tailwind.config.js` with veterinary/medical color palettes, typography tokens (`Cairo`, `Noto Sans Arabic`, `Inter`), soft shadows, and glassmorphism.
  - Updated `src/index.css` applying UI/UX Pro Max tokens and accessibility guidelines.
  - Created `src/App.jsx` with `react-router-dom` routes and placeholder dashboards for all four roles (`veterinarian`, `wilaya`, `ministry`, `admin`) plus authentication.

---

## 4. Next Steps (Focus: Veterinarian Dashboard Specs)
- [ ] **FEAT-01: Veterinarian Module Specification (SDD-Pro Phase):**
  - Define User Stories for field veterinarian declarations:
    - US-01: Outbreak reporting form (suspected disease, species, affected heads, mortalities, GPS/Wilaya/Commune).
    - US-02: Laboratory sampling attachment & symptom checklists.
    - US-03: Real-time status tracker (Pending Wilaya Review, Validated, Quarantine Ordered).
    - US-04: Offline-ready caching mechanism for remote rural zones.
- [ ] **Data Contract & Supabase Schema Draft:**
  - Tables: `declarations`, `diseases`, `species`, `wilayas`, `communes`, `veterinarians`, `audit_logs`.
  - Define RLS (Row Level Security) policies for private vs inspection access.
- [ ] **UI Component Plan (UI/UX Pro Max):**
  - High-efficiency data input forms with keyboard accessibility.
  - Fast status badges, interactive data grids with Excel/PDF exports.

---

## 5. Active Context & Technical Constraints
- **Direction Handling:** Dynamic RTL (Arabic) and LTR (French) controlled via `i18n.language` and `document.documentElement.dir`.
- **Accessibility & Contrast:** 4.5:1 minimum contrast ratio maintained across all alert statuses (Amber alert, Red danger, Emerald success).
- **Working Directory:** `C:\Users\moham\.gemini\antigravity-ide\scratch\animal-disease-platform`.
