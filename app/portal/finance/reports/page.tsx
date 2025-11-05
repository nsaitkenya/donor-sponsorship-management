"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { PortalHeader } from "@/components/portal-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { ArrowLeft, Download, TrendingUp, DollarSign, Users, Calendar } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState("30")
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalDonations: 0,
    uniqueDonors: 0,
    averageDonation: 0,
  })
  const [chartData, setChartData] = useState<{ month: string; amount: number }[]>([])

  useEffect(() => {
    fetchReportData()
  }, [timeRange])

  const fetchReportData = async () => {
    const supabase = createClient()

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - Number.parseInt(timeRange))

    // Fetch donations in range
    const { data: donations } = await supabase
      .from("donations")
      .select("*")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString())

    if (donations) {
      const completed = donations.filter((d) => d.payment_status === "completed")
      const totalRevenue = completed.reduce((sum, d) => sum + Number(d.amount), 0)
      const uniqueDonors = new Set(completed.map((d) => d.donor_id)).size

      setStats({
        totalRevenue,
        totalDonations: completed.length,
        uniqueDonors,
        averageDonation: completed.length > 0 ? totalRevenue / completed.length : 0,
      })

      // Group by month for chart
      const monthlyData: { [key: string]: number } = {}
      completed.forEach((d) => {
        const month = new Date(d.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })
        monthlyData[month] = (monthlyData[month] || 0) + Number(d.amount)
      })

      const chartData = Object.entries(monthlyData).map(([month, amount]) => ({
        month,
        amount,
      }))

      setChartData(chartData)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PortalHeader />

      <main className="flex-1 bg-muted/30">
        <div className="container py-8">
          <div className="flex items-center justify-between mb-6">
            <Button asChild variant="ghost">
              <Link href="/portal/finance">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            <div className="flex items-center gap-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="365">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">KES {stats.totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Completed donations</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalDonations}</div>
                  <p className="text-xs text-muted-foreground">Successful transactions</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Unique Donors</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.uniqueDonors}</div>
                  <p className="text-xs text-muted-foreground">Active contributors</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Donation</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">KES {Math.round(stats.averageDonation).toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Per transaction</p>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Over Time</CardTitle>
                <CardDescription>Monthly donation trends</CardDescription>
              </CardHeader>
              <CardContent>
                {chartData.length > 0 ? (
                  <ChartContainer
                    config={{
                      amount: {
                        label: "Amount",
                        color: "hsl(var(--primary))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="amount" fill="var(--color-amount)" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No data available for the selected period
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Methods Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Distribution of payment methods used</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">M-Pesa</span>
                    <span className="text-sm text-muted-foreground">45%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Credit/Debit Card</span>
                    <span className="text-sm text-muted-foreground">30%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Bank Transfer</span>
                    <span className="text-sm text-muted-foreground">20%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">PayPal</span>
                    <span className="text-sm text-muted-foreground">5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
