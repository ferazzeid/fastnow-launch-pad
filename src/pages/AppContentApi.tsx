
import React, { useEffect } from 'react';
import { AppContentService } from '@/services/AppContentService';

const AppContentApi = () => {
  useEffect(() => {
    // Serve the JSON data
    const apiData = AppContentService.getAppContentApiData();
    
    // Set content type and return JSON
    const jsonResponse = JSON.stringify(apiData, null, 2);
    
    // For demonstration, show the JSON in the browser
    document.body.innerHTML = `<pre style="font-family: monospace; white-space: pre-wrap; padding: 20px;">${jsonResponse}</pre>`;
    
    // Set proper headers for API response
    if (typeof window !== 'undefined') {
      document.title = 'App Content API - JSON Data';
    }
  }, []);

  return (
    <div style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', padding: '20px' }}>
      Loading app content API data...
    </div>
  );
};

export default AppContentApi;
