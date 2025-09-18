import React, { useState, useEffect } from 'react';
import FlowerGrowthWrapper from './FlowerGrowthWrapper';

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

interface TodoListProps {
  onCompletionChange?: (percentage: number) => void;
}

const TodoList: React.FC<TodoListProps> = ({ onCompletionChange }) => {
  // Mock daily tasks data
  const mockDailyTasks: TodoItem[] = [
    {
      id: 'daily-1',
      text: 'Drink 8 glasses of water 💧',
      completed: false,
      createdAt: new Date(),
    },
    {
      id: 'daily-2',
      text: 'Take a 15-minute walk outside 🚶‍♀️',
      completed: false,
      createdAt: new Date(),
    },
    {
      id: 'daily-3',
      text: 'Write down 3 things you\'re grateful for ✨',
      completed: false,
      createdAt: new Date(),
    },
    {
      id: 'daily-4',
      text: 'Do 5 minutes of meditation or deep breathing 🧘‍♀️',
      completed: false,
      createdAt: new Date(),
    },
    {
      id: 'daily-5',
      text: 'Read 10 pages of a book or article 📚',
      completed: false,
      createdAt: new Date(),
    },
  ];

  const [todos, setTodos] = useState<TodoItem[]>(mockDailyTasks);
  const [newTodoText, setNewTodoText] = useState('');
  const [completionPercentage, setCompletionPercentage] = useState(0);

  // Calculate completion percentage
  useEffect(() => {
    if (todos.length === 0) {
      setCompletionPercentage(0);
      onCompletionChange?.(0);
      return;
    }

    const completed = todos.filter(todo => todo.completed).length;
    const percentage = Math.round((completed / todos.length) * 100);
    setCompletionPercentage(percentage);
    onCompletionChange?.(percentage);
  }, [todos]);

  const addTodo = () => {
    if (newTodoText.trim()) {
      const newTodo: TodoItem = {
        id: Date.now().toString(),
        text: newTodoText.trim(),
        completed: false,
        createdAt: new Date(),
      };
      setTodos([...todos, newTodo]);
      setNewTodoText('');
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleFlowerClick = () => {
    // Add a little celebration when clicking the flower
    if (completionPercentage >= 100) {
      console.log('🌸 Flower celebration! All tasks complete!');
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border border-border">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-light text-foreground mb-2">Daily Tasks</h2>
        <p className="text-sm text-muted-foreground">
          Complete tasks to grow your flower 🌱
        </p>
        <div className="mt-2 text-lg font-medium text-primary">
          {completionPercentage}% Complete
        </div>
      </div>

      {/* Enhanced Flower Growth Animation */}
      <div className="mb-4">
        <FlowerGrowthWrapper 
          percentage={completionPercentage} 
          onFlowerClick={handleFlowerClick}
          className="mx-auto"
          preferredMode="auto"
        />
      </div>

      {/* Progress bar */}
      <div className="w-full bg-muted rounded-full h-2 mb-6">
        <div 
          className="bg-gradient-to-r from-green-400 to-pink-400 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${completionPercentage}%` }}
        ></div>
      </div>

      {/* Add new todo */}
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-2 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          onClick={addTodo}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-xl gentle-hover"
        >
          Add
        </button>
      </div>

      {/* Todo items */}
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className={`
              flex items-center space-x-3 p-3 rounded-xl border
              ${todo.completed 
                ? 'bg-muted border-muted text-muted-foreground' 
                : 'bg-background border-border'
              }
            `}
          >
            <button
              onClick={() => toggleTodo(todo.id)}
              className={`
                w-5 h-5 rounded-full border-2 flex items-center justify-center
                ${todo.completed 
                  ? 'bg-green-500 border-green-500' 
                  : 'border-muted-foreground hover:border-primary'
                }
              `}
            >
              {todo.completed && (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
            
            <span className={`flex-1 ${todo.completed ? 'line-through' : ''}`}>
              {todo.text}
            </span>
            
            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-muted-foreground hover:text-destructive gentle-hover"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
        
        {todos.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No tasks yet! Add one above to start growing your flower.</p>
          </div>
        )}
      </div>

      {/* Completion message */}
      {completionPercentage >= 70 && (
        <div className="mt-4 p-4 bg-gradient-to-r from-green-100 to-pink-100 rounded-xl text-center">
          <p className="text-sm font-medium text-green-800">
            🎉 Great job! You're earning reward points today!
          </p>
        </div>
      )}
    </div>
  );
};

export default TodoList;
