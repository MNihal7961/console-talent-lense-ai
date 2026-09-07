import { ConfidenceLevel, MatchStatus } from "../interface/screening-result";

export const MATCH_STATUS_META: Record<
  MatchStatus,
  { label: string; color: string }
> = {
  [MatchStatus.STRONG_MATCH]: { label: "Strong Match", color: "success" },
  [MatchStatus.GOOD_MATCH]: { label: "Good Match", color: "blue" },
  [MatchStatus.PARTIAL_MATCH]: { label: "Partial Match", color: "warning" },
  [MatchStatus.WEAK_MATCH]: { label: "Weak Match", color: "error" },
};

export const CONFIDENCE_META: Record<
  ConfidenceLevel,
  { label: string; color: string }
> = {
  [ConfidenceLevel.HIGH]: { label: "High Confidence", color: "success" },
  [ConfidenceLevel.MEDIUM]: { label: "Medium Confidence", color: "warning" },
  [ConfidenceLevel.LOW]: { label: "Low Confidence", color: "default" },
};
