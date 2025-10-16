-- Create chat tables for personalized AI chatbot
-- Run this SQL in your Supabase SQL Editor

-- ============================================
-- CHAT SESSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON public.chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_created_at ON public.chat_sessions(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own chat sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Users can insert own chat sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Users can delete own chat sessions" ON public.chat_sessions;

-- Create policies
CREATE POLICY "Users can view own chat sessions" 
  ON public.chat_sessions
  FOR SELECT 
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own chat sessions" 
  ON public.chat_sessions
  FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own chat sessions" 
  ON public.chat_sessions
  FOR DELETE 
  USING (auth.uid()::text = user_id);

-- ============================================
-- CHAT MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  message TEXT NOT NULL,
  is_bot BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON public.chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON public.chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can insert own chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can delete own chat messages" ON public.chat_messages;

-- Create policies
CREATE POLICY "Users can view own chat messages" 
  ON public.chat_messages
  FOR SELECT 
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own chat messages" 
  ON public.chat_messages
  FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own chat messages" 
  ON public.chat_messages
  FOR DELETE 
  USING (auth.uid()::text = user_id);

-- Grant permissions
GRANT ALL ON public.chat_sessions TO authenticated;
GRANT ALL ON public.chat_sessions TO service_role;
GRANT ALL ON public.chat_messages TO authenticated;
GRANT ALL ON public.chat_messages TO service_role;

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_chat_session_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.chat_sessions 
  SET updated_at = NOW() 
  WHERE id = NEW.session_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update session timestamp when new message is added
DROP TRIGGER IF EXISTS update_session_timestamp ON public.chat_messages;
CREATE TRIGGER update_session_timestamp
  AFTER INSERT ON public.chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_chat_session_updated_at();

-- Verify tables were created
SELECT 
  table_name, 
  column_name, 
  data_type 
FROM information_schema.columns 
WHERE table_name IN ('chat_sessions', 'chat_messages')
ORDER BY table_name, ordinal_position;