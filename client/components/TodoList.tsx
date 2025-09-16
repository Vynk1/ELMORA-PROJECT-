import React, { useState, useEffect } from 'react';

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

  // Flower growth based on completion
  const getFlowerStage = () => {
    if (completionPercentage === 0) return 'seed';
    if (completionPercentage < 25) return 'sprout';
    if (completionPercentage < 50) return 'small';
    if (completionPercentage < 75) return 'growing';
    if (completionPercentage < 100) return 'blooming';
    return 'full-bloom';
  };

  const FlowerAnimation = () => {
    const stage = getFlowerStage();
    
    return (
      <div className="flex flex-col items-center justify-end h-32 mb-4">
        {/* Flower pot */}
        <div className="w-16 h-10 bg-gradient-to-b from-orange-300 to-orange-400 rounded-b-xl border-2 border-orange-500 relative">
          <div className="absolute inset-x-2 top-1 h-1 bg-orange-500 rounded"></div>
        </div>
        
        {/* Flower stages */}
        <div className="relative -mt-2 transition-all duration-1000 ease-out">
          {stage === 'seed' && (
            <div className="w-2 h-1 bg-brown-600 rounded-full"></div>
          )}
          
          {stage === 'sprout' && (
            <div className="flex flex-col items-center">
              <div className="w-1 h-6 bg-green-500 rounded-t-full animate-pulse"></div>
            </div>
          )}
          
          {(stage === 'small' || stage === 'growing' || stage === 'blooming' || stage === 'full-bloom') && (
            <div className="flex flex-col items-center">
              {/* Stem */}
              <div className="w-1 h-12 bg-green-500 rounded-t-full"></div>
              
              {/* Leaves */}
              <div className="absolute bottom-4 -left-2 w-3 h-2 bg-green-400 rounded-full transform -rotate-45"></div>
              <div className="absolute bottom-6 -right-2 w-3 h-2 bg-green-400 rounded-full transform rotate-45"></div>
              
              {/* Flower */}
              {stage !== 'small' && (
                <div className="absolute -top-2 flex items-center justify-center">
                  {stage === 'growing' && (
                    <div className="w-4 h-4 bg-pink-300 rounded-full animate-pulse"></div>
                  )}
                  
                  {stage === 'blooming' && (
                    <div className="relative">
                      <div className="w-6 h-6 bg-pink-400 rounded-full"></div>
                      <div className="absolute inset-1 w-4 h-4 bg-pink-300 rounded-full"></div>
                      <div className="absolute inset-2 w-2 h-2 bg-yellow-300 rounded-full"></div>
                    </div>
                  )}
                  
                  {stage === 'full-bloom' && (
                    <div className="relative animate-bounce">
                      {/* Petals */}
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-6 bg-pink-400 rounded-full"></div>
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-6 bg-pink-400 rounded-full"></div>
                      <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-6 h-3 bg-pink-400 rounded-full"></div>
                      <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-6 h-3 bg-pink-400 rounded-full"></div>
                      
                      {/* Diagonal petals */}
                      <div className="absolute -top-1 -left-1 w-4 h-4 bg-pink-300 rounded-full transform rotate-45"></div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-pink-300 rounded-full transform -rotate-45"></div>
                      <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-pink-300 rounded-full transform -rotate-45"></div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-pink-300 rounded-full transform rotate-45"></div>
                      
                      {/* Center */}
                      <div className="w-6 h-6 bg-yellow-300 rounded-full border-2 border-yellow-400"></div>
                      <div className="absolute inset-1 w-4 h-4 bg-yellow-200 rounded-full"></div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
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

      {/* Flower animation */}
      <FlowerAnimation />

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
