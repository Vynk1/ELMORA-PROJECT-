# ELMORA - Your Personal Wellness Companion 🌸

ELMORA is a modern, AI-powered wellness application designed to help you build positive habits, track your daily progress, and maintain mental well-being. With a beautiful, mood-responsive interface and gamified task management, ELMORA makes wellness engaging and sustainable.

## ✨ Features

### 🎯 Core Functionality
- **AI-Powered Daily Check-ins** - Personalized wellness insights based on your mood and energy levels
- **Smart Task Management** - Pre-loaded daily wellness tasks with beautiful flower growth visualization
- **Mood-Based Theming** - Dynamic UI that adapts to your emotional state
- **Gamified Progress** - Earn points, maintain streaks, and unlock rewards
- **Multi-language Support** - Available in English, Spanish, French, German, and Italian

### 🌈 Wellness Features
- **Mood Tracking** - Visual mood selection with three states (Sad, Mid, Amazing)
- **Daily Habits** - 5 pre-loaded wellness tasks including hydration, exercise, gratitude, meditation, and learning
- **Progress Visualization** - Watch your virtual flower grow as you complete tasks
- **Reward System** - Earn points and unlock coupons for real-world rewards
- **Social Features** - Send encouragement to friends and family

### 🎨 User Experience
- **Beautiful Animations** - Smooth transitions and engaging visual feedback
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Dark/Light Theme** - Automatic theme switching based on system preferences
- **Accessibility** - Built with modern accessibility standards in mind

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Full type safety throughout the application
- **Vite** - Fast development server and optimized builds
- **TailwindCSS** - Utility-first styling with custom theming
- **React Router 6** - Client-side routing in SPA mode

### Backend
- **Express.js** - Node.js web framework
- **Vite Integration** - Development server integration for full-stack development

### UI Components
- **Radix UI** - Accessible, unstyled UI primitives
- **Lucide React** - Beautiful SVG icons
- **Custom Animations** - Framer Motion for advanced animations

### Development Tools
- **Vitest** - Fast unit testing
- **ESLint & Prettier** - Code quality and formatting
- **TypeScript** - Static type checking

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Setup
1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/elmora.git
   cd elmora
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080` (or the port shown in your terminal)

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

# Build Variants
npm run build:client # Build only the client-side application
npm run build:server # Build only the server-side application
```

## 📱 Usage

### Getting Started
1. **Select Your Mood** - Choose from three mood states when you first visit
2. **Daily Check-in** - Complete the AI-powered wellness assessment
3. **Complete Tasks** - Work through your daily wellness tasks
4. **Watch Your Progress** - See your flower grow as you complete tasks
5. **Earn Rewards** - Collect points and unlock real-world rewards

### Daily Tasks (Pre-loaded)
- 💧 **Hydration** - Drink 8 glasses of water
- 🚶‍♀️ **Movement** - Take a 15-minute walk outside
- ✨ **Gratitude** - Write down 3 things you're grateful for
- 🧘‍♀️ **Mindfulness** - Do 5 minutes of meditation or deep breathing
- 📚 **Learning** - Read 10 pages of a book or article

### Navigation
- **Dashboard** - Overview of your progress and quick actions
- **Tasks** - Manage your daily wellness tasks
- **Journal** - Reflection and journaling features
- **Meditation** - Guided meditation and mindfulness exercises
- **Goals** - Set and track long-term wellness objectives
- **Friends** - Social features and encouragement
- **Rewards** - View and redeem earned rewards

## 🎨 Customization

### Themes
ELMORA automatically adapts its appearance based on your selected mood:
- **Sad Mode** - Calming blues and grays for difficult days
- **Mid Mode** - Warm ambers and yellows for balanced days
- **Amazing Mode** - Vibrant greens and teals for great days

### Languages
Currently supported languages:
- 🇺🇸 English
- 🇪🇸 Spanish
- 🇫🇷 French
- 🇩🇪 German
- 🇮🇹 Italian

## 🏗️ Project Structure

```
elmora/
├── client/                 # React frontend application
│   ├── components/        # Reusable React components
│   │   ├── ui/           # Base UI component library
│   │   └── modals/       # Modal components
│   ├── pages/            # Route-based page components
│   ├── contexts/         # React context providers
│   ├── utils/            # Utility functions and translations
│   └── global.css        # Global styles and theme variables
├── server/               # Express backend
│   ├── routes/          # API route handlers
│   └── index.ts         # Main server configuration
├── shared/              # Shared TypeScript types
└── public/              # Static assets
```

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start
```

### Deployment Platforms
The application is configured for easy deployment on:
- **Netlify** - Serverless deployment with built-in CDN
- **Vercel** - Optimized for React applications
- **Traditional Hosting** - Can be deployed on any Node.js hosting platform

## 🤝 Contributing

We welcome contributions to ELMORA! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Follow the existing code style (Prettier/ESLint)
- Update documentation for significant changes

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Acknowledgments

- **Builder.io** - Initial development platform
- **Radix UI** - Accessible component primitives
- **TailwindCSS** - Utility-first CSS framework
- **React Community** - Amazing ecosystem and tools

## 📞 Support

If you have any questions or need help:
- 📧 Email: support@elmora.app
- 💬 Feedback: feedback@elmora.app
- 🐛 Issues: Please open an issue on GitHub

---

**Made with 💜 for your wellness journey**

Transform your daily routine into a beautiful, engaging experience with ELMORA. Start your wellness journey today! 🌸