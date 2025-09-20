# Supabase Database Setup for Elmora

## 🗄️ Database Schema

### Tables Overview

#### 1. **profiles**
- **Purpose**: Extended user profile information
- **Schema**: 
  ```sql
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name text,
  created_at timestamp with time zone DEFAULT now()
  ```
- **RLS**: Users can only access their own profile

#### 2. **journals**
- **Purpose**: Store user journal entries
- **Schema**:
  ```sql
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
  ```
- **RLS**: Users can only CRUD their own journal entries

#### 3. **meditations**
- **Purpose**: Track meditation sessions
- **Schema**:
  ```sql
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  type text, -- 'breathing', 'mindfulness', 'body-scan', etc.
  duration integer, -- Duration in seconds
  created_at timestamp with time zone DEFAULT now()
  ```
- **RLS**: Users can only CRUD their own meditation records

#### 4. **admin_users**
- **Purpose**: Define admin users for administrative access
- **Schema**:
  ```sql
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE,
  created_at timestamp with time zone DEFAULT now()
  ```
- **RLS**: Only admins can view the admin list

---

## 🔒 Row-Level Security (RLS) Policies

### For `profiles` table:
- `profiles_select_own`: Users can view their own profile
- `profiles_insert_own`: Users can create their own profile
- `profiles_update_own`: Users can update their own profile

### For `journals` table:
- `journals_select_own`: Users can view their own journal entries
- `journals_insert_own`: Users can create their own journal entries
- `journals_update_own`: Users can update their own journal entries
- `journals_delete_own`: Users can delete their own journal entries

### For `meditations` table:
- `meditations_select_own`: Users can view their own meditation sessions
- `meditations_insert_own`: Users can create their own meditation records
- `meditations_update_own`: Users can update their own meditation records
- `meditations_delete_own`: Users can delete their own meditation records

### For `admin_users` table:
- `admin_users_select_admin`: Only users in the admin_users table can view the admin list

---

## 🛠️ Database Setup Instructions

### 1. **⚠️ WARNING: Clean Existing Schema**
The setup script will **DELETE ALL CUSTOM TABLES** in your Supabase project. Only system tables (`auth.*`, `storage.*`, etc.) will be preserved.

### 2. **Run the Setup SQL**
Execute the SQL script in `supabase_cleanup_and_setup.sql` in your Supabase SQL Editor:

```sql
-- This script is available in supabase_cleanup_and_setup.sql
-- It will:
-- 1. Drop all non-system tables
-- 2. Create the new schema (profiles, journals, meditations, admin_users)
-- 3. Enable RLS and create policies
-- 4. Set up auto-profile creation trigger
```

### 3. **Verify Setup**
After running the script, verify in your Supabase dashboard:
- ✅ Tables are created: `profiles`, `journals`, `meditations`, `admin_users`
- ✅ RLS is enabled on all tables
- ✅ Policies are visible in the Authentication > Policies section

---

## 👤 Adding Admin Users

To grant admin access to users:

### Method 1: SQL (Recommended)
```sql
-- Add admin user by email
INSERT INTO admin_users (id, email)
SELECT id, email FROM auth.users WHERE email = 'admin@example.com';
```

### Method 2: After User Signs Up
```sql
-- Add admin user by user ID (after they've signed up)
INSERT INTO admin_users (id, email) VALUES (
  'user-uuid-here',
  'admin@example.com'
);
```

---

## 🔌 Frontend Integration

### API Functions (`client/lib/supabaseApi.js`)

#### Journal Functions:
- `addJournal(content)` - Create new journal entry
- `getJournals()` - Fetch user's journal entries
- `updateJournal(id, content)` - Update journal entry
- `deleteJournal(id)` - Delete journal entry

#### Meditation Functions:
- `addMeditation(type, duration)` - Record completed meditation
- `getMeditations()` - Fetch user's meditation history
- `deleteMeditation(id)` - Delete meditation record

#### Profile Functions:
- `getProfile()` - Get user profile
- `updateProfile(updates)` - Update user profile

#### Statistics:
- `getUserStats()` - Get aggregated user statistics

