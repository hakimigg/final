# Admin Panel Setup Guide

## Current Status
Your admin panel is set up but needs Supabase RLS policies to work properly with the database.

## Admin Panel Access
- **URL:** `https://hakimigg.github.io/final/#/beta-secure-admin-portal-2024`
- **Email:** `example@gmail.com`
- **Password:** `admin123`

## Setup Instructions

### Option 1: Quick Setup (Recommended)
1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to "SQL Editor" in the sidebar
4. Copy and paste the contents of `supabase-rls-policies.sql`
5. Click "Run" to execute the policies

### Option 2: Manual Setup
1. **Enable RLS on products table:**
   ```sql
   ALTER TABLE products ENABLE ROW LEVEL SECURITY;
   ```

2. **Create policies for public read access:**
   ```sql
   CREATE POLICY "Allow public read access to products" 
   ON products FOR SELECT 
   USING (true);
   ```

3. **Create admin policies:**
   ```sql
   -- Allow admin insert
   CREATE POLICY "Allow admin insert products" 
   ON products FOR INSERT 
   WITH CHECK (auth.jwt() ->> 'email' = 'example@gmail.com');

   -- Allow admin update
   CREATE POLICY "Allow admin update products" 
   ON products FOR UPDATE 
   USING (auth.jwt() ->> 'email' = 'example@gmail.com');

   -- Allow admin delete
   CREATE POLICY "Allow admin delete products" 
   ON products FOR DELETE 
   USING (auth.jwt() ->> 'email' = 'example@gmail.com');
   ```

### Option 3: Create Supabase User (Most Secure)
1. Go to Authentication > Users in Supabase dashboard
2. Click "Add user"
3. Email: `example@gmail.com`
4. Password: `admin123`
5. Click "Create user"

## How It Works

### Security Features:
- **RLS Enabled:** Row Level Security prevents unauthorized access
- **Public Read:** Anyone can view products (for your website)
- **Admin Only Write:** Only authenticated admin can add/edit/delete
- **Fallback System:** Works with hardcoded credentials if Supabase fails

### Current Behavior:
- **Without RLS policies:** Admin panel shows mock data only
- **With RLS policies:** Admin panel connects to real Supabase database
- **Authentication:** Tries Supabase first, falls back to hardcoded credentials

## Troubleshooting

### If admin panel still shows mock data:
1. Check Supabase connection in browser console
2. Verify RLS policies are created
3. Ensure admin user exists in Supabase Auth

### If you get permission errors:
1. Check that RLS policies match your admin email
2. Verify the admin user is authenticated
3. Check Supabase logs for detailed errors

## Security Notes
- RLS policies protect your database from unauthorized access
- Only authenticated admin users can modify products
- Public users can only read products (for website display)
- Never disable RLS - it's your security layer!
