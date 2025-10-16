// server.js

import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:8080',
    'http://localhost:8081',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:8081',
    'http://127.0.0.1:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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

    return {
      latestReport: healthReports?.[0] || null,
      recentJournals: journals || [],
      meditationHistory: meditations || [],
      hasReport: !!healthReports?.[0]
    };
  } catch (error) {
    console.error('Error getting user context:', error);
    return {
      latestReport: null,
      recentJournals: [],
      meditationHistory: [],
      hasReport: false
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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Mental Wellbeing API running on port ${PORT}`);
});

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