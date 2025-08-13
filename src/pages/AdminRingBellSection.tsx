import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ImageUploadService } from '@/services/ImageUploadService';

interface RingBellItem {
  id: string;
  imageUrl: string;
  quote: string;
  order: number;
}

const AdminRingBellSection = () => {
  const [items, setItems] = useState<RingBellItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);

  // Load existing items
  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'ring_bell_items')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data?.setting_value) {
        const items = Array.isArray(data.setting_value) ? data.setting_value : [];
        setItems(items.map((item: any, index: number) => ({
          id: item.id || `item-${index}`,
          imageUrl: item.imageUrl || '',
          quote: item.quote || '',
          order: item.order || index
        })));
      } else {
        // Set default items if none exist
        const defaultItems: RingBellItem[] = [
          {
            id: 'airplane',
            imageUrl: '/lovable-uploads/9fe0f065-3ab9-4c72-9162-5e84ecd29940.png',
            quote: 'Fit comfortably into an airplane seat without a second thought.',
            order: 0
          },
          {
            id: 'pool',
            imageUrl: '/lovable-uploads/770570cf-21c8-41b5-9fd0-ccefb220b9c0.png',
            quote: 'Walk into the pool without feeling the need to cover up.',
            order: 1
          },
          {
            id: 'shopping',
            imageUrl: '/lovable-uploads/bce2f2c2-1b1b-4b69-b3f3-20e8715f94d2.png',
            quote: 'Order clothes online without sending everything back.',
            order: 2
          },
          {
            id: 'suit',
            imageUrl: '/lovable-uploads/f984a3bc-024b-4ea3-ba1b-1264a8c298d3.png',
            quote: 'Wear that premium suit and actually look like it was made for you.',
            order: 3
          },
          {
            id: 'gym',
            imageUrl: '/lovable-uploads/d8b92a30-a0a2-4acd-8f8d-1208eddab2e6.png',
            quote: 'Train at the gym without feeling like the odd one out.',
            order: 4
          },
          {
            id: 'running',
            imageUrl: '/lovable-uploads/790fae5b-122d-4e10-b65f-996b6abc5667.png',
            quote: 'Run across the street without worrying if you still can.',
            order: 5
          },
          {
            id: 'wardrobe',
            imageUrl: '',
            quote: 'Slip into your favorite clothes from years ago—and feel incredible in them.',
            order: 6
          }
        ];
        setItems(defaultItems);
      }
    } catch (error) {
      console.error('Error loading ring bell items:', error);
      toast.error('Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  const saveItems = async () => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          setting_key: 'ring_bell_items',
          setting_value: items as any
        });

      if (error) throw error;

      toast.success('Items saved successfully');
    } catch (error) {
      console.error('Error saving ring bell items:', error);
      toast.error('Failed to save items');
    }
  };

  const handleImageUpload = async (itemId: string, file: File) => {
    setUploading(itemId);
    try {
      const uploadResult = await ImageUploadService.uploadImage(file, 'website-images');
      
      setItems(prev => prev.map(item => 
        item.id === itemId 
          ? { ...item, imageUrl: uploadResult.url }
          : item
      ));
      
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(null);
    }
  };

  const updateQuote = (itemId: string, quote: string) => {
    setItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, quote }
        : item
    ));
  };

  const addNewItem = () => {
    const newItem: RingBellItem = {
      id: `item-${Date.now()}`,
      imageUrl: '',
      quote: '',
      order: items.length
    };
    setItems(prev => [...prev, newItem]);
  };

  const deleteItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const moveItem = (itemId: string, direction: 'up' | 'down') => {
    setItems(prev => {
      const currentIndex = prev.findIndex(item => item.id === itemId);
      if (currentIndex === -1) return prev;

      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;

      const newItems = [...prev];
      [newItems[currentIndex], newItems[newIndex]] = [newItems[newIndex], newItems[currentIndex]];
      
      // Update order values
      return newItems.map((item, index) => ({
        ...item,
        order: index
      }));
    });
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">"Does this ring a bell?" Section Management</h1>
        <Button onClick={saveItems} className="bg-primary text-white">
          Save All Changes
        </Button>
      </div>

      <div className="space-y-6">
        {items.map((item, index) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Item #{index + 1}</span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => moveItem(item.id, 'up')}
                    disabled={index === 0}
                  >
                    ↑
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => moveItem(item.id, 'down')}
                    disabled={index === items.length - 1}
                  >
                    ↓
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteItem(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image Upload */}
                <div>
                  <Label>Image</Label>
                  <div className="mt-2">
                    {item.imageUrl ? (
                      <div className="relative">
                        <img
                          src={item.imageUrl}
                          alt="Ring bell item"
                          className="w-32 h-32 rounded-full object-cover shadow-xl"
                        />
                        <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                          <Upload className="w-6 h-6 text-white" />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(item.id, file);
                            }}
                            disabled={uploading === item.id}
                          />
                        </label>
                      </div>
                    ) : (
                      <label className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                        <div className="text-center">
                          <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                          <span className="text-sm text-gray-500">Upload Image</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(item.id, file);
                          }}
                          disabled={uploading === item.id}
                        />
                      </label>
                    )}
                    {uploading === item.id && (
                      <p className="text-sm text-blue-600 mt-2">Uploading...</p>
                    )}
                  </div>
                </div>

                {/* Quote */}
                <div>
                  <Label htmlFor={`quote-${item.id}`}>Quote</Label>
                  <Input
                    id={`quote-${item.id}`}
                    value={item.quote}
                    onChange={(e) => updateQuote(item.id, e.target.value)}
                    placeholder="Enter a punchy quote..."
                    className="mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card>
          <CardContent className="pt-6">
            <Button onClick={addNewItem} variant="outline" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add New Item
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminRingBellSection;