// Simple test server to verify onboarding API
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

console.log('Starting test server...');
console.log('Environment check:');
console.log('- SUPABASE_URL:', process.env.SUPABASE_URL ? 'Present' : 'Missing');
console.log('- SUPABASE_KEY:', process.env.SUPABASE_KEY ? 'Present' : 'Missing');
console.log('- OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'Present' : 'Missing');

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
  process.env.SUPABASE_KEY,
  {
    auth: { persistSession: false }
  }
);

// Assessment scoring function
function scoreAssessment(answers) {
  const pointsMap = {
    Q1: { A:0, B:2, C:3, D:1 },
    Q2: { A:0, B:2, C:3, D:1 },
    Q3: { A:0, B:1, C:3, D:2 },
    Q4: { A:0, B:2, C:3, D:1 },
    Q5: { A:0, B:2, C:3, D:1 },
    Q6: { A:0, B:2, C:3, D:1 },
    Q7: { A:0, B:2, C:3, D:1 },
    Q8: { A:0, B:2, C:3, D:1 },
    Q9: { A:0, B:2, C:3, D:1 },
    Q10:{ A:0, B:1, C:3, D:2 },
  };
  
  let total = 0;
  for (const a of answers) {
    const m = pointsMap[a.id];
    if (!m || m[a.choice] === undefined) {
      throw new Error(`Bad answer ${a.id}:${a.choice}`);
    }
    total += m[a.choice];
  }
  
  const category = total >= 25 ? "Growth Champion"
                 : total >= 19 ? "Resilient Builder"
                 : total >= 13 ? "Balanced Explorer"
                 : total >= 7  ? "Emerging Mindset"
                 : "Overwhelmed — Needs Support";
                 
  return { 
    score: total, 
    category: category, 
    percent: Math.round((total/30)*100) 
  };
}

// AI insights helper
async function getInsights({ answers, basics, score, category }) {
  try {
    if (process.env.OPENAI_API_KEY) {
      console.log('Generating AI insights...');
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{
          role: "user",
          content: `Given this onboarding result for a wellbeing app, return 4 short insights and 4 short recommendations in JSON format only.
Score: ${score}/30, Category: ${category}
Name: ${basics?.name}
Answers: ${JSON.stringify(answers)}

Respond with JSON: { "insights": ["insight1", "insight2", "insight3", "insight4"], "recommendations": ["rec1", "rec2", "rec3", "rec4"] }`
        }],
        temperature: 0.3,
        max_tokens: 500
      });
      
      const text = completion.choices?.[0]?.message?.content || "{}";
      try { 
        const parsed = JSON.parse(text);
        console.log('AI insights generated successfully');
        return parsed;
      } catch { 
        console.log('AI response parse failed, using fallback');
        return { insights: [], recommendations: [] }; 
      }
    }
    
    console.log('Using fallback insights (no OpenAI key)');
    // Fallback: deterministic suggestions based on score
    return {
      insights: [
        `Your current pattern aligns with ${category}.`,
        score >= 19 ? "You show strong coping behaviors." : "Your routines are inconsistent across stressors.",
        "You benefit from short, actionable prompts.",
        "Positive reinforcement (streaks/badges) will support consistency."
      ],
      recommendations: [
        "2× daily 3-minute breathing sessions.",
        "Evening 1-line journal with gratitude.",
        "Set one tiny goal per day and track a 7-day streak.",
        "Use the Check-In to label feelings before reacting."
      ]
    };
  } catch (error) {
    console.error('AI insights error:', error);
    return { insights: [], recommendations: [] };
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Test server running',
    timestamp: new Date().toISOString()
  });
});

