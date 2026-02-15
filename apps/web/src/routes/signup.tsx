import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { apiFetch } from '../utils/api'
import { useAuth } from '../context/AuthContext'

export const Route = createFileRoute('/signup')({
    component: Signup,
})

function Signup() {
    const router = useRouter()
    const { checkAuth } = useAuth()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')
        try {
            await apiFetch('/auth/signup', {
                method: 'POST',
                body: JSON.stringify({ name, email, password }),
            })
            await checkAuth()
            router.navigate({ to: '/posts' })
        } catch (err: any) {
            setError(err.message || '登録に失敗しました')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="px-8 py-10">
                    <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-2">アカウント作成</h1>
                    <p className="text-center text-gray-500 mb-8">新しいアカウントを登録してください</p>

                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ユーザー名</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none"
                                placeholder="Taro Yamada"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">パスワード</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-[1.02] active:scale-[0.98] ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? '登録中...' : '登録する'}
                        </button>
                    </form>
                </div>
                <div className="bg-gray-50 px-8 py-4 text-center border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                        すでにアカウントをお持ちですか？{' '}
                        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            ログイン
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
