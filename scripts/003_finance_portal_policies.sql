-- Add RLS policies for finance officers to view all donations and donors

-- Finance officers can view all donations
create policy "finance_officers_view_all_donations"
  on public.donations for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'finance_officer'
    )
  );

-- Finance officers can update donation status
create policy "finance_officers_update_donations"
  on public.donations for update
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'finance_officer'
    )
  );

-- Finance officers can view all donors
create policy "finance_officers_view_all_donors"
  on public.donors for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'finance_officer'
    )
  );

-- Finance officers can view all profiles
create policy "finance_officers_view_all_profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
      and p.role in ('finance_officer', 'admin')
    )
  );
