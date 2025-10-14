import React, { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../Navbar'
import GoogleButton from './GoogleButton'

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isShaking, setIsShaking] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [mounted, setMounted] = useState(false)
  const cardRef = useRef(null)
  const navigate = useNavigate()

  // Check for reduced motion preference and mount animations
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const handleChange = (e) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    
    // Trigger mount animation
    const timer = setTimeout(() => {
      setMounted(true)
    }, 50)
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
      clearTimeout(timer)
    }
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Clear errors when user starts typing
    if (error) {
      setError('')
      setIsShaking(false)
    }
  }

  const triggerShake = () => {
    if (!prefersReducedMotion) {
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 600)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        setError(error.message)
        triggerShake()
      } else if (data.user) {
        // Show success state briefly before navigation
        setSuccess(true)
        setTimeout(() => {
          // Let the app routing handle onboarding redirect
          navigate('/dashboard')
        }, 1000)
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      triggerShake()
      console.error('Login error:', err)
    } finally {
      if (!success) {
        setLoading(false)
      }
    }
  }

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
      
      <Navbar />
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center pt-20 pb-8 px-4">
        <div 
          ref={cardRef}
          className={`w-full max-w-[420px] transform transition-all duration-300 ease-out ${
            mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
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
                Welcome Back
              </h1>
              <p className="text-gray-600 text-[0.95rem] leading-relaxed">
                Sign in to continue your wellness journey
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div className="relative">
                <label htmlFor="email" className="block text-[0.95rem] font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                    <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
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
                    placeholder="Enter your email"
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
                    <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
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
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-0 rounded"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div 
                  id="error-message"
                  role="alert"
                  aria-live="polite"
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-3"
                >
                  <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || success}
                className={`w-full h-12 relative overflow-hidden rounded-xl font-semibold transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 group ${
                  success 
                    ? 'bg-green-500 text-white'
                    : loading 
                    ? 'bg-purple-400 text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-violet-500 text-white hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0'
                }`}
              >
                {/* Inner highlight */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative flex items-center justify-center gap-3">
                  {success ? (
                    <>
                      <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Success!</span>
                    </>
                  ) : loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Signing you in...</span>
                    </>
                  ) : (
                    <span>Sign In</span>
                  )}
                </div>
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/80 text-gray-500 font-light">or continue with</span>
              </div>
            </div>

            {/* Google OAuth Button */}
            <GoogleButton 
              disabled={loading || success} 
              onError={(error) => {
                setError(error)
                triggerShake()
              }} 
            />

            {/* Footer Actions */}
            <div className="mt-6 space-y-4">
              {/* Forgot Password */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={async () => {
                    if (!formData.email) {
                      setError('Please enter your email address first')
                      triggerShake()
                      return
                    }
                    try {
                      const { error } = await supabase.auth.resetPasswordForEmail(
                        formData.email,
                        {
                          redirectTo: `${window.location.origin}/auth/update-password`
                        }
                      )
                      if (error) {
                        setError(error.message)
                        triggerShake()
                      } else {
                        setError('')
                        alert('Password reset email sent! Check your inbox.')
                      }
                    } catch (err) {
                      setError('Failed to send reset email')
                      triggerShake()
                    }
                  }}
                  className="text-purple-600 text-sm hover:text-purple-700 transition-colors hover:underline focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 rounded px-1 py-0.5"
                >
                  🔑 Forgot your password?
                </button>
              </div>

              {/* Sign Up Link */}
              <div className="text-center">
                <span className="text-gray-600 text-sm leading-relaxed">
                  Don't have an account?{' '}
                  <Link 
                    to="/signup" 
                    className="text-purple-600 hover:text-purple-700 transition-colors font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 rounded px-1 py-0.5"
                  >
                    Create one now
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginForm