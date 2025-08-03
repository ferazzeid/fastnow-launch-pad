import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ImageUploadService } from "@/services/ImageUploadService";
import { Plus, X, Upload, Move, GripVertical } from "lucide-react";
import { toast } from "sonner";

interface AppScreenshot {
  id: string;
  url: string;
  title: string;
  order: number;
}

const AppScreenshotSettings = () => {
  const [screenshots, setScreenshots] = useState<AppScreenshot[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    loadScreenshots();
  }, []);

  const loadScreenshots = () => {
    const saved = localStorage.getItem('fastingApp_appScreenshots');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setScreenshots(parsed.sort((a: AppScreenshot, b: AppScreenshot) => a.order - b.order));
      } catch (error) {
        console.error('Error loading screenshots:', error);
      }
    }
  };

  const saveScreenshots = (newScreenshots: AppScreenshot[]) => {
    localStorage.setItem('fastingApp_appScreenshots', JSON.stringify(newScreenshots));
    setScreenshots(newScreenshots);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setIsUploading(true);
    try {
      const result = await ImageUploadService.uploadImage(file, 'app-screenshots');
      
      const newScreenshot: AppScreenshot = {
        id: Date.now().toString(),
        url: result.url,
        title: `Screenshot ${screenshots.length + 1}`,
        order: screenshots.length
      };

      const updatedScreenshots = [...screenshots, newScreenshot];
      saveScreenshots(updatedScreenshots);
      toast.success('Screenshot uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload screenshot');
    } finally {
      setIsUploading(false);
    }
  };

  const handleTitleChange = (id: string, newTitle: string) => {
    const updated = screenshots.map(screenshot => 
      screenshot.id === id ? { ...screenshot, title: newTitle } : screenshot
    );
    saveScreenshots(updated);
  };

  const handleDelete = (id: string) => {
    const updated = screenshots.filter(screenshot => screenshot.id !== id)
      .map((screenshot, index) => ({ ...screenshot, order: index }));
    saveScreenshots(updated);
    toast.success('Screenshot deleted');
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const newScreenshots = [...screenshots];
    const draggedItem = newScreenshots[draggedIndex];
    
    // Remove dragged item
    newScreenshots.splice(draggedIndex, 1);
    // Insert at new position
    newScreenshots.splice(dropIndex, 0, draggedItem);
    
    // Update order values
    const reorderedScreenshots = newScreenshots.map((screenshot, index) => ({
      ...screenshot,
      order: index
    }));

    saveScreenshots(reorderedScreenshots);
    setDraggedIndex(null);
    toast.success('Screenshots reordered');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>App Screenshots Gallery</CardTitle>
          <CardDescription>
            Upload and manage app screenshots that will be displayed in the About FastNow App page. 
            Screenshots will be shown in a mobile app frame mockup.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Section */}
          <div>
            <Label htmlFor="screenshot-upload" className="text-base font-medium">
              Upload New Screenshot
            </Label>
            <div className="mt-2">
              <Input
                id="screenshot-upload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Upload PNG, JPG, or WebP images. Recommended size: 375x812px (iPhone aspect ratio)
              </p>
            </div>
          </div>

          {/* Screenshots List */}
          {screenshots.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-4">Current Screenshots ({screenshots.length})</h3>
              <div className="space-y-4">
                {screenshots.map((screenshot, index) => (
                  <div
                    key={screenshot.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    className="flex items-center gap-4 p-4 border rounded-lg bg-card hover:bg-accent/5 transition-colors cursor-move"
                  >
                    <GripVertical className="w-5 h-5 text-muted-foreground" />
                    
                    <div className="w-16 h-28 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={screenshot.url} 
                        alt={screenshot.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <Input
                        value={screenshot.title}
                        onChange={(e) => handleTitleChange(screenshot.id, e.target.value)}
                        placeholder="Screenshot title"
                        className="mb-2"
                      />
                      <p className="text-sm text-muted-foreground truncate">
                        Order: {index + 1}
                      </p>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(screenshot.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Alert className="mt-4">
                <AlertDescription>
                  Drag and drop screenshots to reorder them. The first screenshot will be shown by default, 
                  with navigation to view others in the gallery.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {screenshots.length === 0 && (
            <Alert>
              <Upload className="w-4 h-4" />
              <AlertDescription>
                No screenshots uploaded yet. Upload your first app screenshot to get started.
              </AlertDescription>
            </Alert>
          )}

          {isUploading && (
            <Alert>
              <AlertDescription>
                Uploading screenshot... Please wait.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AppScreenshotSettings;