// Test Supabase connection
app.get('/api/test-db', async (req, res) => {
  try {
    const { data, error } = await supabase.from('profiles').select('id').limit(1);
    if (error) throw error;
    res.json({ success: true, message: 'Database connected', count: data.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/onboarding/submit - Main onboarding submission endpoint
app.post("/api/onboarding/submit", async (req, res) => {
  console.log('\n🚀 Onboarding submission received');
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  
  try {
    const { userId, answers, basics, photoUrl } = req.body || {};
    
    if (!userId || !Array.isArray(answers) || answers.length !== 10) {
      console.log('❌ Validation failed:', { userId: !!userId, answersLength: answers?.length });
      return res.status(400).json({ 
        error: "bad_request", 
        message: "userId and 10 answers required" 
      });
    }

    console.log('✅ Validation passed');
    console.log('Processing onboarding for user:', userId);

    // Score the assessment
    const result = scoreAssessment(answers);
    console.log('✅ Assessment scored:', result);
    
    // Get AI insights
    const ai = await getInsights({ answers, basics, score: result.score, category: result.category });
    console.log('✅ AI insights generated:', ai);

    // Check if assessment already exists (prevent duplicates)
    console.log('Checking for existing assessment...');
    const { data: existingAssessment } = await supabase
      .from("assessment_results")
      .select("id")
      .eq("user_id", userId)
      .single();
    
    if (existingAssessment) {
      console.log('⚠️  Assessment already exists, returning 409');
      return res.status(409).json({ 
        alreadyCompleted: true, 
        redirect: "/dashboard",
        message: "Assessment already completed"
      });
    }

    console.log('✅ No existing assessment found');

    // Ensure a profile row exists with safe defaults
    console.log('Upserting profile...');
    const { error: upsertErr } = await supabase
      .from("profiles")
      .upsert({
        id: userId,      // Primary key
        user_id: userId, // Foreign key reference to auth.users
        role: "user",
        display_name: basics?.name ?? null,
        bio: basics?.bio ?? null,
        avatar_url: photoUrl ?? null,
        assessment_completed: true,
        assessment_score: result.score,
        assessment_category: result.category
      }, { onConflict: "id" });
    
    if (upsertErr) {
      console.error('❌ Profile upsert error:', upsertErr);
      return res.status(400).json({ error: upsertErr.message });
    }

    console.log('✅ Profile upserted successfully');

    // Insert assessment results (one-time)
    console.log('Inserting assessment results...');
    const { error: insertErr } = await supabase
      .from("assessment_results")
      .insert({
        user_id: userId,
        answers: answers,
        score: result.score,
        category: result.category,
        ai_insights: {
          insights: ai.insights ?? [],
          recommendations: ai.recommendations ?? []
        }
      });
    
    if (insertErr) {
      console.error('❌ Assessment insert error:', insertErr);
      // If unique constraint violated (already completed), return 409
      if ((insertErr.message || "").toLowerCase().includes("duplicate") ||
          (insertErr.code === "23505")) {
        return res.status(409).json({ 
          alreadyCompleted: true, 
          redirect: "/dashboard",
          message: "Assessment already completed"
        });
      }
      return res.status(400).json({ error: insertErr.message });
    }

    console.log('✅ Assessment results inserted successfully');
    console.log('🎉 Onboarding completed successfully for user:', userId);

    const response = {
      ok: true,
      score: result.score,
      category: result.category,
      insights: ai.insights ?? [],
      recommendations: ai.recommendations ?? [],
      redirect: "/dashboard"
    };

    console.log('Sending response:', JSON.stringify(response, null, 2));
    return res.json(response);
    
  } catch (error) {
    console.error('💥 Onboarding submission error:', error);
    return res.status(500).json({ 
      error: "server_error", 
      detail: String(error?.message || error) 
    });
  }
});

// ============================================
// SAGE CHATBOT FUNCTIONALITY
// ============================================

// Function to get user's health assessment data
async function getUserHealthData(userId) {
  try {
    // Get user's profile information
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name, assessment_completed, assessment_score, assessment_category')
      .eq('id', userId)
      .single();

    // Get user's detailed assessment results
    const { data: assessment } = await supabase
      .from('assessment_results')
      .select('answers, score, category, ai_insights, completed_at')
      .eq('user_id', userId)
      .single();

    return {
      profile: profile || {},
      assessment: assessment || {},
      hasAssessment: !!assessment
    };
  } catch (error) {
    console.error('Error fetching user health data:', error);
    return { profile: {}, assessment: {}, hasAssessment: false };
  }
}

// Function to create personalized system prompt based on user data
function createPersonalizedPrompt(userData, userMessage) {
  const { profile, assessment, hasAssessment } = userData;
  
  let systemPrompt = `You are Sage, a wise and empathetic AI wellness companion. You provide personalized mental health and wellness guidance.

**Your Personality:**
- Warm, understanding, and supportive
- Use gentle, encouraging language
- Provide practical, actionable advice
- Be concise but meaningful (2-3 sentences max per response)
- Use emojis sparingly and appropriately

**User Information:**`;

  if (profile.display_name) {
    systemPrompt += `\n- Name: ${profile.display_name}`;
  }

  if (hasAssessment) {
    systemPrompt += `\n- Wellness Category: ${assessment.category}
- Wellness Score: ${assessment.score}/30
- Assessment Date: ${new Date(assessment.completed_at).toLocaleDateString()}`;
    
    if (assessment.ai_insights?.insights) {
      systemPrompt += `\n- Key Insights: ${assessment.ai_insights.insights.join(', ')}`;
    }
    
    if (assessment.ai_insights?.recommendations) {
      systemPrompt += `\n- Recommended Actions: ${assessment.ai_insights.recommendations.join(', ')}`;
    }

    // Add specific guidance based on category
    if (assessment.category === 'Growth Champion') {
      systemPrompt += `\n\n**Guidance Focus:** Maintain momentum, explore advanced wellness practices, and consider helping others.`;
    } else if (assessment.category === 'Resilient Builder') {
      systemPrompt += `\n\n**Guidance Focus:** Build on existing strengths, develop consistency, and explore new growth areas.`;
    } else if (assessment.category === 'Balanced Explorer') {
      systemPrompt += `\n\n**Guidance Focus:** Support exploration of wellness practices, encourage small consistent steps.`;
    } else if (assessment.category === 'Emerging Mindset') {
      systemPromet += `\n\n**Guidance Focus:** Provide gentle encouragement, focus on building basic wellness habits.`;
    } else if (assessment.category === 'Overwhelmed — Needs Support') {
      systemPrompt += `\n\n**Guidance Focus:** Offer immediate support, suggest simple coping strategies, encourage professional help if needed.`;
    }
  } else {
    systemPrompt += `\n- Assessment Status: Not completed yet
- Encourage them to complete their wellness assessment for personalized guidance`;
  }

  systemPrompt += `\n\n**Current User Message:** "${userMessage}"

**Instructions:** Respond as Sage, keeping the user's wellness category and insights in mind. Provide relevant, personalized guidance.`;

  return systemPrompt;
}

// POST /api/chat - Sage chatbot endpoint
app.post('/api/chat', async (req, res) => {
  console.log('\n🤖 Sage chat request received');
  
  try {
    const { message, userId, currentMood } = req.body || {};
    
    if (!message || !userId) {
      return res.status(400).json({ 
        error: 'Message and userId are required',
        response: "I need a message and user ID to help you properly."
      });
    }

    console.log(`Chat request from user ${userId}: "${message}"`);

    // Get user's health assessment data
    const userData = await getUserHealthData(userId);
    console.log('User data loaded:', { 
      hasAssessment: userData.hasAssessment, 
      category: userData.assessment.category 
    });

    // Create personalized system prompt
    const systemPrompt = createPersonalizedPrompt(userData, message);

    // Generate AI response using OpenAI
    if (process.env.OPENAI_API_KEY) {
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user", 
              content: message
            }
          ],
          temperature: 0.7,
          max_tokens: 150
        });

        const aiResponse = completion.choices?.[0]?.message?.content || 
          "I'm having trouble processing that right now. Could you try rephrasing your question?";

        console.log('✅ AI response generated successfully');
        
        return res.json({
          response: aiResponse,
          pointsAwarded: 0 // Could implement points system later
        });
        
      } catch (aiError) {
        console.error('OpenAI API error:', aiError);
        // Fall through to fallback response
      }
    }

    // Fallback responses based on user data and keywords
    let fallbackResponse = generateFallbackResponse(message, userData);
    
    console.log('Using fallback response');
    return res.json({
      response: fallbackResponse,
      pointsAwarded: 0
    });

  } catch (error) {
    console.error('💥 Chat endpoint error:', error);
    return res.status(500).json({
      error: 'Server error',
      response: "I'm experiencing some technical difficulties. Please try again in a moment."
    });
  }
});

