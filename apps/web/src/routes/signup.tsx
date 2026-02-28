import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { apiFetch } from '../utils/api'
import { useAuth } from '../context/AuthContext'
import { FormInput } from '../components/FormInput'
import { LineLoginButton } from '../components/LineLoginButton'

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
                        <FormInput
                            label="ユーザー名"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Taro Yamada"
                            required
                        />
                        <FormInput
                            label="メールアドレス"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                        />
                        <FormInput
                            label="パスワード"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-[1.02] active:scale-[0.98] ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? '登録中...' : '登録する'}
                        </button>
                    </form>

                    <div className="mt-6 flex items-center">
                        <div className="flex-grow border-t border-gray-200" />
                        <span className="mx-4 text-xs text-gray-400">または</span>
                        <div className="flex-grow border-t border-gray-200" />
                    </div>

                    <LineLoginButton label="LINEで登録" />
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
