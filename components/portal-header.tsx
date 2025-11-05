"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { User, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { PortalNav } from "./portal-nav"

interface PortalHeaderProps {
  userEmail?: string
  userName?: string
  userRole?: string
}

const portalTitles: Record<string, string> = {
  donor: "Donor Portal",
  finance_officer: "Finance Portal",
  sponsorship_officer: "Sponsorship Portal",
  resource_mobilization: "Resource Mobilization",
  admin: "Admin Portal",
}

export function PortalHeader({ userEmail, userName, userRole = "donor" }: PortalHeaderProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const initials =
    userName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U"

  const portalTitle = portalTitles[userRole] || "Portal"

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex h-16 items-center gap-2 border-b px-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
                  SBC
                </div>
                <span className="font-semibold">{portalTitle}</span>
              </div>
              <PortalNav role={userRole} />
            </SheetContent>
          </Sheet>

          <Link
            href={`/portal/${userRole === "finance_officer" ? "finance" : userRole === "sponsorship_officer" ? "sponsorship" : userRole === "resource_mobilization" ? "resource-mobilization" : userRole === "admin" ? "admin" : "donor"}`}
            className="flex items-center gap-2"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
              SBC
            </div>
            <span className="font-semibold text-lg hidden sm:inline-block">{portalTitle}</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar>
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userName || "User"}</p>
                  <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
                  <p className="text-xs leading-none text-muted-foreground capitalize">
                    {userRole?.replace(/_/g, " ")}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {userRole === "donor" && (
                <DropdownMenuItem asChild>
                  <Link href="/portal/donor/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
