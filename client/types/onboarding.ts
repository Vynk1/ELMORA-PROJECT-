import type { Answer, CategoryLabel } from '../lib/score';

export interface OnboardingBasics {
  name: string;
  bio: string;
}

export interface OnboardingPhoto {
  file?: File;
  url?: string;
}

export interface OnboardingAiResults {
  score: number;
  category: CategoryLabel;
  insights: string[];
  recommendations: string[];
}

export interface OnboardingState {
  answers: Answer[];
  basics: OnboardingBasics;
  photo: OnboardingPhoto;
  ai?: OnboardingAiResults;
  currentStep: number;
  isSubmitting: boolean;
  error?: string;
}

export interface OnboardingContextValue extends OnboardingState {
  updateAnswers: (answers: Answer[]) => void;
  updateBasics: (basics: OnboardingBasics) => void;
  updatePhoto: (photo: OnboardingPhoto) => void;
  updateAi: (ai: OnboardingAiResults) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  setSubmitting: (submitting: boolean) => void;
  setError: (error: string | undefined) => void;
  reset: () => void;
}

export const ONBOARDING_STEPS = [
  'Assessment',
  'Profile Basics', 
  'Profile Photo',
  'Review & Submit',
  'Results'
] as const;

export type OnboardingStep = typeof ONBOARDING_STEPS[number];