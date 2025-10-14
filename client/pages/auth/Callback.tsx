import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { Leaf, Loader2 } from 'lucide-react';

const AuthCallback: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const errorParam = urlParams.get('error');
        const errorDescription = urlParams.get('error_description');

        if (errorParam) {
          setError(errorDescription || errorParam || 'Authentication failed');
          setLoading(false);
          return;
        }

        if (!code) {
          setError('No authorization code received');
          setLoading(false);
          return;
        }

        // Exchange the code for a session
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          console.error('Session exchange error:', error);
          setError(error.message || 'Failed to complete authentication');
        } else if (data?.user) {
          // Successfully authenticated
          console.log('Authentication successful:', data.user.email);
          
          // Check if user needs onboarding
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('assessment_completed')
            .eq('user_id', data.user.id)
            .single();
          
          if (profile?.assessment_completed) {
            navigate('/dashboard', { replace: true });
          } else {
            navigate('/onboarding', { replace: true });
          }
        } else {
          setError('Authentication completed but no user found');
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setError('An unexpected error occurred during authentication');
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black noise-texture flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
              <Leaf className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-light text-white mb-4">
            Completing Sign In
          </h1>
          <div className="flex items-center justify-center gap-2 text-white/70">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Please wait while we sign you in...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black noise-texture flex items-center justify-center">
        <div className="w-full max-w-md mx-4">
          <div className="glass-card rounded-3xl p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                <span className="text-red-400 text-2xl">⚠️</span>
              </div>
            </div>
            <h1 className="text-2xl font-light text-white mb-4">
              Authentication Failed
            </h1>
            <p className="text-white/70 mb-6">
              {error}
            </p>
            <button
              onClick={() => navigate('/login', { replace: true })}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 px-4 rounded-2xl font-medium transition-all duration-200 hover:from-emerald-600 hover:to-teal-700 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-transparent"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthCallback;