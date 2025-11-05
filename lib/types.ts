export type UserRole = "donor" | "finance_officer" | "sponsorship_officer" | "resource_mobilization" | "admin"
export type DonorType = "individual" | "corporate" | "foundation" | "government" | "other"
export type PaymentMethod = "mpesa" | "card" | "paypal" | "bank_transfer" | "check" | "cash"
export type PaymentStatus = "pending" | "processing" | "completed" | "failed" | "refunded"
export type DonationType = "one_time" | "recurring" | "sponsorship" | "campaign"
export type CampaignStatus = "draft" | "active" | "paused" | "completed" | "cancelled"
export type StudentStatus = "active" | "graduated" | "withdrawn" | "suspended"
export type MatchingStatus = "pending" | "matched" | "active" | "completed" | "cancelled"

export interface Profile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  role: UserRole
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Donor {
  id: string
  user_id: string
  donor_type: DonorType
  organization_name: string | null
  tax_id: string | null
  address: string | null
  city: string | null
  country: string
  postal_code: string | null
  preferred_contact_method: string | null
  communication_preferences: {
    email: boolean
    sms: boolean
    phone: boolean
  }
  total_donated: number
  donation_count: number
  first_donation_date: string | null
  last_donation_date: string | null
  is_anonymous: boolean
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Student {
  id: string
  student_id: string
  first_name: string
  last_name: string
  date_of_birth: string | null
  gender: string | null
  grade_level: string | null
  admission_date: string | null
  status: StudentStatus
  photo_url: string | null
  background_story: string | null
  academic_performance: any
  interests: string[]
  needs_assessment: any
  created_at: string
  updated_at: string
}

export interface Campaign {
  id: string
  title: string
  description: string | null
  goal_amount: number
  current_amount: number
  start_date: string
  end_date: string | null
  status: CampaignStatus
  category: string | null
  image_url: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface Donation {
  id: string
  donor_id: string | null
  amount: number
  currency: string
  donation_type: DonationType
  payment_method: PaymentMethod
  payment_status: PaymentStatus
  transaction_reference: string | null
  campaign_id: string | null
  is_anonymous: boolean
  message: string | null
  receipt_url: string | null
  tax_deductible: boolean
  processed_at: string | null
  created_at: string
  updated_at: string
}

export interface Sponsorship {
  id: string
  student_id: string
  donor_id: string
  amount: number
  frequency: string
  start_date: string
  end_date: string | null
  status: MatchingStatus
  notes: string | null
  created_at: string
  updated_at: string
}

export interface ProgressReport {
  id: string
  sponsorship_id: string
  report_period: string
  academic_progress: string | null
  attendance_rate: number | null
  behavioral_notes: string | null
  achievements: string[]
  challenges: string[]
  photos: any
  created_by: string | null
  created_at: string
  updated_at: string
}
