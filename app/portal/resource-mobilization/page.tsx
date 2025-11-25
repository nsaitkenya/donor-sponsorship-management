"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { PortalLayout } from "@/components/portal-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Target, TrendingUp, Users, Megaphone, ArrowRight } from "lucide-react"
import { getMockUser, isMockAuthEnabled } from "@/lib/mock-auth"

export default function ResourceMobilizationPortalPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    activeCampaigns: 0,
    totalCampaigns: 0,
    totalRaised: 0,
    totalGoal: 0,
    totalDonors: 0,
  })

  useEffect(() => {
    async function loadData() {
      // Check for mock auth first
      if (isMockAuthEnabled()) {
        const mockUser = getMockUser()

        if (!mockUser || (mockUser.role !== 'resource_mobilization' && mockUser.role !== 'admin')) {
          router.push('/auth/login')
          return
        }

        // Set mock data for demo
        setStats({
          activeCampaigns: 5,
          totalCampaigns: 12,
          totalRaised: 450000,
          totalGoal: 800000,
          totalDonors: 89,
        })
        setLoading(false)
        return
      }

      // Real Supabase data
      const supabase = createClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }

      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (profile?.role !== "resource_mobilization" && profile?.role !== "admin") {
        router.push("/portal/donor")
        return
      }

      const { data: campaigns } = await supabase.from("campaigns").select("*")
      const { data: donors } = await supabase.from("donors").select("*")

      const activeCampaigns = campaigns?.filter((c) => c.status === "active").length || 0
      const totalCampaigns = campaigns?.length || 0
      const totalRaised = campaigns?.reduce((sum, c) => sum + Number(c.current_amount), 0) || 0
      const totalGoal = campaigns?.reduce((sum, c) => sum + Number(c.goal_amount), 0) || 0
      const totalDonors = donors?.length || 0

      setStats({ activeCampaigns, totalCampaigns, totalRaised, totalGoal, totalDonors })
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
        <h1 className="text-3xl font-bold mb-2">Resource Mobilization Portal</h1>
        <p className="text-muted-foreground">Manage campaigns and donor outreach initiatives</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCampaigns}</div>
            <p className="text-xs text-muted-foreground">of {stats.totalCampaigns} total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Raised</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES {stats.totalRaised.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalGoal > 0
                ? `${Math.round((stats.totalRaised / stats.totalGoal) * 100)}% of goal`
                : "No goal set"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDonors}</div>
            <p className="text-xs text-muted-foreground">Registered contributors</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Campaign Success</CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalGoal > 0 ? `${Math.round((stats.totalRaised / stats.totalGoal) * 100)}%` : "0%"}
            </div>
            <p className="text-xs text-muted-foreground">Overall completion rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Campaigns</CardTitle>
            <CardDescription>Create and manage fundraising campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full justify-between">
              <Link href="/portal/resource-mobilization/campaigns">
                Manage Campaigns
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Donor Outreach</CardTitle>
            <CardDescription>View and engage with donor base</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full justify-between">
              <Link href="/portal/resource-mobilization/donors">
                View Donors
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
            <CardDescription>Track campaign performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full justify-between">
              <Link href="/portal/resource-mobilization/analytics">
                View Analytics
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  )
}
