import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wand2, Copy } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface MarkdownFormattingHelperProps {
  onFormattedContentChange: (content: string) => void;
}

const MarkdownFormattingHelper: React.FC<MarkdownFormattingHelperProps> = ({ onFormattedContentChange }) => {
  const [inputText, setInputText] = React.useState('');
  const [formattedText, setFormattedText] = React.useState('');

  const formatContent = () => {
    if (!inputText.trim()) {
      toast.error('Please enter some content to format');
      return;
    }

    // Simple auto-formatting rules
    let formatted = inputText;

    // Convert paragraph breaks (double line breaks) to proper markdown
    formatted = formatted.replace(/\n\s*\n/g, '\n\n');

    // Auto-detect potential headings (lines that are short and followed by content)
    const lines = formatted.split('\n');
    const processedLines: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const nextLine = i + 1 < lines.length ? lines[i + 1].trim() : '';
      
      // Skip empty lines
      if (!line) {
        processedLines.push('');
        continue;
      }

      // Auto-detect headings based on patterns
      if (
        line.length < 60 && // Short line
        !line.endsWith('.') && // Doesn't end with period
        !line.includes(',') && // No commas (likely not a sentence)
        nextLine && // Has content after
        nextLine.length > line.length && // Next line is longer
        !line.startsWith('#') // Not already a heading
      ) {
        // Make it a heading based on context
        if (i === 0 || (i > 0 && !lines[i-1].trim())) {
          processedLines.push(`## ${line}`); // H2 for main sections
        } else {
          processedLines.push(`### ${line}`); // H3 for subsections
        }
      } else {
        processedLines.push(line);
      }
    }

    formatted = processedLines.join('\n');

    // Convert common patterns to markdown
    // Bold text (words in ALL CAPS or surrounded by asterisks)
    formatted = formatted.replace(/\b([A-Z]{3,})\b/g, '**$1**');
    
    // Convert bullet points
    formatted = formatted.replace(/^[-•*]\s+/gm, '- ');
    formatted = formatted.replace(/^\d+\.\s+/gm, (match, offset, string) => {
      const lineStart = string.lastIndexOf('\n', offset) + 1;
      const lineNumber = (string.substring(0, offset).match(/^\d+\.\s+/gm) || []).length + 1;
      return `${lineNumber}. `;
    });

    // Clean up excessive line breaks
    formatted = formatted.replace(/\n{3,}/g, '\n\n');
    
    // Trim and ensure proper spacing
    formatted = formatted.trim();

    setFormattedText(formatted);
  };

  const applyFormatting = () => {
    if (formattedText) {
      onFormattedContentChange(formattedText);
      toast.success('Formatted content applied to editor');
    }
  };

  const copyToClipboard = () => {
    if (formattedText) {
      navigator.clipboard.writeText(formattedText);
      toast.success('Formatted content copied to clipboard');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Wand2 className="w-4 h-4 mr-2" />
          Format Pasted Content
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Markdown Formatting Helper</DialogTitle>
          <DialogDescription>
            Paste your content here and get it automatically formatted for the Markdown editor.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-[60vh] overflow-hidden">
          {/* Input */}
          <Card className="flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Original Content</CardTitle>
              <CardDescription className="text-xs">
                Paste your unformatted text here
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 p-3">
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste your content here..."
                className="h-full min-h-[300px] resize-none"
              />
            </CardContent>
          </Card>

          {/* Output */}
          <Card className="flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Formatted Markdown</CardTitle>
              <CardDescription className="text-xs">
                Auto-formatted content ready for the editor
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 p-3">
              <Textarea
                value={formattedText}
                onChange={(e) => setFormattedText(e.target.value)}
                placeholder="Formatted content will appear here..."
                className="h-full min-h-[300px] resize-none font-mono text-sm"
              />
            </CardContent>
          </Card>
        </div>

        {/* Formatting Guide */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Auto-Formatting Rules</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium mb-1">Headings:</p>
                <p>• Short lines followed by longer content become headings</p>
                <p>• Use # Main Title, ## Section, ### Subsection manually</p>
              </div>
              <div>
                <p className="font-medium mb-1">Text Formatting:</p>
                <p>• **bold text** or ALL CAPS → **bold**</p>
                <p>• *italic text* → *italic*</p>
              </div>
              <div>
                <p className="font-medium mb-1">Lists:</p>
                <p>• Bullet points: - item or * item</p>
                <p>• Numbered: 1. item, 2. item</p>
              </div>
              <div>
                <p className="font-medium mb-1">Other:</p>
                <p>• Double line breaks create paragraphs</p>
                <p>• Quote text with &gt; for blockquotes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={formatContent}>
            <Wand2 className="w-4 h-4 mr-2" />
            Auto-Format Content
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={copyToClipboard} disabled={!formattedText}>
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
            <Button onClick={applyFormatting} disabled={!formattedText}>
              Apply to Editor
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MarkdownFormattingHelper;