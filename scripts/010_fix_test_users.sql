-- Fix Test User Setup
-- Run this in Supabase SQL Editor after creating users through Dashboard

-- Delete existing test profiles and related records
DELETE FROM public.donors WHERE user_id IN (
  SELECT id FROM public.profiles WHERE email LIKE '%@starehe.ac.ke'
);

DELETE FROM public.profiles 
WHERE email LIKE '%@starehe.ac.ke';

-- The profiles will be auto-created when users sign up in the auth system
-- This SQL just updates their roles

-- Update DONOR user role and create donor record
UPDATE public.profiles 
SET role = 'donor', full_name = 'Test Donor', phone = '+254700000001'
WHERE email = 'donor@starehe.ac.ke';

INSERT INTO public.donors (user_id, donor_type)
SELECT id, 'individual'::public.donor_type
FROM public.profiles 
WHERE email = 'donor@starehe.ac.ke'
ON CONFLICT DO NOTHING;

-- Update FINANCE OFFICER user role
UPDATE public.profiles 
SET role = 'finance_officer', full_name = 'Test Finance Officer', phone = '+254700000002'
WHERE email = 'finance@starehe.ac.ke';

-- Update SPONSORSHIP OFFICER user role
UPDATE public.profiles 
SET role = 'sponsorship_officer', full_name = 'Test Sponsorship Officer', phone = '+254700000003'
WHERE email = 'sponsorship@starehe.ac.ke';

-- Update RESOURCE MOBILIZATION user role
UPDATE public.profiles 
SET role = 'resource_mobilization', full_name = 'Test Resource Officer', phone = '+254700000004'
WHERE email = 'resource@starehe.ac.ke';

-- Update ADMIN user role
UPDATE public.profiles 
SET role = 'admin', full_name = 'Test Admin', phone = '+254700000005'
WHERE email = 'admin@starehe.ac.ke';

-- Verify all profiles were updated correctly
SELECT email, full_name, role, created_at 
FROM public.profiles 
WHERE email LIKE '%@starehe.ac.ke'
ORDER BY role;
