
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Clock, Edit, Save } from "lucide-react";
import { type TimelineEntry } from '@/pages/FastingTimeline';

interface EditableTimelineSectionProps {
  dayNumber: number;
  entries: TimelineEntry[];
  isAdmin: boolean;
  onUpdateContent: (hour: number, content: string) => void;
}

const EditableTimelineSection: React.FC<EditableTimelineSectionProps> = ({ 
  dayNumber, 
  entries, 
  isAdmin,
  onUpdateContent 
}) => {
  const [editingHour, setEditingHour] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  
  const handleEdit = (entry: TimelineEntry) => {
    setEditingHour(entry.hour);
    setEditContent(entry.content);
  };
  
  const handleSave = () => {
    if (editingHour !== null) {
      onUpdateContent(editingHour, editContent);
      setEditingHour(null);
    }
  };

  return (
    <section className="timeline-day mb-20">
      <div className="sticky top-0 z-10 bg-background pt-6 pb-4">
        <div className="flex items-center">
          <div className="bg-[#A3D9B1] text-white h-12 w-12 rounded-xl flex items-center justify-center text-xl font-semibold shadow-md mr-4">
            {dayNumber}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#6A8D74]">
              Day {dayNumber}
            </h2>
            <p className="text-sm text-muted-foreground">
              Hours {(dayNumber - 1) * 24 + 1}-{dayNumber * 24}
            </p>
          </div>
        </div>
        <Separator className="mt-6 bg-[#A3D9B1] h-1 rounded-full" />
      </div>
      
      <div className="pl-6 border-l-2 border-[#A3D9B1] mt-8">
        {entries.map((entry) => (
          <div key={entry.hour} className="relative mb-12">
            <div className="absolute -left-[21px] bg-background p-2">
              <div className="h-8 w-8 rounded-full bg-[#F2F0E6] border-2 border-[#A3D9B1] flex items-center justify-center shadow-md">
                <Clock className="h-4 w-4 text-[#6A8D74]" />
              </div>
            </div>
            <Card className="ml-6 transition-all hover:shadow-md">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium mb-2 text-[#6A8D74] flex items-center">
                    Hour {entry.hour}
                  </h3>
                  {isAdmin && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEdit(entry)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit hour {entry.hour}</span>
                    </Button>
                  )}
                </div>
                <p className="text-muted-foreground">
                  {entry.content || (
                    <span className="italic text-muted-foreground/60">
                      {isAdmin ? "Click edit to add content" : "No content for this hour yet"}
                    </span>
                  )}
                </p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editingHour !== null} onOpenChange={(open) => !open && setEditingHour(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Hour {editingHour}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Describe what happens in the body during this hour of fasting..."
              className="min-h-[150px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingHour(null)}>Cancel</Button>
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default EditableTimelineSection;
