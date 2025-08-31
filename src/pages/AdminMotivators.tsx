import React, { useState, useEffect } from 'react';
import { Edit, Eye, EyeOff, Lock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import LazyImage from '@/components/LazyImage';
import { ImageUploadService } from '@/services/ImageUploadService';
import { MotivatorService, Motivator } from '@/services/MotivatorService';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

const AdminMotivators: React.FC = () => {
  const { user } = useAuth();
  const [motivators, setMotivators] = useState<Motivator[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMotivator, setEditingMotivator] = useState<Motivator | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'personal',
    image_url: '',
    link_url: '',
    slug: '',
    meta_title: '',
    meta_description: '',
    is_published: true,
    is_active: true,
  });

  useEffect(() => {
    fetchMotivators();
  }, []);

  const fetchMotivators = async () => {
    try {
      const data = await MotivatorService.getAllMotivatorsForAdmin();
      // Filter to only show system goals
      const systemGoals = data.filter(m => m.is_system_goal === true);
      setMotivators(systemGoals);
    } catch (error) {
      console.error('Error fetching system goals:', error);
      toast.error('Failed to load system goals');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category: 'personal',
      image_url: '',
      link_url: '',
      slug: '',
      meta_title: '',
      meta_description: '',
      is_published: true,
      is_active: true,
    });
    setImageFile(null);
    setEditingMotivator(null);
  };

  const handleEdit = (motivator: Motivator) => {
    setFormData({
      title: motivator.title,
      content: motivator.content,
      category: motivator.category || 'personal',
      image_url: motivator.image_url || '',
      link_url: motivator.link_url || '',
      slug: motivator.slug,
      meta_title: motivator.meta_title || '',
      meta_description: motivator.meta_description || '',
      is_published: motivator.is_published,
      is_active: motivator.is_active,
    });
    setEditingMotivator(motivator);
    setImageFile(null);
    setIsEditDialogOpen(true);
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    setUploading(true);
    try {
      const uploadResult = await ImageUploadService.uploadImage(file, 'motivator-images');
      return uploadResult.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const generateSlugFromTitle = async (title: string) => {
    const baseSlug = MotivatorService.generateSlug(title);
    const uniqueSlug = await MotivatorService.generateUniqueSlug(baseSlug, editingMotivator?.id);
    setFormData(prev => ({ ...prev, slug: uniqueSlug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    if (!user?.id) {
      toast.error('User not authenticated');
      return;
    }

    try {
      let imageUrl = formData.image_url;
      
      if (imageFile) {
        imageUrl = await handleImageUpload(imageFile);
      }

      let slug = formData.slug;
      if (!slug && formData.title) {
        slug = await MotivatorService.generateUniqueSlug(
          MotivatorService.generateSlug(formData.title),
          editingMotivator?.id
        );
      }

      const motivatorData = {
        ...formData,
        user_id: user.id,
        image_url: imageUrl,
        slug,
      };

      if (editingMotivator) {
        await MotivatorService.updateMotivator(editingMotivator.id, motivatorData);
        toast.success('Goal updated successfully');
        setIsEditDialogOpen(false);
      }

      resetForm();
      fetchMotivators();
    } catch (error) {
      console.error('Error saving goal:', error);
      toast.error('Failed to save goal');
    }
  };

  const toggleStatus = async (motivator: Motivator, field: 'is_active' | 'is_published') => {
    try {
      await MotivatorService.updateMotivator(motivator.id, {
        [field]: !motivator[field]
      });
      toast.success(`Goal ${field === 'is_active' ? 'activation' : 'publication'} status updated`);
      fetchMotivators();
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      toast.error(`Failed to update ${field === 'is_active' ? 'activation' : 'publication'} status`);
    }
  };

  const groupMotivatorsByGender = (motivators: Motivator[]) => {
    const maleGoals = motivators.filter(m => m.gender === 'male');
    const femaleGoals = motivators.filter(m => m.gender === 'female');
    return { maleGoals, femaleGoals };
  };

  const DialogForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            onBlur={() => formData.title && !formData.slug && generateSlugFromTitle(formData.title)}
            placeholder="Enter motivator title"
            required
          />
        </div>

        <div>
          <Label htmlFor="slug">URL Slug</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
            placeholder="url-friendly-slug"
          />
          {formData.slug && (
            <p className="text-sm text-muted-foreground mt-1">
              Will be accessible at: /motivators/{formData.slug}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="content">Content *</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            placeholder="Enter motivator content (HTML supported)"
            rows={6}
            required
          />
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            placeholder="e.g., personal, health, fitness"
          />
        </div>

        <div>
          <Label htmlFor="image">Image</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />
          {formData.image_url && (
            <div className="mt-2">
              <LazyImage
                src={formData.image_url}
                alt="Current image"
                className="w-32 h-24 object-cover rounded"
              />
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="link_url">External Link (Optional)</Label>
          <Input
            id="link_url"
            value={formData.link_url}
            onChange={(e) => setFormData(prev => ({ ...prev, link_url: e.target.value }))}
            placeholder="https://example.com"
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">SEO Settings</h4>
          
          <div>
            <Label htmlFor="meta_title">Meta Title</Label>
            <Input
              id="meta_title"
              value={formData.meta_title}
              onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
              placeholder="SEO title (leave blank to use title)"
            />
          </div>

          <div>
            <Label htmlFor="meta_description">Meta Description</Label>
            <Textarea
              id="meta_description"
              value={formData.meta_description}
              onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
              placeholder="SEO description"
              rows={2}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Status Settings</h4>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="is_published"
              checked={formData.is_published}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
            />
            <Label htmlFor="is_published">Published (visible to public)</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
            />
            <Label htmlFor="is_active">Active</Label>
          </div>

        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setIsEditDialogOpen(false);
            resetForm();
          }}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Update Goal'}
        </Button>
      </div>
    </form>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const { maleGoals, femaleGoals } = groupMotivatorsByGender(motivators);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Fundamental Goals</h1>
        <p className="text-muted-foreground mt-2">Manage the 16 core goals for destination pages</p>
        <div className="flex gap-4 mt-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="text-sm text-muted-foreground">
              {maleGoals.length} Male Goals • {femaleGoals.length} Female Goals
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {motivators.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">No system goals found.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Male Goals Section */}
            {maleGoals.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                  Male Goals ({maleGoals.length})
                  <Badge variant="outline">For Men</Badge>
                </h2>
                <div className="grid gap-4">
                  {maleGoals.map((motivator) => (
                    <Card key={motivator.id} className="border-l-4 border-l-blue-500">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <CardTitle className="flex items-center gap-2">
                              <Lock className="w-4 h-4 text-muted-foreground" />
                              {motivator.title}
                              <div className="flex gap-1">
                                <Badge variant="secondary">Male</Badge>
                                {motivator.is_published ? (
                                  <Badge variant="default">Published</Badge>
                                ) : (
                                  <Badge variant="secondary">Draft</Badge>
                                )}
                                {motivator.is_active ? (
                                  <Badge variant="outline">Active</Badge>
                                ) : (
                                  <Badge variant="destructive">Inactive</Badge>
                                )}
                              </div>
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              /motivators/{motivator.slug}
                            </p>
                            {motivator.category && (
                              <Badge variant="outline">{motivator.category}</Badge>
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleStatus(motivator, 'is_published')}
                            >
                              {motivator.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(motivator)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="flex gap-4">
                          {motivator.image_url && (
                            <LazyImage
                              src={motivator.image_url}
                              alt={motivator.title}
                              className="w-24 h-18 object-cover rounded flex-shrink-0"
                            />
                          )}
                          <div className="flex-1">
                            <p className="text-sm text-muted-foreground line-clamp-3">
                              {motivator.content.replace(/<[^>]*>/g, '').substring(0, 200)}...
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Female Goals Section */}
            {femaleGoals.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                  Female Goals ({femaleGoals.length})
                  <Badge variant="outline">For Women</Badge>
                </h2>
                <div className="grid gap-4">
                  {femaleGoals.map((motivator) => (
                    <Card key={motivator.id} className="border-l-4 border-l-pink-500">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <CardTitle className="flex items-center gap-2">
                              <Lock className="w-4 h-4 text-muted-foreground" />
                              {motivator.title}
                              <div className="flex gap-1">
                                <Badge variant="secondary">Female</Badge>
                                {motivator.is_published ? (
                                  <Badge variant="default">Published</Badge>
                                ) : (
                                  <Badge variant="secondary">Draft</Badge>
                                )}
                                {motivator.is_active ? (
                                  <Badge variant="outline">Active</Badge>
                                ) : (
                                  <Badge variant="destructive">Inactive</Badge>
                                )}
                              </div>
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              /motivators/{motivator.slug}
                            </p>
                            {motivator.category && (
                              <Badge variant="outline">{motivator.category}</Badge>
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleStatus(motivator, 'is_published')}
                            >
                              {motivator.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(motivator)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="flex gap-4">
                          {motivator.image_url && (
                            <LazyImage
                              src={motivator.image_url}
                              alt={motivator.title}
                              className="w-24 h-18 object-cover rounded flex-shrink-0"
                            />
                          )}
                          <div className="flex-1">
                            <p className="text-sm text-muted-foreground line-clamp-3">
                              {motivator.content.replace(/<[^>]*>/g, '').substring(0, 200)}...
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Edit Goal: {editingMotivator?.title}
              {editingMotivator?.gender && (
                <Badge variant="outline" className="ml-2">
                  {editingMotivator.gender === 'male' ? 'Male' : 'Female'}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          <DialogForm />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMotivators;