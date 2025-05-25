
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
    image: ''
  });

  useEffect(() => {
    loadMotivators();
    // Initialize sample data if none exists
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
      description: motivator.description || '',
      image: motivator.image
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
      image: formData.image,
      createdAt: editingMotivator?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    AppContentService.saveMotivator(motivator);
    loadMotivators();
    setIsEditing(false);
    setEditingMotivator(null);
    setFormData({ title: '', description: '', image: '' });
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
    setFormData({ title: '', description: '', image: '' });
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
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter motivator description"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="image">Image URL *</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              {formData.image && (
                <div>
                  <Label>Preview</Label>
                  <img 
                    src={formData.image} 
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
                        <h3 className="font-semibold">{motivator.title}</h3>
                        {motivator.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {motivator.description}
                          </p>
                        )}
                        {motivator.image && (
                          <img 
                            src={motivator.image} 
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
