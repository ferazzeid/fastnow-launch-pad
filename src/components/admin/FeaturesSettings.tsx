
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { Icons } from '@/components/icons/IconSelector';
import { Input } from "@/components/ui/input";

interface Feature {
  title: string;
  description: string;
  iconName: string;
}

const FeaturesSettings: React.FC = () => {
  const availableIcons = Object.keys(Icons);
  const defaultFeatures = [
    {
      title: "Intermittent Fasting",
      description: "Easily track your fasting periods with our intuitive timer interface.",
      iconName: "SpeedIcon"
    },
    {
      title: "Private & Secure",
      description: "Your health data is encrypted and never shared with third parties.",
      iconName: "SecurityIcon"
    }
  ];

  const [featuresTitle, setFeaturesTitle] = useState(localStorage.getItem('fastingApp_featuresTitle') || 'Why choose fastnow.app?');
  const [features, setFeatures] = useState<Feature[]>(
    JSON.parse(localStorage.getItem('fastingApp_features') || JSON.stringify(defaultFeatures))
  );

  // Ensure we only have two features
  React.useEffect(() => {
    if (features.length > 2) {
      setFeatures(features.slice(0, 2));
    }
  }, [features]);

  const updateFeature = (index: number, field: keyof Feature, value: string) => {
    const updatedFeatures = features.map((feature, i) => 
      i === index ? { ...feature, [field]: value } : feature
    );
    setFeatures(updatedFeatures);
  };

  const handleFeaturesUpdate = () => {
    // Ensure we only save two features
    const twoFeatures = features.slice(0, 2);
    localStorage.setItem('fastingApp_featuresTitle', featuresTitle);
    localStorage.setItem('fastingApp_features', JSON.stringify(twoFeatures));
    toast.success("Features updated successfully");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Features Section Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="features-title">Features Section Title (H3)</Label>
          <Input 
            id="features-title" 
            value={featuresTitle} 
            onChange={(e) => setFeaturesTitle(e.target.value)}
          />
        </div>

        <div className="space-y-6">
          {features.slice(0, 2).map((feature, index) => (
            <div key={index} className="p-4 border rounded-md space-y-3">
              <div className="space-y-2">
                <Label htmlFor={`feature-${index}-title`}>Feature {index + 1} Title</Label>
                <Input 
                  id={`feature-${index}-title`}
                  value={feature.title} 
                  onChange={(e) => updateFeature(index, 'title', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`feature-${index}-desc`}>Feature {index + 1} Description</Label>
                <Input 
                  id={`feature-${index}-desc`}
                  value={feature.description} 
                  onChange={(e) => updateFeature(index, 'description', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`feature-${index}-icon`}>Feature {index + 1} Icon</Label>
                <select 
                  id={`feature-${index}-icon`}
                  value={feature.iconName}
                  onChange={(e) => updateFeature(index, 'iconName', e.target.value)}
                  className="w-full p-2 rounded-md border border-input bg-background"
                >
                  {availableIcons.map(iconName => (
                    <option key={iconName} value={iconName}>
                      {iconName.replace(/Icon$/, '')}
                    </option>
                  ))}
                </select>
                <div className="mt-2 p-2 border rounded flex justify-center">
                  {Icons[feature.iconName]?.({ className: "w-8 h-8" })}
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button onClick={handleFeaturesUpdate}>Save Features</Button>
      </CardContent>
    </Card>
  );
};

export default FeaturesSettings;
