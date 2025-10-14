'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { OnboardingState, OnboardingContextValue, OnboardingBasics, OnboardingPhoto, OnboardingAiResults } from '../types/onboarding';
import { Answer } from '../lib/score';

// Initial state
const initialState: OnboardingState = {
  answers: [],
  basics: { name: '', bio: '' },
  photo: {},
  currentStep: 0,
  isSubmitting: false,
  error: undefined,
};

// Action types
type OnboardingAction =
  | { type: 'UPDATE_ANSWERS'; payload: Answer[] }
  | { type: 'UPDATE_BASICS'; payload: OnboardingBasics }
  | { type: 'UPDATE_PHOTO'; payload: OnboardingPhoto }
  | { type: 'UPDATE_AI'; payload: OnboardingAiResults }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'GO_TO_STEP'; payload: number }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | undefined }
  | { type: 'RESET' };

// Reducer
function onboardingReducer(state: OnboardingState, action: OnboardingAction): OnboardingState {
  switch (action.type) {
    case 'UPDATE_ANSWERS':
      return { ...state, answers: action.payload };
    case 'UPDATE_BASICS':
      return { ...state, basics: action.payload };
    case 'UPDATE_PHOTO':
      return { ...state, photo: action.payload };
    case 'UPDATE_AI':
      return { ...state, ai: action.payload };
    case 'NEXT_STEP':
      return { ...state, currentStep: Math.min(state.currentStep + 1, 4) };
    case 'PREV_STEP':
      return { ...state, currentStep: Math.max(state.currentStep - 1, 0) };
    case 'GO_TO_STEP':
      return { ...state, currentStep: Math.max(0, Math.min(action.payload, 4)) };
    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

// Context
const OnboardingContext = createContext<OnboardingContextValue | undefined>(undefined);

// Provider component
interface OnboardingProviderProps {
  children: ReactNode;
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const [state, dispatch] = useReducer(onboardingReducer, initialState);

  const contextValue: OnboardingContextValue = {
    ...state,
    updateAnswers: (answers: Answer[]) => {
      dispatch({ type: 'UPDATE_ANSWERS', payload: answers });
    },
    updateBasics: (basics: OnboardingBasics) => {
      dispatch({ type: 'UPDATE_BASICS', payload: basics });
    },
    updatePhoto: (photo: OnboardingPhoto) => {
      dispatch({ type: 'UPDATE_PHOTO', payload: photo });
    },
    updateAi: (ai: OnboardingAiResults) => {
      dispatch({ type: 'UPDATE_AI', payload: ai });
    },
    nextStep: () => {
      dispatch({ type: 'NEXT_STEP' });
    },
    prevStep: () => {
      dispatch({ type: 'PREV_STEP' });
    },
    goToStep: (step: number) => {
      dispatch({ type: 'GO_TO_STEP', payload: step });
    },
    setSubmitting: (submitting: boolean) => {
      dispatch({ type: 'SET_SUBMITTING', payload: submitting });
    },
    setError: (error: string | undefined) => {
      dispatch({ type: 'SET_ERROR', payload: error });
    },
    reset: () => {
      dispatch({ type: 'RESET' });
    },
  };

  return (
    <OnboardingContext.Provider value={contextValue}>
      {children}
    </OnboardingContext.Provider>
  );
}

// Hook to use the context
export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}