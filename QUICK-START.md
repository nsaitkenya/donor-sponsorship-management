# 🚀 Quick Start Guide

## Database Setup & Demo Users

### 1. **Database Schema** (Supabase PostgreSQL)

The system uses these core tables:
- `profiles` - User accounts with roles
- `donors` - Donor information
- `students` - Student profiles
- `campaigns` - Fundraising campaigns
- `donations` - Transaction records
- `sponsorships` - Student-donor matching
- `progress_reports` - Progress tracking

### 2. **User Roles & Portals**

| Role | Portal URL | Login Email | Password |
|------|-----------|-------------|----------|
| **Donor** | `/portal/donor` | donor@starehe.ac.ke | `Donor@123` |
| **Finance Officer** | `/portal/finance` | finance@starehe.ac.ke | `Finance@123` |
| **Sponsorship Officer** | `/portal/sponsorship` | sponsorship@starehe.ac.ke | `Sponsor@123` |
| **Resource Mobilization** | `/portal/resource-mobilization` | resource@starehe.ac.ke | `Resource@123` |
| **Admin** | `/portal/admin` | admin@starehe.ac.ke | `Admin@123` |

### 3. **Creating Demo Users**

**Option A: Using the Setup Page (Recommended)**
1. Navigate to: `http://localhost:3000/setup-users`
2. Click **"Create All Users"**
3. Wait for all 5 accounts to be created
4. Go to `/auth/login` and test each account

**Option B: Manual Database Setup**
Run these SQL scripts in Supabase SQL Editor:
```sql
scripts/001_create_core_tables.sql
scripts/002_create_triggers.sql
scripts/003_finance_portal_policies.sql
scripts/004_sponsorship_portal_policies.sql
scripts/005_resource_mobilization_policies.sql
scripts/006_admin_portal_policies.sql
scripts/007_fix_rls_policies.sql
scripts/017_seed_living_the_charge_campaign.sql
```

### 4. **Login Flow**

1. Visit `/auth/login`
2. Enter credentials for any role
3. System automatically redirects to appropriate portal
4. Each portal shows role-specific features

### 5. **Main Page Features**

The landing page (`/`) now includes:

✅ **Announcement Carousel** (⭐ Most Accurate)
- Displays active campaigns at the top
- Auto-slides every 6 seconds
- Shows campaign title, brief details, goal, and progress
- Featured: "Living the Charge - Paris Marathon 2027"

✅ **Hero Section** with CTAs
✅ **Image Carousel** of students
✅ **Stats Section** (impact metrics)
✅ **How It Works** section
✅ **Impact Areas** breakdown
✅ **Call-to-Action** section

### 6. **Living the Charge Campaign**

The announcement carousel prominently features:

**Campaign Details:**
- **Title**: Living the Charge - Paris Marathon 2027
- **Goal**: $100,000 seed capital
- **Purpose**: Fund Voluntary Service Scheme (VSS) placements
- **Impact**: 250-350 students per year
- **Brief**: "Raising $100,000 to fund the Voluntary Service Scheme (VSS) - providing 250-350 students per year with professional volunteer placements. Three alumni will run the Paris Marathon 2027 to rally support for this transformative endowment."

**Full Description:**
An initiative to expand access to volunteering opportunities for academically promising yet underserved high school students across Kenya. The endowment's investment returns will sustainably finance structured volunteer placements, giving students access and exposure to professional opportunities.

### 7. **Testing Different Portals**

**Donor Portal** - Make donations, sponsor students, track progress
```
Email: donor@starehe.ac.ke
Password: Donor@123
```

**Finance Portal** - Verify transactions, generate reports
```
Email: finance@starehe.ac.ke
Password: Finance@123
```

**Sponsorship Portal** - Manage students, create matches
```
Email: sponsorship@starehe.ac.ke
Password: Sponsor@123
```

**Resource Mobilization** - Create campaigns, track donors
```
Email: resource@starehe.ac.ke
Password: Resource@123
```

**Admin Portal** - Manage users, assign roles
```
Email: admin@starehe.ac.ke
Password: Admin@123
```

### 8. **Key Files Created**

- `DEMO-GUIDE.md` - Comprehensive demo documentation
- `components/announcement-carousel.tsx` - Campaign announcement carousel
- `scripts/017_seed_living_the_charge_campaign.sql` - Campaign seed data
- `app/page.tsx` - Updated with announcement carousel

### 9. **How the Announcement Carousel Works**

1. **Server-side data fetching**: Main page fetches active campaigns from Supabase
2. **Auto-sliding**: Cycles through campaigns every 6 seconds
3. **Manual controls**: Previous/Next buttons and dot indicators
4. **Responsive design**: Adapts to mobile and desktop
5. **Campaign info**: Shows title, brief details, goal, current amount, and progress

### 10. **Next Steps**

1. Run the database seed script to add campaigns
2. Visit the main page to see the announcement carousel
3. Create test users via `/setup-users`
4. Login to different portals to explore features
5. Add more campaigns via Resource Mobilization or Admin portal

---

## 🎯 Quick Demo Scenario

1. **Setup**: Visit `/setup-users` → Create all users
2. **View Campaigns**: Visit `/` → See "Living the Charge" in announcement carousel
3. **Login as Donor**: `/auth/login` → donor@starehe.ac.ke
4. **Explore**: Browse campaigns, make donations, sponsor students
5. **Switch Roles**: Logout → Login as different role → See different portal

---

For detailed information, see `DEMO-GUIDE.md`
