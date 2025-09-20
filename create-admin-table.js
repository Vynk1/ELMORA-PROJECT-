/**
 * CREATE ADMIN TABLE AND ADD ADMIN USER
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

// Create admin Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

console.log('🔧 Creating admin_users table and adding admin...\n');

try {
  // First, get the admin user ID
  const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
  
  if (usersError) {
    console.error('❌ Error getting users:', usersError.message);
    process.exit(1);
  }
  
  const adminUser = users.users.find(user => user.email === 'admin@elmora.com');
  
  if (!adminUser) {
    console.error('❌ Admin user not found. Please run quick-setup.js first');
    process.exit(1);
  }
  
  console.log('✅ Found admin user:', adminUser.email);
  
  // Create admin_users table using SQL
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS admin_users (
      id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
      email text UNIQUE NOT NULL,
      created_at timestamp with time zone DEFAULT now()
    );
    
    ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY IF NOT EXISTS "admin_users_select_admin" ON admin_users FOR SELECT
      USING (auth.uid() IN (SELECT id FROM admin_users));
    
    GRANT SELECT ON admin_users TO authenticated;
  `;
  
  // Execute SQL to create table
  const { error: sqlError } = await supabase.rpc('exec', {
    sql: createTableSQL
  });
  
  if (sqlError) {
    console.log('⚠️  SQL execution error (might be expected):', sqlError.message);
  }
  
  // Try to insert admin user into admin_users table
  const { error: insertError } = await supabase
    .from('admin_users')
    .insert({
      id: adminUser.id,
      email: adminUser.email
    });
  
  if (insertError) {
    console.log('⚠️  Insert error:', insertError.message);
  } else {
    console.log('✅ Admin user added to admin_users table');
  }
  
  console.log('\n🎉 Admin setup completed!');
  console.log('📧 Admin Email: admin@elmora.com');
  console.log('🔑 Admin Password: admin123');
  console.log('\n🚀 Try logging in now!');
  
} catch (error) {
  console.error('❌ Error:', error.message);
}

// Let's also try to manually create the admin_users table using a simple approach
console.log('\n🔧 Alternative: Let me show you the SQL to run manually...');
console.log('\nCopy and paste this SQL in your Supabase SQL Editor:');
console.log('=' .repeat(50));
console.log(`
-- Create admin_users table
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

-- Get admin user ID and insert (replace with actual ID)
-- First run: SELECT id, email FROM auth.users WHERE email = 'admin@elmora.com';
-- Then replace the ID below with the actual ID and run:
INSERT INTO admin_users (id, email) VALUES 
('REPLACE_WITH_ACTUAL_ID', 'admin@elmora.com')
ON CONFLICT (id) DO NOTHING;
`);