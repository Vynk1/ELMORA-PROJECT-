/**
 * SUPABASE DEBUG SCRIPT
 * 
 * This script helps diagnose Supabase connection issues
 * Run with: node debug-supabase.js
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

console.log('🔍 SUPABASE DEBUG DIAGNOSTICS\n');
console.log('='.repeat(50));

// Check environment files
console.log('📁 Environment Files Check:');
const envFiles = [
  '.env',
  '.env.local', 
  'client/.env.local',
  'client/.env.local.example'
];

envFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`   ${file}: ${exists ? '✅ EXISTS' : '❌ MISSING'}`);
});

console.log('\n' + '='.repeat(50));

// Load environment variables from client/.env.local
console.log('🔧 Loading Environment Variables:');
let supabaseUrl, supabaseAnonKey;

try {
  const envContent = fs.readFileSync('client/.env.local', 'utf8');
  const envLines = envContent.split('\n');
  
  envLines.forEach(line => {
    if (line.startsWith('REACT_APP_SUPABASE_URL=')) {
      supabaseUrl = line.split('=')[1].trim();
      console.log(`   SUPABASE_URL: ${supabaseUrl}`);
    }
    if (line.startsWith('REACT_APP_SUPABASE_ANON_KEY=')) {
      supabaseAnonKey = line.split('=')[1].trim();
      console.log(`   SUPABASE_ANON_KEY: ${supabaseAnonKey ? supabaseAnonKey.substring(0, 20) + '...' : 'MISSING'}`);
    }
  });
} catch (err) {
  console.log(`   ❌ Error reading client/.env.local: ${err.message}`);
}

console.log('\n' + '='.repeat(50));

// Test Supabase connection
console.log('🌐 Testing Supabase Connection:');

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('   ❌ Missing required environment variables');
  console.log('   Please ensure client/.env.local has REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY');
  process.exit(1);
}

try {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log('   ✅ Supabase client created successfully');
  
  // Test connection
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.log(`   ⚠️  Auth session error: ${error.message}`);
  } else {
    console.log('   ✅ Auth endpoint accessible');
  }
  
  // Test database access
  console.log('\n📊 Testing Database Access:');
  
  // Check if tables exist
  const tables = ['profiles', 'journals', 'meditations', 'admin_users'];
  
  for (const table of tables) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`   ❌ ${table}: ${error.message}`);
      } else {
        console.log(`   ✅ ${table}: accessible (${count || 0} rows)`);
      }
    } catch (err) {
      console.log(`   ❌ ${table}: ${err.message}`);
    }
  }
  
} catch (err) {
  console.log(`   ❌ Supabase connection failed: ${err.message}`);
}

console.log('\n' + '='.repeat(50));
console.log('🎯 RECOMMENDATIONS:');

if (process.env.NODE_ENV !== 'production') {
  console.log('   1. For Vite (not Create React App), use VITE_ prefix instead of REACT_APP_');
  console.log('   2. Create a new .env.local in the root directory with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  console.log('   3. Update supabaseClient.js to use import.meta.env instead of process.env');
}

console.log('   4. Ensure your Supabase project is active and accessible');
console.log('   5. Verify your database tables exist and have proper RLS policies');
console.log('   6. Run the smoke test after fixing environment variables');