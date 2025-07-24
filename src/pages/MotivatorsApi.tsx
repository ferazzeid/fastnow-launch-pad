
import React, { useEffect } from 'react';
import { AppContentService } from '@/services/AppContentService';

const MotivatorsApi = () => {
  useEffect(() => {
    // Force initialize sample data
    AppContentService.createSampleData();
    
    // Small delay to ensure data is saved
    setTimeout(() => {
      // Serve the motivators JSON data
      const apiData = AppContentService.getMotivatorsApiData();
      
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
        document.title = 'Motivators API - JSON Data';
      }
    }, 100);
  }, []);

  return (
    <div style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', padding: '20px' }}>
      Loading motivators API data...
    </div>
  );
};

export default MotivatorsApi;
