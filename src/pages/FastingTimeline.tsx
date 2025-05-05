
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import MainNavigation from '@/components/MainNavigation';
import TimelineSection from '@/components/fasting/TimelineSection';
import CSVUploader from '@/components/fasting/CSVUploader';
import { Download } from 'lucide-react';

export interface TimelineEntry {
  hour: number;
  content: string;
}

const STORAGE_KEY = 'fastingApp_timelineData';

const FastingTimeline = () => {
  const [timelineData, setTimelineData] = useState<TimelineEntry[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Check if user is authenticated as admin on mount
  useEffect(() => {
    const authStatus = localStorage.getItem('fastingApp_auth');
    setIsAdmin(authStatus === 'true');
    
    // Load timeline data from localStorage if available
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setTimelineData(parsedData);
      } catch (error) {
        console.error('Failed to parse saved timeline data:', error);
      }
    }
  }, []);
  
  const handleDataUpload = (data: TimelineEntry[]) => {
    setTimelineData(data);
    // Save to localStorage for persistence
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    toast({
      title: "Timeline data uploaded",
      description: `${data.length} hours of fasting timeline data has been loaded and saved.`,
    });
  };

  const handleDownloadTemplateCSV = () => {
    // Create a link to download the template CSV file
    const link = document.createElement('a');
    link.href = '/fasting-timeline-template.csv';
    link.download = 'fasting-timeline-template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Group data by 24-hour sections
  const groupedData = timelineData.reduce((acc, entry) => {
    const dayIndex = Math.floor((entry.hour - 1) / 24);
    if (!acc[dayIndex]) acc[dayIndex] = [];
    acc[dayIndex].push(entry);
    return acc;
  }, [] as TimelineEntry[][]);

  return (
    <>
      <Helmet>
        <title>Fasting Timeline | Understanding What Happens During Your Fast</title>
        <meta name="description" content="Discover what happens in your body hour by hour during fasting, from 0 to 72 hours." />
      </Helmet>
      
      <MainNavigation />
      
      <div className="container mx-auto py-12 px-4 max-w-6xl">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 text-[#6A8D74]">Fasting Timeline</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover what happens in your body during each hour of fasting, from the first hour to a complete 72-hour fast.
          </p>
        </header>
        
        {isAdmin && (
          <Card className="mb-8 p-6">
            <h2 className="text-xl font-semibold mb-4">Upload Timeline Data</h2>
            <p className="mb-4 text-muted-foreground">
              Upload a CSV file with hour numbers (1-72) and corresponding body changes to populate the timeline.
            </p>
            <div className="space-y-4">
              <CSVUploader onDataUploaded={handleDataUpload} />
              <div className="flex items-center mt-4">
                <Button 
                  variant="outline" 
                  onClick={handleDownloadTemplateCSV} 
                  className="flex items-center gap-2"
                >
                  <Download size={16} />
                  Download Template CSV
                </Button>
              </div>
            </div>
          </Card>
        )}
        
        {groupedData.length > 0 ? (
          <div className="fasting-timeline space-y-12">
            {groupedData.map((dayData, dayIndex) => (
              <TimelineSection 
                key={dayIndex} 
                dayNumber={dayIndex + 1} 
                entries={dayData}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#F2F0E6] rounded-lg border border-[#A3D9B1]">
            <h3 className="text-xl font-medium text-[#6A8D74] mb-4">No Timeline Data Yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {isAdmin ? (
                "Upload a CSV file with your fasting timeline data to visualize the hour-by-hour changes."
              ) : (
                "The timeline data has not been uploaded by an administrator yet."
              )}
            </p>
            {isAdmin && (
              <Button variant="outline" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                Upload Data
              </Button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default FastingTimeline;
