# Three-Role Authentication System

## Overview
This blog platform implements a sophisticated three-tier role-based access control (RBAC) system:

### 1. **Regular User** (Role: `user`)
**Capabilities:**
- ✅ View published blog posts
- ✅ Read and post comments on articles
- ✅ Like/unlike posts
- ✅ Subscribe to newsletter
- ✅ View author profiles
- ❌ Cannot create blog posts
- ❌ Cannot access admin dashboard

**User Journey:**
1. Visit the blog (no login required for reading)
2. Sign up/Login to comment and like posts
3. Engage with content through comments
4. Receive email notifications for replies

---

### 2. **Author** (Role: `author`)
**Capabilities:**
- ✅ All Regular User permissions
- ✅ Create and publish blog posts
- ✅ Edit own posts
- ✅ Upload images for posts
- ✅ Manage comments on own posts (approve/reject)
- ✅ View analytics for own posts:
  - Views count
  - Likes count
  - Comments count
  - Top performing posts
- ✅ Access Author Dashboard at `/author`
- ❌ Cannot edit other authors' posts
- ❌ Cannot access admin features
- ❌ Cannot manage users or ads

**Author Dashboard Features:**
- My Posts (create, edit, delete own posts)
- Post Analytics (views, engagement metrics)
- Comments Management (moderate comments on own posts)
- Profile Settings

---

### 3. **Admin** (Role: `admin`)
**Capabilities:**
- ✅ All Author permissions
- ✅ Full control over all posts (edit, delete any post)
- ✅ User Management:
  - View all users
  - Promote users to Author/Admin
  - Deactivate users
  - View user activity
- ✅ Advanced Analytics Dashboard:
  - Total users, posts, views
  - Traffic sources
  - Popular posts across all authors
  - User engagement metrics
  - Revenue analytics (if monetized)
- ✅ Advertisement Management:
  - Create/edit/delete ads
  - Set ad positions (sidebar, header, inline)
  - Track impressions and clicks
  - Schedule ads (start/end dates)
- ✅ Content Moderation:
  - Approve/reject all comments
  - Manage categories and tags
  - Feature posts on homepage
- ✅ SEO Management:
  - Edit meta tags for all posts
  - Manage sitemap
  - View search rankings
- ✅ Newsletter Management:
  - View all subscribers
  - Send bulk emails
  - Export subscriber list

**Admin Dashboard Sections:**
1. **Overview** - Key metrics and charts
2. **Users** - User management table
3. **All Posts** - Manage all blog posts
4. **Comments** - Moderate all comments
5. **Advertisements** - Ad campaign management
6. **Analytics** - Detailed traffic and engagement reports
7. **Settings** - Site-wide configuration

---

## Database Schema

### User Profiles Table
```sql
user_profiles (
  id UUID (links to auth.users),
  email VARCHAR,
  full_name VARCHAR,
  role ENUM('user', 'author', 'admin'),
  avatar_url TEXT,
  bio TEXT,
  is_active BOOLEAN
)
```

### Posts Table (Enhanced)
```sql
posts (
  id UUID,
  title VARCHAR,
  author_id UUID (links to user_profiles),
  author_name VARCHAR,
  views_count INTEGER,
  likes_count INTEGER,
  comments_count INTEGER,
  is_featured BOOLEAN,
  status ENUM('draft', 'published', 'archived')
)
```

### Advertisements Table
```sql
advertisements (
  id UUID,
  title VARCHAR,
  image_url TEXT,
  link_url TEXT,
  position ENUM('sidebar', 'header', 'footer', 'inline'),
  is_active BOOLEAN,
  impressions_count INTEGER,
  clicks_count INTEGER,
  start_date TIMESTAMP,
  end_date TIMESTAMP
)
```

### Analytics Events Table
```sql
analytics_events (
  id UUID,
  event_type VARCHAR,
  user_id UUID,
  post_id UUID,
  metadata JSONB,
  created_at TIMESTAMP
)
```

---

## Row Level Security (RLS) Policies

### Posts
- **Public**: Can view published posts
- **Authors**: Can create, view, and edit own posts
- **Admins**: Can manage all posts

