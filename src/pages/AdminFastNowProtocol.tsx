import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { ImageUploadService } from '@/services/ImageUploadService';

const AdminFastNowProtocol = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  
  // Phase 1 content
  const [phase1Title, setPhase1Title] = useState('');
  const [phase1Duration, setPhase1Duration] = useState('');
  const [phase1Purpose, setPhase1Purpose] = useState('');
  const [phase1Instructions, setPhase1Instructions] = useState('');
  const [phase1Details, setPhase1Details] = useState('');
  
  // Phase 2 content
  const [phase2Title, setPhase2Title] = useState('');
  const [phase2Duration, setPhase2Duration] = useState('');
  const [phase2CarbCap, setPhase2CarbCap] = useState('');
  const [phase2Deficit, setPhase2Deficit] = useState('');
  const [phase2WhyDeficit, setPhase2WhyDeficit] = useState('');
  const [phase2HowToSet, setPhase2HowToSet] = useState('');
  const [phase2WhatToEat, setPhase2WhatToEat] = useState('');
  const [phase2Tracking, setPhase2Tracking] = useState('');
  const [phase2Recovery, setPhase2Recovery] = useState('');
  
  // Phase 3 content
  const [phase3Title, setPhase3Title] = useState('');
  const [phase3Rule, setPhase3Rule] = useState('');
  const [phase3Why, setPhase3Why] = useState('');
  const [phase3HowToFit, setPhase3HowToFit] = useState('');
  
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/admin/login');
      return;
    }

    if (user && isAdmin) {
      loadContent();
    }
  }, [user, isAdmin, authLoading, navigate]);

  const loadContent = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_key, setting_value')
        .in('setting_key', [
          'protocol_title', 'protocol_subtitle', 'protocol_content', 'protocol_featured_image',
          'protocol_meta_title', 'protocol_meta_description',
          'protocol_phase1_title', 'protocol_phase1_duration', 'protocol_phase1_purpose', 
          'protocol_phase1_instructions', 'protocol_phase1_details',
          'protocol_phase2_title', 'protocol_phase2_duration', 'protocol_phase2_carb_cap',
          'protocol_phase2_deficit', 'protocol_phase2_why_deficit', 'protocol_phase2_how_to_set',
          'protocol_phase2_what_to_eat', 'protocol_phase2_tracking', 'protocol_phase2_recovery',
          'protocol_phase3_title', 'protocol_phase3_rule', 'protocol_phase3_why', 'protocol_phase3_how_to_fit'
        ]);

      if (error) throw error;

      const settings = data?.reduce((acc, item) => {
        const value = item.setting_value;
        try {
          acc[item.setting_key] = typeof value === 'string' ? JSON.parse(value || '""') : String(value || '');
        } catch {
          acc[item.setting_key] = String(value || '');
        }
        return acc;
      }, {} as Record<string, string>) || {};

      setTitle(settings.protocol_title || '');
      setSubtitle(settings.protocol_subtitle || '');
      setContent(settings.protocol_content || '');
      setFeaturedImage(settings.protocol_featured_image || '');
      setMetaTitle(settings.protocol_meta_title || '');
      setMetaDescription(settings.protocol_meta_description || '');
      
      // Phase 1
      setPhase1Title(settings.protocol_phase1_title || '3-Day Initiation Water Fast');
      setPhase1Duration(settings.protocol_phase1_duration || '72 hours (3 full days). My personal sweet spot is 60 hours.');
      setPhase1Purpose(settings.protocol_phase1_purpose || 'Flip the fat-burning switch (ketosis), break the carb/insulin cycle, dump water for momentum, and set the stage so Phase 2 actually works.');
      setPhase1Instructions(settings.protocol_phase1_instructions || 'Drink water and black coffee. No food.');
      setPhase1Details(settings.protocol_phase1_details || 'Day 1 / Night 1: most people can push through; you\'re mostly burning stored sugar.\n\nDay 2 / Night 2: this is the test. Sleep often goes bad, cravings scream, and you negotiate with yourself. Anyone who has quit a serious habit knows this night. Make it through Night 2 and you\'ve done the real work; this is where the shift happens.\n\n60 hours is my ignite point. Some go to 72. Past 60, everything else becomes child\'s play compared to Night 2.');
      
      // Phase 2
      setPhase2Title(settings.protocol_phase2_title || 'Strict Simple Diet + Daily Calorie Limit');
      setPhase2Duration(settings.protocol_phase2_duration || '30–60 days minimum.');
      setPhase2CarbCap(settings.protocol_phase2_carb_cap || '≤ 20–30g net carbs/day.');
      setPhase2Deficit(settings.protocol_phase2_deficit || '~1,000 kcal');
      setPhase2WhyDeficit(settings.protocol_phase2_why_deficit || 'Because you need visible progress fast to keep going. With 250–500 kcal/day, a tiny misstep erases a week, clothes don\'t change, and motivation dies right when you need proof it\'s working. A bigger daily deficit gives you results you can feel in weeks 1–3, not in a year.');
      setPhase2HowToSet(settings.protocol_phase2_how_to_set || 'Baseline burn (BMR): from sex, age, height, weight.\nAdd activity: almost none / light / medium / high (daily life can add ~300–500+ kcal).\nIntake: (BMR + activity) – 1,000 = your calories to eat.\nExample: total burn ≈ 2,500 → eat ≈ 1,500 kcal');
      setPhase2WhatToEat(settings.protocol_phase2_what_to_eat || 'OK: cheese, sausage, eggs, cold cuts, fish, meat; cucumbers, pickles, plain yogurt.\nDrinks: water, coffee. I personally use Coke Zero / Pepsi Max / Cola Light.\nAvoid: bread, rice, noodles, potatoes, fruit, carrots, tomatoes, oil, and everything else outside the above list.');
      setPhase2Tracking(settings.protocol_phase2_tracking || 'Track every single thing—in the app or on paper. If you "keep it in your head," you will drift. Example: you do everything right, then at night you add a salmon steak "because it\'s healthy." You just blew 600–700 kcal, and your perfect day became a 300 kcal deficit.');
      setPhase2Recovery(settings.protocol_phase2_recovery || 'If you overeat, you still have Phase 3. Walk it off to claw back the deficit the same day.');
      
      // Phase 3
      setPhase3Title(settings.protocol_phase3_title || 'Daily Walking');
      setPhase3Rule(settings.protocol_phase3_rule || '1.5 hours every day (non-negotiable).');
      setPhase3Why(settings.protocol_phase3_why || '~500 kcal/day for many people, better mood, stable energy, and it\'s the simplest thing most people will actually do consistently.');
      setPhase3HowToFit(settings.protocol_phase3_how_to_fit || 'Split it up: 45 minutes in the morning, 45 minutes in the evening. Listen to podcasts, audiobooks, or music. Make it your thinking time.');
    } catch (error) {
      console.error('Error loading content:', error);
      toast.error('Failed to load content');
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const updates = [
        { setting_key: 'protocol_title', setting_value: JSON.stringify(title) },
        { setting_key: 'protocol_subtitle', setting_value: JSON.stringify(subtitle) },
        { setting_key: 'protocol_content', setting_value: JSON.stringify(content) },
        { setting_key: 'protocol_featured_image', setting_value: JSON.stringify(featuredImage) },
        { setting_key: 'protocol_meta_title', setting_value: JSON.stringify(metaTitle) },
        { setting_key: 'protocol_meta_description', setting_value: JSON.stringify(metaDescription) },
        
        // Phase 1
        { setting_key: 'protocol_phase1_title', setting_value: JSON.stringify(phase1Title) },
        { setting_key: 'protocol_phase1_duration', setting_value: JSON.stringify(phase1Duration) },
        { setting_key: 'protocol_phase1_purpose', setting_value: JSON.stringify(phase1Purpose) },
        { setting_key: 'protocol_phase1_instructions', setting_value: JSON.stringify(phase1Instructions) },
        { setting_key: 'protocol_phase1_details', setting_value: JSON.stringify(phase1Details) },
        
        // Phase 2
        { setting_key: 'protocol_phase2_title', setting_value: JSON.stringify(phase2Title) },
        { setting_key: 'protocol_phase2_duration', setting_value: JSON.stringify(phase2Duration) },
        { setting_key: 'protocol_phase2_carb_cap', setting_value: JSON.stringify(phase2CarbCap) },
        { setting_key: 'protocol_phase2_deficit', setting_value: JSON.stringify(phase2Deficit) },
        { setting_key: 'protocol_phase2_why_deficit', setting_value: JSON.stringify(phase2WhyDeficit) },
        { setting_key: 'protocol_phase2_how_to_set', setting_value: JSON.stringify(phase2HowToSet) },
        { setting_key: 'protocol_phase2_what_to_eat', setting_value: JSON.stringify(phase2WhatToEat) },
        { setting_key: 'protocol_phase2_tracking', setting_value: JSON.stringify(phase2Tracking) },
        { setting_key: 'protocol_phase2_recovery', setting_value: JSON.stringify(phase2Recovery) },
        
        // Phase 3
        { setting_key: 'protocol_phase3_title', setting_value: JSON.stringify(phase3Title) },
        { setting_key: 'protocol_phase3_rule', setting_value: JSON.stringify(phase3Rule) },
        { setting_key: 'protocol_phase3_why', setting_value: JSON.stringify(phase3Why) },
        { setting_key: 'protocol_phase3_how_to_fit', setting_value: JSON.stringify(phase3HowToFit) }
      ];

      for (const update of updates) {
        const { error } = await supabase
          .from('site_settings')
          .upsert(update);
        
        if (error) throw error;
      }

      toast.success('Protocol content updated successfully!');
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Failed to save content');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await ImageUploadService.uploadImage(file, 'page-images');
      setFeaturedImage(result.url);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFeaturedImage('');
    toast.success('Image removed');
  };

  if (authLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Edit FastNow Protocol Page</h1>
          <p className="text-gray-600 mt-2">Manage the content of the FastNow Protocol page</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/admin')}>
          Back to Admin
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Protocol Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* SEO Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">SEO Settings</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="SEO meta title (recommended: 50-60 characters)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="SEO meta description (recommended: 150-160 characters)"
                  className="min-h-[80px]"
                />
              </div>
            </div>
          </div>

          {/* Basic Page Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Page Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Page Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter page title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subtitle">Page Subtitle</Label>
                <Input
                  id="subtitle"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Enter page subtitle"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Custom Content (Optional)</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter custom content to replace the default 3-phase protocol. Leave empty to show the structured phases below."
                className="min-h-[120px]"
              />
              <p className="text-sm text-gray-500">
                If you add content here, it will replace the 3-phase structure below. Leave empty to use the structured phases.
              </p>
            </div>
          </div>

          {/* Phase 1 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-600">Phase 1: 3-Day Fast</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phase1Title">Phase 1 Title</Label>
                <Input
                  id="phase1Title"
                  value={phase1Title}
                  onChange={(e) => setPhase1Title(e.target.value)}
                  placeholder="Phase 1 title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phase1Duration">Duration</Label>
                <Input
                  id="phase1Duration"
                  value={phase1Duration}
                  onChange={(e) => setPhase1Duration(e.target.value)}
                  placeholder="Duration description"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phase1Purpose">Purpose</Label>
              <Textarea
                id="phase1Purpose"
                value={phase1Purpose}
                onChange={(e) => setPhase1Purpose(e.target.value)}
                placeholder="Why this phase matters"
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phase1Instructions">Instructions</Label>
              <Textarea
                id="phase1Instructions"
                value={phase1Instructions}
                onChange={(e) => setPhase1Instructions(e.target.value)}
                placeholder="What to do"
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phase1Details">Detailed Timeline</Label>
              <Textarea
                id="phase1Details"
                value={phase1Details}
                onChange={(e) => setPhase1Details(e.target.value)}
                placeholder="Day-by-day breakdown and what happens"
                className="min-h-[120px]"
              />
            </div>
          </div>

          {/* Phase 2 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-600">Phase 2: Strict Diet</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phase2Title">Phase 2 Title</Label>
                <Input
                  id="phase2Title"
                  value={phase2Title}
                  onChange={(e) => setPhase2Title(e.target.value)}
                  placeholder="Phase 2 title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phase2Duration">Duration</Label>
                <Input
                  id="phase2Duration"
                  value={phase2Duration}
                  onChange={(e) => setPhase2Duration(e.target.value)}
                  placeholder="Duration"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phase2CarbCap">Carb Cap</Label>
                <Input
                  id="phase2CarbCap"
                  value={phase2CarbCap}
                  onChange={(e) => setPhase2CarbCap(e.target.value)}
                  placeholder="Daily carb limit"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phase2Deficit">Daily Deficit</Label>
                <Input
                  id="phase2Deficit"
                  value={phase2Deficit}
                  onChange={(e) => setPhase2Deficit(e.target.value)}
                  placeholder="Calorie deficit"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phase2WhyDeficit">Why This Deficit?</Label>
              <Textarea
                id="phase2WhyDeficit"
                value={phase2WhyDeficit}
                onChange={(e) => setPhase2WhyDeficit(e.target.value)}
                placeholder="Explanation of why this deficit works"
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phase2HowToSet">How to Set Your Limit</Label>
              <Textarea
                id="phase2HowToSet"
                value={phase2HowToSet}
                onChange={(e) => setPhase2HowToSet(e.target.value)}
                placeholder="Instructions for calculating calorie limits"
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phase2WhatToEat">What to Eat</Label>
              <Textarea
                id="phase2WhatToEat"
                value={phase2WhatToEat}
                onChange={(e) => setPhase2WhatToEat(e.target.value)}
                placeholder="Food guidelines - what's OK, what to avoid"
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phase2Tracking">Tracking Guidelines</Label>
              <Textarea
                id="phase2Tracking"
                value={phase2Tracking}
                onChange={(e) => setPhase2Tracking(e.target.value)}
                placeholder="Why and how to track everything"
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phase2Recovery">Recovery Strategy</Label>
              <Textarea
                id="phase2Recovery"
                value={phase2Recovery}
                onChange={(e) => setPhase2Recovery(e.target.value)}
                placeholder="What to do if you overeat"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* Phase 3 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-orange-600">Phase 3: Daily Walking</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phase3Title">Phase 3 Title</Label>
                <Input
                  id="phase3Title"
                  value={phase3Title}
                  onChange={(e) => setPhase3Title(e.target.value)}
                  placeholder="Phase 3 title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phase3Rule">Daily Rule</Label>
                <Input
                  id="phase3Rule"
                  value={phase3Rule}
                  onChange={(e) => setPhase3Rule(e.target.value)}
                  placeholder="Daily walking requirement"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phase3Why">Why Walking?</Label>
              <Textarea
                id="phase3Why"
                value={phase3Why}
                onChange={(e) => setPhase3Why(e.target.value)}
                placeholder="Benefits and reasons for daily walking"
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phase3HowToFit">How to Fit It In</Label>
              <Textarea
                id="phase3HowToFit"
                value={phase3HowToFit}
                onChange={(e) => setPhase3HowToFit(e.target.value)}
                placeholder="Practical tips for fitting walking into daily routine"
                className="min-h-[80px]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Featured Image</Label>
            {featuredImage ? (
              <div className="space-y-2">
                <img 
                  src={featuredImage} 
                  alt="Featured" 
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRemoveImage}
                  className="w-full"
                >
                  Remove Image
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="hidden"
                  id="featured-image"
                />
                <Label htmlFor="featured-image" className="cursor-pointer">
                  <div className="text-gray-500">
                    {isUploading ? 'Uploading...' : 'Click to upload featured image'}
                  </div>
                </Label>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <Button onClick={handleSave} disabled={isLoading || isUploading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button variant="outline" onClick={() => window.open('/fast-now-protocol', '_blank')}>
              Preview Page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminFastNowProtocol;