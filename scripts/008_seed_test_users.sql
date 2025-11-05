-- Seed test users for different roles
-- Note: These users need to be created in Supabase Auth first
-- This script just creates the profile and related data

-- Instructions:
-- 1. Create these users in Supabase Auth Dashboard or via signup
-- 2. Get their UUIDs
-- 3. Update this script with the actual UUIDs
-- 4. Run this script

-- For demo purposes, we'll create placeholder profiles
-- Replace these UUIDs with actual user IDs after creating them in Auth

-- Example test users (you'll need to create these in Supabase Auth first):
-- donor@test.com / password123 (Donor)
-- finance@test.com / password123 (Finance Officer)
-- sponsorship@test.com / password123 (Sponsorship Officer)
-- resource@test.com / password123 (Resource Mobilization)
-- admin@test.com / password123 (Admin)

-- This is a template - actual user creation happens through the signup flow
-- After signup, you can update roles using the admin portal

-- Create sample students for testing
INSERT INTO public.students (student_id, first_name, last_name, date_of_birth, gender, grade_level, admission_date, status, background_story, interests)
VALUES
  ('STU001', 'John', 'Kamau', '2008-03-15', 'Male', 'Form 2', '2022-01-10', 'active', 'John comes from a humble background in Nairobi. He excels in mathematics and dreams of becoming an engineer.', ARRAY['Mathematics', 'Science', 'Football']),
  ('STU002', 'Peter', 'Ochieng', '2007-07-22', 'Male', 'Form 3', '2021-01-10', 'active', 'Peter is passionate about technology and coding. He has shown exceptional talent in computer science.', ARRAY['Programming', 'Chess', 'Reading']),
  ('STU003', 'David', 'Mwangi', '2009-11-08', 'Male', 'Form 1', '2023-01-10', 'active', 'David is a talented musician and athlete. He balances academics with his passion for music.', ARRAY['Music', 'Athletics', 'History']),
  ('STU004', 'James', 'Kipchoge', '2008-05-30', 'Male', 'Form 2', '2022-01-10', 'active', 'James is dedicated to his studies and community service. He volunteers at local community centers.', ARRAY['Biology', 'Community Service', 'Basketball']),
  ('STU005', 'Michael', 'Otieno', '2007-09-12', 'Male', 'Form 3', '2021-01-10', 'active', 'Michael aspires to be a doctor. He excels in sciences and participates in the school debate club.', ARRAY['Chemistry', 'Debate', 'Swimming'])
ON CONFLICT (student_id) DO NOTHING;

-- Create sample campaigns
INSERT INTO public.campaigns (title, description, goal_amount, current_amount, start_date, end_date, status, category)
VALUES
  ('Science Lab Equipment 2024', 'Help us upgrade our science laboratory with modern equipment to enhance practical learning for our students.', 500000, 125000, NOW(), NOW() + INTERVAL '3 months', 'active', 'Infrastructure'),
  ('Library Expansion Project', 'Expand our library collection with new books and digital resources to support student learning.', 300000, 75000, NOW(), NOW() + INTERVAL '2 months', 'active', 'Education'),
  ('Sports Facility Upgrade', 'Renovate and upgrade our sports facilities to provide better training grounds for our athletes.', 750000, 200000, NOW(), NOW() + INTERVAL '6 months', 'active', 'Sports'),
  ('Student Scholarship Fund', 'Provide scholarships for deserving students who need financial assistance to continue their education.', 1000000, 450000, NOW(), NOW() + INTERVAL '12 months', 'active', 'Scholarships')
ON CONFLICT DO NOTHING;

-- Note: To create actual test users with different roles:
-- 1. Sign up through the app (creates donor by default)
-- 2. Use the admin portal to change user roles
-- OR manually update the profiles table:
-- UPDATE profiles SET role = 'admin' WHERE email = 'admin@test.com';
