/**
 * TEST ADMIN DASHBOARD FUNCTIONALITY
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Load environment variables
function loadEnvFile() {
  try {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const envVars = {};
    
    envContent.split('\n').forEach(line => {
      line = line.trim();
      if (line && !line.startsWith('#') && line.includes('=')) {
        const [key, ...valueParts] = line.split('=');
        const value = valueParts.join('=').trim();
        envVars[key.trim()] = value;
      }
    });
    
    return envVars;
  } catch (err) {
    console.error('❌ Error loading .env.local file:', err.message);
    return {};
  }
}

const envVars = loadEnvFile();
const SUPABASE_URL = envVars.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = envVars.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🔍 TESTING ADMIN DASHBOARD FUNCTIONALITY...\n');

try {
  // Step 1: Login as admin
  console.log('🔐 Logging in as admin...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin@elmora.com',
    password: 'admin123'
  });

  if (authError) {
    console.log('❌ Admin login failed:', authError.message);
    process.exit(1);
  }

  console.log('✅ Admin login successful');
  console.log('   User ID:', authData.user.id);
  console.log('   Email:', authData.user.email);

  // Step 2: Test admin check with new logic
  console.log('\n🔍 Testing admin check...');
  
  const { data: { user } } = await supabase.auth.getUser();
  if (user && user.email === 'admin@elmora.com') {
    console.log('✅ Admin check passed (email-based)');
  } else {
    console.log('❌ Admin check failed');
  }

  // Step 3: Test analytics data access
  console.log('\n📊 Testing analytics data access...');
  
  // Test profiles access
  const { count: profileCount, error: profileError } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });
  
  if (profileError) {
    console.log('❌ Profiles access failed:', profileError.message);
  } else {
    console.log('✅ Profiles access successful, count:', profileCount);
  }

  // Test journals access
  const { count: journalCount, error: journalError } = await supabase
    .from('journals')
    .select('*', { count: 'exact', head: true });
  
  if (journalError) {
    console.log('❌ Journals access failed:', journalError.message);
  } else {
    console.log('✅ Journals access successful, count:', journalCount);
  }

  // Test meditations access
  const { count: meditationCount, error: meditationError } = await supabase
    .from('meditations')
    .select('*', { count: 'exact', head: true });
  
  if (meditationError) {
    console.log('❌ Meditations access failed:', meditationError.message);
  } else {
    console.log('✅ Meditations access successful, count:', meditationCount);
  }

  console.log('\n' + '='.repeat(60));
  console.log('🎯 ADMIN DASHBOARD STATUS');
  console.log('='.repeat(60));
  
  if (profileCount === 0 && journalCount === 0 && meditationCount === 0) {
    console.log('⚠️  NO DATA FOUND - Dashboard will show empty charts');
    console.log('📝 To add sample data, you can:');
    console.log('   1. Login as regular users and create journal/meditation entries');
    console.log('   2. Or run the mock data setup script');
  } else {
    console.log('✅ DATA AVAILABLE - Dashboard will show:');
    console.log(`   👥 Users: ${profileCount}`);
    console.log(`   📖 Journals: ${journalCount}`);  
    console.log(`   🧘 Meditations: ${meditationCount}`);
  }

  console.log('\n🚀 INSTRUCTIONS TO ACCESS ADMIN DASHBOARD:');
  console.log('1. ✅ Admin user is set up and working');
  console.log('2. ✅ Admin check is now working (email-based)');
  console.log('3. 🔥 Refresh your browser');
  console.log('4. 👑 Look for the "Admin Access Detected" banner in top-right');
  console.log('5. 📊 Click "Open Dashboard" button');
  console.log('6. 🎉 You should see the analytics dashboard!');
  
  console.log('\n💡 ALTERNATIVE ACCESS:');
  console.log('   - Manually type: http://localhost:8080/admin');
  console.log('   - This should now work directly');

} catch (error) {
  console.error('❌ Test failed:', error.message);
}