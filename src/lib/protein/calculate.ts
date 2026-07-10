import type {
  ActivityLevel,
  FitnessGoal,
  ProteinInput,
  ProteinPreference,
  ProteinResult,
} from "./types";

const GOAL_MULTIPLIERS: Record<FitnessGoal, number> = {
  lose_fat: 1.6,
  maintain: 1.4,
  build_muscle: 1.8,
};

const PREFERENCE_MULTIPLIERS: Record<ProteinPreference, number | null> = {
  minimum: 0.8,
  optimal: null,
  high_performance: 2.2,
};

const ACTIVITY_ADJUSTMENTS: Record<ActivityLevel, number> = {
  sedentary: 0,
  lightly_active: 0.05,
  moderately_active: 0.1,
  very_active: 0.15,
  athlete: 0.2,
};

export function lbsToKg(lbs: number): number {
  return lbs * 0.453592;
}

export function getWeightInKg(weight: number, unit: "kg" | "lbs"): number {
  return unit === "kg" ? weight : lbsToKg(weight);
}

export function getProteinMultiplier(
  goal: FitnessGoal,
  preference: ProteinPreference,
  activity: ActivityLevel
): number {
  let base: number;

  if (preference === "minimum") {
    base = PREFERENCE_MULTIPLIERS.minimum!;
  } else if (preference === "high_performance") {
    base = PREFERENCE_MULTIPLIERS.high_performance!;
  } else {
    base = GOAL_MULTIPLIERS[goal];
  }

  if (preference !== "minimum") {
    base += ACTIVITY_ADJUSTMENTS[activity];
  }

  return Math.round(base * 100) / 100;
}

export function calculateProtein(input: ProteinInput): ProteinResult {
  const weightKg = getWeightInKg(input.weight, input.weightUnit);
  const multiplier = getProteinMultiplier(
    input.fitnessGoal,
    input.proteinPreference,
    input.activityLevel
  );
  const recommendedProtein = Math.round(weightKg * multiplier);

  return {
    recommendedProtein,
    proteinPerMeal: Math.round(recommendedProtein / 4),
    proteinPerKg: multiplier,
    weightKg: Math.round(weightKg * 10) / 10,
    fitnessGoal: input.fitnessGoal,
    activityLevel: input.activityLevel,
    proteinPreference: input.proteinPreference,
    multiplierUsed: multiplier,
  };
}

export function validateProteinInput(input: Partial<ProteinInput>): string | null {
  if (!input.age || input.age < 13 || input.age > 100) {
    return "Please enter a valid age between 13 and 100.";
  }
  if (!input.weight || input.weight <= 0 || input.weight > 500) {
    return "Please enter a valid weight.";
  }
  if (!input.height || input.height < 100 || input.height > 250) {
    return "Please enter a valid height in cm (100–250).";
  }
  return null;
}

export const DEFAULT_PROTEIN_INPUT: ProteinInput = {
  age: 20,
  gender: "male",
  weight: 70,
  weightUnit: "kg",
  height: 175,
  activityLevel: "moderately_active",
  fitnessGoal: "build_muscle",
  proteinPreference: "optimal",
};
