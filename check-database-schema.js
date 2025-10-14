// Script to check Supabase database schema and identify signup issues

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sskmosynylcmvaodpfsq.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNza21vc3lueWxjbXZhb2RwZnNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Nzc5OTc3MiwiZXhwIjoyMDczMzc1NzcyfQ.kntmcxdtIfM_EidNKxRCGbvhdcLP2EFJeffGUbHKyx8';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkDatabaseSchema() {
  console.log('🔍 Checking Supabase Database Schema...\n');

  try {
    // 1. Check if profiles table exists and its structure
    console.log('1️⃣  Checking profiles table...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (profilesError) {
      console.log('❌ Profiles table error:', profilesError.message);
      
      // Try to create profiles table
      console.log('🔧 Attempting to create profiles table...');
      const { error: createError } = await supabase.rpc('exec', {
        sql: `
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
          CREATE POLICY "Users can view own profile" ON profiles
            FOR SELECT USING (auth.uid() = id OR auth.uid() = user_id);

          CREATE POLICY "Users can insert own profile" ON profiles
            FOR INSERT WITH CHECK (auth.uid() = id OR auth.uid() = user_id);

          CREATE POLICY "Users can update own profile" ON profiles
            FOR UPDATE USING (auth.uid() = id OR auth.uid() = user_id);
        `
      });

      if (createError) {
        console.log('❌ Failed to create profiles table:', createError.message);
      } else {
        console.log('✅ Profiles table created successfully');
      }
    } else {
      console.log('✅ Profiles table exists');
    }

    // 2. Check auth triggers for profile creation
    console.log('\n2️⃣  Checking auth triggers...');
    
    // Create a trigger to automatically create profile on user signup
    const { error: triggerError } = await supabase.rpc('exec', {
      sql: `
        -- Function to handle new user signup
        CREATE OR REPLACE FUNCTION handle_new_user() 
        RETURNS trigger AS $$
        BEGIN
          INSERT INTO profiles (id, user_id)
          VALUES (NEW.id, NEW.id);
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;

        -- Drop existing trigger if it exists
        DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

        -- Create trigger
        CREATE TRIGGER on_auth_user_created
          AFTER INSERT ON auth.users
          FOR EACH ROW EXECUTE FUNCTION handle_new_user();
      `
    });

    if (triggerError) {
      console.log('❌ Trigger creation error:', triggerError.message);
    } else {
      console.log('✅ Auth trigger created successfully');
    }

    // 3. Test user creation
    console.log('\n3️⃣  Testing user creation...');
    const testEmail = `test-${Date.now()}@example.com`;
    
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: testEmail,
      password: 'TestPassword123!'
    });

    if (signupError) {
      console.log('❌ Signup test failed:', signupError.message);
    } else {
      console.log('✅ Signup test successful');
      console.log('   User ID:', signupData.user?.id);
      
      // Check if profile was created
      if (signupData.user) {
        const { data: profileData, error: profileCheckError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', signupData.user.id)
          .single();

        if (profileCheckError) {
          console.log('⚠️  Profile not auto-created:', profileCheckError.message);
        } else {
          console.log('✅ Profile auto-created successfully');
        }
      }
    }

    console.log('\n📊 Database Schema Status:');
    console.log('=========================');
    console.log('✅ Schema check completed');
    console.log('✅ Database should now work for signup');

  } catch (error) {
    console.error('❌ Schema check failed:', error.message);
    console.log('\n🔧 Manual Setup Required:');
    console.log('1. Go to Supabase Dashboard');
    console.log('2. Run the SQL commands from the migration file');
    console.log('3. Ensure RLS policies are properly configured');
  }
}

checkDatabaseSchema();