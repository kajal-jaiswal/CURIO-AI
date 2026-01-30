# Setting Up Your First Admin User

This guide explains how to create your first admin user for the blog.

## Method 1: Via Supabase Dashboard (Recommended)

1. **Go to Supabase Dashboard**
   - Navigate to your project
   - Click on "Authentication" in the sidebar
   - Click on "Users"

2. **Create New User**
   - Click "Add User" button
   - Select "Create new user"
   - Enter:
     - **Email**: Your admin email (e.g., `admin@yourdomain.com`)
     - **Password**: A strong password
   - Click "Create User"

3. **Save Credentials**
   - Write down your email and password
   - You'll use these to log in at `/admin/login`

## Method 2: Via Supabase SQL (Alternative)

If you prefer SQL, you can create a user directly:

```sql
-- This will create a user, but you'll need to set the password via email
-- Better to use the dashboard method above
```

## Method 3: Self-Registration (If Enabled)

If you enable email signup in Supabase:

1. Go to `/admin/login`
2. Click "Sign Up" (if available)
3. Register with your email
4. Verify email
5. Login

**Note**: By default, self-registration is disabled for security. Use Method 1.

## Logging In

1. Go to `http://localhost:3000/admin/login` (or your domain)
2. Enter the email and password you created
3. You'll be redirected to `/admin` dashboard

## Troubleshooting

### "Invalid login credentials"
- Verify the user exists in Supabase Auth
- Check email/password are correct
- Ensure RLS policies allow authenticated access

### "User not found"
- User might not exist - create it via Supabase Dashboard
- Check you're using the correct email

### Can't access admin routes
- Verify middleware is working
- Check environment variables are set
- Ensure Supabase Auth is configured correctly

## Security Best Practices

1. **Use Strong Password**: At least 12 characters, mix of letters, numbers, symbols
2. **Don't Share Credentials**: Keep admin credentials private
3. **Enable 2FA**: Consider enabling 2FA in Supabase (if available)
4. **Regular Updates**: Keep dependencies updated
5. **Monitor Access**: Check Supabase Auth logs regularly

## Multiple Admin Users

You can create multiple admin users:
- Each user needs to be created in Supabase Auth
- All authenticated users can access `/admin` routes
- Consider adding role-based access if needed

## Resetting Password

If you forget your password:

1. Go to Supabase Dashboard → Authentication → Users
2. Find your user
3. Click "..." menu → "Reset Password"
4. User will receive email to reset password

Or use Supabase's password reset flow if implemented.

---

**Important**: Keep your admin credentials secure and never commit them to version control!
