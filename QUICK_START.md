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

## Step 6: Initialize Authentication Trigger (CRITICAL)

1. Supabase Dashboard → SQL Editor
2. Run this query (or copy content from `supabase/handle_new_user.sql`):
```sql
-- Trigger to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Step 7: Create Your Accounts

Since the database is empty, you need to register!

1. **Create Admin**:
   - Go to [/signup](http://localhost:3000/signup)
   - Enter details
   - **Important**: Select "Author" role first
   - **Then**: Go to Supabase Table Editor → `user_profiles` and manually change your role to `admin` (For security, you can't signup as admin directly)

2. **Create Author**:
   - Go to signup again with a different email
   - Select "Author" role
   - You now have an author account!

3. **Create Reader**:
   - Go to signup again
   - Select "Regular User" role

## Step 8: Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Step 9: Login

1. Go to [http://localhost:3000/login](http://localhost:3000/login)
2. Enter your credentials
3. You'll be redirected to your specific dashboard!

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
