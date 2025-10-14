// Quick fix for signup database error
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sskmosynylcmvaodpfsq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNza21vc3lueWxjbXZhb2RwZnNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3OTk3NzIsImV4cCI6MjA3MzM3NTc3Mn0.oh6ZAKvxTs-pIQUzP8lp3DPfpgEl6_vJ4PV4r0MNKmg';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function diagnoseSignupIssue() {
  console.log('🔍 Diagnosing signup database error...\n');

  try {
    // 1. Test profiles table access
    console.log('1️⃣ Testing profiles table...');
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    if (profilesError) {
      console.log('❌ Profiles table error:', profilesError.message);
      
      if (profilesError.message.includes('relation "profiles" does not exist')) {
        console.log('\n🔧 SOLUTION: Run this SQL in Supabase Dashboard:');
        console.log('https://supabase.com/dashboard/project/sskmosynylcmvaodpfsq/sql/new\n');
        
        console.log(`-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  bio text,
  avatar_url text,
  assessment_completed boolean DEFAULT false,
  assessment_score integer,
  assessment_category text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies  
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile trigger
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, user_id) VALUES (NEW.id, NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();`);

      } else if (profilesError.message.includes('permission denied')) {
        console.log('\n🔧 SOLUTION: RLS policy issue. Run this SQL:');
        console.log(`-- Fix RLS policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);`);
      }
      
      return;
    }

    console.log('✅ Profiles table accessible');

    // 2. Test auth signup
    console.log('\n2️⃣ Testing auth signup...');
    const testEmail = `test-fix-${Date.now()}@example.com`;
    
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: 'TestPassword123!',
      options: {
        emailRedirectTo: 'http://localhost:8080/auth/callback'
      }
    });

    if (error) {
      console.log('❌ Auth signup error:', error.message);
      
      if (error.message.includes('Email not confirmed')) {
        console.log('\n✅ This is expected - email confirmation required');
        console.log('   The signup is actually working!');
      } else {
        console.log('\n🔧 SOLUTION: Check Supabase auth settings');
        console.log('   - Go to Authentication > Settings');
        console.log('   - Enable email signup');
        console.log('   - Check email confirmation settings');
      }
    } else {
      console.log('✅ Auth signup working');
      
      if (data.user) {
        console.log('   User ID:', data.user.id);
        
        // Wait for trigger
        setTimeout(async () => {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (profileError) {
            console.log('❌ Profile auto-creation failed:', profileError.message);
          } else {
            console.log('✅ Profile auto-created successfully');
          }
        }, 1000);
      }
    }

    console.log('\n📊 Diagnosis Summary:');
    console.log('====================');
    console.log('If you saw ✅ for both tests above, signup should work!');
    console.log('Try the signup form again at: http://localhost:8080/signup');

  } catch (error) {
    console.error('❌ Diagnosis failed:', error.message);
    console.log('\n🆘 Quick fix options:');
    console.log('1. Check if Supabase project is running');
    console.log('2. Verify environment variables in .env.local');
    console.log('3. Run the SQL commands shown above in Supabase dashboard');
  }
}

diagnoseSignupIssue();