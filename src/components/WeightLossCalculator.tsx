import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart, ReferenceLine } from 'recharts';
import { 
  calculateBMR, 
  calculateWalkingBurn, 
  calculateTDEE, 
  generateWeightProjection,
  getMetabolicRate,
  type CalculatorInputs 
} from '@/utils/weightLossCalculations';

export const WeightLossCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    age: 30,
    sex: 'male',
    height: 175,
    currentWeight: 80,
    dailyCalorieIntake: 2000,
    activityType: 'walking',
    steps: 8000,
    walkingMinutes: 30,
    walkingSpeed: 5.0 // km/h - default moderate speed
  });

  const [results, setResults] = useState<any>(null);
  const [projectionData, setProjectionData] = useState<any[]>([]);

  useEffect(() => {
    calculateResults();
  }, [inputs]);

  const calculateResults = () => {
    const bmr = calculateBMR(inputs.age, inputs.sex, inputs.height, inputs.currentWeight);
    const walkingBurn = calculateWalkingBurn(inputs);
    const tdee = calculateTDEE(bmr, walkingBurn);
    const dailyDeficit = tdee - inputs.dailyCalorieIntake;
    const weeklyWeightLoss = (dailyDeficit * 7) / 7700; // kg per week
    
    const projection = generateWeightProjection(
      inputs.currentWeight,
      weeklyWeightLoss,
      12 // 12 weeks
    );

    setResults({
      bmr: Math.round(bmr),
      walkingBurn: Math.round(walkingBurn),
      tdee: Math.round(tdee),
      dailyDeficit: Math.round(dailyDeficit),
      weeklyWeightLoss: Number(weeklyWeightLoss.toFixed(2)),
      projectedWeightIn12Weeks: Number((inputs.currentWeight - weeklyWeightLoss * 12).toFixed(1))
    });

    setProjectionData(projection);
  };

  const updateInput = (key: keyof CalculatorInputs, value: any) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const getDeficitColor = (deficit: number) => {
    if (deficit < 200) return 'bg-red-100 text-red-800';
    if (deficit < 500) return 'bg-yellow-100 text-yellow-800';
    if (deficit < 800) return 'bg-green-100 text-green-800';
    return 'bg-red-100 text-red-800';
  };

  const getDeficitMessage = (deficit: number) => {
    if (deficit < 0) return 'Calorie surplus - you will gain weight';
    if (deficit < 200) return 'Very small deficit - minimal weight loss';
    if (deficit < 500) return 'Moderate deficit - sustainable weight loss';
    if (deficit < 800) return 'Good deficit - steady weight loss';
    return 'Large deficit - may be unsustainable';
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-text-primary mb-4">Weight Loss Projection Calculator</h1>
        <p className="text-lg text-text-secondary max-w-3xl mx-auto">
          Calculate your projected weight loss based on your calorie intake and activity level. 
          This calculator uses the Mifflin-St Jeor equation and walking activity to estimate your daily energy expenditure.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card className="bg-surface-primary border-border-primary">
          <CardHeader>
            <CardTitle className="text-text-primary">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age" className="text-text-secondary">Age (years)</Label>
                <Input
                  id="age"
                  type="number"
                  value={inputs.age}
                  onChange={(e) => updateInput('age', Number(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-text-secondary">Sex</Label>
                <Select value={inputs.sex} onValueChange={(value: 'male' | 'female') => updateInput('sex', value)}>
                  <SelectTrigger className="mt-1 bg-background z-50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border z-50">
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="height" className="text-text-secondary">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={inputs.height}
                  onChange={(e) => updateInput('height', Number(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="weight" className="text-text-secondary">Current Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={inputs.currentWeight}
                  onChange={(e) => updateInput('currentWeight', Number(e.target.value))}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="calories" className="text-text-secondary">Daily Calorie Intake (kcal)</Label>
              <Input
                id="calories"
                type="number"
                value={inputs.dailyCalorieIntake}
                onChange={(e) => updateInput('dailyCalorieIntake', Number(e.target.value))}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minutes" className="text-text-secondary">Walking Minutes</Label>
                <Input
                  id="minutes"
                  type="number"
                  value={inputs.walkingMinutes}
                  onChange={(e) => updateInput('walkingMinutes', Number(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-text-secondary">Walking Speed</Label>
                <Select value={inputs.walkingSpeed?.toString()} onValueChange={(value) => updateInput('walkingSpeed', Number(value))}>
                  <SelectTrigger className="mt-1 bg-background z-50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border z-50">
                    <SelectItem value="3.0">Slow (3.0 km/h)</SelectItem>
                    <SelectItem value="4.0">Easy (4.0 km/h)</SelectItem>
                    <SelectItem value="5.0">Moderate (5.0 km/h)</SelectItem>
                    <SelectItem value="6.0">Brisk (6.0 km/h)</SelectItem>
                    <SelectItem value="6.5">Fast (6.5 km/h)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <Card className="bg-surface-primary border-border-primary">
          <CardHeader>
            <CardTitle className="text-text-primary">Your Energy Balance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {results && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-background-secondary rounded-lg">
                    <div className="text-2xl font-bold text-text-primary">{results.bmr}</div>
                    <div className="text-sm text-text-secondary">BMR (kcal/day)</div>
                  </div>
                  <div className="text-center p-4 bg-background-secondary rounded-lg">
                    <div className="text-2xl font-bold text-text-primary">{results.walkingBurn}</div>
                    <div className="text-sm text-text-secondary">Walking Burn (kcal/day)</div>
                  </div>
                  <div className="text-center p-4 bg-background-secondary rounded-lg">
                    <div className="text-2xl font-bold text-text-primary">{results.tdee}</div>
                    <div className="text-sm text-text-secondary">TDEE (kcal/day)</div>
                  </div>
                  <div className="text-center p-4 bg-background-secondary rounded-lg">
                    <div className={`text-2xl font-bold ${results.dailyDeficit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {results.dailyDeficit >= 0 ? '+' : ''}{results.dailyDeficit}
                    </div>
                    <div className="text-sm text-text-secondary">Daily Deficit (kcal)</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Badge className={getDeficitColor(results.dailyDeficit)} variant="secondary">
                    {getDeficitMessage(results.dailyDeficit)}
                  </Badge>
                  
                  <div className="p-4 bg-background-secondary rounded-lg">
                    <h3 className="font-semibold text-text-primary mb-2">Projection Summary</h3>
                    <p className="text-text-secondary">
                      At your current intake and activity level, you are projected to lose{' '}
                      <span className="font-semibold text-text-primary">{results.weeklyWeightLoss} kg per week</span>.
                    </p>
                    <p className="text-text-secondary mt-1">
                      In 12 weeks, your weight could be around{' '}
                      <span className="font-semibold text-text-primary">{results.projectedWeightIn12Weeks} kg</span>.
                    </p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Weight Projection Chart */}
      {projectionData.length > 0 && (
        <Card className="bg-surface-primary border-border-primary">
          <CardHeader>
            <CardTitle className="text-text-primary">12-Week Weight Projection</CardTitle>
            <p className="text-text-secondary text-sm">
              The shaded area represents the uncertainty range (±20%) accounting for metabolic adaptation.
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={projectionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border-primary))" />
                  <XAxis 
                    dataKey="week" 
                    stroke="hsl(var(--text-secondary))"
                    tick={{ fill: 'hsl(var(--text-secondary))' }}
                  />
                  <YAxis 
                    domain={['dataMin - 2', 'dataMax + 2']}
                    stroke="hsl(var(--text-secondary))"
                    tick={{ fill: 'hsl(var(--text-secondary))' }}
                    label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft' }}
                  />
                  <Area
                    dataKey="upperBound"
                    stroke="hsl(var(--accent-green-light))"
                    fill="hsl(var(--accent-green-light))"
                    fillOpacity={0.2}
                  />
                  <Area
                    dataKey="lowerBound"
                    stroke="hsl(var(--accent-green-light))"
                    fill="white"
                    fillOpacity={1}
                  />
                  <Line
                    type="monotone"
                    dataKey="projectedWeight"
                    stroke="hsl(var(--accent-green))"
                    strokeWidth={3}
                    dot={false}
                  />
                  <ReferenceLine 
                    y={inputs.currentWeight} 
                    stroke="hsl(var(--text-tertiary))" 
                    strokeDasharray="5 5"
                    label={{ value: "Current Weight", position: "top" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Safety Warnings */}
      {results && results.dailyDeficit > 1000 && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-5 h-5 bg-red-500 rounded-full mt-0.5"></div>
              <div>
                <h3 className="font-semibold text-red-900">Safety Warning</h3>
                <p className="text-red-700 text-sm">
                  Your calorie deficit is very large (over 1000 kcal/day). This may lead to muscle loss, 
                  metabolic slowdown, and nutritional deficiencies. Consider consulting with a healthcare 
                  professional or registered dietitian.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};