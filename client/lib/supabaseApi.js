/**
 * Supabase API utilities for Elmora
 * Handles CRUD operations for journals and meditations with proper auth
 */

import { supabase } from './supabaseClient';

/**
 * Get current authenticated user
 * @returns {Promise<Object|null>} User object or null
 */
async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// ============= JOURNAL API =============

/**
 * Add a new journal entry
 * @param {string} content - The journal entry content
 * @returns {Promise<Object>} Created journal entry
 */
export async function addJournal(content) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  
  const { data, error } = await supabase
    .from('journals')
    .insert([{ 
      content: content.trim(), 
      user_id: user.id 
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Error adding journal:', error);
    throw new Error(error.message || 'Failed to save journal entry');
  }
  
  return data;
}

/**
 * Get all journal entries for current user
 * @returns {Promise<Array>} Array of journal entries
 */
export async function getJournals() {
  const user = await getCurrentUser();
  if (!user) return [];
  
  const { data, error } = await supabase
    .from('journals')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching journals:', error);
    throw new Error(error.message || 'Failed to load journal entries');
  }
  
  return data || [];
}

/**
 * Update a journal entry
 * @param {string} id - Journal entry ID
 * @param {string} content - Updated content
 * @returns {Promise<Object>} Updated journal entry
 */
export async function updateJournal(id, content) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  
  const { data, error } = await supabase
    .from('journals')
    .update({ content: content.trim() })
    .eq('id', id)
    .eq('user_id', user.id) // Ensure user can only update their own entries
    .select()
    .single();
  
  if (error) {
    console.error('Error updating journal:', error);
    throw new Error(error.message || 'Failed to update journal entry');
  }
  
  return data;
}

/**
 * Delete a journal entry
 * @param {string} id - Journal entry ID
 * @returns {Promise<boolean>} Success status
 */
export async function deleteJournal(id) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  
  const { error } = await supabase
    .from('journals')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id); // Ensure user can only delete their own entries
  
  if (error) {
    console.error('Error deleting journal:', error);
    throw new Error(error.message || 'Failed to delete journal entry');
  }
  
  return true;
}

// ============= MEDITATION API =============

/**
 * Add a new meditation session
 * @param {string} type - Type of meditation (e.g., 'breathing', 'mindfulness', 'guided')
 * @param {number} duration - Duration in seconds
 * @returns {Promise<Object>} Created meditation record
 */
export async function addMeditation(type, duration) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  
  const { data, error } = await supabase
    .from('meditations')
    .insert([{ 
      type: type || 'mindfulness', 
      duration: Math.round(duration), 
      user_id: user.id 
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Error adding meditation:', error);
    throw new Error(error.message || 'Failed to save meditation session');
  }
  
  return data;
}

/**
 * Get all meditation sessions for current user
 * @returns {Promise<Array>} Array of meditation sessions
 */
export async function getMeditations() {
  const user = await getCurrentUser();
  if (!user) return [];
  
  const { data, error } = await supabase
    .from('meditations')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching meditations:', error);
    throw new Error(error.message || 'Failed to load meditation history');
  }
  
  return data || [];
}

/**
 * Delete a meditation session
 * @param {string} id - Meditation session ID
 * @returns {Promise<boolean>} Success status
 */
export async function deleteMeditation(id) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  
  const { error } = await supabase
    .from('meditations')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id); // Ensure user can only delete their own sessions
  
  if (error) {
    console.error('Error deleting meditation:', error);
    throw new Error(error.message || 'Failed to delete meditation session');
  }
  
  return true;
}

// ============= PROFILE API =============

/**
 * Get user profile
 * @returns {Promise<Object|null>} User profile or null
 */
export async function getProfile() {
  const user = await getCurrentUser();
  if (!user) return null;
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  
  if (error) {
    // If profile doesn't exist, return basic info from auth user
    if (error.code === 'PGRST116') {
      return {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || null,
        created_at: user.created_at
      };
    }
    console.error('Error fetching profile:', error);
    return null;
  }
  
  return data;
}

/**
 * Update user profile
 * @param {Object} updates - Profile updates
 * @returns {Promise<Object>} Updated profile
 */
export async function updateProfile(updates) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  
  const { data, error } = await supabase
    .from('profiles')
    .upsert([{ 
      id: user.id,
      ...updates 
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Error updating profile:', error);
    throw new Error(error.message || 'Failed to update profile');
  }
  
  return data;
}

// ============= STATISTICS API =============

/**
 * Get user statistics (journal count, meditation time, etc.)
 * @returns {Promise<Object>} Statistics object
 */
export async function getUserStats() {
  const user = await getCurrentUser();
  if (!user) return null;
  
  try {
    // Get journal count
    const { count: journalCount } = await supabase
      .from('journals')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);
    
    // Get meditation stats
    const { data: meditations } = await supabase
      .from('meditations')
      .select('duration, created_at')
      .eq('user_id', user.id);
    
    const totalMeditationTime = meditations?.reduce((total, session) => {
      return total + (session.duration || 0);
    }, 0) || 0;
    
    const meditationSessionCount = meditations?.length || 0;
    
    // Calculate streak (consecutive days with activity)
    // This is a simplified version - you might want to implement more sophisticated streak logic
    const today = new Date();
    const recentJournals = await supabase
      .from('journals')
      .select('created_at')
      .eq('user_id', user.id)
      .gte('created_at', new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false });
    
    return {
      journalCount: journalCount || 0,
      meditationSessionCount,
      totalMeditationTime, // in seconds
      totalMeditationMinutes: Math.round(totalMeditationTime / 60),
      averageSessionLength: meditationSessionCount > 0 ? Math.round(totalMeditationTime / meditationSessionCount) : 0,
      recentActivity: recentJournals.data?.length || 0
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return {
      journalCount: 0,
      meditationSessionCount: 0,
      totalMeditationTime: 0,
      totalMeditationMinutes: 0,
      averageSessionLength: 0,
      recentActivity: 0
    };
  }
}

