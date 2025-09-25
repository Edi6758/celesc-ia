import { Decision } from "./invoice";

export interface DecisionSuggestion {
  decision: Decision;
  confidence: number; // 0..1
  reasoning: string[];
  triggeredRules: string[];
  suggestedJustification: string;
}

export interface DecisionContext {
  invoiceId: string;
  currentReading: number;
  previousReading: number;
  historicalAverage: number;
  photoQuality: string;
  serialMatch: boolean;
  riskScore: number;
  slaHours: number;
}