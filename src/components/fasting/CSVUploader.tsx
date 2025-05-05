
import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/use-toast";
import { TimelineEntry } from '@/pages/FastingTimeline';

interface CSVUploaderProps {
  onDataUploaded: (data: TimelineEntry[]) => void;
}

const CSVUploader: React.FC<CSVUploaderProps> = ({ onDataUploaded }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processCSV = (text: string): TimelineEntry[] => {
    try {
      // Split the text by newline and filter out empty lines
      const rows = text.split('\n').filter(row => row.trim() !== '');
      
      // Extract data from each row (comma or tab separated)
      const entries = rows.map(row => {
        const parts = row.includes(',') ? row.split(',') : row.split('\t');
        const hour = parseInt(parts[0].trim(), 10);
        const content = parts[1]?.trim() || '';
        
        if (isNaN(hour) || hour < 1 || hour > 72) {
          throw new Error(`Invalid hour value: ${parts[0]}. Hours must be between 1 and 72.`);
        }
        
        return { hour, content };
      });
      
      // Sort entries by hour
      return entries.sort((a, b) => a.hour - b.hour);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to process CSV file. Please check the format.');
      }
      return [];
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    setError(null);
    
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const data = processCSV(text);
        
        if (data.length > 0 && !error) {
          onDataUploaded(data);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred while processing the file.');
        }
        toast({
          variant: "destructive",
          title: "Upload failed",
          description: "There was an error processing your CSV file.",
        });
      } finally {
        setIsUploading(false);
      }
    };
    
    reader.onerror = () => {
      setError('Failed to read the file.');
      setIsUploading(false);
      toast({
        variant: "destructive",
        title: "File read error",
        description: "Failed to read the uploaded file.",
      });
    };
    
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <Input
          type="file"
          accept=".csv,.txt"
          onChange={handleFileChange}
          ref={fileInputRef}
          disabled={isUploading}
          className="max-w-md"
        />
        <Button 
          variant="outline" 
          onClick={() => fileInputRef.current?.click()} 
          disabled={isUploading}
        >
          {isUploading ? "Processing..." : "Upload CSV"}
        </Button>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="text-sm text-muted-foreground">
        <p className="font-medium">CSV Format:</p>
        <p>Column A: Hour number (1-72)</p>
        <p>Column B: Description of what happens in the body</p>
        <p className="italic mt-1">Example: 1,Insulin levels begin to drop</p>
      </div>
    </div>
  );
};

export default CSVUploader;