// ============= HEALTH REPORT API =============

/**
 * Get all health reports for current user
 * @returns {Promise<Array>} Array of health reports
 */
export async function getHealthReports() {
  const user = await getCurrentUser();
  if (!user) return [];
  
  const { data, error } = await supabase
    .from('health_data')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching health reports:', error);
    throw new Error(error.message || 'Failed to load health reports');
  }
  
  return data || [];
}

/**
 * Get specific health report by ID
 * @param {string} reportId - Report ID
 * @returns {Promise<Object>} Health report
 */
export async function getHealthReport(reportId) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  
  const { data, error } = await supabase
    .from('health_data')
    .select('*')
    .eq('id', reportId)
    .eq('user_id', user.id)
    .single();
  
  if (error) {
    console.error('Error fetching health report:', error);
    throw new Error(error.message || 'Failed to load health report');
  }
  
  return data;
}

/**
 * Generate AI health report
 * @param {Array<string>} answers - Array of 7 answers to psychological questions
 * @returns {Promise<Object>} Generated report data
 */
export async function generateHealthReport(answers) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL || 'http://localhost:3000'}/api/generate-report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.id,
        answers: answers
      })
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to generate report');
    }
    
    return data.data;
  } catch (error) {
    console.error('Error generating health report:', error);
    throw new Error(error.message || 'Failed to generate health report');
  }
}

// ============= CHAT API =============

/**
 * Send message to personalized AI chatbot
 * @param {string} message - User message
 * @param {string} currentMood - Current user mood
 * @returns {Promise<Object>} AI response
 */
export async function sendChatMessage(message, currentMood) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL || 'http://localhost:3000'}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.id,
        message: message,
        currentMood: currentMood
      })
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to send message');
    }
    
    return data;
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw new Error(error.message || 'Failed to send chat message');
  }
}

/**
 * Get chat history for current user
 * @param {number} limit - Number of messages to retrieve
 * @returns {Promise<Array>} Array of chat messages
 */
export async function getChatHistory(limit = 50) {
  const user = await getCurrentUser();
  if (!user) return [];
  
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL || 'http://localhost:3000'}/api/chat/history/${user.id}?limit=${limit}`
    );
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to load chat history');
    }
    
    return data.data || [];
  } catch (error) {
    console.error('Error loading chat history:', error);
    return [];
  }
}

/**
 * Delete chat history for current user
 * @returns {Promise<boolean>} Success status
 */
export async function deleteChatHistory() {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL || 'http://localhost:3000'}/api/chat/history/${user.id}`,
      { method: 'DELETE' }
    );
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to delete chat history');
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting chat history:', error);
    throw new Error(error.message || 'Failed to delete chat history');
  }
}

// ============= ENHANCED AI PERSONALIZATION API =============

/**
 * Get personalized daily affirmation
 * @returns {Promise<Object>} Affirmation data
 */
export async function getDailyAffirmation() {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL || 'http://localhost:3000'}/api/affirmation`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      }
    );
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to generate affirmation');
    }
    
    return data;
  } catch (error) {
    console.error('Error getting affirmation:', error);
    throw new Error(error.message || 'Failed to generate affirmation');
  }
}

/**
 * Get personalized wellness insights
 * @returns {Promise<Object>} Insights data
 */
export async function getWellnessInsights() {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL || 'http://localhost:3000'}/api/insights`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      }
    );
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to generate insights');
    }
    
    return data;
  } catch (error) {
    console.error('Error getting insights:', error);
    throw new Error(error.message || 'Failed to generate insights');
  }
}

/**
 * Get mood-based recommendations
 * @param {string} currentMood - User's current mood
 * @returns {Promise<Object>} Recommendations data
 */
export async function getMoodRecommendations(currentMood) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL || 'http://localhost:3000'}/api/mood-recommendations`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, currentMood })
      }
    );
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to generate recommendations');
    }
    
    return data;
  } catch (error) {
    console.error('Error getting mood recommendations:', error);
    throw new Error(error.message || 'Failed to generate recommendations');
  }
}

/**
 * Get progress tracking summary
 * @returns {Promise<Object>} Progress summary data
 */
export async function getProgressSummary() {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL || 'http://localhost:3000'}/api/progress-summary`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      }
    );
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to generate progress summary');
    }
    
    return data;
  } catch (error) {
    console.error('Error getting progress summary:', error);
    throw new Error(error.message || 'Failed to generate progress summary');
  }
}
