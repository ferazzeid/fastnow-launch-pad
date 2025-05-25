
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/sonner";
import { Trash2, Edit, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { AppContentService } from '@/services/AppContentService';
import { Motivator } from '@/types/app-content';

const AdminMotivators = () => {
  const [motivators, setMotivators] = useState<Motivator[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingMotivator, setEditingMotivator] = useState<Motivator | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    caption: '',
    category: 'appearance',
    subcategory: '',
    difficulty: 'beginner',
    timeframe: '',
    tags: '',
    isActive: true,
    isFeatured: false,
    sortOrder: 0
  });

  useEffect(() => {
    loadMotivators();
    AppContentService.createSampleData();
  }, []);

  const loadMotivators = () => {
    const loadedMotivators = AppContentService.getAllMotivators();
    setMotivators(loadedMotivators);
  };

  const handleEdit = (motivator: Motivator) => {
    setEditingMotivator(motivator);
    setFormData({
      title: motivator.title,
      description: motivator.description,
      imageUrl: motivator.imageUrl || motivator.image || '',
      caption: motivator.caption || '',
      category: motivator.category || 'appearance',
      subcategory: motivator.subcategory || '',
      difficulty: motivator.difficulty || 'beginner',
      timeframe: motivator.timeframe || '',
      tags: motivator.tags?.join(', ') || '',
      isActive: motivator.isActive ?? true,
      isFeatured: motivator.isFeatured ?? false,
      sortOrder: motivator.sortOrder || 0
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    const motivator: Motivator = {
      id: editingMotivator?.id || AppContentService.generateId(),
      title: formData.title,
      description: formData.description,
      imageUrl: formData.imageUrl,
      caption: formData.caption,
      category: formData.category,
      subcategory: formData.subcategory,
      difficulty: formData.difficulty,
      timeframe: formData.timeframe,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      isActive: formData.isActive,
      isFeatured: formData.isFeatured,
      sortOrder: formData.sortOrder,
      createdDate: editingMotivator?.createdDate || new Date().toISOString(),
      timesUsed: editingMotivator?.timesUsed || 0,
      totalSessions: editingMotivator?.totalSessions || 0,
      completedSessions: editingMotivator?.completedSessions || 0,
      totalTimeSpent: editingMotivator?.totalTimeSpent || 0,
      isPredefined: true,
      // Legacy fields for backward compatibility
      image: formData.imageUrl,
      createdAt: editingMotivator?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    AppContentService.saveMotivator(motivator);
    loadMotivators();
    setIsEditing(false);
    setEditingMotivator(null);
    setFormData({ 
      title: '', description: '', imageUrl: '', caption: '', category: 'appearance',
      subcategory: '', difficulty: 'beginner', timeframe: '', tags: '', 
      isActive: true, isFeatured: false, sortOrder: 0 
    });
    toast.success(editingMotivator ? "Motivator updated" : "Motivator created");
  };

  const handleDelete = (id: string) => {
    AppContentService.deleteMotivator(id);
    loadMotivators();
    toast.success("Motivator deleted");
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditingMotivator(null);
    setFormData({ 
      title: '', description: '', imageUrl: '', caption: '', category: 'appearance',
      subcategory: '', difficulty: 'beginner', timeframe: '', tags: '', 
      isActive: true, isFeatured: false, sortOrder: 0 
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex justify-between items-center py-4">
          <Link to="/admin" className="text-2xl font-bold hover:text-primary transition-colors">
            Motivators Management
          </Link>
          <Link to="/admin">
            <Button variant="outline">Back to Admin</Button>
          </Link>
        </div>
      </header>
      
      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>{editingMotivator ? 'Edit Motivator' : 'Create New Motivator'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter motivator title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="appearance">Appearance</SelectItem>
                      <SelectItem value="health">Health</SelectItem>
                      <SelectItem value="events">Events</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter motivator description"
                  rows={2}
                />
              </div>
              
              <div>
                <Label htmlFor="caption">Caption (First-person affirmation)</Label>
                <Input
                  id="caption"
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  placeholder="I will achieve my goal..."
                />
              </div>
              
              <div>
                <Label htmlFor="imageUrl">AWS Image URL *</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://your-aws-bucket.s3.amazonaws.com/motivators/image.jpg"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select value={formData.difficulty} onValueChange={(value) => setFormData({ ...formData, difficulty: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="timeframe">Timeframe</Label>
                  <Input
                    id="timeframe"
                    value={formData.timeframe}
                    onChange={(e) => setFormData({ ...formData, timeframe: e.target.value })}
                    placeholder="2-4 weeks"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="confidence, clothing, transformation"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
                  />
                  <Label htmlFor="isFeatured">Featured</Label>
                </div>
              </div>
              
              {formData.imageUrl && (
                <div>
                  <Label>Preview</Label>
                  <img 
                    src={formData.imageUrl} 
                    alt="Preview" 
                    className="w-full h-32 object-cover rounded border"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              <div className="flex gap-2">
                <Button onClick={handleSave} className="flex-1">
                  {editingMotivator ? 'Update' : 'Create'} Motivator
                </Button>
                {isEditing && (
                  <Button variant="outline" onClick={cancelEdit}>
                    Cancel
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* List */}
          <Card>
            <CardHeader>
              <CardTitle>Existing Motivators ({motivators.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {motivators.map((motivator) => (
                  <div key={motivator.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{motivator.title}</h3>
                          {motivator.isFeatured && <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Featured</span>}
                          {!motivator.isActive && <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">Inactive</span>}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {motivator.description}
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          {motivator.category} • {motivator.difficulty}
                        </p>
                        {(motivator.imageUrl || motivator.image) && (
                          <img 
                            src={motivator.imageUrl || motivator.image} 
                            alt={motivator.title}
                            className="w-full h-20 object-cover rounded mt-2"
                          />
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(motivator)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(motivator.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {motivators.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No motivators created yet. Create your first one!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminMotivators;
