-- Quick fix for ELMORA Journal functionality
-- Execute this in your Supabase SQL Editor: https://supabase.com/dashboard

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name text,
  email text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create journals table (the main issue)
CREATE TABLE IF NOT EXISTS journals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title text DEFAULT 'Untitled Entry',
  content text NOT NULL,
  mood text DEFAULT 'content',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create meditations table
CREATE TABLE IF NOT EXISTS meditations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  type text DEFAULT 'breathing',
  duration integer DEFAULT 300,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE journals ENABLE ROW LEVEL SECURITY;
ALTER TABLE meditations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create RLS policies for journals
DROP POLICY IF EXISTS "journals_select_own" ON journals;
CREATE POLICY "journals_select_own" ON journals FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "journals_insert_own" ON journals;
CREATE POLICY "journals_insert_own" ON journals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "journals_update_own" ON journals;
CREATE POLICY "journals_update_own" ON journals FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "journals_delete_own" ON journals;
CREATE POLICY "journals_delete_own" ON journals FOR DELETE
  USING (auth.uid() = user_id);

-- Create RLS policies for meditations
DROP POLICY IF EXISTS "meditations_select_own" ON meditations;
CREATE POLICY "meditations_select_own" ON meditations FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "meditations_insert_own" ON meditations;
CREATE POLICY "meditations_insert_own" ON meditations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "meditations_update_own" ON meditations;
CREATE POLICY "meditations_update_own" ON meditations FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "meditations_delete_own" ON meditations;
CREATE POLICY "meditations_delete_own" ON meditations FOR DELETE
  USING (auth.uid() = user_id);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON journals TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON meditations TO authenticated;

-- Create trigger function for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create update triggers
DROP TRIGGER IF EXISTS handle_updated_at_profiles ON profiles;
CREATE TRIGGER handle_updated_at_profiles
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at_journals ON journals;
CREATE TRIGGER handle_updated_at_journals
  BEFORE UPDATE ON journals
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at_meditations ON meditations;
CREATE TRIGGER handle_updated_at_meditations
  BEFORE UPDATE ON meditations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Insert a sample journal entry for testing (you can delete this later)
-- This will only work if there's an authenticated user
-- INSERT INTO journals (content, user_id) 
-- SELECT 'Welcome to your journal! This is a test entry to verify everything is working.', auth.uid()
-- WHERE auth.uid() IS NOT NULL;

SELECT 'ELMORA database setup completed successfully! 🎉' AS message;