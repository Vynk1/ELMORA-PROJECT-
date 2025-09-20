/**
 * SETUP COMPREHENSIVE MOCK DATA FOR ADMIN DASHBOARD
 * 
 * This script will create realistic sample data to make the admin dashboard
 * look fully functional with charts, user data, and analytics.
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

const serviceClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

console.log('🚀 SETTING UP COMPREHENSIVE MOCK DATA FOR ADMIN DASHBOARD...\n');

try {
  // Step 1: Create 15 realistic users with varied join dates
  console.log('👥 Creating diverse user base...');
  
  const mockUsers = [
    { email: 'sarah.connor@mindful.com', name: 'Sarah Connor', joinDaysAgo: 45 },
    { email: 'alex.smith@wellness.com', name: 'Alex Smith', joinDaysAgo: 38 },
    { email: 'emma.wilson@zen.com', name: 'Emma Wilson', joinDaysAgo: 42 },
    { email: 'james.taylor@peace.com', name: 'James Taylor', joinDaysAgo: 35 },
    { email: 'lily.chen@mindful.com', name: 'Lily Chen', joinDaysAgo: 28 },
    { email: 'marcus.johnson@calm.com', name: 'Marcus Johnson', joinDaysAgo: 31 },
    { email: 'sofia.garcia@serenity.com', name: 'Sofia Garcia', joinDaysAgo: 25 },
    { email: 'david.brown@balance.com', name: 'David Brown', joinDaysAgo: 22 },
    { email: 'maya.patel@harmony.com', name: 'Maya Patel', joinDaysAgo: 19 },
    { email: 'ryan.davis@tranquil.com', name: 'Ryan Davis', joinDaysAgo: 16 },
    { email: 'zoe.martinez@bliss.com', name: 'Zoe Martinez', joinDaysAgo: 13 },
    { email: 'ethan.lee@mindspace.com', name: 'Ethan Lee', joinDaysAgo: 10 },
    { email: 'ava.thompson@innerpeace.com', name: 'Ava Thompson', joinDaysAgo: 7 },
    { email: 'noah.anderson@stillness.com', name: 'Noah Anderson', joinDaysAgo: 4 },
    { email: 'mia.rodriguez@reflect.com', name: 'Mia Rodriguez', joinDaysAgo: 1 }
  ];

  const createdUsers = [];

  for (const mockUser of mockUsers) {
    try {
      const joinDate = new Date();
      joinDate.setDate(joinDate.getDate() - mockUser.joinDaysAgo);

      const { data: userAuth, error: userError } = await serviceClient.auth.admin.createUser({
        email: mockUser.email,
        password: 'password123',
        email_confirm: true,
        user_metadata: {
          name: mockUser.name
        },
        created_at: joinDate.toISOString()
      });

      if (userError && !userError.message.includes('already registered')) {
        console.log(`⚠️  User ${mockUser.email}: ${userError.message}`);
        continue;
      }

      let userId = userAuth?.user?.id;
      
      // If user already exists, get their ID
      if (!userId) {
        const { data: existingUsers } = await serviceClient.auth.admin.listUsers();
        const existingUser = existingUsers.users.find(u => u.email === mockUser.email);
        userId = existingUser?.id;
      }

      if (userId) {
        createdUsers.push({
          id: userId,
          email: mockUser.email,
          name: mockUser.name,
          joinDate: joinDate,
          joinDaysAgo: mockUser.joinDaysAgo
        });
        console.log(`✅ User ready: ${mockUser.name}`);
      }

    } catch (err) {
      console.log(`⚠️  Error with user ${mockUser.email}:`, err.message);
    }
  }

  console.log(`\n📊 Created/verified ${createdUsers.length} users`);

  // Step 2: Create diverse journal entries with realistic distribution
  console.log('\n📖 Creating journal entries...');
  
  const journalTemplates = [
    { title: "Morning Reflection", content: "Started the day with gratitude practice. Feeling centered and ready for new challenges.", mood: "content" },
    { title: "Breakthrough Moment", content: "Had an amazing realization during therapy today. Understanding my patterns better.", mood: "happy" },
    { title: "Challenging Day", content: "Work was overwhelming today, but I managed to stay calm and focused through mindfulness.", mood: "stressed" },
    { title: "Weekend Adventures", content: "Went hiking with friends. Nature always helps me reset and recharge my energy.", mood: "happy" },
    { title: "Learning Journey", content: "Making progress on my meditation practice. 20 minutes felt easier today than ever.", mood: "content" },
    { title: "Family Time", content: "Wonderful dinner with family. Grateful for these moments of connection together.", mood: "grateful" },
    { title: "Creative Flow", content: "Spent the evening painting. Lost track of time - pure flow state achieved.", mood: "content" },
    { title: "Mindfulness Practice", content: "Trying to be more present in daily activities. Small steps make a difference.", mood: "calm" },
    { title: "Personal Growth", content: "Reading about emotional intelligence. So much to learn and apply in life.", mood: "curious" },
    { title: "Gratitude List", content: "Health, family, opportunities, growth. Counting my blessings today and always.", mood: "grateful" },
    { title: "Exercise Victory", content: "Completed my first 5K run! Setting and achieving goals feels absolutely amazing.", mood: "accomplished" },
    { title: "Quiet Moments", content: "Sometimes silence speaks louder than words. Enjoying the peace within.", mood: "peaceful" },
    { title: "Learning New Skills", content: "Started guitar lessons. Fingers hurt but my spirit is soaring high!", mood: "motivated" },
    { title: "Travel Dreams", content: "Planning my next adventure. Travel feeds my soul like nothing else.", mood: "excited" },
    { title: "Career Thoughts", content: "Considering a career change. Scary but exciting possibilities lie ahead.", mood: "contemplative" },
    { title: "Self-Care Sunday", content: "Dedicated today to self-care: bath, books, and boundaries. Perfect balance.", mood: "relaxed" },
    { title: "Friendship Appreciation", content: "Long call with my best friend. True friendship is life's greatest treasure.", mood: "connected" },
    { title: "Overcoming Fear", content: "Faced my fear of public speaking today. Growth happens outside comfort zones.", mood: "proud" },
    { title: "Simple Pleasures", content: "Perfect cup of coffee, good book, rainy morning. Life's simple joys matter most.", mood: "content" },
    { title: "Meditation Insights", content: "During meditation, realized that peace isn't absence of chaos, but calm within it.", mood: "enlightened" }
  ];

  let journalCount = 0;
  for (const user of createdUsers) {
    // Each user gets 2-6 journal entries
    const numEntries = Math.floor(Math.random() * 5) + 2;
    
    for (let i = 0; i < numEntries; i++) {
      const template = journalTemplates[Math.floor(Math.random() * journalTemplates.length)];
      const daysAgo = Math.floor(Math.random() * Math.min(user.joinDaysAgo, 30));
      const entryDate = new Date();
      entryDate.setDate(entryDate.getDate() - daysAgo);

      const { error: journalError } = await serviceClient
        .from('journals')
        .insert({
          user_id: user.id,
          title: template.title,
          content: template.content,
          mood: template.mood,
          created_at: entryDate.toISOString()
        });

      if (!journalError) {
        journalCount++;
      }
    }
  }

  console.log(`✅ Created ${journalCount} journal entries`);

  // Step 3: Create varied meditation sessions
  console.log('\n🧘 Creating meditation sessions...');

  const meditationTypes = ['breathing', 'mindfulness', 'loving-kindness', 'body-scan', 'walking', 'gratitude'];
  const durations = [300, 480, 600, 720, 900, 1200, 1800]; // 5-30 minutes

  let meditationCount = 0;
  for (const user of createdUsers) {
    // Each user gets 1-4 meditation sessions
    const numSessions = Math.floor(Math.random() * 4) + 1;
    
    for (let i = 0; i < numSessions; i++) {
      const type = meditationTypes[Math.floor(Math.random() * meditationTypes.length)];
      const duration = durations[Math.floor(Math.random() * durations.length)];
      const daysAgo = Math.floor(Math.random() * Math.min(user.joinDaysAgo, 25));
      const sessionDate = new Date();
      sessionDate.setDate(sessionDate.getDate() - daysAgo);

      const { error: meditationError } = await serviceClient
        .from('meditations')
        .insert({
          user_id: user.id,
          type: type,
          duration: duration,
          created_at: sessionDate.toISOString()
        });

      if (!meditationError) {
        meditationCount++;
      }
    }
  }

  console.log(`✅ Created ${meditationCount} meditation sessions`);

  // Step 4: Verify data and provide summary
  console.log('\n🔍 Verifying data...');

  const { count: totalUsers } = await serviceClient
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  const { count: totalJournals } = await serviceClient
    .from('journals')
    .select('*', { count: 'exact', head: true });

  const { count: totalMeditations } = await serviceClient
    .from('meditations')
    .select('*', { count: 'exact', head: true });

  console.log('\n' + '='.repeat(60));
  console.log('🎯 MOCK DATA SETUP COMPLETE!');
  console.log('='.repeat(60));
  console.log(`👥 Total Users: ${totalUsers || 'Unknown'}`);
  console.log(`📖 Total Journals: ${totalJournals || 'Unknown'}`);
  console.log(`🧘 Total Meditations: ${totalMeditations || 'Unknown'}`);
  
  console.log('\n📊 Your Admin Dashboard will now show:');
  console.log('✅ User growth charts with realistic progression');
  console.log('✅ Journal activity trends over past weeks');
  console.log('✅ Meditation session analytics with various types');
  console.log('✅ Active user statistics and engagement metrics');
  console.log('✅ Top users leaderboard with actual activity');
  console.log('✅ Comprehensive analytics across all three tabs');
  
  console.log('\n🚀 NEXT STEPS:');
  console.log('1. Refresh your admin dashboard');
  console.log('2. Navigate through Overview, Analytics, and Users tabs');
  console.log('3. View the interactive charts and metrics');
  console.log('4. Check the user leaderboard for activity rankings');
  console.log('5. All data is now fully populated and functional!');

} catch (error) {
  console.error('\n❌ Setup error:', error.message);
  console.log('\nTry refreshing and running the script again, or check your Supabase connection.');
}