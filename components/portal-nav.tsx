"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Heart,
  Receipt,
  Users,
  FileText,
  GraduationCap,
  UserCheck,
  Megaphone,
  BarChart3,
  Settings,
  ClipboardList,
} from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

interface PortalNavProps {
  role: string
}

const navItems: Record<string, NavItem[]> = {
  donor: [
    { title: "Dashboard", href: "/portal/donor", icon: LayoutDashboard },
    { title: "Make Donation", href: "/portal/donor/donate", icon: Heart },
    { title: "My Donations", href: "/portal/donor/donations", icon: Receipt },
    { title: "My Sponsorships", href: "/portal/donor/sponsorships", icon: GraduationCap },
    { title: "Profile", href: "/portal/donor/profile", icon: Users },
  ],
  finance_officer: [
    { title: "Dashboard", href: "/portal/finance", icon: LayoutDashboard },
    { title: "Transactions", href: "/portal/finance/transactions", icon: Receipt },
    { title: "Reports", href: "/portal/finance/reports", icon: BarChart3 },
  ],
  sponsorship_officer: [
    { title: "Dashboard", href: "/portal/sponsorship", icon: LayoutDashboard },
    { title: "Students", href: "/portal/sponsorship/students", icon: GraduationCap },
    { title: "Matches", href: "/portal/sponsorship/matches", icon: UserCheck },
    { title: "Progress Reports", href: "/portal/sponsorship/reports", icon: FileText },
  ],
  resource_mobilization: [
    { title: "Dashboard", href: "/portal/resource-mobilization", icon: LayoutDashboard },
    { title: "Campaigns", href: "/portal/resource-mobilization/campaigns", icon: Megaphone },
    { title: "Donors", href: "/portal/resource-mobilization/donors", icon: Users },
    { title: "Analytics", href: "/portal/resource-mobilization/analytics", icon: BarChart3 },
  ],
  admin: [
    { title: "Dashboard", href: "/portal/admin", icon: LayoutDashboard },
    { title: "Users", href: "/portal/admin/users", icon: Users },
    { title: "Settings", href: "/portal/admin/settings", icon: Settings },
    { title: "Audit Logs", href: "/portal/admin/audit", icon: ClipboardList },
  ],
}

const portalTitles: Record<string, string> = {
  donor: "Donor Portal",
  finance_officer: "Finance Portal",
  sponsorship_officer: "Sponsorship Portal",
  resource_mobilization: "Resource Mobilization",
  admin: "Admin Portal",
}

export function PortalNav({ role }: PortalNavProps) {
  const pathname = usePathname()
  const items = navItems[role] || navItems.donor

  return (
    <nav className="flex flex-col gap-2 p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground">{portalTitles[role] || "Portal"}</h2>
      </div>
      {items.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
}
