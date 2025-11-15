-- Use only email_confirmed_at which is the correct column to update
-- confirmed_at is a protected system column in Supabase and cannot be manually updated
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email IN (
  'donor@starehe.ac.ke',
  'finance@starehe.ac.ke',
  'sponsorship@starehe.ac.ke',
  'resource@starehe.ac.ke',
  'admin@starehe.ac.ke'
);
