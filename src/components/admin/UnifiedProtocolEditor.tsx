import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { FileText, Save, Search, Clock, Activity, Utensils } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import ProtocolImageUpload from './ProtocolImageUpload';

const UnifiedProtocolEditor = () => {
  // SEO Settings
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [isIndexed, setIsIndexed] = useState(true);
  
  // Hero Content
  const [heroTitle, setHeroTitle] = useState('');
  const [heroContent, setHeroContent] = useState('');
  
  // Phase Content
  const [phase1Title, setPhase1Title] = useState('');
  const [phase1Duration, setPhase1Duration] = useState('');
  const [phase1Purpose, setPhase1Purpose] = useState('');
  const [phase1Instructions, setPhase1Instructions] = useState('');
  const [phase1Details, setPhase1Details] = useState('');
  
  const [phase2Title, setPhase2Title] = useState('');
  const [phase2Duration, setPhase2Duration] = useState('');
  const [phase2CalorieCap, setPhase2CalorieCap] = useState('');
  const [phase2CarbCap, setPhase2CarbCap] = useState('');
  const [phase2Deficit, setPhase2Deficit] = useState('');
  const [phase2WhyDeficit, setPhase2WhyDeficit] = useState('');
  const [phase2HowToSet, setPhase2HowToSet] = useState('');
  const [phase2WhatToEat, setPhase2WhatToEat] = useState('');
  const [phase2Tracking, setPhase2Tracking] = useState('');
  const [phase2Recovery, setPhase2Recovery] = useState('');
  
  const [phase3Title, setPhase3Title] = useState('');
  const [phase3Rule, setPhase3Rule] = useState('');
  const [phase3Why, setPhase3Why] = useState('');
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAllContent();
  }, []);

  const loadAllContent = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_key, setting_value')
        .in('setting_key', [
          'protocol_title', 'protocol_subtitle', 'protocol_content', 
          'protocol_meta_title', 'protocol_meta_description',
          'protocol_phase1_title', 'protocol_phase1_duration', 'protocol_phase1_purpose', 
          'protocol_phase1_instructions', 'protocol_phase1_details',
          'protocol_phase2_title', 'protocol_phase2_duration', 'protocol_phase2_calorie_cap', 'protocol_phase2_carb_cap',
          'protocol_phase2_deficit', 'protocol_phase2_why_deficit', 'protocol_phase2_how_to_set',
          'protocol_phase2_what_to_eat', 'protocol_phase2_tracking', 'protocol_phase2_recovery',
          'protocol_phase3_title', 'protocol_phase3_rule', 'protocol_phase3_why'
        ]);

      if (error) {
        console.error('Error fetching protocol settings:', error);
        return;
      }

      const settings = data?.reduce((acc, item) => {
        const value = item.setting_value;
        try {
          acc[item.setting_key] = typeof value === 'string' ? JSON.parse(value || '""') : String(value || '');
        } catch {
          acc[item.setting_key] = String(value || '');
        }
        return acc;
      }, {} as Record<string, string>) || {};

      // Load current content
      setMetaTitle(settings.protocol_meta_title || 'The FastNow Protocol | FastNow');
      setMetaDescription(settings.protocol_meta_description || 'Learn how I lost fat with a 3-day fast plus calorie control using the FastNow Protocol');
      setHeroTitle(settings.protocol_title || 'The FastNow Protocol');
      setHeroContent(settings.protocol_content || `Most programs tell you to do a little bit every day, wait a year or two, and call it "healthy and steady." The logic is fine — but if I don't see results quickly, I lose interest.

I'd rather put in serious energy at the start, get solid results in the first 2–12 weeks, and build momentum I can ride. Once that momentum is there, I can ease into something sustainable. But without an early push, everyday life takes over — and the goal slips away.`);
      
      // Phase 1
      setPhase1Title(settings.protocol_phase1_title || '3-Day Initiation Water Fast');
      setPhase1Duration(settings.protocol_phase1_duration || '60 hours');
      setPhase1Purpose(settings.protocol_phase1_purpose || 'Flip the fat-burning switch (ketosis), break the carb/insulin cycle, dump water for momentum, and set the stage so Phase 2 actually works.');
      setPhase1Instructions(settings.protocol_phase1_instructions || 'Drink water and black coffee. No food.');
      setPhase1Details(settings.protocol_phase1_details || 'Night Zero: The easiest to start a water fast is to start at night after eating and then go to sleep and that\'s the first 10 hours of fasting that you have under your belt and that creates momentum to continue next day.\n\nDay 1 / Night 1: most people can push through; you\'re mostly burning stored sugar.\n\nDay 2 / Night 2: this is the test. Sleep often goes bad, cravings scream, and you negotiate with yourself. Anyone who has quit a serious habit knows this night. Make it through Night 2 and you\'ve done the real work; this is where the shift happens.');
      
      // Phase 2
      setPhase2Title(settings.protocol_phase2_title || 'Strict Simple Diet');
      setPhase2Duration(settings.protocol_phase2_duration || '30–60 days minimum.');
      setPhase2CalorieCap(settings.protocol_phase2_calorie_cap || '1500 calories or 2000 if you walk that day 90 minutes');
      setPhase2CarbCap(settings.protocol_phase2_carb_cap || '≤ 30g net carbs/day.');
      setPhase2Deficit(settings.protocol_phase2_deficit || 'Calorie deficit ideally 1000 calories (120 grams of fat)');
      setPhase2WhyDeficit(settings.protocol_phase2_why_deficit || 'Because you need visible progress fast to keep going. With 250–500 kcal/day, a tiny misstep erases a week, clothes don\'t change, and motivation dies right when you need proof it\'s working. A bigger daily deficit gives you results you can feel in weeks 1–3, not in a year.');
      setPhase2HowToSet(settings.protocol_phase2_how_to_set || 'Baseline burn (BMR): from sex, age, height, weight.\nAdd activity: almost none / light / medium / high (daily life can add ~300–500+ kcal).\nIntake: (BMR + activity) – 1,000 = your calories to eat.\nExample: total burn ≈ 2,500 → eat ≈ 1,500 kcal');
      setPhase2WhatToEat(settings.protocol_phase2_what_to_eat || 'OK: cheese, sausage, eggs, cold cuts, fish, meat; cucumbers, pickles, plain yogurt.\nDrinks: water, coffee. I personally use Coke Zero / Pepsi Max / Cola Light.\nAvoid: bread, rice, noodles, potatoes, fruit, carrots, tomatoes, oil, and everything else outside the above list.');
      setPhase2Tracking(settings.protocol_phase2_tracking || 'Track every single thing—in the app or on paper. If you "keep it in your head," you will drift. Example: you do everything right, then at night you add a salmon steak "because it\'s healthy." You just blew 600–700 kcal, and your perfect day became a 300 kcal deficit.');
      setPhase2Recovery(settings.protocol_phase2_recovery || 'If you overeat, you still have Phase 3. Walk it off to claw back the deficit the same day.');
      
      // Phase 3
      setPhase3Title(settings.protocol_phase3_title || 'Daily Walking');
      setPhase3Rule(settings.protocol_phase3_rule || '90 minutes every day (non-negotiable).');
      setPhase3Why(settings.protocol_phase3_why || '~500 kcal/day for many people, better mood, stable energy, and it\'s the simplest thing most people will actually do consistently.');
      
    } catch (error) {
      console.error('Error loading protocol content:', error);
      toast.error('Failed to load protocol content');
    }
  };

  const saveAllContent = async () => {
    setLoading(true);
    try {
      const settings = [
        { setting_key: 'protocol_meta_title', setting_value: JSON.stringify(metaTitle) },
        { setting_key: 'protocol_meta_description', setting_value: JSON.stringify(metaDescription) },
        { setting_key: 'protocol_title', setting_value: JSON.stringify(heroTitle) },
        { setting_key: 'protocol_content', setting_value: JSON.stringify(heroContent) },
        // Phase 1
        { setting_key: 'protocol_phase1_title', setting_value: JSON.stringify(phase1Title) },
        { setting_key: 'protocol_phase1_duration', setting_value: JSON.stringify(phase1Duration) },
        { setting_key: 'protocol_phase1_purpose', setting_value: JSON.stringify(phase1Purpose) },
        { setting_key: 'protocol_phase1_instructions', setting_value: JSON.stringify(phase1Instructions) },
        { setting_key: 'protocol_phase1_details', setting_value: JSON.stringify(phase1Details) },
        // Phase 2
        { setting_key: 'protocol_phase2_title', setting_value: JSON.stringify(phase2Title) },
        { setting_key: 'protocol_phase2_duration', setting_value: JSON.stringify(phase2Duration) },
        { setting_key: 'protocol_phase2_calorie_cap', setting_value: JSON.stringify(phase2CalorieCap) },
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
        { setting_key: 'protocol_phase3_why', setting_value: JSON.stringify(phase3Why) }
      ];

      for (const setting of settings) {
        await supabase
          .from('site_settings')
          .upsert(setting, { 
            onConflict: 'setting_key',
            ignoreDuplicates: false 
          });
      }

      toast.success('All protocol content saved successfully!');
    } catch (error) {
      console.error('Error saving protocol content:', error);
      toast.error('Failed to save protocol content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="seo" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="seo">SEO Settings</TabsTrigger>
          <TabsTrigger value="hero">Hero Content</TabsTrigger>
          <TabsTrigger value="phases">Protocol Phases</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
        </TabsList>

        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search size={20} />
                SEO Settings - Protocol Page
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="meta-title">Meta Title</Label>
                <Input
                  id="meta-title"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="The FastNow Protocol | FastNow"
                  maxLength={60}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {metaTitle.length}/60 characters
                </p>
              </div>

              <div>
                <Label htmlFor="meta-description">Meta Description</Label>
                <Textarea
                  id="meta-description"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Learn how I lost fat with a 3-day fast plus calorie control using the FastNow Protocol"
                  maxLength={160}
                  rows={3}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {metaDescription.length}/160 characters
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="indexed"
                  checked={isIndexed}
                  onCheckedChange={setIsIndexed}
                />
                <Label htmlFor="indexed">
                  Allow search engines to index this page
                </Label>
              </div>
              
              <div className="flex justify-end pt-4 border-t">
                <Button onClick={saveAllContent} disabled={loading}>
                  <Save size={16} className="mr-2" />
                  {loading ? 'Saving...' : 'Save SEO Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText size={20} />
                Hero Section Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="hero-title">Main Title (H1)</Label>
                <Input
                  id="hero-title"
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  placeholder="The FastNow Protocol"
                />
              </div>


              <div>
                <Label htmlFor="hero-content">Hero Description (Optional)</Label>
                <Textarea
                  id="hero-content"
                  value={heroContent}
                  onChange={(e) => setHeroContent(e.target.value)}
                  placeholder="Additional content for the hero section (use \n\n for paragraph breaks)"
                  rows={6}
                />
              </div>
              
              <div className="flex justify-end pt-4 border-t">
                <Button onClick={saveAllContent} disabled={loading}>
                  <Save size={16} className="mr-2" />
                  {loading ? 'Saving...' : 'Save Hero Content'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="phases">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock size={20} />
                  Phase 1: 3-Day Water Fast
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phase1-title">Title</Label>
                    <Input
                      id="phase1-title"
                      value={phase1Title}
                      onChange={(e) => setPhase1Title(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phase1-duration">Duration</Label>
                    <Input
                      id="phase1-duration"
                      value={phase1Duration}
                      onChange={(e) => setPhase1Duration(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phase1-purpose">Purpose</Label>
                  <Textarea
                    id="phase1-purpose"
                    value={phase1Purpose}
                    onChange={(e) => setPhase1Purpose(e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="phase1-instructions">Instructions</Label>
                  <Textarea
                    id="phase1-instructions"
                    value={phase1Instructions}
                    onChange={(e) => setPhase1Instructions(e.target.value)}
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="phase1-details">Detailed Explanation</Label>
                  <Textarea
                    id="phase1-details"
                    value={phase1Details}
                    onChange={(e) => setPhase1Details(e.target.value)}
                    rows={6}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Utensils size={20} />
                  Phase 2: Strict Diet + Calorie Limit
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phase2-title">Title</Label>
                    <Input
                      id="phase2-title"
                      value={phase2Title}
                      onChange={(e) => setPhase2Title(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phase2-duration">Duration</Label>
                    <Input
                      id="phase2-duration"
                      value={phase2Duration}
                      onChange={(e) => setPhase2Duration(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phase2-calorie-cap">Calorie Cap</Label>
                    <Input
                      id="phase2-calorie-cap"
                      value={phase2CalorieCap}
                      onChange={(e) => setPhase2CalorieCap(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phase2-carb-cap">Carb Cap</Label>
                    <Input
                      id="phase2-carb-cap"
                      value={phase2CarbCap}
                      onChange={(e) => setPhase2CarbCap(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phase2-deficit">Deficit Goal</Label>
                  <Input
                    id="phase2-deficit"
                    value={phase2Deficit}
                    onChange={(e) => setPhase2Deficit(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="phase2-why-deficit">Why This Deficit?</Label>
                  <Textarea
                    id="phase2-why-deficit"
                    value={phase2WhyDeficit}
                    onChange={(e) => setPhase2WhyDeficit(e.target.value)}
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="phase2-how-to-set">How to Set Calories</Label>
                  <Textarea
                    id="phase2-how-to-set"
                    value={phase2HowToSet}
                    onChange={(e) => setPhase2HowToSet(e.target.value)}
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="phase2-what-to-eat">What to Eat</Label>
                  <Textarea
                    id="phase2-what-to-eat"
                    value={phase2WhatToEat}
                    onChange={(e) => setPhase2WhatToEat(e.target.value)}
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="phase2-tracking">Tracking Instructions</Label>
                  <Textarea
                    id="phase2-tracking"
                    value={phase2Tracking}
                    onChange={(e) => setPhase2Tracking(e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="phase2-recovery">Recovery Strategy</Label>
                  <Textarea
                    id="phase2-recovery"
                    value={phase2Recovery}
                    onChange={(e) => setPhase2Recovery(e.target.value)}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity size={20} />
                  Phase 3: Daily Walking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="phase3-title">Title</Label>
                  <Input
                    id="phase3-title"
                    value={phase3Title}
                    onChange={(e) => setPhase3Title(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="phase3-rule">The Rule</Label>
                  <Input
                    id="phase3-rule"
                    value={phase3Rule}
                    onChange={(e) => setPhase3Rule(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="phase3-why">Why Walking?</Label>
                  <Textarea
                    id="phase3-why"
                    value={phase3Why}
                    onChange={(e) => setPhase3Why(e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end pt-4">
              <Button onClick={saveAllContent} disabled={loading}>
                <Save size={16} className="mr-2" />
                {loading ? 'Saving...' : 'Save Protocol Phases'}
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="images">
          <div className="space-y-6">
            <ProtocolImageUpload
              imageKey="protocol_featured_image"
              altKey="protocol_featured_image_alt"
              title="Protocol Page Featured Image"
              description="Upload or set a featured image that will appear at the top of the protocol page."
            />
            
            <ProtocolImageUpload
              imageKey="protocol_phase1_intro_image"
              altKey="protocol_phase1_image_alt"
              title="Phase 1 - Water Fast Image"
              description="Image displayed in the Phase 1 intro section of the protocol."
            />
            
            <ProtocolImageUpload
              imageKey="protocol_phase2_intro_image"
              altKey="protocol_phase2_image_alt"
              title="Phase 2 - Diet Control Image"
              description="Image displayed in the Phase 2 intro section of the protocol."
            />
            
            <ProtocolImageUpload
              imageKey="protocol_phase3_intro_image"
              altKey="protocol_phase3_image_alt"
              title="Phase 3 - Daily Walking Image"
              description="Image displayed in the Phase 3 intro section of the protocol."
            />
            
            <div className="flex justify-end pt-4">
              <Button onClick={saveAllContent} disabled={loading}>
                <Save size={16} className="mr-2" />
                {loading ? 'Saving...' : 'Save All Changes'}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UnifiedProtocolEditor;