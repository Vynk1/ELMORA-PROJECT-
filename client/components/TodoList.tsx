import React, { useState, useEffect, lazy, Suspense } from 'react';
import FlowerGrowthWrapper from './FlowerGrowthWrapper';
import { useTaskContext, type TodoItem } from '../contexts/TaskContext';

// Lazy load effect components
const CountUp = lazy(() => import('./effects/CountUp'));
const FallingText = lazy(() => import('./effects/FallingText'));
const TextTrail = lazy(() => import('./effects/TextTrail'));
const ClickSpark = lazy(() => import('./effects/ClickSpark'));
const TargetCursor = lazy(() => import('./effects/TargetCursor'));

interface TodoListProps {
  onCompletionChange?: (percentage: number) => void;
}

const TodoList: React.FC<TodoListProps> = ({ onCompletionChange }) => {
  const { todos, addTodo, toggleTodo, deleteTodo, completionPercentage } = useTaskContext();
  const [newTodoText, setNewTodoText] = useState('');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [clickedTask, setClickedTask] = useState<string | null>(null);
  const [showTaskCompleteToast, setShowTaskCompleteToast] = useState(false);

  // Check for reduced motion preference and mobile
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileQuery = window.matchMedia('(max-width: 768px)');
    
    setPrefersReducedMotion(mediaQuery.matches);
    setIsMobile(mobileQuery.matches);
    
    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    const handleMobileChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    
    mediaQuery.addEventListener('change', handleMotionChange);
    mobileQuery.addEventListener('change', handleMobileChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange);
      mobileQuery.removeEventListener('change', handleMobileChange);
    };
  }, []);

  // Update parent component with completion percentage
  useEffect(() => {
    onCompletionChange?.(completionPercentage);
  }, [completionPercentage, onCompletionChange]);

  const handleAddTodo = () => {
    if (newTodoText.trim()) {
      addTodo(newTodoText.trim(), 'general');
      setNewTodoText('');
    }
  };

  const handleFlowerClick = () => {
    // Add a little celebration when clicking the flower
    if (completionPercentage >= 100) {
      console.log('🌸 Flower celebration! All tasks complete!');
    }
  };

  // Enhanced task toggle with micro-interactions
  const handleTaskToggle = (taskId: string, wasCompleted: boolean) => {
    toggleTodo(taskId);
    
    // If task was just completed (not uncompleted)
    if (!wasCompleted) {
      setClickedTask(taskId);
      setShowTaskCompleteToast(true);
      
      // Reset click spark after animation
      setTimeout(() => {
        setClickedTask(null);
      }, 800);
      
      // Hide toast after duration
      setTimeout(() => {
        setShowTaskCompleteToast(false);
      }, 1400);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border border-border">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-light text-foreground mb-2">Daily Tasks</h2>
        <p className="text-sm text-muted-foreground">
          {!prefersReducedMotion ? (
            <Suspense fallback="Complete tasks to grow your flower 🌱">
              <TextTrail 
                text="Complete tasks to grow your flower 🌱" 
                speed={0.8} 
                stagger={0.04}
                className="text-sm text-muted-foreground"
              />
            </Suspense>
          ) : (
            "Complete tasks to grow your flower 🌱"
          )}
        </p>
        <div className="mt-2 text-lg font-medium text-primary" aria-live="polite">
          <Suspense fallback={`${completionPercentage}% Complete`}>
            <CountUp 
              end={completionPercentage} 
              duration={1000} 
              suffix="% Complete" 
              disabled={prefersReducedMotion} 
            />
          </Suspense>
        </div>
      </div>

      {/* Enhanced Flower Growth Animation with Spline Placeholder */}
      <div className="mb-4 relative">
        <FlowerGrowthWrapper 
          percentage={completionPercentage} 
          onFlowerClick={handleFlowerClick}
          className="mx-auto"
          preferredMode="auto"
        />
        
        {/* Interactive Plant Spline Placeholder */}
        <div 
          id="spline-plant-placeholder" 
          data-spline="plant-mascot-interactive"
          data-progress={(completionPercentage / 100).toFixed(2)}
          className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-20 pointer-events-none opacity-0 transition-opacity duration-500"
          style={{ 
            opacity: completionPercentage > 50 ? 0.7 : 0,
            zIndex: 10 
          }}
        >
          {/* Reserved slot for Spline 3D interactive plant */}
        </div>
        
        {/* Task completion celebration toast */}
        {showTaskCompleteToast && !prefersReducedMotion && (
          <Suspense fallback={null}>
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20">
              <FallingText 
                trigger={showTaskCompleteToast} 
                duration={1.4} 
                className="text-green-600 font-medium text-sm whitespace-nowrap bg-white/90 px-3 py-1 rounded-full shadow-sm"
              >
                Nice — your plant grew! 🌱
              </FallingText>
            </div>
          </Suspense>
        )}
        
        {/* Static toast for reduced motion */}
        {showTaskCompleteToast && prefersReducedMotion && (
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20">
            <div className="text-green-600 font-medium text-sm whitespace-nowrap bg-white/90 px-3 py-1 rounded-full shadow-sm">
              Nice — your plant grew! 🌱
            </div>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full bg-muted rounded-full h-2 mb-6">
        <div 
          className="bg-gradient-to-r from-green-400 to-pink-400 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${completionPercentage}%` }}
        ></div>
      </div>

      {/* Enhanced Add new todo with TargetCursor */}
      <div className="flex space-x-2 mb-4">
        <Suspense fallback={
          <input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
            placeholder="Add a new task..."
            className="flex-1 px-4 py-2 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring"
          />
        }>
          <TargetCursor disabled={prefersReducedMotion || isMobile} color="#10b981" size={20}>
            <input
              type="text"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
              placeholder="Add a new task..."
              className="flex-1 px-4 py-2 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </TargetCursor>
        </Suspense>
        <button
          onClick={handleAddTodo}
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
            <div className="relative">
              <button
                onClick={() => handleTaskToggle(todo.id, todo.completed)}
                className={`
                  w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200
                  ${todo.completed 
                    ? 'bg-green-500 border-green-500 scale-110' 
                    : 'border-muted-foreground hover:border-primary hover:scale-105'
                  }
                `}
              >
                {todo.completed && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              
              {/* ClickSpark effect on task completion */}
              {!prefersReducedMotion && !isMobile && (
                <Suspense fallback={null}>
                  <ClickSpark 
                    trigger={clickedTask === todo.id}
                    disabled={prefersReducedMotion || isMobile}
                    color="#10b981"
                    size={16}
                    duration={800}
                  />
                </Suspense>
              )}
            </div>
            
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

      {/* Enhanced Completion message with FallingText */}
      {completionPercentage >= 70 && (
        <div className="mt-4 p-4 bg-gradient-to-r from-green-100 to-pink-100 rounded-xl text-center relative">
          <p className="text-sm font-medium text-green-800">
            🎉 Great job! You're earning reward points today!
          </p>
          {completionPercentage === 100 && !prefersReducedMotion && (
            <Suspense fallback={null}>
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
                <FallingText 
                  trigger={completionPercentage === 100} 
                  duration={2.5} 
                  className="text-yellow-500 font-bold text-xs whitespace-nowrap"
                >
                  ✨ Perfect day!
                </FallingText>
              </div>
            </Suspense>
          )}
        </div>
      )}
    </div>
  );
};

export default TodoList;