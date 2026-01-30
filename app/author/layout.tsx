import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function AuthorLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    if (!supabase) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-dark-950 p-4">
                <div className="bg-dark-900 border border-dark-800 rounded-lg p-8 max-w-md text-center">
                    <h1 className="text-2xl font-bold text-red-500 mb-4">Configuration Missing</h1>
                    <p className="text-dark-300">
                        Supabase environment variables are not set. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment.
                    </p>
                </div>
            </div>
        )
    }

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Check if user has author or admin role
    const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (!profile || (profile.role !== 'author' && profile.role !== 'admin')) {
        redirect('/')
    }

    return (
        <div className="min-h-screen bg-dark-950">
            <nav className="bg-dark-900 border-b border-dark-800">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-8">
                            <a href="/author" className="text-xl font-bold text-primary-400">
                                ✍️ Author Dashboard
                            </a>
                            <div className="flex items-center space-x-4">
                                <a href="/author" className="text-sm text-dark-300 hover:text-primary-400 transition-colors">
                                    Overview
                                </a>
                                <a href="/author/posts" className="text-sm text-dark-300 hover:text-primary-400 transition-colors">
                                    My Posts
                                </a>
                                <a href="/author/analytics" className="text-sm text-dark-300 hover:text-primary-400 transition-colors">
                                    Analytics
                                </a>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <a href="/" className="text-sm text-dark-400 hover:text-dark-300">
                                ← Back to Blog
                            </a>
                            <a href="/profile" className="text-sm text-dark-300 hover:text-primary-400">
                                Profile
                            </a>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    )
}
