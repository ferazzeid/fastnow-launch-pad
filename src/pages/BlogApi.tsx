
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
