import os
from supabase import create_client

# Get Supabase credentials from environment
supabase_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
service_role_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not supabase_url or not service_role_key:
    print("[v0] Error: Missing Supabase environment variables")
    exit(1)

supabase = create_client(supabase_url, service_role_key)

# Define the test users with their expected roles
test_users = [
    {"email": "donor@starehe.ac.ke", "role": "donor", "name": "Test Donor"},
    {"email": "finance@starehe.ac.ke", "role": "finance_officer", "name": "Test Finance Officer"},
    {"email": "sponsorship@starehe.ac.ke", "role": "sponsorship_officer", "name": "Test Sponsorship Officer"},
    {"email": "resource@starehe.ac.ke", "role": "resource_mobilization", "name": "Test Resource Mobilization"},
    {"email": "admin@starehe.ac.ke", "role": "admin", "name": "Test Admin"},
]

print("[v0] Fetching auth users to get their IDs...")
try:
    # Get all users from auth
    response = supabase.auth.admin.list_users()
    auth_users = response.users if hasattr(response, 'users') else response
    
    print(f"[v0] Found {len(auth_users)} auth users")
    
    # Create a mapping of email to user ID
    email_to_id = {user.email: user.id for user in auth_users}
    
    print("[v0] Creating profiles for test users...")
    
    for test_user in test_users:
        user_id = email_to_id.get(test_user["email"])
        
        if not user_id:
            print(f"[v0] Warning: User {test_user['email']} not found in auth")
            continue
        
        print(f"[v0] Creating profile for {test_user['email']} with ID {user_id}")
        
        # Insert profile
        response = supabase.table("profiles").insert({
            "id": user_id,
            "email": test_user["email"],
            "full_name": test_user["name"],
            "role": test_user["role"]
        }).execute()
        
        print(f"[v0] Profile created: {test_user['email']}")
    
    print("[v0] All profiles created successfully!")
    
except Exception as e:
    print(f"[v0] Error creating profiles: {str(e)}")
    exit(1)
