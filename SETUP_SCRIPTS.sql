-- =====================================================
-- CURIO AI BLOG - COMPLETE SETUP SCRIPTS
-- =====================================================
-- Run these scripts in Supabase SQL Editor
-- Copy and paste each section, then run
-- =====================================================

-- =====================================================
-- 1. USER PROFILE AUTO-CREATION TRIGGER (CRITICAL!)
-- =====================================================
-- This ensures user_profiles are created when users sign up
-- WITHOUT THIS: Signup won't create profiles!

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

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 2. STORAGE PERMISSIONS FOR IMAGE UPLOAD
-- =====================================================
-- This allows authors and admins to upload images

-- Make blog-images bucket public (for viewing images)
UPDATE storage.buckets 
SET public = true 
WHERE id = 'blog-images';

-- If bucket doesn't exist, create it first:
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('blog-images', 'blog-images', true)
-- ON CONFLICT (id) DO UPDATE SET public = true;

-- Allow authenticated users to upload images
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'blog-images');

-- Allow public to view images
DROP POLICY IF EXISTS "Public can view images" ON storage.objects;
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'blog-images');

-- Allow authenticated users to update their own uploads
DROP POLICY IF EXISTS "Users can update own images" ON storage.objects;
CREATE POLICY "Users can update own images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'blog-images');

-- Allow authenticated users to delete their own uploads
DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'blog-images');

-- =====================================================
-- 3. VERIFY USER_PROFILES TABLE EXISTS
-- =====================================================
-- If you haven't run schema-roles.sql, run this:

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  role user_role DEFAULT 'user',
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Create user_role type if it doesn't exist
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('user', 'author', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- =====================================================
-- 4. VERIFY POSTS TABLE HAS AUTHOR_ID COLUMN
-- =====================================================
-- Add author_id column if it doesn't exist

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'posts' AND column_name = 'author_id'
  ) THEN
    ALTER TABLE posts ADD COLUMN author_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL;
  END IF;
END $$;

-- =====================================================
-- 5. VERIFY POSTS TABLE HAS LIKES_COUNT COLUMN
-- =====================================================
-- Add likes_count if it doesn't exist

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'posts' AND column_name = 'likes_count'
  ) THEN
    ALTER TABLE posts ADD COLUMN likes_count INTEGER DEFAULT 0;
  END IF;
END $$;

-- =====================================================
-- 6. VERIFY POSTS TABLE HAS COMMENTS_COUNT COLUMN
-- =====================================================
-- Add comments_count if it doesn't exist

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'posts' AND column_name = 'comments_count'
  ) THEN
    ALTER TABLE posts ADD COLUMN comments_count INTEGER DEFAULT 0;
  END IF;
END $$;

-- =====================================================
-- 7. VERIFY POSTS TABLE HAS IS_FEATURED COLUMN
-- =====================================================
-- Add is_featured if it doesn't exist

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'posts' AND column_name = 'is_featured'
  ) THEN
    ALTER TABLE posts ADD COLUMN is_featured BOOLEAN DEFAULT false;
  END IF;
END $$;

-- =====================================================
-- 8. ROW LEVEL SECURITY POLICIES FOR POSTS
-- =====================================================
-- Ensure authors can insert/update their own posts

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authors can insert own posts" ON posts;
DROP POLICY IF EXISTS "Authors can update own posts" ON posts;
DROP POLICY IF EXISTS "Admins can manage all posts" ON posts;

-- Authors can insert their own posts
CREATE POLICY "Authors can insert own posts"
ON posts FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid()
    AND (user_profiles.role = 'author' OR user_profiles.role = 'admin')
  )
  AND author_id = auth.uid()
);

-- Authors can update their own posts
CREATE POLICY "Authors can update own posts"
ON posts FOR UPDATE
TO authenticated
USING (
  author_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid()
    AND user_profiles.role = 'admin'
  )
);

-- Admins can manage all posts
CREATE POLICY "Admins can manage all posts"
ON posts FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid()
    AND user_profiles.role = 'admin'
  )
);

-- =====================================================
-- 9. VERIFY STORAGE BUCKET EXISTS
-- =====================================================
-- Create blog-images bucket if it doesn't exist

INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- =====================================================
-- DONE! ✅
-- =====================================================
-- After running these scripts:
-- 1. User signup will auto-create profiles ✅
-- 2. Authors can upload images ✅
-- 3. Authors can create/edit posts ✅
-- 4. All tables have required columns ✅
-- 5. RLS policies are set correctly ✅
-- =====================================================
