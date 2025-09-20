/**
 * TEST AND FIX ADMIN AUTHENTICATION
 * 
 * This script will:
 * 1. Check if admin user exists in auth
 * 2. Create admin_users table if needed
 * 3. Add admin user to admin_users table
 * 4. Test admin authentication
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
const SUPABASE_SERVICE_KEY = envVars.VITE_SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_ANON_KEY = envVars.VITE_SUPABASE_ANON_KEY;

console.log('🔧 TESTING AND FIXING ADMIN AUTHENTICATION...\n');

// Create service role client for admin operations
const serviceClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Create regular client for testing user authentication
const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

try {
  // Step 1: Check if admin user exists in auth
  console.log('👤 Checking admin user in auth...');
  
  const { data: users, error: usersError } = await serviceClient.auth.admin.listUsers();
  if (usersError) throw usersError;
  
  const adminUser = users.users.find(user => user.email === 'admin@elmora.com');
  
  if (!adminUser) {
    console.log('❌ Admin user not found in auth. Creating...');
    
    const { data: newAdmin, error: createError } = await serviceClient.auth.admin.createUser({
      email: 'admin@elmora.com',
      password: 'admin123',
      email_confirm: true,
      user_metadata: { name: 'Admin User' }
    });
    
    if (createError) throw createError;
    console.log('✅ Admin user created in auth');
    adminUser = newAdmin.user;
  } else {
    console.log('✅ Admin user found in auth:', adminUser.email);
    console.log('   ID:', adminUser.id);
  }

  // Step 2: Check if admin_users table exists and has data
  console.log('\n🗄️  Checking admin_users table...');
  
  const { data: adminTableData, error: adminTableError } = await serviceClient
    .from('admin_users')
    .select('*')
    .eq('email', 'admin@elmora.com');
  
  if (adminTableError) {
    console.log('⚠️  Error accessing admin_users table:', adminTableError.message);
    console.log('   This might mean the table doesn\'t exist or has no data');
  } else if (!adminTableData || adminTableData.length === 0) {
    console.log('⚠️  Admin user not found in admin_users table');
    
    // Try to insert admin user
    console.log('   Attempting to add admin to admin_users table...');
    
    const { error: insertError } = await serviceClient
      .from('admin_users')
      .insert({
        id: adminUser.id,
        email: adminUser.email
      });
    
    if (insertError) {
      console.log('❌ Failed to insert admin user:', insertError.message);
    } else {
      console.log('✅ Admin user added to admin_users table');
    }
  } else {
    console.log('✅ Admin user found in admin_users table');
  }

  // Step 3: Test admin login and check
  console.log('\n🔐 Testing admin authentication...');
  
  // Sign in as admin
  const { data: signInData, error: signInError } = await userClient.auth.signInWithPassword({
    email: 'admin@elmora.com',
    password: 'admin123'
  });
  
  if (signInError) {
    console.log('❌ Admin login failed:', signInError.message);
  } else {
    console.log('✅ Admin login successful');
    console.log('   User ID:', signInData.user.id);
    
    // Test admin check
    const { data: adminCheck, error: adminCheckError } = await userClient
      .from('admin_users')
      .select('id')
      .eq('id', signInData.user.id)
      .single();
    
    if (adminCheckError) {
      console.log('❌ Admin check failed:', adminCheckError.message);
    } else {
      console.log('✅ Admin check passed - user has admin access');
    }
  }

  // Step 4: Provide final status and instructions
  console.log('\n' + '='.repeat(60));
  console.log('🎯 ADMIN SETUP STATUS');
  console.log('='.repeat(60));
  
  if (adminUser) {
    console.log('✅ Admin user exists in Supabase Auth');
    console.log('   📧 Email: admin@elmora.com');
    console.log('   🔑 Password: admin123');
    console.log('   🆔 ID:', adminUser.id);
  }
  
  // Check if admin_users table needs manual setup
  const { data: finalCheck } = await serviceClient
    .from('admin_users')
    .select('*')
    .eq('email', 'admin@elmora.com');
  
  if (!finalCheck || finalCheck.length === 0) {
    console.log('\n❌ MANUAL SETUP REQUIRED:');
    console.log('The admin_users table needs to be set up manually.');
    console.log('\nRun this SQL in your Supabase SQL Editor:');
    console.log('─'.repeat(50));
    console.log(`
-- Create admin_users table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY IF NOT EXISTS "admin_users_select_admin" ON admin_users FOR SELECT
  USING (auth.uid() IN (SELECT id FROM admin_users));

-- Grant permissions
GRANT SELECT ON admin_users TO authenticated;

-- Insert admin user
INSERT INTO admin_users (id, email) VALUES 
('${adminUser.id}', 'admin@elmora.com')
ON CONFLICT (id) DO NOTHING;

-- Verify
SELECT * FROM admin_users;
    `);
    console.log('─'.repeat(50));
  } else {
    console.log('\n✅ Admin authentication is fully set up!');
  }
  
  console.log('\n🚀 NEXT STEPS:');
  console.log('1. If manual setup was required, run the SQL above');
  console.log('2. Refresh your browser');
  console.log('3. Login with: admin@elmora.com / admin123');
  console.log('4. Navigate to /admin to access the analytics dashboard');
  console.log('5. You should see charts and user analytics, not the normal site');
  
} catch (error) {
  console.error('\n❌ Error during admin setup:', error.message);
  console.log('\nTry running the manual SQL setup in your Supabase dashboard.');
}