-- QUICK FIX: Run this entire script in Supabase SQL Editor to fix database issues
-- This will setup everything needed for the application to work

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create enum types if they don't exist
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

-- 3. Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  phone text,
  role user_role NOT NULL DEFAULT 'donor',
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_all" ON public.profiles;

-- Create policies
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Allow admins and staff to view all profiles
CREATE POLICY "profiles_select_all" ON public.profiles FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() 
    AND p.role IN ('admin', 'finance_officer', 'sponsorship_officer', 'resource_mobilization')
  )
);

-- 4. Create donors table
CREATE TABLE IF NOT EXISTS public.donors (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  donor_type donor_type NOT NULL DEFAULT 'individual',
  organization_name text,
  tax_id text,
  address text,
  city text,
  country text DEFAULT 'Kenya',
  postal_code text,
  preferred_contact_method text,
  communication_preferences jsonb DEFAULT '{"email": true, "sms": false, "phone": false}'::jsonb,
  total_donated numeric(12, 2) DEFAULT 0,
  donation_count integer DEFAULT 0,
  first_donation_date timestamptz,
  last_donation_date timestamptz,
  is_anonymous boolean DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "donors_select_own" ON public.donors;
DROP POLICY IF EXISTS "donors_insert_own" ON public.donors;
DROP POLICY IF EXISTS "donors_update_own" ON public.donors;
DROP POLICY IF EXISTS "donors_select_staff" ON public.donors;

CREATE POLICY "donors_select_own" ON public.donors FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "donors_insert_own" ON public.donors FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "donors_update_own" ON public.donors FOR UPDATE USING (auth.uid() = user_id);

-- Allow staff to view all donors
CREATE POLICY "donors_select_staff" ON public.donors FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() 
    AND p.role IN ('admin', 'finance_officer', 'resource_mobilization')
  )
);

-- 5. Create students table
CREATE TABLE IF NOT EXISTS public.students (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  date_of_birth date,
  gender text,
  grade_level text,
  admission_date date,
  status student_status DEFAULT 'active',
  photo_url text,
  background_story text,
  academic_performance jsonb,
  interests text[],
  needs_assessment jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "students_select_authenticated" ON public.students;
DROP POLICY IF EXISTS "students_insert_staff" ON public.students;
DROP POLICY IF EXISTS "students_update_staff" ON public.students;

CREATE POLICY "students_select_authenticated" ON public.students FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "students_insert_staff" ON public.students FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() 
    AND p.role IN ('admin', 'sponsorship_officer')
  )
);

CREATE POLICY "students_update_staff" ON public.students FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() 
    AND p.role IN ('admin', 'sponsorship_officer')
  )
);

-- 6. Create campaigns table
CREATE TABLE IF NOT EXISTS public.campaigns (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  goal_amount numeric(12, 2) NOT NULL,
  current_amount numeric(12, 2) DEFAULT 0,
  start_date timestamptz NOT NULL,
  end_date timestamptz,
  status campaign_status DEFAULT 'draft',
  category text,
  image_url text,
  created_by uuid REFERENCES public.profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "campaigns_select_all" ON public.campaigns;
CREATE POLICY "campaigns_select_all" ON public.campaigns FOR SELECT USING (true);

-- 7. Create donations table
CREATE TABLE IF NOT EXISTS public.donations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_id uuid REFERENCES public.donors(id) ON DELETE SET NULL,
  amount numeric(12, 2) NOT NULL,
  currency text DEFAULT 'KES',
  donation_type donation_type NOT NULL,
  payment_method payment_method NOT NULL,
  payment_status payment_status DEFAULT 'pending',
  transaction_reference text UNIQUE,
  campaign_id uuid REFERENCES public.campaigns(id) ON DELETE SET NULL,
  is_anonymous boolean DEFAULT false,
  message text,
  receipt_url text,
  tax_deductible boolean DEFAULT true,
  processed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "donations_select_own" ON public.donations;
DROP POLICY IF EXISTS "donations_insert_own" ON public.donations;
DROP POLICY IF EXISTS "donations_select_staff" ON public.donations;

CREATE POLICY "donations_select_own" ON public.donations FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.donors d
    WHERE d.id = donations.donor_id AND d.user_id = auth.uid()
  )
);

