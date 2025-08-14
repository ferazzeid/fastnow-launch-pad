import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Search } from "lucide-react";

interface SeoSectionEditorProps {
  metaTitle: string;
  setMetaTitle: (value: string) => void;
  metaDescription: string;
  setMetaDescription: (value: string) => void;
  isIndexed: boolean;
  setIsIndexed: (value: boolean) => void;
  pageName: string;
}

const SeoSectionEditor: React.FC<SeoSectionEditorProps> = ({
  metaTitle,
  setMetaTitle,
  metaDescription,
  setMetaDescription,
  isIndexed,
  setIsIndexed,
  pageName
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search size={20} />
          SEO Settings - {pageName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="meta-title">Meta Title</Label>
          <Input
            id="meta-title"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            placeholder={`${pageName} - FastNow`}
            maxLength={60}
          />
          <p className="text-sm text-muted-foreground mt-1">
            {metaTitle.length}/60 characters - Appears in search results and browser tabs
          </p>
        </div>

        <div>
          <Label htmlFor="meta-description">Meta Description</Label>
          <Textarea
            id="meta-description"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            placeholder={`Learn more about ${pageName.toLowerCase()}`}
            maxLength={160}
            rows={3}
          />
          <p className="text-sm text-muted-foreground mt-1">
            {metaDescription.length}/160 characters - Appears in search result descriptions
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="indexed"
            checked={isIndexed}
            onCheckedChange={setIsIndexed}
          />
          <Label htmlFor="indexed">
            Allow search engines to index this page
          </Label>
        </div>
      </CardContent>
    </Card>
  );
};

export default SeoSectionEditor;