
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface GeneralSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  appStoreUrl: string;
  playStoreUrl: string;
  defaultTimezone: string;
  supportUrl: string;
  companyName: string;
}

const AdminGeneral = () => {
  const [settings, setSettings] = useState<GeneralSettings>({
    siteName: 'FastingApp',
    siteDescription: 'Your personal fasting companion',
    contactEmail: 'support@fastingapp.com',
    appStoreUrl: '',
    playStoreUrl: '',
    defaultTimezone: 'UTC',
    supportUrl: '',
    companyName: 'FastingApp Inc.',
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('fastingApp_generalSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error loading general settings:', error);
      }
    }
  }, []);

  const handleInputChange = (field: keyof GeneralSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      localStorage.setItem('fastingApp_generalSettings', JSON.stringify(settings));
      toast.success("General settings saved successfully!");
    } catch (error) {
      console.error('Error saving general settings:', error);
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex justify-between items-center py-4">
          <div className="flex justify-between items-center w-full">
            <Link to="/" className="text-2xl font-bold text-accent-green hover:opacity-80 transition-opacity">
              FastNow
            </Link>
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">General Settings</h1>
              <Link to="/admin">
                <Button variant="outline" size="sm">
                  <ArrowLeft size={16} className="mr-2" />
                  Back to Admin
                </Button>
              </Link>
            </div>
          </div>
          <Button onClick={handleSave} disabled={isLoading}>
            <Save size={16} className="mr-2" />
            {isLoading ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </header>

      <main className="container py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Site Identity */}
          <Card>
            <CardHeader>
              <CardTitle>Site Identity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => handleInputChange('siteName', e.target.value)}
                    placeholder="Your App Name"
                  />
                </div>
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={settings.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder="Your Company Name"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="siteDescription">Site Description</Label>
                <Input
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                  placeholder="Brief description of your app"
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    placeholder="support@yourapp.com"
                  />
                </div>
                <div>
                  <Label htmlFor="supportUrl">Support URL</Label>
                  <Input
                    id="supportUrl"
                    value={settings.supportUrl}
                    onChange={(e) => handleInputChange('supportUrl', e.target.value)}
                    placeholder="https://yourapp.com/support"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* App Store Links */}
          <Card>
            <CardHeader>
              <CardTitle>App Store Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="appStoreUrl">Apple App Store URL</Label>
                  <Input
                    id="appStoreUrl"
                    value={settings.appStoreUrl}
                    onChange={(e) => handleInputChange('appStoreUrl', e.target.value)}
                    placeholder="https://apps.apple.com/..."
                  />
                </div>
                <div>
                  <Label htmlFor="playStoreUrl">Google Play Store URL</Label>
                  <Input
                    id="playStoreUrl"
                    value={settings.playStoreUrl}
                    onChange={(e) => handleInputChange('playStoreUrl', e.target.value)}
                    placeholder="https://play.google.com/store/apps/..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Technical Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="defaultTimezone">Default Timezone</Label>
                <Input
                  id="defaultTimezone"
                  value={settings.defaultTimezone}
                  onChange={(e) => handleInputChange('defaultTimezone', e.target.value)}
                  placeholder="UTC"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminGeneral;
