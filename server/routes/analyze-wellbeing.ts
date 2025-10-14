import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Answer {
  id: string;
  choice: string;
  points?: number;
}

interface AnalyzeRequest {
  answers: Answer[];
  basics: {
    name: string;
    bio: string;
  };
}

interface AnalyzeResponse {
  score: number;
  category: string;
  insights: string[];
  recommendations: string[];
}

// Categories based on score ranges
const getCategory = (score: number): string => {
  if (score >= 25) return "Growth Champion";
  if (score >= 19) return "Resilient Builder";
  if (score >= 13) return "Balanced Explorer";
  if (score >= 7) return "Emerging Mindset";
  return "Overwhelmed — Needs Support";
};

// Calculate score from answers
const calculateScore = (answers: Answer[]): number => {
  return answers.reduce((total, answer) => {
    // If points not provided, we can calculate based on choice patterns
    if (typeof answer.points === 'number') {
      return total + answer.points;
    }
    // Fallback scoring based on choice patterns (A=0, B=1, C=2, D=3 generally)
    const choiceValues: { [key: string]: number } = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
    return total + (choiceValues[answer.choice] || 0);
  }, 0);
};

// Generate AI insights using Google Gemini
const generateAIInsights = async (score: number, category: string, name: string, bio: string): Promise<{ insights: string[], recommendations: string[] }> => {
  try {
    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('No Google API key found, using fallback insights');
      return getFallbackInsights(score, category);
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
You are a wellness coach analyzing someone's well-being assessment results. 

User Profile:
- Name: ${name}
- Bio: ${bio || 'No bio provided'}
- Assessment Score: ${score}/30
- Category: ${category}

Based on this ${category} score of ${score}/30, provide:

1. 3-5 personalized insights about their well-being mindset (each 1-2 sentences)
2. 3-5 specific, actionable recommendations for improvement (each 1-2 sentences)

Keep insights positive but realistic. Focus on growth potential. Use their name when appropriate.
Format as JSON with "insights" and "recommendations" arrays.

Example format:
{
  "insights": [
    "insight 1 text",
    "insight 2 text"
  ],
  "recommendations": [
    "recommendation 1 text", 
    "recommendation 2 text"
  ]
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse JSON response
    const parsed = JSON.parse(text);
    
    return {
      insights: parsed.insights || [],
      recommendations: parsed.recommendations || []
    };

  } catch (error) {
    console.error('AI generation error:', error);
    return getFallbackInsights(score, category);
  }
};

// Fallback insights when AI is not available
const getFallbackInsights = (score: number, category: string): { insights: string[], recommendations: string[] } => {
  const insights = [];
  const recommendations = [];

  if (score >= 25) {
    insights.push(
      "You demonstrate exceptional emotional intelligence and growth mindset.",
      "Your resilience skills are well-developed and serve you in challenges.",
      "You have strong self-awareness and regulation capabilities.",
      "You consistently view setbacks as learning opportunities."
    );
    recommendations.push(
      "Continue your excellent practices and consider mentoring others.",
      "Explore advanced mindfulness or leadership development opportunities.",
      "Challenge yourself with new growth-oriented goals."
    );
  } else if (score >= 19) {
    insights.push(
      "You show good emotional regulation and learning orientation.",
      "Your resilience is developing well with room for growth.",
      "You're building strong foundations for personal development.",
      "You generally handle feedback and challenges constructively."
    );
    recommendations.push(
      "Practice daily reflection to strengthen self-awareness.",
      "Set challenging but achievable goals to build confidence.",
      "Consider journaling to track your growth journey."
    );
  } else if (score >= 13) {
    insights.push(
      "You're developing important emotional intelligence skills.",
      "Your growth mindset is emerging and can be strengthened.",
      "You show potential for significant improvement with practice.",
      "You're beginning to see challenges as opportunities."
    );
    recommendations.push(
      "Develop a consistent daily mindfulness or meditation practice.",
      "Focus on reframing challenges as learning opportunities.",
      "Build a support network of growth-minded individuals."
    );
  } else if (score >= 7) {
    insights.push(
      "You're at the beginning of your emotional growth journey.",
      "Building basic resilience skills will be valuable for you.",
      "Small, consistent steps can lead to meaningful progress.",
      "You have potential that can be unlocked with the right approach."
    );
    recommendations.push(
      "Start with basic stress management techniques like deep breathing.",
      "Practice positive self-talk and challenge negative thoughts.",
      "Set small, achievable daily goals to build momentum."
    );
  } else {
    insights.push(
      "You may be feeling overwhelmed and could benefit from support.",
      "Remember that growth is a journey, and every step matters.",
      "Your current challenges don't define your potential.",
      "With the right support, significant improvement is possible."
    );
    recommendations.push(
      "Consider working with a counselor or coach for personalized support.",
      "Focus on basic self-care: sleep, nutrition, and gentle movement.",
      "Start with one small positive change each week."
    );
  }

  return { insights, recommendations };
};

export const handleAnalyzeWellbeing = async (req: Request, res: Response) => {
  try {
    const { answers, basics }: AnalyzeRequest = req.body;

    // Validate request
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ error: 'Answers array is required' });
    }

    if (!basics || !basics.name) {
      return res.status(400).json({ error: 'User name is required' });
    }

    // Calculate score
    const score = calculateScore(answers);
    const category = getCategory(score);

    // Generate AI insights
    const { insights, recommendations } = await generateAIInsights(
      score, 
      category, 
      basics.name, 
      basics.bio
    );

    const response: AnalyzeResponse = {
      score,
      category,
      insights,
      recommendations
    };

    res.json(response);

  } catch (error) {
    console.error('Wellbeing analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze wellbeing data',
      message: 'Please try again later'
    });
  }
};