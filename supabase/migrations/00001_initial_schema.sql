-- ============================================================================
-- MIGRATION: 00001_initial_schema.sql
-- Platform: National Surveillance Platform for Animal Diseases in Abattoirs
-- Target DB: PostgreSQL / Supabase
-- Architecture: DHIS2-inspired clinical aggregated surveillance model
-- ============================================================================

-- Enable required extensions for UUID generation and cryptography
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. ENUM TYPES
-- ============================================================================

-- 1.1 User Roles matching the 4-tier institutional hierarchy
CREATE TYPE user_role AS ENUM (
  'VETERINARIAN',
  'WILAYA_INSPECTOR',
  'MINISTRY',
  'ADMIN'
);

-- 1.2 Inspection Report Workflow Lifecycle Status
CREATE TYPE report_status AS ENUM (
  'DRAFT',
  'SUBMITTED_TO_WILAYA',
  'RETURNED_FOR_CORRECTION',
  'VALIDATED'
);

-- 1.3 Seizure Severity Decision (1C: Partial Seizure, 2C: Total Seizure)
CREATE TYPE seizure_severity AS ENUM (
  '1C',
  '2C'
);

-- 1.4 Slaughter Facility Types
CREATE TYPE facility_type AS ENUM (
  'ABATTOIR_COMMUNAL',
  'ABATTOIR_PRIVE',
  'TUERIE'
);

-- ============================================================================
-- 2. TRIGGER FUNCTIONS
-- ============================================================================

