-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply updated_at triggers to all tables
create trigger update_profiles_updated_at before update on public.profiles
  for each row execute function update_updated_at_column();

create trigger update_donors_updated_at before update on public.donors
  for each row execute function update_updated_at_column();

create trigger update_students_updated_at before update on public.students
  for each row execute function update_updated_at_column();

create trigger update_campaigns_updated_at before update on public.campaigns
  for each row execute function update_updated_at_column();

create trigger update_donations_updated_at before update on public.donations
  for each row execute function update_updated_at_column();

create trigger update_sponsorships_updated_at before update on public.sponsorships
  for each row execute function update_updated_at_column();

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce((new.raw_user_meta_data ->> 'role')::user_role, 'donor')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Update donor statistics on donation
create or replace function update_donor_stats()
returns trigger as $$
begin
  if new.payment_status = 'completed' then
    update public.donors
    set 
      total_donated = total_donated + new.amount,
      donation_count = donation_count + 1,
      last_donation_date = new.created_at,
      first_donation_date = coalesce(first_donation_date, new.created_at)
    where id = new.donor_id;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger update_donor_stats_trigger
  after insert or update on public.donations
  for each row
  execute function update_donor_stats();

-- Update campaign current amount on donation
create or replace function update_campaign_amount()
returns trigger as $$
begin
  if new.payment_status = 'completed' and new.campaign_id is not null then
    update public.campaigns
    set current_amount = current_amount + new.amount
    where id = new.campaign_id;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger update_campaign_amount_trigger
  after insert or update on public.donations
  for each row
  execute function update_campaign_amount();
