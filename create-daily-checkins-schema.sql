-- ============================================
-- COMPREHENSIVE DAILY CHECK-INS DATABASE SCHEMA
-- ============================================

-- Create the daily_checkins table with comprehensive wellness tracking
CREATE TABLE IF NOT EXISTS daily_checkins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Core wellness metrics
  mood VARCHAR(20) NOT NULL CHECK (mood IN ('excited', 'happy', 'calm', 'neutral', 'tired', 'stressed', 'sad', 'anxious', 'frustrated', 'overwhelmed')),
  energy_level INTEGER NOT NULL CHECK (energy_level >= 1 AND energy_level <= 10),
  sleep_quality INTEGER NOT NULL CHECK (sleep_quality >= 1 AND sleep_quality <= 10),
  stress_level INTEGER NOT NULL CHECK (stress_level >= 1 AND stress_level <= 10),
  
  -- Activity and behavior
  physical_activity VARCHAR(20) NOT NULL CHECK (physical_activity IN ('none', 'light', 'moderate', 'intense')),
  social_interactions VARCHAR(20) NOT NULL CHECK (social_interactions IN ('none', 'few', 'moderate', 'many')),
  
  -- Emotional state (stored as JSON array for multi-select)
  emotions JSONB DEFAULT '[]'::jsonb,
  
  -- Goals and productivity
  daily_goals_progress VARCHAR(20) NOT NULL CHECK (daily_goals_progress IN ('not_started', 'partial', 'completed')),
  productivity_rating INTEGER CHECK (productivity_rating >= 1 AND productivity_rating <= 10),
  
  -- Environmental factors
  weather_impact VARCHAR(20) NOT NULL CHECK (weather_impact IN ('positive', 'neutral', 'negative')),
  
  -- Personal reflection
  gratitude TEXT,
  notes TEXT,
  challenges_faced TEXT,
  wins_celebrated TEXT,
  
  -- Additional metrics for AI analysis
  motivation_level INTEGER CHECK (motivation_level >= 1 AND motivation_level <= 10),
  focus_level INTEGER CHECK (focus_level >= 1 AND focus_level <= 10),
  overall_satisfaction INTEGER CHECK (overall_satisfaction >= 1 AND overall_satisfaction <= 10),
  
  -- Metadata
  checkin_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for efficient querying and AI analysis
CREATE INDEX IF NOT EXISTS idx_daily_checkins_user_id ON daily_checkins(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_checkins_date ON daily_checkins(checkin_date DESC);
CREATE INDEX IF NOT EXISTS idx_daily_checkins_user_date ON daily_checkins(user_id, checkin_date DESC);
CREATE INDEX IF NOT EXISTS idx_daily_checkins_mood ON daily_checkins(mood);
CREATE INDEX IF NOT EXISTS idx_daily_checkins_energy ON daily_checkins(energy_level);
CREATE INDEX IF NOT EXISTS idx_daily_checkins_stress ON daily_checkins(stress_level);
CREATE INDEX IF NOT EXISTS idx_daily_checkins_created_at ON daily_checkins(created_at DESC);

-- Composite indexes for trend analysis
CREATE INDEX IF NOT EXISTS idx_daily_checkins_wellness_metrics ON daily_checkins(user_id, energy_level, sleep_quality, stress_level, mood);

-- Enable Row Level Security
ALTER TABLE daily_checkins ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own check-ins" ON daily_checkins
  FOR SELECT USING (
    auth.uid()::uuid = user_id OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid()::uuid 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Users can insert own check-ins" ON daily_checkins
  FOR INSERT WITH CHECK (auth.uid()::uuid = user_id);

CREATE POLICY "Users can update own check-ins" ON daily_checkins
  FOR UPDATE USING (auth.uid()::uuid = user_id);

CREATE POLICY "Users can delete own check-ins" ON daily_checkins
  FOR DELETE USING (auth.uid()::uuid = user_id);

-- Create function to prevent duplicate check-ins on the same day
CREATE OR REPLACE FUNCTION prevent_duplicate_daily_checkins()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM daily_checkins 
    WHERE user_id = NEW.user_id 
    AND checkin_date = NEW.checkin_date 
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
  ) THEN
    RAISE EXCEPTION 'User has already completed a check-in for this date';
  END IF;
  
  -- Auto-update the updated_at timestamp
  NEW.updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger
CREATE TRIGGER prevent_duplicate_checkins_trigger
  BEFORE INSERT OR UPDATE ON daily_checkins
  FOR EACH ROW
  EXECUTE FUNCTION prevent_duplicate_daily_checkins();

-- Create view for AI-optimized check-in analysis
CREATE OR REPLACE VIEW checkin_analytics AS
SELECT 
  dc.*,
  -- Calculate streaks and patterns
  ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY checkin_date DESC) as days_back,
  LAG(mood) OVER (PARTITION BY user_id ORDER BY checkin_date) as previous_mood,
  LAG(energy_level) OVER (PARTITION BY user_id ORDER BY checkin_date) as previous_energy,
  LAG(stress_level) OVER (PARTITION BY user_id ORDER BY checkin_date) as previous_stress,
  
  -- Weekly averages
  AVG(energy_level) OVER (
    PARTITION BY user_id 
    ORDER BY checkin_date 
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) as weekly_avg_energy,
  AVG(sleep_quality) OVER (
    PARTITION BY user_id 
    ORDER BY checkin_date 
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) as weekly_avg_sleep,
  AVG(stress_level) OVER (
    PARTITION BY user_id 
    ORDER BY checkin_date 
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) as weekly_avg_stress,
  
  -- Monthly trends
  AVG(energy_level) OVER (
    PARTITION BY user_id 
    ORDER BY checkin_date 
    ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
  ) as monthly_avg_energy,
  
  -- Streak calculations
  (checkin_date - LAG(checkin_date, 1, checkin_date) OVER (PARTITION BY user_id ORDER BY checkin_date)) as gap_from_previous
  
