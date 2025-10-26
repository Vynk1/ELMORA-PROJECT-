import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { useTheme } from '../context/ThemeContext.jsx';
import { Sprout, Users, Target, Lock, Pen, MessageCircle, User } from 'lucide-react';

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { isDark } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <Navbar />
      
      {/* Dynamic Animated Background */}
      <div className={`absolute inset-0 transition-all duration-500 ${
        isDark 
          ? 'bg-gradient-to-br from-teal-900 via-purple-900 to-pink-900'
          : 'bg-gradient-to-br from-teal-100 via-purple-100 to-pink-100'
      }`}>
        {/* Animated gradient orbs */}
        <div className={`absolute top-20 left-10 w-96 h-96 rounded-full blur-3xl animate-float ${
          isDark 
            ? 'bg-gradient-to-br from-pink-400/30 to-teal-400/30'
            : 'bg-gradient-to-br from-pink-300/40 to-teal-300/40'
        }`}></div>
        <div className={`absolute bottom-20 right-10 w-80 h-80 rounded-full blur-3xl animate-float animation-delay-3000 ${
          isDark
            ? 'bg-gradient-to-br from-teal-400/20 to-purple-400/30'
            : 'bg-gradient-to-br from-teal-300/30 to-purple-300/40'
        }`}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-2xl animate-float animation-delay-6000 ${
          isDark
            ? 'bg-gradient-to-br from-pink-400/10 to-teal-400/20'
            : 'bg-gradient-to-br from-pink-300/20 to-teal-300/30'
        }`}></div>
        
        {/* Subtle particle effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-float"></div>
          <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-pink-300/30 rounded-full animate-float animation-delay-2000"></div>
          <div className="absolute top-1/2 left-3/4 w-3 h-3 bg-teal-300/20 rounded-full animate-float animation-delay-4000"></div>
          <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-purple-300/25 rounded-full animate-float animation-delay-5000"></div>
        </div>
        
        {/* Gradient overlay for text visibility */}
        <div className={`absolute inset-0 ${
          isDark
            ? 'bg-gradient-to-b from-black/70 via-black/30 to-black/60'
            : 'bg-gradient-to-b from-white/30 via-white/10 to-white/40'
        }`}></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 pt-24 md:pt-0">
        <div className={`text-center max-w-4xl mx-auto transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light mb-4 md:mb-6 leading-tight px-2">
            <span className={`block font-serif font-bold ${
              isDark
                ? 'text-white drop-shadow-2xl'
                : 'text-gray-900'
            }`}>
              Emotional Wellness
            </span>
            <span className={`block font-serif font-bold mt-2 ${
              isDark
                ? 'text-green-400 drop-shadow-2xl'
                : 'text-purple-700'
            }`}>
              Redefined
            </span>
          </h1>

          {/* Subtext */}
          <p className={`text-base sm:text-lg md:text-xl xl:text-2xl mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed font-light transform transition-all duration-1000 delay-300 px-4 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          } ${
            isDark ? 'text-white/90' : 'text-gray-700'
          }`}>
            Where technology meets empathy. Discover mindful growth, AI-powered insights, and a supportive community designed for your emotional well-being.
          </p>

          {/* CTA Button */}
          <div className={`transform transition-all duration-1000 delay-600 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <Link
              to="/login"
              className={`inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 font-semibold rounded-full text-base sm:text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 group ${
                isDark
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-400 hover:to-green-500 focus:ring-green-400/50 shadow-lg'
                  : 'bg-gradient-to-r from-purple-600 via-pink-600 to-teal-600 text-white hover:from-purple-700 hover:via-pink-700 hover:to-teal-700 focus:ring-purple-500/50 shadow-lg'
              }`}
            >
              <span>Start Your Journey</span>
              <Sprout className="w-5 h-5 sm:w-6 sm:h-6 group-hover:animate-bounce" />
            </Link>
          </div>

          {/* Additional Info */}
          <div className={`mt-8 md:mt-12 lg:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-10 max-w-4xl mx-auto transform transition-all duration-1000 delay-900 px-4 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className="text-center">
              <div className="flex justify-center mb-2"><User className={`w-8 h-8 ${isDark ? 'text-purple-200' : 'text-purple-600'}`} /></div>
              <h3 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>Mindful Check-ins</h3>
              <p className={`text-sm ${isDark ? 'text-white/70' : 'text-gray-600'}`}>Daily mood tracking with AI insights</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2"><Sprout className={`w-8 h-8 ${isDark ? 'text-green-200' : 'text-green-600'}`} /></div>
              <h3 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>Growth Tracking</h3>
              <p className={`text-sm ${isDark ? 'text-white/70' : 'text-gray-600'}`}>Visualize your emotional progress</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2"><Users className={`w-8 h-8 ${isDark ? 'text-blue-200' : 'text-blue-600'}`} /></div>
              <h3 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>Safe Community</h3>
              <p className={`text-sm ${isDark ? 'text-white/70' : 'text-gray-600'}`}>Connect with supportive peers</p>
            </div>
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <section className={`relative z-10 py-12 md:py-20 lg:py-24 px-4 ${
        isDark 
          ? 'bg-gradient-to-r from-purple-900/20 to-teal-900/20'
          : 'bg-gradient-to-r from-purple-200/30 to-teal-200/30'
      }`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16 lg:mb-20">
            <div className="flex justify-center mb-6 md:mb-8">
              <Sprout className={`w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 animate-float ${isDark ? 'text-green-200' : 'text-green-600'}`} />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-light mb-4 md:mb-6 px-2">
              <span className={`bg-clip-text text-transparent drop-shadow-2xl ${
                isDark
                  ? 'bg-gradient-to-r from-pink-200 via-purple-200 to-teal-200'
                  : 'bg-gradient-to-r from-pink-600 via-purple-600 to-teal-600'
              }`}>
                About Elmora
              </span>
            </h2>
            <p className={`text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed max-w-4xl mx-auto px-4 ${
              isDark ? 'text-white/90' : 'text-gray-700'
            }`}>
              At <strong className={isDark ? 'text-purple-200' : 'text-purple-700'}>Elmora</strong>, we believe emotional well-being deserves the same attention as physical health. Our mission is to make mindfulness and self-growth simple, friendly, and supported by AI.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
            <div className={`backdrop-blur-xl rounded-3xl p-6 shadow-lg border transition-all duration-300 hover:scale-105 ${
              isDark
                ? 'bg-white/10 border-white/20 hover:shadow-xl'
                : 'bg-white/80 border-gray-200 hover:shadow-2xl'
            }`}>
              <div className="flex justify-center mb-4"><MessageCircle className={`w-10 h-10 ${isDark ? 'text-purple-200' : 'text-purple-600'}`} /></div>
              <h3 className={`text-lg font-semibold mb-3 text-center ${
                isDark ? 'text-purple-300' : 'text-gray-800'
              }`}>
                Check in daily with mood and thoughts
              </h3>
              <p className={`text-center text-sm leading-relaxed ${
                isDark ? 'text-white/70' : 'text-gray-600'
              }`}>
                Track your emotional patterns with mindful daily reflections
              </p>
            </div>

            <div className={`backdrop-blur-xl rounded-3xl p-6 shadow-lg border transition-all duration-300 hover:scale-105 ${
              isDark ? 'bg-white/10 border-white/20 hover:shadow-xl' : 'bg-white/80 border-gray-200 hover:shadow-2xl'
            }`}>
              <div className="flex justify-center mb-4"><Pen className={`w-10 h-10 ${isDark ? 'text-teal-200' : 'text-teal-600'}`} /></div>
              <h3 className={`text-lg font-semibold mb-3 text-center ${isDark ? 'text-teal-300' : 'text-gray-800'}`}>
                Journal and receive AI-powered summaries
              </h3>
              <p className={`text-center text-sm leading-relaxed ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                Get personalized affirmations and insights from your entries
              </p>
            </div>

            <div className={`backdrop-blur-xl rounded-3xl p-6 shadow-lg border transition-all duration-300 hover:scale-105 ${
              isDark ? 'bg-white/10 border-white/20 hover:shadow-xl' : 'bg-white/80 border-gray-200 hover:shadow-2xl'
            }`}>
              <div className="flex justify-center mb-4"><Target className={`w-10 h-10 ${isDark ? 'text-pink-200' : 'text-pink-600'}`} /></div>
              <h3 className={`text-lg font-semibold mb-3 text-center ${isDark ? 'text-pink-300' : 'text-gray-800'}`}>
                Set mindful goals and track streaks
              </h3>
              <p className={`text-center text-sm leading-relaxed ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                Build sustainable wellness habits with motivating progress tracking
              </p>
            </div>

            <div className={`backdrop-blur-xl rounded-3xl p-6 shadow-lg border transition-all duration-300 hover:scale-105 ${
              isDark ? 'bg-white/10 border-white/20 hover:shadow-xl' : 'bg-white/80 border-gray-200 hover:shadow-2xl'
            }`}>
              <div className="flex justify-center mb-4"><User className={`w-10 h-10 ${isDark ? 'text-purple-200' : 'text-purple-600'}`} /></div>
              <h3 className={`text-lg font-semibold mb-3 text-center ${isDark ? 'text-purple-300' : 'text-gray-800'}`}>
                Meditate and practice guided breathing
              </h3>
              <p className={`text-center text-sm leading-relaxed ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                Access curated mindfulness exercises tailored to your needs
              </p>
            </div>

            <div className={`backdrop-blur-xl rounded-3xl p-6 shadow-lg border transition-all duration-300 hover:scale-105 ${
              isDark ? 'bg-white/10 border-white/20 hover:shadow-xl' : 'bg-white/80 border-gray-200 hover:shadow-2xl'
            }`}>
              <div className="flex justify-center mb-4"><Sprout className={`w-10 h-10 ${isDark ? 'text-green-200' : 'text-green-600'}`} /></div>
              <h3 className={`text-lg font-semibold mb-3 text-center ${isDark ? 'text-green-300' : 'text-gray-800'}`}>
                Grow a virtual plant
              </h3>
              <p className={`text-center text-sm leading-relaxed ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                Watch your digital garden flourish as your emotional wellness grows
              </p>
            </div>

            <div className={`backdrop-blur-xl rounded-3xl p-6 shadow-lg border transition-all duration-300 hover:scale-105 ${
              isDark ? 'bg-white/10 border-white/20 hover:shadow-xl' : 'bg-white/80 border-gray-200 hover:shadow-2xl'
            }`}>
              <div className="flex justify-center mb-4"><Users className={`w-10 h-10 ${isDark ? 'text-blue-200' : 'text-blue-600'}`} /></div>
              <h3 className={`text-lg font-semibold mb-3 text-center ${isDark ? 'text-blue-300' : 'text-gray-800'}`}>
                Connect with a safe community
              </h3>
              <p className={`text-center text-sm leading-relaxed ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                Join a supportive network focused on growth and understanding
              </p>
            </div>
          </div>

          {/* Philosophy Section */}
          <div className="text-center mt-16 md:mt-20 lg:mt-24">
            <div className={`backdrop-blur-xl rounded-3xl p-6 md:p-8 lg:p-10 border max-w-4xl mx-auto ${
              isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-gray-200'
            }`}>
              <p className={`text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed mb-6 md:mb-8 ${
                isDark ? 'text-white/90' : 'text-gray-700'
              }`}>
                We combine <strong className={isDark ? 'text-purple-200' : 'text-purple-600'}>psychology</strong>, <strong className={isDark ? 'text-teal-200' : 'text-teal-600'}>AI insights</strong>, and <strong className={isDark ? 'text-pink-200' : 'text-pink-600'}>gamified motivation</strong> to help people understand themselves better and build sustainable mental wellness habits.
              </p>
              
              {/* Privacy Message */}
              <div className="flex items-center justify-center gap-2 md:gap-3 mb-3 md:mb-4">
                <Lock className={`w-6 h-6 md:w-7 md:h-7 ${isDark ? 'text-yellow-200' : 'text-yellow-600'}`} />
                <h3 className={`text-lg md:text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>Your Privacy Matters</h3>
              </div>
              <p className={`text-sm md:text-base leading-relaxed mb-6 md:mb-8 ${
                isDark ? 'text-white/80' : 'text-gray-600'
              }`}>
                Elmora protects every user's privacy — all personal reflections remain confidential, processed securely, and never shared. <br />
                <strong className={isDark ? 'text-purple-200' : 'text-purple-600'}>Your growth stays yours.</strong>
              </p>

              {/* Vision */}
              <h3 className="text-xl md:text-2xl lg:text-3xl font-serif font-light mb-3 md:mb-4">
                <span className={`bg-clip-text text-transparent ${
                  isDark ? 'bg-gradient-to-r from-pink-200 to-teal-200' : 'bg-gradient-to-r from-pink-600 to-teal-600'
                }`}>
                  Our Vision
                </span>
              </h3>
              <p className={`text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed ${
                isDark ? 'text-white/90' : 'text-gray-700'
              }`}>
                To build a world where technology supports human emotion — with empathy, privacy, and joy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contributors Section */}
      <section id="contributors" className={`relative z-10 py-12 md:py-16 lg:py-20 px-4 ${
        isDark 
          ? 'bg-gradient-to-r from-teal-900/40 to-pink-900/40'
          : 'bg-gradient-to-r from-teal-200/50 to-pink-200/50'
      }`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-light mb-3 md:mb-4 px-2">
              <span className={`bg-clip-text text-transparent drop-shadow-2xl ${
                isDark 
                  ? 'bg-gradient-to-r from-teal-200 via-pink-200 to-purple-200'
                  : 'bg-gradient-to-r from-teal-600 via-pink-600 to-purple-600'
              }`}>
                Meet Our Team
              </span>
            </h2>
            <p className={`text-base sm:text-lg md:text-xl lg:text-2xl ${isDark ? 'text-white/90' : 'text-gray-700'}`}>The minds behind Elmora 🌸</p>
          </div>

          {/* Contributors Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8 max-w-6xl mx-auto">
            {/* Lead Developer */}
            <div className={`backdrop-blur-xl rounded-2xl p-6 border transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
              isDark ? 'bg-white/10 border-white/20 hover:bg-white/15' : 'bg-white/90 border-gray-200 hover:bg-white'
            }`}>
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  VG
                </div>
                <h3 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>Vinayak Gupta</h3>
                <p className={`text-xs font-medium mb-2 ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>Lead Developer</p>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                  Full-Stack Architecture & Implementation
                </p>
              </div>
            </div>

            {/* AI Features Developer */}
            <div className={`backdrop-blur-xl rounded-2xl p-6 border transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
              isDark ? 'bg-white/10 border-white/20 hover:bg-white/15' : 'bg-white/90 border-gray-200 hover:bg-white'
            }`}>
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  SB
                </div>
                <h3 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>Sumit Bhatt</h3>
                <p className={`text-xs font-medium mb-2 ${isDark ? 'text-teal-300' : 'text-teal-600'}`}>AI Developer</p>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                  AI Features & Quality Assurance
                </p>
              </div>
            </div>

            {/* UI Designer */}
            <div className={`backdrop-blur-xl rounded-2xl p-6 border transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
              isDark ? 'bg-white/10 border-white/20 hover:bg-white/15' : 'bg-white/90 border-gray-200 hover:bg-white'
            }`}>
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  KN
                </div>
                <h3 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>Kanishka Narang</h3>
                <p className={`text-xs font-medium mb-2 ${isDark ? 'text-pink-300' : 'text-pink-600'}`}>UI Designer</p>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                  Builder.io & Initial UI Framework
                </p>
              </div>
            </div>

            {/* Testing */}
            <div className={`backdrop-blur-xl rounded-2xl p-6 border transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
              isDark ? 'bg-white/10 border-white/20 hover:bg-white/15' : 'bg-white/90 border-gray-200 hover:bg-white'
            }`}>
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  D
                </div>
                <h3 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>Deepanshu</h3>
                <p className={`text-xs font-medium mb-2 ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`}>QA Tester</p>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                  Testing & Support
                </p>
              </div>
            </div>

            {/* Documentation */}
            <div className={`backdrop-blur-xl rounded-2xl p-6 border transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
              isDark ? 'bg-white/10 border-white/20 hover:bg-white/15' : 'bg-white/90 border-gray-200 hover:bg-white'
            }`}>
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-orange-400 to-amber-400 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  VB
                </div>
                <h3 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>Vansh Bahl</h3>
                <p className={`text-xs font-medium mb-2 ${isDark ? 'text-orange-300' : 'text-orange-600'}`}>Documentation</p>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                  Presentation & Docs
                </p>
              </div>
            </div>
          </div>

          {/* Project Lead Attribution */}
          <div className="text-center mt-8 md:mt-12 lg:mt-16">
            <div className={`backdrop-blur-xl rounded-2xl p-4 md:p-6 lg:p-8 border max-w-3xl mx-auto ${
              isDark 
                ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-white/20'
                : 'bg-gradient-to-r from-purple-200/50 to-pink-200/50 border-gray-200'
            }`}>
              <p className={`text-xs sm:text-sm mb-1 md:mb-2 ${isDark ? 'text-white/90' : 'text-gray-700'}`}>
                <span className={`font-semibold ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>Project Lead & Creator</span>
              </p>
              <p className={`text-lg sm:text-xl font-semibold mb-1 md:mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>Vinayak Gupta</p>
              <p className={`text-xs sm:text-sm ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                Full code architecture, system design, and complete implementation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`relative z-10 backdrop-blur-sm border-t transition-colors duration-500 ${
        isDark 
          ? 'bg-black/30 border-white/10'
          : 'bg-gray-100/80 border-gray-300'
      }`}>
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
          {/* Main Footer Content */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
            {/* Brand */}
            <div className="text-left">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl md:text-2xl">🌸</span>
                <span className={`font-semibold text-lg md:text-xl ${isDark ? 'text-white' : 'text-gray-800'}`}>Elmora</span>
              </div>
              <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                Where Technology Meets Empathy<br />
                Your Personal Wellness Companion
              </p>
            </div>

            {/* Copyright & Attribution */}
            <div className="text-left md:text-right">
              <p className={`text-xs sm:text-sm ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                <span className="font-semibold">Created by Vinayak Gupta</span> · © 2025 Elmora. All rights reserved. · Built with 💜 for your wellness journey
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;