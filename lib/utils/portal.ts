export function getPortalPath(role: string): string {
  switch (role) {
    case "admin":
      return "/portal/admin"
    case "finance_officer":
      return "/portal/finance"
    case "sponsorship_officer":
      return "/portal/sponsorship"
    case "resource_mobilization":
      return "/portal/resource-mobilization"
    case "donor":
    default:
      return "/portal/donor"
  }
}

export function getPortalName(role: string): string {
  switch (role) {
    case "admin":
      return "Admin Portal"
    case "finance_officer":
      return "Finance Portal"
    case "sponsorship_officer":
      return "Sponsorship Portal"
    case "resource_mobilization":
      return "Resource Mobilization Portal"
    case "donor":
    default:
      return "Donor Portal"
  }
}
