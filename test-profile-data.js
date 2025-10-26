// Test script to check profile data
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProfileData() {
  try {
    console.log('Fetching all profiles...\n');
    
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('user_id, display_name, bio, avatar_url, assessment_completed, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error fetching profiles:', error);
      return;
    }

    if (!profiles || profiles.length === 0) {
      console.log('No profiles found in database');
      return;
    }

    console.log(`Found ${profiles.length} profiles:\n`);
    profiles.forEach((profile, index) => {
      console.log(`Profile ${index + 1}:`);
      console.log('  User ID:', profile.user_id);
      console.log('  Display Name:', profile.display_name || '(not set)');
      console.log('  Bio:', profile.bio || '(not set)');
      console.log('  Avatar URL:', profile.avatar_url || '(not set)');
      console.log('  Assessment Completed:', profile.assessment_completed);
      console.log('  Created At:', profile.created_at);
      console.log('');
    });

  } catch (error) {
    console.error('Error:', error);
  }
}

checkProfileData();
