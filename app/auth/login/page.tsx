"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { getPortalPath } from "@/lib/utils/portal"
import { Info } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (signInError) throw signInError

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not found")

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      if (profileError) throw profileError

      const portalPath = getPortalPath(profile?.role || "donor")
      router.push(portalPath)
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
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

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <p className="font-semibold mb-2">Setup Test Accounts:</p>
              <div className="space-y-1 mb-2">
                <p className="text-muted-foreground">1. Go to Supabase Dashboard → Authentication → Users</p>
                <p className="text-muted-foreground">2. Create users with these emails and passwords:</p>
              </div>
              <div className="space-y-1 pl-2">
                <p>
                  • <strong>donor@starehe.ac.ke</strong> / Donor@123
                </p>
                <p>
                  • <strong>finance@starehe.ac.ke</strong> / Finance@123
                </p>
                <p>
                  • <strong>sponsorship@starehe.ac.ke</strong> / Sponsor@123
                </p>
                <p>
                  • <strong>resource@starehe.ac.ke</strong> / Resource@123
                </p>
                <p>
                  • <strong>admin@starehe.ac.ke</strong> / Admin@123
                </p>
              </div>
              <p className="mt-2 text-muted-foreground">
                3. Run{" "}
                <code className="text-xs bg-muted px-1 py-0.5 rounded">scripts/009_create_test_users_manual.sql</code>{" "}
                in SQL Editor
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
