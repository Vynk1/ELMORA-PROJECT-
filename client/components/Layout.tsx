import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import MoodColorSwitcher, { type MoodType } from './MoodColorSwitcher';

interface LayoutProps {
  children: React.ReactNode;
  currentMood: MoodType;
  onMoodChange: (mood: MoodType) => void;
  showMoodSwitcher?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentMood, 
  onMoodChange, 
  showMoodSwitcher = true 
}) => {
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', icon: '🏠' },
    { name: 'Rewards', href: '/rewards', icon: '🎁' },
    { name: 'Friends', href: '/friends', icon: '👥' },
    { name: 'Notifications', href: '/notifications', icon: '🔔' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">E</span>
              </div>
              <span className="text-2xl font-light text-primary">ELMORA</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`
                    flex items-center space-x-1 px-3 py-2 rounded-xl text-sm font-medium
                    transition-colors gentle-hover
                    ${location.pathname === item.href
                      ? 'bg-primary text-white'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }
                  `}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>

            {/* Mood switcher */}
            {showMoodSwitcher && (
              <MoodColorSwitcher 
                currentMood={currentMood} 
                onMoodChange={onMoodChange}
              />
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Mobile navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-border">
        <div className="flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`
                flex-1 flex flex-col items-center py-3 text-xs
                ${location.pathname === item.href
                  ? 'text-primary'
                  : 'text-muted-foreground'
                }
              `}
            >
              <span className="text-lg mb-1">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <footer className="bg-muted/50 py-8 px-4 mt-16 mb-16 md:mb-0">
        <div className="max-w-7xl mx-auto text-center">
          <Link 
            to="/help" 
            className="text-muted-foreground hover:text-foreground transition-colors gentle-hover"
          >
            Help & Contact
          </Link>
          <p className="text-xs text-muted-foreground mt-2">
            Made with 💜 for your well-being
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
