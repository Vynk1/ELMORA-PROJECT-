import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/', icon: '🏠' },
    { name: 'Login', path: '/login', icon: '🔑' }
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/70 border-b border-white/20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 text-gray-900 font-bold text-lg hover:scale-105 transition-transform duration-200 group"
          >
            <span className="text-2xl group-hover:animate-pulse">🌸</span>
            <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent font-serif">
              Elmora
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 group relative ${
                    location.pathname === item.path
                      ? 'text-white bg-purple-600 shadow-lg shadow-purple-600/25'
                      : 'text-gray-700 hover:text-purple-700 hover:bg-purple-50'
                  }`}
                >
                  <span className="text-sm group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Sign Up Button (Desktop) */}
          <div className="hidden md:block">
            <Link
              to="/signup"
              className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:scale-105 hover:from-purple-500 hover:to-violet-500 transition-all duration-200 shadow-lg hover:shadow-xl border border-purple-500/20"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-full text-gray-700 hover:text-purple-700 hover:bg-purple-50 transition-all duration-200"
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
      } overflow-hidden backdrop-blur-xl bg-white/90 border-b border-gray-200`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={closeMenu}
              className={`block px-3 py-3 rounded-lg text-base font-medium transition-all duration-200 flex items-center gap-3 ${
                location.pathname === item.path
                  ? 'text-white bg-purple-600'
                  : 'text-gray-700 hover:text-purple-700 hover:bg-purple-50'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
          
          {/* Mobile Sign Up Button */}
          <div className="pt-2 border-t border-gray-200 mt-4">
            <Link
              to="/signup"
              onClick={closeMenu}
              className="block w-full text-center bg-gradient-to-r from-purple-600 to-violet-600 text-white px-4 py-3 rounded-lg text-base font-medium hover:from-purple-500 hover:to-violet-500 transition-all duration-200"
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