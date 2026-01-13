"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { Target, TrendingUp, Calendar } from "lucide-react"

interface Campaign {
    id: string
    title: string
    description: string
    goal_amount: number
    current_amount: number
    category?: string
    status: string
    brief_details?: string
    image_url?: string
}

interface FeaturedCampaignProps {
    campaign: Campaign
}

export function FeaturedCampaign({ campaign }: FeaturedCampaignProps) {
    const progress =
        campaign.goal_amount > 0
            ? Math.min((campaign.current_amount / campaign.goal_amount) * 100, 100)
            : 0

    return (
        <section className="py-12 md:py-16 bg-gradient-to-b from-primary/5 to-background w-full">
            <div className="container px-4 w-full">
                <div className="w-full">
                    <div className="text-center mb-8">
                        <Badge className="mb-4 bg-primary/90 text-primary-foreground px-4 py-1.5">
                            ⭐ Featured Campaign
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold mb-3">{campaign.title}</h2>
                        {campaign.category && (
                            <Badge variant="outline" className="text-sm">
                                {campaign.category}
                            </Badge>
                        )}
                    </div>

                    <Card className="border-primary/20 shadow-xl overflow-hidden">
                        <CardContent className="p-0">
                            <div className="grid md:grid-cols-2 gap-0">
                                {campaign.image_url && (
                                    <div className="relative h-64 md:h-full bg-gradient-to-br from-primary/10 to-accent/10">
                                        <img
                                            src={campaign.image_url}
                                            alt={campaign.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}

                                <div className={`p-6 md:p-8 ${!campaign.image_url ? 'md:col-span-2' : ''}`}>
                                    <p className="text-base md:text-lg text-muted-foreground mb-6 leading-relaxed">
                                        {campaign.brief_details || campaign.description}
                                    </p>

                                    <div className="space-y-6">
                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-medium text-muted-foreground">Campaign Progress</span>
                                                <span className="text-sm font-bold text-primary">{Math.round(progress)}%</span>
                                            </div>
                                            <Progress value={progress} className="h-3" />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/10">
                                                <Target className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                                                <div>
                                                    <div className="text-xs text-muted-foreground mb-1">Goal</div>
                                                    <div className="text-xl font-bold text-primary">
                                                        ${campaign.goal_amount.toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3 p-4 rounded-lg bg-accent/5 border border-accent/10">
                                                <TrendingUp className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                                                <div>
                                                    <div className="text-xs text-muted-foreground mb-1">Raised</div>
                                                    <div className="text-xl font-bold text-accent">
                                                        ${campaign.current_amount.toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                            <Button size="lg" asChild className="flex-1 shadow-lg">
                                                <Link href="/auth/sign-up">
                                                    Donate Now
                                                </Link>
                                            </Button>
                                            <Button size="lg" variant="outline" asChild className="flex-1">
                                                <Link href="/campaigns">
                                                    Learn More
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}
