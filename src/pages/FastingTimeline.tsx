
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from "@/components/ui/use-toast";
import MainNavigation from '@/components/MainNavigation';
import EditableTimelineSection from '@/components/fasting/EditableTimelineSection';

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
    } else {
      // Initialize empty data for all 72 hours
      const initialData = Array.from({ length: 72 }, (_, i) => ({
        hour: i + 1,
        content: ''
      }));
      setTimelineData(initialData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    }
  }, []);
  
  const updateHourContent = (hour: number, content: string) => {
    const updatedData = timelineData.map(entry => 
      entry.hour === hour ? { ...entry, content } : entry
    );
    setTimelineData(updatedData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    toast({
      title: "Timeline Updated",
      description: `Hour ${hour} content has been saved.`,
    });
  };

  // Group data by days (24-hour sections)
  const groupedData = Array.from({ length: 3 }, (_, dayIndex) => {
    return {
      day: dayIndex + 1,
      entries: timelineData.filter(entry => 
        entry.hour > dayIndex * 24 && entry.hour <= (dayIndex + 1) * 24
      ).sort((a, b) => a.hour - b.hour)
    };
  });

  return (
    <>
      <Helmet>
        <title>Fasting Timeline | Understanding What Happens During Your Fast</title>
        <meta name="description" content="Discover what happens in your body hour by hour during fasting, from 0 to 72 hours." />
      </Helmet>
      
      <MainNavigation />
      
      <div className="container mx-auto py-16 px-4 max-w-5xl">
        <header className="mb-16 text-center">
          <h1 className="text-4xl font-bold mb-6 text-[#6A8D74]">Fasting Timeline</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover what happens in your body during each hour of fasting, from the first hour to a complete 72-hour fast.
          </p>
        </header>
        
        <div className="fasting-timeline space-y-8">
          {groupedData.map(({ day, entries }) => (
            <EditableTimelineSection 
              key={day}
              dayNumber={day} 
              entries={entries}
              isAdmin={isAdmin}
              onUpdateContent={updateHourContent}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default FastingTimeline;
