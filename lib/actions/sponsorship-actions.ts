"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createSponsorship(formData: FormData) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Not authenticated" }
  }

  const sponsorshipData = {
    student_id: formData.get("student_id") as string,
    donor_id: formData.get("donor_id") as string,
    amount: Number.parseFloat(formData.get("amount") as string),
    frequency: formData.get("frequency") as string,
    start_date: formData.get("start_date") as string,
    status: "pending",
  }

  const { error } = await supabase.from("sponsorships").insert(sponsorshipData)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/portal/sponsorship/matches")

  return { success: true }
}

export async function updateSponsorshipStatus(sponsorshipId: string, status: string) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Not authenticated" }
  }

  const { error } = await supabase.from("sponsorships").update({ status }).eq("id", sponsorshipId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/portal/sponsorship/matches")

  return { success: true }
}

export async function createProgressReport(formData: FormData) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Not authenticated" }
  }

  const reportData = {
    sponsorship_id: formData.get("sponsorship_id") as string,
    report_period: formData.get("report_period") as string,
    academic_progress: formData.get("academic_progress") as string,
    attendance_rate: Number.parseFloat(formData.get("attendance_rate") as string),
    behavioral_notes: formData.get("behavioral_notes") as string,
    achievements: JSON.parse((formData.get("achievements") as string) || "[]"),
    challenges: JSON.parse((formData.get("challenges") as string) || "[]"),
    created_by: user.id,
  }

  const { error } = await supabase.from("progress_reports").insert(reportData)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/portal/sponsorship/reports")

  return { success: true }
}
