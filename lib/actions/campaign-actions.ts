"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createCampaign(formData: FormData) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Not authenticated" }
  }

  const campaignData = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    goal_amount: Number.parseFloat(formData.get("goal_amount") as string),
    start_date: formData.get("start_date") as string,
    end_date: formData.get("end_date") as string,
    category: formData.get("category") as string,
    status: "draft",
    current_amount: 0,
    created_by: user.id,
  }

  const { data, error } = await supabase.from("campaigns").insert(campaignData).select().single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/portal/resource-mobilization/campaigns")
  revalidatePath("/campaigns")

  return { success: true, data }
}

export async function updateCampaign(campaignId: string, formData: FormData) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Not authenticated" }
  }

  const campaignData = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    goal_amount: Number.parseFloat(formData.get("goal_amount") as string),
    end_date: formData.get("end_date") as string,
    category: formData.get("category") as string,
  }

  const { error } = await supabase.from("campaigns").update(campaignData).eq("id", campaignId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/portal/resource-mobilization/campaigns")
  revalidatePath("/campaigns")

  return { success: true }
}

export async function updateCampaignStatus(campaignId: string, status: string) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Not authenticated" }
  }

  const { error } = await supabase.from("campaigns").update({ status }).eq("id", campaignId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/portal/resource-mobilization/campaigns")
  revalidatePath("/campaigns")

  return { success: true }
}

export async function deleteCampaign(campaignId: string) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Not authenticated" }
  }

  // Check if campaign has donations
  const { data: donations } = await supabase.from("donations").select("id").eq("campaign_id", campaignId)

  if (donations && donations.length > 0) {
    return { error: "Cannot delete campaign with existing donations" }
  }

  const { error } = await supabase.from("campaigns").delete().eq("id", campaignId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/portal/resource-mobilization/campaigns")
  revalidatePath("/campaigns")

  return { success: true }
}
