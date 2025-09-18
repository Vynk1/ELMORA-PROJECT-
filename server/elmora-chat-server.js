import express from 'express';
import cors from 'cors';
import { SessionsClient } from '@google-cloud/dialogflow';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import crypto from 'crypto';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:8081',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/chat', limiter);

app.use(express.json({ limit: '10mb' }));

// Environment variables validation
const requiredEnvVars = ['GOOGLE_PROJECT_ID', 'GOOGLE_APPLICATION_CREDENTIALS'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.warn(`Warning: Missing environment variables: ${missingVars.join(', ')}`);
  console.warn('Chatbot will use fallback responses instead of Google services.');
}

// Google Cloud clients
let dialogflowClient = null;
let ttsClient = null;

try {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS && process.env.GOOGLE_PROJECT_ID) {
    dialogflowClient = new SessionsClient();
    ttsClient = new TextToSpeechClient();
    console.log('Google Cloud services initialized successfully');
  }
} catch (error) {
  console.warn('Failed to initialize Google Cloud services:', error.message);
}

// Session configuration
const projectId = process.env.GOOGLE_PROJECT_ID;
const languageCode = 'en-US';

// Secure session storage (in production, use Redis or database)
const sessions = new Map();
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

// Encryption for sensitive data
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32);
const ALGORITHM = 'aes-256-gcm';

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipher(ALGORITHM, ENCRYPTION_KEY);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(text) {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = textParts.join(':');
  const decipher = crypto.createDecipher(ALGORITHM, ENCRYPTION_KEY);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Clean up expired sessions
setInterval(() => {
  const now = Date.now();
  for (const [sessionId, sessionData] of sessions.entries()) {
    if (now - sessionData.lastActivity > SESSION_TIMEOUT) {
      sessions.delete(sessionId);
    }
  }
}, 5 * 60 * 1000); // Clean up every 5 minutes

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

async function generateTTSAudio(text) {
  if (!ttsClient) {
    return null;
  }

  try {
    const request = {
      input: { text: text },
      voice: {
        languageCode: 'en-US',
        name: 'en-US-Standard-F', // Female voice
        ssmlGender: 'FEMALE',
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 0.9,
        pitch: 0.0,
      },
    };

    const [response] = await ttsClient.synthesizeSpeech(request);
    
    // Save audio file temporarily
    const audioFileName = `audio_${Date.now()}_${crypto.randomBytes(8).toString('hex')}.mp3`;
    const audioPath = path.join(__dirname, 'temp', audioFileName);
    
    // Ensure temp directory exists
    await fs.mkdir(path.join(__dirname, 'temp'), { recursive: true });
    
    await fs.writeFile(audioPath, response.audioContent, 'binary');
    
    // Return URL path
    return `/api/audio/${audioFileName}`;
  } catch (error) {
    console.error('TTS Error:', error);
    return null;
  }
}

// Serve audio files
app.use('/api/audio', express.static(path.join(__dirname, 'temp')));

// Clean up old audio files
setInterval(async () => {
  try {
    const tempDir = path.join(__dirname, 'temp');
    const files = await fs.readdir(tempDir);
    const now = Date.now();
    
    for (const file of files) {
      if (file.startsWith('audio_')) {
        const filePath = path.join(tempDir, file);
        const stats = await fs.stat(filePath);
        
        // Delete files older than 1 hour
        if (now - stats.mtime.getTime() > 60 * 60 * 1000) {
          await fs.unlink(filePath);
        }
      }
    }
  } catch (error) {
    console.error('Error cleaning up audio files:', error);
  }
}, 15 * 60 * 1000); // Clean up every 15 minutes

// Main chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, currentMood, userPoints, userId } = req.body;
    
    // Input validation
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (message.length > 1000) {
      return res.status(400).json({ error: 'Message too long' });
    }

    // Sanitize and validate userId
    const sanitizedUserId = userId ? userId.replace(/[^a-zA-Z0-9-_]/g, '') : 'anonymous';
    
    // Session management
    const sessionId = `${sanitizedUserId}_${Math.floor(Date.now() / 1000)}`;
    let sessionData = sessions.get(sanitizedUserId) || {
      context: {},
      lastActivity: Date.now(),
      messageCount: 0
    };
    
    sessionData.lastActivity = Date.now();
    sessionData.messageCount += 1;
    sessions.set(sanitizedUserId, sessionData);

    let responseText = '';
    let pointsAwarded = 0;

    try {
      if (dialogflowClient && projectId) {
        // Use Dialogflow
        const sessionPath = dialogflowClient.projectAgentSessionPath(projectId, sessionId);
        
        const request = {
          session: sessionPath,
          queryInput: {
            text: {
              text: message,
              languageCode: languageCode,
            },
          },
          queryParams: {
            contexts: [
              {
                name: `${sessionPath}/contexts/user-mood`,
                parameters: {
                  currentMood: currentMood,
                  userPoints: userPoints,
                }
              }
            ]
          }
        };

        const [response] = await dialogflowClient.detectIntent(request);
        responseText = response.queryResult.fulfillmentText || getRandomResponse('general');
        
        // Award points based on intent
        const intent = response.queryResult.intent?.displayName;
        if (intent && intent.includes('mood')) pointsAwarded = 2;
        else if (intent && intent.includes('journal')) pointsAwarded = 3;
        else if (intent && intent.includes('meditation')) pointsAwarded = 3;
        else if (intent && intent.includes('goals')) pointsAwarded = 2;
        else pointsAwarded = 1;
        
      } else {
        // Use fallback system
        const detectedIntent = detectIntent(message);
        responseText = getRandomResponse(detectedIntent);
        
        // Award points for engagement
        pointsAwarded = detectedIntent === 'general' ? 1 : 2;
      }
      
    } catch (dialogflowError) {
      console.error('Dialogflow error:', dialogflowError);
      responseText = getRandomResponse('general');
      pointsAwarded = 1;
    }

    // Generate TTS audio
    let audioUrl = null;
    try {
      audioUrl = await generateTTSAudio(responseText);
    } catch (ttsError) {
      console.error('TTS error:', ttsError);
    }

    // Store conversation for privacy (encrypted)
    sessionData.context.lastMessage = encrypt(message);
    sessionData.context.lastResponse = encrypt(responseText);

    res.json({
      response: responseText,
      audioUrl: audioUrl,
      pointsAwarded: pointsAwarded,
      sessionId: sessionId
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
app.get('/api/chat/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    services: {
      dialogflow: !!dialogflowClient,
      textToSpeech: !!ttsClient
    },
    timestamp: new Date().toISOString()
  });
});

// Privacy endpoint - delete user data
app.delete('/api/chat/user/:userId', (req, res) => {
  const { userId } = req.params;
  const sanitizedUserId = userId.replace(/[^a-zA-Z0-9-_]/g, '');
  
  sessions.delete(sanitizedUserId);
  
  res.json({ message: 'User data deleted successfully' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    response: 'I apologize, but something went wrong. Please try again later.'
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  // Clean up resources here
  sessions.clear();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully...');
  // Clean up resources here
  sessions.clear();
  process.exit(0);
});

// Only start server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}` || import.meta.url.includes(process.argv[1])) {
  app.listen(port, () => {
    console.log(`Elmora chat server running on port ${port}`);
    console.log(`Services available: Dialogflow=${!!dialogflowClient}, TTS=${!!ttsClient}`);
  });
}

export default app;
