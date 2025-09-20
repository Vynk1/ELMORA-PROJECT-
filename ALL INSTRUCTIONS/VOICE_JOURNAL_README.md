# 🎤 Voice Journal Feature

The Voice Journal feature allows users to speak their journal entries instead of typing them. It uses advanced speech-to-text technology to convert spoken words into text in real-time.

## ✨ Features

### Core Functionality
- **Real-time Speech Recognition**: Uses browser's Web Speech API for instant transcription
- **Google Cloud Fallback**: Automatic fallback to Google Speech-to-Text API for unsupported browsers
- **Live Preview**: See your words appear as you speak with interim results
- **Cross-browser Support**: Works on Chrome, Safari, Edge, and Firefox (with fallbacks)
- **Mobile Friendly**: Optimized for mobile devices with touch-friendly controls

### User Experience
- **Permission Handling**: Smooth microphone permission requests with helpful prompts
- **Visual Feedback**: Recording indicators, animations, and status messages
- **Error Recovery**: Graceful error handling with helpful messages
- **Text Editing**: Full editing capabilities - speak, then refine your text
- **Clear & Start Over**: Easy content management with clear and retry options

## 🛠️ Technical Implementation

### Frontend Components
- **`VoiceJournal.tsx`**: Main voice recording component with UI
- **`useVoiceRecording.ts`**: Custom React hook handling all voice functionality
- **Journal Integration**: Seamlessly integrated into existing journal entry modal

### Backend Services
- **`speech-to-text-handler.ts`**: API endpoint for processing audio files
- **Google Cloud Speech-to-Text**: Professional-grade transcription service
- **Fallback System**: Mock transcription for development and testing

### Browser Technologies Used
1. **Web Speech API**: Real-time speech recognition (Chrome, Safari, Edge)
2. **MediaRecorder API**: Audio recording for browsers without Speech API
3. **getUserMedia API**: Microphone access with proper permissions

## 🚀 Setup & Installation

### 1. Install Dependencies

The required dependencies are already added to `package.json`:

```bash
npm install
```

Key packages:
- `@google-cloud/speech` - Google Speech-to-Text API
- `multer` - File upload handling for audio
- `@types/multer` - TypeScript types for multer

### 2. Google Cloud Setup (Optional)

For production use with Google Speech-to-Text:

1. **Create Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable Speech-to-Text API**
   - Navigate to [Speech-to-Text API](https://console.cloud.google.com/apis/api/speech.googleapis.com)
   - Click "Enable"

3. **Create Service Account**
   - Go to IAM & Admin > Service Accounts
   - Create a new service account
   - Download the JSON key file

4. **Update Environment Variables**
   ```bash
   # Add to your .env file
   GOOGLE_PROJECT_ID=your-project-id
   GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account-key.json
   NODE_ENV=production
   ```

### 3. Development Mode (Default)

The feature works out of the box in development mode with:
- **Browser Speech API**: Real-time transcription in supported browsers
- **Mock Transcription**: Fallback sample text for testing without Google Cloud
- **Full UI/UX**: Complete user interface and experience

## 📱 Browser Support

### Full Support (Real-time)
- ✅ **Chrome/Chromium** - Web Speech API
- ✅ **Safari** - Web Speech API  
- ✅ **Microsoft Edge** - Web Speech API

### Fallback Support (File Upload)
- ⚠️ **Firefox** - MediaRecorder → Server transcription
- ⚠️ **Mobile browsers** - MediaRecorder → Server transcription
- ⚠️ **Other browsers** - MediaRecorder → Server transcription

### Not Supported
- ❌ **Internet Explorer** - Will show "not supported" message

## 🎯 Usage Instructions

### For Users

1. **Start a New Journal Entry**
   - Click "New Entry" in the Journal section
   - Look for the journal content area with the microphone button 🎤

2. **Grant Microphone Permission**
   - Click the microphone button
   - Allow microphone access when prompted
   - Permission is remembered for future use

3. **Voice Recording**
   - Click 🎤 to start recording (button turns red 🔴)
   - Speak clearly and naturally
   - Watch your words appear in real-time
   - Click the red button again to stop recording

4. **Edit Your Text**
   - Edit the transcribed text as needed
   - Add more content by typing or voice recording again
   - Use the ✕ button to clear all text

5. **Save Your Entry**
   - Complete other fields (mood, tags, gratitude)
   - Click "Save Entry" to save your voice journal

### Voice Recording Tips
- **Speak Clearly**: Enunciate words for better accuracy
- **Natural Pace**: Don't speak too fast or too slow
- **Quiet Environment**: Reduce background noise for best results
- **Short Sentences**: Pause between thoughts for better punctuation
- **Edit After**: Review and edit transcribed text as needed

## 🔧 Customization

### Component Props

The `VoiceJournal` component accepts these props:

```typescript
interface VoiceJournalProps {
  onTranscriptChange?: (text: string) => void;  // Text change callback
  initialText?: string;                         // Starting text
  placeholder?: string;                         // Placeholder text
  className?: string;                          // Additional CSS classes
  disabled?: boolean;                          // Disable the component
}
```

### Styling

The component uses Tailwind CSS classes. Key customization points:

- **Microphone Button**: Colors and animations for different states
- **Text Area**: Recording state visual feedback
- **Status Messages**: Error, loading, and success states
- **Permission Modal**: Microphone permission request dialog

### Backend Configuration

Configure the speech-to-text service in `speech-to-text-handler.ts`:

```typescript
const config = {
  encoding: 'WEBM_OPUS' as const,
  sampleRateHertz: 48000,           // Audio quality
  languageCode: 'en-US',           // Language (can be changed)
  enableAutomaticPunctuation: true, // Add punctuation
  enableWordConfidence: true,       // Confidence scores
  model: 'latest_long',            // Google model selection
};
```

## 🧪 Testing

### Manual Testing

1. **Permission Flow**
   - Test initial permission request
   - Test permission denial recovery
   - Test permission remembered state

2. **Recording States**
   - Start/stop recording functionality
   - Visual feedback during recording
   - Real-time transcription display

3. **Error Handling**
   - Test with microphone disconnected
   - Test with no speech input
   - Test network failures

4. **Cross-browser Testing**
   - Chrome: Should use Web Speech API
   - Safari: Should use Web Speech API
   - Firefox: Should use MediaRecorder fallback
   - Mobile: Test touch interactions

### Development Testing

```bash
# Start the development server
npm run dev

# Test the speech-to-text endpoint directly
curl -X GET http://localhost:3000/api/speech-to-text/health
```

## 🔒 Privacy & Security

### Data Handling
- **No Audio Storage**: Audio is never permanently stored
- **Temporary Processing**: Audio files deleted after transcription
- **Local First**: Uses browser APIs when possible
- **Secure Transmission**: HTTPS required for microphone access

### Google Cloud Privacy
- **No Data Retention**: Google doesn't store audio or transcriptions
- **Encrypted Transmission**: All data encrypted in transit
- **Compliance**: Follows Google Cloud privacy policies

### User Control
- **Permission Based**: User must explicitly grant microphone access
- **Transparent**: Clear indication when recording is active
- **Reversible**: Users can deny/revoke permissions anytime

## 🐛 Troubleshooting

### Common Issues

1. **"Microphone not supported"**
   - **Solution**: Use Chrome, Safari, or Edge
   - **Fallback**: Firefox/other browsers use server transcription

2. **Permission Denied**
   - **Solution**: Check browser settings for microphone access
   - **Reset**: Clear site permissions and try again

3. **No Sound Detected**
   - **Check**: Microphone hardware and system settings
   - **Test**: Try speaking louder or closer to microphone

4. **Transcription Inaccurate**
   - **Tips**: Speak clearly, reduce background noise
   - **Edit**: Manual editing after transcription is expected

5. **Server Transcription Fails**
   - **Check**: Google Cloud credentials and API enablement
   - **Fallback**: Development mode provides sample text

### Debug Information

Enable development mode for detailed error messages:

```bash
NODE_ENV=development npm run dev
```

Check browser console for detailed logs and error information.

## 📊 Performance

### Optimization Features
- **Lazy Loading**: Google Cloud client loaded only when needed
- **Memory Management**: Audio streams cleaned up properly
- **Efficient Updates**: React state optimizations for real-time updates
- **File Size Limits**: 10MB limit on audio uploads

### Resource Usage
- **CPU**: Minimal impact with Web Speech API
- **Network**: Only used for fallback transcription
- **Memory**: Temporary audio buffers, cleaned automatically
- **Storage**: No persistent storage used

## 🔄 Future Enhancements

### Planned Features
- **Multi-language Support**: Support for additional languages
- **Voice Commands**: "New paragraph", "Delete last sentence"
- **Noise Cancellation**: Advanced audio preprocessing
- **Offline Mode**: Local speech recognition models
- **Voice Signatures**: Personalized transcription improvements

### Integration Opportunities
- **Other Components**: Voice input for other forms
- **AI Enhancement**: Integration with journal prompts
- **Analytics**: Usage patterns and accuracy metrics
- **Accessibility**: Enhanced screen reader support

---

**🎤 Start voice journaling today and experience the power of speaking your thoughts!**