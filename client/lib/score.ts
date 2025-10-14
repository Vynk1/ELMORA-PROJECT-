// lib/score.ts
import type { OptionKey } from "./questions";
import { QUESTIONS, MAX_SCORE } from "./questions";

export type Answer = { id: `Q${number}`; choice: OptionKey; points?: number };

export type CategoryLabel =
  | "Growth Champion"
  | "Resilient Builder"
  | "Balanced Explorer"
  | "Emerging Mindset"
  | "Overwhelmed — Needs Support";

export interface AssessmentResult {
  score: number;           // 0..30
  category: CategoryLabel;
  percent: number;         // 0..100
  breakdown: { id: string; choice: OptionKey; points: number }[];
}

export const categoryFromScore = (score: number): CategoryLabel => {
  if (score >= 25) return "Growth Champion";
  if (score >= 19) return "Resilient Builder";
  if (score >= 13) return "Balanced Explorer";
  if (score >= 7)  return "Emerging Mindset";
  return "Overwhelmed — Needs Support";
};

export function scoreAssessment(answers: Answer[]): AssessmentResult {
  // ensure we have exactly one answer per question id
  const map = new Map<string, Answer>();
  for (const a of answers) map.set(a.id, a);

  let total = 0;
  const breakdown: AssessmentResult["breakdown"] = [];

  for (const q of QUESTIONS) {
    const ans = map.get(q.id);
    if (!ans) throw new Error(`Missing answer for ${q.id}`);
    const opt = q.options.find(o => o.key === ans.choice);
    if (!opt) throw new Error(`Invalid choice ${ans.choice} for ${q.id}`);
    total += opt.points;
    breakdown.push({ id: q.id, choice: ans.choice, points: opt.points });
  }

  const percent = Math.round((total / MAX_SCORE) * 100);
  const category = categoryFromScore(total);

  return { score: total, category, percent, breakdown };
}

// Optional helper to assemble a clean payload for Supabase
export function toSupabasePayload(
  userId: string,
  result: AssessmentResult,
  answers: Answer[],
  extras?: { insights?: string[]; recommendations?: string[] }
) {
  return {
    user_id: userId,
    answers: answers.map(a => ({ id: a.id, choice: a.choice })), // compact
    score: result.score,
    category: result.category,
    ai_insights: {
      insights: extras?.insights ?? [],
      recommendations: extras?.recommendations ?? [],
    },
  };
}
