import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { PageTranslationService } from '@/services/PageTranslationService';
import { MultilingualContentService } from '@/services/MultilingualContentService';
import { useTranslation } from 'react-i18next';
import { Languages, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface AdminTranslateButtonProps {
  pageKey: string;
  pageType: 'page_content' | 'blog_posts' | 'fasting_timeline_posts' | 'system_motivators' | 'faqs';
  recordId?: string;
  className?: string;
}

const SUPPORTED_LANGUAGES = [
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' }
];

const AdminTranslateButton: React.FC<AdminTranslateButtonProps> = ({
  pageKey,
  pageType,
  recordId,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationStatus, setTranslationStatus] = useState<Record<string, string>>({});
  const [detectedContent, setDetectedContent] = useState<any>(null);
  const { toast } = useToast();
  const { i18n } = useTranslation();

  // Detect content when dialog opens
  const handleOpenDialog = async () => {
    setIsOpen(true);
    
    if (!recordId) {
      // Try to detect content from current page
      const detected = await PageTranslationService.detectPageContent(pageKey, pageType);
      if (detected) {
        setDetectedContent(detected);
        setRecordId(detected.recordId);
      }
    }

    // Load translation status for all languages
    if (recordId) {
      const status: Record<string, string> = {};
      for (const lang of SUPPORTED_LANGUAGES) {
        const langStatus = await PageTranslationService.getTranslationStatus(
          pageType,
          recordId,
          lang.code
        );
        status[lang.code] = Object.keys(langStatus).length > 0 ? 'completed' : 'none';
      }
      setTranslationStatus(status);
    }
  };

  const [recordIdState, setRecordId] = useState(recordId);
  const currentRecordId = recordIdState || recordId;

  const handleTranslate = async () => {
    if (!selectedLanguage || !currentRecordId) {
      toast({
        title: "Error",
        description: "Please select a language and ensure content is detected",
        variant: "destructive"
      });
      return;
    }

    setIsTranslating(true);
    
    try {
      const success = await PageTranslationService.translatePageContent({
        pageKey,
        pageType,
        recordId: currentRecordId,
        targetLanguage: selectedLanguage,
        sourceLanguage: 'en'
      });

      if (success) {
        toast({
          title: "Translation Complete",
          description: `Content has been translated to ${SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.name}`,
        });

        // Update status
        setTranslationStatus(prev => ({
          ...prev,
          [selectedLanguage]: 'completed'
        }));

        setSelectedLanguage('');
      } else {
        throw new Error('Translation failed');
      }
    } catch (error) {
      console.error('Translation error:', error);
      toast({
        title: "Translation Failed",
        description: "There was an error translating the content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Translated</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">Not Translated</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={className}
          onClick={handleOpenDialog}
        >
          <Languages className="h-4 w-4 mr-2" />
          Translate Page
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Translate Page Content</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Content Detection Status */}
          {detectedContent && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800">
                ✓ Content detected: {Object.keys(detectedContent.content).length} translatable fields
              </p>
            </div>
          )}

          {/* Translation Status Overview */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Translation Status</h4>
            {SUPPORTED_LANGUAGES.map(lang => (
              <div key={lang.code} className="flex items-center justify-between p-2 border rounded-md">
                <div className="flex items-center gap-2">
                  {getStatusIcon(translationStatus[lang.code])}
                  <span className="text-sm font-medium">{lang.nativeName}</span>
                </div>
                {getStatusBadge(translationStatus[lang.code])}
              </div>
            ))}
          </div>

          {/* Language Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Language to Translate</label>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Choose target language" />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_LANGUAGES.map(lang => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <div className="flex items-center gap-2">
                      <span>{lang.nativeName}</span>
                      {translationStatus[lang.code] === 'completed' && (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleTranslate}
              disabled={!selectedLanguage || isTranslating || !currentRecordId}
              className="flex-1"
            >
              {isTranslating ? 'Translating...' : 'Translate Content'}
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </div>

          {/* Progress indicator */}
          {isTranslating && (
            <div className="space-y-2">
              <Progress value={undefined} className="w-full" />
              <p className="text-xs text-muted-foreground text-center">
                Translating content using AI...
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminTranslateButton;