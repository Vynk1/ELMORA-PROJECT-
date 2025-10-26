import React, { useState } from "react";
import { useTaskContext } from '../contexts/TaskContext';
import { Footprints, Droplets, Sparkles, HeartHandshake, Phone, BookText, Trash2, X, Plus } from 'lucide-react';

interface QuickAddProps {
  onTaskAdded?: (task: string, category: string) => void;
}

const QuickAdd: React.FC<QuickAddProps> = ({ onTaskAdded }) => {
  const { addTodo } = useTaskContext();
  const [showForm, setShowForm] = useState(false);
  const [taskText, setTaskText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("wellness");

  const quickTasks = [
    { text: "Take a 10-minute walk", category: "wellness", icon: Footprints },
    { text: "Drink a glass of water", category: "wellness", icon: Droplets },
    { text: "Do 5 minutes of meditation", category: "wellness", icon: Sparkles },
    {
      text: "Write 3 things I'm grateful for",
      category: "wellness",
      icon: HeartHandshake,
    },
    { text: "Call a friend or family member", category: "social", icon: Phone },
    { text: "Tidy up my workspace", category: "productivity", icon: Trash2 },
    { text: "Read for 15 minutes", category: "learning", icon: BookText },
    { text: "Do some stretching", category: "wellness", icon: Sparkles },
  ];

  const categories = [
    { id: "wellness", name: "Wellness", color: "bg-green-500" },
    { id: "productivity", name: "Productivity", color: "bg-blue-500" },
    { id: "social", name: "Social", color: "bg-purple-500" },
    { id: "learning", name: "Learning", color: "bg-orange-500" },
    { id: "creative", name: "Creative", color: "bg-pink-500" },
  ];

  const handleQuickAdd = (task: string, category: string) => {
    // Add to the main todo list via context
    addTodo(task, category);
    
    // Also call the optional callback for backwards compatibility
    onTaskAdded?.(task, category);
    
    // Show success feedback
    const button = document.activeElement as HTMLButtonElement;
    if (button) {
      const originalText = button.textContent;
      button.textContent = "Added!";
      button.style.background = "#10b981";
      setTimeout(() => {
        button.textContent = originalText;
        button.style.background = "";
      }, 1500);
    }
  };

  const handleCustomAdd = () => {
    if (taskText.trim()) {
      // Add to the main todo list via context
      addTodo(taskText.trim(), selectedCategory);
      
      // Also call the optional callback for backwards compatibility
      onTaskAdded?.(taskText.trim(), selectedCategory);
      
      setTaskText("");
      setShowForm(false);
      // Show success notification
      alert("Task added successfully!");
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border border-border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-800">Quick Add Tasks</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="p-2 text-primary hover:bg-primary/10 rounded-xl transition-colors"
          title="Add custom task"
        >
          {showForm ? <X className="w-5 h-5" strokeWidth={2} /> : <Plus className="w-5 h-5" strokeWidth={2} />}
        </button>
      </div>

      {/* Custom Task Form */}
      {showForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-2xl">
          <div className="space-y-3">
            <input
              type="text"
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleCustomAdd()}
              placeholder="Enter your custom task..."
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
            />

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`
                    px-3 py-1 rounded-full text-xs font-medium transition-colors
                    ${
                      selectedCategory === category.id
                        ? `${category.color} text-white`
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }
                  `}
                >
                  {category.name}
                </button>
              ))}
            </div>

            <button
              onClick={handleCustomAdd}
              disabled={!taskText.trim()}
              className="w-full py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Custom Task
            </button>
          </div>
        </div>
      )}

      {/* Quick Task Buttons */}
      <div className="space-y-2">
        {quickTasks.map((task, index) => (
          <button
            key={index}
            onClick={() => handleQuickAdd(task.text, task.category)}
            className="w-full text-left p-3 rounded-xl hover:bg-gray-50 transition-colors flex items-center space-x-3 border border-gray-100 hover:border-primary/20"
          >
            <task.icon className="w-5 h-5" strokeWidth={2} />
            <span className="text-sm text-gray-700 flex-1">{task.text}</span>
            <span
              className={`
              px-2 py-1 rounded-full text-xs font-medium
              ${categories.find((c) => c.id === task.category)?.color.replace("bg-", "bg-") || "bg-gray-500"} 
              text-white
            `}
            >
              {categories.find((c) => c.id === task.category)?.name}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          Quick tasks are automatically added to your daily list
        </p>
      </div>
    </div>
  );
};

export default QuickAdd;
