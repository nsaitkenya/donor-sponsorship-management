-- Insert profiles for test users that exist in auth.users but don't have profiles yet
-- This directly links the auth users to the profiles table

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

-- Verify profiles were created
SELECT id, email, role FROM public.profiles WHERE email LIKE '%@starehe.ac.ke' ORDER BY email;
