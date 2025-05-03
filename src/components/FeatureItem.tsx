
import React from 'react';

interface FeatureItemProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const FeatureItem: React.FC<FeatureItemProps> = ({ title, description, icon }) => {
  return (
    <div className="flex flex-col items-center text-center p-6">
      <div className="bg-secondary rounded-full p-4 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};
