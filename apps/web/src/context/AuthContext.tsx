import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { apiFetch } from '../utils/api'

type User = {
    id: number
    email: string
    name: string
} | null

type AuthContextType = {
    user: User
    isLoading: boolean
    checkAuth: () => Promise<void>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User>(null)
    const [isLoading, setIsLoading] = useState(true)

    const checkAuth = async () => {
        try {
            const data = await apiFetch('/auth/me')
            setUser(data.user)
        } catch (e) {
            setUser(null)
        } finally {
            setIsLoading(false)
        }
    }

    const logout = async () => {
        try {
            await apiFetch('/auth/logout', { method: 'POST' })
            setUser(null)
        } catch (e) {
            console.error('Logout failed', e)
        }
    }

    useEffect(() => {
        checkAuth()
    }, [])

    return (
        <AuthContext.Provider value={{ user, isLoading, checkAuth, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
