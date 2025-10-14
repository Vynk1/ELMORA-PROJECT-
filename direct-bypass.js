// Direct bypass using browser session
console.log('🔧 Direct Bypass Script - Run this in Browser Console');
console.log('1. Open browser Developer Tools (F12)');
console.log('2. Go to Console tab');  
console.log('3. Copy and paste the code below:');
console.log('');
console.log('// ===== COPY FROM HERE =====');
console.log(`
// Direct browser bypass for onboarding
(async function() {
  console.log('🔧 Bypassing onboarding...');
  
  // Get Supabase client from window (if available)
  const supabaseUrl = 'https://sskmosynylcmvaodpfsq.supabase.co';
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNza21vc3lueWxjbXZhb2RwZnNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3OTk3NzIsImV4cCI6MjA3MzM3NTc3Mn0.oh6ZAKvxTs-pIQUzP8lp3DPfpgEl6_vJ4PV4r0MNKmg';
  
  // Create Supabase client
  const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  try {
    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session?.user) {
      console.log('❌ No active session found');
      return;
    }
    
    console.log('✅ Found user:', session.user.email);
    
    // Update profile without assessment_category first
    const { error: updateError1 } = await supabase
      .from('profiles')
      .update({ 
        assessment_completed: true,
        display_name: 'Test User',
        assessment_score: 75
      })
      .eq('user_id', session.user.id);
      
    if (updateError1) {
      console.log('❌ First update failed:', updateError1.message);
      return;
    }
    
    console.log('✅ Profile updated successfully!');
    console.log('🎉 Onboarding bypassed! Redirecting to dashboard...');
    
    // Redirect to dashboard
    window.location.href = '/dashboard';
    
  } catch (error) {
    console.error('❌ Bypass failed:', error);
  }
})();
`);
console.log('// ===== COPY UNTIL HERE =====');
console.log('');
console.log('4. Press Enter to run');
console.log('5. You should be redirected to dashboard!');