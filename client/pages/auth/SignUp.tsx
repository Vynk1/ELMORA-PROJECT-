import React, { useState, useEffect, useRef } from 'react';
import { signUpWithEmail } from '../../lib/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { validateEmail, validatePasswordStrength, validateConfirmPassword, getPasswordStrengthLevel } from '../../lib/validateAuth';
import GoogleButton from '../../components/auth/GoogleButton';

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong'>('weak');
  const cardRef = useRef(null);
  const navigate = useNavigate();

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Update password strength
  useEffect(() => {
    if (formData.password) {
      setPasswordStrength(getPasswordStrengthLevel(formData.password));
    }
  }, [formData.password]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear errors when user starts typing
    if (error) {
      setError('');
      setIsShaking(false);
    }
  };

  const triggerShake = () => {
    if (!prefersReducedMotion) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate email
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      setError(emailValidation.error!);
      triggerShake();
      return;
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(formData.password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.error!);
      triggerShake();
      return;
    }

    // Validate password confirmation
    const confirmValidation = validateConfirmPassword(formData.password, formData.confirmPassword);
    if (!confirmValidation.isValid) {
      setError(confirmValidation.error!);
      triggerShake();
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await signUpWithEmail(formData.email, formData.password);

      if (error) {
        setError(error.message || 'Failed to create account');
        triggerShake();
      } else if (data.user) {
        // Check if email confirmation is required
        if (!data.session) {
          // Email confirmation required
          setError('');
          alert('Please check your email for a confirmation link before signing in.');
          navigate('/login');
        } else {
          // Immediate login (no email confirmation required)
          // Let the app routing handle onboarding redirect
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
      triggerShake();
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = (error: string) => {
    setError(error);
    triggerShake();
  };

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'strong': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStrengthWidth = () => {
    switch (passwordStrength) {
      case 'weak': return 'w-1/3';
      case 'medium': return 'w-2/3';
      case 'strong': return 'w-full';
      default: return 'w-0';
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Premium gradient background with noise texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-violet-800 to-purple-600 opacity-90">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E")`,
          backgroundSize: '256px 256px'
        }} />
      </div>
      
      {/* Floating orbs with slow parallax */}
      {!prefersReducedMotion && (
        <>
          <div className="absolute top-1/4 -left-20 w-80 h-80 bg-gradient-to-br from-violet-400/25 to-purple-300/20 rounded-full blur-[80px] animate-float" />
          <div className="absolute bottom-1/3 -right-32 w-96 h-96 bg-gradient-to-br from-lavender-400/30 to-violet-400/25 rounded-full blur-[80px] animate-float animation-delay-3000" />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-br from-purple-300/20 to-violet-300/15 rounded-full blur-[60px] animate-float animation-delay-6000" />
        </>
      )}
      
      {/* Top Navigation */}
      <nav className="relative z-20 p-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌸</span>
          <span className="bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent text-xl font-semibold tracking-wide">Elmora</span>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            to="/" 
            className="text-white/80 hover:text-white transition-colors text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-white/10"
          >
            🏠 Home
          </Link>
          <Link 
            to="/login" 
            className="text-white/80 hover:text-white transition-colors text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-white/10"
          >
            🔑 Login
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center pt-20 pb-8 px-4">
        <div 
          ref={cardRef}
          className={`w-full max-w-[440px] transform transition-all duration-300 ease-out ${
            !isShaking ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          } ${isShaking ? 'animate-shake' : ''}`}
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/40 relative">
            {/* Subtle inner border */}
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20 pointer-events-none" />
            
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-block mb-4">
                <span className="text-3xl animate-bounce" style={{ animationDuration: '2s' }}>🌸</span>
              </div>
              <h1 className="font-serif text-3xl font-light text-gray-900 mb-2 leading-tight tracking-tight">
                Welcome to Elmora
              </h1>
              <p className="text-gray-600 text-[0.95rem] leading-relaxed">
                Create your account to start growing
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <div className="relative">
                <label htmlFor="name" className="block text-[0.95rem] font-medium text-gray-700 mb-2">
                  Full Name (Optional)
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                    <User className="w-5 h-5 text-purple-500" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/70 border border-gray-200 text-gray-900 placeholder-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-0 focus:border-purple-400 focus:shadow-sm hover:border-gray-300"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="relative">
                <label htmlFor="email" className="block text-[0.95rem] font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                    <Mail className="w-5 h-5 text-purple-500" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    aria-describedby={error ? 'error-message' : undefined}
                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/70 border border-gray-200 text-gray-900 placeholder-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-0 focus:border-purple-400 focus:shadow-sm hover:border-gray-300"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="relative">
                <label htmlFor="password" className="block text-[0.95rem] font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                    <Lock className="w-5 h-5 text-purple-500" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    aria-describedby={error ? 'error-message' : undefined}
                    className="w-full h-12 pl-12 pr-12 rounded-xl bg-white/70 border border-gray-200 text-gray-900 placeholder-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-0 focus:border-purple-400 focus:shadow-sm hover:border-gray-300"
                    placeholder="Create a secure password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-0 rounded"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Password strength</span>
                    <span className={`text-sm capitalize font-medium ${
                      passwordStrength === 'weak' ? 'text-red-500' : 
                      passwordStrength === 'medium' ? 'text-yellow-500' : 'text-green-500'
                    }`}>
                      {passwordStrength}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full ${getStrengthColor()} ${getStrengthWidth()} transition-all duration-300`} />
                  </div>
                </div>
              )}

              {/* Confirm Password Field */}
              <div className="relative">
                <label htmlFor="confirmPassword" className="block text-[0.95rem] font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                    <Lock className="w-5 h-5 text-purple-500" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    aria-describedby={error ? 'error-message' : undefined}
                    className="w-full h-12 pl-12 pr-12 rounded-xl bg-white/70 border border-gray-200 text-gray-900 placeholder-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-0 focus:border-purple-400 focus:shadow-sm hover:border-gray-300"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-0 rounded"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div id="error-message" className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl text-sm" role="alert" aria-live="polite">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl transition-all duration-200 hover:from-purple-600 hover:to-pink-600 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-lg"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>✨ Sign Up</>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="px-4 text-gray-500 text-sm">or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Google Button */}
            <GoogleButton onError={handleGoogleError} disabled={loading} />

            {/* Footer Actions */}
            <div className="mt-8 space-y-4">
              {/* Sign In Link */}
              <div className="text-center">
                <p className="text-gray-600 text-sm">
                  Already have an account?{' '}
                  <Link 
                    to="/login"
                    className="text-purple-600 hover:text-purple-700 font-medium underline transition-colors"
                  >
                    Sign In
                  </Link>
                </p>
              </div>

              {/* Terms */}
              <p className="text-gray-500 text-xs text-center leading-relaxed">
                By creating an account, you agree to our{' '}
                <Link to="/terms" className="text-purple-600 hover:text-purple-700 underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-purple-600 hover:text-purple-700 underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;