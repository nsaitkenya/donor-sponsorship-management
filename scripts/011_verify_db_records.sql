-- Verification Script for Test Users
-- Run this to check if users have been created properly

-- Check if profiles exist
SELECT 'Profiles' as record_type, COUNT(*) as count 
FROM public.profiles 
WHERE email LIKE '%@starehe.ac.ke';

-- List all test user profiles
SELECT email, full_name, role, created_at, updated_at
FROM public.profiles 
WHERE email LIKE '%@starehe.ac.ke'
ORDER BY email;

-- Check donors table
SELECT 'Donors' as record_type, COUNT(*) as count 
FROM public.donors;

-- List donor records
SELECT d.id, p.email, d.donor_type, d.created_at
FROM public.donors d
JOIN public.profiles p ON d.user_id = p.id
ORDER BY p.email;

-- Summary: This should show 5 profiles for the test users
-- If profiles are empty, users haven't been created in Auth yet