-- 2.1 Generic updated_at timestamp trigger function
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
CREATE TABLE wilayas (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code       VARCHAR(4) NOT NULL UNIQUE,       -- e.g. '16' for Alger
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
CREATE TABLE communes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wilaya_id  UUID NOT NULL REFERENCES wilayas(id) ON DELETE RESTRICT,
  name_fr    VARCHAR(150) NOT NULL,
  name_ar    VARCHAR(150) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_communes_wilaya_id ON communes(wilaya_id);

CREATE TRIGGER set_communes_updated_at
  BEFORE UPDATE ON communes
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

COMMENT ON TABLE communes IS 'Municipalities attached to a parent wilaya.';

-- ---------------------------------------------------------------------------
-- 3.3 Slaughterhouses (Établissements d''Abattage)
-- ---------------------------------------------------------------------------
CREATE TABLE slaughterhouses (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commune_id    UUID NOT NULL REFERENCES communes(id) ON DELETE RESTRICT,
  name_fr       VARCHAR(200) NOT NULL,
  name_ar       VARCHAR(200) NOT NULL,
  facility_type facility_type NOT NULL DEFAULT 'ABATTOIR_COMMUNAL',
  license_number VARCHAR(50),
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_slaughterhouses_commune_id ON slaughterhouses(commune_id);

CREATE TRIGGER set_slaughterhouses_updated_at
  BEFORE UPDATE ON slaughterhouses
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

COMMENT ON TABLE slaughterhouses IS 'Registered slaughter establishments subject to sanitary veterinary inspection.';

-- ---------------------------------------------------------------------------
-- 3.4 Species (Animal Species)
-- ---------------------------------------------------------------------------
CREATE TABLE species (
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
CREATE TABLE diseases (
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

COMMENT ON TABLE diseases IS 'Seizure etiology dictionary. is_mdo=TRUE flags mandatory notifiable epizootics/zoonoses.';

-- ---------------------------------------------------------------------------
-- 3.6 Organs (Affected Organs)
-- ---------------------------------------------------------------------------
CREATE TABLE organs (
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

COMMENT ON TABLE organs IS 'Anatomical organ dictionary for post-mortem seizure classification (FOIE, POUMON, COEUR).';

-- ============================================================================
-- 4. USERS & ROLES (Profiles linked to auth.users)
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 4.1 Profiles
-- ---------------------------------------------------------------------------
CREATE TABLE profiles (
  id                 UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role               user_role NOT NULL DEFAULT 'VETERINARIAN',
  full_name          VARCHAR(200) NOT NULL,
  email              VARCHAR(200) NOT NULL,
  slaughterhouse_id  UUID REFERENCES slaughterhouses(id) ON DELETE SET NULL,
  wilaya_id          UUID REFERENCES wilayas(id) ON DELETE SET NULL,
  license_number     VARCHAR(50),
  is_active          BOOLEAN NOT NULL DEFAULT TRUE,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Institutional role scoping constraints:
  CONSTRAINT chk_profile_assignment CHECK (
    (role = 'VETERINARIAN' AND slaughterhouse_id IS NOT NULL)
    OR (role = 'WILAYA_INSPECTOR' AND wilaya_id IS NOT NULL)
    OR (role IN ('MINISTRY', 'ADMIN'))
  )
);

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_slaughterhouse_id ON profiles(slaughterhouse_id);
CREATE INDEX idx_profiles_wilaya_id ON profiles(wilaya_id);

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

COMMENT ON TABLE profiles IS 'Extended user profiles linked to Supabase auth.users. Role determines operational scope and RLS access.';

-- ============================================================================
-- 5. TRANSACTIONAL DATA (Workflow & Aggregation)
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 5.1 Inspection Reports (Procès-Verbaux Journaliers)
-- ---------------------------------------------------------------------------
CREATE TABLE inspection_reports (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slaughterhouse_id  UUID NOT NULL REFERENCES slaughterhouses(id) ON DELETE RESTRICT,
  inspector_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  inspection_date    DATE NOT NULL DEFAULT CURRENT_DATE,
  status             report_status NOT NULL DEFAULT 'DRAFT',
  is_urgent_mdo      BOOLEAN NOT NULL DEFAULT FALSE,
  clinical_notes     TEXT,
  submitted_at       TIMESTAMPTZ,
  validated_at       TIMESTAMPTZ,
  validated_by       UUID REFERENCES profiles(id) ON DELETE SET NULL,
  validation_remarks TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Enforce one daily PV per slaughterhouse per inspector per date
  CONSTRAINT uq_daily_inspection_report UNIQUE (slaughterhouse_id, inspector_id, inspection_date)
);

CREATE INDEX idx_reports_slaughterhouse ON inspection_reports(slaughterhouse_id);
CREATE INDEX idx_reports_inspector ON inspection_reports(inspector_id);
CREATE INDEX idx_reports_status ON inspection_reports(status);
CREATE INDEX idx_reports_date ON inspection_reports(inspection_date DESC);
CREATE INDEX idx_reports_mdo ON inspection_reports(is_urgent_mdo) WHERE is_urgent_mdo = TRUE;

CREATE TRIGGER set_inspection_reports_updated_at
  BEFORE UPDATE ON inspection_reports
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

COMMENT ON TABLE inspection_reports IS 'Daily PV of meat inspection. Follows strict workflow: DRAFT -> SUBMITTED_TO_WILAYA -> VALIDATED (or RETURNED_FOR_CORRECTION).';

-- ---------------------------------------------------------------------------
-- 5.2 Seizure Items (Aggregated Findings per PV)
-- ---------------------------------------------------------------------------
CREATE TABLE seizure_items (
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

CREATE INDEX idx_seizures_report ON seizure_items(report_id);
CREATE INDEX idx_seizures_species ON seizure_items(species_id);
CREATE INDEX idx_seizures_disease ON seizure_items(disease_id);
CREATE INDEX idx_seizures_organ ON seizure_items(organ_id);

CREATE TRIGGER set_seizure_items_updated_at
  BEFORE UPDATE ON seizure_items
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

COMMENT ON TABLE seizure_items IS 'Aggregated seizure records per report. Records totals (quantity, weight) by species, pathology, organ, and severity decision.';

-- ============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
-- Access control model:
--   - VETERINARIAN: Full CRUD on own inspection reports and seizure items.
--   - WILAYA_INSPECTOR: Read all submitted reports in their wilaya; update status to VALIDATED or RETURNED_FOR_CORRECTION.
--   - MINISTRY: Read-only access to all submitted/validated reports nationwide.
--   - ADMIN: Full administrative access across all tables.

ALTER TABLE wilayas ENABLE ROW LEVEL SECURITY;
ALTER TABLE communes ENABLE ROW LEVEL SECURITY;
ALTER TABLE slaughterhouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE species ENABLE ROW LEVEL SECURITY;
ALTER TABLE diseases ENABLE ROW LEVEL SECURITY;
ALTER TABLE organs ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspection_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE seizure_items ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- 6.1 Reference Tables (Read for all authenticated, write for ADMIN)
-- ---------------------------------------------------------------------------
CREATE POLICY "wilayas_read_auth" ON wilayas FOR SELECT TO authenticated USING (true);
CREATE POLICY "communes_read_auth" ON communes FOR SELECT TO authenticated USING (true);
CREATE POLICY "slaughterhouses_read_auth" ON slaughterhouses FOR SELECT TO authenticated USING (true);
CREATE POLICY "species_read_auth" ON species FOR SELECT TO authenticated USING (true);
CREATE POLICY "diseases_read_auth" ON diseases FOR SELECT TO authenticated USING (true);
CREATE POLICY "organs_read_auth" ON organs FOR SELECT TO authenticated USING (true);

CREATE POLICY "wilayas_admin_all" ON wilayas FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'));

CREATE POLICY "communes_admin_all" ON communes FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'));

CREATE POLICY "slaughterhouses_admin_all" ON slaughterhouses FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'));

CREATE POLICY "species_admin_all" ON species FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'));

CREATE POLICY "diseases_admin_all" ON diseases FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'));

CREATE POLICY "organs_admin_all" ON organs FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'));

-- ---------------------------------------------------------------------------
-- 6.2 Profiles RLS
-- ---------------------------------------------------------------------------
CREATE POLICY "profiles_read_own" ON profiles FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY "profiles_read_wilaya" ON profiles FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
        AND p.role = 'WILAYA_INSPECTOR'
        AND profiles.wilaya_id = p.wilaya_id
    )
  );

CREATE POLICY "profiles_admin_all" ON profiles FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'ADMIN'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'ADMIN'));

-- ---------------------------------------------------------------------------
-- 6.3 Inspection Reports RLS
-- ---------------------------------------------------------------------------
-- Veterinarians: manage own reports
CREATE POLICY "reports_vet_manage" ON inspection_reports FOR ALL TO authenticated
  USING (inspector_id = auth.uid())
  WITH CHECK (inspector_id = auth.uid());

-- Wilaya Inspectors: read submitted reports in their wilaya
CREATE POLICY "reports_wilaya_read" ON inspection_reports FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM profiles p
      JOIN slaughterhouses s ON s.id = inspection_reports.slaughterhouse_id
      JOIN communes c ON c.id = s.commune_id
      WHERE p.id = auth.uid()
        AND p.role = 'WILAYA_INSPECTOR'
        AND c.wilaya_id = p.wilaya_id
        AND inspection_reports.status != 'DRAFT'
    )
  );

