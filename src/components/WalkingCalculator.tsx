import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { 
  calculateWalkingCalories,
  convertStepsToDistance,
  getFoodEquivalents,
  type WalkingInputs,
  type WalkingMode,
  type WalkingPace
} from '@/utils/walkingCalculations';

export const WalkingCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<WalkingInputs>({
    weight: 70,
    mode: 'steps',
    steps: 8000,
    distance: 5,
    timeMinutes: 30,
    pace: 'normal',
    height: 170 // needed for steps conversion
  });

  const [caloriesBurned, setCaloriesBurned] = useState<number>(0);
  const [foodEquivalents, setFoodEquivalents] = useState<Array<{name: string, amount: string}>>([]);

  useEffect(() => {
    calculateResults();
  }, [inputs]);

  const calculateResults = () => {
    const calories = calculateWalkingCalories(inputs);
    const equivalents = getFoodEquivalents(calories);
    
    setCaloriesBurned(Math.round(calories));
    setFoodEquivalents(equivalents);
  };

  const updateInput = <K extends keyof WalkingInputs>(key: K, value: WalkingInputs[K]) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const resetValues = () => {
    setInputs({
      weight: 70,
      mode: 'steps',
      steps: 8000,
      distance: 5,
      timeMinutes: 30,
      pace: 'normal',
      height: 170
    });
  };

  const getGaugeColor = (calories: number) => {
    if (calories < 100) return 'text-red-500';
    if (calories < 200) return 'text-yellow-500';
    if (calories < 300) return 'text-green-500';
    return 'text-blue-500';
  };

  const getGaugeProgress = (calories: number) => {
    // Scale to 500 calories max for visual effect
    return Math.min((calories / 500) * 100, 100);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-text-primary mb-4">Walking Calorie Burn Calculator</h1>
        <p className="text-lg text-text-secondary max-w-3xl mx-auto">
          Calculate how many calories you burn from walking based on your weight, distance, time, or daily steps. 
          Uses scientifically-backed MET values for accurate estimations.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card className="bg-surface-primary border-border-primary">
          <CardHeader>
            <CardTitle className="text-text-primary">Walking Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Weight Input */}
            <div>
              <Label htmlFor="weight" className="text-text-secondary">Your Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={inputs.weight}
                onChange={(e) => updateInput('weight', Number(e.target.value))}
                className="mt-1"
                placeholder="Enter your weight"
              />
            </div>

            {/* Walking Mode Selection */}
            <div className="space-y-3">
              <Label className="text-text-secondary">How do you want to track your walking?</Label>
              <RadioGroup 
                value={inputs.mode} 
                onValueChange={(value: WalkingMode) => updateInput('mode', value)}
                className="grid grid-cols-1 gap-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="steps" id="steps" />
                  <Label htmlFor="steps" className="text-text-secondary cursor-pointer">Daily Steps</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="distance" id="distance" />
                  <Label htmlFor="distance" className="text-text-secondary cursor-pointer">Distance Walked</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="time" id="time" />
                  <Label htmlFor="time" className="text-text-secondary cursor-pointer">Time Walked + Pace</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Steps Mode */}
            {inputs.mode === 'steps' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="steps" className="text-text-secondary">Daily Steps</Label>
                  <Input
                    id="steps"
                    type="number"
                    value={inputs.steps}
                    onChange={(e) => updateInput('steps', Number(e.target.value))}
                    className="mt-1"
                    placeholder="e.g., 10000"
                  />
                </div>
                <div>
                  <Label htmlFor="height" className="text-text-secondary">Your Height (cm) - for stride calculation</Label>
                  <Input
                    id="height"
                    type="number"
                    value={inputs.height}
                    onChange={(e) => updateInput('height', Number(e.target.value))}
                    className="mt-1"
                    placeholder="e.g., 170"
                  />
                </div>
              </div>
            )}

            {/* Distance Mode */}
            {inputs.mode === 'distance' && (
              <div>
                <Label htmlFor="distance" className="text-text-secondary">Distance Walked (km)</Label>
                <Input
                  id="distance"
                  type="number"
                  step="0.1"
                  value={inputs.distance}
                  onChange={(e) => updateInput('distance', Number(e.target.value))}
                  className="mt-1"
                  placeholder="e.g., 5.0"
                />
              </div>
            )}

            {/* Time + Pace Mode */}
            {inputs.mode === 'time' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="time" className="text-text-secondary">Time (minutes)</Label>
                  <Input
                    id="time"
                    type="number"
                    value={inputs.timeMinutes}
                    onChange={(e) => updateInput('timeMinutes', Number(e.target.value))}
                    className="mt-1"
                    placeholder="e.g., 30"
                  />
                </div>
                <div>
                  <Label className="text-text-secondary">Walking Pace</Label>
                  <Select value={inputs.pace} onValueChange={(value: WalkingPace) => updateInput('pace', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="slow">Slow (3 km/h)</SelectItem>
                      <SelectItem value="normal">Normal (5 km/h)</SelectItem>
                      <SelectItem value="fast">Fast (6.5 km/h)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                onClick={calculateResults} 
                className="flex-1"
              >
                Calculate Calories
              </Button>
              <Button 
                variant="outline" 
                onClick={resetValues}
                className="flex-1"
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <Card className="bg-surface-primary border-border-primary">
          <CardHeader>
            <CardTitle className="text-text-primary">Calories Burned</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Calorie Gauge */}
            <div className="text-center">
              <div className="relative w-40 h-40 mx-auto mb-4">
                {/* Circular Progress Background */}
                <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 144 144">
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    stroke="hsl(var(--border-primary))"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    stroke="hsl(var(--accent-green))"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 60}`}
                    strokeDashoffset={`${2 * Math.PI * 60 - (getGaugeProgress(caloriesBurned) / 100) * 2 * Math.PI * 60}`}
                    className="transition-all duration-500 ease-in-out"
                  />
                </svg>
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className={`text-3xl font-bold ${getGaugeColor(caloriesBurned)}`}>
                    {caloriesBurned}
                  </div>
                  <div className="text-sm text-text-secondary">calories</div>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-text-primary mb-2">Daily Walking Burn</h3>
              <Progress value={getGaugeProgress(caloriesBurned)} className="w-full mb-4" />
            </div>

            {/* Walking Summary */}
            {inputs.mode === 'steps' && (
              <div className="p-4 bg-background-secondary rounded-lg">
                <h4 className="font-semibold text-text-primary mb-2">Walking Summary</h4>
                <p className="text-text-secondary text-sm">
                  {inputs.steps.toLocaleString()} steps ≈ {convertStepsToDistance(inputs.steps, inputs.height).toFixed(2)} km walked
                </p>
              </div>
            )}

            {/* Food Equivalents */}
            {foodEquivalents.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-text-primary">That's equivalent to:</h4>
                <div className="grid grid-cols-1 gap-2">
                  {foodEquivalents.map((food, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="justify-between p-3 h-auto bg-white border-border-primary"
                    >
                      <span className="font-medium">{food.name}</span>
                      <span className="text-text-tertiary">{food.amount}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

          </CardContent>
        </Card>
      </div>

      {/* Additional Info */}
      <Card className="bg-surface-primary border-border-primary">
        <CardHeader>
          <CardTitle className="text-text-primary">How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6 text-sm text-text-secondary">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h5 className="font-semibold text-text-primary">MET Values Used</h5>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">MET (Metabolic Equivalent of Task) measures exercise intensity. 1 MET = resting metabolic rate. Higher METs = more calories burned.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <ul className="space-y-1">
                <li>Slow (3 km/h): 2.5 MET</li>
                <li>Normal (5 km/h): 3.5 MET</li>
                <li>Fast (6.5 km/h): 4.3 MET</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-text-primary mb-2">Calculation Formula</h5>
              <p>Calories = MET × Weight (kg) × Time (hours)</p>
              <p className="mt-2">Steps are converted to distance using your stride length.</p>
            </div>
            <div>
              <h5 className="font-semibold text-text-primary mb-2">Tips</h5>
              <ul className="space-y-1">
                <li>• Aim for 90 minutes of walking daily</li>
                <li>• Walking uphill burns more calories</li>
                <li>• Consistency matters more than intensity</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};