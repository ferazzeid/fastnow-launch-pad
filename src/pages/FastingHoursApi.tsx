
import React, { useEffect } from 'react';
import { AppContentService } from '@/services/AppContentService';

const FastingHoursApi = () => {
  useEffect(() => {
    // Force initialize sample data
    AppContentService.createSampleData();
    
    // Small delay to ensure data is saved
    setTimeout(() => {
      // Get fasting hours data and format it for the app
      const fastingHours = AppContentService.getAllFastingHours();
      
      // Transform the data to match the app's expected format
      const apiData = {
        slots: fastingHours.map(hour => ({
          hour: hour.hour,
          day: hour.day,
          title: hour.title,
          bodyState: hour.bodyState,
          commonFeelings: hour.commonFeelings,
          encouragement: hour.encouragement,
          motivatorTags: hour.motivatorTags,
          difficulty: hour.difficulty,
          phase: hour.phase
        }))
      };
      
      // Set content type and return JSON
      const jsonResponse = JSON.stringify(apiData, null, 2);
      
      // For demonstration, show the JSON in the browser safely
      const preElement = document.createElement('pre');
      preElement.style.fontFamily = 'monospace';
      preElement.style.whiteSpace = 'pre-wrap';
      preElement.style.padding = '20px';
      preElement.textContent = jsonResponse;
      document.body.innerHTML = '';
      document.body.appendChild(preElement);
      
      // Set proper headers for API response
      if (typeof window !== 'undefined') {
        document.title = 'Fasting Hours API - JSON Data';
      }
    }, 100);
  }, []);

  return (
    <div style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', padding: '20px' }}>
      Loading fasting hours API data...
    </div>
  );
};

export default FastingHoursApi;
