import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { apiFetch } from '../../utils/api'

type Item = {
    id: number
    name: string
    price: number
    imageUrl: string | null
    rakutenItemId: string | null
}

type Post = {
    id: number
    title: string
    content: string
    createdAt: string
    user: { name: string } | null
    items: Item[]
}

export const Route = createFileRoute('/posts/$id')({
    loader: async ({ params }) => {
        const data = await apiFetch(`/posts/${params.id}`) as { post: Post | null }
        if (!data.post) throw notFound()
        return { post: data.post as Post }
    },
    component: PostDetail,
})

function PostDetail() {
    const { post } = Route.useLoaderData()

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
                <Link to="/posts" className="hover:text-blue-600 transition-colors flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    投稿一覧へ戻る
                </Link>
                <span>/</span>
                <span className="truncate max-w-[200px]">{post.title}</span>
            </div>

            <article className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                {/* Hero Image */}
                <div className="h-64 sm:h-80 bg-gray-100 relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20 opacity-20">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                    </div>
                </div>

                <div className="p-8 sm:p-10">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                                {post.user?.name?.charAt(0) || 'U'}
                            </div>
                            <span>{post.user?.name}</span>
                        </div>
                        <span>•</span>
                        <span>{new Date(post.createdAt).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>

                    <div className="prose prose-lg prose-blue max-w-none text-gray-600 leading-relaxed">
                        <p className="whitespace-pre-wrap">{post.content}</p>
                    </div>
                </div>
            </article>

            <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span>登録アイテム</span>
                    <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{post.items?.length || 0}</span>
                </h2>

                {(!post.items || post.items.length === 0) ? (
                    <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400">
                        登録されたアイテムはありません。
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {post.items.map((item) => (
                            <div key={item.id} className="bg-white border border-gray-100 rounded-xl p-4 flex gap-4 hover:shadow-md transition-shadow">
                                <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0">
                                    {/* Item Image placeholder */}
                                </div>
                                <div className="flex flex-col justify-center">
                                    <h3 className="font-bold text-gray-900 line-clamp-2 text-sm">{item.name}</h3>
                                    <p className="text-blue-600 font-bold mt-1">¥{item.price.toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
