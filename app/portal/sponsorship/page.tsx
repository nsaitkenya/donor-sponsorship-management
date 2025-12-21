"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { PortalLayout } from "@/components/portal-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, UserCheck, GraduationCap, FileText, ArrowRight } from "lucide-react"

export default function SponsorshipPortalPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    activeMatches: 0,
    pendingMatches: 0,
    reportsThisMonth: 0,
  })

  useEffect(() => {
    async function loadData() {
      const supabase = createClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }

      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (profile?.role !== "sponsorship_officer" && profile?.role !== "admin") {
        router.push("/portal/donor")
        return
      }

      const { data: students } = await supabase.from("students").select("*")
      const { data: sponsorships } = await supabase.from("sponsorships").select("*")
      const { data: progressReports } = await supabase.from("progress_reports").select("*")

      const totalStudents = students?.length || 0
      const activeStudents = students?.filter((s) => s.status === "active").length || 0
      const activeMatches = sponsorships?.filter((s) => s.status === "active").length || 0
      const pendingMatches = sponsorships?.filter((s) => s.status === "pending").length || 0
      const reportsThisMonth =
        progressReports?.filter((r) => {
          const reportDate = new Date(r.created_at)
          const now = new Date()
          return reportDate.getMonth() === now.getMonth() && reportDate.getFullYear() === now.getFullYear()
        }).length || 0

      setStats({ totalStudents, activeStudents, activeMatches, pendingMatches, reportsThisMonth })
      setLoading(false)
    }
    loadData()
  }, [router])

  if (loading) {
    return (
      <PortalLayout>
        <div className="flex items-center justify-center min-h-screen">Loading...</div>
      </PortalLayout>
    )
  }

  return (
    <PortalLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Sponsorship Portal</h1>
        <p className="text-muted-foreground">Manage students, sponsorships, and progress tracking</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">{stats.activeStudents} currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Matches</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeMatches}</div>
            <p className="text-xs text-muted-foreground">Student-sponsor pairs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Matches</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingMatches}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reports This Month</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.reportsThisMonth}</div>
            <p className="text-xs text-muted-foreground">Progress updates</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Students</CardTitle>
            <CardDescription>Manage student profiles and information</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full justify-between">
              <Link href="/portal/sponsorship/students">
                View All Students
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sponsorships</CardTitle>
            <CardDescription>Match students with sponsors</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full justify-between">
              <Link href="/portal/sponsorship/matches">
                Manage Matches
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Progress Reports</CardTitle>
            <CardDescription>Track and share student progress</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full justify-between">
              <Link href="/portal/sponsorship/reports">
                View Reports
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  )
}
