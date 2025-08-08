import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/sonner';
import { Upload, Trash2, Eye, EyeOff } from 'lucide-react';
import { BackgroundImageService, BackgroundImage } from '@/services/BackgroundImageService';
import { useAuth } from '@/hooks/useAuth';

const AdminBackgroundImages = () => {
  const { isAdmin, isLoading } = useAuth();
  const [images, setImages] = useState<BackgroundImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageName, setImageName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      toast.error('Access denied. Admin privileges required.');
      return;
    }
    
    if (isAdmin) {
      loadImages();
    }
  }, [isAdmin, isLoading]);

  const loadImages = async () => {
    try {
      const data = await BackgroundImageService.getAllImages();
      setImages(data);
    } catch (error) {
      console.error('Error loading images:', error);
      toast.error('Failed to load background images');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      setSelectedFile(file);
      setImageName(file.name.split('.')[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !imageName.trim()) {
      toast.error('Please select a file and enter a name');
      return;
    }

    setUploading(true);
    try {
      const imageUrl = await BackgroundImageService.uploadImage(selectedFile, imageName);
      await BackgroundImageService.createBackgroundImage(imageName, imageUrl);
      
      toast.success('Background image uploaded successfully');
      setSelectedFile(null);
      setImageName('');
      loadImages();
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSetActive = async (id: string) => {
    try {
      await BackgroundImageService.setActiveImage(id);
      toast.success('Background image activated');
      loadImages();
    } catch (error) {
      console.error('Error setting active image:', error);
      toast.error('Failed to activate image');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this background image?')) {
      return;
    }

    try {
      await BackgroundImageService.deleteImage(id);
      toast.success('Background image deleted');
      loadImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-600">You need admin privileges to access this page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Background Images</h1>
        <p className="text-muted-foreground">
          Manage background images for the website hero section
        </p>
      </div>

      {/* Upload Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Upload New Background Image</CardTitle>
          <CardDescription>
            Upload a new background image for the hero section
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="file-upload" className="block text-sm font-medium mb-2">
              Select Image
            </label>
            <Input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="mb-2"
            />
          </div>
          
          <div>
            <label htmlFor="image-name" className="block text-sm font-medium mb-2">
              Image Name
            </label>
            <Input
              id="image-name"
              type="text"
              value={imageName}
              onChange={(e) => setImageName(e.target.value)}
              placeholder="Enter a name for this background image"
            />
          </div>

          <Button 
            onClick={handleUpload} 
            disabled={!selectedFile || !imageName.trim() || uploading}
            className="w-full sm:w-auto"
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? 'Uploading...' : 'Upload Image'}
          </Button>
        </CardContent>
      </Card>

      {/* Images Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full text-center p-8">Loading images...</div>
        ) : images.length === 0 ? (
          <div className="col-span-full text-center p-8 text-muted-foreground">
            No background images found. Upload your first image above.
          </div>
        ) : (
          images.map((image) => (
            <Card key={image.id} className="overflow-hidden">
              <div className="aspect-video relative">
                <img
                  src={image.image_url}
                  alt={image.name}
                  className="w-full h-full object-cover"
                />
                {image.is_active && (
                  <Badge className="absolute top-2 right-2 bg-green-500">
                    Active
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">{image.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Uploaded {new Date(image.created_at).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant={image.is_active ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSetActive(image.id)}
                    disabled={image.is_active}
                  >
                    {image.is_active ? (
                      <>
                        <Eye className="w-4 h-4 mr-1" />
                        Active
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-4 h-4 mr-1" />
                        Activate
                      </>
                    )}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(image.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminBackgroundImages;