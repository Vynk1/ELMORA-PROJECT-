-- Create Test Data for Wellness Analytics
-- Run this in your Supabase SQL Editor to populate test data

-- First, create a test user in profiles table (if it doesn't exist)
INSERT INTO profiles (id, email, role, created_at, updated_at) 
VALUES (
  '550e8400-e29b-41d4-a716-446655440000'::uuid, 
  'test@example.com', 
  'user',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Insert sample check-in data for the last 7 days to populate analytics
INSERT INTO daily_checkins (
  user_id, 
  mood, 
  energy_level, 
  sleep_quality, 
  stress_level, 
  physical_activity, 
  social_interactions, 
  emotions, 
  daily_goals_progress, 
  productivity_rating, 
  weather_impact, 
  gratitude, 
  notes, 
  motivation_level, 
  focus_level, 
  overall_satisfaction,
  checkin_date
) VALUES 
-- Day 1 (today)
('550e8400-e29b-41d4-a716-446655440000', 'happy', 8, 7, 3, 'moderate', 'moderate', '["motivated", "focused"]', 'completed', 8, 'positive', 'Grateful for a productive day', 'Feeling great and accomplished', 9, 8, 8, CURRENT_DATE),

-- Day 2 (yesterday)
('550e8400-e29b-41d4-a716-446655440000', 'calm', 7, 8, 2, 'light', 'few', '["peaceful", "content"]', 'partial', 7, 'neutral', 'Grateful for good sleep', 'Relaxed day with some tasks done', 7, 7, 7, CURRENT_DATE - INTERVAL '1 day'),

-- Day 3 (2 days ago)
('550e8400-e29b-41d4-a716-446655440000', 'excited', 9, 6, 4, 'intense', 'many', '["energetic", "social", "motivated"]', 'completed', 9, 'positive', 'Grateful for great friends and workout', 'Amazing workout and social time', 10, 9, 9, CURRENT_DATE - INTERVAL '2 days'),

-- Day 4 (3 days ago)
('550e8400-e29b-41d4-a716-446655440000', 'tired', 4, 5, 6, 'none', 'none', '["tired", "overwhelmed"]', 'not_started', 4, 'negative', 'Grateful for rest opportunities', 'Challenging day, needed more rest', 4, 5, 4, CURRENT_DATE - INTERVAL '3 days'),

-- Day 5 (4 days ago)
('550e8400-e29b-41d4-a716-446655440000', 'neutral', 6, 7, 4, 'moderate', 'moderate', '["balanced", "focused"]', 'partial', 6, 'neutral', 'Grateful for steady progress', 'Balanced day with moderate activity', 6, 6, 6, CURRENT_DATE - INTERVAL '4 days'),

-- Day 6 (5 days ago)
('550e8400-e29b-41d4-a716-446655440000', 'happy', 8, 8, 2, 'moderate', 'moderate', '["happy", "grateful", "energetic"]', 'completed', 8, 'positive', 'Grateful for beautiful weather and good mood', 'Great day with high energy and good sleep', 8, 8, 8, CURRENT_DATE - INTERVAL '5 days'),

-- Day 7 (6 days ago)
('550e8400-e29b-41d4-a716-446655440000', 'anxious', 5, 6, 7, 'light', 'few', '["anxious", "worried"]', 'partial', 5, 'neutral', 'Grateful for support from family', 'Anxious day but family support helped', 5, 4, 5, CURRENT_DATE - INTERVAL '6 days');

-- Verify the data was inserted
SELECT 
  checkin_date,
  mood,
  energy_level,
  sleep_quality,
  stress_level,
  physical_activity
FROM daily_checkins 
WHERE user_id = '550e8400-e29b-41d4-a716-446655440000'
ORDER BY checkin_date DESC;