FROM daily_checkins dc;

-- Create function to get user's check-in summary for AI context
CREATE OR REPLACE FUNCTION get_user_checkin_context(user_uuid UUID, days_back INTEGER DEFAULT 30)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'recent_checkins', (
      SELECT json_agg(
        json_build_object(
          'date', checkin_date,
          'mood', mood,
          'energy', energy_level,
          'sleep', sleep_quality,
          'stress', stress_level,
          'activity', physical_activity,
          'emotions', emotions,
          'goals', daily_goals_progress,
          'notes', COALESCE(notes, ''),
          'gratitude', COALESCE(gratitude, '')
        ) ORDER BY checkin_date DESC
      )
      FROM daily_checkins 
      WHERE user_id = user_uuid 
      AND checkin_date >= CURRENT_DATE - (days_back || ' days')::interval
      LIMIT 30
    ),
    'averages', (
      SELECT json_build_object(
        'avg_energy', ROUND(AVG(energy_level), 1),
        'avg_sleep', ROUND(AVG(sleep_quality), 1),
        'avg_stress', ROUND(AVG(stress_level), 1),
        'avg_motivation', ROUND(AVG(motivation_level), 1),
        'most_common_mood', MODE() WITHIN GROUP (ORDER BY mood)
      )
      FROM daily_checkins 
      WHERE user_id = user_uuid 
      AND checkin_date >= CURRENT_DATE - (days_back || ' days')::interval
    ),
    'patterns', (
      SELECT json_build_object(
        'total_checkins', COUNT(*),
        'consistency_rate', CASE 
          WHEN days_back > 0 THEN ROUND((COUNT(*)::float / days_back) * 100, 1)
          ELSE 0
        END,
        'goal_completion_rate', CASE
          WHEN COUNT(*) > 0 THEN ROUND((COUNT(*) FILTER (WHERE daily_goals_progress = 'completed')::float / COUNT(*)) * 100, 1)
          ELSE 0
        END,
        'high_energy_days', COUNT(*) FILTER (WHERE energy_level >= 7),
        'high_stress_days', COUNT(*) FILTER (WHERE stress_level >= 7),
        'recent_emotions', (
          SELECT json_agg(DISTINCT emotion)
          FROM daily_checkins dc,
          jsonb_array_elements_text(dc.emotions) AS emotion
          WHERE dc.user_id = user_uuid
          AND dc.checkin_date >= CURRENT_DATE - INTERVAL '7 days'
        )
      )
      FROM daily_checkins 
      WHERE user_id = user_uuid 
      AND checkin_date >= CURRENT_DATE - (days_back || ' days')::interval
    )
  ) INTO result;
  
  RETURN COALESCE(result, '{}'::json);
END;
$$ LANGUAGE plpgsql;

-- Create function for streak calculation
CREATE OR REPLACE FUNCTION calculate_checkin_streak(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  streak_count INTEGER := 0;
  current_date_check DATE := CURRENT_DATE;
BEGIN
  -- Start from today and count backwards
  LOOP
    IF EXISTS (
      SELECT 1 FROM daily_checkins 
      WHERE user_id = user_uuid 
      AND checkin_date = current_date_check
    ) THEN
      streak_count := streak_count + 1;
      current_date_check := current_date_check - INTERVAL '1 day';
    ELSE
      EXIT;
    END IF;
  END LOOP;
  
  RETURN streak_count;
END;
$$ LANGUAGE plpgsql;

-- Sample data for testing (optional - remove in production)
-- INSERT INTO daily_checkins (user_id, mood, energy_level, sleep_quality, stress_level, physical_activity, social_interactions, emotions, daily_goals_progress, weather_impact, gratitude, notes) 
-- VALUES 
-- ('sample-user-id', 'happy', 8, 7, 3, 'moderate', 'moderate', '["motivated", "focused"]', 'completed', 'positive', 'Grateful for a productive day', 'Had a great workout and completed all my tasks');

-- Grant permissions for authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON daily_checkins TO authenticated;
GRANT SELECT ON checkin_analytics TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_checkin_context(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_checkin_streak(UUID) TO authenticated;

-- ============================================
-- HELPFUL QUERIES FOR DEVELOPMENT
-- ============================================

/*
-- Get user's recent check-ins with analytics
SELECT * FROM checkin_analytics 
WHERE user_id = 'user-uuid-here' 
ORDER BY checkin_date DESC 
LIMIT 7;

-- Get user's check-in context for AI
SELECT get_user_checkin_context('user-uuid-here'::uuid);

-- Calculate user's current streak
SELECT calculate_checkin_streak('user-uuid-here'::uuid);

-- Find correlations between sleep and energy
SELECT 
  sleep_quality,
  ROUND(AVG(energy_level), 2) as avg_energy,
  COUNT(*) as data_points
FROM daily_checkins 
WHERE user_id = 'user-uuid-here'
GROUP BY sleep_quality
ORDER BY sleep_quality;

-- Weekly mood trends
SELECT 
  DATE_TRUNC('week', checkin_date) as week,
  mood,
  COUNT(*) as occurrences
FROM daily_checkins 
WHERE user_id = 'user-uuid-here'
GROUP BY week, mood
ORDER BY week DESC, occurrences DESC;
*/