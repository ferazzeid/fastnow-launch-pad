import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Search, Plus, Edit, Trash2, Languages } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { TranslationService } from '@/services/TranslationService';
import { SiteSettingsService } from '@/services/SiteSettingsService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Translation {
  id: string;
  translation_key: string;
  language_code: string;
  translated_text: string;
  created_at: string;
  updated_at: string;
}

const SUPPORTED_LANGUAGES = [
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
];

const AdminTranslationsContent: React.FC = () => {
  const { toast } = useToast();
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingTranslation, setEditingTranslation] = useState<Translation | null>(null);
  const [translationsEnabled, setTranslationsEnabled] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    translation_key: '',
    language_code: '',
    translated_text: '',
    source_text: ''
  });

  const loadTranslations = async () => {
    try {
      const { data, error } = await supabase
        .from('ui_translations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTranslations(data || []);
    } catch (error) {
      console.error('Error loading translations:', error);
      toast({
        title: "Error",
        description: "Failed to load translations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadTranslationSettings = async () => {
    try {
      const enabled = await SiteSettingsService.getSetting('translation_system_enabled');
      setTranslationsEnabled(enabled === true);
    } catch (error) {
      console.error('Error loading translation settings:', error);
      setTranslationsEnabled(false);
    }
  };

  useEffect(() => {
    loadTranslations();
    loadTranslationSettings();
  }, []);

  const handleToggleTranslations = async (enabled: boolean) => {
    try {
      await SiteSettingsService.setSetting('translation_system_enabled', enabled);
      setTranslationsEnabled(enabled);
      toast({
        title: "Success",
        description: `Translation system ${enabled ? 'enabled' : 'disabled'}`,
      });
      
      // Reload page to update language switcher
      window.location.reload();
    } catch (error) {
      console.error('Error updating translation settings:', error);
      toast({
        title: "Error",
        description: "Failed to update translation settings",
        variant: "destructive",
      });
    }
  };

  const filteredTranslations = translations.filter(t => {
    const matchesSearch = t.translation_key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.translated_text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLanguage = selectedLanguage === 'all' || t.language_code === selectedLanguage;
    return matchesSearch && matchesLanguage;
  });

  const handleAddTranslation = async () => {
    if (!formData.translation_key || !formData.language_code || !formData.translated_text) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('ui_translations')
        .insert({
          translation_key: formData.translation_key,
          language_code: formData.language_code,
          translated_text: formData.translated_text,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Translation added successfully",
      });

      setShowAddDialog(false);
      setFormData({ translation_key: '', language_code: '', translated_text: '', source_text: '' });
      loadTranslations();
    } catch (error) {
      console.error('Error adding translation:', error);
      toast({
        title: "Error",
        description: "Failed to add translation",
        variant: "destructive",
      });
    }
  };

  const handleEditTranslation = async () => {
    if (!editingTranslation) return;

    try {
      const { error } = await supabase
        .from('ui_translations')
        .update({
          translated_text: formData.translated_text,
        })
        .eq('id', editingTranslation.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Translation updated successfully",
      });

      setShowEditDialog(false);
      setEditingTranslation(null);
      setFormData({ translation_key: '', language_code: '', translated_text: '', source_text: '' });
      loadTranslations();
    } catch (error) {
      console.error('Error updating translation:', error);
      toast({
        title: "Error",
        description: "Failed to update translation",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTranslation = async (id: string) => {
    if (!confirm('Are you sure you want to delete this translation?')) return;

    try {
      const { error } = await supabase
        .from('ui_translations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Translation deleted successfully",
      });

      loadTranslations();
    } catch (error) {
      console.error('Error deleting translation:', error);
      toast({
        title: "Error",
        description: "Failed to delete translation",
        variant: "destructive",
      });
    }
  };

  const handleAutoTranslate = async () => {
    if (!formData.source_text || !formData.language_code) {
      toast({
        title: "Error",
        description: "Please provide source text and select target language",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await TranslationService.translateText({
        text: formData.source_text,
        targetLanguage: formData.language_code,
        context: 'Admin interface translation'
      });

      setFormData(prev => ({
        ...prev,
        translated_text: result.translatedText,
        translation_key: prev.translation_key || `auto_${Date.now()}`
      }));

      toast({
        title: "Success",
        description: "Auto-translation completed",
      });
    } catch (error) {
      console.error('Auto-translation error:', error);
      toast({
        title: "Error",
        description: "Auto-translation failed",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (translation: Translation) => {
    setEditingTranslation(translation);
    setFormData({
      translation_key: translation.translation_key,
      language_code: translation.language_code,
      translated_text: translation.translated_text,
      source_text: ''
    });
    setShowEditDialog(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Translation System Toggle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="w-5 h-5" />
            Translation System
          </CardTitle>
          <CardDescription>
            Enable or disable the language switcher and translation features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Switch
              id="translations-enabled"
              checked={translationsEnabled}
              onCheckedChange={handleToggleTranslations}
            />
            <Label htmlFor="translations-enabled">
              {translationsEnabled ? 'Translation system enabled' : 'Translation system disabled'}
            </Label>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            When disabled, the language switcher will be hidden from the navigation menu.
          </p>
        </CardContent>
      </Card>

      {translationsEnabled && (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Translation Management</h2>
              <p className="text-muted-foreground">Manage AI translations for multilingual support</p>
            </div>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Translation
            </Button>
          </div>

          <div className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search translations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-48">
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Languages" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Languages</SelectItem>
                        {SUPPORTED_LANGUAGES.map(lang => (
                          <SelectItem key={lang.code} value={lang.code}>
                            {lang.flag} {lang.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Translations List */}
            <div className="grid gap-4">
              {filteredTranslations.map((translation) => {
                const language = SUPPORTED_LANGUAGES.find(l => l.code === translation.language_code);
                return (
                  <Card key={translation.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">
                              {language?.flag} {language?.name || translation.language_code}
                            </Badge>
                            <code className="text-sm bg-muted px-2 py-1 rounded">
                              {translation.translation_key}
                            </code>
                          </div>
                          <p className="text-gray-900 mb-2">{translation.translated_text}</p>
                          <p className="text-xs text-muted-foreground">
                            Created: {new Date(translation.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditDialog(translation)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteTranslation(translation.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {filteredTranslations.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <p className="text-muted-foreground">No translations found</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </>
      )}

      {/* Add Translation Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Translation</DialogTitle>
            <DialogDescription>
              Add a new translation or use AI to automatically translate text.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Translation Key</label>
              <Input
                placeholder="e.g., button.save, menu.home"
                value={formData.translation_key}
                onChange={(e) => setFormData(prev => ({ ...prev, translation_key: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Language</label>
              <Select value={formData.language_code} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, language_code: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_LANGUAGES.map(lang => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Source Text (for auto-translation)</label>
              <Input
                placeholder="Enter English text to translate"
                value={formData.source_text}
                onChange={(e) => setFormData(prev => ({ ...prev, source_text: e.target.value }))}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAutoTranslate}
                className="mt-2"
                disabled={!formData.source_text || !formData.language_code}
              >
                Auto Translate
              </Button>
            </div>
            
            <div>
              <label className="text-sm font-medium">Translated Text</label>
              <Textarea
                placeholder="Enter the translated text"
                value={formData.translated_text}
                onChange={(e) => setFormData(prev => ({ ...prev, translated_text: e.target.value }))}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTranslation}>
              Add Translation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Translation Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Translation</DialogTitle>
            <DialogDescription>
              Update the translated text for this entry.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Translation Key</label>
              <Input value={formData.translation_key} disabled />
            </div>
            
            <div>
              <label className="text-sm font-medium">Language</label>
              <Input 
                value={SUPPORTED_LANGUAGES.find(l => l.code === formData.language_code)?.name || formData.language_code} 
                disabled 
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Translated Text</label>
              <Textarea
                value={formData.translated_text}
                onChange={(e) => setFormData(prev => ({ ...prev, translated_text: e.target.value }))}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditTranslation}>
              Update Translation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTranslationsContent;