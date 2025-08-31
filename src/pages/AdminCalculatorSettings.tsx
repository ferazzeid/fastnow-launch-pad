import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageSEOService } from '@/services/PageSEOService';
import { toast } from 'sonner';
import { Calculator, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CalculatorSEOSettings {
  page_title: string;
  page_description: string;
  meta_title: string;
  meta_description: string;
  is_indexed: boolean;
}

const AdminCalculatorSettings: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [walkingCalculator, setWalkingCalculator] = useState<CalculatorSEOSettings>({
    page_title: '',
    page_description: '',
    meta_title: '',
    meta_description: '',
    is_indexed: true
  });
  
  const [weightLossCalculator, setWeightLossCalculator] = useState<CalculatorSEOSettings>({
    page_title: '',
    page_description: '',
    meta_title: '',
    meta_description: '',
    is_indexed: true
  });

  useEffect(() => {
    if (user) {
      loadCalculatorSettings();
    }
  }, [user]);

  const loadCalculatorSettings = async () => {
    try {
      const pages = await PageSEOService.getAllPageSettings();
      
      const walkingPage = pages.find(p => p.page_path === '/walking-calculator');
      const weightLossPage = pages.find(p => p.page_path === '/weight-loss-calculator');
      
      if (walkingPage) {
        setWalkingCalculator({
          page_title: walkingPage.page_title,
          page_description: walkingPage.page_description || '',
          meta_title: walkingPage.meta_title || '',
          meta_description: walkingPage.meta_description || '',
          is_indexed: walkingPage.is_indexed
        });
      }
      
      if (weightLossPage) {
        setWeightLossCalculator({
          page_title: weightLossPage.page_title,
          page_description: weightLossPage.page_description || '',
          meta_title: weightLossPage.meta_title || '',
          meta_description: weightLossPage.meta_description || '',
          is_indexed: weightLossPage.is_indexed
        });
      }
    } catch (error) {
      console.error('Error loading calculator settings:', error);
      toast.error('Failed to load calculator settings');
    } finally {
      setLoading(false);
    }
  };

  const saveWalkingCalculator = async () => {
    setSaving(true);
    try {
      await PageSEOService.updatePageSEOContent('/walking-calculator', walkingCalculator);
      toast.success('Walking calculator settings saved successfully');
    } catch (error) {
      console.error('Error saving walking calculator:', error);
      toast.error('Failed to save walking calculator settings');
    } finally {
      setSaving(false);
    }
  };

  const saveWeightLossCalculator = async () => {
    setSaving(true);
    try {
      await PageSEOService.updatePageSEOContent('/weight-loss-calculator', weightLossCalculator);
      toast.success('Weight loss calculator settings saved successfully');
    } catch (error) {
      console.error('Error saving weight loss calculator:', error);
      toast.error('Failed to save weight loss calculator settings');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background-primary p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">Loading calculator settings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-primary">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/admin" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <Calculator className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Calculator Settings</h1>
              <p className="text-muted-foreground">Manage SEO settings for calculator pages</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="walking" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="walking">Walking Calculator</TabsTrigger>
            <TabsTrigger value="weight-loss">Weight Loss Calculator</TabsTrigger>
          </TabsList>

          <TabsContent value="walking">
            <Card>
              <CardHeader>
                <CardTitle>Walking Calculator Settings</CardTitle>
                <CardDescription>
                  Configure SEO and content settings for the walking calculator page
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="walking-title">Page Title</Label>
                      <Input
                        id="walking-title"
                        value={walkingCalculator.page_title}
                        onChange={(e) => setWalkingCalculator(prev => ({ ...prev, page_title: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="walking-meta-title">Meta Title</Label>
                      <Input
                        id="walking-meta-title"
                        value={walkingCalculator.meta_title}
                        onChange={(e) => setWalkingCalculator(prev => ({ ...prev, meta_title: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="walking-description">Page Description</Label>
                      <Textarea
                        id="walking-description"
                        value={walkingCalculator.page_description}
                        onChange={(e) => setWalkingCalculator(prev => ({ ...prev, page_description: e.target.value }))}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="walking-meta-description">Meta Description</Label>
                      <Textarea
                        id="walking-meta-description"
                        value={walkingCalculator.meta_description}
                        onChange={(e) => setWalkingCalculator(prev => ({ ...prev, meta_description: e.target.value }))}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="walking-indexed"
                    checked={walkingCalculator.is_indexed}
                    onCheckedChange={(checked) => setWalkingCalculator(prev => ({ ...prev, is_indexed: checked }))}
                  />
                  <Label htmlFor="walking-indexed">Allow search engine indexing</Label>
                </div>

                <Button onClick={saveWalkingCalculator} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Walking Calculator Settings'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="weight-loss">
            <Card>
              <CardHeader>
                <CardTitle>Weight Loss Calculator Settings</CardTitle>
                <CardDescription>
                  Configure SEO and content settings for the weight loss calculator page
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="weight-title">Page Title</Label>
                      <Input
                        id="weight-title"
                        value={weightLossCalculator.page_title}
                        onChange={(e) => setWeightLossCalculator(prev => ({ ...prev, page_title: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="weight-meta-title">Meta Title</Label>
                      <Input
                        id="weight-meta-title"
                        value={weightLossCalculator.meta_title}
                        onChange={(e) => setWeightLossCalculator(prev => ({ ...prev, meta_title: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="weight-description">Page Description</Label>
                      <Textarea
                        id="weight-description"
                        value={weightLossCalculator.page_description}
                        onChange={(e) => setWeightLossCalculator(prev => ({ ...prev, page_description: e.target.value }))}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="weight-meta-description">Meta Description</Label>
                      <Textarea
                        id="weight-meta-description"
                        value={weightLossCalculator.meta_description}
                        onChange={(e) => setWeightLossCalculator(prev => ({ ...prev, meta_description: e.target.value }))}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="weight-indexed"
                    checked={weightLossCalculator.is_indexed}
                    onCheckedChange={(checked) => setWeightLossCalculator(prev => ({ ...prev, is_indexed: checked }))}
                  />
                  <Label htmlFor="weight-indexed">Allow search engine indexing</Label>
                </div>

                <Button onClick={saveWeightLossCalculator} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Weight Loss Calculator Settings'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminCalculatorSettings;