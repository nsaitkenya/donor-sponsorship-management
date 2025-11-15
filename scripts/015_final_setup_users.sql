-- First, check and insert test users into auth.users if they don't exist
-- This script assumes users were already created via the signup flow

-- Fetch all created users and verify profiles exist
SELECT 
  au.id,
  au.email,
  au.email_confirmed_at,
  p.role,
  p.full_name
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE au.email IN (
  'donor@starehe.ac.ke',
  'finance@starehe.ac.ke',
  'sponsorship@starehe.ac.ke',
  'resource@starehe.ac.ke',
  'admin@starehe.ac.ke'
)
ORDER BY au.email;

-- Confirm all test users (in case they're not confirmed)
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email IN (
  'donor@starehe.ac.ke',
  'finance@starehe.ac.ke',
  'sponsorship@starehe.ac.ke',
  'resource@starehe.ac.ke',
  'admin@starehe.ac.ke'
) AND email_confirmed_at IS NULL;

-- Ensure profiles exist for all confirmed users
-- Cast role values to lowercase to match enum definition
INSERT INTO public.profiles (id, email, role, full_name, created_at, updated_at)
SELECT 
  au.id,
  au.email,
  CASE 
    WHEN au.email = 'donor@starehe.ac.ke' THEN 'donor'::user_role
    WHEN au.email = 'finance@starehe.ac.ke' THEN 'finance_officer'::user_role
    WHEN au.email = 'sponsorship@starehe.ac.ke' THEN 'sponsorship_officer'::user_role
    WHEN au.email = 'resource@starehe.ac.ke' THEN 'resource_mobilization'::user_role
    WHEN au.email = 'admin@starehe.ac.ke' THEN 'admin'::user_role
    ELSE 'donor'::user_role
  END,
  SPLIT_PART(au.email, '@', 1),
  NOW(),
  NOW()
FROM auth.users au
WHERE au.email IN (
  'donor@starehe.ac.ke',
  'finance@starehe.ac.ke',
  'sponsorship@starehe.ac.ke',
  'resource@starehe.ac.ke',
  'admin@starehe.ac.ke'
) AND NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = au.id
)
ON CONFLICT (id) DO NOTHING;

-- Verify final state
SELECT 
  au.id,
  au.email,
  au.email_confirmed_at IS NOT NULL as is_confirmed,
  p.role,
  p.full_name
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE au.email IN (
  'donor@starehe.ac.ke',
  'finance@starehe.ac.ke',
  'sponsorship@starehe.ac.ke',
  'resource@starehe.ac.ke',
  'admin@starehe.ac.ke'
)
ORDER BY au.email;
