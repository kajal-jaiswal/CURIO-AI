import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getCategories, getTags } from '@/lib/queries'
import { PostEditor } from '@/components/PostEditor'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function NewPostPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        redirect('/login')
    }

    const [categories, tags] = await Promise.all([
        getCategories(),
        getTags()
    ])

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-dark-50 mb-2">Create New Post</h1>
                <p className="text-dark-400">Write a new article or use AI to generate one for you.</p>
            </div>

            <PostEditor
                post={null}
                categories={categories}
                tags={tags}
            />
        </div>
    )
}
