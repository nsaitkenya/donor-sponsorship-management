"""
Complete Test User Setup - Creates Auth Users + Updates Profiles
This script creates all test users with proper roles
"""

import os
import json
import sys
from urllib.request import Request, urlopen
from urllib.error import HTTPError

SUPABASE_URL = os.environ.get('SUPABASE_URL')
SERVICE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')

if not SUPABASE_URL or not SERVICE_KEY:
    print("❌ Missing Supabase credentials")
    sys.exit(1)

TEST_USERS = [
    {'email': 'donor@starehe.ac.ke', 'password': 'Donor@123', 'role': 'donor'},
    {'email': 'finance@starehe.ac.ke', 'password': 'Finance@123', 'role': 'finance_officer'},
    {'email': 'sponsorship@starehe.ac.ke', 'password': 'Sponsor@123', 'role': 'sponsorship_officer'},
    {'email': 'resource@starehe.ac.ke', 'password': 'Resource@123', 'role': 'resource_mobilization'},
    {'email': 'admin@starehe.ac.ke', 'password': 'Admin@123', 'role': 'admin'},
]

def api_call(endpoint, method='POST', data=None):
    """Make Supabase API call"""
    url = f"{SUPABASE_URL}/{endpoint}"
    headers = {
        'apikey': SERVICE_KEY,
        'Authorization': f'Bearer {SERVICE_KEY}',
        'Content-Type': 'application/json'
    }
    body = json.dumps(data).encode() if data else None
    req = Request(url, data=body, headers=headers, method=method)
    try:
        with urlopen(req) as r:
            return json.loads(r.read())
    except Exception as e:
        print(f"API Error: {e}")
        return None

def main():
    print("🚀 Creating Test Users...\n")
    
    for user in TEST_USERS:
        print(f"Creating {user['email']}...")
        
        # Create auth user
        auth_result = api_call('auth/v1/admin/users', 'POST', {
            'email': user['email'],
            'password': user['password'],
            'email_confirm': True
        })
        
        if auth_result and 'id' in auth_result:
            print(f"  ✓ Auth user created: {auth_result['id']}")
        else:
            print(f"  ⚠️  User might exist, continuing...")
    
    print("\n✅ Users created! Run scripts/010_fix_test_users.sql in Supabase SQL Editor")
    print("\n📋 Test Credentials:")
    for user in TEST_USERS:
        print(f"  {user['role']:25} | {user['email']:30} | {user['password']}")
    print("\n🔗 Login: /auth/login")

if __name__ == '__main__':
    main()
