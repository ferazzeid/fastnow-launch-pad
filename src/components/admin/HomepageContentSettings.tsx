import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { FileText, Save } from "lucide-react";

const HomepageContentSettings = () => {
  const [heroTitle, setHeroTitle] = useState<string>('');
  const [heroSubtitle, setHeroSubtitle] = useState<string>('');
  const [heroDescription, setHeroDescription] = useState<string>('');
  const [ctaText, setCtaText] = useState<string>('Launch App');
  const [ctaUrl, setCtaUrl] = useState<string>('https://go.fastnow.app');
  const [protocolCtaText, setProtocolCtaText] = useState<string>('Read the Complete Protocol');

  useEffect(() => {
    // Load existing content
    const savedHeroTitle = localStorage.getItem('fastingApp_homepageHeroTitle');
    const savedHeroSubtitle = localStorage.getItem('fastingApp_homepageHeroSubtitle');
    const savedHeroDescription = localStorage.getItem('fastingApp_homepageHeroDescription');
    const savedCtaText = localStorage.getItem('fastingApp_homepageCtaText');
    const savedCtaUrl = localStorage.getItem('fastingApp_homepageCtaUrl');
    const savedProtocolCtaText = localStorage.getItem('fastingApp_homepageProtocolCtaText');

    if (savedHeroTitle) setHeroTitle(savedHeroTitle);
    if (savedHeroSubtitle) setHeroSubtitle(savedHeroSubtitle);
    if (savedHeroDescription) setHeroDescription(savedHeroDescription);
    if (savedCtaText) setCtaText(savedCtaText);
    if (savedCtaUrl) setCtaUrl(savedCtaUrl);
    if (savedProtocolCtaText) setProtocolCtaText(savedProtocolCtaText);
  }, []);

  const saveContent = () => {
    localStorage.setItem('fastingApp_homepageHeroTitle', heroTitle);
    localStorage.setItem('fastingApp_homepageHeroSubtitle', heroSubtitle);
    localStorage.setItem('fastingApp_homepageHeroDescription', heroDescription);
    localStorage.setItem('fastingApp_homepageCtaText', ctaText);
    localStorage.setItem('fastingApp_homepageCtaUrl', ctaUrl);
    localStorage.setItem('fastingApp_homepageProtocolCtaText', protocolCtaText);
    
    toast.success('Homepage content saved successfully');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText size={20} />
            Homepage Hero Content
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="hero-title">Main Title (H1)</Label>
            <Input
              id="hero-title"
              type="text"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              placeholder="My Fasting Protocol for Fat Loss"
            />
            <p className="text-sm text-muted-foreground mt-1">
              The main headline that appears at the top of the homepage
            </p>
          </div>

          <div>
            <Label htmlFor="hero-subtitle">Subtitle</Label>
            <Input
              id="hero-subtitle"
              type="text"
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              placeholder="(That Actually Worked)"
            />
            <p className="text-sm text-muted-foreground mt-1">
              The smaller text that appears next to the main title
            </p>
          </div>

          <div>
            <Label htmlFor="hero-description">Description Text</Label>
            <Textarea
              id="hero-description"
              value={heroDescription}
              onChange={(e) => setHeroDescription(e.target.value)}
              placeholder="After years of trying and failing with generalized advice..."
              rows={4}
            />
            <p className="text-sm text-muted-foreground mt-1">
              The paragraph text below the title. Use \n for line breaks.
            </p>
          </div>

          <div>
            <Label htmlFor="cta-text">Launch App Button Text</Label>
            <Input
              id="cta-text"
              type="text"
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              placeholder="Launch App"
            />
          </div>

          <div>
            <Label htmlFor="cta-url">Launch App Button URL</Label>
            <Input
              id="cta-url"
              type="url"
              value={ctaUrl}
              onChange={(e) => setCtaUrl(e.target.value)}
              placeholder="https://go.fastnow.app"
            />
          </div>

          <div>
            <Label htmlFor="protocol-cta-text">Protocol Button Text</Label>
            <Input
              id="protocol-cta-text"
              type="text"
              value={protocolCtaText}
              onChange={(e) => setProtocolCtaText(e.target.value)}
              placeholder="Read the Complete Protocol"
            />
          </div>

          <Button onClick={saveContent} className="w-full">
            <Save size={16} className="mr-2" />
            Save Homepage Content
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomepageContentSettings;