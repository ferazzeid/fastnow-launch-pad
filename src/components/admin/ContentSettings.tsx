
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { Input } from "@/components/ui/input";

const ContentSettings: React.FC = () => {
  const [heroTitle, setHeroTitle] = useState(localStorage.getItem('fastingApp_heroTitle') || 'Get things done,\nfaster than ever.');
  const [heroSubtitle, setHeroSubtitle] = useState(localStorage.getItem('fastingApp_heroSubtitle') || 'The minimalist fasting app designed to streamline your fasting journey and boost your health in days.');
  const [ctaTitle, setCtaTitle] = useState(localStorage.getItem('fastingApp_ctaTitle') || 'Ready to start your fasting journey?');
  const [ctaSubtitle, setCtaSubtitle] = useState(localStorage.getItem('fastingApp_ctaSubtitle') || 'Download fastnow.app today and transform your health through fasting.');

  const handleContentUpdate = () => {
    localStorage.setItem('fastingApp_heroTitle', heroTitle);
    localStorage.setItem('fastingApp_heroSubtitle', heroSubtitle);
    localStorage.setItem('fastingApp_ctaTitle', ctaTitle);
    localStorage.setItem('fastingApp_ctaSubtitle', ctaSubtitle);
    toast.success("Content updated successfully");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Main Content Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="hero-title">Hero Title (H1)</Label>
          <Input 
            id="hero-title" 
            value={heroTitle} 
            onChange={(e) => setHeroTitle(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">Use \n for line breaks</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="hero-subtitle">Hero Subtitle (H2)</Label>
          <Input 
            id="hero-subtitle" 
            value={heroSubtitle} 
            onChange={(e) => setHeroSubtitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cta-title">CTA Section Title (H3)</Label>
          <Input 
            id="cta-title" 
            value={ctaTitle} 
            onChange={(e) => setCtaTitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cta-subtitle">CTA Section Subtitle</Label>
          <Input 
            id="cta-subtitle" 
            value={ctaSubtitle} 
            onChange={(e) => setCtaSubtitle(e.target.value)}
          />
        </div>

        <Button onClick={handleContentUpdate}>Save Content</Button>
      </CardContent>
    </Card>
  );
};

export default ContentSettings;
