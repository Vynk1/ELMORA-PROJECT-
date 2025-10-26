// server.js

import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Enable CORS for all routes
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:8080',
  'http://localhost:8081',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:8081',
  'http://127.0.0.1:3000'
];

// In production (Vercel), allow all vercel.app domains
if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
  app.use(cors({
    origin: true, // Allow all origins in production
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
} else {
  app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
}

app.use(express.json());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Questions for context
const QUESTIONS = [
  "When you make a mistake or face a setback, how do you typically respond?",
  "When someone offers you critical feedback, what is your usual reaction?",
  "When you feel angry or upset, how do you typically react?",
  "When you're under a lot of stress or have many tasks to do, how do you handle it?",
  "Which statement best describes your view of your personal abilities?",
  "When something important doesn't go the way you hoped (like not getting a job or failing a test), how do you usually react?",
  "When you receive praise or a compliment for something you did, how do you feel or respond?"
];

// Generate detailed psychological report using GPT-3.5
async function generateAIReport(answers) {
  // Create Q&A pairs for better context
  const qaContext = QUESTIONS.map((q, i) => {
    return `Question ${i + 1}: ${q}\nAnswer: ${answers[i]}`;
  }).join('\n\n');

  const prompt = `You are an expert clinical psychologist specializing in mental health assessment. Based on the following responses to a psychological questionnaire, provide a comprehensive mental health analysis.

${qaContext}

Please analyze these responses and provide a detailed psychological report in the following JSON format:

{
  "overallStatus": {
    "summary": "Brief overall mental health status (2-3 sentences)",
    "wellbeingScore": <number 0-100>,
    "riskLevel": "low/moderate/high"
  },
  "psychologicalTraits": {
    "resilience": {
      "score": <number 0-100>,
      "analysis": "Detailed analysis of resilience patterns",
      "strengths": ["strength1", "strength2"],
      "concerns": ["concern1", "concern2"]
    },
    "emotionalRegulation": {
      "score": <number 0-100>,
      "analysis": "Detailed analysis of emotional regulation abilities",
      "strengths": ["strength1", "strength2"],
      "concerns": ["concern1", "concern2"]
    },
    "stressManagement": {
      "score": <number 0-100>,
      "analysis": "Detailed analysis of stress coping mechanisms",
      "strengths": ["strength1", "strength2"],
      "concerns": ["concern1", "concern2"]
    },
    "growthMindset": {
      "score": <number 0-100>,
      "analysis": "Detailed analysis of growth vs fixed mindset",
      "strengths": ["strength1", "strength2"],
      "concerns": ["concern1", "concern2"]
    },
    "selfEsteem": {
      "score": <number 0-100>,
      "analysis": "Detailed analysis of self-worth and confidence",
      "strengths": ["strength1", "strength2"],
      "concerns": ["concern1", "concern2"]
    },
    "emotionalIntelligence": {
      "score": <number 0-100>,
      "analysis": "Detailed analysis of emotional awareness and response to feedback",
      "strengths": ["strength1", "strength2"],
      "concerns": ["concern1", "concern2"]
    }
  },
  "detailedAnalysis": {
    "copingStrategies": "Analysis of how the person copes with challenges",
    "emotionalPatterns": "Analysis of emotional response patterns",
    "behavioralTendencies": "Analysis of behavioral habits and tendencies",
    "cognitivePatterns": "Analysis of thought patterns and beliefs"
  },
  "areasOfConcern": [
    {
      "area": "Specific area name",
      "severity": "mild/moderate/severe",
      "description": "Detailed explanation of the concern",
      "indicators": ["indicator1", "indicator2"]
    }
  ],
  "recommendations": {
    "immediate": [
      {
        "title": "Recommendation title",
        "description": "Detailed actionable recommendation",
        "priority": "high/medium/low"
      }
    ],
    "shortTerm": [
      {
        "title": "Recommendation title",
        "description": "Recommendation for next 1-3 months",
        "priority": "high/medium/low"
      }
    ],
    "longTerm": [
      {
        "title": "Recommendation title",
        "description": "Recommendation for ongoing development",
        "priority": "high/medium/low"
      }
    ],
    "professionalHelp": {
      "recommended": true/false,
      "reason": "Explanation if professional help is recommended",
      "type": "therapist/counselor/psychiatrist/support group"
    }
  },
  "resources": [
    {
      "type": "book/app/technique/exercise",
      "name": "Resource name",
      "description": "How this resource can help",
      "link": "URL if applicable"
    }
  ],
  "positiveAspects": [
    "List of strengths and positive psychological patterns observed"
  ]
}

Be empathetic, thorough, and provide actionable insights. Focus on both strengths and areas for growth. Ensure all scores reflect the actual responses given.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert clinical psychologist providing detailed, empathetic mental health assessments. Always respond with valid JSON only. Do not include any markdown formatting, code blocks, or explanatory text - only pure JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 3000,
      response_format: { type: "json_object" }
    });

    const reportText = completion.choices[0].message.content.trim();
    console.log('Raw AI Response length:', reportText.length);
    
    // Remove any markdown code blocks if present
    let cleanedText = reportText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    
    // Extract JSON from response (in case there's any extra text)
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Failed to extract JSON. Response:', reportText.substring(0, 500));
      throw new Error('Failed to extract JSON from AI response');
    }
    
    let report;
    try {
      report = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError.message);
      console.error('Problematic JSON snippet:', jsonMatch[0].substring(0, 1000));
      throw new Error('Failed to parse AI report JSON: ' + parseError.message);
    }
    
    return report;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to generate AI report: ' + error.message);
  }
}

// Store report in Supabase
async function storeReport(userId, answers, report) {
  try {
    const { data, error } = await supabase
      .from('health_data')
      .insert([
        {
          user_id: userId,
          answers: answers,
          report: report,
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Supabase Error:', error);
    throw new Error('Failed to store report: ' + error.message);
  }
}

// Main endpoint to generate report
app.post('/api/generate-report', async (req, res) => {
  try {
    const { userId, answers } = req.body;

    // Validation
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required'
      });
    }

    if (!answers || !Array.isArray(answers) || answers.length !== 7) {
      return res.status(400).json({
        success: false,
        error: 'answers must be an array of 7 responses'
      });
    }

    // Check if all answers are provided
    const emptyAnswers = answers.filter(a => !a || a.trim() === '');
    if (emptyAnswers.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'All 7 questions must be answered'
      });
    }

    console.log('Generating AI report for user:', userId);
    
    // Generate AI report
    const report = await generateAIReport(answers);
    
    console.log('Report generated successfully, storing in database...');
    
    // Store in Supabase
    const storedData = await storeReport(userId, answers, report);
    
    console.log('Report stored successfully with ID:', storedData.id);

    // Return response
    res.status(200).json({
      success: true,
      message: 'Mental health report generated successfully',
      data: {
        reportId: storedData.id,
        userId: userId,
        report: report,
        timestamp: storedData.created_at
      }
    });

  } catch (error) {
    console.error('Error in generate-report:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get report by user ID
app.get('/api/reports/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from('health_data')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get specific report by ID
app.get('/api/report/:reportId', async (req, res) => {
  try {
    const { reportId } = req.params;

    const { data, error } = await supabase
      .from('health_data')
      .select('*')
      .eq('id', reportId)
      .single();

    if (error) throw error;

    res.status(200).json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// PERSONALIZED CHATBOT API
// ============================================

// ============================================
// 🧠 AI ANALYSIS HELPER FUNCTIONS
// ============================================

/**
 * Generate immediate insights after check-in submission
 */
async function generateCheckinInsights(checkinData) {
  try {
    const prompt = `Based on this daily check-in data, provide 2-3 immediate, personalized insights:

Check-in Data:
- Mood: ${checkinData.mood}
- Energy: ${checkinData.energy_level}/10
- Sleep Quality: ${checkinData.sleep_quality}/10
- Stress Level: ${checkinData.stress_level}/10
- Physical Activity: ${checkinData.physical_activity}
- Goals Progress: ${checkinData.daily_goals_progress}
- Social Interactions: ${checkinData.social_interactions}
- Weather Impact: ${checkinData.weather_impact}
${checkinData.emotions ? `- Emotions: ${JSON.stringify(checkinData.emotions)}` : ''}
${checkinData.gratitude ? `- Gratitude: ${checkinData.gratitude}` : ''}
${checkinData.notes ? `- Notes: ${checkinData.notes}` : ''}

Provide insights in JSON format:
{
  "insights": [
    {
      "type": "observation|encouragement|suggestion",
      "title": "Brief title",
      "message": "Personalized insight message",
      "emoji": "relevant emoji"
    }
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 300,
      response_format: { type: "json_object" }
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error('Error generating check-in insights:', error);
    return {
      insights: [{
        type: "encouragement",
        title: "Thank you!",
        message: "Thanks for completing your daily check-in. Every step counts in your wellness journey!",
        emoji: "🌟"
      }]
    };
  }
}

/**
 * Generate comprehensive AI insights from check-in patterns
 */
async function generateAICheckinInsights(contextData) {
  try {
    if (!contextData || !contextData.recent_checkins || contextData.recent_checkins.length === 0) {
      return {
        insights: [],
        message: "Complete a few more daily check-ins to get personalized insights!",
        recommendations: []
      };
    }

    const recentCheckins = contextData.recent_checkins.slice(0, 14); // Last 2 weeks
    const averages = contextData.averages || {};
    const patterns = contextData.patterns || {};

    const prompt = `Analyze this user's daily check-in patterns and provide actionable wellness insights:

Recent Data (${recentCheckins.length} check-ins):
${recentCheckins.map(c => 
  `- ${c.date}: Mood: ${c.mood}, Energy: ${c.energy}, Sleep: ${c.sleep}, Stress: ${c.stress}, Activity: ${c.activity}`
).join('\n')}

Averages:
- Energy: ${averages.avg_energy}/10
- Sleep: ${averages.avg_sleep}/10
- Stress: ${averages.avg_stress}/10
- Most common mood: ${averages.most_common_mood}

Patterns:
- Total check-ins: ${patterns.total_checkins}
- Goal completion rate: ${patterns.goal_completion_rate}%
- High energy days: ${patterns.high_energy_days}
- High stress days: ${patterns.high_stress_days}

Generate insights in JSON format:
{
  "insights": [
    {
      "category": "sleep|energy|stress|mood|activity|goals",
      "type": "pattern|correlation|concern|strength",
      "title": "Brief insight title",
      "observation": "What the data shows",
      "impact": "Why this matters",
      "emoji": "relevant emoji"
    }
  ],
  "recommendations": [
    {
      "title": "Actionable recommendation",
      "description": "How to implement this",
      "priority": "high|medium|low",
      "category": "wellness category",
      "emoji": "emoji"
    }
  ],
  "correlations": [
    {
      "factor1": "sleep",
      "factor2": "energy",
      "relationship": "positive|negative|neutral",
      "strength": "strong|moderate|weak",
      "insight": "What this correlation means"
    }
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(completion.choices[0].message.content);
    return {
      ...result,
      data_summary: {
        total_checkins: patterns.total_checkins,
        consistency_rate: patterns.consistency_rate,
        date_range: {
          from: recentCheckins[recentCheckins.length - 1]?.date,
          to: recentCheckins[0]?.date
        }
      }
    };

  } catch (error) {
    console.error('Error generating AI check-in insights:', error);
    return {
      insights: [],
      recommendations: [],
      correlations: [],
      error: 'Unable to generate insights at this time'
    };
  }
}

/**
 * Analyze trends from check-in analytics data
 */
function analyzeTrends(analytics) {
  if (!analytics || analytics.length === 0) {
    return {
      energy_trend: 'insufficient_data',
      mood_pattern: 'insufficient_data',
      sleep_correlation: 'insufficient_data',
      stress_pattern: 'insufficient_data'
    };
  }

  try {
    // Calculate trends
    const energyTrend = calculateTrend(analytics.map(a => a.energy_level));
    const stressTrend = calculateTrend(analytics.map(a => a.stress_level));
    const sleepTrend = calculateTrend(analytics.map(a => a.sleep_quality));

    // Find most common mood
    const moodCounts = {};
    analytics.forEach(a => {
      moodCounts[a.mood] = (moodCounts[a.mood] || 0) + 1;
    });
    const dominantMood = Object.keys(moodCounts).reduce((a, b) => 
      moodCounts[a] > moodCounts[b] ? a : b
    );

    // Calculate correlations (simplified)
    const sleepEnergyCorrelation = calculateCorrelation(
      analytics.map(a => a.sleep_quality),
      analytics.map(a => a.energy_level)
    );

    const stressEnergyCorrelation = calculateCorrelation(
      analytics.map(a => a.stress_level),
      analytics.map(a => a.energy_level)
    );

    return {
      energy_trend: {
        direction: energyTrend > 0.1 ? 'improving' : energyTrend < -0.1 ? 'declining' : 'stable',
        slope: energyTrend,
        average: analytics.reduce((sum, a) => sum + a.energy_level, 0) / analytics.length
      },
      sleep_trend: {
        direction: sleepTrend > 0.1 ? 'improving' : sleepTrend < -0.1 ? 'declining' : 'stable',
        slope: sleepTrend,
        average: analytics.reduce((sum, a) => sum + a.sleep_quality, 0) / analytics.length
      },
      stress_trend: {
        direction: stressTrend > 0.1 ? 'increasing' : stressTrend < -0.1 ? 'decreasing' : 'stable',
        slope: stressTrend,
        average: analytics.reduce((sum, a) => sum + a.stress_level, 0) / analytics.length
      },
      mood_pattern: {
        dominant: dominantMood,
        distribution: moodCounts,
        variety: Object.keys(moodCounts).length
      },
      correlations: {
        sleep_energy: {
          strength: Math.abs(sleepEnergyCorrelation),
          direction: sleepEnergyCorrelation > 0 ? 'positive' : 'negative',
          interpretation: Math.abs(sleepEnergyCorrelation) > 0.5 ? 
            'strong correlation' : Math.abs(sleepEnergyCorrelation) > 0.3 ? 
            'moderate correlation' : 'weak correlation'
        },
        stress_energy: {
          strength: Math.abs(stressEnergyCorrelation),
          direction: stressEnergyCorrelation > 0 ? 'positive' : 'negative',
          interpretation: Math.abs(stressEnergyCorrelation) > 0.5 ? 
            'strong correlation' : Math.abs(stressEnergyCorrelation) > 0.3 ? 
            'moderate correlation' : 'weak correlation'
        }
      },
      summary: {
        total_days: analytics.length,
        best_energy_day: analytics.reduce((max, a) => a.energy_level > max.energy_level ? a : max, analytics[0]),
        lowest_stress_day: analytics.reduce((min, a) => a.stress_level < min.stress_level ? a : min, analytics[0])
      }
    };
  } catch (error) {
    console.error('Error analyzing trends:', error);
    return { error: 'Unable to analyze trends' };
  }
}

/**
 * Calculate linear trend (slope) for a series of values
 */
function calculateTrend(values) {
  if (values.length < 2) return 0;
  
  const n = values.length;
  const sumX = (n * (n - 1)) / 2; // Sum of indices 0,1,2...n-1
  const sumY = values.reduce((sum, val) => sum + val, 0);
  const sumXY = values.reduce((sum, val, idx) => sum + (val * idx), 0);
  const sumX2 = values.reduce((sum, val, idx) => sum + (idx * idx), 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  return slope;
}

/**
 * Calculate Pearson correlation coefficient between two arrays
 */
function calculateCorrelation(x, y) {
  if (x.length !== y.length || x.length === 0) return 0;
  
  const n = x.length;
  const sumX = x.reduce((sum, val) => sum + val, 0);
  const sumY = y.reduce((sum, val) => sum + val, 0);
  const sumXY = x.reduce((sum, val, idx) => sum + (val * y[idx]), 0);
  const sumX2 = x.reduce((sum, val) => sum + (val * val), 0);
  const sumY2 = y.reduce((sum, val) => sum + (val * val), 0);
  
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  
  return denominator === 0 ? 0 : numerator / denominator;
}

/**
 * Get user context for personalized chat
 */
async function getUserContext(userId) {
  try {
    // Get latest health report
    const { data: healthReports } = await supabase
      .from('health_data')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);

    // Get recent journals (last 5)
    const { data: journals } = await supabase
      .from('journals')
      .select('content, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    // Get meditation stats
    const { data: meditations } = await supabase
      .from('meditations')
      .select('type, duration, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    // Get recent check-ins (last 7 days) for enhanced personalization
    const { data: recentCheckins } = await supabase
      .from('daily_checkins')
      .select('mood, energy_level, sleep_quality, stress_level, physical_activity, emotions, gratitude, notes, checkin_date')
      .eq('user_id', userId)
      .gte('checkin_date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('checkin_date', { ascending: false })
      .limit(7);

    // Calculate check-in averages for context
    let checkinSummary = null;
    if (recentCheckins && recentCheckins.length > 0) {
      const avgEnergy = recentCheckins.reduce((sum, c) => sum + c.energy_level, 0) / recentCheckins.length;
      const avgSleep = recentCheckins.reduce((sum, c) => sum + c.sleep_quality, 0) / recentCheckins.length;
      const avgStress = recentCheckins.reduce((sum, c) => sum + c.stress_level, 0) / recentCheckins.length;
      
      const moodCounts = {};
      recentCheckins.forEach(c => {
        moodCounts[c.mood] = (moodCounts[c.mood] || 0) + 1;
      });
      const dominantMood = Object.keys(moodCounts).reduce((a, b) => 
        moodCounts[a] > moodCounts[b] ? a : b
      );

      checkinSummary = {
        count: recentCheckins.length,
        avgEnergy: Math.round(avgEnergy * 10) / 10,
        avgSleep: Math.round(avgSleep * 10) / 10,
        avgStress: Math.round(avgStress * 10) / 10,
        dominantMood,
        latestMood: recentCheckins[0].mood,
        consistency: recentCheckins.length >= 5 ? 'high' : recentCheckins.length >= 3 ? 'moderate' : 'low'
      };
    }

    return {
      latestReport: healthReports?.[0] || null,
      recentJournals: journals || [],
      meditationHistory: meditations || [],
      recentCheckins: recentCheckins || [],
      checkinSummary,
      hasReport: !!healthReports?.[0],
      hasRecentCheckins: !!(recentCheckins && recentCheckins.length > 0)
    };
  } catch (error) {
    console.error('Error getting user context:', error);
    return {
      latestReport: null,
      recentJournals: [],
      meditationHistory: [],
      recentCheckins: [],
      checkinSummary: null,
      hasReport: false,
      hasRecentCheckins: false
    };
  }
}

/**
 * Get or create chat session
 */
async function getChatSession(userId) {
  try {
    // Try to get existing session from today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data: existingSessions } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', today.toISOString())
      .order('created_at', { ascending: false })
      .limit(1);

    if (existingSessions && existingSessions.length > 0) {
      return existingSessions[0];
    }

    // Create new session
    const { data: newSession, error } = await supabase
      .from('chat_sessions')
      .insert([{
        user_id: userId,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return newSession;
  } catch (error) {
    console.error('Error managing chat session:', error);
    return null;
  }
}

/**
 * Save chat message to database
 */
async function saveChatMessage(sessionId, userId, message, isBot) {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert([{
        session_id: sessionId,
        user_id: userId,
        message: message,
        is_bot: isBot,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving chat message:', error);
    return null;
  }
}

/**
 * Generate personalized system prompt based on user context
 */
function generateSystemPrompt(userContext, currentMood) {
  let prompt = `You are Elmora, a warm, empathetic, and supportive AI wellness companion for a mental health and wellbeing platform. Your role is to provide personalized support, encouragement, and guidance.

PERSONALITY:
- Warm, caring, and empathetic friend
- Professional but approachable
- Encouraging and positive while being realistic
- Never judgmental
- Use emojis sparingly but appropriately 🌿💜✨

CAPABILITIES:
- Provide mental health support and coping strategies
- Suggest personalized wellness activities
- Track progress and celebrate wins
- Offer meditation and journaling prompts
- Help with stress, anxiety, and emotional challenges
- Provide crisis resources when needed

IMPORTANT GUIDELINES:
- You are NOT a replacement for professional therapy
- If severe issues are detected, recommend professional help
- Keep responses concise (2-4 sentences usually)
- Be specific and actionable in your advice
- Reference user's history when relevant

CURRENT USER MOOD: ${currentMood || 'not specified'}
`;

  // Add personalized context if available
  if (userContext.hasReport && userContext.latestReport) {
    const report = userContext.latestReport.report;
    prompt += `\nUSER'S PSYCHOLOGICAL PROFILE (from recent assessment):
- Overall Wellbeing Score: ${report.overallStatus?.wellbeingScore || 'N/A'}/100
- Risk Level: ${report.overallStatus?.riskLevel || 'unknown'}
- Summary: ${report.overallStatus?.summary || 'No summary available'}

KEY TRAITS:
- Resilience: ${report.psychologicalTraits?.resilience?.score || 'N/A'}/100
- Emotional Regulation: ${report.psychologicalTraits?.emotionalRegulation?.score || 'N/A'}/100
- Stress Management: ${report.psychologicalTraits?.stressManagement?.score || 'N/A'}/100
- Growth Mindset: ${report.psychologicalTraits?.growthMindset?.score || 'N/A'}/100
- Self-Esteem: ${report.psychologicalTraits?.selfEsteem?.score || 'N/A'}/100

STRENGTHS TO ENCOURAGE:
${report.positiveAspects?.slice(0, 3).map((aspect, i) => `${i + 1}. ${aspect}`).join('\n') || 'None noted yet'}

AREAS TO SUPPORT:
${report.areasOfConcern?.slice(0, 2).map((concern, i) => `${i + 1}. ${concern.area} (${concern.severity})`).join('\n') || 'None noted'}

TOP RECOMMENDATIONS:
${report.recommendations?.immediate?.slice(0, 2).map((rec, i) => `${i + 1}. ${rec.title}`).join('\n') || 'None yet'}
`;
  }

    // Add recent activity context
    if (userContext.recentJournals && userContext.recentJournals.length > 0) {
      const lastJournal = userContext.recentJournals[0];
      const journalDate = new Date(lastJournal.created_at);
      const daysAgo = Math.floor((Date.now() - journalDate.getTime()) / (1000 * 60 * 60 * 24));
      prompt += `\nRECENT JOURNALING: Last entry was ${daysAgo} day(s) ago. Total recent entries: ${userContext.recentJournals.length}`;
    }

    if (userContext.meditationHistory && userContext.meditationHistory.length > 0) {
      const totalMinutes = Math.round(userContext.meditationHistory.reduce((sum, m) => sum + (m.duration || 0), 0) / 60);
      prompt += `\nRECENT MEDITATION: ${userContext.meditationHistory.length} sessions, ${totalMinutes} minutes total`;
    }

    // Add comprehensive check-in data context
    if (userContext.hasRecentCheckins && userContext.checkinSummary) {
      const summary = userContext.checkinSummary;
      prompt += `\n\nRECENT DAILY CHECK-INS (${summary.count} of last 7 days):
- Current Mood: ${summary.latestMood} (Dominant: ${summary.dominantMood})
- Average Energy: ${summary.avgEnergy}/10
- Average Sleep Quality: ${summary.avgSleep}/10
- Average Stress Level: ${summary.avgStress}/10
- Check-in Consistency: ${summary.consistency}

RECENT CHECK-IN PATTERNS:
${userContext.recentCheckins.slice(0, 3).map((checkin, i) => 
  `Day ${i + 1}: ${checkin.mood} mood, Energy ${checkin.energy_level}, Sleep ${checkin.sleep_quality}, Stress ${checkin.stress_level}${
    checkin.emotions && checkin.emotions.length > 0 ? `, Emotions: ${JSON.parse(checkin.emotions).slice(0, 2).join(', ')}` : ''
  }${
    checkin.gratitude ? `, Grateful for: ${checkin.gratitude.substring(0, 50)}${checkin.gratitude.length > 50 ? '...' : ''}` : ''
  }`
).join('\n')}

USE THIS DATA TO:
- Reference specific mood patterns and energy levels
- Acknowledge their consistency with check-ins
- Provide targeted advice based on sleep-energy correlations
- Address stress levels with specific techniques
- Build on their gratitude practices
- Recognize emotional patterns and provide support`;
    }

  prompt += `\n\nREMEMBER: Use this context to provide highly personalized, relevant advice. Reference their strengths and gently address concerns. Be their supportive wellness companion! 🌿`;

  return prompt;
}

/**
 * Chatbot endpoint - handles personalized conversations
 */
app.post('/api/chat', async (req, res) => {
  try {
    const { userId, message, currentMood } = req.body;

    // Validation
    if (!userId || !message) {
      return res.status(400).json({
        success: false,
        error: 'userId and message are required'
      });
    }

    console.log(`Chat request from user ${userId}: ${message.substring(0, 50)}...`);

    // Get user context for personalization
    const userContext = await getUserContext(userId);

    // Get or create chat session
    const session = await getChatSession(userId);

    // Get recent conversation history (last 10 messages)
    const { data: recentMessages } = await supabase
      .from('chat_messages')
      .select('message, is_bot, created_at')
      .eq('session_id', session?.id)
      .order('created_at', { ascending: false })
      .limit(10);

    // Build conversation history for context
    const conversationHistory = (recentMessages || [])
      .reverse()
      .map(msg => ({
        role: msg.is_bot ? 'assistant' : 'user',
        content: msg.message
      }));

    // Generate personalized system prompt
    const systemPrompt = generateSystemPrompt(userContext, currentMood);

    // Detect crisis keywords
    const crisisKeywords = ['suicide', 'kill myself', 'end my life', 'want to die', 'self harm', 'hurt myself'];
    const isCrisis = crisisKeywords.some(keyword => message.toLowerCase().includes(keyword));

    if (isCrisis) {
      const crisisResponse = `I'm really concerned about what you're sharing with me. Please know that you're not alone, and there are people who can help right now.

🆘 **Crisis Resources:**
- **National Suicide Prevention Lifeline**: 988 (call or text)
- **Crisis Text Line**: Text HOME to 741741
- **International Association for Suicide Prevention**: https://www.iasp.info/resources/Crisis_Centres/

Please reach out to these resources or a trusted person immediately. Your life matters, and things can get better with proper support. 💜`;

      // Save messages
      if (session) {
        await saveChatMessage(session.id, userId, message, false);
        await saveChatMessage(session.id, userId, crisisResponse, true);
      }

      return res.status(200).json({
        success: true,
        response: crisisResponse,
        crisisDetected: true,
        timestamp: new Date().toISOString()
      });
    }

    // Generate AI response
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        ...conversationHistory,
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.8,
      max_tokens: 500,
      presence_penalty: 0.6,
      frequency_penalty: 0.3
    });

    const aiResponse = completion.choices[0].message.content.trim();

    // Save both messages to database
    if (session) {
      await saveChatMessage(session.id, userId, message, false);
      await saveChatMessage(session.id, userId, aiResponse, true);
    }

    // Return response
    res.status(200).json({
      success: true,
      response: aiResponse,
      crisisDetected: false,
      timestamp: new Date().toISOString(),
      hasPersonalizedContext: userContext.hasReport
    });

  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate chat response'
    });
  }
});

/**
 * Get chat history
 */
app.get('/api/chat/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50 } = req.query;

    const { data: messages, error } = await supabase
      .from('chat_messages')
      .select('*, chat_sessions!inner(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(parseInt(limit));

    if (error) throw error;

    res.status(200).json({
      success: true,
      data: messages || []
    });

  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Delete chat history
 */
app.delete('/api/chat/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Delete all messages for user
    const { error: messagesError } = await supabase
      .from('chat_messages')
      .delete()
      .eq('user_id', userId);

    if (messagesError) throw messagesError;

    // Delete all sessions for user
    const { error: sessionsError } = await supabase
      .from('chat_sessions')
      .delete()
      .eq('user_id', userId);

    if (sessionsError) throw sessionsError;

    res.status(200).json({
      success: true,
      message: 'Chat history deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting chat history:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// 📊 DAILY CHECK-IN API ENDPOINTS
// ============================================

/**
 * Store daily check-in data with comprehensive wellness tracking
 */
app.post('/api/checkin', async (req, res) => {
  try {
    const { 
      userId, 
      mood, 
      energyLevel, 
      sleepQuality, 
      stressLevel,
      physicalActivity,
      socialInteractions,
      emotions,
      dailyGoalsProgress,
      productivityRating,
      weatherImpact,
      gratitude,
      notes,
      challengesFaced,
      winsCelebrated,
      motivationLevel,
      focusLevel,
      overallSatisfaction
    } = req.body;

    // Validation
    if (!userId || !mood || !energyLevel || !sleepQuality || !stressLevel || !physicalActivity || !socialInteractions || !dailyGoalsProgress || !weatherImpact) {
      return res.status(400).json({
        success: false,
        error: 'Required fields: userId, mood, energyLevel, sleepQuality, stressLevel, physicalActivity, socialInteractions, dailyGoalsProgress, weatherImpact'
      });
    }

    console.log(`Saving daily check-in for user ${userId}`);

    // Insert check-in data
    const { data: checkinData, error } = await supabase
      .from('daily_checkins')
      .insert([
        {
          user_id: userId,
          mood,
          energy_level: energyLevel,
          sleep_quality: sleepQuality,
          stress_level: stressLevel,
          physical_activity: physicalActivity,
          social_interactions: socialInteractions,
          emotions: emotions || [],
          daily_goals_progress: dailyGoalsProgress,
          productivity_rating: productivityRating,
          weather_impact: weatherImpact,
          gratitude: gratitude || null,
          notes: notes || null,
          challenges_faced: challengesFaced || null,
          wins_celebrated: winsCelebrated || null,
          motivation_level: motivationLevel,
          focus_level: focusLevel,
          overall_satisfaction: overallSatisfaction,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    // Generate immediate insights based on check-in
    const insights = await generateCheckinInsights(checkinData);

    res.status(200).json({
      success: true,
      message: 'Daily check-in completed successfully',
      data: checkinData,
      insights,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error saving daily check-in:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Get user's check-in history
 */
app.get('/api/checkin/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 30, days = 30 } = req.query;

    const { data: checkins, error } = await supabase
      .from('daily_checkins')
      .select('*')
      .eq('user_id', userId)
      .gte('checkin_date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('checkin_date', { ascending: false })
      .limit(parseInt(limit));

    if (error) throw error;

    res.status(200).json({
      success: true,
      data: checkins || [],
      stats: {
        total_checkins: checkins?.length || 0,
        date_range: {
          from: checkins?.[checkins.length - 1]?.checkin_date,
          to: checkins?.[0]?.checkin_date
        }
      }
    });

  } catch (error) {
    console.error('Error fetching check-in history:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Get AI-powered insights based on check-in patterns
 */
app.get('/api/checkin/insights/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { days = 30 } = req.query;

    console.log(`💡 Generating insights for user ${userId}, last ${days} days`);

    let contextData = null;

    // Try to get check-in context using database function first
    try {
      const { data: dbContextData, error: contextError } = await supabase
        .rpc('get_user_checkin_context', {
          user_uuid: userId,
          days_back: parseInt(days)
        });

      if (contextError) {
        console.warn('⚠️ Database function not available:', contextError.message);
        throw contextError;
      }
      
      contextData = dbContextData;
      console.log('✅ Used database function for context');
    } catch (dbError) {
      console.log('🔄 Falling back to manual context generation...');
      
      // Fallback: manually fetch and structure the data
      const fromDate = new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000);
      const { data: checkins, error: checkinError } = await supabase
        .from('daily_checkins')
        .select('*')
        .eq('user_id', userId)
        .gte('checkin_date', fromDate.toISOString().split('T')[0])
        .order('checkin_date', { ascending: false })
        .limit(30);

      if (checkinError) {
        console.error('❌ Error fetching check-ins:', checkinError);
        throw checkinError;
      }

      console.log(`📈 Found ${checkins?.length || 0} check-ins for analysis`);

      // Manually create context data structure
      contextData = await buildContextDataManually(checkins);
    }

    // Generate AI insights
    const insights = await generateAICheckinInsights(contextData);

    console.log(`✅ Insights generated successfully`);

    res.status(200).json({
      success: true,
      insights,
      context: contextData,
      generated_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('💥 Error generating check-in insights:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: 'Check server logs for more information'
    });
  }
});

// Helper function to build context data manually
async function buildContextDataManually(checkins) {
  if (!checkins || checkins.length === 0) {
    return {
      recent_checkins: [],
      averages: {
        avg_energy: 0,
        avg_sleep: 0,
        avg_stress: 0,
        avg_motivation: 0,
        most_common_mood: 'neutral'
      },
      patterns: {
        total_checkins: 0,
        consistency_rate: 0,
        goal_completion_rate: 0,
        high_energy_days: 0,
        high_stress_days: 0,
        recent_emotions: []
      }
    };
  }

  // Calculate averages
  const avgEnergy = checkins.reduce((sum, c) => sum + (c.energy_level || 0), 0) / checkins.length;
  const avgSleep = checkins.reduce((sum, c) => sum + (c.sleep_quality || 0), 0) / checkins.length;
  const avgStress = checkins.reduce((sum, c) => sum + (c.stress_level || 0), 0) / checkins.length;
  const avgMotivation = checkins.reduce((sum, c) => sum + (c.motivation_level || 0), 0) / checkins.length;

  // Find most common mood
  const moodCounts = {};
  checkins.forEach(c => {
    if (c.mood) {
      moodCounts[c.mood] = (moodCounts[c.mood] || 0) + 1;
    }
  });
  const mostCommonMood = Object.keys(moodCounts).reduce((a, b) => 
    moodCounts[a] > moodCounts[b] ? a : b, 'neutral'
  );

  // Calculate patterns
  const completedGoals = checkins.filter(c => c.daily_goals_progress === 'completed').length;
  const highEnergyDays = checkins.filter(c => (c.energy_level || 0) >= 7).length;
  const highStressDays = checkins.filter(c => (c.stress_level || 0) >= 7).length;

  // Collect recent emotions
  const recentEmotions = new Set();
  checkins.forEach(c => {
    if (c.emotions) {
      try {
        const emotions = Array.isArray(c.emotions) ? c.emotions : JSON.parse(c.emotions || '[]');
        emotions.forEach(emotion => recentEmotions.add(emotion));
      } catch (e) {
        // Ignore parsing errors
      }
    }
  });

  return {
    recent_checkins: checkins.map(c => ({
      date: c.checkin_date,
      mood: c.mood,
      energy: c.energy_level,
      sleep: c.sleep_quality,
      stress: c.stress_level,
      activity: c.physical_activity,
      emotions: c.emotions,
      goals: c.daily_goals_progress,
      notes: c.notes || '',
      gratitude: c.gratitude || ''
    })),
    averages: {
      avg_energy: Math.round(avgEnergy * 10) / 10,
      avg_sleep: Math.round(avgSleep * 10) / 10,
      avg_stress: Math.round(avgStress * 10) / 10,
      avg_motivation: Math.round(avgMotivation * 10) / 10,
      most_common_mood: mostCommonMood
    },
    patterns: {
      total_checkins: checkins.length,
      consistency_rate: Math.round((checkins.length / 30) * 100 * 10) / 10,
      goal_completion_rate: Math.round((completedGoals / checkins.length) * 100 * 10) / 10,
      high_energy_days: highEnergyDays,
      high_stress_days: highStressDays,
      recent_emotions: Array.from(recentEmotions).slice(0, 10)
    }
  };
}

/**
 * Get trend analysis and correlations
 */
app.get('/api/checkin/trends/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { period = 'week' } = req.query; // week, month, quarter

    console.log(`📊 Analyzing trends for user ${userId}, period: ${period}`);

    // Calculate date range based on period
    let daysBack;
    switch (period) {
      case 'week': daysBack = 7; break;
      case 'month': daysBack = 30; break;
      case 'quarter': daysBack = 90; break;
      default: daysBack = 30;
    }

    const fromDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);
    const fromDateStr = fromDate.toISOString().split('T')[0];
    
    console.log(`🗓️ Fetching data from ${fromDateStr} to today`);

    // First, try to get basic check-in data (fallback if analytics view doesn't exist)
    const { data: basicCheckins, error: basicError } = await supabase
      .from('daily_checkins')
      .select('*')
      .eq('user_id', userId)
      .gte('checkin_date', fromDateStr)
      .order('checkin_date', { ascending: true });

    if (basicError) {
      console.error('❌ Error fetching basic check-ins:', basicError);
      throw basicError;
    }

    console.log(`📈 Found ${basicCheckins?.length || 0} check-ins`);

    // Try to get analytics data (enhanced view)
    let analytics = null;
    const { data: analyticsData, error: analyticsError } = await supabase
      .from('checkin_analytics')
      .select('*')
      .eq('user_id', userId)
      .gte('checkin_date', fromDateStr)
      .order('checkin_date', { ascending: true });

    if (analyticsError) {
      console.warn('⚠️ Analytics view not available, using basic data:', analyticsError.message);
      analytics = basicCheckins; // Fallback to basic data
    } else {
      analytics = analyticsData;
    }

    // Calculate streak (with fallback)
    let streakData = 0;
    try {
      const { data: streak, error: streakError } = await supabase
        .rpc('calculate_checkin_streak', { user_uuid: userId });
      
      if (streakError) {
        console.warn('⚠️ Streak function not available:', streakError.message);
        // Calculate streak manually
        streakData = calculateStreakManually(basicCheckins);
      } else {
        streakData = streak || 0;
      }
    } catch (streakErr) {
      console.warn('⚠️ Streak calculation failed:', streakErr.message);
      streakData = calculateStreakManually(basicCheckins);
    }

    console.log(`🔥 Current streak: ${streakData}`);

    // Generate trend analysis
    const trends = analyzeTrends(analytics);
    
    console.log(`✅ Trends analysis complete:`, { 
      dataPoints: analytics?.length, 
      hasValidTrends: trends && trends !== 'insufficient_data' 
    });

    res.status(200).json({
      success: true,
      trends,
      current_streak: streakData,
      period,
      data_points: analytics?.length || 0,
      date_range: {
        from: fromDateStr,
        to: new Date().toISOString().split('T')[0]
      },
      raw_data: analytics // Include for debugging
    });

  } catch (error) {
    console.error('💥 Error analyzing trends:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: 'Check server logs for more information'
    });
  }
});

// Helper function to calculate streak manually
function calculateStreakManually(checkins) {
  if (!checkins || checkins.length === 0) return 0;
  
  let streak = 0;
  const today = new Date();
  let currentDate = new Date(today);
  
  // Check if there's a check-in for today or yesterday (to account for time zones)
  const sortedCheckins = [...checkins].sort((a, b) => new Date(b.checkin_date) - new Date(a.checkin_date));
  
  for (const checkin of sortedCheckins) {
    const checkinDate = new Date(checkin.checkin_date);
    const daysDiff = Math.floor((currentDate - checkinDate) / (1000 * 60 * 60 * 24));
    
    if (daysDiff <= 1) { // Today or yesterday
      streak++;
      currentDate = new Date(checkinDate);
      currentDate.setDate(currentDate.getDate() - 1); // Move to previous day
    } else {
      break;
    }
  }
  
  return streak;
}

/**
 * Get today's check-in status
 */
app.get('/api/checkin/today/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const today = new Date().toISOString().split('T')[0];

    const { data: todayCheckin, error } = await supabase
      .from('daily_checkins')
      .select('*')
      .eq('user_id', userId)
      .eq('checkin_date', today)
      .single();

    res.status(200).json({
      success: true,
      hasCheckedInToday: !error && !!todayCheckin,
      data: todayCheckin || null
    });

  } catch (error) {
    console.error('Error checking today\'s status:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// 🌟 ENHANCED AI PERSONALIZATION FEATURES
// ============================================

// Generate personalized daily affirmation
app.post('/api/affirmation', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    // Get user context
    const context = await getUserContext(userId);
    
    const prompt = `Based on this user's profile:
${context.latestReport ? `Wellbeing Score: ${context.latestReport.report?.overallStatus?.wellbeingScore}/100
Strengths: ${context.latestReport.report?.positiveAspects?.slice(0, 3).join(', ')}
Areas to support: ${context.latestReport.report?.areasOfConcern?.slice(0, 2).map(c => c.area).join(', ')}` : 'No assessment data available'}

Create ONE powerful, personalized affirmation (1-2 sentences) that:
1. Acknowledges their strengths
2. Provides encouragement for growth areas
3. Is uplifting and empowering
4. Feels personal, not generic

Return ONLY the affirmation text, nothing else.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.9,
      max_tokens: 100
    });

    const affirmation = completion.choices[0].message.content.trim();

    res.json({
      success: true,
      affirmation,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating affirmation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate affirmation'
    });
  }
});

