
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { Save, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { AppContentService } from '@/services/AppContentService';
import { HourlyContent } from '@/types/app-content';

const AdminHourlyContent = () => {
  const [currentHour, setCurrentHour] = useState(1);
  const [content, setContent] = useState<HourlyContent>({
    hour: 1,
    field1: '',
    field2: '',
    field3: '',
    field4: '',
    field5: '',
    updatedAt: ''
  });

  useEffect(() => {
    loadHourContent(currentHour);
  }, [currentHour]);

  const loadHourContent = (hour: number) => {
    const hourContent = AppContentService.getHourlyContentByHour(hour);
    if (hourContent) {
      setContent(hourContent);
    } else {
      setContent({
        hour,
        field1: '',
        field2: '',
        field3: '',
        field4: '',
        field5: '',
        updatedAt: new Date().toISOString()
      });
    }
  };

  const handleSave = () => {
    AppContentService.saveHourlyContent(content);
    toast.success(`Hour ${currentHour} content saved`);
  };

  const handleFieldChange = (field: keyof HourlyContent, value: string) => {
    setContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const goToPrevious = () => {
    if (currentHour > 1) {
      setCurrentHour(currentHour - 1);
    }
  };

  const goToNext = () => {
    if (currentHour < 96) {
      setCurrentHour(currentHour + 1);
    }
  };

  const goToHour = (hour: number) => {
    setCurrentHour(hour);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex justify-between items-center py-4">
          <Link to="/admin" className="text-2xl font-bold hover:text-primary transition-colors">
            Hourly Content Management
          </Link>
          <Link to="/admin">
            <Button variant="outline">Back to Admin</Button>
          </Link>
        </div>
      </header>
      
      <main className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Hour Navigation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <Button 
                  variant="outline" 
                  onClick={goToPrevious}
                  disabled={currentHour === 1}
                >
                  <ChevronLeft size={16} className="mr-1" />
                  Previous
                </Button>
                
                <div className="text-center">
                  <h2 className="text-2xl font-bold">Hour {currentHour} of 96</h2>
                  <p className="text-sm text-muted-foreground">
                    Use the input below to jump to a specific hour
                  </p>
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={goToNext}
                  disabled={currentHour === 96}
                >
                  Next
                  <ChevronRight size={16} className="ml-1" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Label htmlFor="hour-jump">Jump to hour:</Label>
                <Input
                  id="hour-jump"
                  type="number"
                  min="1"
                  max="96"
                  value={currentHour}
                  onChange={(e) => {
                    const hour = parseInt(e.target.value);
                    if (hour >= 1 && hour <= 96) {
                      goToHour(hour);
                    }
                  }}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">/ 96</span>
              </div>
            </CardContent>
          </Card>

          {/* Content Form */}
          <Card>
            <CardHeader>
              <CardTitle>Content for Hour {currentHour}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Define the content that users will see during hour {currentHour} of their fasting journey.
                Field names and purposes will be defined later.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="field1">Field 1</Label>
                <Textarea
                  id="field1"
                  value={content.field1}
                  onChange={(e) => handleFieldChange('field1', e.target.value)}
                  placeholder="Enter content for field 1"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="field2">Field 2</Label>
                <Textarea
                  id="field2"
                  value={content.field2}
                  onChange={(e) => handleFieldChange('field2', e.target.value)}
                  placeholder="Enter content for field 2"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="field3">Field 3</Label>
                <Textarea
                  id="field3"
                  value={content.field3}
                  onChange={(e) => handleFieldChange('field3', e.target.value)}
                  placeholder="Enter content for field 3"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="field4">Field 4</Label>
                <Textarea
                  id="field4"
                  value={content.field4}
                  onChange={(e) => handleFieldChange('field4', e.target.value)}
                  placeholder="Enter content for field 4"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="field5">Field 5</Label>
                <Textarea
                  id="field5"
                  value={content.field5}
                  onChange={(e) => handleFieldChange('field5', e.target.value)}
                  placeholder="Enter content for field 5"
                  rows={3}
                />
              </div>
              
              <div className="flex justify-between items-center pt-4">
                <div className="text-sm text-muted-foreground">
                  {content.updatedAt && (
                    <span>Last updated: {new Date(content.updatedAt).toLocaleString()}</span>
                  )}
                </div>
                <Button onClick={handleSave} className="flex items-center gap-2">
                  <Save size={16} />
                  Save Hour {currentHour}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminHourlyContent;
