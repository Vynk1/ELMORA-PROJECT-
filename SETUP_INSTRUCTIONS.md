# 🛠️ Elmora + Supabase Setup Instructions

## Issues Found & Fixed ✅

### 1. **Environment Variable Configuration**
**Problem**: Using `REACT_APP_` prefix with Vite (should be `VITE_`)  
**Solution**: 
- ✅ Created `.env.local` in root with `VITE_` prefixed variables
- ✅ Updated `client/lib/supabaseClient.js` to use `import.meta.env.VITE_*`
- ✅ Updated smoke test to support both formats

### 2. **Database Tables Missing**
**Problem**: Supabase project exists but tables not created  
**Solution**: Need to run the SQL setup script

### 3. **Email Validation**
**Problem**: Supabase rejecting test emails with `.dev` domain  
**Solution**: ✅ Updated smoke test to use `@example.com` format

## 🚀 Setup Steps

### Step 1: Run Database Setup
Execute the SQL script to create required tables:

```sql
-- Run this in your Supabase SQL Editor
-- File: client/supabase_cleanup_and_setup.sql
```

**OR** confirm destruction by typing exactly:
```
YES DELETE ALL CUSTOM DATA
```

### Step 2: Start Development Server
```bash
npm run dev
```
Server will be available at: http://localhost:8080/

### Step 3: Verify Setup
Run the smoke test to verify everything works:
```bash
node run-smoke-test.js
```

## 🔍 Current Status

### ✅ Working
- Supabase connection
- Environment variables loading
- Vite development server
- Authentication endpoints accessible

### ❌ Needs Database Setup
- Tables: `profiles`, `journals`, `meditations`, `admin_users`
- Row Level Security (RLS) policies
- Database triggers for profile creation

## 📁 Files Modified

1. **`.env.local`** - Created with `VITE_` prefixed variables
2. **`client/lib/supabaseClient.js`** - Updated to use `import.meta.env`
3. **`smoke-test.js`** - Updated email format and env var support
4. **`run-smoke-test.js`** - Created helper script
5. **`debug-supabase.js`** - Created diagnostic script

## 🎯 Next Steps

1. **Create Database Tables**
   - Run the SQL setup script in Supabase dashboard
   - OR confirm with "YES DELETE ALL CUSTOM DATA"

2. **Test Authentication**
   - Try signing up with a real email
   - Verify profile creation
   - Test journal and meditation features

3. **Verify Admin Dashboard**
   - Create admin user in database
   - Access `/admin` route
   - Check analytics and charts

## 🔧 Environment Variables

Your current Supabase configuration:
```env
VITE_SUPABASE_URL=https://sskmosynylcmvaodpfsq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs... (configured)
```

## 🚨 Important Notes

- **Database**: Tables must be created before app functions properly
- **RLS**: Row Level Security policies ensure data privacy
- **Admin**: Admin dashboard requires admin_users table and permissions
- **Environment**: Use `VITE_` prefix for Vite projects (not `REACT_APP_`)

## 📊 Smoke Test Results

Last test showed:
- ✅ 4/16 tests passing (connection & environment)
- ❌ 12/16 failing (missing database tables)

**Expected after database setup**: All 16 tests should pass ✅

---

**Ready to proceed?** Run the database setup SQL script and then test with `npm run dev`!