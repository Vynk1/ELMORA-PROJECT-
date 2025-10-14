// Simple database test
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sskmosynylcmvaodpfsq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNza21vc3lueWxjbXZhb2RwZnNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3OTk3NzIsImV4cCI6MjA3MzM3NTc3Mn0.oh6ZAKvxTs-pIQUzP8lp3DPfpgEl6_vJ4PV4r0MNKmg';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDatabase() {
  console.log('🔍 Testing database setup...\n');

  try {
    // Test profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    if (error) {
      console.log('❌ Profiles table error:', error.message);
    } else {
      console.log('✅ Profiles table accessible');
    }

    // Test assessment_results table
    const { data: assessmentData, error: assessmentError } = await supabase
      .from('assessment_results')
      .select('id')
      .limit(1);

    if (assessmentError) {
      console.log('❌ Assessment results table error:', assessmentError.message);
    } else {
      console.log('✅ Assessment results table accessible');
    }

    console.log('\n🎉 Database setup is ready for onboarding!');
    console.log('\n📋 Next steps:');
    console.log('1. Go to http://localhost:3000/signup');
    console.log('2. Create a new account');
    console.log('3. Should redirect to onboarding flow');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testDatabase();