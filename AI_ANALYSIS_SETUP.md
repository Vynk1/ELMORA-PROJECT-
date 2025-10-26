# AI Analysis Setup - OpenAI Integration

## Overview
The onboarding assessment now uses **OpenAI GPT-3.5-turbo** for generating personalized wellness insights and recommendations.

## What Changed
- ✅ Replaced Google Gemini with OpenAI API
- ✅ Uses existing `OPENAI_API_KEY` from environment variables
- ✅ Generates personalized insights based on user's assessment responses
- ✅ Provides specific recommendations for well-being improvement

## API Configuration

### Required Environment Variable
```env
OPENAI_API_KEY=your_openai_api_key_here
```

Make sure this is set in your `.env` file.

### API Endpoint
- **Route**: `POST /api/analyze-wellbeing`
- **Location**: `server/routes/analyze-wellbeing.ts`

## How It Works

### 1. User Completes Assessment
- 10 questions with multiple choice answers (A, B, C, D)
- Each answer has points: 0, 1, 2, or 3
- Maximum score: 30 points

### 2. Score Calculation
```
Total Score = Sum of all answer points
```

### 3. Category Assignment
Based on total score:
- **25-30 points**: Growth Champion
- **19-24 points**: Resilient Builder
- **13-18 points**: Balanced Explorer
- **7-12 points**: Emerging Mindset
- **0-6 points**: Overwhelmed — Needs Support

### 4. AI Analysis
OpenAI GPT-3.5-turbo generates:
- **3-5 personalized insights** about their well-being mindset
- **3-5 specific recommendations** for improvement
- Uses user's name and bio for personalization
- Considers their score and category

### 5. Response Format
```json
{
  "score": 23,
  "category": "Resilient Builder",
  "insights": [
    "Personalized insight 1...",
    "Personalized insight 2...",
    "Personalized insight 3..."
  ],
  "recommendations": [
    "Specific recommendation 1...",
    "Specific recommendation 2...",
    "Specific recommendation 3..."
  ]
}
```

## OpenAI Configuration

### Model Settings
- **Model**: `gpt-3.5-turbo`
- **Temperature**: `0.7` (balanced creativity)
- **Max Tokens**: `800` (adequate for detailed insights)
- **Response Format**: `json_object` (ensures valid JSON)

### System Prompt
```
You are a professional wellness coach. 
Always respond with valid JSON only, no additional text.
```

### User Prompt Structure
- User Profile (name, bio)
- Assessment Score (X/30)
- Category (Growth Champion, etc.)
- Request for insights and recommendations

## Fallback Behavior

If OpenAI API fails or is unavailable, the system automatically uses **intelligent fallback insights** based on score categories:

- Pre-written insights matched to each category
- Still personalized by score range
- Ensures users always get meaningful feedback

## Testing

### Test the API directly:
```bash
curl -X POST http://localhost:8080/api/analyze-wellbeing \
  -H "Content-Type: application/json" \
  -d '{
    "answers": [
      {"id": "Q1", "choice": "C", "points": 3},
      {"id": "Q2", "choice": "B", "points": 2}
    ],
    "basics": {
      "name": "Test User",
      "bio": "Testing the system"
    }
  }'
```

### Expected Response:
```json
{
  "score": 5,
  "category": "Overwhelmed — Needs Support",
  "insights": ["..."],
  "recommendations": ["..."]
}
```

## Cost Considerations

### OpenAI Pricing (GPT-3.5-turbo)
- **Input**: ~$0.0015 per 1K tokens
- **Output**: ~$0.002 per 1K tokens
- **Average per analysis**: ~$0.003-0.005 per request

For 1000 users completing onboarding:
- Estimated cost: **$3-5 USD**

## Monitoring

Check console logs for:
- `Calling AI analysis API with answers:` - Request sent
- `AI analysis result:` - Successful response
- `AI analysis failed, using fallback:` - API error (uses fallback)
- `No OpenAI API key found, using fallback insights` - Missing API key

## Files Modified
1. `server/routes/analyze-wellbeing.ts` - Main AI analysis logic
2. `client/components/onboarding/ReviewAndSubmit.tsx` - Frontend API call
3. Package already includes `openai` dependency

## Future Enhancements
- [ ] Option to use GPT-4 for higher quality insights
- [ ] Save AI insights to database for future reference
- [ ] A/B testing between different AI prompts
- [ ] Multi-language support for insights
