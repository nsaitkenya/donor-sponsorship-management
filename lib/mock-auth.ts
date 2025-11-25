// Mock authentication for development - bypasses Supabase
// Remove this file when you're ready to use real auth

export const MOCK_USERS = {
    'donor@starehe.ac.ke': {
        id: 'mock-donor-id',
        email: 'donor@starehe.ac.ke',
        role: 'donor',
        full_name: 'Demo Donor',
        profile: {
            id: 'mock-donor-id',
            email: 'donor@starehe.ac.ke',
            full_name: 'Demo Donor',
            role: 'donor',
        },
        donor: {
            id: 'mock-donor-record-id',
            user_id: 'mock-donor-id',
            total_donated: 25000,
            donation_count: 8,
        }
    },
    'finance@starehe.ac.ke': {
        id: 'mock-finance-id',
        email: 'finance@starehe.ac.ke',
        role: 'finance_officer',
        full_name: 'Finance Officer',
        profile: {
            id: 'mock-finance-id',
            email: 'finance@starehe.ac.ke',
            full_name: 'Finance Officer',
            role: 'finance_officer',
        }
    },
    'sponsorship@starehe.ac.ke': {
        id: 'mock-sponsorship-id',
        email: 'sponsorship@starehe.ac.ke',
        role: 'sponsorship_officer',
        full_name: 'Sponsorship Officer',
        profile: {
            id: 'mock-sponsorship-id',
            email: 'sponsorship@starehe.ac.ke',
            full_name: 'Sponsorship Officer',
            role: 'sponsorship_officer',
        }
    },
    'resource@starehe.ac.ke': {
        id: 'mock-resource-id',
        email: 'resource@starehe.ac.ke',
        role: 'resource_mobilization',
        full_name: 'Resource Mobilization',
        profile: {
            id: 'mock-resource-id',
            email: 'resource@starehe.ac.ke',
            full_name: 'Resource Mobilization',
            role: 'resource_mobilization',
        }
    },
    'admin@starehe.ac.ke': {
        id: 'mock-admin-id',
        email: 'admin@starehe.ac.ke',
        role: 'admin',
        full_name: 'Admin User',
        profile: {
            id: 'mock-admin-id',
            email: 'admin@starehe.ac.ke',
            full_name: 'Admin User',
            role: 'admin',
        }
    }
} as const

// Store current mock user in localStorage
export function setMockUser(email: string) {
    if (typeof window === 'undefined') return
    const user = MOCK_USERS[email as keyof typeof MOCK_USERS]
    if (user) {
        localStorage.setItem('mock_user', JSON.stringify(user))
    }
}

export function getMockUser() {
    if (typeof window === 'undefined') return null
    const stored = localStorage.getItem('mock_user')
    return stored ? JSON.parse(stored) : null
}

export function clearMockUser() {
    if (typeof window === 'undefined') return
    localStorage.removeItem('mock_user')
}

export function isMockAuthEnabled() {
    // Set to true to enable mock auth, false to use real Supabase
    return true
}
