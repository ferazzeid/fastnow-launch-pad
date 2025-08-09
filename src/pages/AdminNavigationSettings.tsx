import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { NavigationSettingsService, NavigationSetting } from '@/services/NavigationSettingsService';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { ArrowUpDown } from 'lucide-react';

const AdminNavigationSettings = () => {
  const { isAdmin, isLoading } = useAuth();
  const [navigationSettings, setNavigationSettings] = useState<NavigationSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      loadNavigationSettings();
    }
  }, [isAdmin]);

  const loadNavigationSettings = async () => {
    try {
      const settings = await NavigationSettingsService.getNavigationSettings();
      setNavigationSettings(settings);
    } catch (error) {
      console.error('Error loading navigation settings:', error);
      toast.error('Failed to load navigation settings');
    } finally {
      setLoading(false);
    }
  };

  const handleVisibilityChange = async (pageKey: string, isVisible: boolean) => {
    setSaving(true);
    try {
      const success = await NavigationSettingsService.updateNavigationSetting(pageKey, isVisible);
      if (success) {
        setNavigationSettings(prev => 
          prev.map(setting => 
            setting.page_key === pageKey 
              ? { ...setting, is_visible: isVisible }
              : setting
          )
        );
        toast.success(`Page ${isVisible ? 'enabled' : 'disabled'} in navigation`);
      } else {
        toast.error('Failed to update navigation setting');
      }
    } catch (error) {
      console.error('Error updating navigation setting:', error);
      toast.error('Failed to update navigation setting');
    } finally {
      setSaving(false);
    }
  };

  const handleDisplayOrderChange = async (pageKey: string, newOrder: number) => {
    setSaving(true);
    try {
      const success = await NavigationSettingsService.updateDisplayOrder(pageKey, newOrder);
      if (success) {
        setNavigationSettings(prev => 
          prev.map(setting => 
            setting.page_key === pageKey 
              ? { ...setting, display_order: newOrder }
              : setting
          ).sort((a, b) => a.display_order - b.display_order)
        );
        toast.success('Display order updated');
      } else {
        toast.error('Failed to update display order');
      }
    } catch (error) {
      console.error('Error updating display order:', error);
      toast.error('Failed to update display order');
    } finally {
      setSaving(false);
    }
  };

  const getPageTitle = (pageKey: string) => {
    const titles = {
      'fast-now-protocol': 'The Protocol',
      'about-fastnow-app': 'About App',
      'faq': 'FAQ',
      'about-me': 'Me'
    };
    return titles[pageKey as keyof typeof titles] || pageKey;
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container py-8">
          <div className="text-center">Loading...</div>
        </div>
      </PageLayout>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <PageLayout>
      <Helmet>
        <title>Navigation Settings - Admin | FastNow</title>
        <meta name="description" content="Manage navigation menu visibility and order" />
      </Helmet>
      
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Navigation Settings</h1>
            <p className="text-muted-foreground">
              Control which pages appear in the navigation menu and their order.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Page Visibility</CardTitle>
              <CardDescription>
                Toggle pages on/off in the navigation menu and adjust their display order.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading navigation settings...</div>
              ) : (
                <div className="space-y-6">
                  {navigationSettings.map((setting) => (
                    <div key={setting.page_key} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                          <Input
                            type="number"
                            value={setting.display_order}
                            onChange={(e) => handleDisplayOrderChange(setting.page_key, parseInt(e.target.value) || 0)}
                            className="w-20"
                            min="0"
                            disabled={saving}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`${setting.page_key}-switch`} className="font-medium">
                            {getPageTitle(setting.page_key)}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Path: /{setting.page_key.replace('-', '-')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`${setting.page_key}-switch`} className="text-sm">
                          {setting.is_visible ? 'Visible' : 'Hidden'}
                        </Label>
                        <Switch
                          id={`${setting.page_key}-switch`}
                          checked={setting.is_visible}
                          onCheckedChange={(checked) => handleVisibilityChange(setting.page_key, checked)}
                          disabled={saving}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">Current Status:</h3>
            <ul className="text-sm space-y-1">
              {navigationSettings.map((setting) => (
                <li key={setting.page_key} className="flex justify-between">
                  <span>{getPageTitle(setting.page_key)}</span>
                  <span className={setting.is_visible ? 'text-green-600' : 'text-red-600'}>
                    {setting.is_visible ? 'Visible' : 'Hidden'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AdminNavigationSettings;