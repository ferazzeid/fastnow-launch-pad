import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { FileText, Save } from "lucide-react";
import { pageContentService, PageContent } from '@/services/PageContentService';
import HeroSideImageSettings from './HeroSideImageSettings';

const HomepageContentSettings = () => {
  const [heroTitle, setHeroTitle] = useState<string>('');
  const [heroSubtitle, setHeroSubtitle] = useState<string>('');
  const [heroDescription, setHeroDescription] = useState<string>('');
  const [ctaText, setCtaText] = useState<string>('Launch App');
  const [ctaUrl, setCtaUrl] = useState<string>('https://go.fastnow.app');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const content = await pageContentService.getPageContent('home');
      if (content) {
        setHeroTitle(content.title || '');
        setHeroSubtitle(content.subtitle || '');
        setHeroDescription(content.content || '');
        setCtaText(content.button_text || 'Launch App');
        setCtaUrl(content.button_url || 'https://go.fastnow.app');
      }
    } catch (error) {
      console.error('Error loading homepage content:', error);
    }
  };

  const saveContent = async () => {
    setLoading(true);
    try {
      const content: PageContent = {
        page_key: 'home',
        title: heroTitle,
        subtitle: heroSubtitle,
        content: heroDescription,
        button_text: ctaText,
        button_url: ctaUrl,
        meta_title: `${heroTitle} - FastNow`,
        meta_description: heroSubtitle,
        is_published: true
      };

      const success = await pageContentService.savePageContent(content);
      if (success) {
        toast.success('Homepage content saved successfully');
      } else {
        toast.error('Failed to save homepage content');
      }
    } catch (error) {
      console.error('Error saving homepage content:', error);
      toast.error('Failed to save homepage content');
    } finally {
      setLoading(false);
    }
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


          <Button onClick={saveContent} className="w-full" disabled={loading}>
            <Save size={16} className="mr-2" />
            {loading ? 'Saving...' : 'Save Homepage Content'}
          </Button>
        </CardContent>
      </Card>
      
      <HeroSideImageSettings />
    </div>
  );
};

export default HomepageContentSettings;