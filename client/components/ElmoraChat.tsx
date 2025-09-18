import React, { useState, useRef, useEffect } from 'react';
import { type MoodType } from './MoodColorSwitcher';

interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  audioUrl?: string;
}

interface ElmoraChatProps {
  currentMood?: MoodType;
  userPoints?: number;
  onPointsUpdate?: (points: number) => void;
}

const ElmoraChat: React.FC<ElmoraChatProps> = ({ 
  currentMood = 'mid', 
  userPoints = 0, 
  onPointsUpdate 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chat with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        text: `Hi there! I'm Elmora, your wellness companion 🌿. I'm here to help you with mood check-ins, journaling, meditation, goal tracking, and more. How are you feeling today?`,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: text.trim(),
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text.trim(),
          currentMood,
          userPoints,
          userId: 'user-' + Date.now(), // In a real app, use proper user ID
        }),
      });

      const data = await response.json();

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: data.response || 'I apologize, I\'m having trouble responding right now. Please try again.',
        isBot: true,
        timestamp: new Date(),
        audioUrl: data.audioUrl,
      };

      setMessages(prev => [...prev, botMessage]);

      // Update points if provided
      if (data.pointsAwarded && onPointsUpdate) {
        onPointsUpdate(userPoints + data.pointsAwarded);
      }

      // Play audio if available
      if (data.audioUrl && audioRef.current) {
        audioRef.current.src = data.audioUrl;
        audioRef.current.play().catch(err => console.log('Audio playback failed:', err));
      }

    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I\'m having technical difficulties. Please try again in a moment.',
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputText);
  };

  const startVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        sendMessage(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('Speech recognition is not supported in your browser.');
    }
  };

  const quickActions = [
    { text: "How are you feeling?", emoji: "😊" },
    { text: "Help me journal", emoji: "📖" },
    { text: "Guide me through meditation", emoji: "🧘" },
    { text: "Check my goals", emoji: "🎯" },
    { text: "Show my rewards", emoji: "🎁" },
  ];

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center text-2xl z-50 ${
          isOpen ? 'rotate-45' : ''
        }`}
        style={{ zIndex: 1000 }}
      >
        {isOpen ? '✕' : '🌿'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[32rem] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col z-50"
             style={{ zIndex: 999 }}>
          
          {/* Header */}
          <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-4 rounded-t-3xl text-white">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">
                🌿
              </div>
              <div>
                <h3 className="font-medium">Elmora</h3>
                <p className="text-xs opacity-90">Your wellness companion</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-72">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl ${
                    message.isBot
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.isBot ? 'text-gray-500' : 'text-white/70'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                  {message.audioUrl && (
                    <button
                      onClick={() => {
                        if (audioRef.current) {
                          audioRef.current.src = message.audioUrl!;
                          audioRef.current.play();
                        }
                      }}
                      className="mt-2 text-xs bg-white/20 px-2 py-1 rounded-lg hover:bg-white/30 transition-colors"
                    >
                      🔊 Play Audio
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length === 1 && (
            <div className="px-4 pb-2">
              <p className="text-xs text-gray-500 mb-2">Quick actions:</p>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => sendMessage(action.text)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-full transition-colors flex items-center space-x-1"
                  >
                    <span>{action.emoji}</span>
                    <span>{action.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-400/50 text-sm"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={startVoiceRecognition}
                disabled={isLoading || isListening}
                className={`p-2 rounded-full transition-colors ${
                  isListening 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
                title="Voice input"
              >
                {isListening ? '🎙️' : '🎤'}
              </button>
              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className="bg-gradient-to-r from-green-400 to-emerald-500 text-white p-2 rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                📤
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Hidden audio element for TTS */}
      <audio ref={audioRef} style={{ display: 'none' }} />
    </>
  );
};

export default ElmoraChat;