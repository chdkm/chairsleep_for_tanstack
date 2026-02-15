import { createFileRoute, Link } from '@tanstack/react-router'
import { useAuth } from '../context/AuthContext'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const { user } = useAuth()

  return (
    <div className="-mt-8"> {/* Unset Layout padding for full width Hero */}
      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-70" />
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-transparent sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32 pt-20 px-4 sm:px-6 lg:px-8">
            <main className="mt-10 mx-auto max-w-7xl sm:mt-12 md:mt-16 lg:mt-20 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">仮眠方法を</span>{' '}
                  <span className="block text-indigo-600 xl:inline">探してみませんか?</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  最適な睡眠方法を見つけて共有しよう! 椅子を使って色々な寝方を模索し、コミュニティで共有しましょう。
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start gap-3">
                  {user ? (
                    <>
                      <div className="rounded-md shadow">
                        <Link
                          to="/posts"
                          className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg transition-all"
                        >
                          投稿を見る
                        </Link>
                      </div>
                      <div className="mt-3 sm:mt-0 sm:ml-3">
                        <Link
                          to="/posts/new"
                          className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg transition-all"
                        >
                          投稿する
                        </Link>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="rounded-md shadow">
                        <Link
                          to="/signup"
                          className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg transition-all"
                        >
                          新規登録
                        </Link>
                      </div>
                      <div className="mt-3 sm:mt-0 sm:ml-3">
                        <Link
                          to="/login"
                          className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg transition-all"
                        >
                          ログイン
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-gray-200">
          {/* Placeholder for Hero Image */}
          <div className="w-full h-full bg-gradient-to-tr from-blue-200 to-indigo-200 flex items-center justify-center text-indigo-800/20 font-bold text-9xl select-none">
            ZZZ
          </div>
        </div>
      </section>

      {/* Features / Stats Section */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-4">
              <div className="text-4xl font-extrabold text-indigo-600 mb-2">100+</div>
              <div className="text-gray-500 font-medium">投稿数</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-extrabold text-indigo-600 mb-2">500+</div>
              <div className="text-gray-500 font-medium">アイテムレビュー</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-extrabold text-indigo-600 mb-2">1k+</div>
              <div className="text-gray-500 font-medium">ユーザー</div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8">ChairSleepの特徴</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto text-blue-600">
                ✨
              </div>
              <h3 className="text-xl font-bold mb-2">仮眠方法を模索</h3>
              <p className="text-gray-600">椅子を使って色々な寝方を模索。お気に入りの仮眠方法を見つけてみよう！</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto text-green-600">
                🛒
              </div>
              <h3 className="text-xl font-bold mb-2">グッズを登録</h3>
              <p className="text-gray-600">グッズ検索機能を使ってアイテムを共有。投稿後の自身の詳細ページでグッズを登録！</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto text-purple-600">
                🤝
              </div>
              <h3 className="text-xl font-bold mb-2">仮眠方法を共有</h3>
              <p className="text-gray-600">投稿した仮眠方法を共有して睡眠不足を緩和。お気に入りの仮眠方法が見つかったら投稿しよう！</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