### Example Usage:
```javascript
import { addJournal, getMeditations, getUserStats } from './lib/supabaseApi';

// Add journal entry
const entry = await addJournal("Today was a great day! I learned a lot and felt peaceful during my morning meditation.");

// Get meditation history
const sessions = await getMeditations();

// Get user statistics
const stats = await getUserStats();
console.log(`You've completed ${stats.journalCount} journal entries and ${stats.meditationSessionCount} meditation sessions!`);
```

---

## 🔄 Automatic Features

### 1. **Auto Profile Creation**
- When users sign up, a profile record is automatically created
- Uses the `handle_new_user()` function and trigger

### 2. **Data Isolation**
- RLS ensures users can only see their own data
- No risk of data leakage between users

### 3. **Cascade Deletes**
- If a user is deleted from `auth.users`, all their related data is automatically removed
- Maintains data integrity

---

## 🧪 Testing the Setup

### 1. **Create Test User**
1. Go to `/signup` in your app
2. Create a test account
3. Verify profile is auto-created

### 2. **Test Journal Functionality**
1. Go to `/journal`
2. Create a journal entry
3. Verify it saves and appears in the list
4. Check Supabase dashboard to see the data

### 3. **Test Meditation Tracking**
1. Go to `/meditation`
2. Complete a meditation session
3. Verify it's recorded in your history
4. Check statistics update

### 4. **Test Data Isolation**
1. Create a second user account
2. Login with first account - should only see first user's data
3. Login with second account - should only see second user's data

---

## 🚨 Security Notes

### What's Secure:
- ✅ RLS prevents users from accessing each other's data
- ✅ Authentication required for all operations
- ✅ Input validation in API functions
- ✅ Proper error handling

### What to Monitor:
- 🔍 Watch for authentication bypass attempts
- 🔍 Monitor for unusual data access patterns
- 🔍 Regular security updates to Supabase client library

---

## 📊 Sample Queries

### Get User Activity Summary:
```sql
SELECT 
  COUNT(j.id) as journal_entries,
  COUNT(m.id) as meditation_sessions,
  ROUND(AVG(m.duration)/60) as avg_meditation_minutes
FROM auth.users u
LEFT JOIN journals j ON j.user_id = u.id
LEFT JOIN meditations m ON m.user_id = u.id
WHERE u.id = auth.uid()
GROUP BY u.id;
```

### Get Recent Activity:
```sql
SELECT 
  'journal' as type,
  left(content, 100) as preview,
  created_at
FROM journals 
WHERE user_id = auth.uid()

UNION ALL

SELECT 
  'meditation' as type,
  type || ' (' || ROUND(duration/60) || ' min)' as preview,
  created_at
FROM meditations 
WHERE user_id = auth.uid()

ORDER BY created_at DESC
LIMIT 10;
```

---

## 🔧 Troubleshooting

### Common Issues:

#### "Permission denied for relation"
- **Cause**: RLS is blocking access
- **Fix**: Ensure user is authenticated and policies are correct

#### "Function not found: uuid_generate_v4()"
- **Cause**: uuid-ossp extension not enabled
- **Fix**: Run `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`

#### "Insert violates foreign key constraint"
- **Cause**: Trying to insert data with invalid user_id
- **Fix**: Ensure `auth.uid()` returns valid user ID

#### Frontend shows "Not authenticated" errors
- **Cause**: User session expired or not properly authenticated
- **Fix**: Check authentication context and login state

---

## 📈 Scaling Considerations

### For Large Datasets:
- Add indexes on frequently queried columns
- Consider pagination for large result sets
- Monitor query performance

### Example Indexes:
```sql
-- Speed up journal lookups by date
CREATE INDEX idx_journals_user_created ON journals(user_id, created_at DESC);

-- Speed up meditation statistics
CREATE INDEX idx_meditations_user_type ON meditations(user_id, type, created_at);
```

---

**Status**: ✅ **Ready for Production**

The database schema is fully configured with proper security, data isolation, and automatic profile management. All frontend components are integrated with the Supabase API.