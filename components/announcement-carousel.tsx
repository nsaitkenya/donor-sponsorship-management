"use client"

import { useState, useEffect } from "react"
import { Sparkles } from "lucide-react"

interface Campaign {
    id: string
    title: string
    description: string
    goal_amount: number
    current_amount: number
    category?: string
    status: string
    brief_details?: string
}

interface AnnouncementCarouselProps {
    campaigns: Campaign[]
}

export function AnnouncementCarousel({ campaigns }: AnnouncementCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        if (campaigns.length <= 1) return
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % campaigns.length)
        }, 8000)
        return () => clearInterval(interval)
    }, [campaigns.length])

    if (campaigns.length === 0) {
        return null
    }

    const currentCampaign = campaigns[currentIndex]
    const progress =
        currentCampaign.goal_amount > 0
            ? Math.min((currentCampaign.current_amount / currentCampaign.goal_amount) * 100, 100)
            : 0

    return (
        <div className="relative overflow-hidden bg-primary text-primary-foreground py-2 sm:py-2.5 border-b border-primary/20 w-full">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />

            <div className="relative w-full">
                <div className="ticker-wrapper">
                    <div className="ticker-content text-xs sm:text-sm">
                        <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 shrink-0 animate-pulse" />
                        <span className="font-semibold">⭐ Featured:</span>
                        <span className="font-bold">{currentCampaign.title}</span>
                        <span className="opacity-90 hidden sm:inline">•</span>
                        <span className="hidden sm:inline">{currentCampaign.brief_details || currentCampaign.description}</span>
                        <span className="opacity-90">•</span>
                        <span className="font-semibold">
                            ${currentCampaign.current_amount.toLocaleString()} <span className="hidden sm:inline">raised of ${currentCampaign.goal_amount.toLocaleString()}</span> ({Math.round(progress)}%)
                        </span>
                        <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 shrink-0 animate-pulse" style={{ animationDelay: '0.5s' }} />

                        {/* Duplicate for seamless loop */}
                        <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 shrink-0 animate-pulse ml-8" />
                        <span className="font-semibold">⭐ Featured:</span>
                        <span className="font-bold">{currentCampaign.title}</span>
                        <span className="opacity-90 hidden sm:inline">•</span>
                        <span className="hidden sm:inline">{currentCampaign.brief_details || currentCampaign.description}</span>
                        <span className="opacity-90">•</span>
                        <span className="font-semibold">
                            ${currentCampaign.current_amount.toLocaleString()} <span className="hidden sm:inline">raised of ${currentCampaign.goal_amount.toLocaleString()}</span> ({Math.round(progress)}%)
                        </span>
                        <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 shrink-0 animate-pulse" style={{ animationDelay: '0.5s' }} />
                    </div>
                </div>
            </div>
        </div>
    )
}
