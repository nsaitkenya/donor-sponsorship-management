-- Manual Test User Creation Script
-- ==================================
-- STEP 1: Create users in Supabase Dashboard
-- Go to: Authentication > Users > Add User
-- Create these 5 users (profiles will be auto-created by trigger):

-- 1. donor@starehe.ac.ke (Password: Donor@123)
-- 2. finance@starehe.ac.ke (Password: Finance@123)
-- 3. sponsorship@starehe.ac.ke (Password: Sponsor@123)
-- 4. resource@starehe.ac.ke (Password: Resource@123)
-- 5. admin@starehe.ac.ke (Password: Admin@123)

-- STEP 2: After creating all users above, run this SQL script
-- This will update their roles and create necessary records

-- Update DONOR user role and create donor record
UPDATE profiles 
SET role = 'donor', full_name = 'Test Donor', phone = '+254700000001'
WHERE email = 'donor@starehe.ac.ke';

INSERT INTO donors (user_id, donor_type, organization_name)
SELECT id, 'individual', NULL
FROM profiles WHERE email = 'donor@starehe.ac.ke'
ON CONFLICT (user_id) DO NOTHING;

-- Update FINANCE OFFICER user role
UPDATE profiles 
SET role = 'finance_officer', full_name = 'Test Finance Officer', phone = '+254700000002'
WHERE email = 'finance@starehe.ac.ke';

-- Update SPONSORSHIP OFFICER user role
UPDATE profiles 
SET role = 'sponsorship_officer', full_name = 'Test Sponsorship Officer', phone = '+254700000003'
WHERE email = 'sponsorship@starehe.ac.ke';

-- Update RESOURCE MOBILIZATION user role
UPDATE profiles 
SET role = 'resource_mobilization', full_name = 'Test Resource Officer', phone = '+254700000004'
WHERE email = 'resource@starehe.ac.ke';

-- Update ADMIN user role
UPDATE profiles 
SET role = 'admin', full_name = 'Test Admin', phone = '+254700000005'
WHERE email = 'admin@starehe.ac.ke';

-- Verify all profiles were updated correctly
SELECT email, full_name, role, created_at 
FROM profiles 
WHERE email LIKE '%@starehe.ac.ke'
ORDER BY role;
