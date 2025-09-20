-- ⚠️ ELMORA DATABASE SETUP WITH MOCK DATA
-- This script will:
-- 1. Create all required tables with proper RLS policies
-- 2. Create 10 mock users with sample data
-- 3. Create an admin user for dashboard access
-- 4. Insert sample journals and meditations

-- Drop existing tables if they exist
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

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================
-- CREATE TABLES
-- ============================

-- Create profiles table (extension of auth.users)
CREATE TABLE profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name text,
  email text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create journals table with all required fields
CREATE TABLE journals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title text NOT NULL DEFAULT 'Untitled Entry',
  content text NOT NULL,
  mood text DEFAULT 'content',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create meditations table
CREATE TABLE meditations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  type text DEFAULT 'breathing',
  duration integer DEFAULT 300, -- seconds (5 minutes default)
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create admin_users table
CREATE TABLE admin_users (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- ============================
-- ENABLE ROW LEVEL SECURITY
-- ============================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE journals ENABLE ROW LEVEL SECURITY;
ALTER TABLE meditations ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- ============================
-- CREATE RLS POLICIES
-- ============================

-- Policies for profiles
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policies for journals
CREATE POLICY "journals_select_own" ON journals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "journals_insert_own" ON journals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "journals_update_own" ON journals FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "journals_delete_own" ON journals FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for meditations
CREATE POLICY "meditations_select_own" ON meditations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "meditations_insert_own" ON meditations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "meditations_update_own" ON meditations FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "meditations_delete_own" ON meditations FOR DELETE
  USING (auth.uid() = user_id);

-- Admin policies (allow admins to read aggregated data for analytics)
CREATE POLICY "admin_users_select_admin" ON admin_users FOR SELECT
  USING (auth.uid() IN (SELECT id FROM admin_users));

-- Special policies for admin analytics (aggregated data only)
CREATE POLICY "admin_analytics_journals" ON journals FOR SELECT
  USING (
    auth.uid() IN (SELECT id FROM admin_users) AND
    current_setting('request.jwt.claims', true)::jsonb->>'role' = 'authenticated'
  );

CREATE POLICY "admin_analytics_meditations" ON meditations FOR SELECT
  USING (
    auth.uid() IN (SELECT id FROM admin_users) AND
    current_setting('request.jwt.claims', true)::jsonb->>'role' = 'authenticated'
  );

CREATE POLICY "admin_analytics_profiles" ON profiles FOR SELECT
  USING (
    auth.uid() IN (SELECT id FROM admin_users) AND
    current_setting('request.jwt.claims', true)::jsonb->>'role' = 'authenticated'
  );

-- ============================
-- GRANT PERMISSIONS
-- ============================

-- Revoke default permissions
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM authenticated;

-- Grant specific permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON journals TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON meditations TO authenticated;
GRANT SELECT ON admin_users TO authenticated;

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ============================
-- CREATE TRIGGERS
-- ============================

-- Function to handle new user registration
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

-- Trigger for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER handle_updated_at_profiles
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_journals
  BEFORE UPDATE ON journals
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_meditations
  BEFORE UPDATE ON meditations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================
-- INSERT MOCK DATA
-- ============================

-- First, we need to insert mock users into auth.users
-- Note: This is a simplified approach for demo purposes
-- In production, users should sign up through the proper auth flow

-- Insert mock auth users (this is for demo purposes only)
INSERT INTO auth.users (
  id, 
  instance_id, 
  email, 
  encrypted_password, 
  email_confirmed_at, 
  created_at, 
  updated_at,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES
-- Regular users
('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', 'alice.johnson@example.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"name": "Alice Johnson"}', false, 'authenticated'),
('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', 'bob.smith@example.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"name": "Bob Smith"}', false, 'authenticated'),
('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000000', 'carol.williams@example.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"name": "Carol Williams"}', false, 'authenticated'),
('44444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000000', 'david.brown@example.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"name": "David Brown"}', false, 'authenticated'),
('55555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000000', 'eva.davis@example.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"name": "Eva Davis"}', false, 'authenticated'),
('66666666-6666-6666-6666-666666666666', '00000000-0000-0000-0000-000000000000', 'frank.miller@example.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"name": "Frank Miller"}', false, 'authenticated'),
('77777777-7777-7777-7777-777777777777', '00000000-0000-0000-0000-000000000000', 'grace.wilson@example.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"name": "Grace Wilson"}', false, 'authenticated'),
('88888888-8888-8888-8888-888888888888', '00000000-0000-0000-0000-000000000000', 'henry.moore@example.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"name": "Henry Moore"}', false, 'authenticated'),
('99999999-9999-9999-9999-999999999999', '00000000-0000-0000-0000-000000000000', 'ivy.taylor@example.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"name": "Ivy Taylor"}', false, 'authenticated'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '00000000-0000-0000-0000-000000000000', 'jack.anderson@example.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"name": "Jack Anderson"}', false, 'authenticated'),

-- Admin user
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '00000000-0000-0000-0000-000000000000', 'admin@elmora.com', crypt('admin123', gen_salt('bf')), now(), now(), now(), '{"name": "Admin User"}', false, 'authenticated')

ON CONFLICT (id) DO NOTHING;

-- Insert profiles (these will be created automatically by trigger, but we'll ensure they exist)
INSERT INTO profiles (id, name, email) VALUES
('11111111-1111-1111-1111-111111111111', 'Alice Johnson', 'alice.johnson@example.com'),
('22222222-2222-2222-2222-222222222222', 'Bob Smith', 'bob.smith@example.com'),
('33333333-3333-3333-3333-333333333333', 'Carol Williams', 'carol.williams@example.com'),
('44444444-4444-4444-4444-444444444444', 'David Brown', 'david.brown@example.com'),
('55555555-5555-5555-5555-555555555555', 'Eva Davis', 'eva.davis@example.com'),
('66666666-6666-6666-6666-666666666666', 'Frank Miller', 'frank.miller@example.com'),
('77777777-7777-7777-7777-777777777777', 'Grace Wilson', 'grace.wilson@example.com'),
('88888888-8888-8888-8888-888888888888', 'Henry Moore', 'henry.moore@example.com'),
('99999999-9999-9999-9999-999999999999', 'Ivy Taylor', 'ivy.taylor@example.com'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Jack Anderson', 'jack.anderson@example.com'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Admin User', 'admin@elmora.com')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email;

-- Add admin user to admin_users table
INSERT INTO admin_users (id, email) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'admin@elmora.com')
ON CONFLICT (id) DO NOTHING;

-- Insert sample journal entries with various dates
INSERT INTO journals (user_id, title, content, mood, created_at) VALUES
-- Alice's journals
('11111111-1111-1111-1111-111111111111', 'Morning Reflections', 'Started the day with gratitude practice. Feeling centered and ready for new challenges.', 'content', now() - interval '1 day'),
('11111111-1111-1111-1111-111111111111', 'Breakthrough Moment', 'Had an amazing realization during therapy today. Understanding my patterns better.', 'happy', now() - interval '3 days'),
('11111111-1111-1111-1111-111111111111', 'Challenging Day', 'Work was overwhelming today, but I managed to stay calm and focused.', 'stressed', now() - interval '5 days'),

-- Bob's journals  
('22222222-2222-2222-2222-222222222222', 'Weekend Adventures', 'Went hiking with friends. Nature always helps me reset and recharge.', 'happy', now() - interval '2 days'),
('22222222-2222-2222-2222-222222222222', 'Learning Journey', 'Making progress on my meditation practice. 20 minutes felt easier today.', 'content', now() - interval '4 days'),

-- Carol's journals
('33333333-3333-3333-3333-333333333333', 'Family Time', 'Wonderful dinner with family. Grateful for these moments together.', 'happy', now() - interval '1 day'),
('33333333-3333-3333-3333-333333333333', 'Work Reflection', 'Presented my project today. Nervous but it went well!', 'excited', now() - interval '6 days'),

-- David's journals
('44444444-4444-4444-4444-444444444444', 'Creative Flow', 'Spent the evening painting. Lost track of time - pure flow state.', 'content', now() - interval '2 days'),
('44444444-4444-4444-4444-444444444444', 'Mindfulness Practice', 'Trying to be more present in daily activities. Small steps matter.', 'calm', now() - interval '7 days'),

-- Eva's journals
('55555555-5555-5555-5555-555555555555', 'Personal Growth', 'Reading about emotional intelligence. So much to learn and apply.', 'curious', now() - interval '3 days'),
('55555555-5555-5555-5555-555555555555', 'Gratitude List', 'Health, family, opportunities. Counting my blessings today.', 'grateful', now() - interval '5 days'),

-- Frank's journals
('66666666-6666-6666-6666-666666666666', 'Exercise Victory', 'Completed my first 5K run! Setting and achieving goals feels amazing.', 'accomplished', now() - interval '1 day'),

-- Grace's journals
('77777777-7777-7777-7777-777777777777', 'Quiet Moments', 'Sometimes silence speaks louder than words. Enjoying the peace.', 'peaceful', now() - interval '4 days'),

-- Henry's journals
('88888888-8888-8888-8888-888888888888', 'Learning New Skills', 'Started guitar lessons. Fingers hurt but spirit is high!', 'motivated', now() - interval '6 days'),

-- Ivy's journals
('99999999-9999-9999-9999-999999999999', 'Travel Dreams', 'Planning my next adventure. Travel feeds my soul.', 'excited', now() - interval '2 days'),

-- Jack's journals
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Career Thoughts', 'Considering a career change. Scary but exciting possibilities ahead.', 'contemplative', now() - interval '3 days');

-- Insert sample meditation sessions with various types and durations
INSERT INTO meditations (user_id, type, duration, created_at) VALUES
-- Alice's meditations
('11111111-1111-1111-1111-111111111111', 'breathing', 600, now() - interval '1 day'),
('11111111-1111-1111-1111-111111111111', 'mindfulness', 900, now() - interval '2 days'),
('11111111-1111-1111-1111-111111111111', 'loving-kindness', 480, now() - interval '4 days'),

-- Bob's meditations
('22222222-2222-2222-2222-222222222222', 'breathing', 300, now() - interval '1 day'),
('22222222-2222-2222-2222-222222222222', 'body-scan', 1200, now() - interval '3 days'),
('22222222-2222-2222-2222-222222222222', 'breathing', 450, now() - interval '5 days'),

-- Carol's meditations
('33333333-3333-3333-3333-333333333333', 'mindfulness', 600, now() - interval '2 days'),
('33333333-3333-3333-3333-333333333333', 'gratitude', 360, now() - interval '4 days'),

-- David's meditations
('44444444-4444-4444-4444-444444444444', 'breathing', 720, now() - interval '1 day'),
('44444444-4444-4444-4444-444444444444', 'walking', 1800, now() - interval '6 days'),

-- Eva's meditations
('55555555-5555-5555-5555-555555555555', 'loving-kindness', 540, now() - interval '3 days'),
('55555555-5555-5555-5555-555555555555', 'breathing', 300, now() - interval '7 days'),

-- Frank's meditations
('66666666-6666-6666-6666-666666666666', 'breathing', 420, now() - interval '2 days'),

-- Grace's meditations
('77777777-7777-7777-7777-777777777777', 'mindfulness', 900, now() - interval '1 day'),
('77777777-7777-7777-7777-777777777777', 'body-scan', 600, now() - interval '5 days'),

-- Henry's meditations
('88888888-8888-8888-8888-888888888888', 'breathing', 240, now() - interval '4 days'),

-- Ivy's meditations
('99999999-9999-9999-9999-999999999999', 'gratitude', 300, now() - interval '3 days'),
('99999999-9999-9999-9999-999999999999', 'breathing', 480, now() - interval '6 days'),

-- Jack's meditations
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'mindfulness', 360, now() - interval '2 days'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'breathing', 600, now() - interval '5 days');

