
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SeoSettings: React.FC = () => {
  // Home page SEO
  const [metaTitle, setMetaTitle] = useState(
    localStorage.getItem('fastingApp_metaTitle') || 'fastnow.app - Intermittent Fasting Made Simple'
  );
  const [metaDescription, setMetaDescription] = useState(
    localStorage.getItem('fastingApp_metaDescription') || 'Track your fasting periods with our minimalist, intuitive app. Download fastnow.app today and transform your health through fasting.'
  );
  
  // Fasting Timeline SEO
  const [timelineTitle, setTimelineTitle] = useState(
    localStorage.getItem('fastingApp_fastingTimelineTitle') || 'Fasting Timeline | Understanding What Happens During Your Fast'
  );
  const [timelineDescription, setTimelineDescription] = useState(
    localStorage.getItem('fastingApp_fastingTimelineDescription') || 'Discover what happens in your body hour by hour during fasting, from 0 to 72 hours.'
  );
  
  const handleHomeSeoUpdate = () => {
    localStorage.setItem('fastingApp_metaTitle', metaTitle);
    localStorage.setItem('fastingApp_metaDescription', metaDescription);
    toast.success("Home page SEO settings updated successfully");
  };
  
  const handleTimelineSeoUpdate = () => {
    localStorage.setItem('fastingApp_fastingTimelineTitle', timelineTitle);
    localStorage.setItem('fastingApp_fastingTimelineDescription', timelineDescription);
    toast.success("Fasting Timeline SEO settings updated successfully");
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>SEO Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="home" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="home">Home Page</TabsTrigger>
            <TabsTrigger value="timeline">Fasting Timeline</TabsTrigger>
          </TabsList>
          
          <TabsContent value="home" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="meta-title">Meta Title</Label>
              <Input 
                id="meta-title" 
                value={metaTitle} 
                onChange={(e) => setMetaTitle(e.target.value)} 
                placeholder="fastnow.app - Intermittent Fasting Made Simple"
              />
              <p className="text-xs text-muted-foreground">
                Recommended length: 50-60 characters
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="meta-description">Meta Description</Label>
              <Input 
                id="meta-description" 
                value={metaDescription} 
                onChange={(e) => setMetaDescription(e.target.value)} 
                placeholder="Track your fasting periods with our minimalist app..."
              />
              <p className="text-xs text-muted-foreground">
                Recommended length: 150-160 characters
              </p>
            </div>
            
            <div className="pt-2">
              <Button onClick={handleHomeSeoUpdate}>Save Home SEO Settings</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="timeline" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="timeline-title">Timeline Meta Title</Label>
              <Input 
                id="timeline-title" 
                value={timelineTitle} 
                onChange={(e) => setTimelineTitle(e.target.value)} 
                placeholder="Fasting Timeline | Understanding What Happens During Your Fast"
              />
              <p className="text-xs text-muted-foreground">
                Recommended length: 50-60 characters
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timeline-description">Timeline Meta Description</Label>
              <Input 
                id="timeline-description" 
                value={timelineDescription} 
                onChange={(e) => setTimelineDescription(e.target.value)} 
                placeholder="Discover what happens in your body hour by hour during fasting..."
              />
              <p className="text-xs text-muted-foreground">
                Recommended length: 150-160 characters
              </p>
            </div>
            
            <div className="pt-2">
              <Button onClick={handleTimelineSeoUpdate}>Save Timeline SEO Settings</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SeoSettings;
