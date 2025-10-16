# 🚀 Quick Start Guide - AI Report Feature

## Prerequisites
✅ Node.js installed
✅ Supabase account with database
✅ OpenAI API key

## Step 1: Install Dependencies (if not already installed)

```bash
# Backend dependencies
cd server
npm install express @supabase/supabase-js openai dotenv
```

## Step 2: Configure package.json for ES6 Modules

Add `"type": "module"` to your `package.json` in the server folder:

```json
{
  "name": "mental-wellbeing-api",
  "version": "1.0.0",
  "type": "module",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "@supabase/supabase-js": "^2.39.0",
    "openai": "^4.20.1",
    "dotenv": "^16.3.1"
  }
}
```

## Step 3: Set Up Environment Variables

Create/update `.env` file in the server folder:

```env
# OpenAI API Key
OPENAI_API_KEY=sk-your-actual-openai-key-here

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key-here

# Server Port
PORT=3000
```

Add to your client `.env` (or `.env.local`):

```env
VITE_SERVER_URL=http://localhost:3000
```

## Step 4: Create Database Table

Run this SQL in your Supabase SQL Editor:

```sql
-- Create the health_data table
CREATE TABLE health_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  answers JSONB NOT NULL,
  report JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_health_data_user_id ON health_data(user_id);
CREATE INDEX idx_health_data_created_at ON health_data(created_at DESC);

-- Enable Row Level Security
ALTER TABLE health_data ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view own health data" ON health_data
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own health data" ON health_data
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);
```

## Step 5: Start the Server

```bash
# From the server directory
cd server
node server.js

# You should see:
# Mental Wellbeing API running on port 3000
```

## Step 6: Test the API (Optional)

```bash
# From the project root
node test-ai-report.js

# This will:
# ✅ Check server health
# ✅ Generate a test report
# ✅ Retrieve reports
```

## Step 7: Start Your Frontend

```bash
# From the project root or client directory
npm run dev

# Your app should start at http://localhost:5173
```

## Step 8: Use the Feature! 🎉

1. **Log in** to your Elmora account
2. Go to **Dashboard**
3. Click on **"AI Wellbeing Report"** card (🧠 icon)
4. Complete the **7-question assessment**
5. Submit and view your **beautiful AI-generated report**!

## Troubleshooting

### ❌ "Cannot find module" errors
**Solution**: Make sure you added `"type": "module"` to package.json

### ❌ Server won't start
**Solution**: 
- Check if port 3000 is available
- Verify all environment variables are set
- Install dependencies: `npm install`

### ❌ OpenAI API errors
**Solution**:
- Verify your API key is correct
- Check if you have credits in your OpenAI account
- Try a different API key

### ❌ Supabase connection errors
**Solution**:
- Verify SUPABASE_URL and SUPABASE_KEY
- Make sure the health_data table exists
- Check RLS policies are set up correctly

### ❌ Report not appearing
**Solution**:
- Open browser console (F12) and check for errors
- Verify VITE_SERVER_URL is set correctly
- Make sure the server is running
- Check network tab for failed requests

## Testing Without OpenAI (Mock Data)

If you want to test without using OpenAI credits, you can modify the server to return mock data:

```javascript
// In server.js, replace the generateAIReport function with:
async function generateAIReport(answers) {
  // Mock report for testing
  return {
    overallStatus: {
      summary: "You demonstrate strong resilience and emotional awareness.",
      wellbeingScore: 85,
      riskLevel: "low"
    },
    psychologicalTraits: {
      resilience: {
        score: 90,
        analysis: "You show excellent ability to bounce back from setbacks.",
        strengths: ["Growth mindset", "Self-reflection"],
        concerns: []
      },
      // ... add other traits
    },
    // ... rest of mock data
  };
}
```

## Next Steps

✅ **Complete assessment** to get your first report
✅ **Explore different sections** using the tab navigation
✅ **Download or print** your report
✅ **Navigate to meditation/journal** from the report
✅ **Track progress** by taking assessments regularly

## Feature Locations

### Frontend Pages:
- `client/pages/HealthAssessment.tsx` - Questionnaire
- `client/pages/AIReport.tsx` - Report display

### Backend:
- `server/server.js` - API endpoints

### API Functions:
- `client/lib/supabaseApi.js` - Helper functions

### Routes:
- `/health-assessment` - Take assessment
- `/ai-report` - View report
- `/ai-report?id={reportId}` - View specific report

## Support

Check these files for detailed information:
- `AI_REPORT_README.md` - Full documentation
- `AI_REPORT_IMPLEMENTATION.md` - Implementation details

---

**Enjoy your new AI Mental Wellbeing Report feature! 🧠✨**
