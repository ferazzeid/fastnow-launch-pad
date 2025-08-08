import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { pageContentService } from '@/services/PageContentService';
import { toast } from 'sonner';

const AdminNavigationSettings = () => {
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    homepage_transparent_nav: true,
    about_transparent_nav: false,
    faq_transparent_nav: false,
    protocol_transparent_nav: false,
    timeline_transparent_nav: false,
  });

  useEffect(() => {
    if (!isAdmin) {
      window.location.href = '/admin';
      return;
    }
    loadSettings();
  }, [isAdmin]);

  const loadSettings = async () => {
    try {
      const navSettings = await pageContentService.getGeneralSetting('navigation_transparency');
      if (navSettings?.setting_value) {
        setSettings({ ...settings, ...navSettings.setting_value });
      }
    } catch (error) {
      console.error('Error loading navigation settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    try {
      await pageContentService.saveGeneralSetting({
        setting_key: 'navigation_transparency',
        setting_value: settings
      });
      toast.success('Navigation settings saved successfully');
    } catch (error) {
      console.error('Error saving navigation settings:', error);
      toast.error('Failed to save navigation settings');
    }
  };

  if (!isAdmin) {
    return <div>Access Denied</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  const pageSettings = [
    { key: 'homepage_transparent_nav', label: 'Homepage', description: 'Enable transparent navigation on the homepage' },
    { key: 'about_transparent_nav', label: 'About Me', description: 'Enable transparent navigation on the About Me page' },
    { key: 'faq_transparent_nav', label: 'FAQ', description: 'Enable transparent navigation on the FAQ page' },
    { key: 'protocol_transparent_nav', label: 'FastNow Protocol', description: 'Enable transparent navigation on the Protocol page' },
    { key: 'timeline_transparent_nav', label: 'Fasting Timeline', description: 'Enable transparent navigation on the Timeline page' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/admin">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Navigation Settings</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Page Navigation Transparency</CardTitle>
            <CardDescription>
              Configure whether the navigation bar should be transparent on each page. 
              Transparent navigation works best on pages with hero images or dark backgrounds.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {pageSettings.map((setting) => (
              <div key={setting.key} className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor={setting.key} className="text-base font-medium">
                    {setting.label}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {setting.description}
                  </p>
                </div>
                <Switch
                  id={setting.key}
                  checked={settings[setting.key as keyof typeof settings]}
                  onCheckedChange={(checked) => handleSettingChange(setting.key, checked)}
                />
              </div>
            ))}

            <div className="pt-4 border-t">
              <Button onClick={saveSettings} className="w-full">
                Save Navigation Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminNavigationSettings;