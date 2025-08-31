export type WalkingMode = 'steps' | 'distance' | 'time';
export type WalkingPace = 'slow' | 'normal' | 'fast';

export interface WalkingInputs {
  weight: number; // kg
  mode: WalkingMode;
  steps: number;
  distance: number; // km
  timeMinutes: number;
  pace: WalkingPace;
  height: number; // cm, needed for steps conversion
}

interface FoodEquivalent {
  name: string;
  caloriesPerUnit: number;
  unit: string;
}

// MET values for different walking paces
const MET_VALUES: Record<WalkingPace, number> = {
  slow: 2.5,    // 3 km/h
  normal: 3.5,  // 5 km/h
  fast: 4.3     // 6.5 km/h
};

// Walking speeds in km/h
const WALKING_SPEEDS: Record<WalkingPace, number> = {
  slow: 3.0,
  normal: 5.0,
  fast: 6.5
};

// Food equivalents with their calorie values
const FOOD_EQUIVALENTS: FoodEquivalent[] = [
  { name: 'Small Apple', caloriesPerUnit: 80, unit: 'apple' },
  { name: 'Banana', caloriesPerUnit: 105, unit: 'banana' },
  { name: 'Slice of Bread', caloriesPerUnit: 70, unit: 'slice' },
  { name: 'Cookie', caloriesPerUnit: 50, unit: 'cookie' },
  { name: 'Cup of Coffee (black)', caloriesPerUnit: 5, unit: 'cup' },
  { name: 'Glass of Wine', caloriesPerUnit: 125, unit: 'glass' },
  { name: 'Piece of Pizza', caloriesPerUnit: 285, unit: 'slice' },
  { name: 'Chocolate Bar', caloriesPerUnit: 220, unit: 'bar' },
  { name: 'Can of Soda', caloriesPerUnit: 150, unit: 'can' },
  { name: 'Donut', caloriesPerUnit: 250, unit: 'donut' }
];

/**
 * Convert steps to distance using stride length
 * Formula: stride length = 0.78 × height in meters
 */
export function convertStepsToDistance(steps: number, heightCm: number): number {
  const heightMeters = heightCm / 100;
  const strideLength = 0.78 * heightMeters; // meters per step
  const distanceMeters = steps * strideLength;
  return distanceMeters / 1000; // convert to kilometers
}

/**
 * Calculate average walking pace based on distance and time
 */
export function calculatePaceFromDistance(distanceKm: number): WalkingPace {
  // Assuming moderate walking time of 12 minutes per km (5 km/h)
  if (distanceKm <= 3) return 'slow';
  if (distanceKm <= 6) return 'normal';
  return 'fast';
}

/**
 * Calculate calories burned from walking based on inputs
 */
export function calculateWalkingCalories(inputs: WalkingInputs): number {
  let timeHours: number;
  let metValue: number;

  switch (inputs.mode) {
    case 'steps':
      // Convert steps to distance, then to time
      const distance = convertStepsToDistance(inputs.steps, inputs.height);
      // Assume moderate walking pace for steps (5 km/h)
      timeHours = distance / WALKING_SPEEDS.normal;
      metValue = MET_VALUES.normal;
      break;

    case 'distance':
      // Assume normal walking pace for distance-only input
      timeHours = inputs.distance / WALKING_SPEEDS.normal;
      metValue = MET_VALUES.normal;
      break;

    case 'time':
      // Use provided time and pace
      timeHours = inputs.timeMinutes / 60;
      metValue = MET_VALUES[inputs.pace];
      break;

    default:
      return 0;
  }

  // Formula: Calories = MET × weight (kg) × time (hours)
  return metValue * inputs.weight * timeHours;
}

/**
 * Get food equivalents for burned calories
 */
export function getFoodEquivalents(caloriesBurned: number): Array<{name: string, amount: string}> {
  if (caloriesBurned < 10) {
    return [{ name: 'Keep walking for meaningful comparisons!', amount: '👟' }];
  }

  const equivalents: Array<{name: string, amount: string}> = [];

  // Sort foods by calorie value (ascending)
  const sortedFoods = [...FOOD_EQUIVALENTS].sort((a, b) => a.caloriesPerUnit - b.caloriesPerUnit);

  // Find 3-4 relevant food comparisons
  for (const food of sortedFoods) {
    const quantity = caloriesBurned / food.caloriesPerUnit;
    
    if (quantity >= 0.3 && quantity <= 10) {
      let amount: string;
      
      if (quantity < 1) {
        // Show as fraction for less than 1
        const fraction = Math.round(quantity * 4) / 4; // Round to nearest quarter
        if (fraction === 0.25) amount = '¼';
        else if (fraction === 0.5) amount = '½';
        else if (fraction === 0.75) amount = '¾';
        else amount = `${quantity.toFixed(1)}`;
      } else if (quantity < 2) {
        // Show as decimal for 1-2 range
        amount = quantity.toFixed(1);
      } else {
        // Round to whole numbers for larger quantities
        amount = Math.round(quantity).toString();
      }
      
      const unitName = quantity === 1 ? food.unit : `${food.unit}s`;
      equivalents.push({
        name: food.name,
        amount: `${amount} ${unitName}`
      });
      
      if (equivalents.length >= 3) break;
    }
  }

  // If no suitable matches, find closest ones
  if (equivalents.length === 0) {
    const closest = sortedFoods.reduce((prev, curr) => {
      const prevDiff = Math.abs(prev.caloriesPerUnit - caloriesBurned);
      const currDiff = Math.abs(curr.caloriesPerUnit - caloriesBurned);
      return currDiff < prevDiff ? curr : prev;
    });

    const quantity = caloriesBurned / closest.caloriesPerUnit;
    const amount = quantity < 1 ? quantity.toFixed(1) : Math.round(quantity).toString();
    const unitName = quantity === 1 ? closest.unit : `${closest.unit}s`;
    
    equivalents.push({
      name: closest.name,
      amount: `${amount} ${unitName}`
    });
  }

  return equivalents;
}

/**
 * Get health recommendations based on calories burned
 */
export function getHealthRecommendation(caloriesBurned: number): string {
  if (caloriesBurned < 100) {
    return 'Try to increase your daily walking to burn more calories for better health benefits.';
  } else if (caloriesBurned < 200) {
    return 'Good start! Aim for at least 150 minutes of moderate activity per week.';
  } else if (caloriesBurned < 300) {
    return 'Excellent! You\'re meeting recommended activity levels for cardiovascular health.';
  } else {
    return 'Outstanding! You\'re exceeding recommended activity levels. Keep up the great work!';
  }
}

/**
 * Calculate weekly and monthly projections
 */
export function calculateProjections(dailyCalories: number) {
  const weeklyCalories = dailyCalories * 7;
  const monthlyCalories = dailyCalories * 30;
  
  // Rough estimate: 3500 calories = 1 pound of fat
  const weeklyWeightLoss = weeklyCalories / 3500; // pounds
  const monthlyWeightLoss = monthlyCalories / 3500; // pounds
  
  return {
    weekly: {
      calories: weeklyCalories,
      weightLoss: weeklyWeightLoss * 0.453592 // convert to kg
    },
    monthly: {
      calories: monthlyCalories,
      weightLoss: monthlyWeightLoss * 0.453592 // convert to kg
    }
  };
}