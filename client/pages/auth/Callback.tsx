import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { Leaf, Loader2 } from 'lucide-react';

const AuthCallback: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    let timeoutId: ReturnType<typeof setTimeout>;

    const handleAuthCallback = async () => {
      try {
        // Wait for Supabase to process the OAuth hash fragment
        // The SDK automatically handles this in the background
        timeoutId = setTimeout(async () => {
          if (!mounted) return;

          const { data: { session }, error: sessionError } = await supabase.auth.getSession();

          if (!mounted) return;

          if (sessionError) {
            console.error('Session error:', sessionError);
            setError(sessionError.message || 'Failed to get session');
            setLoading(false);
            return;
          }

          if (!session || !session.user) {
            setError('Authentication failed - no session established');
            setLoading(false);
            return;
          }

          const user = session.user;
          console.log('Authentication successful:', user.email);
            
          // Check if user needs onboarding
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('assessment_completed')
            .eq('user_id', user.id)
            .single();
          
          if (!mounted) return;

          if (profileError) {
            console.error('Profile error:', profileError);
            // Profile might not exist yet, redirect to onboarding
            navigate('/onboarding', { replace: true });
            return;
          }
          
          if (profile?.assessment_completed) {
            navigate('/dashboard', { replace: true });
          } else {
            navigate('/onboarding', { replace: true });
          }
        }, 1500); // Give Supabase time to process the OAuth callback

      } catch (err) {
        console.error('Auth callback error:', err);
        if (mounted) {
          setError('An unexpected error occurred during authentication');
          setLoading(false);
        }
      }
    };

    handleAuthCallback();

    return () => {
      mounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
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