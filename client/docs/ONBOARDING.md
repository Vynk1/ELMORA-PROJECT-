# Elmora Onboarding Flow Documentation

## Overview

The Elmora onboarding flow is a comprehensive 5-step process that collects user information, assesses their well-being mindset, and provides personalized AI-generated insights and recommendations.

## Flow Steps

### 1. Assessment (10 Questions)
- **Component**: `Assessment10`
- **Purpose**: Evaluate user's growth mindset and well-being approaches
- **Features**:
  - 10 multiple-choice questions with 4 options each
  - Points-based scoring system (0-3 points per question)
  - Question-by-question navigation with progress tracking
  - Keyboard navigation support (arrow keys, Enter)
  - Real-time answer validation

### 2. Profile Basics
- **Component**: `ProfileBasics`
- **Purpose**: Collect display name and bio
- **Features**:
  - Display name (required, 2-50 characters)
  - Bio (optional, max 140 characters)
  - Real-time character counting
  - Live preview of profile card
  - Form validation with error messages

### 3. Profile Photo
- **Component**: `ProfilePhoto`
- **Purpose**: Upload and process profile image
- **Features**:
  - Drag and drop file upload
  - File type validation (JPEG, PNG, WebP)
  - Automatic cropping to square format
  - Image compression to <300KB
  - Upload to Supabase Storage
  - Preview with removal option

### 4. Review & Submit
- **Component**: `ReviewAndSubmit`
- **Purpose**: Review collected data and submit for processing
- **Features**:
  - Complete assessment summary
  - Profile information preview
  - Selected answers review
  - AI analysis API call
  - Database persistence
  - Error handling and retry logic

### 5. AI Results
- **Component**: `AiResults`
- **Purpose**: Display personalized insights and recommendations
- **Features**:
  - Score visualization (X/30)
  - Category badge with emoji
  - Personalized insights (3-5 items)
  - Actionable recommendations (3-5 items)
  - Dashboard navigation CTA
  - Celebration animations

## Database Schema

### profiles table (extended)
```sql
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS display_name text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS assessment_completed boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS assessment_score integer;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS assessment_category text;
```

### assessment_results table
```sql
CREATE TABLE assessment_results (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    answers jsonb NOT NULL,
    score integer NOT NULL,
    category text NOT NULL,
    ai_insights jsonb,
    created_at timestamptz DEFAULT now()
);
```

### Storage bucket
- **Bucket**: `profiles`
- **Path structure**: `{user_id}/{user_id}.jpg`
- **Public access**: Yes
- **RLS policies**: User can manage own photos only

## Scoring System

### Point Values
- **Best answer (growth mindset)**: 3 points
- **Good answer**: 2 points
- **Mixed answer**: 1 point
- **Avoidant answer**: 0 points

### Categories (based on total score)
- **25-30**: Growth Champion 🏆
- **19-24**: Resilient Builder 💪
- **13-18**: Balanced Explorer 🔍
- **7-12**: Emerging Mindset 🌱
- **0-6**: Overwhelmed — Needs Support 🤗

## AI Analysis

### API Endpoint
- **URL**: `/api/analyze-wellbeing`
- **Method**: POST
- **Payload**:
```json
{
  "answers": [
    {"id": "Q1", "choice": "C", "points": 3},
    ...
  ],
  "basics": {
    "name": "User Name",
    "bio": "User bio text"
  }
}
```

### Response Format
```json
{
  "score": 24,
  "category": "Resilient Builder",
  "insights": [
    "You demonstrate good emotional regulation...",
    "Your resilience is developing well..."
  ],
  "recommendations": [
    "Practice daily reflection...",
    "Set challenging but achievable goals..."
  ]
}
```

### AI Provider
- **Primary**: Google Gemini Pro
- **Fallback**: Predefined insights based on score ranges
- **Environment Variable**: `GOOGLE_API_KEY` or `GEMINI_API_KEY`

## Authentication Flow Integration

### New User Flow
1. User signs up → redirected to `/onboarding`
2. Complete onboarding → `assessment_completed` set to `true`
3. Future logins → redirected to `/dashboard`

### Returning User Flow
1. User logs in → check `assessment_completed`
2. If `true` → redirect to `/dashboard`
3. If `false` → redirect to `/onboarding`

### Guards
- **Onboarding page**: Redirects completed users to dashboard
- **Login/signup**: Checks completion status for navigation
- **Auth callback**: Handles OAuth flows with onboarding check

## State Management

### OnboardingContext
- **Provider**: `OnboardingProvider`
- **Hook**: `useOnboarding()`
- **State**: Manages all flow data in memory until submission
- **Actions**: Update answers, basics, photo, AI results, navigation

### State Shape
```typescript
interface OnboardingState {
  answers: Answer[];
  basics: { name: string; bio: string };
  photo: { file?: File; url?: string };
  ai?: { score: number; category: string; insights: string[]; recommendations: string[] };
  currentStep: number;
  isSubmitting: boolean;
  error?: string;
}
```

## Security & Privacy

### Data Protection
- All API calls authenticated with Supabase Auth
- RLS policies enforce user-specific data access
- Profile photos stored with user-specific paths
- Assessment data encrypted in transit and at rest

### Privacy Features
- Bio is optional
- Profile photo is optional
- Assessment can be retaken anytime
- Data deletion available in settings
- No sharing without explicit consent

## Performance Considerations

### Image Handling
- Client-side compression to reduce upload size
- Automatic format conversion to JPEG
- CDN delivery through Supabase Storage
- Lazy loading of preview images

### API Optimization
- Single batch submission at end of flow
- Fallback insights prevent AI delays
- Progress preserved in context during navigation
- Minimal network requests until submission

## Error Handling

### Network Errors
- Retry mechanisms for failed requests
- Graceful degradation with fallback insights
- Clear error messages with retry options
- Progress preservation during errors

### Validation Errors
- Real-time form validation
- Required field enforcement
- File type and size validation
- Accessible error announcements

### Database Errors
- Unique constraint handling (duplicate assessment)
- Transaction rollback on partial failures
- Clear error messaging
- Automatic retry for transient errors

## Accessibility Features

### Keyboard Navigation
- Full keyboard support in assessment
- Arrow keys for option selection
- Enter key for progression
- Tab navigation throughout

### Screen Reader Support
- Proper ARIA labels and roles
- Live regions for dynamic content
- Descriptive alt text for images
- Semantic HTML structure

### Visual Considerations
- High contrast focus indicators
- Reduced motion preference support
- Clear visual hierarchy
- Minimum 4.5:1 color contrast

## Testing Strategy

### Unit Tests
- Component rendering
- State management logic
- Validation functions
- Score calculation

### Integration Tests
- Complete flow navigation
- API integration
- Database operations
- File upload functionality

### E2E Tests
- Full user journey
- Authentication integration
- Cross-browser compatibility
- Mobile responsiveness

## Environment Setup

### Required Variables
```bash
# API Keys
GOOGLE_API_KEY=your_gemini_api_key
GEMINI_API_KEY=your_gemini_api_key  # Alternative name

# Supabase
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Storage Configuration
1. Create `profiles` bucket in Supabase Storage
2. Enable public access for read operations
3. Configure RLS policies for user-specific uploads
4. Set up appropriate CORS policies

### Database Migration
Run the provided SQL migration to create required tables and policies:
```bash
# Apply migration
psql -h your-db-host -d your-db -f supabase/migrations/20241013161200_onboarding_schema.sql
```

## Deployment Notes

### Build Requirements
- Node.js 16+ for server components
- React 18+ for client components
- Supabase CLI for database migrations
- Google Cloud API access for AI features

### Production Considerations
- Enable rate limiting on AI endpoint
- Configure CDN for static assets
- Set up monitoring for completion rates
- Implement analytics tracking
- Configure backup strategies

## Future Enhancements

### Planned Features
- Progress saving between sessions
- Multiple assessment types
- Team/organization onboarding
- Integration with external tools
- Advanced analytics dashboard

### Potential Improvements
- Voice-guided assessment option
- Multi-language support
- Custom branding options
- Bulk user import
- Advanced AI personalization