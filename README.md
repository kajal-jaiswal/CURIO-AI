# Curio AI Blog - SEO-Friendly Blog Platform

A complete, SEO-optimized blog website built with Next.js 14, TypeScript, Tailwind CSS, and Supabase. Designed specifically for the "AI Tools for Jobs + Small Businesses" niche.

## 🚀 Features

- **SEO Optimized**: Complete metadata, schema markup, sitemap, and RSS feed
- **Fast Performance**: Static Site Generation (SSG) + Incremental Static Regeneration (ISR)
- **Modern UI**: Dark mode, responsive design, beautiful animations
- **Admin Panel**: Full CRUD operations for posts, categories, tags, and comments
- **Markdown Editor**: Rich markdown editing with live preview
- **Comments System**: User comments with moderation
- **Newsletter**: Email subscription system
- **Analytics**: Built-in analytics dashboard
- **100% Free**: Uses free tiers of Supabase and Vercel

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Hosting**: Vercel
- **Authentication**: Supabase Auth

## 📋 Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- A Vercel account (free tier works)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd CurioAIBlog
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In your Supabase project, go to SQL Editor
3. Run the SQL from `supabase/schema.sql` to create all tables
4. (Optional) Run `supabase/seed.sql` to add sample data

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

You can find these values in your Supabase project settings:
- Project URL → `NEXT_PUBLIC_SUPABASE_URL`
- API → anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- API → service_role key → `SUPABASE_SERVICE_ROLE_KEY`

### 5. Set Up Supabase Storage

1. In Supabase Dashboard, go to Storage
2. Create a new bucket named `blog-images`
3. Set it to public (for public access to images)
4. Configure CORS if needed

### 6. Create Your First Admin User

1. In Supabase Dashboard, go to Authentication → Users
2. Click "Add User" → "Create new user"
3. Enter email and password
4. Save the credentials - you'll use them to log into `/admin/login`

### 7. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Admin Panel

Access the admin panel at `/admin/login` using the credentials you created in Supabase.

### Admin Features:
- **Dashboard**: View analytics, top posts, and statistics
- **Posts**: Create, edit, delete, and manage blog posts
- **Comments**: Moderate and approve comments
- **Categories & Tags**: Manage content organization

## 🚀 Deployment to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` (your Vercel domain, e.g., `https://your-app.vercel.app`)
5. Click "Deploy"

### 3. Update Supabase Settings

After deployment, update your Supabase project:
1. Go to Authentication → URL Configuration
2. Add your Vercel domain to "Site URL"
3. Add your Vercel domain to "Redirect URLs"

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin panel routes
│   ├── blog/              # Blog pages
│   ├── category/          # Category pages
│   ├── tag/               # Tag pages
│   └── ...
├── components/            # React components
├── lib/                   # Utilities and helpers
│   ├── supabase/         # Supabase clients
│   ├── queries.ts        # Database queries
│   └── types.ts          # TypeScript types
├── supabase/             # Database schema and seeds
└── public/               # Static assets
```

## 🎨 Customization

### Change Colors

Edit `tailwind.config.ts` to customize the color scheme:

```typescript
colors: {
  primary: { ... },
  dark: { ... },
}
```

### Update Site Information

Edit `app/layout.tsx` to update:
- Site title
- Meta description
- Social media links
- Footer content

## 📊 SEO Features

- ✅ Dynamic metadata for all pages
- ✅ JSON-LD schema markup
- ✅ Automatic sitemap.xml generation
- ✅ robots.txt configuration
- ✅ RSS feed at `/feed.xml`
- ✅ Open Graph tags
- ✅ Twitter Card tags
- ✅ Canonical URLs
- ✅ Breadcrumb navigation

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- Admin routes protected by middleware
- Environment variables for sensitive data
- Secure authentication via Supabase Auth

## 📈 Performance

- Static Site Generation (SSG)
- Incremental Static Regeneration (ISR)
- Image optimization with Next.js Image
- Code splitting
- Lazy loading
- Minimal JavaScript bundle

## 🐛 Troubleshooting

### Images not loading
- Check Supabase Storage bucket is public
- Verify image URLs in database
- Check CORS settings in Supabase

### Admin login not working
- Verify user exists in Supabase Auth
- Check environment variables are set correctly
- Ensure RLS policies allow authenticated access

### Build errors
- Clear `.next` folder and rebuild
- Check Node.js version (18+)
- Verify all dependencies are installed

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues and questions, please open an issue on GitHub or contact us through the contact page.

---

Built with ❤️ using Next.js, Supabase, and Tailwind CSS
