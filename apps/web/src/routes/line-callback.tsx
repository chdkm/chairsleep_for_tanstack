import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export const Route = createFileRoute('/line-callback')({
    component: LineCallback,
})

function LineCallback() {
    const router = useRouter()
    const { checkAuth } = useAuth()

    useEffect(() => {
        const handle = async () => {
            await checkAuth()
            router.navigate({ to: '/posts' })
        }
        handle()
    }, [])

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4" />
                <p className="text-gray-600">LINE認証中...</p>
            </div>
        </div>
    )
}
