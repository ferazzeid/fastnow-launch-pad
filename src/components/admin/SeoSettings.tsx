
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { Input } from "@/components/ui/input";

const SeoSettings: React.FC = () => {
  const [metaTitle, setMetaTitle] = useState(
    localStorage.getItem('fastingApp_metaTitle') || 'fastnow.app - Intermittent Fasting Made Simple'
  );
  const [metaDescription, setMetaDescription] = useState(
    localStorage.getItem('fastingApp_metaDescription') || 'Track your fasting periods with our minimalist, intuitive app. Download fastnow.app today and transform your health through fasting.'
  );
  
  const handleSeoUpdate = () => {
    localStorage.setItem('fastingApp_metaTitle', metaTitle);
    localStorage.setItem('fastingApp_metaDescription', metaDescription);
    toast.success("SEO settings updated successfully");
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>SEO Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="meta-title">Meta Title</Label>
          <Input 
            id="meta-title" 
            value={metaTitle} 
            onChange={(e) => setMetaTitle(e.target.value)} 
            placeholder="fastnow.app - Intermittent Fasting Made Simple"
          />
          <p className="text-xs text-muted-foreground">
            Recommended length: 50-60 characters
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="meta-description">Meta Description</Label>
          <Input 
            id="meta-description" 
            value={metaDescription} 
            onChange={(e) => setMetaDescription(e.target.value)} 
            placeholder="Track your fasting periods with our minimalist app..."
          />
          <p className="text-xs text-muted-foreground">
            Recommended length: 150-160 characters
          </p>
        </div>
        
        <div className="pt-2">
          <Button onClick={handleSeoUpdate}>Save SEO Settings</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SeoSettings;
