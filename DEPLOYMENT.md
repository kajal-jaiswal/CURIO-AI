# Deployment Guide

This guide will walk you through deploying your Curio AI Blog to production.

## Prerequisites

- ✅ Supabase project created
- ✅ Database schema applied
- ✅ Admin user created
- ✅ GitHub account (for Vercel deployment)

## Step 1: Prepare Your Code

1. Make sure all your code is committed to Git:
```bash
git add .
git commit -m "Ready for deployment"
```

2. Push to GitHub:
```bash
git push origin main
```

## Step 2: Deploy to Vercel

### Option A: Via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

5. Add Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
   - `NEXT_PUBLIC_SITE_URL` - Your Vercel domain (e.g., `https://your-app.vercel.app`)

6. Click "Deploy"

### Option B: Via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Follow the prompts and add environment variables when asked

## Step 3: Configure Supabase

After deployment, update your Supabase project settings:

1. **Authentication → URL Configuration**:
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: Add `https://your-app.vercel.app/**`

2. **Storage → Settings**:
   - Ensure your bucket is public
   - Configure CORS if needed

## Step 4: Update Environment Variables

If you need to update environment variables after deployment:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add or update variables
3. Redeploy the project

## Step 5: Verify Deployment

1. Visit your Vercel domain
2. Test the homepage
3. Test blog pages
4. Test admin login at `/admin/login`
5. Verify sitemap at `/sitemap.xml`
6. Verify RSS feed at `/feed.xml`

## Step 6: Custom Domain (Optional)

1. In Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `NEXT_PUBLIC_SITE_URL` environment variable
5. Update Supabase redirect URLs

## Post-Deployment Checklist

- [ ] Homepage loads correctly
- [ ] Blog posts display properly
- [ ] Images load from Supabase Storage
- [ ] Admin login works
- [ ] Can create/edit posts in admin
- [ ] Comments system works
- [ ] Newsletter subscription works
- [ ] Sitemap is accessible
- [ ] RSS feed works
- [ ] All pages have proper metadata
- [ ] Mobile responsive design works
- [ ] Search functionality works

## Monitoring

### Vercel Analytics

1. Enable Vercel Analytics in your project settings
2. View analytics in the Vercel dashboard

### Supabase Monitoring

1. Check Supabase Dashboard → Logs for errors
2. Monitor database usage in Settings → Usage

## Troubleshooting

### Build Fails

- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Ensure Node.js version is 18+

### Images Not Loading

- Verify Supabase Storage bucket is public
- Check image URLs in database
- Verify CORS settings

### Admin Login Issues

- Verify Supabase Auth settings
- Check redirect URLs are configured
- Ensure environment variables are correct

### Database Connection Issues

- Verify Supabase project is active
- Check API keys are correct
- Ensure RLS policies are set up

## Performance Optimization

1. **Enable Vercel Analytics**: Track Core Web Vitals
2. **Image Optimization**: Already configured with Next.js Image
3. **Caching**: ISR is configured for automatic revalidation
4. **CDN**: Vercel automatically provides global CDN

## Security Checklist

- [ ] Environment variables are set (not in code)
- [ ] Service role key is secure (never expose to client)
- [ ] RLS policies are enabled
- [ ] Admin routes are protected
- [ ] HTTPS is enabled (automatic on Vercel)

## Backup Strategy

1. **Database**: Supabase provides automatic backups
2. **Code**: GitHub repository serves as backup
3. **Images**: Stored in Supabase Storage (backed up automatically)

## Scaling

The free tier should handle:
- Up to 100GB bandwidth/month
- Unlimited requests
- Automatic scaling

For higher traffic:
- Upgrade Vercel Pro plan
- Upgrade Supabase Pro plan
- Consider adding caching layer

---

Your blog is now live! 🎉
