"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { ArrowLeft, Target, TrendingUp, Calendar, DollarSign, Users, Share2 } from "lucide-react"
import type { Campaign } from "@/lib/types"

export default function CampaignDetailPage() {
    const params = useParams()
    const [campaign, setCampaign] = useState<Campaign | null>(null)
    const [loading, setLoading] = useState(true)
    const [donationCount, setDonationCount] = useState(0)

    useEffect(() => {
        async function loadCampaign() {
            const supabase = createClient()

            // Fetch campaign details
            const { data: campaignData } = await supabase
                .from("campaigns")
                .select("*")
                .eq("id", params.id)
                .single()

            if (campaignData) {
                setCampaign(campaignData)

                // Fetch donation count for this campaign
                const { count } = await supabase
                    .from("donations")
                    .select("*", { count: "exact", head: true })
                    .eq("campaign_id", params.id)
                    .eq("payment_status", "completed")

                setDonationCount(count || 0)
            }

            setLoading(false)
        }

        if (params.id) {
            loadCampaign()
        }
    }, [params.id])

    if (loading) {
        return (
            <div className="flex min-h-screen flex-col">
                <SiteHeader />
                <main className="flex-1 py-12">
                    <div className="container">
                        <Skeleton className="h-8 w-32 mb-8" />
                        <div className="grid lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                <Skeleton className="h-96 w-full rounded-lg" />
                                <Skeleton className="h-12 w-3/4" />
                                <Skeleton className="h-32 w-full" />
                            </div>
                            <div className="space-y-6">
                                <Card>
                                    <CardContent className="pt-6 space-y-4">
                                        <Skeleton className="h-24 w-full" />
                                        <Skeleton className="h-12 w-full" />
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </main>
                <SiteFooter />
            </div>
        )
    }

    if (!campaign) {
        return (
            <div className="flex min-h-screen flex-col">
                <SiteHeader />
                <main className="flex-1 py-12">
                    <div className="container text-center">
                        <h1 className="text-3xl font-bold mb-4">Campaign Not Found</h1>
                        <p className="text-muted-foreground mb-6">The campaign you're looking for doesn't exist or has been removed.</p>
                        <Button asChild>
                            <Link href="/campaigns">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Campaigns
                            </Link>
                        </Button>
                    </div>
                </main>
                <SiteFooter />
            </div>
        )
    }

    const progress = campaign.goal_amount > 0
        ? Math.min((campaign.current_amount / campaign.goal_amount) * 100, 100)
        : 0

    const daysRemaining = campaign.end_date
        ? Math.max(0, Math.ceil((new Date(campaign.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
        : null

    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-8 sm:py-12">
                    <div className="container px-4">
                        <Button asChild variant="ghost" className="mb-6">
                            <Link href="/campaigns">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Campaigns
                            </Link>
                        </Button>

                        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                                {/* Campaign Image */}
                                {campaign.image_url && (
                                    <div className="relative h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden border border-border">
                                        <img
                                            src={campaign.image_url}
                                            alt={campaign.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}

                                {/* Campaign Header */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <Badge variant="default" className="bg-primary/90">
                                            {campaign.status}
                                        </Badge>
                                        {campaign.category && (
                                            <Badge variant="outline">{campaign.category}</Badge>
                                        )}
                                    </div>

                                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                                        {campaign.title}
                                    </h1>

                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            <span>Started {new Date(campaign.start_date).toLocaleDateString()}</span>
                                        </div>
                                        {campaign.end_date && (
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                <span>Ends {new Date(campaign.end_date).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Campaign Description */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>About This Campaign</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-base leading-relaxed whitespace-pre-line">
                                            {campaign.description}
                                        </p>
                                    </CardContent>
                                </Card>

                                {/* Campaign Stats */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <Card>
                                        <CardContent className="pt-6">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                    <DollarSign className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Raised</p>
                                                    <p className="text-2xl font-bold">${campaign.current_amount.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardContent className="pt-6">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                                                    <Users className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Donors</p>
                                                    <p className="text-2xl font-bold">{donationCount}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardContent className="pt-6">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                    <Calendar className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Days Left</p>
                                                    <p className="text-2xl font-bold">
                                                        {daysRemaining !== null ? daysRemaining : "Ongoing"}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>

                            {/* Sidebar - Donation Card */}
                            <div className="space-y-6">
                                <Card className="lg:sticky lg:top-24 border-primary/20 shadow-xl">
                                    <CardContent className="pt-6 space-y-6">
                                        {/* Progress */}
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-baseline">
                                                <div>
                                                    <p className="text-3xl font-bold text-primary">
                                                        ${campaign.current_amount.toLocaleString()}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        raised of ${campaign.goal_amount.toLocaleString()} goal
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold text-accent">{Math.round(progress)}%</p>
                                                    <p className="text-xs text-muted-foreground">funded</p>
                                                </div>
                                            </div>
                                            <Progress value={progress} className="h-3" />
                                        </div>

                                        {/* Stats */}
                                        <div className="grid grid-cols-2 gap-4 py-4 border-y">
                                            <div>
                                                <p className="text-2xl font-bold">{donationCount}</p>
                                                <p className="text-sm text-muted-foreground">Donors</p>
                                            </div>
                                            {daysRemaining !== null && (
                                                <div>
                                                    <p className="text-2xl font-bold">{daysRemaining}</p>
                                                    <p className="text-sm text-muted-foreground">Days to go</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* CTA Buttons */}
                                        <div className="space-y-3">
                                            <Button asChild size="lg" className="w-full shadow-lg">
                                                <Link href="/auth/sign-up">
                                                    <Target className="mr-2 h-5 w-5" />
                                                    Donate Now
                                                </Link>
                                            </Button>
                                            <Button variant="outline" size="lg" className="w-full">
                                                <Share2 className="mr-2 h-5 w-5" />
                                                Share Campaign
                                            </Button>
                                        </div>

                                        {/* Trust Indicators */}
                                        <div className="pt-4 border-t space-y-2 text-sm text-muted-foreground">
                                            <p className="flex items-center gap-2">
                                                <span className="text-green-600">✓</span>
                                                Tax-deductible donations
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <span className="text-green-600">✓</span>
                                                Secure payment processing
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <span className="text-green-600">✓</span>
                                                100% goes to the cause
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <SiteFooter />
        </div>
    )
}
