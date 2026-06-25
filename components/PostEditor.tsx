'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Save, Eye, Sparkles, X } from 'lucide-react'
import { slugify } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { Post, Category, Tag } from '@/lib/types'
import { generatePostAction } from '@/app/actions/generate-post'
import { createPost, updatePost } from '@/app/actions/posts'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface PostEditorProps {
  post: Post | null
  categories: Category[]
  tags: Tag[]
}

export function PostEditor({ post, categories, tags }: PostEditorProps) {
  const router = useRouter()
  const { data: session } = useSession()

  const [formData, setFormData] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content_md: post?.content_md || '',
    cover_image_url: post?.cover_image_url || '',
    category_id: post?.category_id || '',
    tags: post?.tags || [],
    status: (post?.status as 'draft' | 'published') || 'draft',
    meta_title: post?.meta_title || '',
    meta_description: post?.meta_description || '',
    focus_keyword: post?.focus_keyword || '',
  })

  const [preview, setPreview] = useState(false)
  const [saving, setSaving] = useState(false)

  // AI Generation State
  const [showAiModal, setShowAiModal] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiOptions, setAiOptions] = useState({
    topic: '',
    tone: 'Professional yet engaging',
    category: ''
  })

  useEffect(() => {
    if (!formData.slug && formData.title) {
      setFormData((prev) => ({
        ...prev,
        slug: slugify(prev.title),
      }))
    }
  }, [formData.title])

  const handleAiGenerate = async () => {
    if (!aiOptions.topic) return toast.error('Please enter a topic')

    setAiLoading(true)
    const fd = new FormData()
    fd.append('topic', aiOptions.topic)
    fd.append('tone', aiOptions.tone)
    fd.append('category', aiOptions.category)

    try {
      const result = await generatePostAction(fd)

      if (result.success && 'content' in result && result.content) {
        setFormData(prev => ({
          ...prev,
          title: ('title' in result && result.title) ? result.title : prev.title,
          content_md: result.content
        }))
        toast.success('Generated successfully!')
        setShowAiModal(false)
      } else {
        const errorMsg = 'error' in result ? result.error : 'Failed to generate'
        toast.error(errorMsg || 'Failed to generate')
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setAiLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent, overrideStatus?: 'draft' | 'published') => {
    e.preventDefault()
    setSaving(true)

    try {
      const payload = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content_md: formData.content_md,
        cover_image_url: formData.cover_image_url || undefined,
        category_id: formData.category_id || undefined,
        tags: formData.tags,
        status: (overrideStatus ?? formData.status) as 'draft' | 'published',
        meta_title: formData.meta_title || undefined,
        meta_description: formData.meta_description || undefined,
        focus_keyword: formData.focus_keyword || undefined,
      }

      if (post) {
        await updatePost(post.id, payload)
        toast.success(payload.status === 'published' ? 'Post published!' : 'Draft saved')
      } else {
        const result = await createPost(payload)
        toast.success(payload.status === 'published' ? 'Post published!' : 'Draft saved')

        const role = session?.user?.role
        if (role === 'author') {
          router.push(`/author/posts/${result.postId}/edit`)
        } else {
          router.push(`/admin/posts/${result.postId}`)
        }
      }

      router.refresh()
    } catch (error: any) {
      console.error('Save error:', error)
      toast.error(error.message || 'Failed to save post')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-dark-900 border border-dark-800 rounded-lg p-6 space-y-4">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-dark-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <button
              type="button"
              onClick={() => setShowAiModal(true)}
              className="mt-7 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-purple-900/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Magic Generate</span>
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Slug *
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: slugify(e.target.value) })}
              className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-dark-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Excerpt
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-dark-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Cover Image URL
            </label>
            <input
              type="text"
              value={formData.cover_image_url}
              onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
              placeholder="Paste an image URL (e.g. https://images.unsplash.com/...)"
              className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-dark-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {formData.cover_image_url && (
              <img
                src={formData.cover_image_url}
                alt="Cover preview"
                className="mt-2 h-32 object-cover rounded-lg"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Category
              </label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-dark-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">No category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
                className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-dark-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Tags (select multiple)
            </label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <label key={tag.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.tags.includes(tag.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          tags: [...formData.tags, tag.id],
                        })
                      } else {
                        setFormData({
                          ...formData,
                          tags: formData.tags.filter((t) => t !== tag.id),
                        })
                      }
                    }}
                    className="w-4 h-4 text-primary-600 bg-dark-800 border-dark-700 rounded focus:ring-primary-500"
                  />
                  <span className="text-dark-300">{tag.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <button
              type="button"
              onClick={() => setPreview(!preview)}
              className="flex items-center gap-2 px-4 py-2 bg-dark-800 hover:bg-dark-700 rounded-lg text-dark-300 transition-colors"
            >
              <Eye className="w-4 h-4" />
              {preview ? 'Edit' : 'Preview'}
            </button>
          </div>

          {preview ? (
            <div className="prose prose-lg max-w-none bg-dark-800 p-6 rounded-lg">
              <MarkdownPreview content={formData.content_md} />
            </div>
          ) : (
            <textarea
              value={formData.content_md}
              onChange={(e) => setFormData({ ...formData, content_md: e.target.value })}
              rows={20}
              className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-dark-50 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Write your markdown content here..."
            />
          )}
        </div>

        <div className="bg-dark-900 border border-dark-800 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-dark-50">SEO Settings</h3>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Meta Title
            </label>
            <input
              type="text"
              value={formData.meta_title}
              onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
              className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-dark-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Leave empty to use post title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Meta Description
            </label>
            <textarea
              value={formData.meta_description}
              onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-dark-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Leave empty to use excerpt"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Focus Keyword
            </label>
            <input
              type="text"
              value={formData.focus_keyword}
              onChange={(e) => setFormData({ ...formData, focus_keyword: e.target.value })}
              className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-dark-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="submit"
            disabled={saving}
            onClick={(e) => handleSubmit(e, 'draft')}
            className="flex items-center gap-2 px-6 py-3 bg-dark-700 hover:bg-dark-600 text-dark-200 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            type="submit"
            disabled={saving}
            onClick={(e) => handleSubmit(e, 'published')}
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </form>

      {/* AI Modal */}
      {showAiModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-dark-900 border border-dark-700 rounded-xl shadow-2xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowAiModal(false)}
              className="absolute top-4 right-4 text-dark-400 hover:text-dark-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-dark-50">AI Magic Writer</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1">
                  Topic / Title *
                </label>
                <input
                  type="text"
                  value={aiOptions.topic}
                  onChange={(e) => setAiOptions({ ...aiOptions, topic: e.target.value })}
                  placeholder="e.g. The Future of AI in Healthcare"
                  className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-dark-50 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1">
                  Tone
                </label>
                <select
                  value={aiOptions.tone}
                  onChange={(e) => setAiOptions({ ...aiOptions, tone: e.target.value })}
                  className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-dark-50 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <option value="Professional yet engaging">Professional yet engaging</option>
                  <option value="Casual and friendly">Casual and friendly</option>
                  <option value="Opinionated and strong">Opinionated and strong</option>
                  <option value="Educational and detailed">Educational and detailed</option>
                  <option value="Humorous and witty">Humorous and witty</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1">
                  Context / Category (Optional)
                </label>
                <input
                  type="text"
                  value={aiOptions.category}
                  onChange={(e) => setAiOptions({ ...aiOptions, category: e.target.value })}
                  placeholder="e.g. Technology News"
                  className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-dark-50 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={handleAiGenerate}
                  disabled={aiLoading}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-purple-900/20 disabled:opacity-70 flex justify-center items-center gap-2"
                >
                  {aiLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Generating Magic...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Content
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function MarkdownPreview({ content }: { content: string }) {
  return (
    <div className="text-dark-200 prose prose-invert prose-lg max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  )
}
