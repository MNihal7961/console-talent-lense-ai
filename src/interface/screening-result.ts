export const RequirementCategory = {
  REQUIRED_SKILL: "REQUIRED_SKILL",
  PREFERRED_SKILL: "PREFERRED_SKILL",
  EXPERIENCE: "EXPERIENCE",
  EDUCATION: "EDUCATION",
  RESPONSIBILITY: "RESPONSIBILITY",
} as const;
export type RequirementCategory =
  (typeof RequirementCategory)[keyof typeof RequirementCategory];

export const RequirementStatus = {
  MATCHED: "MATCHED",
  MISSING: "MISSING",
  UNCERTAIN: "UNCERTAIN",
} as const;
export type RequirementStatus =
  (typeof RequirementStatus)[keyof typeof RequirementStatus];

export const ConfidenceLevel = {
  HIGH: "HIGH",
  MEDIUM: "MEDIUM",
  LOW: "LOW",
} as const;
export type ConfidenceLevel =
  (typeof ConfidenceLevel)[keyof typeof ConfidenceLevel];

export const MatchStatus = {
  STRONG_MATCH: "STRONG_MATCH",
  GOOD_MATCH: "GOOD_MATCH",
  PARTIAL_MATCH: "PARTIAL_MATCH",
  WEAK_MATCH: "WEAK_MATCH",
} as const;
export type MatchStatus = (typeof MatchStatus)[keyof typeof MatchStatus];

export interface ScreeningRequirement {
  category: RequirementCategory;
  requirement: string;
  status: RequirementStatus;
  evidence: string;
  confidence: ConfidenceLevel;
}

export interface ScreeningResult {
  _id: string;
  jobApplicationId: string;
  matchScore: number;
  matchStatus: MatchStatus;
  confidence: ConfidenceLevel;
  summary: string;
  requirements: ScreeningRequirement[];
  strengths: string[];
  gaps: string[];
  uncertainties: string[];
  reasoning: string;
  createdAt: string;
  updatedAt: string;
}
