# 🔧 Supabase Configuration for Localhost Development

## 📧 Disable Email Confirmation

To use the admin panel on localhost without email confirmation, follow these steps:

### **Step 1: Disable Email Confirmation in Supabase**

1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**: `uaumotnyxnxvjpfkagau`
3. **Navigate to**: Authentication → Settings
4. **Find**: "Email Confirmation" section
5. **Disable**: "Enable email confirmations" (turn it OFF)
6. **Save** the settings

### **Step 2: Update Site URL (Optional)**

1. **In the same Authentication Settings page**
2. **Find**: "Site URL" 
3. **Set to**: `http://localhost:3000`
4. **Add Redirect URLs**: 
   - `http://localhost:3000/**`
   - `http://127.0.0.1:3000/**`
5. **Save** the settings

### **Step 3: Run the SQL Script**

1. **Go to**: SQL Editor in your Supabase dashboard
2. **Copy and paste** the contents of `supabase-setup.sql`
3. **Run the script** to create tables and disable email confirmation for existing users

## 🚀 **After Configuration:**

1. **Restart your React app**: `npm start`
2. **Go to**: `http://localhost:3000/admin`
3. **Click**: "Don't have an account? Create one"
4. **Create account** with any email/password
5. **Sign in immediately** - no email confirmation needed!

## ⚡ **Quick Fix Alternative:**

If you can't access Supabase dashboard right now, you can create a user directly via SQL:

```sql
-- Run this in Supabase SQL Editor to create an admin user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@betawebsite.com',
  crypt('admin123456', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);
```

Then you can login directly with:
- **Email**: `admin@betawebsite.com`
- **Password**: `admin123456`

## 🎯 **Result:**

After following these steps, you'll be able to:
- ✅ Create admin accounts without email verification
- ✅ Sign in immediately after signup
- ✅ Use the admin panel on localhost
- ✅ No email confirmation required

The admin panel will work perfectly for local development! 🎉
