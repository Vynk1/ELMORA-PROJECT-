# AI Mental Wellbeing Report Feature 🧠

## Overview
The AI Mental Wellbeing Report is a comprehensive psychological assessment tool that provides personalized insights into your mental health using advanced AI analysis powered by OpenAI's GPT-3.5.

## Features

### 🎯 Health Assessment
- **7 Psychological Questions**: Carefully crafted questions covering:
  - Resilience and setback handling
  - Feedback reception
  - Emotional regulation
  - Stress management
  - Growth mindset
  - Disappointment coping
  - Self-esteem and praise reception

- **Beautiful UI with Animations**:
  - React Bits effects integration
  - Smooth transitions between questions
  - Progress tracking
  - Real-time answer validation
  - Question navigator for easy navigation

### 📊 AI-Generated Report
Your personalized report includes:

1. **Overall Wellbeing Score** (0-100)
   - Visual circular progress indicator
   - Risk level assessment (Low/Moderate/High)
   - Comprehensive summary

2. **Psychological Traits Analysis**:
   - Resilience
   - Emotional Regulation
   - Stress Management
   - Growth Mindset
   - Self-Esteem
   - Emotional Intelligence
   
   Each trait includes:
   - Score (0-100)
   - Detailed analysis
   - Strengths identified
   - Areas of concern

3. **Detailed Analysis**:
   - Coping strategies assessment
   - Emotional patterns
   - Behavioral tendencies
   - Cognitive patterns

4. **Areas of Concern**:
   - Identified issues with severity levels
   - Detailed descriptions
   - Behavioral indicators

5. **Personalized Recommendations**:
   - Immediate actions (high priority)
   - Short-term goals (1-3 months)
   - Long-term development plans
   - Professional help recommendation (if needed)

6. **Resources**:
   - Books, apps, techniques, and exercises
   - Curated based on your specific needs

7. **Positive Aspects**:
   - Recognition of your strengths
   - Celebration of healthy patterns

## Routes

### Health Assessment
```
/health-assessment
```
Interactive questionnaire with 7 questions

### AI Report
```
/ai-report
```
Displays your generated mental wellbeing report

Can also access via URL parameter:
```
/ai-report?id={reportId}
```

## API Integration

### Backend Server (Node.js + Express)
Located in: `server/server.js`

#### Endpoints:

1. **Generate Report**
```javascript
POST /api/generate-report
Content-Type: application/json

{
  "userId": "user123",
  "answers": [
    "answer1",
    "answer2",
    "answer3",
    "answer4",
    "answer5",
    "answer6",
    "answer7"
  ]
}

Response:
{
  "success": true,
  "message": "Mental health report generated successfully",
  "data": {
    "reportId": "uuid",
    "userId": "user123",
    "report": { /* Full AI report object */ },
    "timestamp": "2025-10-14T..."
  }
}
```

2. **Get User's Reports**
```javascript
GET /api/reports/:userId

Response:
{
  "success": true,
  "data": [
    { /* Report 1 */ },
    { /* Report 2 */ }
  ]
}
```

3. **Get Specific Report**
```javascript
GET /api/report/:reportId

Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_id": "user123",
    "answers": [...],
    "report": { /* Full AI report */ },
    "created_at": "..."
  }
}
```

### Frontend API Functions
Located in: `client/lib/supabaseApi.js`

```javascript
// Generate a new health report
import { generateHealthReport } from '../lib/supabaseApi';

const reportData = await generateHealthReport([
  'answer1', 'answer2', 'answer3', 'answer4',
  'answer5', 'answer6', 'answer7'
]);

// Get all reports for current user
import { getHealthReports } from '../lib/supabaseApi';
const reports = await getHealthReports();

// Get specific report by ID
import { getHealthReport } from '../lib/supabaseApi';
const report = await getHealthReport(reportId);
```

## Database Schema

### Supabase Table: `health_data`

```sql
CREATE TABLE health_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  answers JSONB NOT NULL,
  report JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_health_data_user_id ON health_data(user_id);
CREATE INDEX idx_health_data_created_at ON health_data(created_at DESC);

-- Row Level Security
ALTER TABLE health_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own health data" ON health_data
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own health data" ON health_data
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);
```

## Setup Instructions

### 1. Environment Variables
Add to your `.env` file:

```env
# OpenAI
OPENAI_API_KEY=your_openai_api_key_here

# Supabase
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_anon_key_here

# Server
PORT=3000

# Frontend (for API calls)
VITE_SERVER_URL=http://localhost:3000
```

### 2. Install Dependencies

#### Backend (server/)
```bash
npm install express @supabase/supabase-js openai dotenv
npm install --save-dev nodemon
```

#### Frontend (client/)
Already installed - uses existing dependencies

### 3. Run Database Migration
Run the SQL schema in your Supabase SQL editor to create the `health_data` table.

### 4. Start the Server
```bash
cd server
npm start
# or for development:
npm run dev
```

### 5. Access the Feature
1. Log into your Elmora account
2. Navigate to Dashboard
3. Click on "AI Wellbeing Report" card
4. Complete the 7-question assessment
5. View your personalized report!

## Design & Animations

### React Bits Effects Used:
- ✨ **ScrollReveal**: Smooth fade-in animations for sections
- 🎯 **ScrollFloat**: Floating cards with parallax effect
- 📊 **CountUp**: Animated number counting for scores
- 🔮 **DecryptedText**: Text reveal animation for questions
- 🎨 **TrueFocus**: Focus-based scaling effects

### Color Scheme:
- Primary: Purple to Blue gradients
- Success: Green to Emerald
- Warning: Yellow to Orange
- Danger: Red to Pink
- Neutral: Gray scales with subtle purple tints

### Responsive Design:
- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Touch-friendly buttons and inputs
- Optimized for all screen sizes

## Accessibility Features

✅ **Reduced Motion Support**: Respects `prefers-reduced-motion` settings
✅ **ARIA Labels**: Proper labeling for screen readers
✅ **Keyboard Navigation**: Full keyboard accessibility
✅ **Color Contrast**: WCAG AA compliant
✅ **Loading States**: Clear feedback during async operations
✅ **Error Messages**: Descriptive and helpful error states

## Privacy & Security

🔒 **Data Privacy**:
- All reports are user-specific
- Row Level Security (RLS) enabled
- Encrypted at rest in Supabase
- No sharing of reports between users

🛡️ **Authentication**:
- Requires login to access
- User ID validation on all requests
- Secure API endpoints

## Future Enhancements

### Planned Features:
- [ ] Report history page
- [ ] Compare reports over time (progress tracking)
- [ ] Export report as PDF
- [ ] Email report summary
- [ ] Share anonymous insights with therapist
- [ ] Integration with meditation and journal data
- [ ] AI-powered daily recommendations based on report
- [ ] Mood correlation with report insights
- [ ] Gamification (badges for completing assessments)

## Troubleshooting

### Common Issues:

**Report not generating:**
- Check OpenAI API key is valid
- Ensure all 7 questions are answered
- Verify server is running on correct port
- Check browser console for errors

**Can't see report:**
- Verify user is authenticated
- Check Supabase connection
- Ensure RLS policies are set up correctly

**Animations not working:**
- Check if browser supports the animations
- Verify React Bits effects are imported correctly
- Check for reduced motion preferences

## Support

For issues or questions:
1. Check the browser console for errors
2. Verify environment variables are set
3. Ensure database schema is correct
4. Contact support with error logs

## License

Part of the Elmora project - Mental wellness platform
© 2025 Elmora. All rights reserved.
