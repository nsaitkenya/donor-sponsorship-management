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
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { ArrowLeft, Plus, FileText } from "lucide-react"
import type { ProgressReport, Sponsorship } from "@/lib/types"

interface ProgressReportWithDetails extends ProgressReport {
  sponsorships?: Sponsorship & {
    students?: {
      first_name: string
      last_name: string
      student_id: string
    }
  }
}

export default function ReportsPage() {
  const [reports, setReports] = useState<ProgressReportWithDetails[]>([])
  const [sponsorships, setSponsorships] = useState<
    (Sponsorship & { students?: { first_name: string; last_name: string; student_id: string } })[]
  >([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    sponsorship_id: "",
    report_period: "",
    academic_progress: "",
    attendance_rate: "",
    behavioral_notes: "",
    achievements: "",
    challenges: "",
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const supabase = createClient()

    const { data: reportsData } = await supabase
      .from("progress_reports")
      .select("*, sponsorships(*, students(first_name, last_name, student_id))")
      .order("created_at", { ascending: false })

    const { data: sponsorshipsData } = await supabase
      .from("sponsorships")
      .select("*, students(first_name, last_name, student_id)")
      .eq("status", "active")

    if (reportsData) setReports(reportsData as ProgressReportWithDetails[])
    if (sponsorshipsData) setSponsorships(sponsorshipsData as typeof sponsorships)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { error } = await supabase.from("progress_reports").insert({
      sponsorship_id: formData.sponsorship_id,
      report_period: formData.report_period,
      academic_progress: formData.academic_progress,
      attendance_rate: formData.attendance_rate ? Number.parseFloat(formData.attendance_rate) : null,
      behavioral_notes: formData.behavioral_notes,
      achievements: formData.achievements ? formData.achievements.split(",").map((a) => a.trim()) : [],
      challenges: formData.challenges ? formData.challenges.split(",").map((c) => c.trim()) : [],
      created_by: user?.id,
    })

    if (!error) {
      await fetchData()
      setIsDialogOpen(false)
      setFormData({
        sponsorship_id: "",
        report_period: "",
        academic_progress: "",
        attendance_rate: "",
        behavioral_notes: "",
        achievements: "",
        challenges: "",
      })
    }

    setIsLoading(false)
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
              Create Report
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Progress Reports</CardTitle>
              <CardDescription>Track and share student academic progress with sponsors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.length > 0 ? (
                  reports.map((report) => (
                    <div key={report.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <FileText className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="font-semibold">
                              {report.sponsorships?.students?.first_name} {report.sponsorships?.students?.last_name}
                            </p>
                            <p className="text-sm text-muted-foreground">{report.report_period}</p>
                          </div>
                        </div>
                        <Badge variant="outline">{new Date(report.created_at).toLocaleDateString()}</Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        {report.academic_progress && (
                          <div>
                            <p className="font-medium">Academic Progress:</p>
                            <p className="text-muted-foreground">{report.academic_progress}</p>
                          </div>
                        )}
                        {report.attendance_rate !== null && (
                          <div>
                            <p className="font-medium">Attendance Rate:</p>
                            <p className="text-muted-foreground">{report.attendance_rate}%</p>
                          </div>
                        )}
                        {report.achievements && report.achievements.length > 0 && (
                          <div>
                            <p className="font-medium">Achievements:</p>
                            <ul className="list-disc list-inside text-muted-foreground">
                              {report.achievements.map((achievement, idx) => (
                                <li key={idx}>{achievement}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {report.challenges && report.challenges.length > 0 && (
                          <div>
                            <p className="font-medium">Challenges:</p>
                            <ul className="list-disc list-inside text-muted-foreground">
                              {report.challenges.map((challenge, idx) => (
                                <li key={idx}>{challenge}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">No progress reports found</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Create Report Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Progress Report</DialogTitle>
            <DialogDescription>Document student progress for sponsors</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="sponsorship_id">Student Sponsorship *</Label>
                <Select
                  value={formData.sponsorship_id}
                  onValueChange={(value) => setFormData({ ...formData, sponsorship_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sponsorship" />
                  </SelectTrigger>
                  <SelectContent>
                    {sponsorships.map((sponsorship) => (
                      <SelectItem key={sponsorship.id} value={sponsorship.id}>
                        {sponsorship.students?.first_name} {sponsorship.students?.last_name} -{" "}
                        {sponsorship.students?.student_id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="report_period">Report Period *</Label>
                <Input
                  id="report_period"
                  placeholder="e.g., Q1 2024, Term 1, January 2024"
                  required
                  value={formData.report_period}
                  onChange={(e) => setFormData({ ...formData, report_period: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="academic_progress">Academic Progress</Label>
                <Textarea
                  id="academic_progress"
                  rows={3}
                  placeholder="Describe the student's academic performance..."
                  value={formData.academic_progress}
                  onChange={(e) => setFormData({ ...formData, academic_progress: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="attendance_rate">Attendance Rate (%)</Label>
                <Input
                  id="attendance_rate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.attendance_rate}
                  onChange={(e) => setFormData({ ...formData, attendance_rate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="behavioral_notes">Behavioral Notes</Label>
                <Textarea
                  id="behavioral_notes"
                  rows={3}
                  placeholder="Note any behavioral observations..."
                  value={formData.behavioral_notes}
                  onChange={(e) => setFormData({ ...formData, behavioral_notes: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="achievements">Achievements (comma-separated)</Label>
                <Textarea
                  id="achievements"
                  rows={2}
                  placeholder="e.g., Won science competition, Improved math grade, Leadership role"
                  value={formData.achievements}
                  onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="challenges">Challenges (comma-separated)</Label>
                <Textarea
                  id="challenges"
                  rows={2}
                  placeholder="e.g., Struggling with physics, Needs extra tutoring"
                  value={formData.challenges}
                  onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Report"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
