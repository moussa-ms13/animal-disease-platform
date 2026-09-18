-- ============================================================================
-- MIGRATION: 00001_initial_schema.sql
-- Platform: National Surveillance Platform for Animal Diseases in Abattoirs
-- Target DB: PostgreSQL (Independent of Supabase auth.users)
-- Architecture: Custom Auth & Role-Based Access Control, Aggregated Surveillance Model
-- ============================================================================

-- Enable required cryptographic and UUID generation extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. ENUM TYPES
-- ============================================================================

-- 1.1 Inspection Report Lifecycle Workflow Status
DO  BEGIN
  CREATE TYPE report_status AS ENUM (
    'DRAFT',
    'SUBMITTED_TO_WILAYA',
    'RETURNED_FOR_CORRECTION',
    'VALIDATED'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END ;

-- 1.2 Seizure Severity Classification (1C: Saisie Partielle, 2C: Saisie Totale)
DO  BEGIN
  CREATE TYPE seizure_severity AS ENUM (
    '1C',
    '2C'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END ;

-- 1.3 Slaughter Facility Types
DO  BEGIN
  CREATE TYPE facility_type AS ENUM (
    'ABATTOIR_COMMUNAL',
    'ABATTOIR_PRIVE',
    'TUERIE'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END ;

-- ============================================================================
-- 2. UTILITY FUNCTIONS & TRIGGERS
-- ============================================================================

CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS 
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
 LANGUAGE plpgsql;

-- ============================================================================
-- 3. REFERENCE DATA TABLES (Bilingual Dictionaries)
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 3.1 Wilayas (Provinces)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS wilayas (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code       VARCHAR(4) NOT NULL UNIQUE,       -- e.g., '16' for Alger
  name_fr    VARCHAR(100) NOT NULL,
  name_ar    VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_wilayas_updated_at
  BEFORE UPDATE ON wilayas
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

COMMENT ON TABLE wilayas IS 'Administrative provinces (58 wilayas) of Algeria.';

-- ---------------------------------------------------------------------------
-- 3.2 Communes (Municipalities)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS communes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wilaya_id  UUID NOT NULL REFERENCES wilayas(id) ON DELETE RESTRICT,
  name_fr    VARCHAR(150) NOT NULL,
  name_ar    VARCHAR(150) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_communes_wilaya_id ON communes(wilaya_id);

CREATE TRIGGER set_communes_updated_at
  BEFORE UPDATE ON communes
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

COMMENT ON TABLE communes IS 'Municipalities attached to a parent wilaya.';

-- ---------------------------------------------------------------------------
-- 3.3 Slaughterhouses (Établissements d''Abattage)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS slaughterhouses (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commune_id     UUID NOT NULL REFERENCES communes(id) ON DELETE RESTRICT,
  name_fr        VARCHAR(200) NOT NULL,
  name_ar        VARCHAR(200) NOT NULL,
  facility_type  facility_type NOT NULL DEFAULT 'ABATTOIR_COMMUNAL',
  license_number VARCHAR(50),
  is_active      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_slaughterhouses_commune_id ON slaughterhouses(commune_id);

CREATE TRIGGER set_slaughterhouses_updated_at
  BEFORE UPDATE ON slaughterhouses
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

COMMENT ON TABLE slaughterhouses IS 'Slaughterhouse facilities subject to veterinary meat inspection.';

-- ---------------------------------------------------------------------------
-- 3.4 Species (Animal Species)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS species (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code       VARCHAR(20) NOT NULL UNIQUE,      -- BOVIN, OVIN, CAPRIN, EQUIN, CAMELIN
  name_fr    VARCHAR(100) NOT NULL,
  name_ar    VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_species_updated_at
  BEFORE UPDATE ON species
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

COMMENT ON TABLE species IS 'Livestock species dictionary (BOVIN, OVIN, CAPRIN, EQUIN, CAMELIN).';

-- ---------------------------------------------------------------------------
-- 3.5 Diseases (Pathologies / Maladies)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS diseases (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code       VARCHAR(20) NOT NULL UNIQUE,      -- HYDAT, TUBER, FASCIOL, CYSTIC, AUTRES
  name_fr    VARCHAR(200) NOT NULL,
  name_ar    VARCHAR(200) NOT NULL,
  is_mdo     BOOLEAN NOT NULL DEFAULT FALSE,   -- Maladie à Déclaration Obligatoire
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_diseases_updated_at
  BEFORE UPDATE ON diseases
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

COMMENT ON TABLE diseases IS 'Seizure etiology dictionary. is_mdo=TRUE marks mandatory notifiable animal diseases.';

-- ---------------------------------------------------------------------------
-- 3.6 Organs (Affected Organs)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS organs (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code       VARCHAR(20) NOT NULL UNIQUE,      -- FOIE, POUMON, COEUR
  name_fr    VARCHAR(100) NOT NULL,
  name_ar    VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_organs_updated_at
  BEFORE UPDATE ON organs
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

COMMENT ON TABLE organs IS 'Anatomical organ dictionary for post-mortem seizure classification.';

-- ============================================================================
-- 4. CUSTOM AUTH & ROLES TABLES (Bypassing Supabase auth.users)
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 4.1 Roles Table
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS roles (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code       VARCHAR(50) NOT NULL UNIQUE,      -- VETERINARIAN, WILAYA_INSPECTOR, MINISTRY_ADMIN, SYSTEM_ADMIN
  name_fr    VARCHAR(150) NOT NULL,
  name_ar    VARCHAR(150) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_roles_updated_at
  BEFORE UPDATE ON roles
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

COMMENT ON TABLE roles IS 'Custom RBAC roles governing institutional privileges across abattoir, wilaya, and national tiers.';

-- ---------------------------------------------------------------------------
-- 4.2 Users Table (Custom Authentication)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id           UUID NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
  slaughterhouse_id UUID REFERENCES slaughterhouses(id) ON DELETE SET NULL,
  wilaya_id         UUID REFERENCES wilayas(id) ON DELETE SET NULL,
  full_name         VARCHAR(200) NOT NULL,
  email             VARCHAR(200) NOT NULL UNIQUE,
  password_hash     TEXT NOT NULL,            -- Argon2id / bcrypt hashed password
  license_number    VARCHAR(50),              -- Professional veterinary license ID
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_role_id ON users(role_id);
CREATE INDEX IF NOT EXISTS idx_users_slaughterhouse_id ON users(slaughterhouse_id);
CREATE INDEX IF NOT EXISTS idx_users_wilaya_id ON users(wilaya_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE TRIGGER set_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

COMMENT ON TABLE users IS 'Application user accounts with credentials and jurisdictional assignments (bypassing auth.users).';

-- ============================================================================
-- 5. TRANSACTIONAL DATA (Workflow & Aggregation)
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 5.1 Inspection Reports (Procès-Verbaux Journaliers)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS inspection_reports (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slaughterhouse_id  UUID NOT NULL REFERENCES slaughterhouses(id) ON DELETE RESTRICT,
  inspector_id       UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  inspection_date    DATE NOT NULL DEFAULT CURRENT_DATE,
  status             report_status NOT NULL DEFAULT 'DRAFT',
  is_urgent_mdo      BOOLEAN NOT NULL DEFAULT FALSE,
  clinical_notes     TEXT,
  submitted_at       TIMESTAMPTZ,
  validated_at       TIMESTAMPTZ,
  validated_by       UUID REFERENCES users(id) ON DELETE SET NULL,
  validation_remarks TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Enforce strictly one daily PV per slaughterhouse per inspector per date
  CONSTRAINT uq_daily_inspection_report UNIQUE (slaughterhouse_id, inspector_id, inspection_date)
);

CREATE INDEX IF NOT EXISTS idx_reports_slaughterhouse ON inspection_reports(slaughterhouse_id);
CREATE INDEX IF NOT EXISTS idx_reports_inspector ON inspection_reports(inspector_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON inspection_reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_date ON inspection_reports(inspection_date DESC);
CREATE INDEX IF NOT EXISTS idx_reports_mdo ON inspection_reports(is_urgent_mdo) WHERE is_urgent_mdo = TRUE;

CREATE TRIGGER set_inspection_reports_updated_at
  BEFORE UPDATE ON inspection_reports
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

COMMENT ON TABLE inspection_reports IS 'Daily sanitary inspection PV. Workflow: DRAFT -> SUBMITTED_TO_WILAYA -> VALIDATED (or RETURNED_FOR_CORRECTION).';

-- ---------------------------------------------------------------------------
-- 5.2 Seizure Items (Aggregated Line Items per Report)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS seizure_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id       UUID NOT NULL REFERENCES inspection_reports(id) ON DELETE CASCADE,
  species_id      UUID NOT NULL REFERENCES species(id) ON DELETE RESTRICT,
  disease_id      UUID NOT NULL REFERENCES diseases(id) ON DELETE RESTRICT,
  organ_id        UUID NOT NULL REFERENCES organs(id) ON DELETE RESTRICT,
  severity        seizure_severity NOT NULL,
  total_quantity  INTEGER NOT NULL DEFAULT 0 CHECK (total_quantity >= 0),
  total_weight    NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (total_weight >= 0),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_seizures_report ON seizure_items(report_id);
CREATE INDEX IF NOT EXISTS idx_seizures_species ON seizure_items(species_id);
CREATE INDEX IF NOT EXISTS idx_seizures_disease ON seizure_items(disease_id);
CREATE INDEX IF NOT EXISTS idx_seizures_organ ON seizure_items(organ_id);

CREATE TRIGGER set_seizure_items_updated_at
  BEFORE UPDATE ON seizure_items
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

COMMENT ON TABLE seizure_items IS 'Aggregated seizure records per report (headcount and weight by species, pathology, organ, severity).';

-- ============================================================================
-- 6. INITIAL SEED DATA (Standard Roles & Dictionaries)
-- ============================================================================

-- 6.1 Standard Institutional Roles
INSERT INTO roles (code, name_fr, name_ar) VALUES
  ('VETERINARIAN',      'Vétérinaire Praticien / Inspecteur',         'طبيب بيطري ممارس / مفتش'),
  ('WILAYA_INSPECTOR',  'Inspecteur Vétérinaire de Wilaya',           'مفتش بيطري ولائي'),
  ('MINISTRY_ADMIN',    'Direction des Services Vétérinaires (DSV)',  'مديرية المصالح البيطرية المركزية'),
  ('SYSTEM_ADMIN',      'Administrateur Système',                     'مسؤول إدارة النظام')
ON CONFLICT (code) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar;

-- 6.2 Livestock Species
INSERT INTO species (code, name_fr, name_ar) VALUES
  ('BOVIN',   'Bovin',   'أبقار'),
  ('OVIN',    'Ovin',    'أغنام'),
  ('CAPRIN',  'Caprin',  'ماعز'),
  ('EQUIN',   'Équin',   'خيول'),
  ('CAMELIN', 'Camelin', 'إبل')
ON CONFLICT (code) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar;

-- 6.3 Codified Diseases & Pathologies (with MDO classification)
INSERT INTO diseases (code, name_fr, name_ar, is_mdo) VALUES
  ('HYDAT',   'Hydatidose (Kyste hydatique)',   'داء المشوكات / أكياس مائية',       FALSE),
  ('TUBER',   'Tuberculose bovine',             'السل البقري',                       TRUE),
  ('FASCIOL', 'Fasciolose (Grande Douve)',       'داء المتورقات / دودة الكبد',       FALSE),
  ('CYSTIC',  'Cysticercose',                   'داء الكيسات المذنبة',              FALSE),
  ('AUTRES',  'Autres affections',              'أمراض وآفات أخرى',                 FALSE)
ON CONFLICT (code) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  is_mdo = EXCLUDED.is_mdo;

-- 6.4 Affected Organs
INSERT INTO organs (code, name_fr, name_ar) VALUES
  ('FOIE',   'Foie',   'الكبد'),
  ('POUMON', 'Poumon', 'الرئة'),
  ('COEUR',  'Cœur',   'القلب')
ON CONFLICT (code) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar;

-- ============================================================================
-- END OF MIGRATION 00001
-- ============================================================================