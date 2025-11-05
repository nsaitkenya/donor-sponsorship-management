import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PortalLayout } from "@/components/portal-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { GraduationCap, Calendar, DollarSign, FileText } from "lucide-react"

export default async function DonorSponsorshipsPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { data: donor } = await supabase.from("donors").select("*").eq("user_id", user.id).single()

  if (!donor) {
    redirect("/portal/donor")
  }

  const { data: sponsorships } = await supabase
    .from("sponsorships")
    .select(
      `
      *,
      students (
        id,
        student_id,
        first_name,
        last_name,
        grade_level,
        photo_url,
        status
      )
    `,
    )
    .eq("donor_id", donor.id)
    .order("created_at", { ascending: false })

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500",
    matched: "bg-blue-500",
    active: "bg-green-500",
    completed: "bg-gray-500",
    cancelled: "bg-red-500",
  }

  return (
    <PortalLayout userEmail={user.email} userName={profile?.full_name} userRole={profile?.role}>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Sponsorships</h1>
          <p className="text-muted-foreground">View and manage your student sponsorships</p>
        </div>

        {!sponsorships || sponsorships.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <GraduationCap className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Sponsorships Yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                You haven't sponsored any students yet. Start making a difference today!
              </p>
              <Button asChild>
                <Link href="/portal/donor/donate">Sponsor a Student</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {sponsorships.map((sponsorship: any) => (
              <Card key={sponsorship.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                        {sponsorship.students?.first_name?.[0]}
                        {sponsorship.students?.last_name?.[0]}
                      </div>
                      <div>
                        <CardTitle>
                          {sponsorship.students?.first_name} {sponsorship.students?.last_name}
                        </CardTitle>
                        <CardDescription>
                          {sponsorship.students?.student_id} • {sponsorship.students?.grade_level}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={statusColors[sponsorship.status]}>{sponsorship.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>
                        KES {sponsorship.amount.toLocaleString()} / {sponsorship.frequency}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Started: {new Date(sponsorship.start_date).toLocaleDateString()}</span>
                    </div>
                    {sponsorship.notes && <p className="text-sm text-muted-foreground">{sponsorship.notes}</p>}
                    <Button asChild variant="outline" className="w-full bg-transparent">
                      <Link href={`/portal/donor/sponsorships/${sponsorship.id}`}>
                        <FileText className="mr-2 h-4 w-4" />
                        View Progress Reports
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PortalLayout>
  )
}
