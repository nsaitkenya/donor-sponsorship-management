-- Insert profiles for the 5 test users that were created in Supabase Auth
-- These profiles were not auto-created by the trigger, so we need to create them manually

INSERT INTO public.profiles (id, email, full_name, role)
VALUES
  ('fc5a24c3-7a02-49b9-a0c0-9d79ae135283', 'donor@starehe.ac.ke', 'Test Donor', 'donor'),
  ('cca880dd-91dc-4cd0-922d-f345fc914599', 'finance@starehe.ac.ke', 'Test Finance Officer', 'finance_officer')
ON CONFLICT (email) DO NOTHING;

-- Query to get the UUIDs of the remaining 3 users (sponsorship, resource, admin)
-- Run this in the SQL Editor to get their IDs, then manually add them to the INSERT above
SELECT id, email FROM auth.users WHERE email IN ('sponsorship@starehe.ac.ke', 'resource@starehe.ac.ke', 'admin@starehe.ac.ke');
