# 🗄️ Database Setup Guide - Supabase

## Complete Schema Installation

All database scripts have been combined into a **single comprehensive file** for easy execution in Supabase.

---

## 📋 Quick Setup (Recommended)

### Step 1: Run the Complete Schema

1. Open your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy the entire contents of: `scripts/000_complete_schema.sql`
5. Paste into the SQL Editor
6. Click **"Run"**

**That's it!** The script will create:
- ✅ All enum types
- ✅ All tables with proper relationships
- ✅ All triggers and functions
- ✅ All RLS policies
- ✅ Sample campaign data (including "Living the Charge")
- ✅ Default system settings

---

## 📊 What Gets Created

### 1. **Enum Types**
- `user_role` - donor, finance_officer, sponsorship_officer, resource_mobilization, admin
- `donor_type` - individual, corporate, foundation, government, other
- `payment_method` - mpesa, card, paypal, bank_transfer, check, cash
- `payment_status` - pending, processing, completed, failed, refunded
- `donation_type` - one_time, recurring, sponsorship, campaign
- `campaign_status` - draft, active, paused, completed, cancelled
- `student_status` - active, graduated, withdrawn, suspended
- `matching_status` - pending, matched, active, completed, cancelled

### 2. **Core Tables**
- `profiles` - User accounts extending auth.users
- `donors` - Donor information and statistics
- `students` - Student profiles and academic data
- `campaigns` - Fundraising campaigns
- `donations` - Transaction records
- `sponsorships` - Student-donor matching
- `progress_reports` - Student progress tracking
- `system_settings` - Application configuration
- `audit_logs` - System activity logs

### 3. **Automatic Features**
- **Auto-timestamps**: All tables have `created_at` and `updated_at`
- **Auto-profile creation**: New auth users automatically get a profile
- **Auto-statistics**: Donor stats update when donations complete
- **Auto-campaign tracking**: Campaign amounts update with donations

### 4. **Security (RLS Policies)**
- **Donors**: Can only see their own data
- **Finance Officers**: Can view all donations and donors
- **Sponsorship Officers**: Can manage students and sponsorships
- **Resource Mobilization**: Can manage campaigns and view donors
- **Admins**: Full access to all data

### 5. **Sample Data**
- 4 active campaigns including "Living the Charge - Paris Marathon 2027"
- Default system settings for the application

---

## 🔍 Schema Verification

After running the script, verify the setup:

```sql
-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check enum types
SELECT typname 
FROM pg_type 
WHERE typtype = 'e' 
ORDER BY typname;

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Check campaigns were created
SELECT title, status, goal_amount, current_amount 
FROM campaigns 
ORDER BY created_at DESC;
```

---

## 👥 Creating Test Users

After the database is set up, create test users:

### Option A: Using the Web Interface (Easiest)
1. Navigate to: `http://localhost:3000/setup-users`
2. Click **"Create All Users"**
3. Wait for confirmation

### Option B: Using Supabase Auth Dashboard
1. Go to **Authentication** → **Users** in Supabase Dashboard
2. Click **"Add User"**
3. Create users with these credentials:

| Email | Password | Role |
|-------|----------|------|
| donor@starehe.ac.ke | Donor@123 | donor |
| finance@starehe.ac.ke | Finance@123 | finance_officer |
| sponsorship@starehe.ac.ke | Sponsor@123 | sponsorship_officer |
| resource@starehe.ac.ke | Resource@123 | resource_mobilization |
| admin@starehe.ac.ke | Admin@123 | admin |

4. After creating each user, update their profile role:

```sql
-- Update user roles (run for each user)
UPDATE profiles 
SET role = 'admin', full_name = 'System Administrator' 
WHERE email = 'admin@starehe.ac.ke';

UPDATE profiles 
SET role = 'finance_officer', full_name = 'Finance Officer' 
WHERE email = 'finance@starehe.ac.ke';

UPDATE profiles 
SET role = 'sponsorship_officer', full_name = 'Sponsorship Officer' 
WHERE email = 'sponsorship@starehe.ac.ke';

UPDATE profiles 
SET role = 'resource_mobilization', full_name = 'Resource Mobilization' 
WHERE email = 'resource@starehe.ac.ke';
```

