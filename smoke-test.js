/**
 * ELMORA + SUPABASE SMOKE TEST
 * 
 * This script verifies core functionality of Elmora with Supabase:
 * - Authentication (signup/signin/signout)
 * - Database operations (journals, meditations)
 * - Row Level Security (RLS) policies
 * 
 * REQUIREMENTS:
 * - Run with: VITE_SUPABASE_URL=xxx VITE_SUPABASE_ANON_KEY=xxx node smoke-test.js
 *   OR: SUPABASE_URL=xxx SUPABASE_ANON_KEY=xxx node smoke-test.js
 * - Requires: npm install @supabase/supabase-js
 * 
 * SETUP:
 * 1. Make sure your Supabase project has the following tables with RLS enabled:
 *    - profiles (user_id, name, created_at, updated_at)
 *    - journals (id, user_id, title, content, mood, created_at, updated_at)
 *    - meditations (id, user_id, type, duration, created_at, updated_at)
 * 2. Ensure RLS policies allow users to only access their own data
 * 
 * @author Elmora Development Team
 * @version 1.0.0
 */

import { createClient } from '@supabase/supabase-js';
import { randomBytes } from 'crypto';

// Configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const TEST_PASSWORD = 'password123';

// Test state tracking
let testResults = {
  passed: 0,
  failed: 0,
  total: 0
};

let testUserA = null;
let testUserB = null;
let testJournalId = null;
let testMeditationId = null;

/**
 * Generate a random test email
 */
function generateTestEmail(prefix) {
  const randomId = randomBytes(4).toString('hex');
  // Use a more standard email format
  return `${prefix}.${randomId}@example.com`;
}

/**
 * Print test result with colored output
 */
function printResult(testName, passed, details = '') {
  testResults.total++;
  if (passed) {
    testResults.passed++;
    console.log(`✅ PASS: ${testName}`);
    if (details) console.log(`   ${details}`);
  } else {
    testResults.failed++;
    console.log(`❌ FAIL: ${testName}`);
    if (details) console.log(`   ${details}`);
  }
}

/**
 * Print section header
 */
function printSection(title) {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`📋 ${title.toUpperCase()}`);
  console.log(`${'='.repeat(50)}`);
}

/**
 * Print final summary
 */
function printSummary() {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`📊 TEST SUMMARY`);
  console.log(`${'='.repeat(50)}`);
  console.log(`Total Tests: ${testResults.total}`);
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);
  
  if (testUserA || testUserB) {
    console.log(`\n🔍 TEST USERS CREATED (verify in Supabase console):`);
    if (testUserA) console.log(`   User A: ${testUserA.email}`);
    if (testUserB) console.log(`   User B: ${testUserB.email}`);
  }

  if (testResults.failed === 0) {
    console.log(`\n🎉 ALL TESTS PASSED! Elmora + Supabase integration is working correctly.`);
  } else {
    console.log(`\n⚠️  Some tests failed. Please check your Supabase configuration and RLS policies.`);
  }
}

/**
 * Validate environment variables
 */
function validateEnvironment() {
  printSection('Environment Validation');
  
  const urlValid = SUPABASE_URL && SUPABASE_URL.startsWith('https://');
  printResult('SUPABASE_URL is provided and valid', urlValid, SUPABASE_URL || 'Missing');
  
  const keyValid = SUPABASE_ANON_KEY && SUPABASE_ANON_KEY.length > 50;
  printResult('SUPABASE_ANON_KEY is provided and valid format', keyValid, 
    SUPABASE_ANON_KEY ? `${SUPABASE_ANON_KEY.substring(0, 20)}...` : 'Missing');
  
  if (!urlValid || !keyValid) {
    console.log('\n❌ Environment validation failed. Please set SUPABASE_URL and SUPABASE_ANON_KEY.');
    console.log('Usage: VITE_SUPABASE_URL=xxx VITE_SUPABASE_ANON_KEY=xxx node smoke-test.js');
    console.log('   OR: SUPABASE_URL=xxx SUPABASE_ANON_KEY=xxx node smoke-test.js');
    process.exit(1);
  }
}

/**
 * Test Supabase connection
 */
