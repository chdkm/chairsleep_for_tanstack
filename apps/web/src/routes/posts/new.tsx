import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { apiFetch } from '../../utils/api'

export const Route = createFileRoute('/posts/new')({
    component: CreatePost,
})

function CreatePost() {
    const router = useRouter()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')
        try {
            await apiFetch('/posts', {
                method: 'POST',
                body: JSON.stringify({ title, content }),
            })
            router.navigate({ to: '/posts' })
        } catch (err: any) {
            setError(err.message || '投稿に失敗しました。ログインしているか確認してください。')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">新規投稿</h1>
                <p className="text-gray-500 mt-2">あなたの睡眠環境やチップスをシェアしましょう。</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">タイトル</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none text-lg"
                            placeholder="例: 私の最強の椅子寝スタイル"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">内容</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none h-64 resize-y"
                            placeholder="セットアップの詳細や感想を書いてください..."
                            required
                        />
                    </div>

                    <div className="pt-4 border-t border-gray-50 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => router.history.back()}
                            className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                            キャンセル
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`bg-blue-600 text-white px-8 py-2.5 rounded-lg font-medium hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? '投稿中...' : '投稿する'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
