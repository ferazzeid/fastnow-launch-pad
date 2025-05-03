
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';

const PagesSettings: React.FC = () => {
  const navigate = useNavigate();
  
  const handleNavigate = (path: string) => {
    navigate(path);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Pages</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid sm:grid-cols-3 gap-4">
          <Button variant="outline" onClick={() => handleNavigate("/admin/privacy")}>
            Edit Privacy Policy
          </Button>
          <Button variant="outline" onClick={() => handleNavigate("/admin/terms")}>
            Edit Terms of Service
          </Button>
          <Button variant="outline" onClick={() => handleNavigate("/admin/contact")}>
            Edit Contact Page
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PagesSettings;
