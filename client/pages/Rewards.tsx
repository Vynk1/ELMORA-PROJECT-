import React, { useState, useEffect, lazy, Suspense } from 'react';
import RewardCoupon from '../components/RewardCoupon';
import { CheckCircle2, Star, Gift, Flame, Trophy, Gem } from 'lucide-react';

// Lazy load effect components
const CountUp = lazy(() => import('../components/effects/CountUp'));
const ScrollReveal = lazy(() => import('../components/effects/ScrollReveal'));

interface RewardsProps {
  userPoints: number;
  onPointsUpdate: (points: number) => void;
}

const Rewards: React.FC<RewardsProps> = ({ userPoints, onPointsUpdate }) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMotionChange);
    
    return () => mediaQuery.removeEventListener('change', handleMotionChange);
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-red-400">
      <div className="p-8">
        {/* Enhanced Header with Points Display */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-light text-white mb-4">
            Your Rewards
          </h1>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-6 inline-block relative">
            {/* Spline Gift Box Placeholder */}
            <div 
              id="spline-reward-placeholder" 
              data-spline="gift-box"
              className="absolute -top-4 -right-4 w-12 h-12 pointer-events-none opacity-60"
            >
              {/* Reserved slot for Spline 3D gift box */}
            </div>
            
            <div className="text-3xl font-bold text-white mb-2" aria-live="polite">
              <Suspense fallback={userPoints}>
                <CountUp 
                  end={userPoints} 
                  duration={1200} 
                  disabled={prefersReducedMotion}
                />
              </Suspense>
              <span className="text-lg ml-2 opacity-90">points</span>
            </div>
            <div className="text-sm text-white/80">Available to spend</div>
          </div>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Complete tasks to earn points and unlock amazing rewards that support your well-being journey
          </p>
        </div>

        {/* Enhanced How It Works */}
        <Suspense fallback={
          <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 mb-8 border border-white/30">
            <h2 className="text-2xl font-light text-white mb-6 text-center">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-white" strokeWidth={2} />
                <h3 className="text-lg font-medium text-white mb-2">Complete Tasks</h3>
                <p className="text-sm text-white/80">
                  Finish 70% or more of your daily tasks to earn reward points
                </p>
              </div>
              <div className="text-center">
                <Star className="w-12 h-12 mx-auto mb-3 text-white" strokeWidth={2} />
                <h3 className="text-lg font-medium text-white mb-2">Earn Points</h3>
                <p className="text-sm text-white/80">
                  Get 5-15 points per day based on your completion rate and streaks
                </p>
              </div>
              <div className="text-center">
                <Gift className="w-12 h-12 mx-auto mb-3 text-white" strokeWidth={2} />
                <h3 className="text-lg font-medium text-white mb-2">Unlock Rewards</h3>
                <p className="text-sm text-white/80">
                  Use your points to unlock coupons and special offers
                </p>
              </div>
            </div>
          </div>
        }>
          <ScrollReveal duration={0.6} delay={0.2} disabled={prefersReducedMotion}>
            <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 mb-8 border border-white/30">
              <h2 className="text-2xl font-light text-white mb-6 text-center">How It Works</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <ScrollReveal duration={0.5} delay={0.3} disabled={prefersReducedMotion}>
                  <div className="text-center">
                    <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-white" strokeWidth={2} />
                    <h3 className="text-lg font-medium text-white mb-2">Complete Tasks</h3>
                    <p className="text-sm text-white/80">
                      Finish 70% or more of your daily tasks to earn reward points
                    </p>
                  </div>
                </ScrollReveal>
                <ScrollReveal duration={0.5} delay={0.4} disabled={prefersReducedMotion}>
                  <div className="text-center">
                    <Star className="w-12 h-12 mx-auto mb-3 text-white" strokeWidth={2} />
                    <h3 className="text-lg font-medium text-white mb-2">Earn Points</h3>
                    <p className="text-sm text-white/80">
                      Get 5-15 points per day based on your completion rate and streaks
                    </p>
                  </div>
                </ScrollReveal>
                <ScrollReveal duration={0.5} delay={0.5} disabled={prefersReducedMotion}>
                  <div className="text-center">
                    <Gift className="w-12 h-12 mx-auto mb-3 text-white" strokeWidth={2} />
                    <h3 className="text-lg font-medium text-white mb-2">Unlock Rewards</h3>
                    <p className="text-sm text-white/80">
                      Use your points to unlock coupons and special offers
                    </p>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </ScrollReveal>
        </Suspense>

        {/* Reward Coupons */}
        <RewardCoupon 
          userPoints={userPoints}
          onPointsUpdate={onPointsUpdate}
        />

        {/* Enhanced Achievement Badges */}
        <Suspense fallback={
          <div className="mt-12 bg-white/20 backdrop-blur-sm rounded-3xl p-8 border border-white/30">
            <h2 className="text-2xl font-light text-white mb-6 text-center">Achievement Badges</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Flame className="w-8 h-8 text-white" strokeWidth={2} />
                </div>
                <h3 className="text-sm font-medium text-white mb-1">Week Warrior</h3>
                <p className="text-xs text-white/80">7-day streak</p>
              </div>
              <div className="text-center opacity-50">
                <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-8 h-8 text-white" strokeWidth={2} />
                </div>
                <h3 className="text-sm font-medium text-white mb-1">Super Achiever</h3>
                <p className="text-xs text-white/80">100 tasks completed</p>
              </div>
              <div className="text-center opacity-50">
                <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Trophy className="w-8 h-8 text-white" strokeWidth={2} />
                </div>
                <h3 className="text-sm font-medium text-white mb-1">Champion</h3>
                <p className="text-xs text-white/80">30-day streak</p>
              </div>
              <div className="text-center opacity-50">
                <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Gem className="w-8 h-8 text-white" strokeWidth={2} />
                </div>
                <h3 className="text-sm font-medium text-white mb-1">Diamond</h3>
                <p className="text-xs text-white/80">500 points earned</p>
              </div>
            </div>
          </div>
        }>
          <ScrollReveal duration={0.6} delay={0.4} disabled={prefersReducedMotion}>
            <div className="mt-12 bg-white/20 backdrop-blur-sm rounded-3xl p-8 border border-white/30">
              <h2 className="text-2xl font-light text-white mb-6 text-center">Achievement Badges</h2>
              <div className="grid md:grid-cols-4 gap-6">
                <ScrollReveal duration={0.4} delay={0.6} disabled={prefersReducedMotion}>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Flame className="w-8 h-8 text-white" strokeWidth={2} />
                    </div>
                    <h3 className="text-sm font-medium text-white mb-1">Week Warrior</h3>
                    <p className="text-xs text-white/80">7-day streak</p>
                  </div>
                </ScrollReveal>
                <ScrollReveal duration={0.4} delay={0.7} disabled={prefersReducedMotion}>
                  <div className="text-center opacity-50">
                    <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Star className="w-8 h-8 text-white" strokeWidth={2} />
                    </div>
                    <h3 className="text-sm font-medium text-white mb-1">Super Achiever</h3>
                    <p className="text-xs text-white/80">100 tasks completed</p>
                  </div>
                </ScrollReveal>
                <ScrollReveal duration={0.4} delay={0.8} disabled={prefersReducedMotion}>
                  <div className="text-center opacity-50">
                    <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Trophy className="w-8 h-8 text-white" strokeWidth={2} />
                    </div>
                    <h3 className="text-sm font-medium text-white mb-1">Champion</h3>
                    <p className="text-xs text-white/80">30-day streak</p>
                  </div>
                </ScrollReveal>
                <ScrollReveal duration={0.4} delay={0.9} disabled={prefersReducedMotion}>
                  <div className="text-center opacity-50">
                    <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Gem className="w-8 h-8 text-white" strokeWidth={2} />
                    </div>
                    <h3 className="text-sm font-medium text-white mb-1">Diamond</h3>
                    <p className="text-xs text-white/80">500 points earned</p>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </ScrollReveal>
        </Suspense>
      </div>
    </div>
  );
};

export default Rewards;
