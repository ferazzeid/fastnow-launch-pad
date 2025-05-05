
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ElementDesign {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

const DesignSettings: React.FC = () => {
  // Default UI elements that can be customized
  const defaultElements: ElementDesign[] = [
    { id: 'timer', name: 'Timer Circle', description: 'The main circular timer component', imageUrl: '' },
    { id: 'startButton', name: 'Start Button', description: 'The main start button', imageUrl: '' },
    { id: 'historyButton', name: 'History Button', description: 'The history navigation button', imageUrl: '' },
    { id: 'goalsButton', name: 'Goals Button', description: 'The goals button', imageUrl: '' },
    { id: 'settingsButton', name: 'Settings Button', description: 'The settings configuration button', imageUrl: '' },
    { id: 'sliderThumb', name: 'Slider Thumb', description: 'The draggable part of sliders', imageUrl: '' },
    { id: 'background3d', name: 'Background 3D Element', description: 'A 3D background element or texture', imageUrl: '' },
  ];

  const [elements, setElements] = useState<ElementDesign[]>([]);
  const [selectedElement, setSelectedElement] = useState<ElementDesign | null>(null);
  const [showDefaultDesign, setShowDefaultDesign] = useState(
    localStorage.getItem('fastingApp_showDefaultDesign') !== 'false'
  );

  useEffect(() => {
    // Load saved elements from localStorage
    const savedElements = localStorage.getItem('fastingApp_customElements');
    if (savedElements) {
      setElements(JSON.parse(savedElements));
    } else {
      setElements(defaultElements);
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, elementId: string) => {
    if (e.target.files && e.target.files[0]) {
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      
      // Update the element with the new image URL
      const updatedElements = elements.map(element => {
        if (element.id === elementId) {
          return { ...element, imageUrl };
        }
        return element;
      });
      
      setElements(updatedElements);
      localStorage.setItem('fastingApp_customElements', JSON.stringify(updatedElements));
      
      // Update the selected element if it's currently being edited
      if (selectedElement && selectedElement.id === elementId) {
        setSelectedElement({ ...selectedElement, imageUrl });
      }
      
      toast.success(`Image updated for ${elements.find(el => el.id === elementId)?.name}`);
    }
  };

  const handleClearImage = (elementId: string) => {
    const updatedElements = elements.map(element => {
      if (element.id === elementId) {
        return { ...element, imageUrl: '' };
      }
      return element;
    });
    
    setElements(updatedElements);
    localStorage.setItem('fastingApp_customElements', JSON.stringify(updatedElements));
    
    // Update the selected element if it's currently being edited
    if (selectedElement && selectedElement.id === elementId) {
      setSelectedElement({ ...selectedElement, imageUrl: '' });
    }
    
    toast.success(`Cleared custom image for ${elements.find(el => el.id === elementId)?.name}`);
  };

  const handleDefaultDesignToggle = () => {
    const newValue = !showDefaultDesign;
    setShowDefaultDesign(newValue);
    localStorage.setItem('fastingApp_showDefaultDesign', newValue.toString());
    toast.success(newValue ? 'Using default design as fallback' : 'Using only custom images');
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Design Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="default-design"
                checked={showDefaultDesign}
                onChange={handleDefaultDesignToggle}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="default-design">Show default design when custom images are not available</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              This will display the default neomorphic design when a custom image is not set for an element.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Custom UI Elements</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="elements" className="space-y-4">
            <TabsList>
              <TabsTrigger value="elements">Elements List</TabsTrigger>
              {selectedElement && (
                <TabsTrigger value="editor">{selectedElement.name} Editor</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="elements" className="space-y-6">
              <p className="text-sm text-muted-foreground">
                Select an element to customize with your own 3D assets or images.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {elements.map((element) => (
                  <div 
                    key={element.id} 
                    className="border rounded-md p-4 cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => setSelectedElement(element)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{element.name}</h3>
                        <p className="text-sm text-muted-foreground">{element.description}</p>
                      </div>
                      {element.imageUrl && (
                        <div className="w-12 h-12 rounded-md overflow-hidden border">
                          <img src={element.imageUrl} alt={element.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            {selectedElement && (
              <TabsContent value="editor" className="space-y-6">
                <div className="flex flex-col space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">{selectedElement.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedElement.description}</p>
                  </div>
                  
                  <div className="space-y-4">
                    <Label htmlFor={`image-upload-${selectedElement.id}`}>Upload Custom Image</Label>
                    <Input
                      id={`image-upload-${selectedElement.id}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, selectedElement.id)}
                      className="cursor-pointer"
                    />
                    
                    {selectedElement.imageUrl && (
                      <div className="space-y-4">
                        <div className="border rounded-md p-4">
                          <div className="text-sm font-medium mb-2">Current Image:</div>
                          <img 
                            src={selectedElement.imageUrl} 
                            alt={selectedElement.name} 
                            className="max-h-48 rounded-md mx-auto"
                          />
                        </div>
                        <Button 
                          variant="destructive" 
                          onClick={() => handleClearImage(selectedElement.id)}
                        >
                          Remove Image
                        </Button>
                      </div>
                    )}
                    
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedElement(null)}
                    >
                      Back to Elements List
                    </Button>
                  </div>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DesignSettings;
