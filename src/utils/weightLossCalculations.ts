export interface CalculatorInputs {
  age: number;
  sex: 'male' | 'female';
  height: number; // cm
  currentWeight: number; // kg
  dailyCalorieIntake: number; // kcal
  activityType: 'walking';
  steps: number;
  walkingMinutes: number;
  walkingSpeed: number; // km/h
}

export interface WeightProjectionPoint {
  week: number;
  projectedWeight: number;
  upperBound: number;
  lowerBound: number;
}

/**
 * Calculate Basal Metabolic Rate using Mifflin-St Jeor equation
 */
export function calculateBMR(age: number, sex: 'male' | 'female', height: number, weight: number): number {
  const baseRate = 10 * weight + 6.25 * height - 5 * age;
  return sex === 'male' ? baseRate + 5 : baseRate - 161;
}

/**
 * Calculate calories burned from walking activity
 */
export function calculateWalkingBurn(inputs: CalculatorInputs): number {
  // Calculate based on walking minutes and speed
  // METs formula based on walking speed (km/h)
  let mets: number;
  
  if (inputs.walkingSpeed <= 3.2) {
    mets = 2.9; // Slow pace
  } else if (inputs.walkingSpeed <= 4.0) {
    mets = 3.3; // Easy pace
  } else if (inputs.walkingSpeed <= 5.6) {
    mets = 3.8; // Moderate pace
  } else if (inputs.walkingSpeed <= 6.4) {
    mets = 5.0; // Brisk pace
  } else {
    mets = 6.3; // Fast pace
  }
  
  // METs formula: kcal/hour = METs × weight(kg) × 1.05
  const kcalPerHour = mets * inputs.currentWeight * 1.05;
  return (kcalPerHour * inputs.walkingMinutes) / 60;
}

/**
 * Calculate Total Daily Energy Expenditure
 */
export function calculateTDEE(bmr: number, walkingBurn: number, activityFactor: number = 1.2): number {
  // Using sedentary activity factor (1.2) as base, then adding walking burn separately
  return bmr * activityFactor + walkingBurn;
}

/**
 * Get metabolic adaptation factor based on weeks into deficit
 */
export function getMetabolicRate(weekNumber: number): number {
  // Metabolic adaptation typically reduces TDEE by 10-20% over 12 weeks
  const adaptationRate = Math.min(weekNumber * 0.015, 0.2); // Max 20% reduction
  return 1 - adaptationRate;
}

/**
 * Generate weight projection with uncertainty bands
 */
export function generateWeightProjection(
  startWeight: number,
  weeklyLoss: number,
  numberOfWeeks: number
): WeightProjectionPoint[] {
  const projection: WeightProjectionPoint[] = [];
  
  for (let week = 0; week <= numberOfWeeks; week++) {
    const metabolicRate = getMetabolicRate(week);
    const adjustedWeeklyLoss = weeklyLoss * metabolicRate;
    
    const projectedWeight = startWeight - (adjustedWeeklyLoss * week);
    
    // Add uncertainty bands (±20% for biological variation)
    const uncertaintyFactor = 0.2;
    const variation = Math.abs(weeklyLoss * week * uncertaintyFactor);
    
    projection.push({
      week,
      projectedWeight: Number(projectedWeight.toFixed(1)),
      upperBound: Number((projectedWeight + variation).toFixed(1)),
      lowerBound: Number((projectedWeight - variation).toFixed(1))
    });
  }
  
  return projection;
}

/**
 * Validate inputs and return warnings
 */
export function validateInputs(inputs: CalculatorInputs): string[] {
  const warnings: string[] = [];
  
  if (inputs.dailyCalorieIntake < 1200 && inputs.sex === 'female') {
    warnings.push('Daily calorie intake below 1200 kcal is not recommended for women');
  }
  
  if (inputs.dailyCalorieIntake < 1500 && inputs.sex === 'male') {
    warnings.push('Daily calorie intake below 1500 kcal is not recommended for men');
  }
  
  const bmr = calculateBMR(inputs.age, inputs.sex, inputs.height, inputs.currentWeight);
  if (inputs.dailyCalorieIntake < bmr) {
    warnings.push('Your calorie intake is below your BMR, which may slow metabolism');
  }
  
  return warnings;
}

/**
 * Calculate recommended calorie intake for healthy weight loss
 */
export function getRecommendedIntake(
  bmr: number,
  walkingBurn: number,
  targetWeeklyLoss: number = 0.5
): number {
  const tdee = calculateTDEE(bmr, walkingBurn);
  const weeklyDeficitNeeded = targetWeeklyLoss * 7700; // kcal
  const dailyDeficitNeeded = weeklyDeficitNeeded / 7;
  
  return Math.round(tdee - dailyDeficitNeeded);
}