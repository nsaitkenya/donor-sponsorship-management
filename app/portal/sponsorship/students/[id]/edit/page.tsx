import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PortalHeader } from "@/components/portal-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { updateStudent, deleteStudent } from "@/lib/actions/student-actions"

export default async function EditStudentPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (profile?.role !== "sponsorship_officer" && profile?.role !== "admin") {
    redirect("/portal/donor")
  }

  const { data: student } = await supabase.from("students").select("*").eq("id", params.id).single()

  if (!student) {
    redirect("/portal/sponsorship/students")
  }

  const updateStudentWithId = updateStudent.bind(null, student.id)
  const deleteStudentWithId = deleteStudent.bind(null, student.id)

  return (
    <div className="flex min-h-screen flex-col">
      <PortalHeader userEmail={user.email} userName={profile?.full_name || undefined} />

      <main className="flex-1 bg-muted/30">
        <div className="container py-8 max-w-3xl">
          <Button asChild variant="ghost" className="mb-6">
            <Link href={`/portal/sponsorship/students/${student.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Student
            </Link>
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Edit Student</CardTitle>
              <CardDescription>Update student information</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={updateStudentWithId} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input id="first_name" name="first_name" defaultValue={student.first_name} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input id="last_name" name="last_name" defaultValue={student.last_name} required />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                    <Input
                      id="date_of_birth"
                      name="date_of_birth"
                      type="date"
                      defaultValue={student.date_of_birth || ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select name="gender" defaultValue={student.gender || ""}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="grade_level">Grade Level</Label>
                    <Input id="grade_level" name="grade_level" defaultValue={student.grade_level || ""} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select name="status" defaultValue={student.status}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="graduated">Graduated</SelectItem>
                        <SelectItem value="withdrawn">Withdrawn</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="background_story">Background Story</Label>
                  <Textarea
                    id="background_story"
                    name="background_story"
                    defaultValue={student.background_story || ""}
                    rows={6}
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="flex-1">
                    Save Changes
                  </Button>
                  <Button type="button" variant="destructive" formAction={deleteStudentWithId} className="flex-1">
                    Delete Student
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
