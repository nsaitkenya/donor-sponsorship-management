"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createStudent(formData: FormData) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Not authenticated" }
  }

  const studentData = {
    student_id: formData.get("student_id") as string,
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    date_of_birth: formData.get("date_of_birth") as string,
    gender: formData.get("gender") as string,
    grade_level: formData.get("grade_level") as string,
    admission_date: formData.get("admission_date") as string,
    background_story: formData.get("background_story") as string,
    status: "active",
  }

  const { error } = await supabase.from("students").insert(studentData)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/portal/sponsorship/students")

  return { success: true }
}

export async function updateStudent(studentId: string, formData: FormData) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Not authenticated" }
  }

  const studentData = {
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    date_of_birth: formData.get("date_of_birth") as string,
    gender: formData.get("gender") as string,
    grade_level: formData.get("grade_level") as string,
    background_story: formData.get("background_story") as string,
    status: formData.get("status") as string,
  }

  const { error } = await supabase.from("students").update(studentData).eq("id", studentId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/portal/sponsorship/students")
  revalidatePath(`/portal/sponsorship/students/${studentId}`)

  return { success: true }
}

export async function deleteStudent(studentId: string) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Not authenticated" }
  }

  // Check if student has active sponsorships
  const { data: sponsorships } = await supabase
    .from("sponsorships")
    .select("id")
    .eq("student_id", studentId)
    .eq("status", "active")

  if (sponsorships && sponsorships.length > 0) {
    return { error: "Cannot delete student with active sponsorships" }
  }

  const { error } = await supabase.from("students").delete().eq("id", studentId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/portal/sponsorship/students")

  return { success: true }
}