// Get personalized wellness insights
app.post('/api/insights', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    const context = await getUserContext(userId);
    
    if (!context.latestReport) {
      return res.json({
        success: true,
        insights: [],
        message: 'Complete your health assessment to get personalized insights!'
      });
    }

    const prompt = `Analyze this user's wellness data and provide 3-4 actionable insights:

Profile:
- Wellbeing Score: ${context.latestReport.report?.overallStatus?.wellbeingScore || 'N/A'}/100
- Recent Journals: ${context.recentJournals.length} entries
- Meditation: ${context.meditationHistory.length} sessions

Provide insights in this JSON format:
{
  "insights": [
    {
      "title": "Brief title",
      "message": "Specific observation and suggestion",
      "type": "strength|improvement|habit",
      "icon": "relevant emoji"
    }
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 400,
      response_format: { type: "json_object" }
    });

    const insights = JSON.parse(completion.choices[0].message.content);

    res.json({
      success: true,
      ...insights
    });
  } catch (error) {
    console.error('Error generating insights:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate insights'
    });
  }
});

// Get mood-based recommendations
app.post('/api/mood-recommendations', async (req, res) => {
  try {
    const { userId, currentMood } = req.body;

    if (!userId || !currentMood) {
      return res.status(400).json({
        success: false,
        error: 'User ID and current mood are required'
      });
    }

    const context = await getUserContext(userId);
    
    const prompt = `User is currently feeling: ${currentMood}

${context.latestReport ? `Their profile:
- Wellbeing Score: ${context.latestReport.report?.overallStatus?.wellbeingScore || 'N/A'}/100` : ''}

Provide 3 specific, actionable activities to help them right now.

Return JSON format:
{
  "recommendations": [
    {
      "activity": "Brief activity name",
      "description": "How to do it",
      "duration": "estimated time",
      "icon": "emoji"
    }
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      max_tokens: 350,
      response_format: { type: "json_object" }
    });

    const recommendations = JSON.parse(completion.choices[0].message.content);

    res.json({
      success: true,
      ...recommendations
    });
  } catch (error) {
    console.error('Error generating mood recommendations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate recommendations'
    });
  }
});

