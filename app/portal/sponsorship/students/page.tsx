"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { PortalHeader } from "@/components/portal-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { ArrowLeft, Search, Plus } from "lucide-react"
import type { Student } from "@/lib/types"

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    student_id: "",
    first_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "",
    grade_level: "",
    admission_date: "",
    background_story: "",
  })

  useEffect(() => {
    fetchStudents()
  }, [])

  useEffect(() => {
    filterStudents()
  }, [students, searchTerm])

  const fetchStudents = async () => {
    const supabase = createClient()
    const { data } = await supabase.from("students").select("*").order("created_at", { ascending: false })

    if (data) {
      setStudents(data)
    }
  }

  const filterStudents = () => {
    let filtered = students

    if (searchTerm) {
      filtered = filtered.filter(
        (s) =>
          s.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.student_id.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredStudents(filtered)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()

    const { error } = await supabase.from("students").insert({
      ...formData,
      status: "active",
    })

    if (!error) {
      await fetchStudents()
      setIsDialogOpen(false)
      setFormData({
        student_id: "",
        first_name: "",
        last_name: "",
        date_of_birth: "",
        gender: "",
        grade_level: "",
        admission_date: "",
        background_story: "",
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
              Add Student
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Students</CardTitle>
              <CardDescription>Manage student profiles and information</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or student ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Students Grid */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <Card key={student.id}>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center font-semibold">
                                {student.first_name[0]}
                                {student.last_name[0]}
                              </div>
                              <div>
                                <p className="font-semibold">
                                  {student.first_name} {student.last_name}
                                </p>
                                <p className="text-sm text-muted-foreground">{student.student_id}</p>
                              </div>
                            </div>
                            <Badge variant={student.status === "active" ? "default" : "secondary"}>
                              {student.status}
                            </Badge>
                          </div>
                          <div className="space-y-2 text-sm">
                            <p className="text-muted-foreground">
                              <span className="font-medium">Grade:</span> {student.grade_level || "N/A"}
                            </p>
                            <p className="text-muted-foreground">
                              <span className="font-medium">Gender:</span> {student.gender || "N/A"}
                            </p>
                            {student.background_story && (
                              <p className="text-muted-foreground line-clamp-2">{student.background_story}</p>
                            )}
                          </div>
                          <Button asChild variant="outline" size="sm" className="w-full bg-transparent">
                            <Link href={`/portal/sponsorship/students/${student.id}`}>View Details</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 text-muted-foreground">No students found</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Add Student Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription>Enter the student's information to create their profile</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="student_id">Student ID *</Label>
                  <Input
                    id="student_id"
                    required
                    value={formData.student_id}
                    onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grade_level">Grade Level</Label>
                  <Input
                    id="grade_level"
                    value={formData.grade_level}
                    onChange={(e) => setFormData({ ...formData, grade_level: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name *</Label>
                  <Input
                    id="first_name"
                    required
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name *</Label>
                  <Input
                    id="last_name"
                    required
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => setFormData({ ...formData, gender: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="admission_date">Admission Date</Label>
                <Input
                  id="admission_date"
                  type="date"
                  value={formData.admission_date}
                  onChange={(e) => setFormData({ ...formData, admission_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="background_story">Background Story</Label>
                <Textarea
                  id="background_story"
                  rows={4}
                  value={formData.background_story}
                  onChange={(e) => setFormData({ ...formData, background_story: e.target.value })}
                  placeholder="Share the student's background and why they need sponsorship..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Student"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
