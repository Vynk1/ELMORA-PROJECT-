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