---

## 🧪 Testing the Setup

### 1. Test Authentication
```sql
-- Check if profiles were created
SELECT id, email, role, full_name 
FROM profiles 
ORDER BY created_at DESC;
```

### 2. Test RLS Policies
Login to the app and verify:
- ✅ Donors can only see their own donations
- ✅ Finance officers can see all donations
- ✅ Admins can access user management
- ✅ Each role redirects to correct portal

### 3. Test Campaigns
Visit the main page and verify:
- ✅ Announcement carousel displays campaigns
- ✅ "Living the Charge" campaign is featured
- ✅ Campaign details are accurate

---

## 🔧 Troubleshooting

### Issue: "Type already exists" errors
**Solution**: The script handles this automatically with `DO $$ BEGIN ... EXCEPTION` blocks. Safe to ignore.

### Issue: "Policy already exists" errors
**Solution**: The script drops all existing policies before creating new ones. This is intentional.

### Issue: Users can't login
**Check**:
1. User exists in `auth.users` table
2. Profile exists in `profiles` table with correct role
3. Email is confirmed (set `email_confirmed_at` in auth.users)

```sql
-- Confirm user email
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email = 'donor@starehe.ac.ke';
```

### Issue: RLS blocks access
**Check**:
```sql
-- Verify user role
SELECT email, role FROM profiles WHERE email = 'your@email.com';

-- Check if RLS helper functions exist
SELECT proname FROM pg_proc WHERE proname IN ('has_role', 'has_any_role', 'get_user_role');
```

---

## 📁 File Structure

```
scripts/
├── 000_complete_schema.sql          ← USE THIS FILE (All-in-one)
├── 001_create_core_tables.sql       (Legacy - individual scripts)
├── 002_create_triggers.sql
├── 003_finance_portal_policies.sql
├── 004_sponsorship_portal_policies.sql
├── 005_resource_mobilization_policies.sql
├── 006_admin_portal_policies.sql
├── 007_fix_rls_policies.sql
└── 017_seed_living_the_charge_campaign.sql
```

**Note**: You only need to run `000_complete_schema.sql`. The individual scripts are kept for reference.

---

## 🎯 Next Steps After Setup

1. **Create test users** via `/setup-users` or Supabase Dashboard
2. **Login** at `/auth/login` with test credentials
3. **Test each portal**:
   - Donor: Make donations, view history
   - Finance: Verify transactions, generate reports
   - Sponsorship: Manage students, create matches
   - Resource Mobilization: Create campaigns
   - Admin: Manage users and roles
4. **View main page** to see announcement carousel with campaigns

---

## 🔐 Security Notes

- **RLS is enabled** on all tables
- **Helper functions** use `SECURITY DEFINER` to bypass RLS for role checks
- **Policies are optimized** to prevent infinite recursion
- **Triggers** automatically maintain data integrity
- **Audit logs** track admin actions

---

## 📞 Support

If you encounter issues:
1. Check Supabase logs in Dashboard → Logs
2. Verify RLS policies in Dashboard → Table Editor → Policies
3. Test queries in SQL Editor with different user contexts
4. Review `DEMO-GUIDE.md` for detailed usage instructions

---

## ✅ Success Checklist

- [ ] Ran `000_complete_schema.sql` in Supabase SQL Editor
- [ ] Verified all tables were created
- [ ] Checked that campaigns exist
- [ ] Created test users (5 accounts)
- [ ] Confirmed user profiles have correct roles
- [ ] Tested login with at least one account
- [ ] Verified portal redirection works
- [ ] Saw announcement carousel on main page

**Once all checked, your database is ready for demo!** 🎉
