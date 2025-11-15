"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from 'next/navigation'

export async function loginUser(email: string, password: string) {
  const supabase = createClient()
  
  console.log("[v0] Server action: Attempting login for", email)
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    console.log("[v0] Server action: SignIn response -", { error: error?.message, userId: data?.user?.id })

    if (error) {
      console.log("[v0] Server action: SignIn error:", error.message)
      return { error: error.message }
    }

    if (!data.user) {
      console.log("[v0] Server action: No user returned")
      return { error: "Authentication failed" }
    }

    // Fetch user profile to get role
    console.log("[v0] Server action: Fetching profile for user:", data.user.id)
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single()

    console.log("[v0] Server action: Profile fetch -", { role: profile?.role, error: profileError?.message })

    if (profileError) {
      console.log("[v0] Server action: Profile error:", profileError.message)
      return { error: "Profile not found" }
    }

    console.log("[v0] Server action: Login successful for role:", profile?.role)
    
    // Return success with role
    return { success: true, role: profile?.role || "donor" }
  } catch (error) {
    const message = error instanceof Error ? error.message : "An error occurred"
    console.log("[v0] Server action: Exception caught:", message)
    return { error: message }
  }
}
