"""
Automated Test User Setup Script
Creates test users with proper roles for all portals
"""

import os
import json
from urllib.request import Request, urlopen
from urllib.error import HTTPError

# Supabase configuration from environment
SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_SERVICE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    print("❌ Error: Missing Supabase environment variables")
    print("Required: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY")
    exit(1)

# Test users to create
TEST_USERS = [
    {
        'email': 'donor@starehe.ac.ke',
        'password': 'Donor@123',
        'role': 'donor',
        'full_name': 'Test Donor',
        'phone': '+254700000001',
        'create_donor_record': True
    },
    {
        'email': 'finance@starehe.ac.ke',
        'password': 'Finance@123',
        'role': 'finance_officer',
        'full_name': 'Test Finance Officer',
        'phone': '+254700000002'
    },
    {
        'email': 'sponsorship@starehe.ac.ke',
        'password': 'Sponsor@123',
        'role': 'sponsorship_officer',
        'full_name': 'Test Sponsorship Officer',
        'phone': '+254700000003'
    },
    {
        'email': 'resource@starehe.ac.ke',
        'password': 'Resource@123',
        'role': 'resource_mobilization',
        'full_name': 'Test Resource Officer',
        'phone': '+254700000004'
    },
    {
        'email': 'admin@starehe.ac.ke',
        'password': 'Admin@123',
        'role': 'admin',
        'full_name': 'Test Admin',
        'phone': '+254700000005'
    }
]

def make_request(endpoint, method='GET', data=None):
    """Make HTTP request to Supabase"""
    url = f"{SUPABASE_URL}/{endpoint}"
    headers = {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': f'Bearer {SUPABASE_SERVICE_KEY}',
        'Content-Type': 'application/json'
    }
    
    if data:
        data = json.dumps(data).encode('utf-8')
    
    req = Request(url, data=data, headers=headers, method=method)
    
    try:
        with urlopen(req) as response:
            return json.loads(response.read().decode('utf-8'))
    except HTTPError as e:
        error_body = e.read().decode('utf-8')
        print(f"❌ HTTP Error {e.code}: {error_body}")
        return None

def create_user(user_data):
    """Create a user via Supabase Admin API"""
    print(f"\n📝 Creating user: {user_data['email']}")
    
    # Create user in auth
    auth_data = {
        'email': user_data['email'],
        'password': user_data['password'],
        'email_confirm': True,
        'user_metadata': {
            'full_name': user_data['full_name'],
            'role': user_data['role']
        }
    }
    
    result = make_request('auth/v1/admin/users', 'POST', auth_data)
    
    if not result:
        print(f"   ⚠️  User might already exist, trying to update...")
        # Try to find and update existing user
        users = make_request(f"auth/v1/admin/users?email=eq.{user_data['email']}")
        if users and len(users) > 0:
            user_id = users[0]['id']
            print(f"   ✓ Found existing user: {user_id}")
            return user_id
        return None
    
    user_id = result.get('id')
    print(f"   ✓ User created: {user_id}")
    return user_id

def update_profile(user_data):
    """Update user profile with role and details"""
    print(f"   📋 Updating profile for {user_data['email']}")
    
    profile_data = {
        'role': user_data['role'],
        'full_name': user_data['full_name'],
        'phone': user_data['phone']
    }
    
    # Update profile via REST API
    result = make_request(
        f"rest/v1/profiles?email=eq.{user_data['email']}",
        'PATCH',
        profile_data
    )
    
    if result is not None:
        print(f"   ✓ Profile updated with role: {user_data['role']}")
        return True
    return False

def create_donor_record(email):
    """Create donor record for donor users"""
    print(f"   💰 Creating donor record")
    
    # First get the user_id from profiles
    profile = make_request(f"rest/v1/profiles?email=eq.{email}&select=id")
    
    if not profile or len(profile) == 0:
        print(f"   ❌ Could not find profile")
        return False
    
    user_id = profile[0]['id']
    
    donor_data = {
        'user_id': user_id,
        'donor_type': 'individual',
        'total_donated': 0,
        'donation_count': 0
    }
    
    result = make_request('rest/v1/donors', 'POST', donor_data)
    
    if result:
        print(f"   ✓ Donor record created")
        return True
    else:
        print(f"   ⚠️  Donor record might already exist")
        return False

def main():
    """Main setup function"""
    print("=" * 60)
    print("🚀 Starehe Donor Management System - Test User Setup")
    print("=" * 60)
    
    success_count = 0
    
    for user_data in TEST_USERS:
        try:
            user_id = create_user(user_data)
            
            if user_id:
                # Update profile with role
                update_profile(user_data)
                
                # Create donor record if needed
                if user_data.get('create_donor_record'):
                    create_donor_record(user_data['email'])
                
                success_count += 1
                print(f"   ✅ {user_data['email']} setup complete!")
            else:
                print(f"   ❌ Failed to setup {user_data['email']}")
                
        except Exception as e:
            print(f"   ❌ Error setting up {user_data['email']}: {str(e)}")
    
    print("\n" + "=" * 60)
    print(f"✨ Setup Complete: {success_count}/{len(TEST_USERS)} users created")
    print("=" * 60)
    print("\n📋 Test Account Credentials:")
    print("-" * 60)
    for user in TEST_USERS:
        print(f"  {user['role'].upper():20} | {user['email']:30} | {user['password']}")
    print("-" * 60)
    print("\n🔗 You can now login at: /auth/login")

if __name__ == '__main__':
    main()
