"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

const TEST_USERS = [
  { email: "donor@starehe.ac.ke", password: "Donor@123", role: "donor" },
  { email: "finance@starehe.ac.ke", password: "Finance@123", role: "finance_officer" },
  { email: "sponsorship@starehe.ac.ke", password: "Sponsor@123", role: "sponsorship_officer" },
  { email: "resource@starehe.ac.ke", password: "Resource@123", role: "resource_mobilization" },
  { email: "admin@starehe.ac.ke", password: "Admin@123", role: "admin" },
]

export default function SetupUsersPage() {
  const [status, setStatus] = useState<{ [key: string]: string }>({})
  const [isCreating, setIsCreating] = useState(false)
  const supabase = createClient()

  const createUser = async (email: string, password: string, role: string) => {
    setStatus((prev) => ({ ...prev, [email]: "Creating..." }))

    try {
      console.log(`[v0] Creating user: ${email}`)

      // Sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { role },
        },
      })

      if (signUpError) {
        console.log(`[v0] Sign up error for ${email}:`, signUpError)
        throw signUpError
      }

      if (!authData.user) {
        throw new Error("User creation failed - no user returned")
      }

      console.log(`[v0] User created successfully: ${authData.user.id}`)

      const { error: profileError } = await supabase
        .from("profiles")
        .insert([{ id: authData.user.id, email, full_name: email.split("@")[0], role }])
        .select()

      if (profileError) {
        console.log(`[v0] Profile insert error for ${email}:`, profileError)
        throw profileError
      }

      setStatus((prev) => ({ ...prev, [email]: "✓ Created" }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      console.log(`[v0] Failed to create user ${email}:`, errorMessage)
      setStatus((prev) => ({ ...prev, [email]: `✗ ${errorMessage}` }))
    }
  }

  const createAllUsers = async () => {
    setIsCreating(true)
    for (const user of TEST_USERS) {
      await createUser(user.email, user.password, user.role)
      // Add delay between creations
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
    setIsCreating(false)
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-muted/30">
      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Setup Test Users</CardTitle>
            <CardDescription>Create all test user accounts for the donor management system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  <p className="font-semibold mb-2">This will create 5 test accounts:</p>
                  <ul className="space-y-1 text-sm">
                    {TEST_USERS.map((user) => (
                      <li key={user.email}>
                        • <strong>{user.email}</strong> ({user.role})
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <h3 className="font-semibold">Creation Status:</h3>
                <div className="grid gap-2">
                  {TEST_USERS.map((user) => (
                    <div key={user.email} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm">{user.email}</span>
                      <span
                        className={`text-sm font-medium ${status[user.email]?.includes("✓") ? "text-green-600" : status[user.email]?.includes("✗") ? "text-red-600" : "text-muted-foreground"}`}
                      >
                        {status[user.email] || "Pending"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={createAllUsers} disabled={isCreating} className="flex-1">
                  {isCreating ? "Creating Users..." : "Create All Users"}
                </Button>
                <Link href="/auth/login" className="flex-1">
                  <Button variant="outline" className="w-full bg-transparent">
                    Go to Login
                  </Button>
                </Link>
              </div>

              <p className="text-xs text-muted-foreground">
                After creating users, you can login at{" "}
                <Link href="/auth/login" className="underline">
                  /auth/login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
