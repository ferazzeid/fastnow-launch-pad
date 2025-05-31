
import React, { useEffect, useState } from 'react';
import { FastingTimelineApiService } from '@/services/FastingTimelineApiService';

const FastingTimelineApi = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const apiData = FastingTimelineApiService.getFastingTimelineApiData();
    setData(apiData);
  }, []);

  // Set proper JSON headers
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Type';
    meta.content = 'application/json';
    document.head.appendChild(meta);

    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  // Return raw JSON
  return (
    <pre style={{ margin: 0, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
      {JSON.stringify(data, null, 2)}
    </pre>
  );
};

export default FastingTimelineApi;
