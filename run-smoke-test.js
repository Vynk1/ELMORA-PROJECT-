/**
 * SMOKE TEST RUNNER
 * 
 * Loads environment variables from .env.local and runs the smoke test
 */

import fs from 'fs';
import { spawn } from 'child_process';

// Load environment variables from .env.local
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

// Run smoke test with environment variables
function runSmokeTest() {
  console.log('🚀 Loading environment variables and running smoke test...\n');
  
  const envVars = loadEnvFile();
  
  // Map VITE_ variables to regular variables for Node.js smoke test
  const nodeEnv = {
    ...process.env,
    SUPABASE_URL: envVars.VITE_SUPABASE_URL || envVars.SUPABASE_URL,
    SUPABASE_ANON_KEY: envVars.VITE_SUPABASE_ANON_KEY || envVars.SUPABASE_ANON_KEY,
    VITE_SUPABASE_URL: envVars.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: envVars.VITE_SUPABASE_ANON_KEY
  };
  
  if (!nodeEnv.SUPABASE_URL || !nodeEnv.SUPABASE_ANON_KEY) {
    console.error('❌ Missing Supabase environment variables in .env.local');
    console.error('Please ensure .env.local contains VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
    process.exit(1);
  }
  
  console.log('✅ Environment variables loaded:');
  console.log(`   SUPABASE_URL: ${nodeEnv.SUPABASE_URL}`);
  console.log(`   SUPABASE_ANON_KEY: ${nodeEnv.SUPABASE_ANON_KEY.substring(0, 20)}...\n`);
  
  // Spawn the smoke test process
  const child = spawn('node', ['smoke-test.js'], {
    env: nodeEnv,
    stdio: 'inherit'
  });
  
  child.on('close', (code) => {
    if (code === 0) {
      console.log('\n✅ Smoke test completed successfully!');
    } else {
      console.log('\n❌ Smoke test failed with exit code:', code);
      process.exit(code);
    }
  });
  
  child.on('error', (err) => {
    console.error('❌ Error running smoke test:', err.message);
    process.exit(1);
  });
}

runSmokeTest();