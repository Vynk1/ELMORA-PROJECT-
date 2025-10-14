// Test script for the AI analysis API
const testPayload = {
  answers: [
    { id: "Q1", choice: "C", points: 3 },
    { id: "Q2", choice: "B", points: 2 },
    { id: "Q3", choice: "C", points: 3 },
    { id: "Q4", choice: "C", points: 3 },
    { id: "Q5", choice: "B", points: 2 },
    { id: "Q6", choice: "C", points: 3 },
    { id: "Q7", choice: "C", points: 3 },
    { id: "Q8", choice: "B", points: 2 },
    { id: "Q9", choice: "C", points: 3 },
    { id: "Q10", choice: "C", points: 3 }
  ],
  basics: {
    name: "Test User",
    bio: "A test user for the Elmora onboarding system"
  }
};

async function testAnalyzeAPI() {
  try {
    console.log('Testing AI Analysis API...');
    console.log('Payload:', JSON.stringify(testPayload, null, 2));
    
    const response = await fetch('http://localhost:3000/api/analyze-wellbeing', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload)
    });
    
    const data = await response.json();
    
    console.log('\nResponse Status:', response.status);
    console.log('Response Data:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('\n✅ API Test Successful!');
      console.log(`Score: ${data.score}/30`);
      console.log(`Category: ${data.category}`);
      console.log(`Insights: ${data.insights.length} items`);
      console.log(`Recommendations: ${data.recommendations.length} items`);
    } else {
      console.log('\n❌ API Test Failed');
      console.log('Error:', data.error);
    }
    
  } catch (error) {
    console.error('\n❌ Test Error:', error.message);
    console.log('Make sure the server is running on port 3000');
  }
}

testAnalyzeAPI();