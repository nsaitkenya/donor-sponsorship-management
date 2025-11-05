import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PortalHeader } from "@/components/portal-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Calendar, GraduationCap, User } from "lucide-react"

export default async function StudentDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Check if user has access
  if (profile?.role !== "sponsorship_officer" && profile?.role !== "admin") {
    redirect("/portal/donor")
  }

  const { data: student } = await supabase.from("students").select("*").eq("id", params.id).single()

  if (!student) {
    redirect("/portal/sponsorship/students")
  }

  const { data: sponsorships } = await supabase
    .from("sponsorships")
    .select("*, donors(*, profiles(full_name, email))")
    .eq("student_id", student.id)

  const { data: progressReports } = await supabase
    .from("progress_reports")
    .select("*")
    .in("sponsorship_id", sponsorships?.map((s) => s.id) || [])
    .order("created_at", { ascending: false })

  return (
    <div className="flex min-h-screen flex-col">
      <PortalHeader userEmail={user.email} userName={profile?.full_name || undefined} />

      <main className="flex-1 bg-muted/30">
        <div className="container py-8">
          <Button asChild variant="ghost" className="mb-6">
            <Link href="/portal/sponsorship/students">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Students
            </Link>
          </Button>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Student Info */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <div>
                      <CardTitle>
                        {student.first_name} {student.last_name}
                      </CardTitle>
                      <CardDescription>ID: {student.student_id}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{student.grade_level}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Born: {student.date_of_birth ? new Date(student.date_of_birth).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                  <div>
                    <Badge variant={student.status === "active" ? "default" : "secondary"}>{student.status}</Badge>
                  </div>
                  <div className="pt-4">
                    <Button asChild variant="outline" className="w-full bg-transparent">
                      <Link href={`/portal/sponsorship/students/${student.id}/edit`}>Edit Student</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Background Story */}
              <Card>
                <CardHeader>
                  <CardTitle>Background Story</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {student.background_story || "No background story available."}
                  </p>
                </CardContent>
              </Card>

              {/* Sponsorships */}
              <Card>
                <CardHeader>
                  <CardTitle>Sponsorships</CardTitle>
                  <CardDescription>Current and past sponsors</CardDescription>
                </CardHeader>
                <CardContent>
                  {sponsorships && sponsorships.length > 0 ? (
                    <div className="space-y-4">
                      {sponsorships.map((sponsorship) => (
                        <div key={sponsorship.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-semibold">{sponsorship.donors?.profiles?.full_name || "Anonymous"}</p>
                            <Badge variant={sponsorship.status === "active" ? "default" : "secondary"}>
                              {sponsorship.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            KES {sponsorship.amount.toLocaleString()} / {sponsorship.frequency}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Started: {new Date(sponsorship.start_date).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No sponsorships yet</p>
                  )}
                </CardContent>
              </Card>

              {/* Progress Reports */}
              <Card>
                <CardHeader>
                  <CardTitle>Progress Reports</CardTitle>
                  <CardDescription>Academic and behavioral updates</CardDescription>
                </CardHeader>
                <CardContent>
                  {progressReports && progressReports.length > 0 ? (
                    <div className="space-y-4">
                      {progressReports.map((report) => (
                        <div key={report.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-semibold">{report.report_period}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(report.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          {report.attendance_rate && <p className="text-sm">Attendance: {report.attendance_rate}%</p>}
                          {report.academic_progress && (
                            <p className="text-sm text-muted-foreground mt-2">{report.academic_progress}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No progress reports yet</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
