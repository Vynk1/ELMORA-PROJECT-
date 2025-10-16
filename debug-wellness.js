// Quick Debug Script for Wellness Analytics
// Run this to test if your endpoints are working

const TEST_USER_ID = '550e8400-e29b-41d4-a716-446655440000'; // Valid UUID format
const BASE_URL = 'http://localhost:3000';

async function quickTest() {
  console.log('🧪 Quick Wellness Analytics Debug Test\n');
  
  try {
    // Test 1: Check if server is running
    console.log('1️⃣ Testing server health...');
    const healthResponse = await fetch(`${BASE_URL}/health`);
    if (healthResponse.ok) {
      console.log('✅ Server is running');
    } else {
      console.log('❌ Server not responding');
      return;
    }

    // Test 2: Check today's status
    console.log('\n2️⃣ Testing today\'s check-in status...');
    const todayResponse = await fetch(`${BASE_URL}/api/checkin/today/${TEST_USER_ID}`);
    if (todayResponse.ok) {
      const todayData = await todayResponse.json();
      console.log('✅ Today\'s status endpoint works:', todayData);
    } else {
      console.log('❌ Today\'s status failed:', todayResponse.status);
    }

    // Test 3: Try to get trends (this will likely show the issue)
    console.log('\n3️⃣ Testing wellness trends...');
    const trendsResponse = await fetch(`${BASE_URL}/api/checkin/trends/${TEST_USER_ID}?period=week`);
    
    if (trendsResponse.ok) {
      const trendsData = await trendsResponse.json();
      console.log('✅ Trends endpoint works');
      console.log('📊 Data points:', trendsData.data_points);
      console.log('🔥 Current streak:', trendsData.current_streak);
      
      if (trendsData.data_points === 0) {
        console.log('⚠️ No check-in data found - this is why wellness analytics is empty');
        console.log('💡 Solution: Submit a check-in first, then try analytics');
      }
    } else {
      const errorText = await trendsResponse.text();
      console.log('❌ Trends endpoint failed:', trendsResponse.status);
      console.log('Error details:', errorText);
    }

    // Test 4: Try to get insights
    console.log('\n4️⃣ Testing insights...');
    const insightsResponse = await fetch(`${BASE_URL}/api/checkin/insights/${TEST_USER_ID}?days=7`);
    
    if (insightsResponse.ok) {
      const insightsData = await insightsResponse.json();
      console.log('✅ Insights endpoint works');
      console.log('🧠 Insights available:', insightsData.insights?.insights?.length || 0);
      
      if (!insightsData.insights?.insights?.length) {
        console.log('⚠️ No insights generated - likely due to insufficient data');
      }
    } else {
      const errorText = await insightsResponse.text();
      console.log('❌ Insights endpoint failed:', insightsResponse.status);
      console.log('Error details:', errorText);
    }

  } catch (error) {
    console.log('💥 Network error:', error.message);
    console.log('💡 Make sure your server is running on port 3000');
  }
  
  console.log('\n📋 Quick Fix Checklist:');
  console.log('□ Server running (npm start in server directory)');
  console.log('□ Database schema executed (create-daily-checkins-schema.sql)');
  console.log('□ At least one check-in submitted');
  console.log('□ Check browser console for frontend errors');
}

// Also export a function to submit test data
async function submitTestCheckIn() {
  console.log('📝 Submitting test check-in...');
  
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
    gratitude: 'Test gratitude entry',
    notes: 'Test check-in for debugging'
  };

  try {
    const response = await fetch(`${BASE_URL}/api/checkin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Test check-in submitted successfully!');
      console.log('💡 Now try opening wellness analytics again');
      return result;
    } else {
      const errorText = await response.text();
      console.log('❌ Failed to submit test check-in:', response.status);
      console.log('Error:', errorText);
    }
  } catch (error) {
    console.log('💥 Error submitting test check-in:', error.message);
  }
}

// Run the test
quickTest().then(() => {
  console.log('\n🔄 Now submitting test data to populate analytics...');
  return submitTestCheckIn();
}).then(() => {
  console.log('\n🔁 Testing analytics again with data...');
  return quickTest();
});

// ES module exports
export {
  quickTest,
  submitTestCheckIn,
  TEST_USER_ID,
  BASE_URL
};
