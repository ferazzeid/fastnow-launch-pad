import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { SystemMotivatorService, SystemMotivator } from '@/services/SystemMotivatorService';
import { toast } from 'sonner';

const AdminMotivators: React.FC = () => {
  const [motivators, setMotivators] = useState<SystemMotivator[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMotivator, setEditingMotivator] = useState<SystemMotivator | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    category: 'personal',
    male_image_url: '',
    female_image_url: '',
    meta_title: '',
    meta_description: '',
    is_active: true,
    display_order: 0,
  });

  useEffect(() => {
    fetchMotivators();
  }, []);

  const fetchMotivators = async () => {
    try {
      const data = await SystemMotivatorService.getAllSystemMotivatorsForAdmin();
      setMotivators(data);
    } catch (error) {
      console.error('Error fetching system motivators:', error);
      toast.error('Failed to load system motivators');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (motivator: SystemMotivator) => {
    setEditingMotivator(motivator);
    setFormData({
      title: motivator.title,
      slug: motivator.slug,
      content: motivator.content,
      category: motivator.category || 'personal',
      male_image_url: motivator.male_image_url || '',
      female_image_url: motivator.female_image_url || '',
      meta_title: motivator.meta_title || '',
      meta_description: motivator.meta_description || '',
      is_active: motivator.is_active,
      display_order: motivator.display_order,
    });
    setIsDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'male' | 'female') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { ImageUploadService } = await import('@/services/ImageUploadService');
      const uploadedImageUrl = await ImageUploadService.uploadImage(file, 'motivator-images');
      const fieldName = type === 'male' ? 'male_image_url' : 'female_image_url';
      setFormData(prev => ({ ...prev, [fieldName]: uploadedImageUrl }));
      toast.success(`${type === 'male' ? 'Male' : 'Female'} image uploaded successfully`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    try {
      const motivatorData = {
        ...formData,
      };

      if (editingMotivator) {
        await SystemMotivatorService.updateSystemMotivator(editingMotivator.id, motivatorData);
        toast.success('System motivator updated successfully');
      } else {
        await SystemMotivatorService.createSystemMotivator(motivatorData);
        toast.success('System motivator created successfully');
      }

      setIsDialogOpen(false);
      resetForm();
      fetchMotivators();
    } catch (error) {
      console.error('Error saving system motivator:', error);
      toast.error('Failed to save system motivator');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      content: '',
      category: 'personal',
      male_image_url: '',
      female_image_url: '',
      meta_title: '',
      meta_description: '',
      is_active: true,
      display_order: 0,
    });
    setEditingMotivator(null);
  };

  const toggleStatus = async (id: string, field: 'is_active', value: boolean) => {
    try {
      await SystemMotivatorService.updateSystemMotivator(id, { [field]: value });
      toast.success(`System motivator activation status updated`);
      fetchMotivators();
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      toast.error(`Failed to update activation status`);
    }
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
            placeholder="Enter motivator title"
            required
          />
        </div>

        <div>
          <Label htmlFor="slug">URL Slug *</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
            placeholder="url-friendly-slug"
            required
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

        <div className="space-y-4">
          <div>
            <Label htmlFor="male-image">Male Image Upload</Label>
            <input
              id="male-image"
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'male')}
              className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
            {formData.male_image_url && (
              <div className="mt-2">
                <img src={formData.male_image_url} alt="Male Preview" className="w-24 h-24 object-cover rounded-md" />
              </div>
            )}
          </div>
          
          <div>
            <Label htmlFor="female-image">Female Image Upload</Label>
            <input
              id="female-image"
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'female')}
              className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
            {formData.female_image_url && (
              <div className="mt-2">
                <img src={formData.female_image_url} alt="Female Preview" className="w-24 h-24 object-cover rounded-md" />
              </div>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="display_order">Display Order</Label>
          <Input
            id="display_order"
            type="number"
            value={formData.display_order}
            onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
            placeholder="0"
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
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
            />
            <Label htmlFor="is_active">Active (visible to users)</Label>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setIsDialogOpen(false);
            resetForm();
          }}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isUploading}>
          {isUploading ? 'Uploading...' : editingMotivator ? 'Update Motivator' : 'Create Motivator'}
        </Button>
      </div>
    </form>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link 
              to="/admin"
              className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin
            </Link>
          </div>
        </div>
        
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link 
            to="/admin"
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin
          </Link>
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">System Motivators</h1>
        <p className="text-muted-foreground">Manage the 8 default system motivators with dual gender images</p>
        <div className="flex items-center gap-2 mt-4">
          <span className="text-sm text-muted-foreground">
            {motivators.length} System Motivators Available
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {motivators.map((motivator) => (
          <Card key={motivator.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-medium">{motivator.title}</h3>
                  {motivator.is_active ? (
                    <Badge variant="default">Active</Badge>
                  ) : (
                    <Badge variant="destructive">Inactive</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">/{motivator.slug}</p>
                <div className="flex items-center gap-2 mt-2">
                  {motivator.male_image_url && (
                    <img 
                      src={motivator.male_image_url} 
                      alt="Male version" 
                      className="w-8 h-8 rounded object-cover"
                      title="Male image"
                    />
                  )}
                  {motivator.female_image_url && (
                    <img 
                      src={motivator.female_image_url} 
                      alt="Female version" 
                      className="w-8 h-8 rounded object-cover"
                      title="Female image"
                    />
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleStatus(motivator.id, 'is_active', !motivator.is_active)}
                >
                  {motivator.is_active ? 'Deactivate' : 'Activate'}
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleEdit(motivator)}>
                  Edit
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingMotivator ? 'Edit' : 'Create'} System Motivator
            </DialogTitle>
          </DialogHeader>
          <DialogForm />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMotivators;