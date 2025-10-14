# 🌸 ELMORA - Your Personal Wellness Companion

ELMORA is a modern, AI-powered wellness application designed to help you build positive habits, track your daily progress, and maintain mental well-being. With a beautiful, mood-responsive interface and gamified task management, ELMORA makes wellness engaging and sustainable.

![ELMORA Screenshot](https://via.placeholder.com/800x400/6366f1/white?text=ELMORA+Wellness+App)

## ✨ Features

### 🎯 Core Functionality
- **AI-Powered Daily Check-ins** - Personalized wellness insights based on your mood and energy levels
- **Smart Task Management** - Pre-loaded daily wellness tasks with beautiful progress visualization
- **Mood-Based Theming** - Dynamic UI that adapts to your emotional state (Sad, Mid, Amazing)
- **Gamified Progress** - Earn points, maintain streaks, and unlock rewards
- **Multi-language Support** - Available in English, Spanish, French, German, and Italian

### 🌈 Wellness Features
- **Journal Entries** - Voice-to-text journaling with mood tracking and AI insights
- **Meditation Sessions** - Guided meditation with session tracking and analytics
- **Goal Setting** - Set and track long-term wellness objectives
- **Social Features** - Send encouragement to friends and family
- **Progress Analytics** - Comprehensive dashboard with charts and statistics

### 🎨 User Experience
- **Beautiful Animations** - Smooth transitions and engaging visual feedback
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Accessibility** - Built with modern accessibility standards
- **Dark/Light Theme** - Automatic theme switching based on mood selection

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Full type safety throughout the application
- **Vite** - Fast development server and optimized builds
- **TailwindCSS** - Utility-first styling with custom theming
- **React Router 6** - Client-side routing

### Backend
- **Supabase** - Backend-as-a-Service with PostgreSQL database
- **Row Level Security** - Database-level security for user data
- **Real-time subscriptions** - Live updates for collaborative features

### UI Components
- **Radix UI** - Accessible, unstyled UI primitives
- **Lucide React** - Beautiful SVG icons
- **Custom Animations** - Smooth micro-interactions throughout

## 📦 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Supabase account (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/elmora.git
   cd elmora
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up the database**
   
   Go to your [Supabase Dashboard](https://supabase.com/dashboard) → SQL Editor and run:
   ```sql
   -- Copy and paste the contents of quick-journal-fix.sql
   -- This creates all necessary tables and security policies
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:8080` (or the port shown in your terminal)

## 🗄️ Database Setup

ELMORA requires specific database tables to function. Follow these steps:

### Method 1: Supabase Dashboard (Recommended)
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **SQL Editor**
4. Copy the contents of `quick-journal-fix.sql`
5. Paste and click **"Run"**

### Method 2: Command Line
```bash
node setup-database.js
```

### Required Tables
- `profiles` - User profile information
- `journals` - Journal entries with mood tracking
- `meditations` - Meditation session records
- `admin_users` - Admin access control

## 🔐 Google OAuth Setup

To enable Google Sign-In functionality, follow these steps:

### 1. Google Cloud Console Setup

1. **Create Google Cloud Project** (if you don't have one)
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable Google+ API**
   - Navigate to **APIs & Services** → **Library**
   - Search for "Google+ API" and enable it

3. **Create OAuth 2.0 Credentials**
   - Go to **APIs & Services** → **Credentials**
   - Click **"Create Credentials"** → **"OAuth 2.0 Client IDs"**
   - Choose **"Web application"**
   - Add authorized redirect URIs:
     - `http://localhost:8080/auth/callback` (development)
     - `https://yourdomain.com/auth/callback` (production)
   - Save and copy your **Client ID** and **Client Secret**

### 2. Supabase Configuration

1. **Enable Google Provider**
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Select your project → **Authentication** → **Providers**
   - Find **Google** and toggle it **ON**

2. **Add Google Credentials**
   - **Client ID**: Paste your Google OAuth Client ID
   - **Client Secret**: Paste your Google OAuth Client Secret
   - **Redirect URL**: `https://[your-supabase-url]/auth/v1/callback`

3. **Configure Additional Settings**
   - **Skip nonce check**: Enable (recommended)
   - **Additional scopes**: `openid email profile` (default is fine)

### 3. Application Configuration

Your `.env.local` should already contain your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Testing Google OAuth

1. **Start your development server**
   ```bash
   npm run dev
   ```

2. **Navigate to the login page**
   - Go to `http://localhost:8080/login`
   - Click **"Continue with Google"**
   - Complete the OAuth flow

3. **Verify the integration**
   - Check that you're redirected to `/dashboard` after login
   - Verify user data is stored in Supabase Auth

### 5. Production Deployment

For production deployment:

1. **Update redirect URLs** in Google Cloud Console:
   - Add your production domain: `https://yourdomain.com/auth/callback`

2. **Update Supabase settings**:
   - Go to **Authentication** → **URL Configuration**
   - Set **Site URL** to your production domain
   - Add additional redirect URLs if needed

### Troubleshooting Google OAuth

- **"redirect_uri_mismatch"**: Ensure redirect URIs match exactly in Google Cloud Console
- **"invalid_client"**: Verify Client ID and Secret are correct in Supabase
- **CORS errors**: Check that your domain is added to Supabase Auth settings
- **Session issues**: Clear browser data and try again

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run typecheck    # Run TypeScript type checking
npm test            # Run unit tests
npm run format.fix   # Format code with Prettier

# Database
node setup-database.js     # Set up database with sample data
node verify-tables.js      # Verify database tables exist
node debug-supabase.js     # Debug Supabase connection
```

## 📱 Usage

### Getting Started
1. **Select Your Mood** - Choose from Sad, Mid, or Amazing mood states
2. **Daily Check-in** - Complete the AI-powered wellness assessment  
3. **Complete Tasks** - Work through your daily wellness tasks
4. **Track Progress** - View analytics and maintain streaks
5. **Journal** - Write entries with voice-to-text support
6. **Meditate** - Access guided meditation sessions

### Test Accounts
For development and testing:
- **Email**: alice.johnson@example.com
- **Password**: password123

Additional test users available with the same password:
- bob.smith@example.com
- carol.williams@example.com
- david.brown@example.com

### Admin Dashboard
- **Email**: admin@elmora.com
- **Password**: admin123
- **Access**: `/admin` route for analytics dashboard

## 🤝 Contributing

We welcome contributions to ELMORA! Please follow these guidelines:

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Test thoroughly**
   ```bash
   npm run typecheck
   npm test
   npm run build
   ```
5. **Commit with descriptive messages**
   ```bash
   git commit -m 'Add amazing feature that improves user experience'
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Create a Pull Request**

### Development Guidelines
- **Follow TypeScript best practices**
- **Write tests for new features**
- **Follow the existing code style (Prettier/ESLint)**
- **Update documentation for significant changes**
- **Ensure accessibility compliance**
- **Test on both desktop and mobile**

### Code Review Process
- All changes require review and approval from project maintainers
- PRs must pass all CI/CD checks
- Changes affecting UI/UX require screenshots
- Breaking changes require detailed migration notes

## 🏗️ Project Structure

```
elmora/
├── client/                 # React frontend application
│   ├── components/        # Reusable React components
│   │   ├── ui/           # Base UI component library
│   │   ├── auth/         # Authentication components
│   │   └── modals/       # Modal components
│   ├── pages/            # Route-based page components
│   ├── contexts/         # React context providers
│   ├── lib/              # API utilities and configurations
│   ├── styles/           # CSS and styling files
│   └── utils/            # Utility functions and translations
├── public/               # Static assets
├── database/             # Database setup and migration files
├── docs/                 # Documentation
└── tests/               # Test files
```

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start
```

### Recommended Platforms
- **Vercel** - Optimized for React applications
- **Netlify** - Serverless deployment with built-in CDN
- **Railway** - Full-stack deployment
- **Traditional Hosting** - Any Node.js hosting platform

### Environment Variables
Ensure these are set in production:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 🧪 Testing

### Running Tests
```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

### Testing Strategy
- **Unit Tests** - Component and utility function tests
- **Integration Tests** - API and database interaction tests
- **E2E Tests** - Full user workflow testing
- **Accessibility Tests** - WCAG compliance testing

## 🔧 Troubleshooting

### Common Issues

**Journal not loading:**
- Ensure database tables are created via SQL script
- Check Supabase connection in browser console
- Verify environment variables are set correctly

**Authentication issues:**
- Clear browser cache and localStorage
- Check Supabase project status
- Verify API keys are not expired

**Development server not starting:**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check port availability: `lsof -ti:8080`
- Update Node.js to latest LTS version

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase** - Backend-as-a-Service platform
- **Radix UI** - Accessible component primitives
- **TailwindCSS** - Utility-first CSS framework
- **React Community** - Amazing ecosystem and tools
- **Open Source Contributors** - All the amazing libraries we use

## 👥 Contributors

### Current Team
- **Vinayak Gupta** - Lead Developer & Project Maintainer & Database Architect
- **Kanishka Narang** - Frontend Developer
- **Deepanshu** - Backend Support Developer & UI/UX Designer

### Contributing
We welcome new contributors! Please see our [Contributing Guidelines](#-contributing) above.

---

**Made with 💜 for your wellness journey**

Transform your daily routine into a beautiful, engaging experience with ELMORA. Start your wellness journey today! 🌸

---

## 📞 Support & Contact

- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/elmora/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yourusername/elmora/discussions)
- 📧 **Email**: support@elmora.app
- 🌐 **Website**: https://elmora.app

---

### Branch Protection Rules

This repository uses branch protection rules to ensure code quality:
- All changes must be made via Pull Requests
- Pull Requests require review and approval from maintainers
- Status checks must pass before merging
- Only authorized contributors can push to main branch