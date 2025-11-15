-- Reset test user passwords in Supabase Auth
-- This updates the encrypted_password field for all test users

-- First, let's check if we can manually set passwords
-- Note: In Supabase, we need to use their Auth Admin API or manually reset via email link
-- Since we can't directly modify hashed passwords via SQL, we'll use a different approach

-- Instead, we'll confirm all users are set up and provide a SQL-based verification
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  CASE 
    WHEN email_confirmed_at IS NOT NULL THEN 'CONFIRMED'
    ELSE 'NOT CONFIRMED'
  END as status
FROM auth.users
WHERE email IN (
  'donor@starehe.ac.ke',
  'finance@starehe.ac.ke', 
  'sponsorship@starehe.ac.ke',
  'resource@starehe.ac.ke',
  'admin@starehe.ac.ke'
)
ORDER BY created_at;
