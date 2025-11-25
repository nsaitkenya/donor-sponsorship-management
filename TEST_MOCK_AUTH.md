# Test Mock Authentication

## Quick Test Steps

### 1. Test Login Page
- Go to: http://localhost:3001/auth/login
- You should see a green banner saying "Mock Auth Enabled - Demo Mode Active"
- Lists 5 demo accounts with password: demo

### 2. Test Donor Portal
- Email: donor@starehe.ac.ke
- Password: demo
- Should redirect to: `/portal/donor`
- Should show: Donor dashboard with stats

### 3. Test Finance Portal
- Logout (click user avatar → Sign Out)
- Login with: finance@starehe.ac.ke / demo
- Should redirect to: `/portal/finance`
- Should show: Finance dashboard with revenue stats

### 4. Test Sponsorship Portal
- Logout
- Login with: sponsorship@starehe.ac.ke / demo
- Should redirect to: `/portal/sponsorship`
- Should show: Sponsorship dashboard with student stats

### 5. Test Admin Portal
- Logout
- Login with: admin@starehe.ac.ke / demo
- Should redirect to: `/portal/admin`
- Should show: Admin dashboard

### 6. Test Logout
- Click user avatar in top right
- Click "Sign Out"
- Should redirect to login page
- Try accessing `/portal/donor` directly
- Should redirect back to login (protected route)

## Expected Results

✅ No Supabase errors  
✅ No database connection errors  
✅ Instant login (no delays)  
✅ All portals accessible  
✅ Centered layout (not edge-to-edge)  
✅ Logout clears session  

## If Something Doesn't Work

1. **Still seeing Supabase errors?**
   - Check browser console (F12)
   - Make sure you're using the demo credentials
   - Try clearing browser cache

2. **Layout not centered?**
   - Hard refresh: Ctrl+Shift+R
   - Clear browser cache
   - Restart dev server

3. **Login not working?**
   - Check you're using password: "demo" (all lowercase)
   - Check browser console for errors
   - Make sure dev server is running on port 3001

4. **Redirects to login immediately?**
   - This is correct! Mock auth uses localStorage
   - Login again to set the session
