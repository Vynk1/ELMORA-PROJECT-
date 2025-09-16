import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-soft-pink to-soft-blue flex items-center justify-center z-50">
      {/* Background clouds */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Cloud 1 */}
        <div className="absolute top-20 left-10 w-24 h-12 bg-white/20 rounded-full float-animation"></div>
        <div className="absolute top-16 left-16 w-16 h-8 bg-white/15 rounded-full float-animation"></div>
        
        {/* Cloud 2 */}
        <div className="absolute top-32 right-20 w-32 h-16 bg-white/25 rounded-full float-animation-delayed"></div>
        <div className="absolute top-28 right-28 w-20 h-10 bg-white/20 rounded-full float-animation-delayed"></div>
        
        {/* Cloud 3 */}
        <div className="absolute bottom-40 left-1/4 w-28 h-14 bg-white/20 rounded-full float-animation-slow"></div>
        <div className="absolute bottom-36 left-1/4 ml-6 w-18 h-9 bg-white/15 rounded-full float-animation-slow"></div>
        
        {/* Cloud 4 */}
        <div className="absolute top-1/2 right-1/4 w-20 h-10 bg-white/20 rounded-full float-animation"></div>
        <div className="absolute top-1/2 right-1/4 mr-4 w-14 h-7 bg-white/15 rounded-full float-animation"></div>
        
        {/* Cloud 5 */}
        <div className="absolute bottom-20 right-10 w-26 h-13 bg-white/25 rounded-full float-animation-delayed"></div>
        <div className="absolute bottom-16 right-16 w-16 h-8 bg-white/20 rounded-full float-animation-delayed"></div>
      </div>
      
      {/* Loading content */}
      <div className="text-center z-10">
        <div className="mb-8">
          {/* Gentle pulsing heart icon made with CSS */}
          <div className="mx-auto w-16 h-16 relative">
            <div className="absolute inset-0 bg-primary rounded-full animate-pulse opacity-60"></div>
            <div className="absolute inset-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute inset-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-light text-white mb-4 tracking-wide">
          Loading your love...
        </h1>
        
        {/* Loading dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
