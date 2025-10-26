import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { sendChatMessage, getChatHistory, deleteChatHistory } from '../lib/supabaseApi';
import { type MoodType } from './MoodColorSwitcher';
import { MessageCircle, Brain, Trash2, X, Send, Sparkles, Leaf } from 'lucide-react';

interface ChatMessage {
  id: string;
  message: string;
  isBot: boolean;
  timestamp: Date;
}

interface PersonalizedChatProps {
  currentMood?: MoodType;
}

const PersonalizedChat: React.FC<PersonalizedChatProps> = ({ currentMood }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [hasPersonalizedContext, setHasPersonalizedContext] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load chat history when opening
  useEffect(() => {
    if (isOpen && user) {
      loadChatHistory();
    }
  }, [isOpen, user]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const loadChatHistory = async () => {
    try {
      const history = await getChatHistory(50);
      if (history && history.length > 0) {
        const formattedMessages = history.map((msg: any) => ({
          id: msg.id,
          message: msg.message,
          isBot: msg.is_bot,
          timestamp: new Date(msg.created_at)
        }));
        setMessages(formattedMessages);
        setHasPersonalizedContext(true);
      } else {
        showWelcomeMessage();
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      showWelcomeMessage();
    }
  };

  const showWelcomeMessage = () => {
    const welcomeMsg: ChatMessage = {
      id: 'welcome',
      message: "Hello! 🌿 I'm your personalized wellness companion. I remember your journey and I'm here to support you. How can I help you today?",
      isBot: true,
      timestamp: new Date()
    };
    setMessages([welcomeMsg]);
  };

  const sendMessage = async (text?: string) => {
    const messageToSend = text || inputMessage.trim();
    if (!messageToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      message: messageToSend,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await sendChatMessage(messageToSend, currentMood || 'content');
      
      setIsTyping(false);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: response.response,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMsg]);
      setHasPersonalizedContext(true);

      // Show crisis resources if detected
      if (response.crisisDetected) {
        const crisisMsg: ChatMessage = {
          id: (Date.now() + 2).toString(),
          message: "🆘 I notice you might be going through a difficult time. Please reach out to:\n\n• National Suicide Prevention Lifeline: 988\n• Crisis Text Line: Text HOME to 741741\n• International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/\n\nYou don't have to face this alone. Professional help is available 24/7.",
          isBot: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, crisisMsg]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = async () => {
    if (window.confirm('Are you sure you want to clear your chat history? This cannot be undone.')) {
      try {
        await deleteChatHistory();
        setMessages([]);
        setHasPersonalizedContext(false);
        showWelcomeMessage();
      } catch (error) {
        console.error('Error clearing history:', error);
        alert('Failed to clear chat history. Please try again.');
      }
    }
  };

  // Quick action suggestions
  const quickActions = [
    { text: "How am I doing?", icon: "📊" },
    { text: "I'm feeling anxious", icon: "😰" },
    { text: "Give me motivation", icon: "💪" },
    { text: "Breathing exercise", icon: "🫁" },
    { text: "Journal prompts", icon: "📝" },
    { text: "Celebrate my progress", icon: "🎉" }
  ];

  // Smart quick actions based on time and mood
  const getSmartQuickActions = () => {
    const hour = new Date().getHours();
    const timeBasedActions = [];
    const moodBasedActions = [];

    // Time-based suggestions
    if (hour >= 5 && hour < 9) {
      // Early morning (5am-9am)
      timeBasedActions.push(
        { text: "Morning routine ideas", icon: "🌅" },
        { text: "Set intentions for today", icon: "🎯" }
      );
    } else if (hour >= 9 && hour < 12) {
      // Morning (9am-12pm)
      timeBasedActions.push(
        { text: "Focus tips for work", icon: "💼" },
        { text: "Energy boost ideas", icon: "⚡" }
      );
    } else if (hour >= 12 && hour < 17) {
      // Afternoon (12pm-5pm)
      timeBasedActions.push(
        { text: "Midday reset", icon: "🔄" },
        { text: "Quick stress relief", icon: "🧘" }
      );
    } else if (hour >= 17 && hour < 21) {
      // Evening (5pm-9pm)
      timeBasedActions.push(
        { text: "Wind down routine", icon: "🌙" },
        { text: "Reflect on today", icon: "💭" }
      );
    } else {
      // Night (9pm-5am)
      timeBasedActions.push(
        { text: "Better sleep tips", icon: "😴" },
        { text: "Relaxation techniques", icon: "🌟" }
      );
    }

    // Mood-based suggestions
    const moodActions: Record<string, Array<{ text: string; icon: string }>> = {
      'sad': [
        { text: "Lift my mood", icon: "🌈" },
        { text: "Self-compassion exercise", icon: "💝" }
      ],
      'anxious': [
        { text: "Calm my anxiety", icon: "🫁" },
        { text: "Grounding technique", icon: "🌿" }
      ],
      'amazing': [
        { text: "Celebrate this moment", icon: "🎉" },
        { text: "Share my joy", icon: "✨" }
      ],
      'content': [
        { text: "Gratitude practice", icon: "🙏" },
        { text: "Maintain this peace", icon: "☮️" }
      ],
      'calm': [
        { text: "Deepen this calm", icon: "🧘‍♀️" },
        { text: "Mindfulness exercise", icon: "🍃" }
      ]
    };

    if (currentMood && moodActions[currentMood]) {
      moodBasedActions.push(...moodActions[currentMood]);
    }

    // Combine actions: time-based + mood-based + default, remove duplicates, take 6
    const allActions = [...timeBasedActions, ...moodBasedActions, ...quickActions];
    const uniqueActions = Array.from(
      new Map(allActions.map(action => [action.text, action])).values()
    );
    
    return uniqueActions.slice(0, 6);
  };

  const smartActions = getSmartQuickActions();

  // Floating button (when closed)
  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="group relative w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center hover:scale-105"
          aria-label="Open AI Chat"
        >
          {/* Animated pulse ring */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full animate-ping opacity-20"></div>
          
          {/* Icon */}
          <span className="relative z-10">
            {hasPersonalizedContext ? (
              <Brain className="w-6 h-6" strokeWidth={2} />
            ) : (
              <MessageCircle className="w-6 h-6" strokeWidth={2} />
            )}
          </span>
          
          {/* Notification badge */}
          {hasPersonalizedContext && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></span>
          )}
        </button>
        
        {/* Hover tooltip */}
        <div className="absolute bottom-16 right-0 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none flex items-center gap-1">
          {hasPersonalizedContext ? (
            <>
              Chat with your AI companion <Leaf className="w-3 h-3" strokeWidth={2} />
            </>
          ) : (
            'Start a conversation'
          )}
        </div>
      </div>
    );
  }

  // Chat window (when open)
  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 animate-slideUp">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-4 rounded-t-2xl flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Brain className="w-6 h-6" strokeWidth={2} />
          <div>
            <h3 className="font-semibold">AI Wellness Companion</h3>
            <p className="text-xs opacity-90">
              {hasPersonalizedContext ? 'Personalized for you' : 'Getting to know you'}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={clearHistory}
            className="hover:bg-white/20 p-2 rounded-lg transition-colors"
            title="Clear history"
          >
            <Trash2 className="w-4 h-4" strokeWidth={2} />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-white/20 p-2 rounded-lg transition-colors"
            title="Close chat"
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-purple-50/30 to-blue-50/30">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl ${
                msg.isBot
                  ? 'bg-white text-gray-800 shadow-md'
                  : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl shadow-md">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick actions */}
      {messages.length <= 1 && !isTyping && (
        <div className="px-4 py-3 border-t border-gray-200 bg-white/80">
          <p className="text-xs text-gray-600 mb-2 font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3" strokeWidth={2} />
            Smart suggestions for you:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {smartActions.slice(0, 4).map((action, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(action.text)}
                className="text-xs px-3 py-1.5 bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 text-gray-700 rounded-lg transition-all duration-200 flex items-center justify-center space-x-1 border border-purple-100 hover:border-purple-300 hover:shadow-md"
                disabled={isLoading}
              >
                <span>{action.icon}</span>
                <span className="truncate">{action.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={() => sendMessage()}
            disabled={isLoading || !inputMessage.trim()}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center"
          >
            {isLoading ? '...' : <Send className="w-4 h-4" strokeWidth={2} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedChat;