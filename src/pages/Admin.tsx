import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { Slider } from "@/components/ui/slider";
import { Icons } from '@/components/icons/IconSelector';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const authStatus = localStorage.getItem('fastingApp_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple authentication for now
    if ((username === 'admin' && password === 'admin')) {
      localStorage.setItem('fastingApp_auth', 'true');
      setIsAuthenticated(true);
      toast.success("Logged in successfully");
    } else {
      toast.error("Invalid credentials");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('fastingApp_auth');
    setIsAuthenticated(false);
    toast.success("Logged out successfully");
  };

  const LoginForm = () => (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username"
                type="text" 
                placeholder="Username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password"
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">Login</Button>
            
            <div className="text-center text-sm text-muted-foreground mt-4">
              <p>Use username: admin and password: admin</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold">FastNow Admin</h1>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
      </header>
      
      <main className="container py-8">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-5 mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="pages">Pages</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <GeneralSettings />
          </TabsContent>
          
          <TabsContent value="content">
            <ContentSettings />
          </TabsContent>
          
          <TabsContent value="features">
            <FeaturesSettings />
          </TabsContent>
          
          <TabsContent value="seo">
            <SeoSettings />
          </TabsContent>
          
          <TabsContent value="pages">
            <PagesSettings navigate={navigate} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

// Admin Tab Components
const GeneralSettings = () => {
  const [logo, setLogo] = useState<File | null>(null);
  const [appImage, setAppImage] = useState<File | null>(null);
  const [appStoreLink, setAppStoreLink] = useState(localStorage.getItem('fastingApp_appStoreLink') || 'https://apps.apple.com');
  const [googlePlayLink, setGooglePlayLink] = useState(localStorage.getItem('fastingApp_googlePlayLink') || 'https://play.google.com');
  const [logoPreview, setLogoPreview] = useState(localStorage.getItem('fastingApp_logoUrl') || '');
  const [mockupPreview, setMockupPreview] = useState(localStorage.getItem('fastingApp_mockupUrl') || '');
  const [imageSize, setImageSize] = useState<number>(
    parseInt(localStorage.getItem('fastingApp_imageSize') || '300')
  );
  const [imageAlt, setImageAlt] = useState(
    localStorage.getItem('fastingApp_imageAlt') || 'Fasting app interface preview'
  );

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(e.target.files[0]);
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      setLogoPreview(imageUrl);
      localStorage.setItem('fastingApp_logoUrl', imageUrl);
    }
  };

  const handleAppImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAppImage(e.target.files[0]);
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      setMockupPreview(imageUrl);
      localStorage.setItem('fastingApp_mockupUrl', imageUrl);
    }
  };

  const handleLinksUpdate = () => {
    localStorage.setItem('fastingApp_appStoreLink', appStoreLink);
    localStorage.setItem('fastingApp_googlePlayLink', googlePlayLink);
    toast.success("Links updated successfully");
  };

  const handleImageSizeChange = (value: number[]) => {
    const newSize = value[0];
    setImageSize(newSize);
    localStorage.setItem('fastingApp_imageSize', newSize.toString());
    toast.success("Image size updated");
  };
  
  const handleAltTextUpdate = () => {
    localStorage.setItem('fastingApp_imageAlt', imageAlt);
    toast.success("Alt text updated successfully");
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Logo Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="logo-upload">Upload Logo</Label>
              <Input 
                id="logo-upload" 
                type="file" 
                accept="image/*" 
                onChange={handleLogoChange} 
                className="mt-1"
              />
              <p className="text-sm text-muted-foreground mt-1">
                This will replace "fastnow.app" in the header
              </p>
            </div>
            <div>
              {logoPreview && (
                <div className="border rounded p-4 flex justify-center">
                  <img 
                    src={logoPreview} 
                    alt="Logo preview" 
                    className="max-h-16" 
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>App Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="mockup-upload">Upload App Image</Label>
              <Input 
                id="mockup-upload" 
                type="file" 
                accept="image/*" 
                onChange={handleAppImageChange}
                className="mt-1" 
              />
              <p className="text-sm text-muted-foreground mt-1">
                This will replace the phone image on the landing page
              </p>
            </div>
            <div>
              {mockupPreview && (
                <div className="border rounded p-4 flex justify-center">
                  <img 
                    src={mockupPreview} 
                    alt="App image preview" 
                    className="max-h-40" 
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2 pt-4">
            <Label htmlFor="image-size">App Image Size (px)</Label>
            <div className="flex items-center gap-4">
              <Slider
                id="image-size"
                defaultValue={[imageSize]}
                min={200}
                max={600}
                step={10}
                onValueChange={handleImageSizeChange}
                className="flex-1"
              />
              <span className="w-12 text-center">{imageSize}</span>
            </div>
          </div>
          
          <div className="space-y-2 pt-4">
            <Label htmlFor="image-alt">App Image Alt Text</Label>
            <Input
              id="image-alt"
              value={imageAlt}
              onChange={(e) => setImageAlt(e.target.value)}
              placeholder="Descriptive alt text for the app image"
            />
            <p className="text-xs text-muted-foreground">
              Important for accessibility and SEO
            </p>
            <Button onClick={handleAltTextUpdate} className="mt-2">Save Alt Text</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>App Store Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="app-store">App Store Link</Label>
              <Input 
                id="app-store" 
                value={appStoreLink} 
                onChange={(e) => setAppStoreLink(e.target.value)} 
                placeholder="https://apps.apple.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="google-play">Google Play Link</Label>
              <Input 
                id="google-play" 
                value={googlePlayLink} 
                onChange={(e) => setGooglePlayLink(e.target.value)} 
                placeholder="https://play.google.com/..."
              />
            </div>
          </div>
          <Button onClick={handleLinksUpdate}>Save Links</Button>
        </CardContent>
      </Card>
    </div>
  );
};

const ContentSettings = () => {
  const [heroTitle, setHeroTitle] = useState(localStorage.getItem('fastingApp_heroTitle') || 'Get things done,\nfaster than ever.');
  const [heroSubtitle, setHeroSubtitle] = useState(localStorage.getItem('fastingApp_heroSubtitle') || 'The minimalist fasting app designed to streamline your fasting journey and boost your health in days.');
  const [ctaTitle, setCtaTitle] = useState(localStorage.getItem('fastingApp_ctaTitle') || 'Ready to start your fasting journey?');
  const [ctaSubtitle, setCtaSubtitle] = useState(localStorage.getItem('fastingApp_ctaSubtitle') || 'Download fastnow.app today and transform your health through fasting.');

  const handleContentUpdate = () => {
    localStorage.setItem('fastingApp_heroTitle', heroTitle);
    localStorage.setItem('fastingApp_heroSubtitle', heroSubtitle);
    localStorage.setItem('fastingApp_ctaTitle', ctaTitle);
    localStorage.setItem('fastingApp_ctaSubtitle', ctaSubtitle);
    toast.success("Content updated successfully");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Main Content Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="hero-title">Hero Title (H1)</Label>
          <Input 
            id="hero-title" 
            value={heroTitle} 
            onChange={(e) => setHeroTitle(e.target.value)} 
          />
          <p className="text-xs text-muted-foreground">Use \n for line breaks</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="hero-subtitle">Hero Subtitle (H2)</Label>
          <Input 
            id="hero-subtitle" 
            value={heroSubtitle} 
            onChange={(e) => setHeroSubtitle(e.target.value)} 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cta-title">CTA Section Title (H3)</Label>
          <Input 
            id="cta-title" 
            value={ctaTitle} 
            onChange={(e) => setCtaTitle(e.target.value)} 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cta-subtitle">CTA Section Subtitle</Label>
          <Input 
            id="cta-subtitle" 
            value={ctaSubtitle} 
            onChange={(e) => setCtaSubtitle(e.target.value)} 
          />
        </div>

        <Button onClick={handleContentUpdate}>Save Content</Button>
      </CardContent>
    </Card>
  );
};

const FeaturesSettings = () => {
  const availableIcons = Object.keys(Icons);
  const defaultFeatures = [
    {
      title: "Intermittent Fasting",
      description: "Easily track your fasting periods with our intuitive timer interface.",
      iconName: "SpeedIcon"
    },
    {
      title: "Private & Secure",
      description: "Your health data is encrypted and never shared with third parties.",
      iconName: "SecurityIcon"
    },
    {
      title: "Simple Design",
      description: "Minimal learning curve with our clean, user-friendly design.",
      iconName: "IntuitiveIcon"
    }
  ];

  const [featuresTitle, setFeaturesTitle] = useState(localStorage.getItem('fastingApp_featuresTitle') || 'Why choose fastnow.app?');
  const [features, setFeatures] = useState<Array<{title: string, description: string, iconName: string}>>(
    JSON.parse(localStorage.getItem('fastingApp_features') || JSON.stringify(defaultFeatures))
  );

  const updateFeature = (index: number, field: 'title' | 'description' | 'iconName', value: string) => {
    const updatedFeatures = features.map((feature, i) => 
      i === index ? { ...feature, [field]: value } : feature
    );
    setFeatures(updatedFeatures);
  };

  const handleFeaturesUpdate = () => {
    localStorage.setItem('fastingApp_featuresTitle', featuresTitle);
    localStorage.setItem('fastingApp_features', JSON.stringify(features));
    toast.success("Features updated successfully");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Features Section Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="features-title">Features Section Title (H3)</Label>
          <Input 
            id="features-title" 
            value={featuresTitle} 
            onChange={(e) => setFeaturesTitle(e.target.value)} 
          />
        </div>

        <div className="space-y-6">
          {features.map((feature, index) => (
            <div key={index} className="p-4 border rounded-md space-y-3">
              <div className="space-y-2">
                <Label htmlFor={`feature-${index}-title`}>Feature {index + 1} Title</Label>
                <Input 
                  id={`feature-${index}-title`}
                  value={feature.title} 
                  onChange={(e) => updateFeature(index, 'title', e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`feature-${index}-desc`}>Feature {index + 1} Description</Label>
                <Input 
                  id={`feature-${index}-desc`}
                  value={feature.description} 
                  onChange={(e) => updateFeature(index, 'description', e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`feature-${index}-icon`}>Feature {index + 1} Icon</Label>
                <select 
                  id={`feature-${index}-icon`}
                  value={feature.iconName}
                  onChange={(e) => updateFeature(index, 'iconName', e.target.value)}
                  className="w-full p-2 rounded-md border border-input bg-background"
                >
                  {availableIcons.map(iconName => (
                    <option key={iconName} value={iconName}>
                      {iconName.replace(/Icon$/, '')}
                    </option>
                  ))}
                </select>
                <div className="mt-2 p-2 border rounded flex justify-center">
                  {Icons[feature.iconName as keyof typeof Icons]?.({ className: "w-8 h-8" })}
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button onClick={handleFeaturesUpdate}>Save Features</Button>
      </CardContent>
    </Card>
  );
};

// New SEO Settings Component
const SeoSettings = () => {
  const [metaTitle, setMetaTitle] = useState(
    localStorage.getItem('fastingApp_metaTitle') || 'fastnow.app - Intermittent Fasting Made Simple'
  );
  const [metaDescription, setMetaDescription] = useState(
    localStorage.getItem('fastingApp_metaDescription') || 'Track your fasting periods with our minimalist, intuitive app. Download fastnow.app today and transform your health through fasting.'
  );
  
  const handleSeoUpdate = () => {
    localStorage.setItem('fastingApp_metaTitle', metaTitle);
    localStorage.setItem('fastingApp_metaDescription', metaDescription);
    toast.success("SEO settings updated successfully");
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>SEO Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="meta-title">Meta Title</Label>
          <Input 
            id="meta-title" 
            value={metaTitle} 
            onChange={(e) => setMetaTitle(e.target.value)} 
            placeholder="fastnow.app - Intermittent Fasting Made Simple"
          />
          <p className="text-xs text-muted-foreground">
            Recommended length: 50-60 characters
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="meta-description">Meta Description</Label>
          <Input 
            id="meta-description" 
            value={metaDescription} 
            onChange={(e) => setMetaDescription(e.target.value)} 
            placeholder="Track your fasting periods with our minimalist app..."
          />
          <p className="text-xs text-muted-foreground">
            Recommended length: 150-160 characters
          </p>
        </div>
        
        <div className="pt-2">
          <Button onClick={handleSeoUpdate}>Save SEO Settings</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const PagesSettings = ({ navigate }: { navigate: (path: string) => void }) => {
  const handleNavigate = (path: string) => {
    navigate(path);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Pages</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid sm:grid-cols-3 gap-4">
          <Button variant="outline" onClick={() => handleNavigate("/admin/privacy")}>
            Edit Privacy Policy
          </Button>
          <Button variant="outline" onClick={() => handleNavigate("/admin/terms")}>
            Edit Terms of Service
          </Button>
          <Button variant="outline" onClick={() => handleNavigate("/admin/contact")}>
            Edit Contact Page
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Admin;
