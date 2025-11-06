-- Confirm all test users so they can login without email verification
UPDATE auth.users 
SET email_confirmed_at = NOW(),
    confirmed_at = NOW()
WHERE email IN (
  'donor@starehe.ac.ke',
  'finance@starehe.ac.ke',
  'sponsorship@starehe.ac.ke',
  'resource@starehe.ac.ke',
  'admin@starehe.ac.ke'
);