// Get progress tracking summary
app.post('/api/progress-summary', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    const context = await getUserContext(userId);
    
    // Get historical data for trends
    const { data: historicalReports } = await supabase
      .from('health_data')
      .select('report, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    const prompt = `Analyze this user's wellness journey:

Current Status:
- Wellbeing Score: ${context.latestReport?.report?.overallStatus?.wellbeingScore || 'N/A'}/100
- Recent Activity: ${context.recentJournals.length} journals, ${context.meditationHistory.length} meditations
${historicalReports && historicalReports.length > 1 ? `- Historical Progress: ${historicalReports.length} reports over time` : ''}

Create an encouraging progress summary (2-3 sentences) that:
1. Highlights positive trends or consistent efforts
2. Acknowledges their commitment
3. Motivates continued practice

Return JSON:
{
  "summary": "Progress summary text",
  "trend": "improving|stable|needs_attention",
  "encouragement": "One-line motivational message"
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 200,
      response_format: { type: "json_object" }
    });

    const progressData = JSON.parse(completion.choices[0].message.content);

    res.json({
      success: true,
      ...progressData,
      stats: {
        totalJournals: context.recentJournals.length,
        totalMeditations: context.meditationHistory.length,
        streakDays: Math.min(7, context.recentJournals.length + context.meditationHistory.length)
      }
    });
  } catch (error) {
    console.error('Error generating progress summary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate progress summary'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Mental wellbeing API is running' });
});

