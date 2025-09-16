import React from 'react';

interface ProgressData {
  dailyCompletion: number[];
  weeklyStats: {
    tasksCompleted: number;
    pointsEarned: number;
    streakDays: number;
    moodBreakdown: { [key: string]: number };
  };
  monthlyGoals: {
    tasksTarget: number;
    tasksCompleted: number;
    pointsTarget: number;
    pointsEarned: number;
  };
}

interface ViewProgressProps {
  isOpen: boolean;
  onClose: () => void;
  progressData?: ProgressData;
}

const ViewProgress: React.FC<ViewProgressProps> = ({ isOpen, onClose, progressData }) => {
  // Default data if none provided
  const defaultData: ProgressData = {
    dailyCompletion: [85, 92, 78, 95, 88, 100, 76], // Last 7 days
    weeklyStats: {
      tasksCompleted: 42,
      pointsEarned: 156,
      streakDays: 3,
      moodBreakdown: { amazing: 3, mid: 3, sad: 1 }
    },
    monthlyGoals: {
      tasksTarget: 180,
      tasksCompleted: 98,
      pointsTarget: 500,
      pointsEarned: 287
    }
  };

  const data = progressData || defaultData;
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-light text-gray-800 mb-2">Your Progress</h2>
          <p className="text-gray-600">See how you're doing on your well-being journey</p>
        </div>

        {/* Daily Completion Chart */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Daily Completion - Last 7 Days</h3>
          <div className="flex items-end justify-between h-32 bg-gray-50 rounded-2xl p-4">
            {data.dailyCompletion.map((completion, index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <div 
                  className="bg-primary rounded-t-lg w-8 transition-all duration-500"
                  style={{ height: `${(completion / 100) * 80}px` }}
                  title={`${completion}% completed`}
                />
                <span className="text-xs text-gray-600">{days[index]}</span>
                <span className="text-xs font-medium text-gray-800">{completion}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Stats */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-800 mb-4">This Week's Highlights</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {data.weeklyStats.tasksCompleted}
              </div>
              <div className="text-xs text-blue-800">Tasks Completed</div>
            </div>
            <div className="bg-green-50 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {data.weeklyStats.pointsEarned}
              </div>
              <div className="text-xs text-green-800">Points Earned</div>
            </div>
            <div className="bg-orange-50 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {data.weeklyStats.streakDays}
              </div>
              <div className="text-xs text-orange-800">Streak Days</div>
            </div>
            <div className="bg-purple-50 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {Math.round((data.weeklyStats.tasksCompleted / 49) * 100)}%
              </div>
              <div className="text-xs text-purple-800">Weekly Rate</div>
            </div>
          </div>
        </div>

        {/* Mood Breakdown */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Mood This Week</h3>
          <div className="flex space-x-2">
            <div className="flex-1 bg-green-200 rounded-full h-4 flex items-center justify-center">
              <span className="text-xs font-medium text-green-800">
                Amazing ({data.weeklyStats.moodBreakdown.amazing} days)
              </span>
            </div>
            <div className="flex-1 bg-yellow-200 rounded-full h-4 flex items-center justify-center">
              <span className="text-xs font-medium text-yellow-800">
                Mid ({data.weeklyStats.moodBreakdown.mid} days)
              </span>
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-4 flex items-center justify-center">
              <span className="text-xs font-medium text-gray-800">
                Sad ({data.weeklyStats.moodBreakdown.sad} days)
              </span>
            </div>
          </div>
        </div>

        {/* Monthly Goals */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Monthly Goals Progress</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Tasks Completed</span>
                <span>{data.monthlyGoals.tasksCompleted} / {data.monthlyGoals.tasksTarget}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((data.monthlyGoals.tasksCompleted / data.monthlyGoals.tasksTarget) * 100, 100)}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Points Earned</span>
                <span>{data.monthlyGoals.pointsEarned} / {data.monthlyGoals.pointsTarget}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((data.monthlyGoals.pointsEarned / data.monthlyGoals.pointsTarget) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
          <h4 className="font-medium text-gray-800 mb-2">💡 Insights</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• You're most productive on Thursdays and Fridays</li>
            <li>• Your streak improved by 2 days this week</li>
            <li>• You're 57% toward your monthly goals - great progress!</li>
          </ul>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3 px-4 bg-primary text-white rounded-2xl font-medium hover:bg-primary/90 transition-colors"
        >
          Got it!
        </button>
      </div>
    </div>
  );
};

export default ViewProgress;