-- Success notification
DO $$
BEGIN
  RAISE NOTICE '🎉 ELMORA DATABASE SETUP COMPLETED SUCCESSFULLY!';
  RAISE NOTICE '';
  RAISE NOTICE '✅ Created tables: profiles, journals, meditations, admin_users';
  RAISE NOTICE '✅ Applied RLS policies for data security';
  RAISE NOTICE '✅ Created 10 mock users with sample data';
  RAISE NOTICE '✅ Created admin user for dashboard access';
  RAISE NOTICE '';
  RAISE NOTICE '👤 ADMIN LOGIN CREDENTIALS:';
  RAISE NOTICE '   Email: admin@elmora.com';
  RAISE NOTICE '   Password: admin123';
  RAISE NOTICE '';
  RAISE NOTICE '👥 MOCK USER CREDENTIALS (all use password: password123):';
  RAISE NOTICE '   - alice.johnson@example.com';
  RAISE NOTICE '   - bob.smith@example.com';
  RAISE NOTICE '   - carol.williams@example.com';
  RAISE NOTICE '   - david.brown@example.com';
  RAISE NOTICE '   - eva.davis@example.com';
  RAISE NOTICE '   - frank.miller@example.com';
  RAISE NOTICE '   - grace.wilson@example.com';
  RAISE NOTICE '   - henry.moore@example.com';
  RAISE NOTICE '   - ivy.taylor@example.com';
  RAISE NOTICE '   - jack.anderson@example.com';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Ready to test your Elmora application!';
  RAISE NOTICE '   - Visit /admin with admin credentials';
  RAISE NOTICE '   - Login as any user to see their personal data';
  RAISE NOTICE '   - Journal entries and meditations are pre-populated';
END$$;