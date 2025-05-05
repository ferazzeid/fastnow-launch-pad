
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from "@/components/ui/use-toast";
import EditableTimelineSection from '@/components/fasting/EditableTimelineSection';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

export interface TimelineEntry {
  hour: number;
  content: string;  // Keep for backward compatibility
  whatsHappening: string;
  howYoureFeeling: string;
  hourTitle?: string; // Field for content under fasting hour heading
}

const STORAGE_KEY = 'fastingApp_timelineData';

const FastingTimeline = () => {
  const [timelineData, setTimelineData] = useState<TimelineEntry[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [metaTitle, setMetaTitle] = useState(
    localStorage.getItem('fastingApp_fastingTimelineTitle') || 'Fasting Timeline | Understanding What Happens During Your Fast'
  );
  const [metaDescription, setMetaDescription] = useState(
    localStorage.getItem('fastingApp_fastingTimelineDescription') || 'Discover what happens in your body hour by hour during fasting, from 0 to 72 hours.'
  );
  
  const importTimelineData = async () => {
    try {
      // Fetch the CSV file
      const response = await fetch('/fasting-timeline-template.csv');
      const csvText = await response.text();
      
      // Parse the CSV data (skipping the header row)
      const rows = csvText.split('\n').slice(1).filter(row => row.trim() !== '');
      
      // Create timeline entries from CSV data
      const importedData = rows.map(row => {
        // Split by comma but respect quotes
        const match = row.match(/(\d+),("([^"]*)"|(.*?)),("([^"]*)"|(.*?)),("([^"]*)"|(.*?))(,|$)/);
        
        if (!match) {
          console.error('Could not parse row:', row);
          return null;
        }
        
        const hour = parseInt(match[1]);
        const whatsHappening = match[3] || match[4];
        const howYoureFeeling = match[6] || match[7];
        const hourTitle = match[9] || match[10]; // Tagline becomes the hourTitle
        
        return {
          hour,
          content: whatsHappening, // For backward compatibility
          whatsHappening,
          howYoureFeeling,
          hourTitle
        };
      }).filter(entry => entry !== null) as TimelineEntry[];
      
      // Update state and save to localStorage
      setTimelineData(importedData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(importedData));
      
      toast({
        title: "Timeline Data Imported",
        description: `Successfully imported ${importedData.length} hours of timeline data.`
      });
    } catch (error) {
      console.error('Error importing timeline data:', error);
      toast({
        title: "Import Failed",
        description: "There was an error importing the timeline data.",
        variant: "destructive"
      });
    }
  };
  
  // Check if user is authenticated as admin on mount
  useEffect(() => {
    const authStatus = localStorage.getItem('fastingApp_auth');
    setIsAdmin(authStatus === 'true');
    
    // Load timeline data from localStorage if available
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        
        // If parsed data doesn't have the new fields, migrate it
        const updatedData = parsedData.map((entry: any) => ({
          ...entry,
          whatsHappening: entry.whatsHappening || entry.content || '',
          howYoureFeeling: entry.howYoureFeeling || '',
          hourTitle: entry.hourTitle || '',
        }));
        
        setTimelineData(updatedData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
      } catch (error) {
        console.error('Failed to parse saved timeline data:', error);
      }
    } else {
      // Initialize empty data for all 73 hours (including hour 0)
      const initialData = Array.from({ length: 73 }, (_, i) => ({
        hour: i,
        content: '',
        whatsHappening: '',
        howYoureFeeling: '',
        hourTitle: '',
      }));
      setTimelineData(initialData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    }
  }, []);
  
  const updateHourContent = (hour: number, whatsHappening: string, howYoureFeeling: string, hourTitle: string) => {
    const updatedData = timelineData.map(entry => 
      entry.hour === hour ? { 
        ...entry, 
        content: whatsHappening, // Update legacy content field for backward compatibility
        whatsHappening, 
        howYoureFeeling,
        hourTitle 
      } : entry
    );
    setTimelineData(updatedData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    toast({
      title: "Timeline Updated",
      description: `Hour ${hour} content has been saved.`,
    });
  };

  // Group data by days (24-hour sections), now including hour 0
  const groupedData = Array.from({ length: 4 }, (_, dayIndex) => {
    return {
      day: dayIndex + (dayIndex === 0 ? 0 : 1), // First group is "Hour 0", others are Day 1, 2, 3
      entries: timelineData.filter(entry => 
        dayIndex === 0 
          ? entry.hour === 0 
          : (entry.hour > (dayIndex - 1) * 24 && entry.hour <= dayIndex * 24)
      ).sort((a, b) => a.hour - b.hour)
    };
  });

  return (
    <PageLayout>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
      </Helmet>
      
      <div className="container mx-auto py-16 px-4 max-w-5xl">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold mb-6 text-[#6A8D74]">Fasting Timeline</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover what happens in your body during each hour of fasting, from the first hour to a complete 72-hour fast.
          </p>
          
          {isAdmin && (
            <div className="mt-8">
              <Button 
                variant="outline" 
                onClick={importTimelineData} 
                className="gap-2"
              >
                <Calendar className="h-4 w-4" />
                Import Timeline Data from CSV
              </Button>
            </div>
          )}
        </div>
        
        <div className="fasting-timeline space-y-8">
          {groupedData.map(({ day, entries }) => (
            <EditableTimelineSection 
              key={day === 0 ? 'hour-0' : `day-${day}`}
              dayNumber={day} 
              entries={entries}
              isAdmin={isAdmin}
              onUpdateContent={updateHourContent}
            />
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default FastingTimeline;
