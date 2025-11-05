-- Add RLS policies for resource mobilization officers

-- Resource mobilization officers can view all campaigns
create policy "rm_officers_view_all_campaigns"
  on public.campaigns for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('resource_mobilization', 'admin')
    )
  );

-- Resource mobilization officers can insert campaigns
create policy "rm_officers_insert_campaigns"
  on public.campaigns for insert
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('resource_mobilization', 'admin')
    )
  );

-- Resource mobilization officers can update campaigns
create policy "rm_officers_update_campaigns"
  on public.campaigns for update
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('resource_mobilization', 'admin')
    )
  );

-- Resource mobilization officers can delete campaigns
create policy "rm_officers_delete_campaigns"
  on public.campaigns for delete
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('resource_mobilization', 'admin')
    )
  );

-- Resource mobilization officers can view all donors
create policy "rm_officers_view_all_donors"
  on public.donors for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('resource_mobilization', 'admin')
    )
  );
