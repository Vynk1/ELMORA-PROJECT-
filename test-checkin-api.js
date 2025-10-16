// API Testing Script for Enhanced Daily Check-in System
// Run this with: node test-checkin-api.js

const TEST_USER_ID = 'test-user-123';
const BASE_URL = 'http://localhost:3000'; // Adjust if your server runs on different port

// Test data for check-in
const sampleCheckinData = {
  userId: TEST_USER_ID,
  mood: 'happy',
  energyLevel: 8,
  sleepQuality: 7,
  stressLevel: 3,
  physicalActivity: 'moderate',
  socialInteractions: 'moderate',
  emotions: ['motivated', 'focused', 'content'],
  dailyGoalsProgress: 'completed',
  productivityRating: 8,
  weatherImpact: 'positive',
  gratitude: 'I\'m grateful for a productive day and good health',
  notes: 'Had a great workout this morning and completed all my planned tasks',
  challengesFaced: 'Had some difficulty concentrating in the afternoon',
  winsCelebrated: 'Finished the project I\'ve been working on for weeks!',
  motivationLevel: 9,
  focusLevel: 7,
  overallSatisfaction: 8
};

async function testAPI(endpoint, method = 'GET', data = null) {
  console.log(`\n🧪 Testing ${method} ${endpoint}`);
  
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    
    if (data) {
      options.body = JSON.stringify(data);
    }
    
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const result = await response.json();
    
    if (response.ok) {
      console.log(`✅ Success (${response.status}):`, JSON.stringify(result, null, 2));
      return result;
    } else {
      console.log(`❌ Error (${response.status}):`, result);
      return null;
    }
  } catch (error) {
    console.log(`💥 Network Error:`, error.message);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Starting Enhanced Daily Check-in API Tests\n');
  console.log('📝 Make sure your server is running on', BASE_URL);
  console.log('🗄️ Make sure you\'ve executed the SQL schema in your database\n');
  
  // Test 1: Check today's status (should be false initially)
  console.log('='.repeat(60));
  console.log('TEST 1: Check Today\'s Check-in Status');
  console.log('='.repeat(60));
  await testAPI(`/api/checkin/today/${TEST_USER_ID}`);
  
  // Test 2: Submit a comprehensive check-in
  console.log('\n' + '='.repeat(60));
  console.log('TEST 2: Submit Daily Check-in');
  console.log('='.repeat(60));
  const checkinResult = await testAPI('/api/checkin', 'POST', sampleCheckinData);
  
  if (checkinResult) {
    console.log('\n✨ Check-in submitted successfully!');
    console.log('📊 Immediate Insights:');
    if (checkinResult.insights && checkinResult.insights.insights) {
      checkinResult.insights.insights.forEach((insight, i) => {
        console.log(`   ${insight.emoji} ${insight.title}: ${insight.message}`);
      });
    }
  }
  
  // Test 3: Check today's status again (should be true now)
  console.log('\n' + '='.repeat(60));
  console.log('TEST 3: Check Today\'s Status Again');
  console.log('='.repeat(60));
  await testAPI(`/api/checkin/today/${TEST_USER_ID}`);
  
  // Test 4: Get check-in history
  console.log('\n' + '='.repeat(60));
  console.log('TEST 4: Get Check-in History');
  console.log('='.repeat(60));
  await testAPI(`/api/checkin/history/${TEST_USER_ID}?limit=5`);
  
  // Test 5: Get wellness trends (weekly)
  console.log('\n' + '='.repeat(60));
  console.log('TEST 5: Get Wellness Trends (Weekly)');
  console.log('='.repeat(60));
  await testAPI(`/api/checkin/trends/${TEST_USER_ID}?period=week`);
  
  // Test 6: Get AI insights
  console.log('\n' + '='.repeat(60));
  console.log('TEST 6: Get AI-Powered Insights');
  console.log('='.repeat(60));
  const insightsResult = await testAPI(`/api/checkin/insights/${TEST_USER_ID}?days=7`);
  
  if (insightsResult && insightsResult.insights) {
    console.log('\n🧠 AI Analysis Results:');
    console.log(`📊 Total Check-ins: ${insightsResult.insights.data_summary?.total_checkins || 0}`);
    console.log(`🎯 Consistency Rate: ${insightsResult.insights.data_summary?.consistency_rate || 0}%`);
    
    if (insightsResult.insights.insights) {
      console.log('\n💡 Key Insights:');
      insightsResult.insights.insights.forEach((insight, i) => {
        console.log(`   ${i + 1}. [${insight.category}] ${insight.title}`);
        console.log(`      ${insight.observation}`);
      });
    }
    
    if (insightsResult.insights.recommendations) {
      console.log('\n📋 Recommendations:');
      insightsResult.insights.recommendations.forEach((rec, i) => {
        console.log(`   ${rec.emoji} ${rec.title} (${rec.priority} priority)`);
        console.log(`      ${rec.description}`);
      });
    }
  }
  
  // Test 7: Try to submit another check-in (should be prevented)
  console.log('\n' + '='.repeat(60));
  console.log('TEST 7: Try Duplicate Check-in (Should Fail)');
  console.log('='.repeat(60));
  await testAPI('/api/checkin', 'POST', { 
    ...sampleCheckinData, 
    mood: 'excited',
    notes: 'Trying to submit a second check-in today'
  });
  
  console.log('\n' + '='.repeat(60));
  console.log('🎉 API TESTING COMPLETE!');
  console.log('='.repeat(60));
  console.log('\n📋 What to check:');
  console.log('✅ All endpoints should return 200 status codes');
  console.log('✅ Check-in submission should generate immediate insights');
  console.log('✅ Today\'s status should change from false to true');
  console.log('✅ History should show your submitted check-in');
  console.log('✅ Trends should show basic analytics');
  console.log('✅ AI insights should provide personalized recommendations');
  console.log('✅ Duplicate check-in should be prevented');
  console.log('\n🌟 If all tests pass, your enhanced check-in system is ready!');
}

// Run the tests
runTests().catch(console.error);

// Export for use in other test files
module.exports = {
  testAPI,
  sampleCheckinData,
  TEST_USER_ID,
  BASE_URL
};