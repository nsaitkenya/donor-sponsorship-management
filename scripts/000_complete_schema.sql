-- ============================================================================
-- STAREHE DONOR & SPONSORSHIP MANAGEMENT SYSTEM
-- Complete Database Schema - Single File
-- ============================================================================
-- This script creates the entire database schema including:
-- 1. Extensions and Enum Types
-- 2. Core Tables
-- 3. Triggers and Functions
-- 4. Row Level Security (RLS) Policies
-- 5. Admin Tables (System Settings, Audit Logs)
-- 6. Sample Campaign Data
--
-- USAGE: Run this entire script in Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- SECTION 1: EXTENSIONS AND ENUM TYPES
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('donor', 'finance_officer', 'sponsorship_officer', 'resource_mobilization', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE donor_type AS ENUM ('individual', 'corporate', 'foundation', 'government', 'other');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_method AS ENUM ('mpesa', 'card', 'paypal', 'bank_transfer', 'check', 'cash');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE donation_type AS ENUM ('one_time', 'recurring', 'sponsorship', 'campaign');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE campaign_status AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE student_status AS ENUM ('active', 'graduated', 'withdrawn', 'suspended');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE matching_status AS ENUM ('pending', 'matched', 'active', 'completed', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- SECTION 2: CORE TABLES
-- ============================================================================

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'donor',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Donors table
CREATE TABLE IF NOT EXISTS public.donors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  donor_type donor_type NOT NULL DEFAULT 'individual',
  organization_name TEXT,
  tax_id TEXT,
  address TEXT,
  city TEXT,
  country TEXT DEFAULT 'Kenya',
  postal_code TEXT,
  preferred_contact_method TEXT,
  communication_preferences JSONB DEFAULT '{"email": true, "sms": false, "phone": false}'::jsonb,
  total_donated NUMERIC(12, 2) DEFAULT 0,
  donation_count INTEGER DEFAULT 0,
  first_donation_date TIMESTAMPTZ,
  last_donation_date TIMESTAMPTZ,
  is_anonymous BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;

-- Students table
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT,
  grade_level TEXT,
  admission_date DATE,
  status student_status DEFAULT 'active',
  photo_url TEXT,
  background_story TEXT,
  academic_performance JSONB,
  interests TEXT[],
  needs_assessment JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Campaigns table
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  brief_details TEXT,
  goal_amount NUMERIC(12, 2) NOT NULL,
  current_amount NUMERIC(12, 2) DEFAULT 0,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  status campaign_status DEFAULT 'draft',
  category TEXT,
  image_url TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- Donations table
CREATE TABLE IF NOT EXISTS public.donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_id UUID REFERENCES public.donors(id) ON DELETE SET NULL,
  amount NUMERIC(12, 2) NOT NULL,
  currency TEXT DEFAULT 'KES',
  donation_type donation_type NOT NULL,
  payment_method payment_method NOT NULL,
  payment_status payment_status DEFAULT 'pending',
  transaction_reference TEXT UNIQUE,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
  is_anonymous BOOLEAN DEFAULT false,
  message TEXT,
  receipt_url TEXT,
  tax_deductible BOOLEAN DEFAULT true,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Sponsorships table (student-donor matching)
CREATE TABLE IF NOT EXISTS public.sponsorships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  donor_id UUID REFERENCES public.donors(id) ON DELETE CASCADE,
  amount NUMERIC(12, 2) NOT NULL,
  frequency TEXT NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  status matching_status DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.sponsorships ENABLE ROW LEVEL SECURITY;

-- Progress reports table
CREATE TABLE IF NOT EXISTS public.progress_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sponsorship_id UUID REFERENCES public.sponsorships(id) ON DELETE CASCADE,
  report_period TEXT NOT NULL,
  academic_progress TEXT,
  attendance_rate NUMERIC(5, 2),
  behavioral_notes TEXT,
  achievements TEXT[],
  challenges TEXT[],
  photos JSONB,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.progress_reports ENABLE ROW LEVEL SECURITY;

-- System settings table
CREATE TABLE IF NOT EXISTS public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES public.profiles(id)
);

ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Audit logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- SECTION 3: INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_donors_user_id ON public.donors(user_id);
CREATE INDEX IF NOT EXISTS idx_donations_donor_id ON public.donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_donations_campaign_id ON public.donations(campaign_id);
CREATE INDEX IF NOT EXISTS idx_donations_status ON public.donations(payment_status);
CREATE INDEX IF NOT EXISTS idx_sponsorships_student_id ON public.sponsorships(student_id);
CREATE INDEX IF NOT EXISTS idx_sponsorships_donor_id ON public.sponsorships(donor_id);
CREATE INDEX IF NOT EXISTS idx_progress_reports_sponsorship_id ON public.progress_reports(sponsorship_id);

-- ============================================================================
-- SECTION 4: TRIGGERS AND FUNCTIONS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all tables
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_donors_updated_at ON public.donors;
CREATE TRIGGER update_donors_updated_at BEFORE UPDATE ON public.donors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_students_updated_at ON public.students;
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_campaigns_updated_at ON public.campaigns;
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_donations_updated_at ON public.donations;
CREATE TRIGGER update_donations_updated_at BEFORE UPDATE ON public.donations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_sponsorships_updated_at ON public.sponsorships;
CREATE TRIGGER update_sponsorships_updated_at BEFORE UPDATE ON public.sponsorships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE((NEW.raw_user_meta_data ->> 'role')::user_role, 'donor')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Update donor statistics on donation
CREATE OR REPLACE FUNCTION update_donor_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.payment_status = 'completed' THEN
    UPDATE public.donors
    SET 
      total_donated = total_donated + NEW.amount,
      donation_count = donation_count + 1,
      last_donation_date = NEW.created_at,
      first_donation_date = COALESCE(first_donation_date, NEW.created_at)
    WHERE id = NEW.donor_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_donor_stats_trigger ON public.donations;
CREATE TRIGGER update_donor_stats_trigger
  AFTER INSERT OR UPDATE ON public.donations
  FOR EACH ROW
  EXECUTE FUNCTION update_donor_stats();

-- Update campaign current amount on donation
CREATE OR REPLACE FUNCTION update_campaign_amount()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.payment_status = 'completed' AND NEW.campaign_id IS NOT NULL THEN
    UPDATE public.campaigns
    SET current_amount = current_amount + NEW.amount
    WHERE id = NEW.campaign_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_campaign_amount_trigger ON public.donations;
CREATE TRIGGER update_campaign_amount_trigger
  AFTER INSERT OR UPDATE ON public.donations
  FOR EACH ROW
  EXECUTE FUNCTION update_campaign_amount();

-- ============================================================================
-- SECTION 5: HELPER FUNCTIONS FOR RLS
-- ============================================================================

-- Helper function to check user role (bypasses RLS)
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS user_role
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = user_id;
$$;

-- Helper function to check if user has specific role
CREATE OR REPLACE FUNCTION public.has_role(required_role user_role)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = required_role
  );
$$;

-- Helper function to check if user has any of multiple roles
CREATE OR REPLACE FUNCTION public.has_any_role(required_roles user_role[])
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = ANY(required_roles)
  );
$$;

-- ============================================================================
-- SECTION 6: ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Drop all existing policies to avoid conflicts
DO $$ 
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT schemaname, tablename, policyname 
    FROM pg_policies 
    WHERE schemaname = 'public'
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
  END LOOP;
END $$;

-- ============================================================================
-- PROFILES POLICIES
-- ============================================================================

CREATE POLICY "profiles_select_own_or_staff"
  ON public.profiles FOR SELECT
  USING (
    auth.uid() = id OR 
    public.has_any_role(ARRAY['finance_officer', 'sponsorship_officer', 'resource_mobilization', 'admin']::user_role[])
  );

CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own_or_admin"
  ON public.profiles FOR UPDATE
  USING (
    auth.uid() = id OR 
    public.has_role('admin'::user_role)
  );

-- ============================================================================
-- DONORS POLICIES
-- ============================================================================

CREATE POLICY "donors_select_own_or_staff"
  ON public.donors FOR SELECT
  USING (
    auth.uid() = user_id OR
    public.has_any_role(ARRAY['finance_officer', 'sponsorship_officer', 'resource_mobilization', 'admin']::user_role[])
  );

CREATE POLICY "donors_insert_own"
  ON public.donors FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "donors_update_own"
  ON public.donors FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================================
-- STUDENTS POLICIES
-- ============================================================================

CREATE POLICY "students_select_authenticated"
  ON public.students FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "students_manage_staff"
  ON public.students FOR ALL
  USING (
    public.has_any_role(ARRAY['sponsorship_officer', 'admin']::user_role[])
  );

-- ============================================================================
-- CAMPAIGNS POLICIES
-- ============================================================================

CREATE POLICY "campaigns_select_all"
  ON public.campaigns FOR SELECT
  USING (true);

CREATE POLICY "campaigns_manage_staff"
  ON public.campaigns FOR ALL
  USING (
    public.has_any_role(ARRAY['resource_mobilization', 'admin']::user_role[])
  );

-- ============================================================================
-- DONATIONS POLICIES
-- ============================================================================

CREATE POLICY "donations_select_own_or_staff"
  ON public.donations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.donors
      WHERE donors.id = donations.donor_id
      AND donors.user_id = auth.uid()
    ) OR
    public.has_any_role(ARRAY['finance_officer', 'admin']::user_role[])
  );

CREATE POLICY "donations_insert_own_or_staff"
  ON public.donations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.donors
      WHERE donors.id = donations.donor_id
      AND donors.user_id = auth.uid()
    ) OR
    public.has_any_role(ARRAY['finance_officer', 'admin']::user_role[])
  );

CREATE POLICY "donations_update_staff"
  ON public.donations FOR UPDATE
  USING (
    public.has_any_role(ARRAY['finance_officer', 'admin']::user_role[])
  );

-- ============================================================================
-- SPONSORSHIPS POLICIES
-- ============================================================================

CREATE POLICY "sponsorships_select_own_or_staff"
  ON public.sponsorships FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.donors
      WHERE donors.id = sponsorships.donor_id
      AND donors.user_id = auth.uid()
    ) OR
    public.has_any_role(ARRAY['sponsorship_officer', 'admin']::user_role[])
  );

CREATE POLICY "sponsorships_manage_staff"
  ON public.sponsorships FOR ALL
  USING (
    public.has_any_role(ARRAY['sponsorship_officer', 'admin']::user_role[])
  );

-- ============================================================================
-- PROGRESS REPORTS POLICIES
-- ============================================================================

CREATE POLICY "progress_reports_select_own_or_staff"
  ON public.progress_reports FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.sponsorships s
      JOIN public.donors d ON d.id = s.donor_id
      WHERE s.id = progress_reports.sponsorship_id
      AND d.user_id = auth.uid()
    ) OR
    public.has_any_role(ARRAY['sponsorship_officer', 'admin']::user_role[])
  );

CREATE POLICY "progress_reports_manage_staff"
  ON public.progress_reports FOR ALL
  USING (
    public.has_any_role(ARRAY['sponsorship_officer', 'admin']::user_role[])
  );

-- ============================================================================
-- SYSTEM SETTINGS POLICIES
-- ============================================================================

CREATE POLICY "system_settings_admin_only"
  ON public.system_settings FOR ALL
  USING (public.has_role('admin'::user_role));

-- ============================================================================
-- AUDIT LOGS POLICIES
-- ============================================================================

CREATE POLICY "audit_logs_admin_view"
  ON public.audit_logs FOR SELECT
  USING (public.has_role('admin'::user_role));

-- ============================================================================
-- SECTION 7: SEED DATA
-- ============================================================================

