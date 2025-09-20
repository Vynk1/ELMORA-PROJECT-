/**
 * QUICK ELMORA DATABASE SETUP
 * 
 * This script uses the service role key to create admin and mock users
 * Run with: node quick-setup.js
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

console.log('🚀 ELMORA QUICK SETUP STARTING...\n');

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Need VITE_SUPABASE_URL and VITE_SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create admin Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

console.log('✅ Connected with service role key');
console.log('🔧 Setting up database...\n');

try {
  // Step 1: Create the admin user through Auth API
  console.log('👤 Creating admin user...');
  
  const { data: adminAuth, error: adminAuthError } = await supabase.auth.admin.createUser({
    email: 'admin@elmora.com',
    password: 'admin123',
    email_confirm: true,
    user_metadata: {
      name: 'Admin User'
    }
  });

  if (adminAuthError) {
    console.log('⚠️  Admin user might already exist:', adminAuthError.message);
  } else {
    console.log('✅ Admin user created successfully');
    
    // Add to admin_users table
    const { error: adminTableError } = await supabase
      .from('admin_users')
      .insert({
        id: adminAuth.user.id,
        email: 'admin@elmora.com'
      });
    
    if (adminTableError) {
      console.log('⚠️  Admin table insert error:', adminTableError.message);
    } else {
      console.log('✅ Admin user added to admin_users table');
    }
  }

  // Step 2: Create some mock users
  console.log('\n👥 Creating mock users...');
  
  const mockUsers = [
    { email: 'alice.johnson@example.com', name: 'Alice Johnson' },
    { email: 'bob.smith@example.com', name: 'Bob Smith' },
    { email: 'carol.williams@example.com', name: 'Carol Williams' }
  ];

  for (const mockUser of mockUsers) {
    try {
      const { data: userAuth, error: userError } = await supabase.auth.admin.createUser({
        email: mockUser.email,
        password: 'password123',
        email_confirm: true,
        user_metadata: {
          name: mockUser.name
        }
      });

      if (userError) {
        console.log(`⚠️  User ${mockUser.email} might already exist`);
      } else {
        console.log(`✅ Created user: ${mockUser.email}`);
        
        // Add sample journal entry
        const { error: journalError } = await supabase
          .from('journals')
          .insert({
            user_id: userAuth.user.id,
            title: 'Sample Entry',
            content: `This is a sample journal entry for ${mockUser.name}. Testing the app functionality!`,
            mood: 'content'
          });
        
        if (!journalError) {
          console.log(`   ✅ Added sample journal for ${mockUser.name}`);
        }

        // Add sample meditation
        const { error: meditationError } = await supabase
          .from('meditations')
          .insert({
            user_id: userAuth.user.id,
            type: 'breathing',
            duration: 300
          });
        
        if (!meditationError) {
          console.log(`   ✅ Added sample meditation for ${mockUser.name}`);
        }
      }
    } catch (err) {
      console.log(`⚠️  Error creating ${mockUser.email}:`, err.message);
    }
  }

  console.log('\n🎉 Setup completed!');
  
} catch (error) {
  console.error('❌ Setup error:', error.message);
}

// Print final instructions
console.log('\n' + '='.repeat(60));
console.log('🎯 SETUP COMPLETE!');
console.log('='.repeat(60));
console.log('👤 Admin Login Credentials:');
console.log('   📧 Email: admin@elmora.com');
console.log('   🔑 Password: admin123');
console.log('');
console.log('👥 Test User Credentials (password: password123):');
console.log('   • alice.johnson@example.com');
console.log('   • bob.smith@example.com');
console.log('   • carol.williams@example.com');
console.log('');
console.log('🚀 Next Steps:');
console.log('   1. Refresh your browser');
console.log('   2. Login with admin credentials');
console.log('   3. Visit /admin to access dashboard');
console.log('   4. Test with mock user credentials');
console.log('');
console.log('✨ Elmora is ready to use!');