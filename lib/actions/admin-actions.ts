"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateUserRole(userId: string, newRole: string) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Not authenticated" }
  }

  // Check if current user is admin
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role !== "admin") {
    return { error: "Unauthorized" }
  }

  const { error } = await supabase.from("profiles").update({ role: newRole }).eq("id", userId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/portal/admin/users")

  return { success: true }
}

export async function updateSystemSettings(formData: FormData) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Not authenticated" }
  }

  const settings = {
    site_name: formData.get("site_name") as string,
    contact_email: formData.get("contact_email") as string,
    contact_phone: formData.get("contact_phone") as string,
    bank_name: formData.get("bank_name") as string,
    bank_account_number: formData.get("bank_account_number") as string,
    bank_account_name: formData.get("bank_account_name") as string,
    mpesa_paybill: formData.get("mpesa_paybill") as string,
    mpesa_account: formData.get("mpesa_account") as string,
  }

  // Check if settings exist
  const { data: existing } = await supabase.from("system_settings").select("id").single()

  if (existing) {
    const { error } = await supabase.from("system_settings").update(settings).eq("id", existing.id)

    if (error) {
      return { error: error.message }
    }
  } else {
    const { error } = await supabase.from("system_settings").insert(settings)

    if (error) {
      return { error: error.message }
    }
  }

  revalidatePath("/portal/admin/settings")

  return { success: true }
}
