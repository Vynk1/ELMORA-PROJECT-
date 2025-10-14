// Quick bypass script to manually complete onboarding for testing
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sskmosynylcmvaodpfsq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNza21vc3lueWxjbXZhb2RwZnNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3OTk3NzIsImV4cCI6MjA3MzM3NTc3Mn0.oh6ZAKvxTs-pIQUzP8lp3DPfpgEl6_vJ4PV4r0MNKmg';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function bypassOnboarding() {
  console.log('🔧 Bypassing onboarding to access dashboard...\n');

  try {
    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session?.user) {
      console.log('❌ No active session found. Please sign in first.');
      return;
    }

    console.log('✅ Found active user:', session.user.email);

    // Update user profile to mark onboarding as completed
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        assessment_completed: true,
        display_name: 'Test User',
        assessment_score: 75,
        assessment_category: 'Thriving'
      })
      .eq('user_id', session.user.id);

    if (updateError) {
      console.log('❌ Failed to update profile:', updateError.message);
      return;
    }

    console.log('✅ Onboarding marked as completed!');
    console.log('\n🎉 You can now access the dashboard!');
    console.log('📍 Go to: http://localhost:3000/dashboard');
    console.log('🔄 Or refresh the current page to be redirected automatically.');

  } catch (error) {
    console.error('❌ Bypass failed:', error.message);
  }
}

bypassOnboarding();