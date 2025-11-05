-- Add RLS policies for sponsorship officers

-- Sponsorship officers can view all students
create policy "sponsorship_officers_view_all_students"
  on public.students for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('sponsorship_officer', 'admin')
    )
  );

-- Sponsorship officers can insert students
create policy "sponsorship_officers_insert_students"
  on public.students for insert
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('sponsorship_officer', 'admin')
    )
  );

-- Sponsorship officers can update students
create policy "sponsorship_officers_update_students"
  on public.students for update
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('sponsorship_officer', 'admin')
    )
  );

-- Sponsorship officers can view all sponsorships
create policy "sponsorship_officers_view_all_sponsorships"
  on public.sponsorships for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('sponsorship_officer', 'admin')
    )
  );

-- Sponsorship officers can insert sponsorships
create policy "sponsorship_officers_insert_sponsorships"
  on public.sponsorships for insert
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('sponsorship_officer', 'admin')
    )
  );

-- Sponsorship officers can update sponsorships
create policy "sponsorship_officers_update_sponsorships"
  on public.sponsorships for update
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('sponsorship_officer', 'admin')
    )
  );

-- Sponsorship officers can view all progress reports
create policy "sponsorship_officers_view_all_progress_reports"
  on public.progress_reports for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('sponsorship_officer', 'admin')
    )
  );

-- Sponsorship officers can insert progress reports
create policy "sponsorship_officers_insert_progress_reports"
  on public.progress_reports for insert
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('sponsorship_officer', 'admin')
    )
  );

-- Sponsorship officers can update progress reports
create policy "sponsorship_officers_update_progress_reports"
  on public.progress_reports for update
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('sponsorship_officer', 'admin')
    )
  );
