# Quick Start Guide

Get your blog up and running in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Supabase

1. Create account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to SQL Editor and run `supabase/schema.sql`
4. (Optional) Run `supabase/seed.sql` for sample data

## Step 3: Get Supabase Keys

In Supabase Dashboard → Settings → API:
- Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- Copy **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Copy **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

## Step 4: Create .env.local

Create `.env.local` in the root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Step 5: Set Up Storage

1. Supabase Dashboard → Storage
2. Create bucket: `blog-images`
3. Make it **public**
4. Done!

## Step 6: Create Admin User

1. Supabase Dashboard → Authentication → Users
2. Click "Add User" → "Create new user"
3. Enter email and password
4. Save credentials!

## Step 7: Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Step 8: Login to Admin

1. Go to [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
2. Use the credentials from Step 6
3. Start creating posts!

## 🎉 You're Done!

Your blog is now running locally. When ready to deploy:

1. Push to GitHub
2. Deploy to Vercel (see `DEPLOYMENT.md`)
3. Update environment variables in Vercel
4. Update Supabase redirect URLs

## Common Issues

**Can't login?**
- Check user exists in Supabase Auth
- Verify environment variables

**Images not uploading?**
- Check bucket is public
- Verify bucket name is `blog-images`

**Build errors?**
- Clear `.next` folder: `rm -rf .next`
- Reinstall: `rm -rf node_modules && npm install`

---

Need help? Check `README.md` for detailed documentation.
