
import React, { useEffect } from 'react';
import { AppContentService } from '@/services/AppContentService';

const FastingHoursApi = () => {
  useEffect(() => {
    // Serve the fasting hours JSON data
    const apiData = AppContentService.getFastingHoursApiData();
    
    // Set content type and return JSON
    const jsonResponse = JSON.stringify(apiData, null, 2);
    
    // For demonstration, show the JSON in the browser
    document.body.innerHTML = `<pre style="font-family: monospace; white-space: pre-wrap; padding: 20px;">${jsonResponse}</pre>`;
    
    // Set proper headers for API response
    if (typeof window !== 'undefined') {
      document.title = 'Fasting Hours API - JSON Data';
    }
  }, []);

  return (
    <div style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', padding: '20px' }}>
      Loading fasting hours API data...
    </div>
  );
};

export default FastingHoursApi;
