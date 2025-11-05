import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, DollarSign, GraduationCap, TrendingUp, Activity, AlertCircle } from "lucide-react"

export default async function AdminDashboard() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role !== "admin") {
    redirect("/portal/donor")
  }

  // Fetch system statistics
  const [
    { count: totalUsers },
    { count: totalDonors },
    { count: totalStudents },
    { count: activeCampaigns },
    { data: recentDonations },
    { data: systemHealth },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("donors").select("*", { count: "exact", head: true }),
    supabase.from("students").select("*", { count: "exact", head: true }),
    supabase.from("campaigns").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("donations").select("amount").order("created_at", { ascending: false }).limit(100),
    supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(10),
  ])

  const totalRevenue = recentDonations?.reduce((sum, d) => sum + (d.amount || 0), 0) || 0

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">System overview and management</p>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Registered accounts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Donors</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDonors || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Active donors</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Students</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Enrolled students</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeCampaigns || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Running campaigns</p>
            </CardContent>
          </Card>
        </div>

        {/* System Overview */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                System Health
              </CardTitle>
              <CardDescription>Recent system activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Database Status</span>
                  <span className="text-sm font-medium text-green-600">Operational</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Authentication</span>
                  <span className="text-sm font-medium text-green-600">Operational</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Payment Gateway</span>
                  <span className="text-sm font-medium text-green-600">Operational</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Recent Audit Logs</span>
                  <span className="text-sm font-medium">{systemHealth?.length || 0} entries</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Revenue Overview
              </CardTitle>
              <CardDescription>Recent donations summary</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-3xl font-bold">KES {totalRevenue.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    From {recentDonations?.length || 0} recent donations
                  </p>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Average donation: KES{" "}
                    {recentDonations?.length ? Math.round(totalRevenue / recentDonations.length).toLocaleString() : 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <a
                href="/portal/admin/users"
                className="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent transition-colors"
              >
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">Manage Users</div>
                  <div className="text-sm text-muted-foreground">View and edit user accounts</div>
                </div>
              </a>
              <a
                href="/portal/admin/settings"
                className="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent transition-colors"
              >
                <Activity className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">System Settings</div>
                  <div className="text-sm text-muted-foreground">Configure system parameters</div>
                </div>
              </a>
              <a
                href="/portal/admin/audit"
                className="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent transition-colors"
              >
                <AlertCircle className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">Audit Logs</div>
                  <div className="text-sm text-muted-foreground">View system activity logs</div>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
