export type Gender = "male" | "female";
export type WeightUnit = "kg" | "lbs";
export type ActivityLevel =
  | "sedentary"
  | "lightly_active"
  | "moderately_active"
  | "very_active"
  | "athlete";
export type FitnessGoal = "lose_fat" | "maintain" | "build_muscle";
export type ProteinPreference = "minimum" | "optimal" | "high_performance";

export interface ProteinInput {
  age: number;
  gender: Gender;
  weight: number;
  weightUnit: WeightUnit;
  height: number;
  activityLevel: ActivityLevel;
  fitnessGoal: FitnessGoal;
  proteinPreference: ProteinPreference;
}

export interface ProteinResult {
  recommendedProtein: number;
  proteinPerMeal: number;
  proteinPerKg: number;
  weightKg: number;
  fitnessGoal: FitnessGoal;
  activityLevel: ActivityLevel;
  proteinPreference: ProteinPreference;
  multiplierUsed: number;
}

export const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: "Sedentary",
  lightly_active: "Lightly Active",
  moderately_active: "Moderately Active",
  very_active: "Very Active",
  athlete: "Athlete",
};

export const GOAL_LABELS: Record<FitnessGoal, string> = {
  lose_fat: "Lose Fat",
  maintain: "Maintain",
  build_muscle: "Build Muscle",
};

export const PREFERENCE_LABELS: Record<ProteinPreference, string> = {
  minimum: "Minimum Recommended",
  optimal: "Optimal",
  high_performance: "High Performance",
};
