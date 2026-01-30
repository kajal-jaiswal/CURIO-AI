// Mock authentication for development without Supabase
export const MOCK_USERS = [
    {
        id: 'user-1',
        email: 'user@demo.com',
        password: 'password',
        full_name: 'Demo User',
        role: 'user' as const,
        avatar_url: null,
        bio: 'Regular user account for testing',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_active: true,
    },
    {
        id: 'author-1',
        email: 'author@demo.com',
        password: 'password',
        full_name: 'Demo Author',
        role: 'author' as const,
        avatar_url: null,
        bio: 'Content creator and blogger',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_active: true,
    },
    {
        id: 'admin-1',
        email: 'admin@curioai.com',
        password: 'password',
        full_name: 'Admin User',
        role: 'admin' as const,
        avatar_url: null,
        bio: 'Platform administrator',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_active: true,
    },
]

export const MOCK_AUTH_ENABLED = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder') ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL

// Store mock session in localStorage
export function setMockSession(user: typeof MOCK_USERS[0]) {
    if (typeof window !== 'undefined') {
        localStorage.setItem('mock_user', JSON.stringify(user))
    }
}

export function getMockSession() {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('mock_user')
        return stored ? JSON.parse(stored) : null
    }
    return null
}

export function clearMockSession() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('mock_user')
    }
}

export function mockSignup(email: string, password: string, fullName: string, role: 'user' | 'author') {
    // Check if user already exists
    const exists = MOCK_USERS.find(u => u.email === email)
    if (exists) {
        throw new Error('User already exists')
    }

    // Create new mock user
    const newUser = {
        id: `user-${Date.now()}`,
        email,
        password,
        full_name: fullName,
        role,
        avatar_url: null,
        bio: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_active: true,
    }

    // Add to mock users (in real app, this would be in database)
    MOCK_USERS.push(newUser)

    // Set session
    setMockSession(newUser)

    return newUser
}

export function mockLogin(email: string, password: string) {
    const user = MOCK_USERS.find(u => u.email === email && u.password === password)

    if (!user) {
        throw new Error('Invalid email or password')
    }

    setMockSession(user)
    return user
}

export function mockLogout() {
    clearMockSession()
}
