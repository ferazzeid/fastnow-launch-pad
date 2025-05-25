
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { Save, ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { Link } from "react-router-dom";
import { AppContentService } from '@/services/AppContentService';
import { FastingHour } from '@/types/app-content';

const AdminFastingHours = () => {
  const [currentHour, setCurrentHour] = useState(1);
  const [content, setContent] = useState<FastingHour>({
    hour: 1,
    day: 1,
    title: '',
    bodyState: '',
    commonFeelings: [],
    encouragement: '',
    motivatorTags: [],
    difficulty: 'easy',
    phase: 'preparation',
    tips: [],
    scientificInfo: '',
    imageUrl: '',
    symptoms: { positive: [], challenging: [] },
    milestones: { autophagy: false, ketosis: false, fatBurning: false },
    updatedAt: ''
  });
  
  const [newFeeling, setNewFeeling] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newTip, setNewTip] = useState('');
  const [newPositiveSymptom, setNewPositiveSymptom] = useState('');
  const [newChallengingSymptom, setNewChallengingSymptom] = useState('');

  useEffect(() => {
    loadHourContent(currentHour);
  }, [currentHour]);

  const loadHourContent = (hour: number) => {
    const hourContent = AppContentService.getFastingHourByHour(hour);
    if (hourContent) {
      setContent(hourContent);
    } else {
      const day = Math.floor((hour - 1) / 24) + 1;
      setContent({
        hour,
        day,
        title: '',
        bodyState: '',
        commonFeelings: [],
        encouragement: '',
        motivatorTags: [],
        difficulty: 'easy',
        phase: hour <= 4 ? 'preparation' : hour <= 12 ? 'initial' : hour <= 24 ? 'adaptation' : hour <= 48 ? 'ketosis' : hour <= 72 ? 'deep_ketosis' : 'extended',
        tips: [],
        scientificInfo: '',
        imageUrl: '',
        symptoms: { positive: [], challenging: [] },
        milestones: { 
          autophagy: hour >= 16, 
          ketosis: hour >= 24, 
          fatBurning: hour >= 12 
        },
        updatedAt: new Date().toISOString()
      });
    }
  };

  const handleSave = () => {
    AppContentService.saveFastingHour(content);
    toast.success(`Hour ${currentHour} content saved`);
  };

  const handleFieldChange = (field: keyof FastingHour, value: any) => {
    setContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addArrayItem = (field: 'commonFeelings' | 'motivatorTags' | 'tips', value: string, setValue: (value: string) => void) => {
    if (value.trim()) {
      const currentArray = content[field] as string[];
      if (!currentArray.includes(value.trim())) {
        handleFieldChange(field, [...currentArray, value.trim()]);
        setValue('');
      }
    }
  };

  const removeArrayItem = (field: 'commonFeelings' | 'motivatorTags' | 'tips', index: number) => {
    const currentArray = content[field] as string[];
    handleFieldChange(field, currentArray.filter((_, i) => i !== index));
  };

  const addSymptom = (type: 'positive' | 'challenging', value: string, setValue: (value: string) => void) => {
    if (value.trim()) {
      const currentSymptoms = content.symptoms[type];
      if (!currentSymptoms.includes(value.trim())) {
        handleFieldChange('symptoms', {
          ...content.symptoms,
          [type]: [...currentSymptoms, value.trim()]
        });
        setValue('');
      }
    }
  };

  const removeSymptom = (type: 'positive' | 'challenging', index: number) => {
    const currentSymptoms = content.symptoms[type];
    handleFieldChange('symptoms', {
      ...content.symptoms,
      [type]: currentSymptoms.filter((_, i) => i !== index)
    });
  };

  const goToPrevious = () => {
    if (currentHour > 1) setCurrentHour(currentHour - 1);
  };

  const goToNext = () => {
    if (currentHour < 96) setCurrentHour(currentHour + 1);
  };

  const goToHour = (hour: number) => {
    setCurrentHour(hour);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex justify-between items-center py-4">
          <Link to="/admin" className="text-2xl font-bold hover:text-primary transition-colors">
            Fasting Hours Management
          </Link>
          <Link to="/admin">
            <Button variant="outline">Back to Admin</Button>
          </Link>
        </div>
      </header>
      
      <main className="container py-8">
        <div className="max-w-6xl mx-auto">
          {/* Navigation */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Hour Navigation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <Button variant="outline" onClick={goToPrevious} disabled={currentHour === 1}>
                  <ChevronLeft size={16} className="mr-1" />
                  Previous
                </Button>
                
                <div className="text-center">
                  <h2 className="text-2xl font-bold">Hour {currentHour} of 96</h2>
                  <p className="text-sm text-muted-foreground">Day {content.day}</p>
                </div>
                
                <Button variant="outline" onClick={goToNext} disabled={currentHour === 96}>
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
                    if (hour >= 1 && hour <= 96) goToHour(hour);
                  }}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">/ 96</span>
              </div>
            </CardContent>
          </Card>

          {/* Content Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={content.title}
                    onChange={(e) => handleFieldChange('title', e.target.value)}
                    placeholder="Hour title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="body-state">Body State</Label>
                  <Textarea
                    id="body-state"
                    value={content.bodyState}
                    onChange={(e) => handleFieldChange('bodyState', e.target.value)}
                    placeholder="What's happening in the body"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="encouragement">Encouragement</Label>
                  <Textarea
                    id="encouragement"
                    value={content.encouragement}
                    onChange={(e) => handleFieldChange('encouragement', e.target.value)}
                    placeholder="Motivational message"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="scientific-info">Scientific Information</Label>
                  <Textarea
                    id="scientific-info"
                    value={content.scientificInfo}
                    onChange={(e) => handleFieldChange('scientificInfo', e.target.value)}
                    placeholder="Scientific explanation"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="image-url">Image URL</Label>
                  <Input
                    id="image-url"
                    value={content.imageUrl}
                    onChange={(e) => handleFieldChange('imageUrl', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Categories and Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Categories & Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select value={content.difficulty} onValueChange={(value) => handleFieldChange('difficulty', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                      <SelectItem value="extreme">Extreme</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="phase">Phase</Label>
                  <Select value={content.phase} onValueChange={(value) => handleFieldChange('phase', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="preparation">Preparation</SelectItem>
                      <SelectItem value="initial">Initial</SelectItem>
                      <SelectItem value="adaptation">Adaptation</SelectItem>
                      <SelectItem value="ketosis">Ketosis</SelectItem>
                      <SelectItem value="deep_ketosis">Deep Ketosis</SelectItem>
                      <SelectItem value="extended">Extended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Milestones */}
                <div>
                  <Label>Milestones</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="autophagy"
                        checked={content.milestones.autophagy}
                        onChange={(e) => handleFieldChange('milestones', {
                          ...content.milestones,
                          autophagy: e.target.checked
                        })}
                      />
                      <Label htmlFor="autophagy">Autophagy</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="ketosis"
                        checked={content.milestones.ketosis}
                        onChange={(e) => handleFieldChange('milestones', {
                          ...content.milestones,
                          ketosis: e.target.checked
                        })}
                      />
                      <Label htmlFor="ketosis">Ketosis</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="fat-burning"
                        checked={content.milestones.fatBurning}
                        onChange={(e) => handleFieldChange('milestones', {
                          ...content.milestones,
                          fatBurning: e.target.checked
                        })}
                      />
                      <Label htmlFor="fat-burning">Fat Burning</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Lists Management */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Lists & Arrays</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Common Feelings */}
                <div>
                  <Label>Common Feelings</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={newFeeling}
                      onChange={(e) => setNewFeeling(e.target.value)}
                      placeholder="Add feeling"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addArrayItem('commonFeelings', newFeeling, setNewFeeling);
                        }
                      }}
                    />
                    <Button 
                      size="sm" 
                      onClick={() => addArrayItem('commonFeelings', newFeeling, setNewFeeling)}
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {content.commonFeelings.map((feeling, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {feeling}
                        <X 
                          size={14} 
                          className="cursor-pointer hover:text-red-500" 
                          onClick={() => removeArrayItem('commonFeelings', index)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Motivator Tags */}
                <div>
                  <Label>Motivator Tags</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add tag"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addArrayItem('motivatorTags', newTag, setNewTag);
                        }
                      }}
                    />
                    <Button 
                      size="sm" 
                      onClick={() => addArrayItem('motivatorTags', newTag, setNewTag)}
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {content.motivatorTags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        {tag}
                        <X 
                          size={14} 
                          className="cursor-pointer hover:text-red-500" 
                          onClick={() => removeArrayItem('motivatorTags', index)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Tips */}
                <div>
                  <Label>Tips</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={newTip}
                      onChange={(e) => setNewTip(e.target.value)}
                      placeholder="Add tip"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addArrayItem('tips', newTip, setNewTip);
                        }
                      }}
                    />
                    <Button 
                      size="sm" 
                      onClick={() => addArrayItem('tips', newTip, setNewTip)}
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                  <div className="space-y-2 mt-2">
                    {content.tips.map((tip, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                        <span className="flex-1">{tip}</span>
                        <X 
                          size={16} 
                          className="cursor-pointer hover:text-red-500" 
                          onClick={() => removeArrayItem('tips', index)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Symptoms */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Positive Symptoms */}
                  <div>
                    <Label>Positive Symptoms</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={newPositiveSymptom}
                        onChange={(e) => setNewPositiveSymptom(e.target.value)}
                        placeholder="Add positive symptom"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addSymptom('positive', newPositiveSymptom, setNewPositiveSymptom);
                          }
                        }}
                      />
                      <Button 
                        size="sm" 
                        onClick={() => addSymptom('positive', newPositiveSymptom, setNewPositiveSymptom)}
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                    <div className="space-y-2 mt-2">
                      {content.symptoms.positive.map((symptom, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded">
                          <span className="flex-1">{symptom}</span>
                          <X 
                            size={16} 
                            className="cursor-pointer hover:text-red-500" 
                            onClick={() => removeSymptom('positive', index)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Challenging Symptoms */}
                  <div>
                    <Label>Challenging Symptoms</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={newChallengingSymptom}
                        onChange={(e) => setNewChallengingSymptom(e.target.value)}
                        placeholder="Add challenging symptom"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addSymptom('challenging', newChallengingSymptom, setNewChallengingSymptom);
                          }
                        }}
                      />
                      <Button 
                        size="sm" 
                        onClick={() => addSymptom('challenging', newChallengingSymptom, setNewChallengingSymptom)}
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                    <div className="space-y-2 mt-2">
                      {content.symptoms.challenging.map((symptom, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-red-50 rounded">
                          <span className="flex-1">{symptom}</span>
                          <X 
                            size={16} 
                            className="cursor-pointer hover:text-red-500" 
                            onClick={() => removeSymptom('challenging', index)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
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
        </div>
      </main>
    </div>
  );
};

export default AdminFastingHours;