// Function to generate fallback responses when AI is not available
function generateFallbackResponse(message, userData) {
  const lowerMessage = message.toLowerCase();
  const { assessment, hasAssessment, profile } = userData;
  
  const name = profile.display_name || 'there';
  
  // Greeting responses
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    if (hasAssessment) {
      return `Hello ${name}! 🌟 As a ${assessment.category}, I'm here to support your wellness journey. How are you feeling today?`;
    } else {
      return `Hello ${name}! I'm Sage, your wellness companion. I'd love to get to know you better - have you completed your wellness assessment yet?`;
    }
  }
  
  // Feeling/mood responses
  if (lowerMessage.includes('feel') || lowerMessage.includes('mood') || lowerMessage.includes('emotion')) {
    if (hasAssessment && assessment.category) {
      if (assessment.category.includes('Growth Champion')) {
        return `It's great to check in with your feelings! As someone with strong wellness habits, remember that even champions have challenging days. What specific emotion are you experiencing?`;
      } else if (assessment.category.includes('Overwhelmed')) {
        return `Thank you for sharing how you're feeling. Take a deep breath with me. Remember, it's okay to not be okay. What's one small thing that might help you feel a bit better right now?`;
      }
    }
    return `Your feelings are completely valid. Sometimes naming our emotions is the first step to understanding them. Would you like to share what's on your mind?`;
  }
  
  // Meditation/mindfulness responses
  if (lowerMessage.includes('meditat') || lowerMessage.includes('mindful') || lowerMessage.includes('breathing')) {
    return `Mindfulness is a wonderful practice! Try this: Take 3 deep breaths, focusing only on the sensation of air entering and leaving your body. Even 2 minutes can make a difference. 🧘‍♀️`;
  }
  
  // Goal-related responses
  if (lowerMessage.includes('goal') || lowerMessage.includes('achieve') || lowerMessage.includes('progress')) {
    if (hasAssessment) {
      return `Based on your wellness profile as a ${assessment.category}, I recommend setting small, achievable daily goals. What's one wellness goal you'd like to work on?`;
    }
    return `Setting wellness goals is powerful! Start with something small you can do consistently. What area of wellness interests you most?`;
  }
  
  // Stress/anxiety responses
  if (lowerMessage.includes('stress') || lowerMessage.includes('anxiety') || lowerMessage.includes('worried')) {
    return `Stress is a normal part of life, but you don't have to face it alone. Try the 5-4-3-2-1 grounding technique: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste. 🌿`;
  }
  
  // Sleep responses
  if (lowerMessage.includes('sleep') || lowerMessage.includes('tired') || lowerMessage.includes('rest')) {
    return `Quality sleep is fundamental to wellness. Try creating a calming bedtime routine: dim lights, put away devices, and maybe try some gentle stretching. Your body and mind will thank you. 😴`;
  }
  
  // Default personalized response
  if (hasAssessment) {
    return `As a ${assessment.category}, you have unique strengths in your wellness journey. I'm here to support you however I can. Could you tell me more about what's on your mind?`;
  } else {
    return `I'm here to support your wellness journey in whatever way I can. To give you the most helpful guidance, I'd recommend completing your wellness assessment first. What would you like to explore today?`;
  }
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n🚀 Test server running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`🗄️  Database test: http://localhost:${PORT}/api/test-db`);
  console.log(`📝 Onboarding API: http://localhost:${PORT}/api/onboarding/submit`);
  console.log(`🤖 Sage Chat API: http://localhost:${PORT}/api/chat`);
});

export default app;