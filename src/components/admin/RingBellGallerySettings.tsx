import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Trash2, Upload, Eye, EyeOff } from 'lucide-react';
import { ringBellGalleryService, RingBellGalleryItem } from '@/services/RingBellGalleryService';
import { ImageUploadService } from '@/services/ImageUploadService';

const RingBellGallerySettings = () => {
  const [items, setItems] = useState<RingBellGalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('1');

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const data = await ringBellGalleryService.getAllItemsForAdmin();
      setItems(data);
    } catch (error) {
      console.error('Error loading gallery items:', error);
      toast.error('Failed to load gallery items');
    } finally {
      setLoading(false);
    }
  };

  const getItemForPosition = (position: number): Partial<RingBellGalleryItem> => {
    const existing = items.find(item => item.order_position === position);
    return existing || {
      order_position: position,
      initial_state: 'image',
      front_image_url: '',
      front_text: '',
      back_image_url: '',
      back_text: '',
      is_active: true
    };
  };

  const updateItem = (position: number, updates: Partial<RingBellGalleryItem>) => {
    setItems(prev => {
      const existing = prev.find(item => item.order_position === position);
      if (existing) {
        return prev.map(item => 
          item.order_position === position 
            ? { ...item, ...updates }
            : item
        );
      } else {
        return [...prev, { 
          id: `temp-${position}`, 
          order_position: position,
          initial_state: 'image',
          front_image_url: '',
          front_text: '',
          back_image_url: '',
          back_text: '',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...updates 
        } as RingBellGalleryItem];
      }
    });
  };

  const handleImageUpload = async (position: number, side: 'front' | 'back', file: File) => {
    try {
      const imageUrl = await ImageUploadService.uploadImage(file, 'website-images');
      const fieldName = side === 'front' ? 'front_image_url' : 'back_image_url';
      updateItem(position, { [fieldName]: imageUrl });
      toast.success(`${side} image uploaded successfully`);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    }
  };

  const saveItem = async (position: number) => {
    setSaving(true);
    try {
      const item = getItemForPosition(position);
      
      // Validate required fields
      if (!item.front_text && !item.front_image_url) {
        toast.error('Please provide either front text or front image');
        return;
      }

      const success = await ringBellGalleryService.saveItem({
        order_position: item.order_position!,
        initial_state: item.initial_state!,
        front_image_url: item.front_image_url,
        front_text: item.front_text,
        back_image_url: item.back_image_url,
        back_text: item.back_text,
        is_active: item.is_active!
      });

      if (success) {
        toast.success(`Position ${position} saved successfully`);
        await loadItems(); // Reload to get updated data
      } else {
        toast.error('Failed to save item');
      }
    } catch (error) {
      console.error('Error saving item:', error);
      toast.error('Failed to save item');
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (position: number) => {
    const item = items.find(i => i.order_position === position);
    if (!item || item.id.startsWith('temp-')) {
      // Just remove from local state if it's a temporary item
      setItems(prev => prev.filter(i => i.order_position !== position));
      return;
    }

    try {
      const success = await ringBellGalleryService.deleteItem(item.id);
      if (success) {
        toast.success(`Position ${position} deleted successfully`);
        await loadItems();
      } else {
        toast.error('Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading gallery settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Ring Bell Gallery Settings</h2>
          <p className="text-muted-foreground">
            Manage the interactive 3x3 gallery for "Does This Ring a Bell?" section
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-9">
          {Array.from({ length: 9 }, (_, i) => (
            <TabsTrigger key={i + 1} value={String(i + 1)}>
              {i + 1}
            </TabsTrigger>
          ))}
        </TabsList>

        {Array.from({ length: 9 }, (_, i) => {
          const position = i + 1;
          const item = getItemForPosition(position);
          
          return (
            <TabsContent key={position} value={String(position)}>
              <Card>
                <CardHeader>
                  <CardTitle>Position {position}</CardTitle>
                  <CardDescription>
                    Configure the content for gallery position {position}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Initial State Toggle */}
                  <div className="space-y-2">
                    <Label>Initial Display State</Label>
                    <Select 
                      value={item.initial_state} 
                      onValueChange={(value: 'image' | 'text') => 
                        updateItem(position, { initial_state: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="image">Show Image First</SelectItem>
                        <SelectItem value="text">Show Text First</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Choose whether to show image or text initially (before hover)
                    </p>
                  </div>

                  {/* Front Content */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Front Content</h3>
                    
                    {/* Front Image */}
                    <div className="space-y-2">
                      <Label>Front Image</Label>
                      <div className="flex items-center gap-4">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(position, 'front', file);
                          }}
                          className="flex-1"
                        />
                        {item.front_image_url && (
                          <img 
                            src={item.front_image_url} 
                            alt="Front preview" 
                            className="w-16 h-16 object-cover rounded border"
                          />
                        )}
                      </div>
                    </div>

                    {/* Front Text */}
                    <div className="space-y-2">
                      <Label>Front Text</Label>
                      <Textarea
                        value={item.front_text || ''}
                        onChange={(e) => updateItem(position, { front_text: e.target.value })}
                        placeholder="Enter text content for the front side..."
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Back Content */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Back Content (On Hover)</h3>
                    
                    {/* Back Image */}
                    <div className="space-y-2">
                      <Label>Back Image</Label>
                      <div className="flex items-center gap-4">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(position, 'back', file);
                          }}
                          className="flex-1"
                        />
                        {item.back_image_url && (
                          <img 
                            src={item.back_image_url} 
                            alt="Back preview" 
                            className="w-16 h-16 object-cover rounded border"
                          />
                        )}
                      </div>
                    </div>

                    {/* Back Text */}
                    <div className="space-y-2">
                      <Label>Back Text</Label>
                      <Textarea
                        value={item.back_text || ''}
                        onChange={(e) => updateItem(position, { back_text: e.target.value })}
                        placeholder="Enter text content for the back side (shown on hover)..."
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Active Toggle */}
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`active-${position}`}
                      checked={item.is_active}
                      onCheckedChange={(checked) => updateItem(position, { is_active: checked })}
                    />
                    <Label htmlFor={`active-${position}`}>
                      {item.is_active ? 'Active' : 'Inactive'}
                    </Label>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4">
                    <Button 
                      onClick={() => saveItem(position)}
                      disabled={saving}
                      className="flex-1"
                    >
                      {saving ? 'Saving...' : 'Save Position'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => deleteItem(position)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

export default RingBellGallerySettings;