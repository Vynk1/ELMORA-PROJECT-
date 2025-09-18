import React, { useState, useCallback } from 'react';
import TodoList from '../components/TodoList';
import { useTaskContext } from '../contexts/TaskContext';
import { type MoodType } from '../components/MoodColorSwitcher';

interface TasksProps {
  currentMood: MoodType;
  userPoints: number;
  onPointsUpdate: (points: number) => void;
}

const Tasks: React.FC<TasksProps> = ({ currentMood, userPoints, onPointsUpdate }) => {
  const { addTodo, todos } = useTaskContext();
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('daily');

  const getMoodColors = () => {
    switch (currentMood) {
      case 'sad':
        return {
          bg: "from-gray-800 via-slate-700 to-gray-900",
          cardBg: "bg-gray-800/50",
          textColor: "text-gray-100"
        };
      case 'mid':
        return {
          bg: "from-amber-400 via-yellow-400 to-orange-400",
          cardBg: "bg-amber-100/70",
          textColor: "text-amber-900"
        };
      case 'amazing':
        return {
          bg: "from-emerald-400 via-teal-400 to-cyan-400",
          cardBg: "bg-emerald-100/70",
          textColor: "text-emerald-900"
        };
    }
  };

  const colors = getMoodColors();

  const categories = [
    { id: 'daily', name: 'Daily Tasks', icon: '📅' },
    { id: 'wellness', name: 'Wellness', icon: '🧘' },
    { id: 'social', name: 'Social', icon: '👥' },
    { id: 'learning', name: 'Learning', icon: '📚' },
    { id: 'creative', name: 'Creative', icon: '🎨' },
  ];

  const handleTaskCompletion = useCallback((percentage: number) => {
    setCompletionPercentage(percentage);

    if (percentage >= 70) {
      const bonusPoints = Math.floor(percentage / 10) * 3;
      onPointsUpdate(userPoints + bonusPoints);
    }
  }, [userPoints, onPointsUpdate]);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors.bg}`}>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-4xl font-light mb-4 ${colors.textColor}`}>
            My Tasks
          </h1>
          <p className={`text-lg ${colors.textColor} opacity-90`}>
            Organize your day and build positive habits
          </p>
        </div>

        {/* Category Tabs */}
        <div className="mb-8">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`
                  flex items-center space-x-2 px-6 py-3 rounded-2xl font-medium transition-colors whitespace-nowrap
                  ${selectedCategory === category.id
                    ? `${colors.cardBg} ${colors.textColor} border border-white/30`
                    : `bg-white/20 ${colors.textColor} hover:bg-white/30`
                  }
                `}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className={`${colors.cardBg} backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20`}>
            <div className={`text-2xl font-bold ${colors.textColor} mb-1`}>
              {completionPercentage}%
            </div>
            <div className={`text-xs ${colors.textColor} opacity-80`}>
              Completed Today
            </div>
          </div>

          <div className={`${colors.cardBg} backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20`}>
            <div className={`text-2xl font-bold ${colors.textColor} mb-1`}>
              {todos.filter(todo => !todo.completed).length}
            </div>
            <div className={`text-xs ${colors.textColor} opacity-80`}>
              Tasks Remaining
            </div>
          </div>

          <div className={`${colors.cardBg} backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20`}>
            <div className={`text-2xl font-bold ${colors.textColor} mb-1`}>
              15
            </div>
            <div className={`text-xs ${colors.textColor} opacity-80`}>
              Points Earned
            </div>
          </div>

          <div className={`${colors.cardBg} backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20`}>
            <div className={`text-2xl font-bold ${colors.textColor} mb-1`}>
              3
            </div>
            <div className={`text-xs ${colors.textColor} opacity-80`}>
              Streak Days
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Task List */}
          <div className="lg:col-span-3">
            <TodoList onCompletionChange={handleTaskCompletion} />
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Task Templates */}
            <div className={`${colors.cardBg} backdrop-blur-sm rounded-3xl p-6 border border-white/20`}>
              <h3 className={`text-lg font-medium ${colors.textColor} mb-4`}>
                Quick Add
              </h3>
              <div className="space-y-3">
                <button 
                  onClick={() => addTodo('Take a 10-minute walk 🚶', 'wellness')}
                  className={`w-full text-left p-3 rounded-xl hover:bg-white/20 transition-colors flex items-center space-x-3 ${colors.textColor} text-sm`}
                >
                  <span>🚶</span>
                  <span>Take a 10-min walk</span>
                </button>
                <button 
                  onClick={() => addTodo('Drink a glass of water 💧', 'wellness')}
                  className={`w-full text-left p-3 rounded-xl hover:bg-white/20 transition-colors flex items-center space-x-3 ${colors.textColor} text-sm`}
                >
                  <span>💧</span>
                  <span>Drink a glass of water</span>
                </button>
                <button 
                  onClick={() => addTodo('Call a friend or family member 📞', 'social')}
                  className={`w-full text-left p-3 rounded-xl hover:bg-white/20 transition-colors flex items-center space-x-3 ${colors.textColor} text-sm`}
                >
                  <span>📞</span>
                  <span>Call a friend or family</span>
                </button>
                <button 
                  onClick={() => addTodo('Write 3 things I\'m grateful for 📝', 'wellness')}
                  className={`w-full text-left p-3 rounded-xl hover:bg-white/20 transition-colors flex items-center space-x-3 ${colors.textColor} text-sm`}
                >
                  <span>📝</span>
                  <span>Write 3 gratitudes</span>
                </button>
                <button 
                  onClick={() => addTodo('Do 5 minutes of meditation 🧘', 'wellness')}
                  className={`w-full text-left p-3 rounded-xl hover:bg-white/20 transition-colors flex items-center space-x-3 ${colors.textColor} text-sm`}
                >
                  <span>🧘</span>
                  <span>5-minute meditation</span>
                </button>
              </div>
            </div>

            {/* Weekly Goal */}
            <div className={`${colors.cardBg} backdrop-blur-sm rounded-3xl p-6 text-center border border-white/20`}>
              <h3 className={`font-medium ${colors.textColor} mb-3`}>
                Weekly Goal
              </h3>
              <div className="text-3xl mb-2">🎯</div>
              <p className={`text-sm ${colors.textColor} opacity-90 mb-4`}>
                Complete 70% of tasks for 5 days
              </p>
              <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-500"
                  style={{ width: '60%' }}
                />
              </div>
              <p className={`text-xs ${colors.textColor} opacity-80`}>
                3 of 5 days completed
              </p>
            </div>

            {/* Reward Preview */}
            <div className={`${colors.cardBg} backdrop-blur-sm rounded-3xl p-6 text-center border border-white/20`}>
              <h3 className={`font-medium ${colors.textColor} mb-3`}>
                Next Reward
              </h3>
              <div className="text-3xl mb-2">🎁</div>
              <p className={`text-sm ${colors.textColor} opacity-90 mb-2`}>
                Coffee Shop BOGO
              </p>
              <p className={`text-xs ${colors.textColor} opacity-80`}>
                {Math.max(0, 100 - userPoints)} more points needed
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
