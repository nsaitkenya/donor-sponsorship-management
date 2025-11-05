"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateDonorProfile(formData: FormData) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Not authenticated" }
  }

  const full_name = formData.get("full_name") as string
  const phone = formData.get("phone") as string
  const address = formData.get("address") as string
  const city = formData.get("city") as string
  const country = formData.get("country") as string
  const postalCode = formData.get("postal_code") as string
  const organizationName = formData.get("organization_name") as string

  // Update profile
  const { error: profileError } = await supabase.from("profiles").update({ full_name, phone }).eq("id", user.id)

  if (profileError) {
    return { error: profileError.message }
  }

  // Update donor info
  const { error: donorError } = await supabase
    .from("donors")
    .update({
      address,
      city,
      country,
      postal_code: postalCode,
      organization_name: organizationName,
    })
    .eq("user_id", user.id)

  if (donorError) {
    return { error: donorError.message }
  }

  revalidatePath("/portal/donor")
  revalidatePath("/portal/donor/profile")

  return { success: true }
}

export async function updateDonationStatus(donationId: string, status: string) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Not authenticated" }
  }

  const { error } = await supabase
    .from("donations")
    .update({
      payment_status: status,
      processed_at: status === "completed" ? new Date().toISOString() : null,
    })
    .eq("id", donationId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/portal/finance/transactions")

  return { success: true }
}
