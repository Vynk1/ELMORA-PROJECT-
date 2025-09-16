import React, { useState } from 'react';

interface Coupon {
  id: string;
  title: string;
  description: string;
  discount: string;
  code: string;
  expiryDate: string;
  isUnlocked: boolean;
  pointsRequired: number;
}

interface RewardCouponProps {
  userPoints: number;
  onPointsUpdate: (points: number) => void;
}

const RewardCoupon: React.FC<RewardCouponProps> = ({ userPoints, onPointsUpdate }) => {
  const [showCelebration, setShowCelebration] = useState(false);
  const [unlockedCoupon, setUnlockedCoupon] = useState<Coupon | null>(null);

  const coupons: Coupon[] = [
    {
      id: '1',
      title: 'Mindfulness App Subscription',
      description: 'Get 3 months free on premium meditation apps',
      discount: '3 Months Free',
      code: 'ELMORA3FREE',
      expiryDate: '2024-12-31',
      isUnlocked: userPoints >= 50,
      pointsRequired: 50
    },
    {
      id: '2',
      title: 'Local Coffee Shop',
      description: 'Buy one get one free at participating locations',
      discount: 'BOGO',
      code: 'ELMORACOFFEE',
      expiryDate: '2024-12-31',
      isUnlocked: userPoints >= 100,
      pointsRequired: 100
    },
    {
      id: '3',
      title: 'Wellness Retreat Weekend',
      description: '20% off weekend wellness retreats',
      discount: '20% OFF',
      code: 'WELLELMORA20',
      expiryDate: '2024-12-31',
      isUnlocked: userPoints >= 200,
      pointsRequired: 200
    },
    {
      id: '4',
      title: 'Bookstore Voucher',
      description: '$25 voucher for self-help and wellness books',
      discount: '$25 OFF',
      code: 'READELMORA25',
      expiryDate: '2024-12-31',
      isUnlocked: userPoints >= 150,
      pointsRequired: 150
    },
    {
      id: '5',
      title: 'Fitness Class Pass',
      description: 'One month unlimited yoga and fitness classes',
      discount: '1 Month Free',
      code: 'FITELMORA1M',
      expiryDate: '2024-12-31',
      isUnlocked: userPoints >= 300,
      pointsRequired: 300
    },
    {
      id: '6',
      title: 'Therapy Session Discount',
      description: '30% off your first therapy session',
      discount: '30% OFF',
      code: 'THERAPYELMORA',
      expiryDate: '2024-12-31',
      isUnlocked: userPoints >= 250,
      pointsRequired: 250
    }
  ];

  const unlockCoupon = (coupon: Coupon) => {
    if (userPoints >= coupon.pointsRequired) {
      onPointsUpdate(userPoints - coupon.pointsRequired);
      setUnlockedCoupon(coupon);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  };

  const CelebrationAnimation = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center animate-bounce">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Congratulations!</h2>
        <p className="text-gray-600 mb-4">You've unlocked a new reward!</p>
        <div className="bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-2xl p-4 text-white">
          <h3 className="font-bold">{unlockedCoupon?.title}</h3>
          <p className="text-sm opacity-90">{unlockedCoupon?.discount}</p>
        </div>
        <button
          onClick={() => setShowCelebration(false)}
          className="mt-4 px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary/90"
        >
          Awesome!
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {showCelebration && <CelebrationAnimation />}
      
      {/* Points Display */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-6 text-white text-center">
        <h2 className="text-2xl font-light mb-2">Your Reward Points</h2>
        <div className="text-4xl font-bold mb-2">{userPoints}</div>
        <p className="text-sm opacity-90">Keep completing tasks to earn more!</p>
      </div>

      {/* Coupons Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((coupon) => (
          <div
            key={coupon.id}
            className={`
              relative overflow-hidden rounded-3xl border-2 transition-all duration-300
              ${coupon.isUnlocked 
                ? 'bg-white border-emerald-200 shadow-lg hover:shadow-xl' 
                : 'bg-gray-100 border-gray-200 opacity-60'
              }
            `}
          >
            {/* Unlocked/Locked Overlay */}
            {!coupon.isUnlocked && (
              <div className="absolute inset-0 bg-gray-400/50 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="text-center text-white">
                  <div className="text-3xl mb-2">🔒</div>
                  <p className="text-sm font-medium">
                    {coupon.pointsRequired - userPoints} more points needed
                  </p>
                </div>
              </div>
            )}

            <div className="p-6">
              {/* Discount Badge */}
              <div className={`
                inline-block px-3 py-1 rounded-full text-xs font-bold mb-4
                ${coupon.isUnlocked 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-gray-400 text-gray-600'
                }
              `}>
                {coupon.discount}
              </div>

              <h3 className={`text-lg font-bold mb-2 ${coupon.isUnlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                {coupon.title}
              </h3>

              <p className={`text-sm mb-4 ${coupon.isUnlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                {coupon.description}
              </p>

              {coupon.isUnlocked && (
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="text-xs text-gray-500 mb-1">Coupon Code:</div>
                    <div className="font-mono text-sm font-bold text-gray-800">{coupon.code}</div>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Expires: {coupon.expiryDate}
                  </div>

                  <button className="w-full bg-primary text-white py-2 rounded-xl font-medium hover:bg-primary/90 transition-colors">
                    Use Coupon
                  </button>
                </div>
              )}

              {!coupon.isUnlocked && (
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-2">
                    Requires {coupon.pointsRequired} points
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.min((userPoints / coupon.pointsRequired) * 100, 100)}%` 
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RewardCoupon;
