import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { PortalLayout } from "@/components/portal-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Calendar, TrendingUp } from "lucide-react"

export default async function SponsorshipDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()
  const { data: donor } = await supabase.from("donors").select("*").eq("user_id", user.id).single()

  const { data: sponsorship } = await supabase
    .from("sponsorships")
    .select("*, students(*)")
    .eq("id", params.id)
    .eq("donor_id", donor?.id)
    .single()

  if (!sponsorship) {
    redirect("/portal/donor")
  }

  const { data: progressReports } = await supabase
    .from("progress_reports")
    .select("*")
    .eq("sponsorship_id", sponsorship.id)
    .order("created_at", { ascending: false })

  return (
    <PortalLayout userEmail={user.email} userName={profile?.full_name} userRole={profile?.role}>
      <div className="container py-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/portal/donor/sponsorships">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sponsorships
          </Link>
        </Button>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Student Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="h-32 w-32 mx-auto rounded-full bg-muted mb-4 flex items-center justify-center text-4xl font-bold text-primary">
                  {sponsorship.students?.first_name?.[0]}
                  {sponsorship.students?.last_name?.[0]}
                </div>
                <CardTitle className="text-center">
                  {sponsorship.students?.first_name} {sponsorship.students?.last_name}
                </CardTitle>
                <CardDescription className="text-center">{sponsorship.students?.grade_level}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Sponsorship Amount</p>
                  <p className="text-lg font-semibold">
                    KES {sponsorship.amount.toLocaleString()} / {sponsorship.frequency}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={sponsorship.status === "active" ? "default" : "secondary"}>
                    {sponsorship.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p className="text-sm">{new Date(sponsorship.start_date).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Reports */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Progress Reports</CardTitle>
                <CardDescription>Track your sponsored student's journey</CardDescription>
              </CardHeader>
              <CardContent>
                {progressReports && progressReports.length > 0 ? (
                  <div className="space-y-6">
                    {progressReports.map((report) => (
                      <div key={report.id} className="p-6 border rounded-lg space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <h3 className="font-semibold">{report.report_period}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(report.created_at).toLocaleDateString()}
                          </p>
                        </div>

                        {report.attendance_rate && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <TrendingUp className="h-4 w-4 text-muted-foreground" />
                              <p className="text-sm font-medium">Attendance Rate</p>
                            </div>
                            <p className="text-2xl font-bold">{report.attendance_rate}%</p>
                          </div>
                        )}

                        {report.academic_progress && (
                          <div>
                            <p className="text-sm font-medium mb-2">Academic Progress</p>
                            <p className="text-sm text-muted-foreground">{report.academic_progress}</p>
                          </div>
                        )}

                        {report.behavioral_notes && (
                          <div>
                            <p className="text-sm font-medium mb-2">Behavioral Notes</p>
                            <p className="text-sm text-muted-foreground">{report.behavioral_notes}</p>
                          </div>
                        )}

                        {report.achievements && report.achievements.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-2">Achievements</p>
                            <ul className="list-disc list-inside space-y-1">
                              {report.achievements.map((achievement: string, idx: number) => (
                                <li key={idx} className="text-sm text-muted-foreground">
                                  {achievement}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {report.challenges && report.challenges.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-2">Challenges</p>
                            <ul className="list-disc list-inside space-y-1">
                              {report.challenges.map((challenge: string, idx: number) => (
                                <li key={idx} className="text-sm text-muted-foreground">
                                  {challenge}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No progress reports available yet</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Reports will be shared by the sponsorship office
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PortalLayout>
  )
}
