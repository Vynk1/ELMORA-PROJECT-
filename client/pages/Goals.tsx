import React, { useState } from 'react';

interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'wellness' | 'productivity' | 'social' | 'learning' | 'creative';
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  isCompleted: boolean;
}

const Goals: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Daily Meditation Streak',
      description: 'Meditate for at least 10 minutes every day',
      category: 'wellness',
      targetValue: 30,
      currentValue: 12,
      unit: 'days',
      deadline: '2024-02-15',
      priority: 'high',
      isCompleted: false
    },
    {
      id: '2',
      title: 'Connect with Friends',
      description: 'Reach out to friends and family regularly',
      category: 'social',
      targetValue: 20,
      currentValue: 8,
      unit: 'conversations',
      deadline: '2024-01-31',
      priority: 'medium',
      isCompleted: false
    },
    {
      id: '3',
      title: 'Complete Tasks Consistently',
      description: 'Achieve 70% task completion for consecutive days',
      category: 'productivity',
      targetValue: 14,
      currentValue: 14,
      unit: 'days',
      deadline: '2024-01-20',
      priority: 'high',
      isCompleted: true
    },
    {
      id: '4',
      title: 'Learn Something New',
      description: 'Spend time learning a new skill or hobby',
      category: 'learning',
      targetValue: 15,
      currentValue: 5,
      unit: 'hours',
      deadline: '2024-02-01',
      priority: 'medium',
      isCompleted: false
    }
  ]);

  const categories = [
    { id: 'all', name: 'All Goals', icon: '🎯', color: 'bg-gray-100' },
    { id: 'wellness', name: 'Wellness', icon: '🧘', color: 'bg-green-100' },
    { id: 'productivity', name: 'Productivity', icon: '⚡', color: 'bg-blue-100' },
    { id: 'social', name: 'Social', icon: '👥', color: 'bg-purple-100' },
    { id: 'learning', name: 'Learning', icon: '📚', color: 'bg-yellow-100' },
    { id: 'creative', name: 'Creative', icon: '🎨', color: 'bg-pink-100' }
  ];

  const filteredGoals = selectedCategory === 'all' 
    ? goals 
    : goals.filter(goal => goal.category === selectedCategory);

  const updateGoalProgress = (goalId: string, increment: number) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        const newValue = Math.max(0, Math.min(goal.targetValue, goal.currentValue + increment));
        return {
          ...goal,
          currentValue: newValue,
          isCompleted: newValue >= goal.targetValue
        };
      }
      return goal;
    }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const AddGoalModal = () => {
    const [newGoal, setNewGoal] = useState({
      title: '',
      description: '',
      category: 'wellness' as Goal['category'],
      targetValue: 10,
      unit: 'days',
      deadline: '',
      priority: 'medium' as Goal['priority']
    });

    const handleSubmit = () => {
      if (newGoal.title.trim() && newGoal.deadline) {
        const goal: Goal = {
          id: Date.now().toString(),
          ...newGoal,
          currentValue: 0,
          isCompleted: false
        };
        setGoals([...goals, goal]);
        setShowAddGoal(false);
        setNewGoal({
          title: '',
          description: '',
          category: 'wellness',
          targetValue: 10,
          unit: 'days',
          deadline: '',
          priority: 'medium'
        });
      }
    };

    if (!showAddGoal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full">
          <h3 className="text-xl font-medium text-gray-800 mb-6">Add New Goal</h3>
          
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Goal title"
              value={newGoal.title}
              onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            
            <textarea
              placeholder="Description (optional)"
              value={newGoal.description}
              onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
              className="w-full p-3 border border-gray-200 rounded-xl h-20 resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            
            <select
              value={newGoal.category}
              onChange={(e) => setNewGoal({...newGoal, category: e.target.value as Goal['category']})}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="wellness">Wellness</option>
              <option value="productivity">Productivity</option>
              <option value="social">Social</option>
              <option value="learning">Learning</option>
              <option value="creative">Creative</option>
            </select>
            
            <div className="flex space-x-3">
              <input
                type="number"
                placeholder="Target"
                value={newGoal.targetValue}
                onChange={(e) => setNewGoal({...newGoal, targetValue: Number(e.target.value)})}
                className="flex-1 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <input
                type="text"
                placeholder="Unit"
                value={newGoal.unit}
                onChange={(e) => setNewGoal({...newGoal, unit: e.target.value})}
                className="flex-1 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <input
              type="date"
              value={newGoal.deadline}
              onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            
            <select
              value={newGoal.priority}
              onChange={(e) => setNewGoal({...newGoal, priority: e.target.value as Goal['priority']})}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>
          
          <div className="flex space-x-3 mt-6">
            <button
              onClick={() => setShowAddGoal(false)}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90"
            >
              Add Goal
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-light text-gray-800 mb-2">Goals</h1>
            <p className="text-lg text-gray-600">Track your progress and achieve your dreams</p>
          </div>
          <button
            onClick={() => setShowAddGoal(true)}
            className="bg-primary text-white px-6 py-3 rounded-2xl font-medium hover:bg-primary/90 gentle-hover flex items-center space-x-2"
          >
            <span>+</span>
            <span>Add Goal</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <div className="text-2xl font-bold text-primary mb-1">{goals.length}</div>
            <div className="text-sm text-gray-600">Total Goals</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {goals.filter(g => g.isCompleted).length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {goals.filter(g => !g.isCompleted).length}
            </div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {Math.round((goals.filter(g => g.isCompleted).length / goals.length) * 100) || 0}%
            </div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex space-x-2 overflow-x-auto pb-2 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-2xl font-medium transition-colors whitespace-nowrap
                ${selectedCategory === category.id
                  ? 'bg-primary text-white'
                  : `${category.color} text-gray-700 hover:bg-primary hover:text-white`
                }
              `}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* Goals Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGoals.map((goal) => (
            <div
              key={goal.id}
              className={`
                bg-white rounded-3xl p-6 shadow-sm border-l-4 transition-all hover:shadow-md
                ${goal.isCompleted 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-primary'
                }
              `}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className={`font-medium text-lg mb-1 ${goal.isCompleted ? 'text-green-800' : 'text-gray-800'}`}>
                    {goal.title}
                    {goal.isCompleted && <span className="ml-2">✅</span>}
                  </h3>
                  <p className={`text-sm ${goal.isCompleted ? 'text-green-600' : 'text-gray-600'}`}>
                    {goal.description}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(goal.priority)}`}>
                  {goal.priority}
                </span>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>{goal.currentValue} / {goal.targetValue} {goal.unit}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${goal.isCompleted ? 'bg-green-500' : 'bg-primary'}`}
                    style={{ width: `${Math.min((goal.currentValue / goal.targetValue) * 100, 100)}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {Math.round((goal.currentValue / goal.targetValue) * 100)}% complete
                </div>
              </div>

              {/* Deadline */}
              <div className="mb-4 text-xs text-gray-500">
                Deadline: {new Date(goal.deadline).toLocaleDateString()}
              </div>

              {/* Actions */}
              {!goal.isCompleted && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => updateGoalProgress(goal.id, 1)}
                    className="flex-1 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90"
                  >
                    +1 {goal.unit}
                  </button>
                  <button
                    onClick={() => updateGoalProgress(goal.id, -1)}
                    className="px-3 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm hover:bg-gray-200"
                  >
                    -1
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredGoals.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">No goals yet</h3>
            <p className="text-gray-600 mb-6">Start by adding your first goal!</p>
            <button
              onClick={() => setShowAddGoal(true)}
              className="bg-primary text-white px-6 py-3 rounded-2xl font-medium hover:bg-primary/90"
            >
              Add Your First Goal
            </button>
          </div>
        )}
      </div>

      <AddGoalModal />
    </div>
  );
};

export default Goals;
