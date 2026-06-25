export type UserRole = 'user' | 'author' | 'moderator' | 'admin'

export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  avatar_url: string | null
  bio: string | null
  created_at: string
  updated_at: string
  is_active: boolean
}

export interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  content_md: string
  cover_image_url: string | null
  category_id: string | null
  tags: string[]
  author_id: string | null
  author_name: string
  created_at: string
  updated_at: string
  published_at: string | null
  meta_title: string | null
  meta_description: string | null
  focus_keyword: string | null
  status: 'draft' | 'published' | 'archived'
  views_count: number
  likes_count: number
  comments_count: number
  is_featured: boolean
  category?: Category
  author?: string // Used for the direct string author name from DB
  author_profile?: UserProfile // Renamed to avoid confusion with the string field
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
}

export interface Tag {
  id: string
  name: string
  slug: string
}

export interface Comment {
  id: string
  post_id: string
  user_id: string | null
  parent_id: string | null
  name: string
  email: string
  message: string
  created_at: string
  updated_at: string
  status: 'pending' | 'approved' | 'rejected'
  user?: UserProfile
  replies?: Comment[]
  post?: { title: string; slug: string }
}

export interface Newsletter {
  id: string
  email: string
  created_at: string
  is_active: boolean
}

export interface PageView {
  id: string
  post_id: string
  user_id: string | null
  ip_hash: string
  user_agent: string | null
  referrer: string | null
  created_at: string
}

export interface PostLike {
  id: string
  post_id: string
  user_id: string
  created_at: string
}

export interface Advertisement {
  id: string
  title: string
  description: string | null
  image_url: string | null
  link_url: string
  position: 'sidebar' | 'header' | 'footer' | 'inline'
  is_active: boolean
  impressions_count: number
  clicks_count: number
  start_date: string | null
  end_date: string | null
  created_at: string
  updated_at: string
}

export interface AnalyticsEvent {
  id: string
  event_type: string
  user_id: string | null
  post_id: string | null
  metadata: Record<string, any> | null
  created_at: string
}

export interface DashboardStats {
  totalUsers: number
  totalPosts: number
  totalViews: number
  totalComments: number
  totalLikes: number
  activeUsers: number
  publishedPosts: number
  pendingComments: number
}

export interface AuthorStats {
  totalPosts: number
  totalViews: number
  totalLikes: number
  totalComments: number
  topPost: Post | null
  recentPosts: Post[]
}