// Only start server if not running in serverless environment (Vercel)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Mental Wellbeing API running on port ${PORT}`);
  });
}

export default app;

// ============================================
// .env file (create this separately)
// ============================================
/*
OPENAI_API_KEY=your_openai_api_key_here
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_anon_key_here
PORT=3000
*/

// ============================================
// package.json
// ============================================
/*
{
  "name": "mental-wellbeing-api",
  "version": "1.0.0",
  "description": "AI-powered mental health report generation system",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "@supabase/supabase-js": "^2.39.0",
    "openai": "^4.20.1",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
*/

// ============================================
// Supabase Table Schema (Run this SQL in Supabase)
// ============================================
/*
CREATE TABLE health_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  answers JSONB NOT NULL,
  report JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_health_data_user_id ON health_data(user_id);
CREATE INDEX idx_health_data_created_at ON health_data(created_at DESC);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE health_data ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to access their own data
CREATE POLICY "Users can view own health data" ON health_data
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own health data" ON health_data
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);
*/

// ============================================
// Example API Usage
// ============================================
/*

// Example 1: Generate a report
POST http://localhost:3000/api/generate-report
Content-Type: application/json

{
  "userId": "user123",
  "answers": [
    "I feel disappointed but try to learn from it and adjust my approach.",
    "It stings, but I try to see if there's something useful in it.",
    "I pause to figure out why I'm upset and try to calm myself (for example, by taking deep breaths).",
    "I make a plan, take short breaks, and tackle tasks step by step.",
    "I believe that with practice and learning, most people (including me) can develop their abilities a lot.",
    "I'm upset, but I eventually accept it and try to move on.",
    "I feel proud of myself and use it as motivation to keep going."
  ]
}

// Example 2: Get all reports for a user
GET http://localhost:3000/api/reports/user123

// Example 3: Get specific report by ID
GET http://localhost:3000/api/report/550e8400-e29b-41d4-a716-446655440000

*/