"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { PortalHeader } from "@/components/portal-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, TrendingUp, Users, Target, DollarSign } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Pie, PieChart, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function AnalyticsPage() {
  const [stats, setStats] = useState({
    totalDonors: 0,
    totalCampaigns: 0,
    totalRaised: 0,
    averageDonation: 0,
  })
  const [campaignData, setCampaignData] = useState<{ name: string; raised: number; goal: number }[]>([])
  const [donorTypeData, setDonorTypeData] = useState<{ name: string; value: number }[]>([])

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    const supabase = createClient()

    const { data: donors } = await supabase.from("donors").select("*")
    const { data: campaigns } = await supabase.from("campaigns").select("*")
    const { data: donations } = await supabase.from("donations").select("*").eq("payment_status", "completed")

    if (donors && campaigns && donations) {
      const totalRaised = donations.reduce((sum, d) => sum + Number(d.amount), 0)

      setStats({
        totalDonors: donors.length,
        totalCampaigns: campaigns.length,
        totalRaised,
        averageDonation: donations.length > 0 ? totalRaised / donations.length : 0,
      })

      // Campaign performance data
      const topCampaigns = campaigns
        .sort((a, b) => b.current_amount - a.current_amount)
        .slice(0, 5)
        .map((c) => ({
          name: c.title.length > 20 ? c.title.substring(0, 20) + "..." : c.title,
          raised: Number(c.current_amount),
          goal: Number(c.goal_amount),
        }))
      setCampaignData(topCampaigns)

      // Donor type distribution
      const donorTypes = donors.reduce(
        (acc, d) => {
          acc[d.donor_type] = (acc[d.donor_type] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )
      const donorTypeArray = Object.entries(donorTypes).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
      }))
      setDonorTypeData(donorTypeArray)
    }
  }

  const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"]

  return (
    <div className="flex min-h-screen flex-col">
      <PortalHeader />

      <main className="flex-1 bg-muted/30">
        <div className="container py-8">
          <Button asChild variant="ghost" className="mb-6">
            <Link href="/portal/resource-mobilization">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>

          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
                  <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalCampaigns}</div>
                  <p className="text-xs text-muted-foreground">Fundraising initiatives</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Raised</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">KES {stats.totalRaised.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">All-time contributions</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Donation</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">KES {Math.round(stats.averageDonation).toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Per transaction</p>
                </CardContent>
              </Card>
            </div>

            {/* Campaign Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Top Campaigns Performance</CardTitle>
                <CardDescription>Raised vs Goal for top 5 campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                {campaignData.length > 0 ? (
                  <ChartContainer
                    config={{
                      raised: {
                        label: "Raised",
                        color: "hsl(var(--primary))",
                      },
                      goal: {
                        label: "Goal",
                        color: "hsl(var(--muted))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={campaignData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="raised" fill="var(--color-raised)" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="goal" fill="var(--color-goal)" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No campaign data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Donor Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Donor Type Distribution</CardTitle>
                <CardDescription>Breakdown of donors by type</CardDescription>
              </CardHeader>
              <CardContent>
                {donorTypeData.length > 0 ? (
                  <div className="flex items-center justify-center">
                    <ChartContainer
                      config={{
                        value: {
                          label: "Donors",
                        },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={donorTypeData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {donorTypeData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No donor data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
