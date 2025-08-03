
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { SiteSettingsService } from '@/services/SiteSettingsService';
import { SupabaseAuthService } from '@/services/SupabaseAuthService';

const AdminDesign = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('#10B981');
  const [secondaryColor, setSecondaryColor] = useState('#6B7280');
  const [fontFamily, setFontFamily] = useState('inter');
  const [fontSize, setFontSize] = useState('medium');
  const [theme, setTheme] = useState('light');

  // Real-time preview effect
  useEffect(() => {
    const previewColors = { primary: primaryColor, secondary: secondaryColor };
    SiteSettingsService.applyDesignColors(previewColors);
  }, [primaryColor, secondaryColor]);

  useEffect(() => {
    const checkAuth = async () => {
      const session = await SupabaseAuthService.getCurrentSession();
      if (!session?.user) {
        navigate('/admin/login');
        return;
      }
      
      const isAdmin = await SupabaseAuthService.hasAdminRole(session.user.id);
      if (!isAdmin) {
        navigate('/admin/login');
        return;
      }
      
      setIsAuthenticated(true);

      // Load existing design settings from database
      const settings = await SiteSettingsService.getSetting('design_colors');
      if (settings && typeof settings === 'object' && 'primary' in settings && 'secondary' in settings) {
        const colors = settings as { primary: string; secondary: string };
        setPrimaryColor(colors.primary || '#10B981');
        setSecondaryColor(colors.secondary || '#6B7280');
      }
    };
    
    checkAuth();
  }, [navigate]);


  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const colorSettings = {
        primary: primaryColor,
        secondary: secondaryColor
      };
      
      console.log('Saving color settings:', colorSettings);
      
      const success = await SiteSettingsService.setSetting('design_colors', colorSettings);
      
      if (success) {
        // Colors are already applied via the real-time preview effect
        console.log('Design settings saved successfully');
        toast.success("Design settings saved successfully");
      } else {
        console.error('Failed to save design settings');
        toast.error("Failed to save design settings. Please check console for details.");
      }
    } catch (error) {
      console.error('Error in handleSave:', error);
      toast.error("Error saving design settings: " + (error as Error).message);
    }
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
