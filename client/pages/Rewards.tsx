import React from 'react';
import RewardCoupon from '../components/RewardCoupon';

interface RewardsProps {
  userPoints: number;
  onPointsUpdate: (points: number) => void;
}

const Rewards: React.FC<RewardsProps> = ({ userPoints, onPointsUpdate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-red-400">
      <div className="p-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-light text-white mb-4">
            Your Rewards
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Complete tasks to earn points and unlock amazing rewards that support your well-being journey
          </p>
        </div>

        {/* How It Works */}
        <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 mb-8 border border-white/30">
          <h2 className="text-2xl font-light text-white mb-6 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">📝</div>
              <h3 className="text-lg font-medium text-white mb-2">Complete Tasks</h3>
              <p className="text-sm text-white/80">
                Finish 70% or more of your daily tasks to earn reward points
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">⭐</div>
              <h3 className="text-lg font-medium text-white mb-2">Earn Points</h3>
              <p className="text-sm text-white/80">
                Get 5-15 points per day based on your completion rate and streaks
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🎁</div>
              <h3 className="text-lg font-medium text-white mb-2">Unlock Rewards</h3>
              <p className="text-sm text-white/80">
                Use your points to unlock coupons and special offers
              </p>
            </div>
          </div>
        </div>

        {/* Reward Coupons */}
        <RewardCoupon 
          userPoints={userPoints}
          onPointsUpdate={onPointsUpdate}
        />

        {/* Achievement Badges */}
        <div className="mt-12 bg-white/20 backdrop-blur-sm rounded-3xl p-8 border border-white/30">
          <h2 className="text-2xl font-light text-white mb-6 text-center">Achievement Badges</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🔥</span>
              </div>
              <h3 className="text-sm font-medium text-white mb-1">Week Warrior</h3>
              <p className="text-xs text-white/80">7-day streak</p>
            </div>
            <div className="text-center opacity-50">
              <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🌟</span>
              </div>
              <h3 className="text-sm font-medium text-white mb-1">Super Achiever</h3>
              <p className="text-xs text-white/80">100 tasks completed</p>
            </div>
            <div className="text-center opacity-50">
              <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-sm font-medium text-white mb-1">Champion</h3>
              <p className="text-xs text-white/80">30-day streak</p>
            </div>
            <div className="text-center opacity-50">
              <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="text-sm font-medium text-white mb-1">Diamond</h3>
              <p className="text-xs text-white/80">500 points earned</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rewards;
