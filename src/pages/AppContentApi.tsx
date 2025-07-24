
import React, { useEffect } from 'react';
import { AppContentService } from '@/services/AppContentService';

const AppContentApi = () => {
  useEffect(() => {
    // Initialize sample data if needed
    AppContentService.createSampleData();
    
    // Serve the JSON data
    const apiData = AppContentService.getAppContentApiData();
    
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
