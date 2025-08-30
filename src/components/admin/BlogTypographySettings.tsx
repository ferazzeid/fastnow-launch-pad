import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { SiteSettingsService } from '@/services/SiteSettingsService';

interface BlogTypographySettings {
  fontFamily: string;
  headingFontFamily: string;
  baseFontSize: number;
  h1FontSize: number;
  h2FontSize: number;
  h3FontSize: number;
  lineHeight: number;
  letterSpacing: number;
  paragraphSpacing: number;
}

const fontOptions = [
  { value: 'Inter, system-ui, sans-serif', label: 'Inter (Default)' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: 'Times New Roman, serif', label: 'Times New Roman' },
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Helvetica, sans-serif', label: 'Helvetica' },
  { value: 'Roboto, sans-serif', label: 'Roboto' },
  { value: 'Open Sans, sans-serif', label: 'Open Sans' },
  { value: 'Lato, sans-serif', label: 'Lato' },
  { value: 'Montserrat, sans-serif', label: 'Montserrat' },
  { value: 'Playfair Display, serif', label: 'Playfair Display' },
  { value: 'Merriweather, serif', label: 'Merriweather' },
  { value: 'Source Code Pro, monospace', label: 'Source Code Pro' }
];

const BlogTypographySettings = () => {
  const [settings, setSettings] = useState<BlogTypographySettings>({
    fontFamily: 'Inter, system-ui, sans-serif',
    headingFontFamily: 'Inter, system-ui, sans-serif',
    baseFontSize: 16,
    h1FontSize: 32,
    h2FontSize: 24,
    h3FontSize: 20,
    lineHeight: 1.6,
    letterSpacing: 0,
    paragraphSpacing: 16
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    applyTypographyPreview();
  }, [settings]);

  const loadSettings = async () => {
    try {
      const savedSettings = await SiteSettingsService.getSetting('blog_typography');
      if (savedSettings && typeof savedSettings === 'object') {
        setSettings(prev => ({ ...prev, ...savedSettings }));
      }
    } catch (error) {
      console.error('Error loading blog typography settings:', error);
    }
  };

  const applyTypographyPreview = () => {
    const root = document.documentElement;
    
    // Apply CSS custom properties for blog content
    root.style.setProperty('--blog-font-family', settings.fontFamily);
    root.style.setProperty('--blog-heading-font-family', settings.headingFontFamily);
    root.style.setProperty('--blog-base-font-size', `${settings.baseFontSize}px`);
    root.style.setProperty('--blog-h1-font-size', `${settings.h1FontSize}px`);
    root.style.setProperty('--blog-h2-font-size', `${settings.h2FontSize}px`);
    root.style.setProperty('--blog-h3-font-size', `${settings.h3FontSize}px`);
    root.style.setProperty('--blog-line-height', settings.lineHeight.toString());
    root.style.setProperty('--blog-letter-spacing', `${settings.letterSpacing}px`);
    root.style.setProperty('--blog-paragraph-spacing', `${settings.paragraphSpacing}px`);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const success = await SiteSettingsService.setSetting('blog_typography', settings);
      if (success) {
        toast.success('Blog typography settings saved successfully!');
      } else {
        toast.error('Failed to save typography settings');
      }
    } catch (error) {
      console.error('Error saving blog typography settings:', error);
      toast.error('Failed to save typography settings');
    } finally {
      setIsLoading(false);
    }
  };

  const resetToDefaults = () => {
    setSettings({
      fontFamily: 'Inter, system-ui, sans-serif',
      headingFontFamily: 'Inter, system-ui, sans-serif',
      baseFontSize: 16,
      h1FontSize: 32,
      h2FontSize: 24,
      h3FontSize: 20,
      lineHeight: 1.6,
      letterSpacing: 0,
      paragraphSpacing: 16
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Blog Typography</CardTitle>
        <CardDescription>Customize the typography for your blog posts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Font Families */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fontFamily">Body Font</Label>
            <Select value={settings.fontFamily} onValueChange={(value) => setSettings(prev => ({ ...prev, fontFamily: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontOptions.map(font => (
                  <SelectItem key={font.value} value={font.value}>
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="headingFontFamily">Heading Font</Label>
            <Select value={settings.headingFontFamily} onValueChange={(value) => setSettings(prev => ({ ...prev, headingFontFamily: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontOptions.map(font => (
                  <SelectItem key={font.value} value={font.value}>
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Font Sizes */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="baseFontSize">Body Size (px)</Label>
            <Input
              id="baseFontSize"
              type="number"
              min="12"
              max="24"
              value={settings.baseFontSize}
              onChange={(e) => setSettings(prev => ({ ...prev, baseFontSize: parseInt(e.target.value) || 16 }))}
            />
          </div>
          <div>
            <Label htmlFor="h1FontSize">H1 Size (px)</Label>
            <Input
              id="h1FontSize"
              type="number"
              min="20"
              max="60"
              value={settings.h1FontSize}
              onChange={(e) => setSettings(prev => ({ ...prev, h1FontSize: parseInt(e.target.value) || 32 }))}
            />
          </div>
          <div>
            <Label htmlFor="h2FontSize">H2 Size (px)</Label>
            <Input
              id="h2FontSize"
              type="number"
              min="16"
              max="40"
              value={settings.h2FontSize}
              onChange={(e) => setSettings(prev => ({ ...prev, h2FontSize: parseInt(e.target.value) || 24 }))}
            />
          </div>
          <div>
            <Label htmlFor="h3FontSize">H3 Size (px)</Label>
            <Input
              id="h3FontSize"
              type="number"
              min="14"
              max="32"
              value={settings.h3FontSize}
              onChange={(e) => setSettings(prev => ({ ...prev, h3FontSize: parseInt(e.target.value) || 20 }))}
            />
          </div>
        </div>

        {/* Spacing and Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="lineHeight">Line Height</Label>
            <Input
              id="lineHeight"
              type="number"
              min="1.2"
              max="2.0"
              step="0.1"
              value={settings.lineHeight}
              onChange={(e) => setSettings(prev => ({ ...prev, lineHeight: parseFloat(e.target.value) || 1.6 }))}
            />
          </div>
          <div>
            <Label htmlFor="letterSpacing">Letter Spacing (px)</Label>
            <Input
              id="letterSpacing"
              type="number"
              min="-2"
              max="4"
              step="0.5"
              value={settings.letterSpacing}
              onChange={(e) => setSettings(prev => ({ ...prev, letterSpacing: parseFloat(e.target.value) || 0 }))}
            />
          </div>
          <div>
            <Label htmlFor="paragraphSpacing">Paragraph Spacing (px)</Label>
            <Input
              id="paragraphSpacing"
              type="number"
              min="8"
              max="32"
              value={settings.paragraphSpacing}
              onChange={(e) => setSettings(prev => ({ ...prev, paragraphSpacing: parseInt(e.target.value) || 16 }))}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={resetToDefaults}>
            Reset to Defaults
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Typography Settings'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogTypographySettings;