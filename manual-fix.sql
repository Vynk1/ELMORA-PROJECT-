-- Manual fix to complete onboarding for your specific user
-- Run this in Supabase SQL Editor

-- First, let's see your current profile
SELECT * FROM profiles WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = '99583253a@gmail.com'
);

-- Update your profile to complete onboarding
UPDATE profiles 
SET 
  assessment_completed = true,
  display_name = 'Test User',
  assessment_score = 75,
  assessment_category = 'Thriving'
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = '99583253a@gmail.com'
);

-- Verify the update
SELECT assessment_completed, assessment_score, assessment_category 
FROM profiles 
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = '99583253a@gmail.com'
);