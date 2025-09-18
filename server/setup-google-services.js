#!/usr/bin/env node

/**
 * Setup script for Google Cloud services (Dialogflow and Text-to-Speech)
 * This script helps configure the required Google Cloud services for the Elmora chatbot
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🌿 Elmora Chatbot - Google Cloud Services Setup');
console.log('================================================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '../.env');
const envExamplePath = path.join(__dirname, '../.env.example');

if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file from template...');
  
  const envTemplate = `# Elmora Chatbot Configuration
# Google Cloud Services
GOOGLE_PROJECT_ID=your-google-project-id
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/service-account-key.json

# Server Configuration
PORT=3001
CLIENT_URL=http://localhost:8081
NODE_ENV=development

# Security
ENCRYPTION_KEY=your-32-character-encryption-key-here

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Session Management
SESSION_TIMEOUT_MS=1800000

# Audio Settings
TTS_VOICE_NAME=en-US-Standard-F
TTS_SPEAKING_RATE=0.9
TTS_PITCH=0.0
`;

  fs.writeFileSync(envPath, envTemplate);
  console.log('✅ .env file created successfully');
} else {
  console.log('✅ .env file already exists');
}

console.log(`
📋 Setup Instructions:

1. 🏗️  SET UP GOOGLE CLOUD PROJECT:
   - Go to https://console.cloud.google.com/
   - Create a new project or select existing one
   - Note your PROJECT_ID

2. 🔧 ENABLE APIS:
   - Enable Dialogflow API: https://console.cloud.google.com/apis/api/dialogflow.googleapis.com
   - Enable Text-to-Speech API: https://console.cloud.google.com/apis/api/texttospeech.googleapis.com

3. 🔑 CREATE SERVICE ACCOUNT:
   - Go to https://console.cloud.google.com/iam-admin/serviceaccounts
   - Create a new service account
   - Download the JSON key file
   - Place it in a secure location and note the path

4. 🗣️  SET UP DIALOGFLOW:
   - Go to https://dialogflow.cloud.google.com/
   - Create a new agent
   - Select your Google Cloud project
   - Import the intents from dialogflow-setup.json

5. ⚙️  UPDATE ENVIRONMENT VARIABLES:
   - Edit the .env file created above
   - Set GOOGLE_PROJECT_ID to your project ID
   - Set GOOGLE_APPLICATION_CREDENTIALS to the path of your JSON key file
   - Generate a secure ENCRYPTION_KEY (32 characters)

6. 📦 INSTALL DEPENDENCIES:
   Run: npm install @google-cloud/dialogflow @google-cloud/text-to-speech express cors helmet express-rate-limit

7. 🚀 START THE SERVER:
   Run: node elmora-chat-server.js

💡 SECURITY NOTES:
   - Never commit your .env file or service account keys to version control
   - Use environment variables in production
   - Regularly rotate your encryption keys
   - Monitor your Google Cloud usage and costs

🔊 AUDIO FEATURES:
   - The chatbot will automatically generate spoken responses
   - Audio files are temporarily stored and cleaned up automatically
   - Users can click to replay audio responses

🛡️  PRIVACY & SECURITY:
   - All conversations are encrypted in memory
   - Session data expires automatically
   - Rate limiting prevents abuse
   - User data can be deleted on request

🧪 TESTING:
   - Test with fallback responses first (without Google services)
   - Verify Dialogflow integration with simple queries
   - Test Text-to-Speech with various message lengths
   - Check audio file cleanup functionality
`);

console.log('\n🌿 Setup complete! Please follow the instructions above to configure your Google Cloud services.');

// Create package.json dependencies section if it doesn't exist
const packageJsonPath = path.join(__dirname, '../package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  const requiredDeps = {
    '@google-cloud/dialogflow': '^6.0.0',
    '@google-cloud/text-to-speech': '^5.0.0',
    'express': '^4.18.0',
    'cors': '^2.8.5',
    'helmet': '^7.0.0',
    'express-rate-limit': '^6.0.0'
  };

  let needsUpdate = false;
  for (const [dep, version] of Object.entries(requiredDeps)) {
    if (!packageJson.dependencies || !packageJson.dependencies[dep]) {
      needsUpdate = true;
      break;
    }
  }

  if (needsUpdate) {
    console.log('\n📦 Required npm packages:');
    console.log('npm install ' + Object.keys(requiredDeps).join(' '));
  }
}