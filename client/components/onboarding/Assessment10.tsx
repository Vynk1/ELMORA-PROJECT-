'use client';

import { useState, useEffect } from 'react';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { QUESTIONS } from '../../lib/questions';
import type { Answer } from '../../lib/score';
import type { OptionKey } from '../../lib/questions';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function Assessment10() {
  const { answers, updateAnswers, nextStep } = useOnboarding();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [localAnswers, setLocalAnswers] = useState<Answer[]>(answers);
  
  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / QUESTIONS.length) * 100;
  
  // Get current answer for this question
  const currentAnswer = localAnswers.find(a => a.id === currentQuestion.id);

  useEffect(() => {
    // Sync with context on mount
    if (answers.length > 0) {
      setLocalAnswers(answers);
    }
  }, [answers]);

  const handleAnswerSelect = (optionKey: string) => {
    const option = currentQuestion.options.find(opt => opt.key === optionKey);
    if (!option) return;

    const newAnswer: Answer = {
      id: currentQuestion.id,
      choice: optionKey as OptionKey,
      points: option.points,
    };

    const updatedAnswers = localAnswers.filter(a => a.id !== currentQuestion.id);
    updatedAnswers.push(newAnswer);
    
    setLocalAnswers(updatedAnswers);
    updateAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // All questions completed
      nextStep();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const canProceed = currentAnswer !== undefined;
  const isLastQuestion = currentQuestionIndex === QUESTIONS.length - 1;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const options = currentQuestion.options;
        const currentIndex = currentAnswer ? options.findIndex(opt => opt.key === currentAnswer.choice) : -1;
        
        let nextIndex;
        if (event.key === 'ArrowDown') {
          nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
        } else {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
        }
        
        handleAnswerSelect(options[nextIndex].key);
      } else if (event.key === 'Enter' && canProceed) {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentAnswer, currentQuestion.options, canProceed]);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Question progress */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-purple-600">
            Question {currentQuestionIndex + 1} of {QUESTIONS.length}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-8 leading-relaxed">
          {currentQuestion.text}
        </h2>

        {/* Answer options */}
        <div className="space-y-4">
          {currentQuestion.options.map((option) => {
            const isSelected = currentAnswer?.choice === option.key;
            
            return (
              <button
                key={option.key}
                onClick={() => handleAnswerSelect(option.key)}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 group hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-purple-400/50 ${
                  isSelected
                    ? 'border-purple-500 bg-purple-50 text-purple-800'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50/50'
                }`}
                aria-pressed={isSelected}
              >
                <div className="flex items-center">
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 mr-4 transition-all duration-200 ${
                    isSelected
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-gray-300 group-hover:border-purple-400'
                  }`}>
                    {isSelected && (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                  <span className="text-base leading-relaxed">
                    {option.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between items-center pt-6">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <ChevronLeftIcon className="w-5 h-5 mr-2" />
          Previous
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-500 mb-2">
            Use arrow keys to navigate • Enter to continue
          </p>
          <p className="text-xs text-gray-400">
            {localAnswers.length} of {QUESTIONS.length} answered
          </p>
        </div>

        <button
          onClick={handleNext}
          disabled={!canProceed}
          className={`flex items-center px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
            canProceed
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-400/50'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isLastQuestion ? 'Continue to Profile' : 'Next'}
          <ChevronRightIcon className="w-5 h-5 ml-2" />
        </button>
      </div>

      {/* Completion indicator */}
      {localAnswers.length === QUESTIONS.length && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
          <p className="text-green-800 text-center font-medium">
            🎉 Assessment complete! You can review your answers or continue to the next step.
          </p>
        </div>
      )}
    </div>
  );
}