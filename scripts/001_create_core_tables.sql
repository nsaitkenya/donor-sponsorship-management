-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create enum types
create type user_role as enum ('donor', 'finance_officer', 'sponsorship_officer', 'resource_mobilization', 'admin');
create type donor_type as enum ('individual', 'corporate', 'foundation', 'government', 'other');
create type payment_method as enum ('mpesa', 'card', 'paypal', 'bank_transfer', 'check', 'cash');
create type payment_status as enum ('pending', 'processing', 'completed', 'failed', 'refunded');
create type donation_type as enum ('one_time', 'recurring', 'sponsorship', 'campaign');
create type campaign_status as enum ('draft', 'active', 'paused', 'completed', 'cancelled');
create type student_status as enum ('active', 'graduated', 'withdrawn', 'suspended');
create type matching_status as enum ('pending', 'matched', 'active', 'completed', 'cancelled');

-- Profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  phone text,
  role user_role not null default 'donor',
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- Donors table
create table if not exists public.donors (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  donor_type donor_type not null default 'individual',
  organization_name text,
  tax_id text,
  address text,
  city text,
  country text default 'Kenya',
  postal_code text,
  preferred_contact_method text,
  communication_preferences jsonb default '{"email": true, "sms": false, "phone": false}'::jsonb,
  total_donated numeric(12, 2) default 0,
  donation_count integer default 0,
  first_donation_date timestamptz,
  last_donation_date timestamptz,
  is_anonymous boolean default false,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.donors enable row level security;

create policy "donors_select_own"
  on public.donors for select
  using (auth.uid() = user_id);

create policy "donors_insert_own"
  on public.donors for insert
  with check (auth.uid() = user_id);

create policy "donors_update_own"
  on public.donors for update
  using (auth.uid() = user_id);

-- Students table
create table if not exists public.students (
  id uuid primary key default uuid_generate_v4(),
  student_id text unique not null,
  first_name text not null,
  last_name text not null,
  date_of_birth date,
  gender text,
  grade_level text,
  admission_date date,
  status student_status default 'active',
  photo_url text,
  background_story text,
  academic_performance jsonb,
  interests text[],
  needs_assessment jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.students enable row level security;

-- Students can be viewed by authenticated users (donors, staff)
create policy "students_select_authenticated"
  on public.students for select
  using (auth.role() = 'authenticated');

-- Campaigns table
create table if not exists public.campaigns (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  goal_amount numeric(12, 2) not null,
  current_amount numeric(12, 2) default 0,
  start_date timestamptz not null,
  end_date timestamptz,
  status campaign_status default 'draft',
  category text,
  image_url text,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.campaigns enable row level security;

-- Campaigns can be viewed by everyone
create policy "campaigns_select_all"
  on public.campaigns for select
  using (true);

-- Donations table
create table if not exists public.donations (
  id uuid primary key default uuid_generate_v4(),
  donor_id uuid references public.donors(id) on delete set null,
  amount numeric(12, 2) not null,
  currency text default 'KES',
  donation_type donation_type not null,
  payment_method payment_method not null,
  payment_status payment_status default 'pending',
  transaction_reference text unique,
  campaign_id uuid references public.campaigns(id) on delete set null,
  is_anonymous boolean default false,
  message text,
  receipt_url text,
  tax_deductible boolean default true,
  processed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.donations enable row level security;

create policy "donations_select_own"
  on public.donations for select
  using (
    exists (
      select 1 from public.donors
      where donors.id = donations.donor_id
      and donors.user_id = auth.uid()
    )
  );

create policy "donations_insert_own"
  on public.donations for insert
  with check (
    exists (
      select 1 from public.donors
      where donors.id = donations.donor_id
      and donors.user_id = auth.uid()
    )
  );

-- Sponsorships table (student-donor matching)
create table if not exists public.sponsorships (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid references public.students(id) on delete cascade,
  donor_id uuid references public.donors(id) on delete cascade,
  amount numeric(12, 2) not null,
  frequency text not null, -- 'monthly', 'quarterly', 'annually'
  start_date timestamptz not null,
  end_date timestamptz,
  status matching_status default 'pending',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.sponsorships enable row level security;

create policy "sponsorships_select_own"
  on public.sponsorships for select
  using (
    exists (
      select 1 from public.donors
      where donors.id = sponsorships.donor_id
      and donors.user_id = auth.uid()
    )
  );

-- Progress reports table
create table if not exists public.progress_reports (
  id uuid primary key default uuid_generate_v4(),
  sponsorship_id uuid references public.sponsorships(id) on delete cascade,
  report_period text not null,
  academic_progress text,
  attendance_rate numeric(5, 2),
  behavioral_notes text,
  achievements text[],
  challenges text[],
  photos jsonb,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.progress_reports enable row level security;

create policy "progress_reports_select_own"
  on public.progress_reports for select
  using (
    exists (
      select 1 from public.sponsorships s
      join public.donors d on d.id = s.donor_id
      where s.id = progress_reports.sponsorship_id
      and d.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
create index idx_donors_user_id on public.donors(user_id);
create index idx_donations_donor_id on public.donations(donor_id);
create index idx_donations_campaign_id on public.donations(campaign_id);
create index idx_donations_status on public.donations(payment_status);
create index idx_sponsorships_student_id on public.sponsorships(student_id);
create index idx_sponsorships_donor_id on public.sponsorships(donor_id);
create index idx_progress_reports_sponsorship_id on public.progress_reports(sponsorship_id);