async function testConnection(supabase) {
  printSection('Connection Test');
  
  try {
    // Test basic connection by checking if we can access the auth endpoint
    const { data, error } = await supabase.auth.getSession();
    
    printResult('Supabase client connection established', !error, 
      error ? error.message : 'Connected successfully');
    
    return !error;
  } catch (err) {
    printResult('Supabase client connection established', false, err.message);
    return false;
  }
}

/**
 * Test user authentication (signup, signin, signout)
 */
async function testAuthentication(supabase) {
  printSection('Authentication Tests');
  
  // Generate test users
  const emailA = generateTestEmail('testA');
  const emailB = generateTestEmail('testB');
  
  try {
    // Test User A Signup
    const { data: signupDataA, error: signupErrorA } = await supabase.auth.signUp({
      email: emailA,
      password: TEST_PASSWORD
    });
    
    printResult('User A signup', !signupErrorA && signupDataA.user, 
      signupErrorA?.message || `Created user: ${emailA}`);
    
    if (signupDataA.user) {
      testUserA = { email: emailA, id: signupDataA.user.id };
    }
    
    // Test User A Sign In
    const { data: signinDataA, error: signinErrorA } = await supabase.auth.signInWithPassword({
      email: emailA,
      password: TEST_PASSWORD
    });
    
    printResult('User A signin', !signinErrorA && signinDataA.user, 
      signinErrorA?.message || 'Signed in successfully');
    
    // Test getting current session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    printResult('Get current session', !sessionError && sessionData.session?.user?.email === emailA,
      sessionError?.message || `Session active for: ${sessionData.session?.user?.email}`);
    
    return { emailA, emailB, userA: signupDataA.user };
    
  } catch (err) {
    printResult('Authentication test setup', false, err.message);
    return null;
  }
}

/**
 * Test database operations for authenticated user
 */
async function testDatabaseOperations(supabase, userEmail) {
  printSection('Database Operations Tests');
  
  try {
    // Test journal insertion
    const journalData = {
      title: 'Test Journal Entry',
      content: 'This is a test journal entry created by the smoke test script.',
      mood: 'content'
    };
    
    const { data: journalInsert, error: journalError } = await supabase
      .from('journals')
      .insert(journalData)
      .select()
      .single();
    
    printResult('Insert journal entry', !journalError && journalInsert, 
      journalError?.message || `Journal ID: ${journalInsert?.id}`);
    
    if (journalInsert) {
      testJournalId = journalInsert.id;
    }
    
    // Test meditation insertion
    const meditationData = {
      type: 'breathing',
      duration: 300 // 5 minutes in seconds
    };
    
    const { data: meditationInsert, error: meditationError } = await supabase
      .from('meditations')
      .insert(meditationData)
      .select()
      .single();
    
    printResult('Insert meditation record', !meditationError && meditationInsert, 
      meditationError?.message || `Meditation ID: ${meditationInsert?.id}`);
    
    if (meditationInsert) {
      testMeditationId = meditationInsert.id;
    }
    
    // Test fetching own journals
    const { data: journalsFetch, error: journalsFetchError } = await supabase
      .from('journals')
      .select('*');
    
    const journalsFound = journalsFetch && journalsFetch.length > 0;
    printResult('Fetch own journals', !journalsFetchError && journalsFound, 
      journalsFetchError?.message || `Found ${journalsFetch?.length || 0} journals`);
    
    // Test fetching own meditations
    const { data: meditationsFetch, error: meditationsFetchError } = await supabase
      .from('meditations')
      .select('*');
    
    const meditationsFound = meditationsFetch && meditationsFetch.length > 0;
    printResult('Fetch own meditations', !meditationsFetchError && meditationsFound, 
      meditationsFetchError?.message || `Found ${meditationsFetch?.length || 0} meditations`);
    
    return { journalId: testJournalId, meditationId: testMeditationId };
    
  } catch (err) {
    printResult('Database operations', false, err.message);
    return null;
  }
}

/**
 * Test Row Level Security by attempting cross-user access
 */
