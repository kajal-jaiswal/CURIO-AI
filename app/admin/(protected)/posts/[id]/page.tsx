import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCategories, getTags } from '@/lib/queries'
import { PostEditor } from '@/components/PostEditor'

interface AdminPostPageProps {
  params: {
    id: string
  }
}

async function getPost(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('posts')
    .select('*, category:categories(*)')
    .eq('id', id)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

export default async function AdminPostPage({ params }: AdminPostPageProps) {
  const post = params.id === 'new' ? null : await getPost(params.id)
  
  if (params.id !== 'new' && !post) {
    notFound()
  }

  const [categories, tags] = await Promise.all([
    getCategories(),
    getTags(),
  ])

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark-50 mb-8">
        {post ? 'Edit Post' : 'New Post'}
      </h1>
      <PostEditor post={post} categories={categories} tags={tags} />
    </div>
  )
}
