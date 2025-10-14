-- Fix missing assessment_category column in profiles table
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/sskmosynylcmvaodpfsq/sql/new

-- Add missing assessment_category column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS assessment_category text;

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY column_name;