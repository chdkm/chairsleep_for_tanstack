import { Link, Outlet, useRouter } from '@tanstack/react-router'
import { useAuth } from '../context/AuthContext'

export function Layout({ children }: { children?: React.ReactNode }) {
    const { user, logout } = useAuth()
    const router = useRouter()

    const handleLogout = async () => {
        await logout()
        router.navigate({ to: '/' })
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans">
            <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-gray-200/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                                ChairSleep
                            </Link>
                        </div>
                        <nav className="flex items-center space-x-4 sm:space-x-8">
                            <Link to="/posts" className="text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-md text-sm font-medium">
                                投稿一覧
                            </Link>
                            {user ? (
                                <>
                                    <Link to="/posts/new" className="bg-blue-600 text-white hover:bg-blue-700 transition-colors px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                                        投稿作成
                                    </Link>
                                    <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
                                        <span>{user.name}</span>
                                    </div>
                                    <button onClick={handleLogout} className="text-gray-700 hover:text-red-600 transition-colors px-3 py-2 rounded-md text-sm font-medium">
                                        ログアウト
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-md text-sm font-medium">
                                        ログイン
                                    </Link>
                                    <Link to="/signup" className="hidden sm:inline-flex bg-gray-900 text-white hover:bg-gray-800 transition-colors px-4 py-2 rounded-md text-sm font-medium">
                                        新規登録
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </div>
            </header>
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children || <Outlet />}
            </main>
            <footer className="bg-white border-t border-gray-200 mt-auto">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} ChairSleep. All rights reserved.
                </div>
            </footer>
        </div>
    )
}
