
import React, { useEffect } from 'react';
import { BlogApiService } from '@/services/BlogApiService';

const BlogApi = () => {
  useEffect(() => {
    // Serve the JSON data
    const apiData = BlogApiService.getBlogApiData();
    
    // Set content type and return JSON
    const jsonResponse = JSON.stringify(apiData, null, 2);
    
    // Create a blob and download link for the JSON data
    const blob = new Blob([jsonResponse], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // For demonstration, we'll show the JSON in the browser
    document.body.innerHTML = `<pre style="font-family: monospace; white-space: pre-wrap; padding: 20px;">${jsonResponse}</pre>`;
    
    // Set proper headers for API response
    if (typeof window !== 'undefined') {
      document.title = 'Blog API - JSON Data';
    }
  }, []);

  return (
    <div style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', padding: '20px' }}>
      Loading blog API data...
    </div>
  );
};

export default BlogApi;
