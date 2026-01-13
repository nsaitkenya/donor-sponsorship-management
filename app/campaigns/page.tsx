"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { Target } from "lucide-react"

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCampaigns() {
      const supabase = createClient()
      const { data } = await supabase
        .from("campaigns")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false })

      setCampaigns(data || [])
      setLoading(false)
    }
    loadCampaigns()
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-12 sm:py-16 md:py-20">
          <div className="container px-4">
            <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-balance">Active Campaigns</h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed text-pretty">
                Support our ongoing fundraising initiatives and help us achieve our goals for student success
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 md:py-20">
          <div className="container">
            {loading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i}>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                          </div>
                        </div>
                        <Skeleton className="h-16 w-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-2 w-full" />
                          <div className="flex justify-between">
                            <Skeleton className="h-3 w-1/3" />
                            <Skeleton className="h-3 w-1/3" />
                          </div>
                        </div>
                        <Skeleton className="h-10 w-full" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {campaigns.length > 0 ? (
                  campaigns.map((campaign) => {
                    const progress =
                      campaign.goal_amount > 0 ? (campaign.current_amount / campaign.goal_amount) * 100 : 0
                    return (
                      <Link key={campaign.id} href={`/campaigns/${campaign.id}`}>
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                          <CardContent className="pt-6">
                            <div className="space-y-4">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <Target className="h-6 w-6" />
                                  </div>
                                  <div>
                                    <p className="font-semibold">{campaign.title}</p>
                                    <Badge variant="outline">{campaign.category || "General"}</Badge>
                                  </div>
                                </div>
                              </div>
                              {campaign.description && (
                                <p className="text-sm text-muted-foreground line-clamp-3">{campaign.description}</p>
                              )}
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Progress</span>
                                  <span className="font-medium">{Math.round(progress)}%</span>
                                </div>
                                <Progress value={progress} />
                                <div className="flex justify-between text-sm">
                                  <span className="font-medium">KES {campaign.current_amount.toLocaleString()}</span>
                                  <span className="text-muted-foreground">
                                    of KES {campaign.goal_amount.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                              <Button className="w-full">
                                View Details
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    )
                  })
                ) : (
                  <div className="col-span-full text-center py-12 text-muted-foreground">
                    No active campaigns at the moment. Check back soon!
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
