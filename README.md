# Donor & Sponsorship Management System

A comprehensive platform for managing donations, sponsorships, and student support at Starehe Boys Centre.

## Features

- **Multi-Portal System**: Separate portals for donors, finance officers, sponsorship officers, resource mobilization, and administrators
- **Donation Management**: Process and track donations with multiple payment methods
- **Sponsorship Matching**: Connect donors with students and track progress
- **Campaign Management**: Create and manage fundraising campaigns
- **Financial Reporting**: Comprehensive financial analytics and reports
- **Role-Based Access Control**: Secure access based on user roles

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account and project

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables (already configured in Vercel)

4. Run the database setup scripts in order:
   \`\`\`sql
   -- Run these in your Supabase SQL Editor
   scripts/001_create_core_tables.sql
   scripts/002_create_triggers.sql
   scripts/003_finance_portal_policies.sql
   scripts/004_sponsorship_portal_policies.sql
   scripts/005_resource_mobilization_policies.sql
   scripts/006_admin_portal_policies.sql
   scripts/007_fix_rls_policies.sql
   scripts/008_seed_test_users.sql
   \`\`\`

5. Create test users:
   \`\`\`bash
   node scripts/create-test-users.js
   \`\`\`

6. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

## Test Credentials

After running the setup script, you can login with these credentials:

- **Donor Portal**: donor@starehe.ac.ke / Donor123!
- **Finance Portal**: finance@starehe.ac.ke / Finance123!
- **Sponsorship Portal**: sponsorship@starehe.ac.ke / Sponsor123!
- **Resource Mobilization**: resource@starehe.ac.ke / Resource123!
- **Admin Portal**: admin@starehe.ac.ke / Admin123!

## Portal Features

### Donor Portal
- View donation history
- Make new donations
- View sponsored students
- Track progress reports

### Finance Portal
- Verify transactions
- Generate financial reports
- Monitor revenue streams
- Reconcile payments

### Sponsorship Portal
- Manage student profiles
- Create sponsorship matches
- Generate progress reports
- Track student performance

### Resource Mobilization Portal
- Create and manage campaigns
- Track donor relationships
- Analyze campaign performance
- Manage outreach activities

### Admin Portal
- Manage user accounts and roles
- Configure system settings
- View audit logs
- Monitor system activity

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Charts**: Recharts

## Deployment

The application is configured for deployment on Vercel with automatic Supabase integration.

## Support

For issues or questions, please contact the development team.
