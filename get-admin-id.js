/**
 * GET ADMIN USER ID FOR MANUAL SETUP
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

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

try {
  // Get the admin user
  const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
  
  if (usersError) {
    console.error('❌ Error getting users:', usersError.message);
    process.exit(1);
  }
  
  const adminUser = users.users.find(user => user.email === 'admin@elmora.com');
  
  if (!adminUser) {
    console.error('❌ Admin user not found');
    process.exit(1);
  }
  
  console.log('✅ Admin user found!');
  console.log('📧 Email:', adminUser.email);
  console.log('🆔 ID:', adminUser.id);
  console.log('🔑 Password: admin123');
  
  console.log('\n' + '='.repeat(60));
  console.log('📝 COPY THIS SQL TO SUPABASE SQL EDITOR:');
  console.log('='.repeat(60));
  
  const sql = `
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

-- Insert admin user
INSERT INTO admin_users (id, email) VALUES 
('${adminUser.id}', 'admin@elmora.com')
ON CONFLICT (id) DO NOTHING;

-- Verify admin user was added
SELECT * FROM admin_users;
`;
  
  console.log(sql);
  
  console.log('='.repeat(60));
  console.log('🚀 INSTRUCTIONS:');
  console.log('1. Go to https://supabase.com/dashboard');
  console.log('2. Select your project');
  console.log('3. Go to SQL Editor');
  console.log('4. Copy and paste the SQL above');
  console.log('5. Click "Run"');
  console.log('6. Refresh your Elmora app and login with:');
  console.log('   📧 admin@elmora.com');
  console.log('   🔑 admin123');
  
} catch (error) {
  console.error('❌ Error:', error.message);
}