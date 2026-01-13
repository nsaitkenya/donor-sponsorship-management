-- Seed the "Living the Charge" campaign
-- This script creates the featured campaign for the Paris Marathon fundraiser

INSERT INTO public.campaigns (
  title,
  description,
  goal_amount,
  current_amount,
  start_date,
  end_date,
  status,
  category,
  image_url
) VALUES (
  'Living the Charge - Paris Marathon 2027',
  'An initiative to expand access to volunteering opportunities for academically promising yet underserved high school students across Kenya. We are raising $100,000 to seed a permanent endowment whose investment returns will sustainably finance structured volunteer placements through the Voluntary Service Scheme (VSS), giving students access and exposure to professional opportunities.',
  100000.00,
  12500.00,
  '2025-01-01',
  '2027-04-30',
  'active',
  'Endowment Fund',
  'https://stareheboyscentre.org/wp-content/uploads/2025/02/IMG_8171-2048x1365.jpg'
)
ON CONFLICT DO NOTHING;

-- Add additional sample campaigns for the carousel
INSERT INTO public.campaigns (
  title,
  description,
  goal_amount,
  current_amount,
  start_date,
  end_date,
  status,
  category
) VALUES 
(
  'School Infrastructure Development 2025',
  'Upgrading classroom facilities, laboratories, and learning spaces to provide world-class education infrastructure for our students.',
  50000.00,
  32000.00,
  '2025-01-01',
  '2025-12-31',
  'active',
  'Infrastructure'
),
(
  'Student Scholarship Fund',
  'Providing full scholarships to talented students from disadvantaged backgrounds, covering tuition, accommodation, and learning materials.',
  75000.00,
  58000.00,
  '2025-01-01',
  '2025-12-31',
  'active',
  'Scholarships'
),
(
  'Technology & Innovation Lab',
  'Establishing a state-of-the-art technology lab with computers, software, and equipment to prepare students for the digital economy.',
  35000.00,
  18500.00,
  '2025-02-01',
  '2025-11-30',
  'active',
  'Technology'
)
ON CONFLICT DO NOTHING;

-- Update the campaigns table to add brief_details column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'campaigns' 
    AND column_name = 'brief_details'
  ) THEN
    ALTER TABLE public.campaigns ADD COLUMN brief_details text;
  END IF;
END $$;

-- Update Living the Charge campaign with brief details
UPDATE public.campaigns 
SET brief_details = 'Raising $100,000 to fund the Voluntary Service Scheme (VSS) - providing 250-350 students per year with professional volunteer placements. Three alumni will run the Paris Marathon 2027 to rally support for this transformative endowment.'
WHERE title = 'Living the Charge - Paris Marathon 2027';

-- Update other campaigns with brief details
UPDATE public.campaigns 
SET brief_details = 'Transforming learning spaces with modern classrooms, science labs, and facilities to deliver world-class education.'
WHERE title = 'School Infrastructure Development 2025';

UPDATE public.campaigns 
SET brief_details = 'Full scholarships covering tuition, accommodation, and materials for talented students from disadvantaged backgrounds.'
WHERE title = 'Student Scholarship Fund';

UPDATE public.campaigns 
SET brief_details = 'Building a cutting-edge technology lab to equip students with digital skills for the modern economy.'
WHERE title = 'Technology & Innovation Lab';