async function testRowLevelSecurity(supabase, emailB, testJournalId) {
  printSection('Row Level Security Tests');
  
  try {
    // Sign out User A
    const { error: signoutError } = await supabase.auth.signOut();
    printResult('User A signout', !signoutError, signoutError?.message || 'Signed out successfully');
    
    // Sign up User B
    const { data: signupDataB, error: signupErrorB } = await supabase.auth.signUp({
      email: emailB,
      password: TEST_PASSWORD
    });
    
    printResult('User B signup', !signupErrorB && signupDataB.user, 
      signupErrorB?.message || `Created user: ${emailB}`);
    
    if (signupDataB.user) {
      testUserB = { email: emailB, id: signupDataB.user.id };
    }
    
    // Sign in User B
    const { data: signinDataB, error: signinErrorB } = await supabase.auth.signInWithPassword({
      email: emailB,
      password: TEST_PASSWORD
    });
    
    printResult('User B signin', !signinErrorB && signinDataB.user, 
      signinErrorB?.message || 'Signed in successfully');
    
    // Test RLS: Try to fetch User A's journal as User B
    if (testJournalId) {
      const { data: crossUserJournal, error: crossUserError } = await supabase
        .from('journals')
        .select('*')
        .eq('id', testJournalId);
      
      // Should return empty array or error due to RLS
      const rlsWorking = (!crossUserError && (!crossUserJournal || crossUserJournal.length === 0)) 
        || (crossUserError && crossUserError.message.includes('row-level security'));
      
      printResult('RLS prevents cross-user journal access', rlsWorking,
        crossUserError?.message || `Returned ${crossUserJournal?.length || 0} records (should be 0)`);
    }
    
    // Test that User B can create their own journal
    const { data: userBJournal, error: userBJournalError } = await supabase
      .from('journals')
      .insert({
        title: 'User B Test Journal',
        content: 'This journal belongs to User B',
        mood: 'happy'
      })
      .select()
      .single();
    
    printResult('User B can create own journal', !userBJournalError && userBJournal,
      userBJournalError?.message || `Created journal ID: ${userBJournal?.id}`);
    
    // Test that User B can only see their own journals
    const { data: userBJournals, error: userBJournalsError } = await supabase
      .from('journals')
      .select('*');
    
    const onlyOwnJournals = !userBJournalsError && userBJournals && 
      userBJournals.every(journal => journal.user_id === signinDataB.user.id);
    
    printResult('User B sees only own journals', onlyOwnJournals,
      userBJournalsError?.message || `User B sees ${userBJournals?.length || 0} journals`);
    
  } catch (err) {
    printResult('Row Level Security test', false, err.message);
  }
}

/**
 * Test profile creation (should be automatic via trigger)
 */
async function testProfileCreation(supabase) {
  printSection('Profile Creation Tests');
  
  try {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .single();
    
    printResult('Profile automatically created', !profileError && profile,
      profileError?.message || `Profile exists with ID: ${profile?.user_id}`);
    
  } catch (err) {
    printResult('Profile creation test', false, err.message);
  }
}

/**
 * Main test execution function
 */
async function runSmokeTest() {
  console.log('🚀 ELMORA + SUPABASE SMOKE TEST STARTING...\n');
  console.log('This script will test authentication, database operations, and Row Level Security.\n');
  
  // Validate environment
  validateEnvironment();
  
  // Create Supabase client
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
  try {
    // Test connection
    const connectionOk = await testConnection(supabase);
    if (!connectionOk) {
      console.log('\n❌ Connection failed. Aborting remaining tests.');
      return;
    }
    
    // Test authentication
    const authResult = await testAuthentication(supabase);
    if (!authResult) {
      console.log('\n❌ Authentication failed. Aborting remaining tests.');
      return;
    }
    
    const { emailA, emailB } = authResult;
    
    // Test database operations
    const dbResult = await testDatabaseOperations(supabase, emailA);
    
    // Test profile creation
    await testProfileCreation(supabase);
    
    // Test Row Level Security
    await testRowLevelSecurity(supabase, emailB, dbResult?.journalId);
    
  } catch (error) {
    console.error('\n💥 Unexpected error during smoke test:', error);
    printResult('Smoke test execution', false, error.message);
  } finally {
    // Print final summary
    printSummary();
  }
}

// Execute the smoke test
(async () => {
  try {
    await runSmokeTest();
  } catch (error) {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  }
})();