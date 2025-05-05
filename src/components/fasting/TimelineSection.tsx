
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Clock } from "lucide-react";
import { type TimelineEntry } from '@/pages/FastingTimeline';

interface TimelineSectionProps {
  dayNumber: number;
  entries: TimelineEntry[];
}

const TimelineSection: React.FC<TimelineSectionProps> = ({ dayNumber, entries }) => {
  return (
    <section className="timeline-day">
      <div className="sticky top-0 z-10 bg-background pt-4 pb-2">
        <h2 className="text-2xl font-bold text-[#6A8D74] flex items-center">
          <span className="bg-[#A3D9B1] text-white h-8 w-8 rounded-full flex items-center justify-center text-sm mr-3">
            {dayNumber}
          </span>
          Day {dayNumber} <span className="text-muted-foreground ml-2 font-normal">({(dayNumber - 1) * 24 + 1}-{dayNumber * 24} hours)</span>
        </h2>
        <Separator className="mt-4 bg-[#A3D9B1]" />
      </div>
      
      <div className="pl-4 border-l-2 border-[#A3D9B1] mt-6">
        {entries.map((entry) => (
          <div key={entry.hour} className="relative mb-12">
            <div className="absolute -left-[17px] bg-background p-1">
              <div className="h-6 w-6 rounded-full bg-[#F2F0E6] border border-[#A3D9B1] flex items-center justify-center">
                <Clock className="h-3 w-3 text-[#6A8D74]" />
              </div>
            </div>
            <Card className="ml-6 transition-all hover:shadow-md">
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-2 text-[#6A8D74] flex items-center">
                  Hour {entry.hour}
                </h3>
                <p className="text-muted-foreground">{entry.content}</p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TimelineSection;
