"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { PortalHeader } from "@/components/portal-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ArrowLeft, Plus, UserCheck } from "lucide-react"
import type { Sponsorship, Student, Donor } from "@/lib/types"

interface SponsorshipWithDetails extends Sponsorship {
  students?: Student
  donors?: Donor & {
    profiles?: {
      full_name: string | null
      email: string
    }
  }
}

export default function MatchesPage() {
  const [sponsorships, setSponsorships] = useState<SponsorshipWithDetails[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [donors, setDonors] = useState<(Donor & { profiles?: { full_name: string | null; email: string } })[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    student_id: "",
    donor_id: "",
    amount: "",
    frequency: "monthly",
    start_date: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const supabase = createClient()

    const { data: sponsorshipsData } = await supabase
      .from("sponsorships")
      .select("*, students(*), donors(*, profiles(full_name, email))")
      .order("created_at", { ascending: false })

    const { data: studentsData } = await supabase.from("students").select("*").eq("status", "active")

    const { data: donorsData } = await supabase.from("donors").select("*, profiles(full_name, email)")

    if (sponsorshipsData) setSponsorships(sponsorshipsData as SponsorshipWithDetails[])
    if (studentsData) setStudents(studentsData)
    if (donorsData) setDonors(donorsData as typeof donors)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()

    const { error } = await supabase.from("sponsorships").insert({
      student_id: formData.student_id,
      donor_id: formData.donor_id,
      amount: Number.parseFloat(formData.amount),
      frequency: formData.frequency,
      start_date: formData.start_date,
      status: "pending",
    })

    if (!error) {
      await fetchData()
      setIsDialogOpen(false)
      setFormData({
        student_id: "",
        donor_id: "",
        amount: "",
        frequency: "monthly",
        start_date: new Date().toISOString().split("T")[0],
      })
    }

    setIsLoading(false)
  }

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    const supabase = createClient()
    await supabase.from("sponsorships").update({ status: newStatus }).eq("id", id)
    await fetchData()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PortalHeader />

      <main className="flex-1 bg-muted/30">
        <div className="container py-8">
          <div className="flex items-center justify-between mb-6">
            <Button asChild variant="ghost">
              <Link href="/portal/sponsorship">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Match
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Sponsorship Matches</CardTitle>
              <CardDescription>Manage student-sponsor relationships</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sponsorships.length > 0 ? (
                  sponsorships.map((sponsorship) => (
                    <div key={sponsorship.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <UserCheck className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="font-semibold">
                              {sponsorship.students?.first_name} {sponsorship.students?.last_name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Sponsored by {sponsorship.donors?.profiles?.full_name || "Unknown"}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            sponsorship.status === "active"
                              ? "default"
                              : sponsorship.status === "pending"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {sponsorship.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Amount</p>
                          <p className="font-medium">KES {sponsorship.amount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Frequency</p>
                          <p className="font-medium capitalize">{sponsorship.frequency}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Start Date</p>
                          <p className="font-medium">{new Date(sponsorship.start_date).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Student Grade</p>
                          <p className="font-medium">{sponsorship.students?.grade_level || "N/A"}</p>
                        </div>
                      </div>
                      {sponsorship.status === "pending" && (
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleUpdateStatus(sponsorship.id, "active")}>
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateStatus(sponsorship.id, "cancelled")}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">No sponsorship matches found</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Create Match Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Sponsorship Match</DialogTitle>
            <DialogDescription>Match a student with a sponsor</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="student_id">Student *</Label>
                <Select
                  value={formData.student_id}
                  onValueChange={(value) => setFormData({ ...formData, student_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.first_name} {student.last_name} - {student.student_id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="donor_id">Donor *</Label>
                <Select
                  value={formData.donor_id}
                  onValueChange={(value) => setFormData({ ...formData, donor_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select donor" />
                  </SelectTrigger>
                  <SelectContent>
                    {donors.map((donor) => (
                      <SelectItem key={donor.id} value={donor.id}>
                        {donor.profiles?.full_name || donor.profiles?.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Sponsorship Amount (KES) *</Label>
                <Input
                  id="amount"
                  type="number"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency *</Label>
                <Select
                  value={formData.frequency}
                  onValueChange={(value) => setFormData({ ...formData, frequency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="annually">Annually</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Match"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
