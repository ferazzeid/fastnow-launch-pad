
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";

const AdminDesign = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('#10B981');
  const [secondaryColor, setSecondaryColor] = useState('#6B7280');
  const [fontFamily, setFontFamily] = useState('inter');
  const [fontSize, setFontSize] = useState('medium');
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const authStatus = localStorage.getItem('fastingApp_auth');
    if (authStatus !== 'true') {
      navigate('/admin');
      return;
    }
    setIsAuthenticated(true);

    // Load existing design settings
    const settings = localStorage.getItem('fastingApp_design_settings');
    if (settings) {
      const parsed = JSON.parse(settings);
      setPrimaryColor(parsed.primaryColor || '#10B981');
      setSecondaryColor(parsed.secondaryColor || '#6B7280');
      setFontFamily(parsed.fontFamily || 'inter');
      setFontSize(parsed.fontSize || 'medium');
      setTheme(parsed.theme || 'light');
    }
  }, [navigate]);

  const applyColors = (primary: string, secondary: string) => {
    // Convert hex to HSL and apply to CSS variables
    const hexToHsl = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;
      
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;
      
      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }
      
      return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
    };

    const root = document.documentElement;
    root.style.setProperty('--primary', hexToHsl(primary));
    root.style.setProperty('--secondary', hexToHsl(secondary));
    root.style.setProperty('--accent-green', hexToHsl(primary));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    const settings = {
      primaryColor,
      secondaryColor,
      fontFamily,
      fontSize,
      theme,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem('fastingApp_design_settings', JSON.stringify(settings));
    
    // Apply colors immediately
    applyColors(primaryColor, secondaryColor);
    
    toast.success("Design settings saved and applied successfully");
  };

  // Apply saved colors on component mount
  useEffect(() => {
    const settings = localStorage.getItem('fastingApp_design_settings');
    if (settings) {
      const parsed = JSON.parse(settings);
      if (parsed.primaryColor && parsed.secondaryColor) {
        applyColors(parsed.primaryColor, parsed.secondaryColor);
      }
    }
  }, []);

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
          <h1 className="text-2xl font-bold">Design Settings</h1>
          <Button variant="outline" onClick={handleBack}>Back to Admin</Button>
        </div>
      </header>
      
      <main className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle>Customize Appearance</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      placeholder="#10B981"
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      placeholder="#6B7280"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="fontFamily">Font Family</Label>
                  <Select value={fontFamily} onValueChange={setFontFamily}>
                    <SelectTrigger id="fontFamily">
                      <SelectValue placeholder="Select font" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inter">Inter</SelectItem>
                      <SelectItem value="roboto">Roboto</SelectItem>
                      <SelectItem value="opensans">Open Sans</SelectItem>
                      <SelectItem value="lato">Lato</SelectItem>
                      <SelectItem value="poppins">Poppins</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fontSize">Font Size</Label>
                  <Select value={fontSize} onValueChange={setFontSize}>
                    <SelectTrigger id="fontSize">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger id="theme">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="auto">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" className="w-full">Save Design Settings</Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDesign;