-- Insert default system settings
INSERT INTO public.system_settings (key, value, description) VALUES
  ('site_name', '"Starehe Boys Centre - Donor Management"', 'Name of the institution'),
  ('contact_email', '"info@starehe.ac.ke"', 'Primary contact email'),
  ('contact_phone', '"+254 20 2712903"', 'Primary contact phone'),
  ('mpesa_paybill', '"123456"', 'M-Pesa Paybill number'),
  ('bank_account', '"1234567890"', 'Bank account number'),
  ('bank_name', '"Kenya Commercial Bank"', 'Bank name'),
  ('min_donation_amount', '100', 'Minimum donation amount in KES'),
  ('sponsorship_amount_monthly', '5000', 'Monthly sponsorship amount in KES'),
  ('enable_mpesa', 'true', 'Enable M-Pesa payments'),
  ('enable_card', 'true', 'Enable card payments'),
  ('enable_paypal', 'true', 'Enable PayPal payments'),
  ('enable_bank_transfer', 'true', 'Enable bank transfers')
ON CONFLICT (key) DO NOTHING;

-- Insert sample campaigns
INSERT INTO public.campaigns (
  title,
  description,
  brief_details,
  goal_amount,
  current_amount,
  start_date,
  end_date,
  status,
  category,
  image_url
) VALUES 
(
  'Living the Charge - Paris Marathon 2027',
  'Living the Charge is an initiative to expand access to volunteering opportunities for academically promising yet underserved high school students across Kenya. We are raising $100,000 to seed a permanent endowment whose investment returns will sustainably finance structured volunteer placements through the Voluntary Service Scheme (VSS). Founded in 1959, Starehe Boys'' Centre operates the VSS model where students undertake 2-3 week holiday job placements in corporations, hospitals, government offices, and NGOs across Kenya. The endowment will finance approximately 250-350 students per year at $45 per student, covering transport, meals, and liability insurance. Three alumni - Socrates Okong''o (Wharton), Ricky David (Georgia State), and Nathan Charllemagne - will run the Paris Marathon in April 2027 to rally support for this transformative initiative that converts philanthropy into a durable financial structure for sustained, intergenerational impact.',
  'Raising $100,000 to fund the Voluntary Service Scheme (VSS) endowment - providing 250-350 students per year with professional volunteer placements at no cost. Three alumni will run the Paris Marathon 2027 to rally support for this transformative initiative that turns talent into opportunity.',
  100000.00,
  12500.00,
  '2025-01-01',
  '2027-04-30',
  'active',
  'Endowment Fund',
  'https://stareheboyscentre.org/wp-content/uploads/2025/02/IMG_8171-2048x1365.jpg'
),
(
  'School Infrastructure Development 2025',
  'Upgrading classroom facilities, laboratories, and learning spaces to provide world-class education infrastructure for our students.',
  'Transforming learning spaces with modern classrooms, science labs, and facilities to deliver world-class education.',
  50000.00,
  32000.00,
  '2025-01-01',
  '2025-12-31',
  'active',
  'Infrastructure',
  NULL
),
(
  'Student Scholarship Fund',
  'Providing full scholarships to talented students from disadvantaged backgrounds, covering tuition, accommodation, and learning materials.',
  'Full scholarships covering tuition, accommodation, and materials for talented students from disadvantaged backgrounds.',
  75000.00,
  58000.00,
  '2025-01-01',
  '2025-12-31',
  'active',
  'Scholarships',
  NULL
),
(
  'Technology & Innovation Lab',
  'Establishing a state-of-the-art technology lab with computers, software, and equipment to prepare students for the digital economy.',
  'Building a cutting-edge technology lab to equip students with digital skills for the modern economy.',
  35000.00,
  18500.00,
  '2025-02-01',
  '2025-11-30',
  'active',
  'Technology',
  NULL
)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

DO $$ 
BEGIN
  RAISE NOTICE '============================================================================';
  RAISE NOTICE 'Database schema created successfully!';
  RAISE NOTICE '============================================================================';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Create test users at: /setup-users';
  RAISE NOTICE '2. Login at: /auth/login';
  RAISE NOTICE '3. Test credentials:';
  RAISE NOTICE '   - donor@starehe.ac.ke / Donor@123';
  RAISE NOTICE '   - finance@starehe.ac.ke / Finance@123';
  RAISE NOTICE '   - sponsorship@starehe.ac.ke / Sponsor@123';
  RAISE NOTICE '   - resource@starehe.ac.ke / Resource@123';
  RAISE NOTICE '   - admin@starehe.ac.ke / Admin@123';
  RAISE NOTICE '============================================================================';
END $$;
