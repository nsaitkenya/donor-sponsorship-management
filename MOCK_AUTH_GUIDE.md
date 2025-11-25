# Mock Authentication - Quick Start Guide

## ✅ What's Been Set Up

Mock authentication is **ENABLED** by default. This lets you bypass Supabase completely and access all portals instantly.

## 🔑 Demo Credentials

All accounts use the password: **demo**

| Email | Role | Portal Access |
|-------|------|---------------|
| donor@starehe.ac.ke | Donor | Donor Portal |
| finance@starehe.ac.ke | Finance Officer | Finance Portal |
| sponsorship@starehe.ac.ke | Sponsorship Officer | Sponsorship Portal |
| resource@starehe.ac.ke | Resource Mobilization | Resource Mobilization Portal |
| admin@starehe.ac.ke | Admin | Admin Portal |

## 🚀 How to Login

1. Go to http://localhost:3001/auth/login
2. Enter any email from the table above
3. Enter password: **demo**
4. Click Login

You'll be instantly redirected to the appropriate portal with no database setup needed!

## 🔄 How It Works

- **Login Page**: Checks if mock auth is enabled, then validates credentials locally
- **Portal Pages**: Load mock user data from localStorage instead of querying Supabase
- **Logout**: Clears localStorage and redirects to login

## 🎯 Features

✅ No Supabase setup required  
✅ No database tables needed  
✅ No environment variables needed  
✅ Instant access to all portals  
✅ Sample data displayed where applicable  
✅ Full navigation and logout working  

## 📝 Disabling Mock Auth (When Ready for Production)

When you're ready to use real Supabase authentication:

1. Open `lib/mock-auth.ts`
2. Find the `isMockAuthEnabled()` function
3. Change `return true` to `return false`

```typescript
export function isMockAuthEnabled() {
  // Set to true to enable mock auth, false to use real Supabase
  return false  // Changed from true
}
```

4. Restart your dev server
5. Setup your Supabase database (see `FIX_ISSUES_NOW.md`)

## 🧪 Testing Different Roles

1. Login as donor@starehe.ac.ke → See donor dashboard
2. Logout
3. Login as finance@starehe.ac.ke → See finance portal
4. Logout
5. Login as admin@starehe.ac.ke → See admin portal

Each role has access to different features and pages!

## 📂 Files Modified

- `lib/mock-auth.ts` - Core mock auth logic
- `app/auth/login/page.tsx` - Login page with mock auth
- `app/portal/donor/page.tsx` - Donor portal with mock support
- `app/portal/finance/page.tsx` - Finance portal with mock support
- `app/portal/sponsorship/page.tsx` - Sponsorship portal with mock support
- `components/portal-header.tsx` - Logout with mock auth support

## 🎨 Layout Fixes

The layout centering issue has been fixed:
- Container max-width added to `globals.css`
- Portal layout updated to use centered container
- All pages now display professionally centered

**Remember to restart your dev server if layout changes aren't visible!**
