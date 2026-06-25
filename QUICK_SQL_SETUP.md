# 🚀 Quick SQL Setup - Copy & Paste

## ⚡ Fastest Way to Set Everything Up

### Step 1: Open Supabase SQL Editor

1. Go to your Supabase Dashboard
2. Click **SQL Editor** in the sidebar
3. Click **New Query**

### Step 2: Copy & Paste This Entire Script

**File: `RUN_THIS_IN_SUPABASE.sql`**

Just copy the entire file and paste into SQL Editor, then click **Run**!

### Step 3: Verify It Worked

You should see:
- ✅ "Success. No rows returned"
- ✅ Or success messages

## 📋 What This Script Does

1. ✅ **Creates user profile trigger** - Auto-creates profiles on signup
2. ✅ **Sets up storage bucket** - Creates `blog-images` bucket
3. ✅ **Sets storage permissions** - Allows image uploads
4. ✅ **Adds missing columns** - author_id, likes_count, etc.
5. ✅ **Sets RLS policies** - Allows authors to create posts

## 🧪 Test After Running

1. **Sign up a new user** → Should auto-create profile ✅
2. **Login as author** → Should work ✅
3. **Create post** → Should work ✅
4. **Upload image** → Should work ✅

## 🐛 If Something Fails

### Error: "relation user_profiles does not exist"
**Solution**: Run `supabase/schema-roles.sql` first, then run this script

### Error: "type user_role does not exist"
**Solution**: The script handles this, but if it fails, run:
```sql
CREATE TYPE user_role AS ENUM ('user', 'author', 'admin');
```

### Error: "bucket blog-images does not exist"
**Solution**: The script creates it, but if it fails, manually create in Storage section

## 📝 Alternative: Run Sections Separately

If you prefer to run sections separately, use `SETUP_SCRIPTS.sql` which has:
- Clear section headers
- Comments explaining each part
- Can run sections individually

---

**That's it! Just copy `RUN_THIS_IN_SUPABASE.sql` and paste into Supabase!** 🎉