-- Wilaya Inspectors: update report status (validate or return for correction)
CREATE POLICY "reports_wilaya_update" ON inspection_reports FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM profiles p
      JOIN slaughterhouses s ON s.id = inspection_reports.slaughterhouse_id
      JOIN communes c ON c.id = s.commune_id
      WHERE p.id = auth.uid()
        AND p.role = 'WILAYA_INSPECTOR'
        AND c.wilaya_id = p.wilaya_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM profiles p
      JOIN slaughterhouses s ON s.id = inspection_reports.slaughterhouse_id
      JOIN communes c ON c.id = s.commune_id
      WHERE p.id = auth.uid()
        AND p.role = 'WILAYA_INSPECTOR'
        AND c.wilaya_id = p.wilaya_id
    )
  );

-- Ministry: read all submitted/validated reports nationwide
CREATE POLICY "reports_ministry_read" ON inspection_reports FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'MINISTRY'
    )
    AND status != 'DRAFT'
  );

-- Admins: full access
CREATE POLICY "reports_admin_all" ON inspection_reports FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'));

-- ---------------------------------------------------------------------------
-- 6.4 Seizure Items RLS
-- ---------------------------------------------------------------------------
-- Veterinarians: manage items in own reports
CREATE POLICY "seizures_vet_manage" ON seizure_items FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM inspection_reports r
      WHERE r.id = seizure_items.report_id AND r.inspector_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM inspection_reports r
      WHERE r.id = seizure_items.report_id AND r.inspector_id = auth.uid()
    )
  );

-- Wilaya Inspectors: read items from reports in their wilaya
CREATE POLICY "seizures_wilaya_read" ON seizure_items FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM inspection_reports r
      JOIN slaughterhouses s ON s.id = r.slaughterhouse_id
      JOIN communes c ON c.id = s.commune_id
      JOIN profiles p ON p.id = auth.uid()
      WHERE r.id = seizure_items.report_id
        AND p.role = 'WILAYA_INSPECTOR'
        AND c.wilaya_id = p.wilaya_id
        AND r.status != 'DRAFT'
    )
  );

-- Ministry: read all non-draft seizure items nationwide
CREATE POLICY "seizures_ministry_read" ON seizure_items FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'MINISTRY')
    AND EXISTS (SELECT 1 FROM inspection_reports r WHERE r.id = seizure_items.report_id AND r.status != 'DRAFT')
  );

-- Admins: full access
CREATE POLICY "seizures_admin_all" ON seizure_items FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'));

-- ============================================================================
-- 7. INITIAL SEED DATA (Codified Reference Dictionaries)
-- ============================================================================

-- 7.1 Species
INSERT INTO species (code, name_fr, name_ar) VALUES
  ('BOVIN',   'Bovin',   'أبقار'),
  ('OVIN',    'Ovin',    'أغنام'),
  ('CAPRIN',  'Caprin',  'ماعز'),
  ('EQUIN',   'Équin',   'خيول'),
  ('CAMELIN', 'Camelin', 'إبل')
ON CONFLICT (code) DO NOTHING;

-- 7.2 Diseases
INSERT INTO diseases (code, name_fr, name_ar, is_mdo) VALUES
  ('HYDAT',   'Hydatidose (Kyste hydatique)',   'داء المشوكات / أكياس مائية',       FALSE),
  ('TUBER',   'Tuberculose bovine',             'السل البقري',                       TRUE),
  ('FASCIOL', 'Fasciolose (Grande Douve)',       'داء المتورقات / دودة الكبد',       FALSE),
  ('CYSTIC',  'Cysticercose',                   'داء الكيسات المذنبة',              FALSE),
  ('AUTRES',  'Autres affections',              'أمراض وآفات أخرى',                 FALSE)
ON CONFLICT (code) DO NOTHING;

-- 7.3 Organs
INSERT INTO organs (code, name_fr, name_ar) VALUES
  ('FOIE',   'Foie',   'الكبد'),
  ('POUMON', 'Poumon', 'الرئة'),
  ('COEUR',  'Cœur',   'القلب')
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- END OF MIGRATION 00001
-- ============================================================================