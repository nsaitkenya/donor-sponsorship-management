-- Fix infinite recursion in RLS policies by using a helper function
-- This function uses security definer to bypass RLS when checking roles

-- Drop existing problematic policies
DROP POLICY IF EXISTS "finance_officers_view_all_profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON public.profiles;
DROP POLICY IF EXISTS "finance_officers_view_all_donations" ON public.donations;
DROP POLICY IF EXISTS "finance_officers_update_donations" ON public.donations;
DROP POLICY IF EXISTS "finance_officers_view_all_donors" ON public.donors;
DROP POLICY IF EXISTS "Admins can view all donors" ON public.donors;
DROP POLICY IF EXISTS "Admins can view all students" ON public.students;
DROP POLICY IF EXISTS "Admins can view all campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Admins can update campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Admins can delete campaigns" ON public.campaigns;

-- Create a helper function to check user role (bypasses RLS)
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS user_role
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = user_id;
$$;

-- Create a helper function to check if user has role
CREATE OR REPLACE FUNCTION public.has_role(required_role user_role)
RETURNS boolean
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

-- Create a helper function to check if user has any of multiple roles
CREATE OR REPLACE FUNCTION public.has_any_role(required_roles user_role[])
RETURNS boolean
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

-- Recreate profiles policies without recursion
CREATE POLICY "staff_view_all_profiles"
  ON public.profiles FOR SELECT
  USING (
    auth.uid() = id OR 
    public.has_any_role(ARRAY['finance_officer', 'sponsorship_officer', 'resource_mobilization', 'admin']::user_role[])
  );

CREATE POLICY "admin_update_profiles"
  ON public.profiles FOR UPDATE
  USING (
    auth.uid() = id OR 
    public.has_role('admin'::user_role)
  );

-- Recreate donations policies
CREATE POLICY "staff_view_all_donations"
  ON public.donations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.donors
      WHERE donors.id = donations.donor_id
      AND donors.user_id = auth.uid()
    ) OR
    public.has_any_role(ARRAY['finance_officer', 'admin']::user_role[])
  );

CREATE POLICY "staff_update_donations"
  ON public.donations FOR UPDATE
  USING (
    public.has_any_role(ARRAY['finance_officer', 'admin']::user_role[])
  );

CREATE POLICY "staff_insert_donations"
  ON public.donations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.donors
      WHERE donors.id = donations.donor_id
      AND donors.user_id = auth.uid()
    ) OR
    public.has_any_role(ARRAY['finance_officer', 'admin']::user_role[])
  );

-- Recreate donors policies
CREATE POLICY "staff_view_all_donors"
  ON public.donors FOR SELECT
  USING (
    auth.uid() = user_id OR
    public.has_any_role(ARRAY['finance_officer', 'sponsorship_officer', 'resource_mobilization', 'admin']::user_role[])
  );

-- Recreate students policies
CREATE POLICY "staff_manage_students"
  ON public.students FOR ALL
  USING (
    public.has_any_role(ARRAY['sponsorship_officer', 'admin']::user_role[])
  );

-- Recreate campaigns policies
CREATE POLICY "staff_manage_campaigns"
  ON public.campaigns FOR ALL
  USING (
    public.has_any_role(ARRAY['resource_mobilization', 'admin']::user_role[])
  );

-- Recreate sponsorships policies
CREATE POLICY "staff_view_all_sponsorships"
  ON public.sponsorships FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.donors
      WHERE donors.id = sponsorships.donor_id
      AND donors.user_id = auth.uid()
    ) OR
    public.has_any_role(ARRAY['sponsorship_officer', 'admin']::user_role[])
  );

CREATE POLICY "staff_manage_sponsorships"
  ON public.sponsorships FOR ALL
  USING (
    public.has_any_role(ARRAY['sponsorship_officer', 'admin']::user_role[])
  );

-- Recreate progress reports policies
CREATE POLICY "staff_manage_progress_reports"
  ON public.progress_reports FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.sponsorships s
      JOIN public.donors d ON d.id = s.donor_id
      WHERE s.id = progress_reports.sponsorship_id
      AND d.user_id = auth.uid()
    ) OR
    public.has_any_role(ARRAY['sponsorship_officer', 'admin']::user_role[])
  );
