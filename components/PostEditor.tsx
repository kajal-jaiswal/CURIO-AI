'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Eye, Upload } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { createAdminClient } from '@/lib/supabase/admin'
import { slugify } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { Post, Category, Tag } from '@/lib/types'

interface PostEditorProps {
  post: Post | null
  categories: Category[]
  tags: Tag[]
}

export function PostEditor({ post, categories, tags }: PostEditorProps) {
  const router = useRouter()
  const supabase = createClient()
  const adminClient = createAdminClient()

  const [formData, setFormData] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content_md: post?.content_md || '',
    cover_image_url: post?.cover_image_url || '',
    category_id: post?.category_id || '',
    tags: post?.tags || [],
    author: post?.author || 'Admin',
    status: post?.status || 'draft',
    meta_title: post?.meta_title || '',
    meta_description: post?.meta_description || '',
    focus_keyword: post?.focus_keyword || '',
  })

  const [preview, setPreview] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (!formData.slug && formData.title) {
      setFormData((prev) => ({
        ...prev,
        slug: slugify(prev.title),
      }))
    }
  }, [formData.title])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `blog-images/${fileName}`

      const { error: uploadError } = await adminClient.storage
        .from('blog-images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = adminClient.storage
        .from('blog-images')
        .getPublicUrl(filePath)

      setFormData((prev) => ({
        ...prev,
        cover_image_url: data.publicUrl,
      }))

      toast.success('Image uploaded successfully')
    } catch (error) {
      toast.error('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const postData = {
        ...formData,
        category_id: formData.category_id || null,
        updated_at: new Date().toISOString(),
      }

      if (post) {
        const { error } = await adminClient
          .from('posts')
          .update(postData)
          .eq('id', post.id)

        if (error) throw error
        toast.success('Post updated successfully')
      } else {
        const { data, error } = await adminClient
          .from('posts')
          .insert(postData)
          .select()
          .single()

        if (error) throw error
        toast.success('Post created successfully')
        router.push(`/admin/posts/${data.id}`)
        router.refresh()
        return
      }

      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Failed to save post')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-dark-900 border border-dark-800 rounded-lg p-6 space-y-4">
        <div>
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
            Cover Image
          </label>
          <div className="flex gap-4">
            <input
              type="text"
              value={formData.cover_image_url}
              onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
              placeholder="Image URL"
              className="flex-1 px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-dark-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <label className="px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg cursor-pointer hover:bg-dark-700 transition-colors flex items-center gap-2">
              <Upload className="w-4 h-4" />
              {uploading ? 'Uploading...' : 'Upload'}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>
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

      <div className="flex justify-end gap-4">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Saving...' : 'Save Post'}
        </button>
      </div>
    </form>
  )
}

function MarkdownPreview({ content }: { content: string }) {
  // Simple markdown preview
  const html = content
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/\n/gim, '<br />')

  return (
    <div
      className="text-dark-200 prose prose-lg max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
