import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  category?: string;
}

interface TaskContextType {
  todos: TodoItem[];
  addTodo: (text: string, category?: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  completionPercentage: number;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  // Initial mock daily tasks
  const initialTasks: TodoItem[] = [
    {
      id: 'daily-1',
      text: 'Drink 8 glasses of water 💧',
      completed: false,
      createdAt: new Date(),
      category: 'wellness',
    },
    {
      id: 'daily-2',
      text: 'Take a 15-minute walk outside 🚶‍♀️',
      completed: false,
      createdAt: new Date(),
      category: 'wellness',
    },
    {
      id: 'daily-3',
      text: 'Write down 3 things you\'re grateful for ✨',
      completed: false,
      createdAt: new Date(),
      category: 'wellness',
    },
    {
      id: 'daily-4',
      text: 'Do 5 minutes of meditation or deep breathing 🧘‍♀️',
      completed: false,
      createdAt: new Date(),
      category: 'wellness',
    },
    {
      id: 'daily-5',
      text: 'Read 10 pages of a book or article 📚',
      completed: false,
      createdAt: new Date(),
      category: 'learning',
    },
  ];

  const [todos, setTodos] = useState<TodoItem[]>(initialTasks);
  
  const addTodo = useCallback((text: string, category: string = 'general') => {
    const newTodo: TodoItem = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: new Date(),
      category,
    };
    setTodos(prev => [...prev, newTodo]);
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  // Calculate completion percentage
  const completionPercentage = React.useMemo(() => {
    if (todos.length === 0) return 0;
    const completed = todos.filter(todo => todo.completed).length;
    return Math.round((completed / todos.length) * 100);
  }, [todos]);

  const value = {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    completionPercentage,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};