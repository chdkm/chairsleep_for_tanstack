import { createFileRoute, Link } from '@tanstack/react-router'
import { apiFetch } from '../../utils/api'
import type { User } from '../../context/AuthContext'

type Post = {
    id: number
    title: string
    content: string
    image: string | null
    likesCount: number
    createdAt: string
    user: Pick<User & object, 'name'> | null
}

export const Route = createFileRoute('/posts/')({
    loader: async () => {
        const data = await apiFetch('/posts')
        return data as { posts: Post[] }
    },
    component: PostsIndex,
})

function PostsIndex() {
    const { posts } = Route.useLoaderData()

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center border-b border-gray-200 pb-5">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">投稿一覧</h1>
                    <p className="mt-2 text-gray-500">みんなの睡眠環境をチェックしてインスピレーションを得よう。</p>
                </div>
                <Link
                    to="/posts/new"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                >
                    <span className="text-xl leading-none">+</span> 投稿作成
                </Link>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                    <article key={post.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 overflow-hidden flex flex-col h-full">
                        <Link to="/posts/$id" params={{ id: String(post.id) }} className="block relative aspect-video bg-gray-100 overflow-hidden group">
                            <img
                                src={post.image || `https://placehold.co/600x400/e2e8f0/94a3b8?text=${encodeURIComponent(post.title.charAt(0))}`}
                                alt={post.title}
                                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-3 uppercase tracking-wider">
                                Category
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
                                <Link to="/posts/$id" params={{ id: String(post.id) }} className="hover:text-blue-600 transition-colors">
                                    {post.title}
                                </Link>
                            </h2>
                            <p className="text-gray-600 line-clamp-3 mb-4 text-sm flex-1">
                                {post.content}
                            </p>
                            <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50 text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white font-bold text-xs">
                                        {post.user?.name?.charAt(0) || 'U'}
                                    </div>
                                    <span>{post.user?.name || '匿名ユーザー'}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="flex items-center gap-1">
                                        ❤️ {post.likesCount}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </article>
                ))}
                {posts.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-500 text-lg mb-4">まだ投稿がありません。</p>
                        <Link to="/posts/new" className="text-blue-600 font-medium hover:underline">
                            最初の投稿者になりましょう！
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
