
import React, { useEffect } from 'react';
import { AppContentService } from '@/services/AppContentService';

const FastingSlotsApi = () => {
  useEffect(() => {
    // Serve the fasting slots JSON data
    const apiData = AppContentService.getFastingSlotsApiData();
    
    // Set content type and return JSON
    const jsonResponse = JSON.stringify(apiData, null, 2);
    
    // For demonstration, show the JSON in the browser
    document.body.innerHTML = `<pre style="font-family: monospace; white-space: pre-wrap; padding: 20px;">${jsonResponse}</pre>`;
    
    // Set proper headers for API response
    if (typeof window !== 'undefined') {
      document.title = 'Fasting Slots API - JSON Data';
    }
  }, []);

  return (
    <div style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', padding: '20px' }}>
      Loading fasting slots API data...
    </div>
  );
};

export default FastingSlotsApi;
