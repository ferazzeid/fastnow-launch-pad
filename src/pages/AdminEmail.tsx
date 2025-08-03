import React from 'react';
import { Helmet } from 'react-helmet-async';
import EmailSettings from '@/components/admin/EmailSettings';

const AdminEmail = () => {
  return (
    <div className="container py-8">
      <Helmet>
        <title>Email Settings | Admin</title>
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Email Settings</h1>
          <p className="text-muted-foreground mt-2">
            Configure contact form email delivery and API integration.
          </p>
        </div>

        <EmailSettings />
      </div>
    </div>
  );
};

export default AdminEmail;