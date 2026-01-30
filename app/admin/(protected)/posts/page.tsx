import Link from 'next/link'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { getPosts } from '@/lib/queries'
import { formatDate } from '@/lib/utils'
import { DeletePostButton } from '@/components/DeletePostButton'

export const dynamic = 'force-dynamic'

export default async function AdminPostsPage() {
  const posts = await getPosts({ status: undefined, limit: 100 })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-dark-50">Posts</h1>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Post
        </Link>
      </div>

      <div className="bg-dark-900 border border-dark-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-dark-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">
                Views
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-dark-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-800">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-dark-800">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-dark-50">{post.title}</div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${post.status === 'published'
                        ? 'bg-green-900/30 text-green-400'
                        : 'bg-yellow-900/30 text-yellow-400'
                      }`}
                  >
                    {post.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-dark-400">{post.views_count}</td>
                <td className="px-6 py-4 text-sm text-dark-400">{formatDate(post.created_at)}</td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    {post.status === 'published' && (
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-400 hover:text-primary-300"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                    )}
                    <Link
                      href={`/admin/posts/${post.id}`}
                      className="text-primary-400 hover:text-primary-300"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <DeletePostButton postId={post.id} postTitle={post.title} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
