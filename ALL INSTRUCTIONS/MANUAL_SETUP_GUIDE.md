# 🚀 Elmora Database Setup Guide

## Quick Setup (Manual Method) - RECOMMENDED

Since you have the database error showing "Could not find the table 'public.journals'", here's the fastest way to get your Elmora app working:

### Step 1: Go to Supabase Dashboard

1. Visit: https://supabase.com/dashboard
2. Select your project: `sskmosynylcmvaodpfsq`
3. Go to **SQL Editor** (in the left sidebar)

### Step 2: Execute the Setup SQL

1. Click **"New Query"**
2. Copy the entire contents of `setup-database-with-mock-data.sql` 
3. Paste it into the SQL editor
4. Click **"Run"** button

### Step 3: Verify Setup

The script will create:
- ✅ All required tables (profiles, journals, meditations, admin_users)
- ✅ Row Level Security policies
- ✅ 10 mock users with sample data
- ✅ 1 admin user

## 📋 Login Credentials Created

### 🔑 Admin Access
```
Email: admin@elmora.com
Password: admin123
```

### 👥 Mock Users (all use password: `password123`)
- alice.johnson@example.com
- bob.smith@example.com
- carol.williams@example.com
- david.brown@example.com
- eva.davis@example.com
- frank.miller@example.com
- grace.wilson@example.com
- henry.moore@example.com
- ivy.taylor@example.com
- jack.anderson@example.com

## 🎯 What You'll Get

### Mock Data Included:
- **15+ Journal Entries** - Various moods and content across different users
- **20+ Meditation Sessions** - Different types (breathing, mindfulness, etc.) and durations
- **Date Distribution** - Entries spread across the past week for realistic analytics
- **Admin Analytics** - All data visible in the admin dashboard

### Features Ready to Test:
- ✅ User authentication and profiles
- ✅ Personal journal entries (users see only their own)
- ✅ Meditation session tracking
- ✅ Admin dashboard with analytics and charts
- ✅ Row Level Security (data isolation between users)

## 🔥 After Setup

1. **Restart your dev server**: `npm run dev`
2. **Login as admin**: Go to `/admin` and use admin credentials
3. **Test analytics**: See user growth, journal activity, meditation trends
4. **Login as regular user**: Test personal data access
5. **Add new entries**: Test journal and meditation features

## 🎨 Expected Results

### Journal Page Should Show:
- Total entries count
- This month count  
- Day streak
- Most common mood
- List of journal entries

### Admin Dashboard Should Show:
- User analytics and growth charts
- Journal and meditation activity trends
- Top active users leaderboard
- Key performance metrics

## 🚨 If You Still See Issues

If the "Failed to load journal entries" error persists:

1. **Check Browser Console** - Look for any JavaScript errors
2. **Verify Tables Exist** - In Supabase Dashboard > Table Editor
3. **Test Authentication** - Try logging out and back in
4. **Run Smoke Test** - Execute `node run-smoke-test.js`

---

**Ready to proceed?** Just run the SQL script in your Supabase dashboard and refresh your app!