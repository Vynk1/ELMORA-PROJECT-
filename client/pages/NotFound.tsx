import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-pink to-soft-blue flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6">🌸</div>
        <h1 className="text-4xl font-light text-foreground mb-4">
          Oops!
        </h1>
        <h2 className="text-xl text-muted-foreground mb-6">
          This page seems to have wandered off
        </h2>
        <p className="text-muted-foreground mb-8">
          Don't worry, let's get you back to a place where you can continue your well-being journey.
        </p>
        
        <div className="space-y-4">
          <Link
            to="/"
            className="
              inline-block bg-primary text-primary-foreground 
              px-6 py-3 rounded-2xl font-medium
              gentle-hover mood-transition
              shadow-lg hover:shadow-xl
            "
          >
            Take me home
          </Link>
          
          <div className="text-center">
            <Link
              to="/help"
              className="text-primary hover:text-primary/80 text-sm gentle-hover"
            >
              Need help? Contact us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
