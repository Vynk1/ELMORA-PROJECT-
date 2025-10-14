// lib/questions.ts

export type OptionKey = "A" | "B" | "C" | "D";

export interface Option {
  key: OptionKey;
  label: string;
  points: 0 | 1 | 2 | 3; // rubric score
}

export interface Question {
  id: `Q${number}`;
  text: string;
  options: Option[]; // exactly 4
  best: OptionKey;   // the growth/resilient target
}

export const QUESTIONS: Question[] = [
  {
    id: "Q1",
    text: "When you make a mistake or face a setback, how do you typically respond?",
    best: "C",
    options: [
      { key: "A", label: "I feel like giving up and think I’m not good enough.", points: 0 },
      { key: "B", label: "I feel disappointed but try to learn from it and adjust my approach.", points: 2 },
      { key: "C", label: "I see it as a learning opportunity and plan what to do differently.", points: 3 },
      { key: "D", label: "I ignore it and blame outside factors instead.", points: 1 },
    ],
  },
  {
    id: "Q2",
    text: "When someone offers you critical feedback, what is your usual reaction?",
    best: "C",
    options: [
      { key: "A", label: "I take it personally and feel upset or defensive.", points: 0 },
      { key: "B", label: "It stings, but I try to see if there’s something useful in it.", points: 2 },
      { key: "C", label: "I appreciate the perspective and consider how to improve.", points: 3 },
      { key: "D", label: "I dismiss it, thinking they must be wrong or didn’t understand me.", points: 1 },
    ],
  },
  {
    id: "Q3",
    text: "When you feel angry or upset, how do you typically react?",
    best: "C",
    options: [
      { key: "A", label: "I might lash out or say things I don’t mean.", points: 0 },
      { key: "B", label: "I keep it inside and try to distract myself.", points: 1 },
      { key: "C", label: "I pause to figure out why I’m upset and try to calm myself (e.g., deep breaths).", points: 3 },
      { key: "D", label: "I talk to someone I trust or do something to release the emotion.", points: 2 },
    ],
  },
  {
    id: "Q4",
    text: "When you’re under a lot of stress or have many tasks, how do you handle it?",
    best: "C",
    options: [
      { key: "A", label: "I feel overwhelmed and have trouble getting started.", points: 0 },
      { key: "B", label: "I work non-stop without taking breaks until it’s done.", points: 2 },
      { key: "C", label: "I make a plan, take short breaks, and tackle tasks step by step.", points: 3 },
      { key: "D", label: "I procrastinate or avoid thinking about the tasks.", points: 1 },
    ],
  },
  {
    id: "Q5",
    text: "Which statement best describes your view of abilities?",
    best: "C",
    options: [
      { key: "A", label: "People are born with certain abilities and can’t change much.", points: 0 },
      { key: "B", label: "You can improve with effort, but only to an extent.", points: 2 },
      { key: "C", label: "With practice and learning, most people (including me) can grow a lot.", points: 3 },
      { key: "D", label: "I haven’t really thought about it; I just try things without judging.", points: 1 },
    ],
  },
  {
    id: "Q6",
    text: "When something important doesn’t go your way (job/test), how do you react?",
    best: "C",
    options: [
      { key: "A", label: "I dwell on it and feel down for a long time.", points: 0 },
      { key: "B", label: "I’m upset, but I eventually accept it and try to move on.", points: 2 },
      { key: "C", label: "I bounce back quickly and start planning what to do next.", points: 3 },
      { key: "D", label: "I blame myself or others and replay what went wrong.", points: 1 },
    ],
  },
  {
    id: "Q7",
    text: "When you receive praise or a compliment, how do you respond?",
    best: "C",
    options: [
      { key: "A", label: "I feel uncomfortable and often doubt it’s true.", points: 0 },
      { key: "B", label: "I say thank you but usually downplay it.", points: 2 },
      { key: "C", label: "I feel proud and use it as motivation to keep going.", points: 3 },
      { key: "D", label: "I attribute it to luck or others’ help, not my efforts.", points: 1 },
    ],
  },
  // NEW Q8–Q10
  {
    id: "Q8",
    text: "When starting something new or challenging, what’s your approach?",
    best: "C",
    options: [
      { key: "A", label: "I avoid it because I might fail.", points: 0 },
      { key: "B", label: "I try only if I feel fully prepared.", points: 2 },
      { key: "C", label: "I start small, expect to learn, and improve as I go.", points: 3 },
      { key: "D", label: "I wait for someone else to show me exactly what to do.", points: 1 },
    ],
  },
  {
    id: "Q9",
    text: "How consistent are you with daily self-care (sleep, hydration, movement, reflection)?",
    best: "C",
    options: [
      { key: "A", label: "Rarely consistent; I usually forget or skip it.", points: 0 },
      { key: "B", label: "On and off; consistent for a few days, then drop it.", points: 2 },
      { key: "C", label: "Fairly consistent; I keep simple routines most days.", points: 3 },
      { key: "D", label: "I only do it when I feel overwhelmed.", points: 1 },
    ],
  },
  {
    id: "Q10",
    text: "When you feel stuck emotionally, what do you do first?",
    best: "C",
    options: [
      { key: "A", label: "Ignore it and hope it passes.", points: 0 },
      { key: "B", label: "Distract myself with screens or work.", points: 1 },
      { key: "C", label: "Use a coping tool (breathing, journaling, short walk) to reset.", points: 3 },
      { key: "D", label: "Vent without reflecting or seeking solutions.", points: 2 },
    ],
  },
];

export const MAX_SCORE = QUESTIONS.length * 3; // 30

