# ✅ What to Do After Running the SQL Script

## 🎉 Step-by-Step Guide

### Step 1: Verify Script Ran Successfully ✅

After running the SQL script, you should see:
- ✅ "Success. No rows returned" 
- ✅ Or "Success" message
- ✅ No error messages

**If you see errors**: Check `QUICK_SQL_SETUP.md` troubleshooting section.

---

### Step 2: Create Your First Admin User 👑

You need an admin account to manage the blog.

#### Option A: Via Supabase Dashboard (Easiest)

1. Go to **Supabase Dashboard** → **Authentication** → **Users**
2. Click **"Add User"** → **"Create new user"**
3. Enter:
   - **Email**: `admin@curioai.com` (or your email)
   - **Password**: Choose a strong password
4. Click **"Create User"**
5. **IMPORTANT**: After creating, run this SQL to set role:

```sql
-- Set user as admin (replace email with your admin email)
UPDATE user_profiles 
SET role = 'admin' 
WHERE email = 'admin@curioai.com';
```

#### Option B: Using Script

```bash
npm run setup:admin
```

---

### Step 3: Set Up Environment Variables 🔑

Make sure your `.env.local` file has:

```env
# Required - Get from Supabase Dashboard → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional - For AI features
GEMINI_API_KEY=your-gemini-key (get from https://makersuite.google.com/app/apikey)
CRON_SECRET=your-random-secret-key-min-32-chars
```

**Where to find Supabase keys**:
1. Supabase Dashboard → **Settings** → **API**
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

---

### Step 4: Start Your Development Server 🚀

```bash
npm run dev
```

Wait for: `✓ Ready on http://localhost:3000`

---

### Step 5: Test Everything! 🧪

#### Test 1: Login as Admin
1. Open browser: `http://localhost:3000`
2. Click **"Login"** (top right)
3. Enter admin credentials
4. Should redirect to `/admin` dashboard ✅

#### Test 2: Create Your First Post
1. After login, go to `/admin/posts`
2. Click **"New Post"**
3. Fill in:
   - Title: "Welcome to Curio AI Blog"
   - Content: Write some markdown content
   - Status: Select "Published"
4. Click **"Save Post"**
5. Should redirect and show success ✅

#### Test 3: View Your Post
1. Go to `/blog`
2. Your post should appear ✅
3. Click on it → Should show full post ✅

#### Test 4: Test Author Signup
1. Logout (if logged in)
2. Go to `/signup`
3. Fill form:
   - Name: "Test Author"
   - Email: `author@test.com`
   - Password: `password123`
   - Select **"Author"** role
4. Click **"Create Account"**
5. Should redirect to `/author` dashboard ✅

#### Test 5: Author Creates Post
1. As author, go to `/author/posts/new`
2. Create a post
3. Upload an image (optional)
4. Save → Should work! ✅

---

### Step 6: Set Up AI Cron Job (Optional) 🤖

If you want automatic blog post generation:

1. **Get Gemini API Key**:
   - Go to https://makersuite.google.com/app/apikey
   - Create API key
   - Copy it

2. **Add to `.env.local`**:
   ```env
   GEMINI_API_KEY=your-key-here
   CRON_SECRET=generate-random-secret-here
   ```

3. **Generate secret**:
   ```bash
   # Or use: openssl rand -hex 32
   # Or any random 32+ character string
   ```

4. **Test manually**:
   ```bash
   curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
     http://localhost:3000/api/cron/generate-blog
   ```

5. **Deploy to Vercel** (cron runs automatically):
   - Push to GitHub
   - Deploy to Vercel
   - Add environment variables in Vercel
   - Cron runs daily at midnight UTC

See `CRON_SETUP.md` for details.

---

### Step 7: Add Sample Content (Optional) 📝

#### Add Categories:
```sql
INSERT INTO categories (name, slug, description) VALUES
  ('Productivity Tools', 'productivity-tools', 'AI tools to boost productivity'),
  ('Marketing', 'marketing', 'AI-powered marketing tools'),
  ('Content Creation', 'content-creation', 'Tools for creating content with AI')
ON CONFLICT (slug) DO NOTHING;
```

#### Add Tags:
```sql
INSERT INTO tags (name, slug) VALUES
  ('ChatGPT', 'chatgpt'),
  ('Free Tools', 'free-tools'),
  ('Small Business', 'small-business')
ON CONFLICT (slug) DO NOTHING;
```

#### Or use seed script:
```bash
# If you have seed.sql, run it in Supabase SQL Editor
```

---

### Step 8: Deploy to Production (When Ready) 🌐

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial setup"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Go to vercel.com
   - Import your GitHub repo
   - Add environment variables
   - Deploy!

3. **Update Supabase**:
   - Go to Supabase Dashboard → Authentication → URL Configuration
   - Add your Vercel domain to "Site URL"
   - Add to "Redirect URLs"

See `DEPLOYMENT.md` for complete guide.

---

## ✅ Checklist After SQL Setup

- [ ] SQL script ran successfully
- [ ] Created admin user
- [ ] Set admin role in database
- [ ] Environment variables configured
- [ ] Dev server running (`npm run dev`)
- [ ] Can login as admin
- [ ] Can create posts
- [ ] Can view posts on blog
- [ ] Author signup works
- [ ] Author can create posts
- [ ] Image upload works (optional)
- [ ] AI cron job set up (optional)

---

## 🐛 Troubleshooting

### Can't Login
- ✅ Check: User exists in Supabase Auth
- ✅ Check: User has role in `user_profiles` table
- ✅ Check: Environment variables are correct

### Author Can't Create Posts
- ✅ Check: User has 'author' role in `user_profiles`
- ✅ Check: RLS policies were created (from SQL script)
- ✅ Check: Browser console for errors

### Image Upload Fails
- ✅ Check: `blog-images` bucket exists in Storage
- ✅ Check: Bucket is public
- ✅ Check: Storage policies were created

### Posts Don't Show
- ✅ Check: Post status is 'published' (not 'draft')
- ✅ Check: Go to `/blog` (not just homepage)
- ✅ Check: Database has posts

---

## 🎯 Next Steps

1. ✅ **Create admin user** (Step 2)
2. ✅ **Set environment variables** (Step 3)
3. ✅ **Start server** (Step 4)
4. ✅ **Test everything** (Step 5)
5. ✅ **Add content** (Step 7)
6. ✅ **Deploy** (Step 8)

---

## 📚 Helpful Files

- `QUICK_START.md` - General setup guide
- `QUICK_FIXES.md` - Troubleshooting guide
- `CRON_SETUP.md` - AI cron job setup
- `DEPLOYMENT.md` - Production deployment

---

**You're all set! Start with Step 2 (Create Admin User) and work through the steps.** 🚀
