"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { useState } from "react"
import { getPortalPath } from "@/lib/utils/portal"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { loginUser } from "@/lib/actions/auth-actions"
import { MOCK_USERS, setMockUser, isMockAuthEnabled } from "@/lib/mock-auth"

const DEMO_ACCOUNTS = [
  { email: "donor@starehe.ac.ke", password: "demo", role: "donor" },
  { email: "finance@starehe.ac.ke", password: "demo", role: "finance_officer" },
  { email: "sponsorship@starehe.ac.ke", password: "demo", role: "sponsorship_officer" },
  { email: "resource@starehe.ac.ke", password: "demo", role: "resource_mobilization" },
  { email: "admin@starehe.ac.ke", password: "demo", role: "admin" },
]

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    console.log("[v0] Client: Login attempt started with email:", email)

    try {
      // Check if mock auth is enabled
      if (isMockAuthEnabled()) {
        console.log("[v0] Client: Mock auth enabled, checking demo accounts")

        const demoAccount = DEMO_ACCOUNTS.find(
          acc => acc.email.toLowerCase() === email.toLowerCase() && acc.password === password
        )

        if (demoAccount) {
          console.log("[v0] Client: Demo account matched, logging in as:", demoAccount.role)
          setMockUser(demoAccount.email)
          const portalPath = getPortalPath(demoAccount.role)
          console.log("[v0] Client: Redirecting to:", portalPath)
          router.push(portalPath)
          router.refresh()
          return
        } else {
          setError("Invalid credentials. Use any email above with password: demo")
          return
        }
      }

      // Real Supabase auth (when mock auth is disabled)
      console.log("[v0] Client: Calling loginUser server action")
      const result = await loginUser(email, password)

      console.log("[v0] Client: Server action result:", result)

      if (result.error) {
        console.log("[v0] Client: Login error from server:", result.error)
        setError(result.error)
        return
      }

      if (!result.success) {
        console.log("[v0] Client: Login failed - no success flag")
        setError("Login failed")
        return
      }

      console.log("[v0] Client: Login successful, redirecting to portal for role:", result.role)
      const portalPath = getPortalPath(result.role || "donor")
      console.log("[v0] Client: Redirecting to:", portalPath)
      router.push(portalPath)
      router.refresh()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred"
      console.log("[v0] Client: Exception caught:", errorMessage)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-muted/30">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xl">
              SBC
            </div>
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="text-sm text-muted-foreground">Sign in to access your portal</p>
          </div>

          <Alert className="bg-green-50 border-green-200">
            <AlertDescription className="text-xs">
              <p className="font-semibold mb-2 text-green-900">✅ Mock Auth Enabled - Demo Mode Active</p>
              <div className="space-y-1 mb-2">
                <p className="text-green-800">Login with any of these accounts using password: <strong>demo</strong></p>
              </div>
              <div className="space-y-1 pl-2">
                <p className="text-green-900">
                  • <strong>donor@starehe.ac.ke</strong> → Donor Portal
                </p>
                <p className="text-green-900">
                  • <strong>finance@starehe.ac.ke</strong> → Finance Portal
                </p>
                <p className="text-green-900">
                  • <strong>sponsorship@starehe.ac.ke</strong> → Sponsorship Portal
                </p>
                <p className="text-green-900">
                  • <strong>resource@starehe.ac.ke</strong> → Resource Mobilization
                </p>
                <p className="text-green-900">
                  • <strong>admin@starehe.ac.ke</strong> → Admin Portal
                </p>
              </div>
              <p className="mt-2 text-green-700 text-[10px]">
                To disable mock auth and use real Supabase, set <code className="bg-green-100 px-1 rounded">isMockAuthEnabled()</code> to false in <code className="bg-green-100 px-1 rounded">lib/mock-auth.ts</code>
              </p>
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>Enter your credentials to access your portal</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link href="/auth/sign-up" className="underline underline-offset-4">
                    Sign up
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
