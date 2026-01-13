# 🎯 Demo Guide - Donor & Sponsorship Management System

## 📊 Database Overview

The system uses **Supabase (PostgreSQL)** with the following core tables:

### Core Tables
- **profiles** - User accounts with role-based access
- **donors** - Donor information and preferences
- **students** - Student profiles and academic data
- **campaigns** - Fundraising campaigns
- **donations** - Transaction records
- **sponsorships** - Student-donor matching
- **progress_reports** - Student progress tracking

### User Roles
1. **donor** - Can donate, view sponsored students, track progress
2. **finance_officer** - Verify transactions, generate reports, reconcile payments
3. **sponsorship_officer** - Manage students, create matches, generate reports
4. **resource_mobilization** - Create campaigns, track donors, analyze performance
5. **admin** - Full system access, user management, system configuration

## 🚀 Quick Start for Demo

### Step 1: Create Demo Users

Visit: **`http://localhost:3000/setup-users`**

This page will create 5 test accounts:
- donor@starehe.ac.ke (Password: `Donor@123`)
- finance@starehe.ac.ke (Password: `Finance@123`)
- sponsorship@starehe.ac.ke (Password: `Sponsor@123`)
- resource@starehe.ac.ke (Password: `Resource@123`)
- admin@starehe.ac.ke (Password: `Admin@123`)

Click **"Create All Users"** and wait for all accounts to be created successfully.

### Step 2: Login to Different Portals

Visit: **`http://localhost:3000/auth/login`**

#### Portal Access by Role:

**🎁 Donor Portal** (`/portal/donor`)
- Login: donor@starehe.ac.ke
- Features: Make donations, view history, sponsor students, track progress

**💰 Finance Portal** (`/portal/finance`)
- Login: finance@starehe.ac.ke
- Features: Transaction verification, financial reports, revenue monitoring

**🎓 Sponsorship Portal** (`/portal/sponsorship`)
- Login: sponsorship@starehe.ac.ke
- Features: Student management, sponsorship matching, progress reports

**📢 Resource Mobilization Portal** (`/portal/resource-mobilization`)
- Login: resource@starehe.ac.ke
- Features: Campaign creation, donor relationships, performance analytics

**⚙️ Admin Portal** (`/portal/admin`)
- Login: admin@starehe.ac.ke
- Features: User management, role assignment, system configuration

### Step 3: Explore Features

After logging in, each portal provides role-specific functionality. The system automatically redirects users to their appropriate portal based on their role.

## 🔐 Authentication Flow

1. Users sign up at `/auth/sign-up` (defaults to donor role)
2. Login at `/auth/login`
3. System fetches user profile and role from database
4. Redirects to appropriate portal based on role
5. Row-Level Security (RLS) policies enforce data access

## 📝 Creating Test Data

### Add a Campaign (as Resource Mobilization or Admin)

1. Login as resource@starehe.ac.ke or admin@starehe.ac.ke
2. Navigate to Campaigns section
3. Create a new campaign with:
   - Title: "Living the Charge"
   - Description: Brief details about the initiative
   - Goal Amount: $100,000 (or KES equivalent)
   - Status: Active

### Add Students (as Sponsorship Officer or Admin)

1. Login as sponsorship@starehe.ac.ke or admin@starehe.ac.ke
2. Navigate to Students section
3. Add student profiles for sponsorship matching

### Process Donations (as Donor)

1. Login as donor@starehe.ac.ke
2. Navigate to Make Donation
3. Select payment method (M-Pesa, Card, etc.)
4. Choose donation type (one-time, recurring, campaign)

## 🎨 Main Page Features

The main landing page (`/`) includes:
- **Hero Section** with call-to-action buttons
- **Image Carousel** showcasing Starehe students
- **Stats Section** displaying impact metrics
- **Campaign Announcements** (sliding carousel)
- **How It Works** section
- **Impact Areas** breakdown
- **Call-to-Action** section

## 🔄 Announcement Carousel

The announcement carousel on the main page displays active campaigns with:
- Campaign title and brief description
- Visual indicators
- Auto-sliding functionality
- Manual navigation controls
- Featured campaign: **Living the Charge**

## 🛠️ Database Setup (If Starting Fresh)

Run these SQL scripts in Supabase SQL Editor in order:

```bash
scripts/001_create_core_tables.sql      # Core tables and enums
scripts/002_create_triggers.sql         # Auto-update triggers
scripts/003_finance_portal_policies.sql # Finance RLS policies
scripts/004_sponsorship_portal_policies.sql # Sponsorship RLS policies
scripts/005_resource_mobilization_policies.sql # Resource mob RLS
scripts/006_admin_portal_policies.sql   # Admin RLS policies
scripts/007_fix_rls_policies.sql        # Policy fixes
```

## 📱 Testing Different Portals

### Donor Portal Testing
1. Login as donor
2. View dashboard with donation summary
3. Make a test donation
4. View donation history
5. Browse available students for sponsorship

### Finance Portal Testing
1. Login as finance officer
2. View pending transactions
3. Verify and reconcile payments
4. Generate financial reports
5. Monitor revenue streams

### Sponsorship Portal Testing
1. Login as sponsorship officer
2. View student profiles
3. Create sponsorship matches
4. Generate progress reports
5. Track student performance

### Resource Mobilization Testing
1. Login as resource mobilization
2. Create new campaigns
3. Track donor engagement
4. Analyze campaign performance
5. Manage outreach activities

### Admin Portal Testing
1. Login as admin
2. View all users
3. Change user roles
4. Monitor system activity
5. Access all portal features

## 🎯 Key Demo Scenarios

### Scenario 1: New Donor Journey
1. Sign up as new donor
2. Complete profile
3. Browse active campaigns
4. Make first donation
5. Receive confirmation

### Scenario 2: Student Sponsorship
1. Login as donor
2. Browse student profiles
3. Select student to sponsor
4. Set up recurring sponsorship
5. Receive progress updates

### Scenario 3: Campaign Management
1. Login as resource mobilization
2. Create "Living the Charge" campaign
3. Set goal and timeline
4. Track donations
5. Analyze performance

### Scenario 4: Financial Reconciliation
1. Login as finance officer
2. View pending transactions
3. Verify payment details
4. Mark as reconciled
5. Generate monthly report

## 🔧 Troubleshooting

### Users Not Created
- Check Supabase Auth settings
- Ensure email confirmation is disabled for testing
- Verify RLS policies are set correctly

### Login Fails
- Confirm user exists in auth.users table
- Check profile exists in profiles table
- Verify password matches

### Portal Access Denied
- Confirm user role in profiles table
- Check RLS policies for the role
- Verify authentication token is valid

## 📚 Additional Resources

- **Supabase Dashboard**: Manage database, auth, and storage
- **SQL Scripts**: Located in `/scripts` directory
- **Components**: UI components in `/components` directory
- **API Actions**: Server actions in `/lib/actions` directory

## 🌟 Living the Charge Campaign

The "Living the Charge" initiative is featured prominently:
- **Goal**: $100,000 seed capital for endowment
- **Purpose**: Fund Voluntary Service Scheme (VSS) placements
- **Impact**: 250-350 students per year
- **Event**: Paris Marathon fundraiser (April 2027)
- **Vision**: Scalable model for opportunity creation across Africa

This campaign demonstrates the platform's ability to showcase major fundraising initiatives with detailed information and progress tracking.
