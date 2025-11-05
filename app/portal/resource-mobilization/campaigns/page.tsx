"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { PortalHeader } from "@/components/portal-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { ArrowLeft, Plus, Target } from "lucide-react"
import type { Campaign } from "@/lib/types"

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goal_amount: "",
    start_date: new Date().toISOString().split("T")[0],
    end_date: "",
    category: "",
    status: "draft",
  })

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    const supabase = createClient()
    const { data } = await supabase.from("campaigns").select("*").order("created_at", { ascending: false })

    if (data) {
      setCampaigns(data)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { error } = await supabase.from("campaigns").insert({
      ...formData,
      goal_amount: Number.parseFloat(formData.goal_amount),
      created_by: user?.id,
    })

    if (!error) {
      await fetchCampaigns()
      setIsDialogOpen(false)
      setFormData({
        title: "",
        description: "",
        goal_amount: "",
        start_date: new Date().toISOString().split("T")[0],
        end_date: "",
        category: "",
        status: "draft",
      })
    }

    setIsLoading(false)
  }

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    const supabase = createClient()
    await supabase.from("campaigns").update({ status: newStatus }).eq("id", id)
    await fetchCampaigns()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PortalHeader />

      <main className="flex-1 bg-muted/30">
        <div className="container py-8">
          <div className="flex items-center justify-between mb-6">
            <Button asChild variant="ghost">
              <Link href="/portal/resource-mobilization">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Campaign
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Fundraising Campaigns</CardTitle>
              <CardDescription>Create and manage campaigns to raise funds for specific initiatives</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {campaigns.length > 0 ? (
                  campaigns.map((campaign) => {
                    const progress =
                      campaign.goal_amount > 0 ? (campaign.current_amount / campaign.goal_amount) * 100 : 0
                    return (
                      <Card key={campaign.id}>
                        <CardContent className="pt-6">
                          <div className="space-y-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                  <Target className="h-6 w-6" />
                                </div>
                                <div>
                                  <p className="font-semibold">{campaign.title}</p>
                                  <p className="text-sm text-muted-foreground">{campaign.category || "General"}</p>
                                </div>
                              </div>
                              <Badge
                                variant={
                                  campaign.status === "active"
                                    ? "default"
                                    : campaign.status === "completed"
                                      ? "outline"
                                      : "secondary"
                                }
                              >
                                {campaign.status}
                              </Badge>
                            </div>
                            {campaign.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2">{campaign.description}</p>
                            )}
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-medium">{Math.round(progress)}%</span>
                              </div>
                              <Progress value={progress} />
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                  KES {campaign.current_amount.toLocaleString()}
                                </span>
                                <span className="text-muted-foreground">
                                  Goal: KES {campaign.goal_amount.toLocaleString()}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {campaign.status === "draft" && (
                                <Button size="sm" onClick={() => handleUpdateStatus(campaign.id, "active")}>
                                  Launch
                                </Button>
                              )}
                              {campaign.status === "active" && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleUpdateStatus(campaign.id, "paused")}
                                  >
                                    Pause
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleUpdateStatus(campaign.id, "completed")}
                                  >
                                    Complete
                                  </Button>
                                </>
                              )}
                              {campaign.status === "paused" && (
                                <Button size="sm" onClick={() => handleUpdateStatus(campaign.id, "active")}>
                                  Resume
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })
                ) : (
                  <div className="col-span-full text-center py-12 text-muted-foreground">
                    No campaigns found. Create your first campaign to start fundraising.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Create Campaign Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Campaign</DialogTitle>
            <DialogDescription>Launch a new fundraising campaign for a specific initiative</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Campaign Title *</Label>
                <Input
                  id="title"
                  required
                  placeholder="e.g., New Science Lab Equipment"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  placeholder="Describe the campaign goals and how funds will be used..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="goal_amount">Goal Amount (KES) *</Label>
                  <Input
                    id="goal_amount"
                    type="number"
                    required
                    value={formData.goal_amount}
                    onChange={(e) => setFormData({ ...formData, goal_amount: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    placeholder="e.g., Infrastructure, Scholarships"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date *</Label>
                  <Input
                    id="start_date"
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Initial Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Campaign"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
