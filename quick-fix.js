// Quick Fix Script for Wellness Analytics
// This script will test and fix the wellness analytics system

const TEST_USER_ID = '550e8400-e29b-41d4-a716-446655440000';
const BASE_URL = 'http://localhost:3000';

async function testAndFix() {
  console.log('🔧 Quick Fix for Wellness Analytics\n');
  
  try {
    // Test 1: Check server health
    console.log('1️⃣ Testing server health...');
    const healthResponse = await fetch(`${BASE_URL}/health`);
    if (!healthResponse.ok) {
      console.log('❌ Server not running. Please start your server with:');
      console.log('   cd server && npm start');
      return;
    }
    console.log('✅ Server is running');

    // Test 2: Try wellness trends to see current state
    console.log('\n2️⃣ Testing wellness analytics...');
    const trendsResponse = await fetch(`${BASE_URL}/api/checkin/trends/${TEST_USER_ID}?period=week`);
    
    if (trendsResponse.ok) {
      const trendsData = await trendsResponse.json();
      console.log(`📊 Data points found: ${trendsData.data_points}`);
      
      if (trendsData.data_points > 0) {
        console.log('✅ Wellness analytics is working with existing data!');
        console.log('🎉 Your system is ready to use');
        
        // Show sample insights
        const insightsResponse = await fetch(`${BASE_URL}/api/checkin/insights/${TEST_USER_ID}?days=7`);
        if (insightsResponse.ok) {
          const insightsData = await insightsResponse.json();
          console.log(`💡 AI insights available: ${insightsData.insights?.insights?.length || 0}`);
        }
        
        return; // System is working
      }
    } else {
      const errorText = await trendsResponse.text();
      console.log('❌ API Error:', errorText);
    }

    // Test 3: Try to create test data via API
    console.log('\n3️⃣ Creating test check-in data...');
    const testData = {
      userId: TEST_USER_ID,
      mood: 'happy',
      energyLevel: 8,
      sleepQuality: 7,
      stressLevel: 3,
      physicalActivity: 'moderate',
      socialInteractions: 'moderate',
      emotions: ['motivated', 'focused'],
      dailyGoalsProgress: 'completed',
      productivityRating: 8,
      weatherImpact: 'positive',
      gratitude: 'Test gratitude entry for debugging',
      notes: 'Test check-in to populate wellness analytics'
    };

    const checkinResponse = await fetch(`${BASE_URL}/api/checkin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    if (checkinResponse.ok) {
      const result = await checkinResponse.json();
      console.log('✅ Test check-in created successfully!');
      
      // Test analytics again
      console.log('\n4️⃣ Testing analytics with new data...');
      const newTrendsResponse = await fetch(`${BASE_URL}/api/checkin/trends/${TEST_USER_ID}?period=week`);
      
      if (newTrendsResponse.ok) {
        const newTrendsData = await newTrendsResponse.json();
        console.log(`✅ Analytics now working! Data points: ${newTrendsData.data_points}`);
        console.log(`🔥 Current streak: ${newTrendsData.current_streak}`);
        console.log('🎉 Wellness analytics is now functional!');
      }
      
    } else {
      const errorText = await checkinResponse.text();
      console.log('❌ Failed to create test check-in:', errorText);
      console.log('\n🔧 Database Fix Required:');
      console.log('1. Go to your Supabase SQL Editor');
      console.log('2. Execute the create-daily-checkins-schema.sql file');
      console.log('3. Execute the create-test-data.sql file');
      console.log('4. Run this script again');
    }

  } catch (error) {
    console.log('💥 Error:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure your server is running: cd server && npm start');
    console.log('2. Check your .env file has correct Supabase credentials');
    console.log('3. Execute the SQL schema files in Supabase dashboard');
  }
  
  console.log('\n📋 Manual Steps if Needed:');
  console.log('1. In Supabase SQL Editor, run: create-daily-checkins-schema.sql');
  console.log('2. In Supabase SQL Editor, run: create-test-data.sql');
  console.log('3. Refresh your frontend and try the wellness analytics');
  console.log('4. Or use the frontend to complete a real check-in');
}

// Run the fix
testAndFix();

export { testAndFix, TEST_USER_ID, BASE_URL };