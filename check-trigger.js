// Check and fix the profile creation trigger
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sskmosynylcmvaodpfsq.supabase.co';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNza21vc3lueWxjbXZhb2RwZnNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Nzc5OTc3MiwiZXhwIjoyMDczMzc1NzcyfQ.rKbsWqTxJE3A8vUIR6yb-oPAGGvOjQyUr7jBR7TXIWw';

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkTrigger() {
  console.log('🔍 Checking profile auto-creation trigger...\n');

  try {
    // Check if trigger function exists
    console.log('1️⃣ Checking trigger function...');
    const { data: functions, error: funcError } = await supabase
      .from('information_schema.routines')
      .select('routine_name')
      .eq('routine_name', 'handle_new_user');

    if (funcError || !functions || functions.length === 0) {
      console.log('❌ Trigger function missing!');
      console.log('\n🔧 SOLUTION: Run this SQL in Supabase Dashboard:');
      console.log('https://supabase.com/dashboard/project/sskmosynylcmvaodpfsq/sql/new\n');
      console.log(`-- Create the trigger function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, user_id, display_name, bio, avatar_url, assessment_completed)
  VALUES (NEW.id, NEW.id, '', '', '', false);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();`);
      return;
    }

    console.log('✅ Trigger function exists');

    // Check if trigger exists
    console.log('\n2️⃣ Checking trigger...');
    const { data: triggers, error: trigError } = await supabase
      .from('information_schema.triggers')
      .select('trigger_name')
      .eq('trigger_name', 'on_auth_user_created');

    if (trigError || !triggers || triggers.length === 0) {
      console.log('❌ Trigger missing!');
      console.log('\n🔧 SOLUTION: Run this SQL to create the trigger:');
      console.log(`DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();`);
      return;
    }

    console.log('✅ Trigger exists');

    // Test the trigger by creating a test user directly with service role key
    console.log('\n3️⃣ Testing profile auto-creation...');
    const testEmail = `test-trigger-${Date.now()}@example.com`;
    
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: 'TestPassword123!',
      email_confirm: true
    });

    if (authError) {
      console.log('❌ Failed to create test user:', authError.message);
      return;
    }

    console.log('✅ Test user created:', authData.user.id);

    // Wait and check if profile was created
    setTimeout(async () => {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        console.log('❌ Profile not auto-created:', profileError.message);
        console.log('\n🔧 SOLUTION: The trigger isn\'t working. Run this updated SQL:');
        console.log(`-- Fix the trigger function with better error handling
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, user_id, display_name, bio, avatar_url, assessment_completed)
  VALUES (NEW.id, NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', ''), '', '', false)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();`);
      } else {
        console.log('✅ Profile auto-created successfully!');
        console.log('Profile data:', profile);
      }

      // Cleanup test user
      await supabase.auth.admin.deleteUser(authData.user.id);
      console.log('🧹 Test user cleaned up');
    }, 2000);

  } catch (error) {
    console.error('❌ Check failed:', error.message);
  }
}

checkTrigger();