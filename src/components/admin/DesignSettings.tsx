
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

interface ColorSettings {
  creamBase: string;
  mintLight: string;
  mintDark: string;
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
  
  // Color settings
  const [colors, setColors] = useState<ColorSettings>({
    creamBase: localStorage.getItem('fastingApp_creamBase') || '#F2F0E6',
    mintLight: localStorage.getItem('fastingApp_mintLight') || '#A3D9B1',
    mintDark: localStorage.getItem('fastingApp_mintDark') || '#6A8D74'
  });

  useEffect(() => {
    // Load saved elements from localStorage
    const savedElements = localStorage.getItem('fastingApp_customElements');
    if (savedElements) {
      setElements(JSON.parse(savedElements));
    } else {
      setElements(defaultElements);
    }
    
    // Apply saved colors on load
    applyColors(colors);
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
  
  // Handle color input changes
  const handleColorChange = (colorName: keyof ColorSettings, value: string) => {
    setColors(prev => ({ ...prev, [colorName]: value }));
  };
  
  // Apply colors to the document root
  const applyColors = (colorValues: ColorSettings) => {
    const root = document.documentElement;
    
    // Convert hex to HSL for CSS custom properties
    const creamHsl = hexToHsl(colorValues.creamBase);
    const mintLightHsl = hexToHsl(colorValues.mintLight);
    const mintDarkHsl = hexToHsl(colorValues.mintDark);
    
    // Update primary color (used by buttons and accent elements)
    root.style.setProperty('--primary', `${mintDarkHsl.h} ${mintDarkHsl.s}% ${mintDarkHsl.l}%`);
    
    // Update accent green colors
    root.style.setProperty('--accent-green-light', colorValues.mintLight);
    root.style.setProperty('--accent-green', colorValues.mintDark);
    root.style.setProperty('--accent-green-dark', calculateDarkerShade(colorValues.mintDark, 0.1));
    
    // Update background colors if cream is being used as background
    if (colorValues.creamBase !== '#F2F0E6') {
      root.style.setProperty('--background', `${creamHsl.h} ${creamHsl.s}% ${creamHsl.l}%`);
      root.style.setProperty('--card', `${creamHsl.h} ${creamHsl.s}% ${creamHsl.l}%`);
    }
    
    // Save to localStorage for persistence
    localStorage.setItem('fastingApp_creamBase', colorValues.creamBase);
    localStorage.setItem('fastingApp_mintLight', colorValues.mintLight);
    localStorage.setItem('fastingApp_mintDark', colorValues.mintDark);
    
    toast.success('Color theme updated');
  };
  
  // Helper functions to calculate shadow colors
  const calculateDarkerShade = (hex: string, percent: number): string => {
    const { r, g, b } = hexToRgb(hex);
    const factor = 1 - percent;
    
    const newR = Math.floor(r * factor);
    const newG = Math.floor(g * factor);
    const newB = Math.floor(b * factor);
    
    return rgbToHex(newR, newG, newB);
  };
  
  const calculateLighterShade = (hex: string, percent: number): string => {
    const { r, g, b } = hexToRgb(hex);
    const factor = percent;
    
    const newR = Math.floor(r + (255 - r) * factor);
    const newG = Math.floor(g + (255 - g) * factor);
    const newB = Math.floor(b + (255 - b) * factor);
    
    return rgbToHex(newR, newG, newB);
  };
  
  // Color conversion utilities
  const hexToRgb = (hex: string): { r: number, g: number, b: number } => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const formattedHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(formattedHex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };
  
  const componentToHex = (c: number): string => {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
  };
  
  // Convert hex to HSL
  const hexToHsl = (hex: string): { h: number, s: number, l: number } => {
    const { r, g, b } = hexToRgb(hex);
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;
    
    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    let h = 0, s = 0, l = (max + min) / 2;
    
    if (max !== min) {
      const delta = max - min;
      s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
      
      switch (max) {
        case rNorm: h = (gNorm - bNorm) / delta + (gNorm < bNorm ? 6 : 0); break;
        case gNorm: h = (bNorm - rNorm) / delta + 2; break;
        case bNorm: h = (rNorm - gNorm) / delta + 4; break;
      }
      h /= 6;
    }
    
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };
  
  // Save color settings
  const handleSaveColors = () => {
    applyColors(colors);
  };
  
  // Reset colors to default
  const handleResetColors = () => {
    const defaultColors = {
      creamBase: '#F2F0E6',
      mintLight: '#A3D9B1',
      mintDark: '#6A8D74'
    };
    setColors(defaultColors);
    applyColors(defaultColors);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Color Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cream-base">Cream (Background/Base)</Label>
                <div className="flex gap-2">
                  <Input
                    id="cream-base"
                    type="color"
                    value={colors.creamBase}
                    onChange={(e) => handleColorChange('creamBase', e.target.value)}
                    className="w-12 h-12 p-1 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={colors.creamBase}
                    onChange={(e) => handleColorChange('creamBase', e.target.value)}
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Main background color</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mint-light">Light Mint Green (Accents)</Label>
                <div className="flex gap-2">
                  <Input
                    id="mint-light"
                    type="color"
                    value={colors.mintLight}
                    onChange={(e) => handleColorChange('mintLight', e.target.value)}
                    className="w-12 h-12 p-1 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={colors.mintLight}
                    onChange={(e) => handleColorChange('mintLight', e.target.value)}
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Used for thumb, active states</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mint-dark">Dark Mint Green (Text)</Label>
                <div className="flex gap-2">
                  <Input
                    id="mint-dark"
                    type="color"
                    value={colors.mintDark}
                    onChange={(e) => handleColorChange('mintDark', e.target.value)}
                    className="w-12 h-12 p-1 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={colors.mintDark}
                    onChange={(e) => handleColorChange('mintDark', e.target.value)}
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Used for icon outlines, text, accents</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button onClick={handleSaveColors}>Apply Colors</Button>
              <Button variant="outline" onClick={handleResetColors}>Reset to Default</Button>
            </div>
            
            <div className="p-4 border rounded-md mt-4">
              <h4 className="font-medium mb-2">Color Preview</h4>
              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 rounded-md" style={{ backgroundColor: colors.creamBase }}></div>
                <div className="w-12 h-12 rounded-full" style={{ backgroundColor: colors.mintLight }}></div>
                <div className="w-8 h-8 rounded-full" style={{ backgroundColor: colors.mintDark }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
