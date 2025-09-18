import express from 'express';
import multer from 'multer';

const router = express.Router();

// Configure multer for audio file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept audio files
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'));
    }
  },
});

// Fallback transcription for development/testing without Google Cloud
const generateMockTranscription = (audioBuffer: Buffer): string => {
  const sampleTexts = [
    "Today I'm feeling really grateful for all the progress I've made in my wellness journey.",
    "I had an interesting conversation with a friend today that really made me think about my goals.",
    "The meditation session this morning was particularly peaceful and helped center my thoughts.",
    "I'm excited about the new project I'm starting and feel motivated to give it my best effort.",
    "Sometimes it's the small moments that bring the most joy, like watching the sunrise.",
    "I've been reflecting on how much I've grown as a person over the past few months.",
    "Today was challenging, but I managed to stay positive and find silver linings."
  ];
  
  // Return a random sample text for demonstration
  return sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
};

// Real Google Speech-to-Text function
const transcribeWithGoogle = async (audioBuffer: Buffer): Promise<string> => {
  try {
    // Dynamic import to handle cases where Google Cloud isn't available
    const speech = await import('@google-cloud/speech');
    const client = new speech.SpeechClient();

    const audio = {
      content: audioBuffer.toString('base64'),
    };

    const config = {
      encoding: 'WEBM_OPUS' as const,
      sampleRateHertz: 48000,
      languageCode: 'en-US',
      enableAutomaticPunctuation: true,
      enableWordConfidence: true,
      model: 'latest_long',
    };

    const request = {
      audio: audio,
      config: config,
    };

    const [response] = await client.recognize(request);
    
    if (response.results && response.results.length > 0) {
      const transcription = response.results
        .map(result => result.alternatives?.[0]?.transcript || '')
        .join(' ')
        .trim();
      
      return transcription || '';
    }

    return '';
  } catch (error) {
    console.error('Google Speech-to-Text error:', error);
    throw error;
  }
};

// Speech-to-text endpoint
router.post('/speech-to-text', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    const audioBuffer = req.file.buffer;
    console.log(`Processing audio file: ${req.file.originalname}, size: ${audioBuffer.length} bytes`);

    let transcript = '';

    try {
      // Try Google Speech-to-Text first
      transcript = await transcribeWithGoogle(audioBuffer);
    } catch (googleError) {
      console.warn('Google Speech-to-Text failed, using fallback:', googleError);
      
      // Fallback to mock transcription for development
      if (process.env.NODE_ENV === 'development') {
        transcript = generateMockTranscription(audioBuffer);
      } else {
        throw googleError;
      }
    }

    if (!transcript) {
      return res.status(422).json({ 
        error: 'No speech detected in audio',
        transcript: '' 
      });
    }

    console.log('Transcription successful:', transcript.substring(0, 50) + '...');

    res.json({
      transcript,
      confidence: 0.95, // Mock confidence for fallback
      language: 'en-US',
      duration: audioBuffer.length / 16000, // Rough estimate
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Speech-to-text error:', error);
    
    let errorMessage = 'Failed to transcribe audio';
    let statusCode = 500;

    if (error.message?.includes('quota')) {
      errorMessage = 'Speech-to-text quota exceeded. Please try again later.';
      statusCode = 429;
    } else if (error.message?.includes('authentication')) {
      errorMessage = 'Speech-to-text service authentication failed.';
      statusCode = 503;
    } else if (error.message?.includes('network')) {
      errorMessage = 'Network error while processing audio. Please check your connection.';
      statusCode = 503;
    }

    res.status(statusCode).json({
      error: errorMessage,
      transcript: '',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Health check for speech-to-text service
router.get('/speech-to-text/health', async (req, res) => {
  try {
    let googleAvailable = false;
    
    try {
      const speech = await import('@google-cloud/speech');
      const client = new speech.SpeechClient();
      googleAvailable = true;
    } catch (error) {
      console.log('Google Speech-to-Text not available:', error);
    }

    res.json({
      status: 'healthy',
      services: {
        googleSpeechToText: googleAvailable,
        fallbackTranscription: true
      },
      supportedFormats: ['audio/webm', 'audio/mp4', 'audio/wav', 'audio/ogg'],
      maxFileSize: '10MB',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: 'Health check failed'
    });
  }
});

export default router;