CREATE POLICY "donations_insert_own" ON public.donations FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.donors d
    WHERE d.id = donations.donor_id AND d.user_id = auth.uid()
  )
);

CREATE POLICY "donations_select_staff" ON public.donations FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() 
    AND p.role IN ('admin', 'finance_officer', 'resource_mobilization')
  )
);

-- 8. Create sponsorships table
CREATE TABLE IF NOT EXISTS public.sponsorships (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id uuid REFERENCES public.students(id) ON DELETE CASCADE,
  donor_id uuid REFERENCES public.donors(id) ON DELETE CASCADE,
  amount numeric(12, 2) NOT NULL,
  frequency text NOT NULL,
  start_date timestamptz NOT NULL,
  end_date timestamptz,
  status matching_status DEFAULT 'pending',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.sponsorships ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "sponsorships_select_own" ON public.sponsorships;
DROP POLICY IF EXISTS "sponsorships_select_staff" ON public.sponsorships;

CREATE POLICY "sponsorships_select_own" ON public.sponsorships FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.donors d
    WHERE d.id = sponsorships.donor_id AND d.user_id = auth.uid()
  )
);

CREATE POLICY "sponsorships_select_staff" ON public.sponsorships FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() 
    AND p.role IN ('admin', 'sponsorship_officer', 'finance_officer', 'resource_mobilization')
  )
);

-- 9. Create progress_reports table
CREATE TABLE IF NOT EXISTS public.progress_reports (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  sponsorship_id uuid REFERENCES public.sponsorships(id) ON DELETE CASCADE,
  report_period text NOT NULL,
  academic_progress text,
  attendance_rate numeric(5, 2),
  behavioral_notes text,
  achievements text[],
  challenges text[],
  photos jsonb,
  created_by uuid REFERENCES public.profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.progress_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "progress_reports_select_own" ON public.progress_reports;

CREATE POLICY "progress_reports_select_own" ON public.progress_reports FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.sponsorships s
    JOIN public.donors d ON d.id = s.donor_id
    WHERE s.id = progress_reports.sponsorship_id AND d.user_id = auth.uid()
  )
);

-- 10. Create audit_logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES public.profiles(id),
  action text NOT NULL,
  table_name text NOT NULL,
  record_id uuid,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "audit_logs_select_admin" ON public.audit_logs;

CREATE POLICY "audit_logs_select_admin" ON public.audit_logs FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

-- 11. Create indexes
CREATE INDEX IF NOT EXISTS idx_donors_user_id ON public.donors(user_id);
CREATE INDEX IF NOT EXISTS idx_donations_donor_id ON public.donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_donations_campaign_id ON public.donations(campaign_id);
CREATE INDEX IF NOT EXISTS idx_donations_status ON public.donations(payment_status);
CREATE INDEX IF NOT EXISTS idx_sponsorships_student_id ON public.sponsorships(student_id);
CREATE INDEX IF NOT EXISTS idx_sponsorships_donor_id ON public.sponsorships(donor_id);
CREATE INDEX IF NOT EXISTS idx_progress_reports_sponsorship_id ON public.progress_reports(sponsorship_id);

-- 12. Link existing auth users to profiles (if any exist)
INSERT INTO public.profiles (id, email, role)
SELECT id, email, 'donor'::user_role 
FROM auth.users 
WHERE email = 'donor@starehe.ac.ke'
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profiles (id, email, role)
SELECT id, email, 'finance_officer'::user_role 
FROM auth.users 
WHERE email = 'finance@starehe.ac.ke'
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profiles (id, email, role)
SELECT id, email, 'sponsorship_officer'::user_role 
FROM auth.users 
WHERE email = 'sponsorship@starehe.ac.ke'
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profiles (id, email, role)
SELECT id, email, 'resource_mobilization'::user_role 
FROM auth.users 
WHERE email = 'resource@starehe.ac.ke'
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profiles (id, email, role)
SELECT id, email, 'admin'::user_role 
FROM auth.users 
WHERE email = 'admin@starehe.ac.ke'
ON CONFLICT (id) DO NOTHING;

-- 13. Verify setup
SELECT 'Setup complete!' as status;
SELECT COUNT(*) as profiles_count FROM public.profiles;
SELECT email, role FROM public.profiles ORDER BY email;
