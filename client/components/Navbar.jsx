import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';
import { Home, Users, KeyRound, Sun, Moon, Flower2 } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme, isDark } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Contributors', path: '#contributors', icon: Users },
    { name: 'Login', path: '/login', icon: KeyRound }
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-all duration-300 shadow-lg ${
      isDark 
        ? 'bg-gradient-to-r from-teal-500/90 via-purple-600/90 to-pink-500/90 border-white/20'
        : 'bg-gradient-to-r from-teal-400/95 via-purple-500/95 to-pink-400/95 border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link 
            to="/" 
            className={`flex items-center gap-2 font-bold text-lg hover:scale-105 transition-transform duration-200 group ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            <Flower2 className={`w-7 h-7 group-hover:animate-pulse ${
              isDark ? 'text-pink-300' : 'text-pink-600'
            }`} />
            <span className={`font-serif drop-shadow-lg ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Elmora
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.path}
                    href={item.path}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 group relative ${
                      location.pathname === item.path
                        ? (isDark 
                            ? 'bg-white text-purple-600 shadow-lg shadow-white/30' 
                            : 'bg-gray-900 text-white shadow-lg')
                        : (isDark
                            ? 'text-white hover:text-white hover:bg-white/20 backdrop-blur-sm'
                            : 'text-gray-900 hover:text-gray-900 hover:bg-gray-900/10 backdrop-blur-sm')
                    }`}
                  >
                    <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>{item.name}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Theme Toggle & Sign Up (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-all duration-200 backdrop-blur-sm ${
                isDark 
                  ? 'bg-white/20 hover:bg-white/30'
                  : 'bg-gray-900/20 hover:bg-gray-900/30'
              }`}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? (
                <Sun className="w-6 h-6 text-yellow-300" />
              ) : (
                <Moon className="w-6 h-6 text-gray-900" />
              )}
            </button>
            
            <Link
              to="/signup"
              className={`px-6 py-2 rounded-full text-sm font-semibold hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl ${
                isDark
                  ? 'bg-white text-purple-600 hover:bg-white/90'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className={`inline-flex items-center justify-center p-2 rounded-full transition-all duration-200 ${
                isDark 
                  ? 'text-white hover:bg-white/20'
                  : 'text-gray-900 hover:bg-gray-900/10'
              }`}
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <div className="relative w-6 h-6">
                <span className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-200 ${
                  isOpen ? 'rotate-45 translate-y-2.5' : 'translate-y-0.5'
                }`}></span>
                <span className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-200 ${
                  isOpen ? 'opacity-0' : 'translate-y-2'
                }`}></span>
                <span className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-200 ${
                  isOpen ? '-rotate-45 translate-y-2.5' : 'translate-y-3.5'
                }`}></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      } overflow-hidden backdrop-blur-xl border-b ${
        isDark
          ? 'bg-gradient-to-r from-teal-500/95 via-purple-600/95 to-pink-500/95 border-white/20'
          : 'bg-gradient-to-r from-teal-400/95 via-purple-500/95 to-pink-400/95 border-gray-200'
      }`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.path}
                href={item.path}
                onClick={closeMenu}
                className={`block px-3 py-3 rounded-lg text-base font-medium transition-all duration-200 flex items-center gap-3 ${
                  location.pathname === item.path
                    ? (isDark 
                        ? 'bg-white text-purple-600' 
                        : 'bg-gray-900 text-white')
                    : (isDark
                        ? 'text-white hover:bg-white/20'
                        : 'text-gray-900 hover:bg-gray-900/10')
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </a>
            );
          })}
          
          {/* Mobile Theme Toggle & Sign Up Button */}
          <div className="pt-2 border-t border-white/20 mt-4 space-y-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isDark 
                  ? 'bg-white/20 hover:bg-white/30 text-white'
                  : 'bg-gray-900/20 hover:bg-gray-900/30 text-gray-900'
              }`}
            >
              {isDark ? (
                <Sun className="w-6 h-6 text-yellow-300" />
              ) : (
                <Moon className="w-6 h-6 text-gray-900" />
              )}
              <span className="font-medium">
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </span>
            </button>
            
            <Link
              to="/signup"
              onClick={closeMenu}
              className={`block w-full text-center px-4 py-3 rounded-lg text-base font-semibold transition-all duration-200 ${
                isDark
                  ? 'bg-white text-purple-600 hover:bg-white/90'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;