### Comments
- **Public**: Can view approved comments
- **Users**: Can post comments
- **Authors**: Can moderate comments on own posts
- **Admins**: Can moderate all comments

### Advertisements
- **Public**: Can view active ads
- **Admins**: Full CRUD operations

### Analytics
- **Admins**: Full access to all analytics data
- **Authors**: Can view analytics for own posts only

---

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/user` - Get current user

### Posts
- `GET /api/posts` - List posts (public)
- `GET /api/posts/:slug` - Get single post
- `POST /api/posts` - Create post (author/admin)
- `PUT /api/posts/:id` - Update post (author/admin)
- `DELETE /api/posts/:id` - Delete post (admin)
- `POST /api/posts/:id/like` - Like post (user)

### Comments
- `GET /api/posts/:id/comments` - Get comments
- `POST /api/posts/:id/comments` - Add comment (user)
- `PUT /api/comments/:id` - Update comment status (author/admin)
- `DELETE /api/comments/:id` - Delete comment (admin)

### Admin
- `GET /api/admin/users` - List all users (admin)
- `PUT /api/admin/users/:id/role` - Update user role (admin)
- `GET /api/admin/analytics` - Get analytics (admin)
- `POST /api/admin/ads` - Create advertisement (admin)
- `PUT /api/admin/ads/:id` - Update advertisement (admin)

---

## Setup Instructions

### 1. Apply Enhanced Schema
```bash
# In Supabase SQL Editor, run:
supabase/schema-roles.sql
```

### 2. Create First Admin User
```bash
npm run setup:admin
# This creates admin@curioai.com with admin role
```

### 3. Promote User to Author
```sql
-- In Supabase SQL Editor:
UPDATE user_profiles 
SET role = 'author' 
WHERE email = 'author@example.com';
```

### 4. Create Regular User
Users can self-register at `/signup` and will automatically get 'user' role.

---

## UI Components

### For Regular Users
- `/` - Homepage
- `/blog` - Blog listing
- `/blog/[slug]` - Post detail with comments
- `/signup` - Registration
- `/login` - Login
- `/profile` - User profile

### For Authors
- `/author` - Author dashboard
- `/author/posts` - My posts
- `/author/posts/new` - Create new post
- `/author/posts/[id]/edit` - Edit post
- `/author/analytics` - Post analytics
- `/author/comments` - Manage comments

### For Admins
- `/admin` - Admin dashboard (overview)
- `/admin/users` - User management
- `/admin/posts` - All posts management
- `/admin/comments` - All comments moderation
- `/admin/ads` - Advertisement management
- `/admin/analytics` - Advanced analytics
- `/admin/settings` - Site settings

---

## Security Features

1. **Row Level Security (RLS)** - Database-level access control
2. **Server-side Auth Checks** - Middleware protection
3. **API Route Guards** - Role verification on API calls
4. **CSRF Protection** - Built-in with Supabase
5. **Rate Limiting** - Prevent abuse
6. **Input Sanitization** - XSS protection

---

## Analytics Tracking

### Events Tracked:
- Page views
- Post likes
- Comment submissions
- Ad impressions
- Ad clicks
- User signups
- Post publishes

### Metrics Available:
- Daily/Weekly/Monthly active users
- Top performing posts
- Traffic sources
- User engagement rate
- Ad CTR (Click-through rate)
- Revenue per post (if monetized)

---

## Advertisement System

### Ad Positions:
1. **Sidebar** - Right sidebar on blog posts
2. **Header** - Top banner
3. **Footer** - Bottom banner
4. **Inline** - Between post content

### Ad Management:
- Upload ad image
- Set target URL
- Choose position
- Set schedule (start/end dates)
- Track performance (impressions, clicks)
- Pause/Resume ads

---

## Future Enhancements

- [ ] Email notifications for comment replies
- [ ] Social media sharing integration
- [ ] Advanced SEO tools
- [ ] Content scheduling
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Reading progress indicator
- [ ] Bookmark posts feature
- [ ] Author collaboration (co-authors)
- [ ] Revenue sharing for authors
