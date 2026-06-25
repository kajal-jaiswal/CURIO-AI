# 🤖 AI Blog Cron Job Setup Guide

## What It Does

The cron job automatically generates blog posts daily using:
- Google Gemini AI
- Trending news topics
- Auto-publishes to your blog

## 🚀 Setup Options

### Option 1: Vercel Cron (Easiest - Recommended)

**Already configured!** Just needs environment variables.

1. **Add to `.env.local`** (for local testing):
   ```env
   CRON_SECRET=your-random-secret-key-here-min-32-chars
   GEMINI_API_KEY=your-google-gemini-api-key
   ```

2. **Add to Vercel** (for production):
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add:
     - `CRON_SECRET` = your secret key
     - `GEMINI_API_KEY` = your Gemini API key

3. **Deploy** - Cron runs automatically daily at midnight UTC!

**Get Gemini API Key**:
- Go to https://makersuite.google.com/app/apikey
- Create new API key
- Copy and add to environment variables

### Option 2: External Cron Service (Free)

Use a free cron service to call your endpoint:

**Services**:
- cron-job.org (free)
- EasyCron (free tier)
- GitHub Actions (free)

**Setup**:
1. Create account on cron service
2. Add new cron job:
   - **URL**: `https://yourdomain.com/api/cron/generate-blog`
   - **Method**: GET
   - **Headers**: 
     ```
     Authorization: Bearer YOUR_CRON_SECRET
     ```
   - **Schedule**: Daily at your preferred time

3. Save and activate

### Option 3: Manual Testing

Test the endpoint manually:

```bash
# Local testing
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  http://localhost:3000/api/cron/generate-blog

# Production testing
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://yourdomain.com/api/cron/generate-blog
```

## 🔐 Security

The endpoint requires:
- `Authorization: Bearer YOUR_CRON_SECRET` header
- Secret must match `CRON_SECRET` environment variable

**Generate a secure secret**:
```bash
# Use a long random string
openssl rand -hex 32
```

## 📊 What Happens

1. Cron calls `/api/cron/generate-blog`
2. Fetches trending news (5 articles)
3. Generates blog posts using Gemini AI
4. Creates cover images (Pollinations.ai)
5. Publishes posts automatically
6. Returns success/error report

## ⚙️ Configuration

Edit `app/api/cron/generate-blog/route.ts` to customize:
- Number of posts per run (default: 5)
- News source
- AI model
- Post status (published/draft)

## 🐛 Troubleshooting

### Cron Not Running
- Check Vercel logs
- Verify `CRON_SECRET` is set
- Check `vercel.json` cron config

### Posts Not Generating
- Check Gemini API key is valid
- Check Supabase connection
- Check API logs for errors

### Authorization Failed
- Verify `CRON_SECRET` matches
- Check header format: `Bearer YOUR_SECRET`

## 📝 Example Response

```json
{
  "success": true,
  "count": 5,
  "results": [
    {
      "title": "AI Tools for Small Business",
      "slug": "ai-tools-small-business",
      ...
    }
  ]
}
```

---

**Once set up, your blog will auto-generate content daily!** 🤖✨
