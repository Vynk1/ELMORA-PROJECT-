# 🌿 Elmora Chatbot - AI Wellness Companion

The Elmora Chatbot is an intelligent wellness companion that provides personalized support for mood check-ins, journaling, meditation guidance, goal tracking, and celebrating achievements. It integrates with Google Dialogflow for natural language processing and Google Text-to-Speech for audio responses.

## 🚀 Features

### Core Functionality
- **Mood Check-ins**: Help users track and process their emotions
- **Journaling Support**: Provide prompts and guidance for reflective writing
- **Guided Meditation**: Lead users through breathing exercises and mindfulness practices
- **Goal Tracking**: Assist with setting, monitoring, and achieving personal goals
- **Rewards System**: Celebrate achievements and progress milestones

### Technical Features
- **AI-Powered Responses**: Google Dialogflow integration for intelligent conversations
- **Text-to-Speech**: Audio playback of chatbot responses using Google TTS
- **Voice Input**: Speech recognition for hands-free interaction
- **Real-time Chat**: WebSocket-like experience with React state management
- **Privacy & Security**: Encrypted conversations, rate limiting, and secure data handling
- **Responsive Design**: Mobile-friendly floating chat interface

## 📁 File Structure

```
client/
├── components/
│   └── ElmoraChat.tsx          # Main React chatbot component
server/
├── elmora-chat-server.js       # Express server with Google Cloud integration
├── dialogflow-setup.json      # Dialogflow intents and entities configuration
└── setup-google-services.js   # Setup script for Google Cloud services
```

## 🛠️ Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

The following packages will be installed for the chatbot:
- `@google-cloud/dialogflow` - Dialogflow API client
- `@google-cloud/text-to-speech` - Text-to-Speech API client
- `express-rate-limit` - Rate limiting middleware
- `helmet` - Security middleware

### 2. Google Cloud Setup

#### Prerequisites
- Google Cloud account with billing enabled
- A Google Cloud project

#### Steps:
1. **Create/Select Project**: Go to [Google Cloud Console](https://console.cloud.google.com/)
2. **Enable APIs**:
   - [Dialogflow API](https://console.cloud.google.com/apis/api/dialogflow.googleapis.com)
   - [Text-to-Speech API](https://console.cloud.google.com/apis/api/texttospeech.googleapis.com)
3. **Service Account**: Create a service account and download the JSON key file
4. **Dialogflow Agent**: Create a new agent at [Dialogflow Console](https://dialogflow.cloud.google.com/)

### 3. Environment Configuration

Run the setup script to create your `.env` file:

```bash
node server/setup-google-services.js
```

Update the generated `.env` file:

```env
# Google Cloud Services
GOOGLE_PROJECT_ID=your-project-id-here
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/service-account-key.json

# Server Configuration  
PORT=3001
CLIENT_URL=http://localhost:8081
NODE_ENV=development

# Security
ENCRYPTION_KEY=your-32-character-secure-key-here

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Session Management
SESSION_TIMEOUT_MS=1800000

# Audio Settings
TTS_VOICE_NAME=en-US-Standard-F
TTS_SPEAKING_RATE=0.9
TTS_PITCH=0.0
```

### 4. Dialogflow Configuration

Import the predefined intents and entities:

1. Go to your Dialogflow console
2. Navigate to Intents section
3. Import the configuration from `server/dialogflow-setup.json`

Or create intents manually:
- Default Welcome Intent
- Mood Check-in Intent  
- Journaling Intent
- Meditation Intent
- Goals Intent
- Rewards Intent
- Help Intent
- Goodbye Intent

## 🎯 Usage

### Frontend Integration

The chatbot is automatically integrated into the main app after mood selection. It appears as a floating green chat bubble (🌿) in the bottom-right corner.

**Component Props:**
```typescript
interface ElmoraChatProps {
  currentMood?: MoodType;     // Current user mood
  userPoints?: number;        // User's current points
  onPointsUpdate?: (points: number) => void; // Points update callback
}
```

### Backend API

The chat server runs on port 3001 and provides these endpoints:

- `POST /api/chat` - Main chat endpoint
- `GET /api/chat/health` - Health check
- `DELETE /api/chat/user/:userId` - Delete user data (privacy)
- `GET /api/audio/:filename` - Serve TTS audio files

### Starting the Services

1. **Development Mode** (with frontend):
   ```bash
   npm run dev
   ```

2. **Chat Server Only**:
   ```bash
   node server/elmora-chat-server.js
   ```

3. **With Google Services** (requires proper .env setup):
   ```bash
   GOOGLE_APPLICATION_CREDENTIALS=path/to/key.json node server/elmora-chat-server.js
   ```

## 🧪 Testing

### Testing Without Google Services

The chatbot includes intelligent fallback responses that work without Google Cloud services. This allows for testing and development without API costs.

```bash
# Test with fallback responses
node server/elmora-chat-server.js
```

### Testing With Google Services

1. Set up your `.env` file with valid Google Cloud credentials
2. Start the server
3. Test these conversation flows:

#### Mood Check-in
- "How are you feeling?"
- "I'm feeling sad"
- "I want to do a mood check-in"

#### Journaling  
- "Help me journal"
- "I want to write about my day"
- "Give me a writing prompt"

#### Meditation
- "Guide me through meditation"
- "I need to relax"
- "Help me breathe"

#### Goals
- "Check my goals"
- "I want to set a goal" 
- "Help me track progress"

#### Rewards
- "Show my rewards"
- "I want to celebrate"
- "What have I accomplished?"

### API Testing

Test the chat endpoint directly:

```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "currentMood": "mid", "userPoints": 10, "userId": "test-user"}'
```

## 🔒 Security & Privacy

### Security Measures
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Message length limits and sanitization
- **Helmet**: Security headers for Express server
- **Encryption**: All conversations encrypted in memory
- **Session Management**: Automatic session cleanup

### Privacy Features
- **Data Minimization**: Only essential data stored
- **Encryption**: Sensitive data encrypted with AES-256
- **Automatic Cleanup**: Sessions and audio files automatically deleted
- **User Control**: API endpoint to delete user data
- **No Persistent Storage**: Conversations not saved to database

### Compliance Notes
- Sessions expire after 30 minutes of inactivity
- Audio files deleted after 1 hour
- No conversation data persisted beyond session
- All user data can be deleted on request

## 🎨 Customization

### Frontend Styling
- Modify colors in `ElmoraChat.tsx` - currently uses green theme
- Adjust floating button position via CSS classes
- Customize chat window size and animations

### Backend Responses
- Edit `fallbackResponses` object in `elmora-chat-server.js`
- Modify Dialogflow intents for Google-powered responses
- Adjust TTS voice settings in environment variables

### Points System
- Modify point awards in the chat server
- Integrate with existing rewards system
- Customize point values per interaction type

## 🐛 Troubleshooting

### Common Issues

1. **Google Cloud Authentication Error**
   - Verify service account JSON file path
   - Check environment variable `GOOGLE_APPLICATION_CREDENTIALS`
   - Ensure service account has proper roles

2. **Audio Not Playing**
   - Check browser audio permissions
   - Verify TTS API is enabled
   - Check network connectivity to audio endpoint

3. **Chat Not Responding**
   - Check if backend server is running on port 3001
   - Verify CORS configuration for your frontend URL
   - Check browser console for network errors

4. **Dialogflow Integration Issues**
   - Verify project ID matches your Google Cloud project
   - Check if Dialogflow API is enabled
   - Ensure agent is properly configured

### Debug Mode
Enable detailed logging:

```bash
NODE_ENV=development node server/elmora-chat-server.js
```

### Health Check
Verify services are running:

```bash
curl http://localhost:3001/api/chat/health
```

## 📊 Monitoring & Analytics

### Server Logs
- Chat interactions logged to console
- Error tracking for failed requests
- Performance metrics for response times

### Usage Metrics
- Track conversation length
- Monitor intent detection accuracy
- Measure user engagement

### Cost Management
- Monitor Google Cloud usage in console
- Set up billing alerts
- Consider usage quotas for TTS/Dialogflow

## 🚀 Deployment

### Environment Variables
Ensure all production environment variables are set:

```env
NODE_ENV=production
GOOGLE_PROJECT_ID=your-production-project
GOOGLE_APPLICATION_CREDENTIALS=/path/to/production/key.json
ENCRYPTION_KEY=your-secure-production-key
CLIENT_URL=https://your-domain.com
PORT=3001
```

### Docker Deployment (Optional)

```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["node", "server/elmora-chat-server.js"]
```

### Security in Production
- Use HTTPS only
- Set secure CORS origins
- Implement proper logging
- Monitor for abuse
- Regular security updates

## 🤝 Contributing

1. Follow existing code style and patterns
2. Add JSDoc comments to new functions
3. Test both with and without Google services
4. Update documentation for new features
5. Consider privacy implications of changes

## 📄 License

This chatbot feature is part of the NUDGY wellness application. Please refer to the main project license for usage terms.

---

**Created with 💚 for mental wellness and self-care**