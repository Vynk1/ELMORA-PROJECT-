// Simple chat handler that integrates with the existing server structure
import express from 'express';

const router = express.Router();

// Fallback responses when Google services are unavailable
const fallbackResponses = {
  mood: [
    "I understand how you're feeling. Remember that all emotions are valid and temporary. What would help you feel a bit better right now?",
    "Thank you for sharing how you feel with me. Your emotional awareness is a sign of strength. How can I support you today?",
    "I hear you. It's important to acknowledge our feelings. What's one small thing that might bring you comfort today?"
  ],
  journal: [
    "Journaling is a wonderful way to process thoughts and emotions. What's been on your mind lately that you'd like to explore?",
    "Let's start with a simple prompt: What are three things you're grateful for today, no matter how small?",
    "Writing can be very therapeutic. Would you like to reflect on something specific, or shall I give you a gentle prompt to begin?"
  ],
  meditation: [
    "Let's take a moment to center ourselves. Find a comfortable position and take three deep breaths with me. Breathe in... and out...",
    "Meditation can bring such peace. Would you like to try a brief mindfulness exercise, or would you prefer a guided relaxation?",
    "Let's practice some mindfulness together. Close your eyes if you feel comfortable, and focus on your breath for a moment."
  ],
  goals: [
    "Goals give us direction and purpose. What's something you've been wanting to work towards?",
    "I'm here to help you with your goals. What would you like to focus on - setting new goals or checking progress on existing ones?",
    "Every step towards your goals matters, no matter how small. What's one goal that's important to you right now?"
  ],
  rewards: [
    "You've been doing great work on your wellness journey! What accomplishment would you like to celebrate today?",
    "Recognizing your progress is so important. What positive changes have you noticed in yourself lately?",
    "You deserve acknowledgment for the effort you're putting in. What reward would feel meaningful to you right now?"
  ],
  general: [
    "I'm here to support your wellness journey. Whether it's checking in on your mood, journaling, meditation, goals, or celebrating your progress - what would be most helpful right now?",
    "As your wellness companion, I'm here to listen and support you. What's on your heart today?",
    "Every moment you spend focusing on your well-being is valuable. How can I best support you in this moment?"
  ]
};

function getRandomResponse(category) {
  const responses = fallbackResponses[category] || fallbackResponses.general;
  return responses[Math.floor(Math.random() * responses.length)];
}

function detectIntent(message) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('feel') || lowerMessage.includes('mood') || lowerMessage.includes('emotion')) {
    return 'mood';
  } else if (lowerMessage.includes('journal') || lowerMessage.includes('write') || lowerMessage.includes('thoughts')) {
    return 'journal';
  } else if (lowerMessage.includes('meditat') || lowerMessage.includes('relax') || lowerMessage.includes('breathe') || lowerMessage.includes('mindful')) {
    return 'meditation';
  } else if (lowerMessage.includes('goal') || lowerMessage.includes('objective') || lowerMessage.includes('target') || lowerMessage.includes('achieve')) {
    return 'goals';
  } else if (lowerMessage.includes('reward') || lowerMessage.includes('celebrate') || lowerMessage.includes('accomplish') || lowerMessage.includes('progress')) {
    return 'rewards';
  }
  
  return 'general';
}

// Chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message, currentMood, userPoints, userId } = req.body;
    
    // Input validation
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (message.length > 1000) {
      return res.status(400).json({ error: 'Message too long' });
    }

    // Detect intent and get response
    const detectedIntent = detectIntent(message);
    const responseText = getRandomResponse(detectedIntent);
    
    // Award points for engagement
    let pointsAwarded = 1;
    switch (detectedIntent) {
      case 'mood':
        pointsAwarded = 2;
        break;
      case 'journal':
      case 'meditation':
        pointsAwarded = 3;
        break;
      case 'goals':
        pointsAwarded = 2;
        break;
      default:
        pointsAwarded = 1;
    }

    console.log(`Chat: User "${userId || 'anonymous'}" - Intent: ${detectedIntent} - Points: ${pointsAwarded}`);

    res.json({
      response: responseText,
      pointsAwarded: pointsAwarded,
      intent: detectedIntent,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      response: 'I apologize, but I\'m experiencing technical difficulties. Please try again in a moment.'
    });
  }
});

// Health check endpoint
router.get('/chat/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    service: 'elmora-chat',
    timestamp: new Date().toISOString()
  });
});

export default router;