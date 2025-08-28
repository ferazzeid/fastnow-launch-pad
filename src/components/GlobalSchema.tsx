import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { SchemaService } from '@/services/SchemaService';

const GlobalSchema: React.FC = () => {
  const [organizationSchema, setOrganizationSchema] = React.useState<any>(null);
  const [websiteSchema, setWebsiteSchema] = React.useState<any>(null);

  useEffect(() => {
    const loadSchema = async () => {
      try {
        const [orgSchema, siteSchema] = await Promise.all([
          SchemaService.generateOrganizationSchema(),
          SchemaService.generateWebSiteSchema()
        ]);
        
        setOrganizationSchema(orgSchema);
        setWebsiteSchema(siteSchema);
      } catch (error) {
        console.error('Error loading global schema:', error);
      }
    };

    loadSchema();
  }, []);

  return (
    <Helmet>
      {organizationSchema && (
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
      )}
      {websiteSchema && (
        <script type="application/ld+json">
          {JSON.stringify(websiteSchema)}
        </script>
      )}
    </Helmet>
  );
};

export default GlobalSchema;