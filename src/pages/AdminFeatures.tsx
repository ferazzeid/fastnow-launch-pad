
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";

const AdminFeatures = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [features, setFeatures] = useState({
    fastingTimer: true,
    progressTracking: true,
    motivationalContent: true,
    blogSection: true,
    userAccounts: false,
    notifications: true,
    dataExport: false,
    socialSharing: false
  });
  const [customFeature, setCustomFeature] = useState('');
  const [customFeatureDescription, setCustomFeatureDescription] = useState('');

  useEffect(() => {
    const authStatus = localStorage.getItem('fastingApp_auth');
    if (authStatus !== 'true') {
      navigate('/admin');
      return;
    }
    setIsAuthenticated(true);

    // Load existing features
    const savedFeatures = localStorage.getItem('fastingApp_features');
    if (savedFeatures) {
      setFeatures(JSON.parse(savedFeatures));
    }
  }, [navigate]);

  const handleFeatureToggle = (featureName: string, enabled: boolean) => {
    const updatedFeatures = { ...features, [featureName]: enabled };
    setFeatures(updatedFeatures);
    localStorage.setItem('fastingApp_features', JSON.stringify(updatedFeatures));
    toast.success(`${featureName} ${enabled ? 'enabled' : 'disabled'}`);
  };

  const handleAddCustomFeature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customFeature.trim()) return;

    const customFeatures = localStorage.getItem('fastingApp_custom_features');
    const existing = customFeatures ? JSON.parse(customFeatures) : [];
    
    const newFeature = {
      id: Date.now().toString(),
      name: customFeature,
      description: customFeatureDescription,
      enabled: true,
      createdAt: new Date().toISOString()
    };
    
    existing.push(newFeature);
    localStorage.setItem('fastingApp_custom_features', JSON.stringify(existing));
    
    toast.success("Custom feature added");
    setCustomFeature('');
    setCustomFeatureDescription('');
  };

  const handleBack = () => {
    navigate('/admin');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold">Features Management</h1>
          <Button variant="outline" onClick={handleBack}>Back to Admin</Button>
        </div>
      </header>
      
      <main className="container py-8">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Core Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(features).map(([key, enabled]) => (
                <div key={key} className="flex items-center justify-between">
                  <Label htmlFor={key} className="capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </Label>
                  <Switch
                    id={key}
                    checked={enabled}
                    onCheckedChange={(checked) => handleFeatureToggle(key, checked)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add Custom Feature</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddCustomFeature} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customFeature">Feature Name</Label>
                  <Input
                    id="customFeature"
                    value={customFeature}
                    onChange={(e) => setCustomFeature(e.target.value)}
                    placeholder="Enter feature name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customFeatureDescription">Description</Label>
                  <Textarea
                    id="customFeatureDescription"
                    value={customFeatureDescription}
                    onChange={(e) => setCustomFeatureDescription(e.target.value)}
                    placeholder="Describe the feature"
                    rows={3}
                  />
                </div>
                <Button type="submit" className="w-full">Add Feature</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminFeatures;
