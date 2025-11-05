import { createClient } from "@supabase/supabase-js"

// This script creates test users for all portal types
// Run with: node scripts/create-test-users.js

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing required environment variables")
  console.error("Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

const testUsers = [
  {
    email: "donor@starehe.ac.ke",
    password: "Donor123!",
    role: "donor",
    fullName: "Test Donor",
    phone: "+254700000001",
  },
  {
    email: "finance@starehe.ac.ke",
    password: "Finance123!",
    role: "finance_officer",
    fullName: "Finance Officer",
    phone: "+254700000002",
  },
  {
    email: "sponsorship@starehe.ac.ke",
    password: "Sponsor123!",
    role: "sponsorship_officer",
    fullName: "Sponsorship Officer",
    phone: "+254700000003",
  },
  {
    email: "resource@starehe.ac.ke",
    password: "Resource123!",
    role: "resource_mobilization",
    fullName: "Resource Mobilization Officer",
    phone: "+254700000004",
  },
  {
    email: "admin@starehe.ac.ke",
    password: "Admin123!",
    role: "admin",
    fullName: "System Administrator",
    phone: "+254700000005",
  },
]

async function createTestUsers() {
  console.log("Creating test users...\n")

  for (const user of testUsers) {
    try {
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          full_name: user.fullName,
        },
      })

      if (authError) {
        if (authError.message.includes("already registered")) {
          console.log(`✓ User ${user.email} already exists`)

          // Get existing user
          const { data: existingUsers } = await supabase.auth.admin.listUsers()
          const existingUser = existingUsers?.users.find((u) => u.email === user.email)

          if (existingUser) {
            // Update profile role
            const { error: updateError } = await supabase
              .from("profiles")
              .update({
                role: user.role,
                full_name: user.fullName,
                phone: user.phone,
              })
              .eq("id", existingUser.id)

            if (updateError) {
              console.error(`  ✗ Error updating profile: ${updateError.message}`)
            } else {
              console.log(`  ✓ Updated role to ${user.role}`)
            }
          }
        } else {
          console.error(`✗ Error creating ${user.email}: ${authError.message}`)
        }
        continue
      }

      console.log(`✓ Created user: ${user.email}`)
      console.log(`  Password: ${user.password}`)
      console.log(`  Role: ${user.role}`)

      // Update profile with role (the trigger creates the profile, we just update the role)
      if (authData.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            role: user.role,
            full_name: user.fullName,
            phone: user.phone,
          })
          .eq("id", authData.user.id)

        if (profileError) {
          console.error(`  ✗ Error updating profile: ${profileError.message}`)
        } else {
          console.log(`  ✓ Profile updated with role`)
        }
      }

      console.log("")
    } catch (error) {
      console.error(`✗ Unexpected error for ${user.email}:`, error)
    }
  }

  console.log("\n✅ Test user creation complete!")
  console.log("\nYou can now login with these credentials:")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  testUsers.forEach((user) => {
    console.log(`\n${user.role.toUpperCase().replace("_", " ")}:`)
    console.log(`  Email: ${user.email}`)
    console.log(`  Password: ${user.password}`)
  })
}

createTestUsers().catch(console.error)
