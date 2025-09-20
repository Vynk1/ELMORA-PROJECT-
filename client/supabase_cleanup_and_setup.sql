-- ⚠️ DESTRUCTIVE OPERATION: Clean and recreate Supabase schema for Elmora
-- This will DROP all non-system tables and recreate the required schema

-- DROP non-system tables (safe enumeration)
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT tablename, schemaname
    FROM pg_tables
    WHERE schemaname NOT IN ('pg_catalog','information_schema','pg_toast','pgbouncer','auth','storage')
  LOOP
    EXECUTE format('DROP TABLE IF EXISTS %I.%I CASCADE;', r.schemaname, r.tablename);
    RAISE NOTICE 'Dropped table %.%', r.schemaname, r.tablename;
  END LOOP;
END$$;

-- Enable extension for UUID if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extension of auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name text,
  created_at timestamp with time zone DEFAULT now()
);

-- Create journals table
CREATE TABLE IF NOT EXISTS journals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Create meditations table
CREATE TABLE IF NOT EXISTS meditations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  type text,
  duration integer, -- seconds
  created_at timestamp with time zone DEFAULT now()
);

-- Create admin_users table to gate /admin route
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable Row-Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE journals ENABLE ROW LEVEL SECURITY;
ALTER TABLE meditations ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policies for journals: allow authenticated users to insert/select/update/delete only their own rows
CREATE POLICY "journals_insert_own" ON journals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "journals_select_own" ON journals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "journals_update_own" ON journals FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "journals_delete_own" ON journals FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for meditations: allow authenticated users to insert/select/update/delete only their own rows
CREATE POLICY "meditations_insert_own" ON meditations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "meditations_select_own" ON meditations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "meditations_update_own" ON meditations FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "meditations_delete_own" ON meditations FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for admin_users (only admins can read admin list)
CREATE POLICY "admin_users_select_admin" ON admin_users FOR SELECT
  USING (auth.uid() IN (SELECT id FROM admin_users));

-- Grant minimal permissions
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM authenticated;

-- Grant specific permissions to authenticated users for their tables
GRANT SELECT, INSERT, UPDATE, DELETE ON profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON journals TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON meditations TO authenticated;
GRANT SELECT ON admin_users TO authenticated;

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Create a function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Schema cleanup and setup completed successfully!';
  RAISE NOTICE 'Created tables: profiles, journals, meditations, admin_users';
  RAISE NOTICE 'RLS policies applied for user data isolation';
  RAISE NOTICE 'Auto-profile creation trigger installed';
END$$;